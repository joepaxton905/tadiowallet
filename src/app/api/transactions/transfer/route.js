import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Transaction from '@/models/Transaction'
import Portfolio from '@/models/Portfolio'
import Wallet from '@/models/Wallet'
import User from '@/models/User'
import Notification from '@/models/Notification'
import { verifyToken } from '@/lib/auth'
import { queueStatsUpdate } from '@/lib/updateUserStats'
import { getSimplePrices } from '@/lib/crypto'
import mongoose from 'mongoose'

const { sendTransferSentEmail, sendTransferReceivedEmail } = require('@/lib/email')

export const dynamic = 'force-dynamic'

// Supported assets for internal transfers
const SUPPORTED_ASSETS = ['USDT', 'BTC', 'ETH', 'BNB', 'SOL', 'XRP']

// Minimum transfer amounts (to prevent dust attacks and spam)
const MIN_TRANSFER_AMOUNTS = {
  'BTC': 0.0001,    // ~$4 at $40k
  'ETH': 0.001,     // ~$2 at $2k
  'USDT': 1,        // $1
  'BNB': 0.01,      // ~$3 at $300
  'SOL': 0.01,      // ~$1 at $100
  'XRP': 1,         // ~$0.60 at $0.60
}

/**
 * POST /api/transactions/transfer
 * Transfer cryptocurrency from one user to another
 * 
 * Body:
 * - recipientAddress: Wallet address of recipient
 * - asset: Symbol of the cryptocurrency (e.g., 'BTC', 'ETH')
 * - amount: Amount to transfer
 * - notes: Optional notes for the transaction
 */
