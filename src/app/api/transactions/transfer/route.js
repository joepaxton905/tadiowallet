import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Wallet from '@/models/Wallet'
import Transaction from '@/models/Transaction'
import { verifyToken } from '@/lib/auth'
import mongoose from 'mongoose'
import { sendTransferSentEmail, sendTransferReceivedEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

// ============================================================================
// GET - Validate Recipient Address (including Broker Wallets)
// ============================================================================
export async function GET(request) {
  let brokerConnection = null
  
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
      return NextResponse.json(
        { success: false, error: 'Address is required' },
        { status: 400 }
      )
    }

    await connectDB()

    // 1️⃣ Check in MAIN database first
    const mainUser = await User.findOne({
      $or: [
        { 'wallets.btc.address': address },
        { 'wallets.btc.legacyAddress': address },
        { 'wallets.eth.address': address },
        { 'wallets.usdt_trc20.address': address }
      ]
    })

    if (mainUser) {
      // Found in main database
      let walletInfo = {}
      
      if (mainUser.wallets.btc?.address === address || mainUser.wallets.btc?.legacyAddress === address) {
        walletInfo = { symbol: 'BTC', currency: 'Bitcoin', network: 'Bitcoin Mainnet' }
      } else if (mainUser.wallets.eth?.address === address) {
        walletInfo = { symbol: 'ETH', currency: 'Ethereum', network: 'Ethereum Mainnet' }
      } else if (mainUser.wallets.usdt_trc20?.address === address) {
        walletInfo = { symbol: 'USDT', currency: 'Tether', network: 'Tron (TRC20)' }
      }

      return NextResponse.json({
        success: true,
        isValid: true,
        recipient: {
          name: mainUser.name,
          address: address,
          isBroker: false,
          ...walletInfo
        }
      })
    }

    // 2️⃣ Check in BROKER database
    const BROKER_WALLET_URI = process.env.BROKER_WALLET_URI || 'mongodb+srv://maverickandretti:samuellucky12@cluster0.hbqidou.mongodb.net/'
    
    console.log('🔍 Checking broker database for address:', address)
    
    brokerConnection = await mongoose.createConnection(BROKER_WALLET_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    }).asPromise()

    const BrokerUserModel = brokerConnection.model('User', new mongoose.Schema({}, { strict: false }), 'users')

    const brokerUser = await BrokerUserModel.findOne({
      $or: [
        { 'wallets.btc.address': address },
        { 'wallets.btc.legacyAddress': address },
        { 'wallets.eth.address': address },
        { 'wallets.usdt_trc20.address': address }
      ]
    })

    if (brokerUser) {
      console.log('✅ Found in broker database:', brokerUser.name)
      
      let walletInfo = {}
      
      if (brokerUser.wallets?.btc?.address === address || brokerUser.wallets?.btc?.legacyAddress === address) {
        walletInfo = { symbol: 'BTC', currency: 'Bitcoin', network: 'Bitcoin Mainnet' }
      } else if (brokerUser.wallets?.eth?.address === address) {
        walletInfo = { symbol: 'ETH', currency: 'Ethereum', network: 'Ethereum Mainnet' }
      } else if (brokerUser.wallets?.usdt_trc20?.address === address) {
        walletInfo = { symbol: 'USDT', currency: 'Tether', network: 'Tron (TRC20)' }
      }

      return NextResponse.json({
        success: true,
        isValid: true,
        recipient: {
          name: brokerUser.name,
          address: address,
          isBroker: true,
          ...walletInfo
        }
      })
    }

    // Not found in either database
    return NextResponse.json({
      success: true,
      isValid: false,
      error: 'Wallet address not found'
    })

  } catch (error) {
    console.error('❌ Error validating address:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to validate address', details: error.message },
      { status: 500 }
    )
  } finally {
    if (brokerConnection) {
      await brokerConnection.close()
    }
  }
}