export async function POST(request) {
  const session = await mongoose.startSession()
  
  try {
    // Get auth token from header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    await connectDB()

    const body = await request.json()
    const { recipientAddress, asset, amount, notes } = body

    // Validate required fields
    if (!recipientAddress || !asset || !amount) {
      return NextResponse.json(
        { success: false, error: 'Recipient address, asset, and amount are required' },
        { status: 400 }
      )
    }

    // Validate asset is supported
    const assetSymbol = asset.toUpperCase()
    if (!SUPPORTED_ASSETS.includes(assetSymbol)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Asset ${assetSymbol} is not supported for internal transfers. Supported assets: ${SUPPORTED_ASSETS.join(', ')}` 
        },
        { status: 400 }
      )
    }

    // Validate amount
    const transferAmount = parseFloat(amount)
    if (isNaN(transferAmount) || transferAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Amount must be greater than zero' },
        { status: 400 }
      )
    }

    // Validate precision (max 8 decimal places for crypto)
    const decimalPlaces = (transferAmount.toString().split('.')[1] || '').length
    if (decimalPlaces > 8) {
      return NextResponse.json(
        { success: false, error: 'Amount cannot have more than 8 decimal places' },
        { status: 400 }
      )
    }

    // Validate minimum transfer amount
    const minAmount = MIN_TRANSFER_AMOUNTS[assetSymbol] || 0.00000001
    if (transferAmount < minAmount) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Minimum transfer amount for ${assetSymbol} is ${minAmount} ${assetSymbol}` 
        },
        { status: 400 }
      )
    }

    const senderId = decoded.userId

    // Start transaction session
    session.startTransaction()

    try {
      // 1. Find recipient by wallet address
      const recipientWallet = await Wallet.findOne({ 
        address: recipientAddress,
        symbol: assetSymbol 
      }).session(session)

      if (!recipientWallet) {
        await session.abortTransaction()
        return NextResponse.json(
          { success: false, error: 'Recipient wallet not found for this asset' },
          { status: 404 }
        )
      }

      const recipientId = recipientWallet.userId

      // Check if trying to send to self
      if (senderId.toString() === recipientId.toString()) {
        await session.abortTransaction()
        return NextResponse.json(
          { success: false, error: 'Cannot send to your own wallet' },
          { status: 400 }
        )
      }

      // 2. Check sender's balance
      const senderPortfolio = await Portfolio.findOne({ 
        userId: senderId, 
        symbol: assetSymbol 
      }).session(session)

      if (!senderPortfolio) {
        await session.abortTransaction()
        return NextResponse.json(
          { 
            success: false, 
            error: `You don't have any ${assetSymbol} in your portfolio. Please buy some first.` 
          },
          { status: 400 }
        )
      }

      if (senderPortfolio.holdings < transferAmount) {
        await session.abortTransaction()
        return NextResponse.json(
          { 
            success: false, 
            error: `Insufficient balance. You have ${senderPortfolio.holdings.toFixed(8)} ${assetSymbol}, trying to send ${transferAmount.toFixed(8)} ${assetSymbol}` 
          },
          { status: 400 }
        )
      }

      // Check if user is trying to send exact balance (leave small buffer for UI display)
      const remainingBalance = senderPortfolio.holdings - transferAmount
      if (remainingBalance > 0 && remainingBalance < 0.00000001) {
        await session.abortTransaction()
        return NextResponse.json(
          { 
            success: false, 
            error: 'Amount would leave a dust balance. Please send your full balance or leave a meaningful amount.' 
          },
          { status: 400 }
        )
      }

      // 3. Get sender and recipient user details
      const [sender, recipient] = await Promise.all([
        User.findById(senderId).session(session),
        User.findById(recipientId).session(session)
      ])

      if (!sender || !recipient) {
        await session.abortTransaction()
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        )
      }

      // Get sender's wallet for the 'from' field
      const senderWallet = await Wallet.findOne({
        userId: senderId,
        symbol: assetSymbol,
        isDefault: true
      }).session(session)

      // 4. Get asset details and real-time price
      const assetDetails = getAssetDetails(assetSymbol)

      // Fetch real-time price from market data
      let currentPrice = 0
      try {
        const priceData = await getSimplePrices([assetSymbol])
        currentPrice = priceData[0]?.price || 0
      } catch (error) {
        console.error('Error fetching price, using fallback:', error)
        currentPrice = getFallbackPrice(assetSymbol)
      }

      if (currentPrice === 0) {
        await session.abortTransaction()
        return NextResponse.json(
          { success: false, error: 'Unable to fetch current market price. Please try again.' },
          { status: 503 }
        )
      }

      const transactionValue = transferAmount * currentPrice
      
      // Calculate network fee (0.1% of transaction value, min $0.01, max $10)
      const feePercentage = 0.001 // 0.1%
      const calculatedFee = transactionValue * feePercentage
      const networkFee = Math.max(0.01, Math.min(10, calculatedFee))

      // 5. Update portfolios
      // Deduct from sender
      await Portfolio.findOneAndUpdate(
        { userId: senderId, symbol: assetSymbol },
        { $inc: { holdings: -transferAmount } },
        { session, new: true }
      )

      // Add to recipient (or create if doesn't exist)
      const recipientPortfolio = await Portfolio.findOne({ 
        userId: recipientId, 
        symbol: assetSymbol 
      }).session(session)

      if (recipientPortfolio) {
        await Portfolio.findOneAndUpdate(
          { userId: recipientId, symbol: assetSymbol },
          { $inc: { holdings: transferAmount } },
          { session, new: true }
        )
      } else {
        await Portfolio.create([{
          userId: recipientId,
          symbol: assetSymbol,
          holdings: transferAmount,
          averageBuyPrice: 0
        }], { session })
      }

      // 6. Create transaction records
      const timestamp = new Date()

      // Sender's transaction (send)
      const senderTransaction = await Transaction.create([{
        userId: senderId,
        type: 'send',
        asset: assetSymbol,
        assetName: assetDetails.name,
        assetIcon: assetDetails.icon,
        assetColor: assetDetails.color,
        amount: transferAmount,
        price: currentPrice,
        value: transactionValue,
        fee: networkFee,
        status: 'completed',
        to: recipientAddress,
        notes: notes || `Sent to ${recipient.firstName} ${recipient.lastName}`,
        createdAt: timestamp,
        updatedAt: timestamp
      }], { session })

      // Recipient's transaction (receive)
      const recipientTransaction = await Transaction.create([{
        userId: recipientId,
        type: 'receive',
        asset: assetSymbol,
        assetName: assetDetails.name,
        assetIcon: assetDetails.icon,
        assetColor: assetDetails.color,
        amount: transferAmount,
        price: currentPrice,
        value: transactionValue,
        fee: 0, // Recipient doesn't pay fee
        status: 'completed',
        from: senderWallet?.address || 'Unknown',
        notes: notes || `Received from ${sender.firstName} ${sender.lastName}`,
        createdAt: timestamp,
        updatedAt: timestamp
      }], { session })

      // 7. Create notifications
      await Promise.all([
        // Notify sender
        Notification.create([{
          userId: senderId,
          type: 'transaction',
          title: 'Transfer Sent',
          message: `You sent ${transferAmount} ${assetSymbol} to ${recipient.firstName} ${recipient.lastName}`,
          metadata: {
            transactionId: senderTransaction[0]._id,
            type: 'send',
            amount: transferAmount,
            asset: assetSymbol,
            recipient: recipient.email
          }
        }], { session }),
        
        // Notify recipient
        Notification.create([{
          userId: recipientId,
          type: 'transaction',
          title: 'Transfer Received',
          message: `You received ${transferAmount} ${assetSymbol} from ${sender.firstName} ${sender.lastName}`,
          metadata: {
            transactionId: recipientTransaction[0]._id,
            type: 'receive',
            amount: transferAmount,
            asset: assetSymbol,
            sender: sender.email
          }
        }], { session })
      ])

      // Commit the transaction
      await session.commitTransaction()

      // Update stats for both users (non-blocking)
      queueStatsUpdate(senderId)
      queueStatsUpdate(recipientId)

      // Send email notifications (non-blocking)
      // Don't await these - send in background
      sendTransferSentEmail({
        recipientEmail: sender.email,
        recipientName: `${sender.firstName} ${sender.lastName}`,
        senderName: `${sender.firstName} ${sender.lastName}`,
        amount: transferAmount,
        asset: assetSymbol,
        assetName: assetDetails.name,
        value: transactionValue,
        fee: networkFee,
        recipientAddress,
      }).catch(error => {
        console.error('Error sending transfer sent email:', error)
      })

      sendTransferReceivedEmail({
        recipientEmail: recipient.email,
        recipientName: `${recipient.firstName} ${recipient.lastName}`,
        senderName: `${sender.firstName} ${sender.lastName}`,
        amount: transferAmount,
        asset: assetSymbol,
        assetName: assetDetails.name,
        value: transactionValue,
        senderAddress: senderWallet?.address || 'Unknown',
      }).catch(error => {
        console.error('Error sending transfer received email:', error)
      })

      return NextResponse.json({
        success: true,
        message: 'Transfer completed successfully',
        transaction: senderTransaction[0],
        recipient: {
          name: `${recipient.firstName} ${recipient.lastName}`,
          email: recipient.email
        }
      }, { status: 200 })

    } catch (error) {
      // Rollback on error
      await session.abortTransaction()
      throw error
    }

  } catch (error) {
    console.error('Transfer error:', error)
    
    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0]
      return NextResponse.json(
        { success: false, error: firstError.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to process transfer' 
      },
      { status: 500 }
    )
  } finally {
    session.endSession()
  }
}