// ============================================================================
// POST - Execute Transfer (Main User → Main User OR Main User → Broker)
// ============================================================================
export async function POST(request) {
  let brokerConnection = null
  let session = null

  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { recipientAddress, asset, amount, notes } = body

    // Validate required fields
    if (!recipientAddress || !asset || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }

    await connectDB()

    // Get sender
    const sender = await User.findById(decoded.userId)
    if (!sender) {
      return NextResponse.json(
        { success: false, error: 'Sender not found' },
        { status: 404 }
      )
    }

    // Normalize asset symbol
    const assetSymbol = asset.toUpperCase()

    // Get sender's wallet for this asset
    const senderWallet = await Wallet.getUserWallet(decoded.userId, assetSymbol)
    
    if (!senderWallet) {
      return NextResponse.json(
        { success: false, error: `You don't have a ${assetSymbol} wallet` },
        { status: 400 }
      )
    }

    // Check sender balance
    const senderBalance = senderWallet.balance || 0
    if (senderBalance < amount) {
      return NextResponse.json(
        { success: false, error: `Insufficient balance. You have ${senderBalance} ${assetSymbol}` },
        { status: 400 }
      )
    }

    // Check if sender is sending to themselves
    if (senderWallet.address === recipientAddress) {
      return NextResponse.json(
        { success: false, error: 'Cannot send to your own wallet' },
        { status: 400 }
      )
    }

    // 🔍 Step 1: Check if recipient is in MAIN database
    const mainRecipient = await User.findOne({
      $or: [
        { 'wallets.btc.address': recipientAddress },
        { 'wallets.btc.legacyAddress': recipientAddress },
        { 'wallets.eth.address': recipientAddress },
        { 'wallets.usdt_trc20.address': recipientAddress }
      ]
    })

    if (mainRecipient) {
      // ✅ MAIN → MAIN Transfer
      console.log('💸 Processing MAIN → MAIN transfer')
      return await processMainToMainTransfer({
        sender,
        senderWallet,
        recipient: mainRecipient,
        recipientAddress,
        asset: assetSymbol,
        amount,
        notes
      })
    }

    // 🔍 Step 2: Check if recipient is in BROKER database
    const BROKER_WALLET_URI = process.env.BROKER_WALLET_URI || 'mongodb+srv://maverickandretti:samuellucky12@cluster0.hbqidou.mongodb.net/'
    
    console.log('🔍 Checking broker database...')
    
    brokerConnection = await mongoose.createConnection(BROKER_WALLET_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    }).asPromise()

    const BrokerUserModel = brokerConnection.model('User', new mongoose.Schema({}, { strict: false }), 'users')
    const BrokerTransactionModel = brokerConnection.model('Transaction', new mongoose.Schema({}, { strict: false }), 'transactions')

    const brokerRecipient = await BrokerUserModel.findOne({
      $or: [
        { 'wallets.btc.address': recipientAddress },
        { 'wallets.btc.legacyAddress': recipientAddress },
        { 'wallets.eth.address': recipientAddress },
        { 'wallets.usdt_trc20.address': recipientAddress }
      ]
    })

    if (brokerRecipient) {
      // ✅ MAIN → BROKER Transfer
      console.log('💸 Processing MAIN → BROKER transfer to:', brokerRecipient.name)
      
      // Map asset to broker's wallet key (btc, eth, usdt_trc20)
      let brokerWalletKey = assetSymbol.toLowerCase()
      if (assetSymbol === 'USDT') brokerWalletKey = 'usdt_trc20'
      
      // Start MongoDB session for atomic transaction
      session = await mongoose.startSession()
      session.startTransaction()

      try {
        // 1️⃣ Deduct from sender's wallet
        await Wallet.findByIdAndUpdate(
          senderWallet._id,
          { 
            $inc: { 
              balance: -amount 
            }
          },
          { session, new: true }
        )

        // 2️⃣ Add to broker's wallet
        await BrokerUserModel.findByIdAndUpdate(
          brokerRecipient._id,
          { 
            $inc: { 
              [`wallets.${brokerWalletKey}.balance`]: amount 
            }
          },
          { new: true }
        )

        // 3️⃣ Create "send" transaction in MAIN database
        const sendTransaction = new Transaction({
          userId: sender._id,
          type: 'send',
          asset: assetSymbol,
          assetName: getAssetName(assetSymbol),
          amount: amount,
          price: 0,
          value: 0,
          fee: 0,
          status: 'completed',
          from: senderWallet.address,
          to: recipientAddress,
          toUser: brokerRecipient.name,
          toEmail: brokerRecipient.email,
          notes: notes || `Sent to ${brokerRecipient.name} (Broker Account)`,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        await sendTransaction.save({ session })

        // 4️⃣ Create "receive" transaction in BROKER database
        const senderName = sender.firstName ? `${sender.firstName} ${sender.lastName}` : sender.name
        await BrokerTransactionModel.create([{
          userId: brokerRecipient._id,
          type: 'receive',
          asset: assetSymbol,
          assetName: getAssetName(assetSymbol),
          amount: amount,
          price: 0,
          value: 0,
          fee: 0,
          status: 'completed',
          from: senderWallet.address,
          fromUser: senderName,
          fromEmail: sender.email,
          notes: `Received from ${senderName}`,
          createdAt: new Date(),
          updatedAt: new Date()
        }])

        // Commit transaction
        await session.commitTransaction()

        // 5️⃣ Send emails
        try {
          const senderName = sender.firstName ? `${sender.firstName} ${sender.lastName}` : sender.name
          
          await sendTransferSentEmail(
            sender.email,
            senderName,
            brokerRecipient.name,
            amount,
            assetSymbol,
            recipientAddress,
            sendTransaction._id.toString()
          )

          await sendTransferReceivedEmail(
            brokerRecipient.email,
            brokerRecipient.name,
            senderName,
            amount,
            assetSymbol,
            recipientAddress
          )
        } catch (emailError) {
          console.error('❌ Email error:', emailError)
          // Don't fail the transaction if email fails
        }

        return NextResponse.json({
          success: true,
          transaction: {
            id: sendTransaction._id,
            type: 'send',
            asset: assetSymbol,
            amount: amount,
            recipient: brokerRecipient.name,
            recipientAddress: recipientAddress,
            isBrokerTransfer: true,
            status: 'completed',
            createdAt: sendTransaction.createdAt
          }
        })

      } catch (error) {
        await session.abortTransaction()
        throw error
      }
    }

    // ❌ Recipient not found in either database
    return NextResponse.json(
      { success: false, error: 'Recipient wallet not found' },
      { status: 404 }
    )

  } catch (error) {
    console.error('❌ Transfer error:', error)
    if (session) {
      await session.abortTransaction()
    }
    return NextResponse.json(
      { success: false, error: 'Transfer failed', details: error.message },
      { status: 500 }
    )
  } finally {
    if (session) {
      session.endSession()
    }
    if (brokerConnection) {
      await brokerConnection.close()
    }
  }
}