/**
 * GET /api/transactions/transfer/validate
 * Validate recipient address and get recipient info
 */
export async function GET(request) {
  try {
    // Get auth token from header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')
    const asset = searchParams.get('asset')

    if (!address || !asset) {
      return NextResponse.json(
        { success: false, error: 'Address and asset are required' },
        { status: 400 }
      )
    }

    // Find wallet by address and asset
    const wallet = await Wallet.findOne({ 
      address,
      symbol: asset.toUpperCase() 
    })

    if (!wallet) {
      return NextResponse.json(
        { success: false, error: 'Wallet not found' },
        { status: 404 }
      )
    }

    // Check if it's the user's own wallet
    if (wallet.userId.toString() === decoded.userId) {
      return NextResponse.json(
        { success: false, error: 'Cannot send to your own wallet' },
        { status: 400 }
      )
    }

    // Get user info
    const user = await User.findById(wallet.userId)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      valid: true,
      recipient: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        address: wallet.address
      }
    })

  } catch (error) {
    console.error('Validate address error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to validate address' },
      { status: 500 }
    )
  }
}

// Helper function to get asset details
function getAssetDetails(symbol) {
  const assetMap = {
    'BTC': { name: 'Bitcoin', icon: '₿', color: '#F7931A' },
    'ETH': { name: 'Ethereum', icon: 'Ξ', color: '#627EEA' },
    'USDT': { name: 'Tether', icon: '₮', color: '#26A17B' },
    'BNB': { name: 'BNB', icon: '◆', color: '#F3BA2F' },
    'SOL': { name: 'Solana', icon: '◎', color: '#14F195' },
    'XRP': { name: 'Ripple', icon: '✕', color: '#23292F' },
    'ADA': { name: 'Cardano', icon: '₳', color: '#0033AD' },
    'DOGE': { name: 'Dogecoin', icon: 'Ð', color: '#C3A634' },
    'DOT': { name: 'Polkadot', icon: '●', color: '#E6007A' },
    'MATIC': { name: 'Polygon', icon: '◇', color: '#8247E5' },
    'AVAX': { name: 'Avalanche', icon: '▲', color: '#E84142' },
    'LINK': { name: 'Chainlink', icon: '⬡', color: '#2A5ADA' },
  }

  return assetMap[symbol] || { name: symbol, icon: '●', color: '#888888' }
}

// Helper function to get fallback price if API fails
function getFallbackPrice(symbol) {
  const fallbackPrices = {
    'BTC': 43000.00,
    'ETH': 2280.00,
    'USDT': 1.00,
    'BNB': 305.00,
    'SOL': 98.00,
    'XRP': 0.62,
  }

  return fallbackPrices[symbol] || 1.00
}