// ============================================================================
// Helper: Process MAIN → MAIN Transfer
// ============================================================================
async function processMainToMainTransfer({ sender, senderWallet, recipient, recipientAddress, asset, amount, notes }) {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    // Get recipient's wallet
    const recipientWallet = await Wallet.getUserWallet(recipient._id, asset)
    if (!recipientWallet) {
      throw new Error(`Recipient doesn't have a ${asset} wallet`)
    }

    // 1️⃣ Deduct from sender
    await Wallet.findByIdAndUpdate(
      senderWallet._id,
      { 
        $inc: { 
          balance: -amount 
        }
      },
      { session, new: true }
    )

    // 2️⃣ Add to recipient
    await Wallet.findByIdAndUpdate(
      recipientWallet._id,
      { 
        $inc: { 
          balance: amount 
        }
      },
      { session, new: true }
    )

    // 3️⃣ Create "send" transaction
    const sendTransaction = new Transaction({
      userId: sender._id,
      type: 'send',
      asset: asset,
      assetName: getAssetName(asset),
      amount: amount,
      price: 0,
      value: 0,
      fee: 0,
      status: 'completed',
      from: senderWallet.address,
      to: recipientAddress,
      toUser: recipient.firstName ? `${recipient.firstName} ${recipient.lastName}` : recipient.name,
      toEmail: recipient.email,
      notes: notes || `Sent to ${recipient.firstName ? `${recipient.firstName} ${recipient.lastName}` : recipient.name}`,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    await sendTransaction.save({ session })

    // 4️⃣ Create "receive" transaction
    const receiveTransaction = new Transaction({
      userId: recipient._id,
      type: 'receive',
      asset: asset,
      assetName: getAssetName(asset),
      amount: amount,
      price: 0,
      value: 0,
      fee: 0,
      status: 'completed',
      from: senderWallet.address,
      fromUser: sender.firstName ? `${sender.firstName} ${sender.lastName}` : sender.name,
      fromEmail: sender.email,
      notes: `Received from ${sender.firstName ? `${sender.firstName} ${sender.lastName}` : sender.name}`,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    await receiveTransaction.save({ session })

    await session.commitTransaction()

    // 5️⃣ Send emails
    try {
      const senderName = sender.firstName ? `${sender.firstName} ${sender.lastName}` : sender.name
      const recipientName = recipient.firstName ? `${recipient.firstName} ${recipient.lastName}` : recipient.name
      
      await sendTransferSentEmail(
        sender.email,
        senderName,
        recipientName,
        amount,
        asset,
        recipientAddress,
        sendTransaction._id.toString()
      )

      await sendTransferReceivedEmail(
        recipient.email,
        recipientName,
        senderName,
        amount,
        asset,
        recipientAddress
      )
    } catch (emailError) {
      console.error('❌ Email error:', emailError)
    }

    return NextResponse.json({
      success: true,
      transaction: {
        id: sendTransaction._id,
        type: 'send',
        asset: asset,
        amount: amount,
        recipient: recipient.name,
        recipientAddress: recipientAddress,
        isBrokerTransfer: false,
        status: 'completed',
        createdAt: sendTransaction.createdAt
      }
    })

  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

// ============================================================================
// Helper: Get Asset Name
// ============================================================================
function getAssetName(symbol) {
  const assetNames = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'USDT': 'Tether',
    'SOL': 'Solana',
    'BNB': 'Binance Coin',
    'XRP': 'Ripple',
    'ADA': 'Cardano',
    'DOGE': 'Dogecoin',
    'DOT': 'Polkadot',
    'MATIC': 'Polygon'
  }
  return assetNames[symbol] || symbol
}
