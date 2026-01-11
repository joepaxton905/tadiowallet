import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Wallet from '@/models/Wallet'
import Portfolio from '@/models/Portfolio'
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

    // 1️⃣ Check in MAIN database first - Query Wallet collection
    const mainWallet = await Wallet.findOne({ address: address })

    if (mainWallet) {
      // Found wallet in main database, get the user
      const mainUser = await User.findById(mainWallet.userId)
      
      if (mainUser) {
        const userName = mainUser.firstName ? `${mainUser.firstName} ${mainUser.lastName}` : mainUser.name || mainUser.email
        
        // Map symbol to full name
        const assetNames = {
          'BTC': { currency: 'Bitcoin', network: 'Bitcoin Mainnet' },
          'ETH': { currency: 'Ethereum', network: 'Ethereum Mainnet' },
          'USDT': { currency: 'Tether', network: 'ERC-20' },
          'SOL': { currency: 'Solana', network: 'Solana Mainnet' },
          'XRP': { currency: 'Ripple', network: 'XRP Ledger' },
          'BNB': { currency: 'BNB', network: 'Binance Smart Chain' }
        }
        
        const walletInfo = assetNames[mainWallet.symbol] || { 
          currency: mainWallet.symbol, 
          network: `${mainWallet.symbol} Network` 
        }

        return NextResponse.json({
          success: true,
          isValid: true,
          recipient: {
            name: userName,
            email: mainUser.email,
            address: address,
            isBroker: false,
            symbol: mainWallet.symbol,
            ...walletInfo
          }
        })
      }
    }

    // 2️⃣ Check in BROKER database
    const BROKER_WALLET_URI = process.env.BROKER_WALLET_URI
    
    console.log('🔍 Checking broker database for address:', address)
    console.log('🔍 Broker URI:', BROKER_WALLET_URI)
    
    brokerConnection = await mongoose.createConnection(BROKER_WALLET_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      dbName: 'test' // Explicitly set database name
    }).asPromise()

    console.log('✅ Broker validation connection established, database:', brokerConnection.db.databaseName)

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
    const { recipientAddress, asset, amount, notes, price } = body

    // Validate required fields
    if (!recipientAddress || !asset || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    console.log('📊 Transfer request - Amount:', amount, asset, 'Price:', price)

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

    // Check sender balance from PORTFOLIO (not wallet)
    const senderPortfolio = await Portfolio.findOne({ 
      userId: decoded.userId, 
      symbol: assetSymbol 
    })
    
    const senderBalance = senderPortfolio?.holdings || 0
    if (senderBalance < amount) {
      return NextResponse.json(
        { success: false, error: `Insufficient balance. You have ${senderBalance} ${assetSymbol}` },
        { status: 400 }
      )
    }
    
    // Use current market price from request, or fallback to portfolio averageBuyPrice
    const currentMarketPrice = price || senderPortfolio?.averageBuyPrice || 0
    console.log('📊 Using market price:', currentMarketPrice, '(from', price ? 'request' : 'portfolio', ')')

    // Check if sender is sending to themselves
    if (senderWallet.address === recipientAddress) {
      return NextResponse.json(
        { success: false, error: 'Cannot send to your own wallet' },
        { status: 400 }
      )
    }

    // 🔍 Step 1: Check if recipient is in MAIN database - Query Wallet collection
    const recipientWallet = await Wallet.findOne({ address: recipientAddress })

    if (recipientWallet) {
      // Found wallet in main database, get the user
      const mainRecipient = await User.findById(recipientWallet.userId)
      
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
          notes,
          price: currentMarketPrice
        })
      }
    }

    // 🔍 Step 2: Check if recipient is in BROKER database
    const BROKER_WALLET_URI = process.env.BROKER_WALLET_URI
    
    console.log('🔍 Connecting to broker database:', BROKER_WALLET_URI)
    
    brokerConnection = await mongoose.createConnection(BROKER_WALLET_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      dbName: 'test' // Explicitly set database name
    }).asPromise()

    console.log('✅ Broker connection established, database:', brokerConnection.db.databaseName)

    const BrokerUserModel = brokerConnection.model('User', new mongoose.Schema({}, { strict: false }), 'users')
    const BrokerDepositModel = brokerConnection.model('Deposit', new mongoose.Schema({}, { strict: false }), 'deposits')

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
      
      // Start MongoDB session for atomic transaction (main database)
      session = await mongoose.startSession()
      session.startTransaction()

      try {
        console.log('🔄 Step 1: Deducting from sender portfolio...')
        // 1️⃣ Deduct from sender's portfolio
        const updatedSenderPortfolio = await Portfolio.findOneAndUpdate(
          { userId: sender._id, symbol: assetSymbol },
          { 
            $inc: { 
              holdings: -amount 
            }
          },
          { session, new: true }
        )
        console.log('✅ Sender portfolio updated:', updatedSenderPortfolio?.holdings)

        console.log('🔄 Step 2: Adding to broker wallet balance AND total balance...')
        console.log('   Broker ID:', brokerRecipient._id)
        console.log('   Wallet key:', brokerWalletKey)
        console.log('   Current wallet balance:', brokerRecipient.wallets?.[brokerWalletKey]?.balance)
        console.log('   Current total balance (USD):', brokerRecipient.balance?.total)
        console.log('   Adding crypto amount:', amount)
        
        // Calculate USD value for balance.total
        // Priority 1: Use market price from sender's transaction (passed via currentMarketPrice)
        // Priority 2: Try broker's wallet price
        // Priority 3: Use fallback estimates
        let currentPrice = currentMarketPrice || brokerRecipient.wallets?.[brokerWalletKey]?.price || 0
        
        console.log('   Market price from sender:', currentMarketPrice)
        console.log('   Raw price from broker wallet:', brokerRecipient.wallets?.[brokerWalletKey]?.price)
        
        // If price not found, use rough estimates as last resort
        if (!currentPrice || currentPrice === 0) {
          const priceEstimates = {
            'BTC': 50000,
            'ETH': 3000,
            'USDT': 1,
            'SOL': 100,
            'BNB': 300,
            'XRP': 0.5,
            'ADA': 0.5,
            'DOGE': 0.1,
            'DOT': 7,
            'MATIC': 0.8
          }
          currentPrice = priceEstimates[assetSymbol] || 0
          console.log('   ⚠️  WARNING: Using estimated price (no real price found!)')
        }
        
        // Use parseFloat and round to 2 decimal places for USD precision
        const cryptoAmount = parseFloat(amount)
        const price = parseFloat(currentPrice)
        const usdValue = parseFloat((cryptoAmount * price).toFixed(2))
        
        console.log('   Asset price (USD):', price)
        console.log('   Crypto amount:', cryptoAmount)
        console.log('   Calculation:', cryptoAmount, 'x', price, '=', cryptoAmount * price)
        console.log('   USD value to add (rounded):', usdValue)
        
        if (usdValue === 0) {
          console.warn('⚠️  WARNING: USD value is 0! Price might not be set correctly.')
          console.warn('   This means balance.total will not increase!')
        }
        
        console.log('')
        console.log('   MATH CHECK:')
        console.log('   Current total balance:', brokerRecipient.balance?.total || 0)
        console.log('   Adding USD value:', usdValue)
        console.log('   Should become:', (brokerRecipient.balance?.total || 0) + usdValue)
        
        // 2️⃣ Add to broker's wallet balance (crypto) AND balance.total (USD)
        const updatedBrokerUser = await BrokerUserModel.findByIdAndUpdate(
          brokerRecipient._id,
          { 
            $inc: { 
              [`wallets.${brokerWalletKey}.balance`]: amount,  // Crypto amount
              'balance.total': usdValue  // ← USD VALUE!
            }
          },
          { 
            new: true,
            writeConcern: { w: 'majority', wtimeout: 5000 }
          }
        )
        
        if (!updatedBrokerUser) {
          throw new Error('Failed to update broker wallet balance - user not found')
        }
        
        console.log('✅ Broker balances updated!')
        console.log('   New wallet balance (crypto):', updatedBrokerUser?.wallets?.[brokerWalletKey]?.balance)
        console.log('   New total balance (USD):', updatedBrokerUser?.balance?.total)
        console.log('   Full balance object:', JSON.stringify(updatedBrokerUser?.balance, null, 2))

        console.log('🔄 Step 3: Creating send transaction in MAIN database...')
        
        // Calculate transaction fee (0.1% of value, min $0.01, max $10)
        const transactionValue = usdValue
        const feePercentage = 0.001 // 0.1%
        const calculatedFee = transactionValue * feePercentage
        const transactionFee = Math.max(0.01, Math.min(10, calculatedFee))
        
        // 3️⃣ Create "send" transaction in MAIN database
        const sendTransaction = new Transaction({
          userId: sender._id,
          type: 'send',
          asset: assetSymbol,
          assetName: getAssetName(assetSymbol),
          amount: amount,
          price: currentPrice,
          value: transactionValue,
          fee: transactionFee,
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
        console.log('✅ Send transaction created in MAIN:', sendTransaction._id)
        console.log('   Price:', currentPrice, 'Value:', transactionValue, 'Fee:', transactionFee)

        console.log('🔄 Step 4: Creating deposit record in BROKER database...')
        console.log('   Using database:', brokerConnection.db.databaseName)
        console.log('   Using collection: deposits')
        
        // Create deposit record matching broker schema
        const senderName = sender.firstName ? `${sender.firstName} ${sender.lastName}` : sender.name
        
        // Use already calculated values from Step 2 (cryptoAmount, price, usdValue)
        console.log('   Using calculated values - Crypto:', cryptoAmount, 'Price:', price, 'USD:', usdValue)
        
        // Build deposit data matching the broker schema structure
        const now = new Date()
        const brokerDepositData = {
          userId: brokerRecipient._id,
          userEmail: brokerRecipient.email,
          amount: usdValue,
          method: 'crypto',
          status: 'completed',
          cryptoDetails: {
            currency: assetSymbol,
            transactionHash: null, // No blockchain transaction hash for internal transfer
            confirmations: 0
          },
          ipAddress: null, // Not available in transfer context
          userAgent: null, // Not available in transfer context
          createdAt: now,
          updatedAt: now,
          __v: 0,
          processingCompletedAt: now,
          reviewedAt: now
        }
        
        console.log('📝 Broker deposit data:', JSON.stringify(brokerDepositData, null, 2))
        
        // Create the deposit with explicit writeConcern
        let brokerDeposit
        try {
          brokerDeposit = await BrokerDepositModel.create(brokerDepositData)
          console.log('✅ Raw deposit creation result:', brokerDeposit)
        } catch (createError) {
          console.error('❌ Error creating deposit:', createError)
          throw new Error(`Failed to create broker deposit: ${createError.message}`)
        }
        
        const brokerDepositId = brokerDeposit._id || brokerDeposit[0]?._id
        
        if (!brokerDepositId) {
          console.error('❌ No deposit ID returned after creation!')
          console.error('   brokerDeposit:', brokerDeposit)
          throw new Error('Failed to create broker deposit - no ID returned')
        }
        
        console.log('✅ Deposit record created in BROKER with ID:', brokerDepositId)

        // Commit main database transaction
        console.log('🔄 Step 5: Committing main database transaction...')
        await session.commitTransaction()
        console.log('✅ Main database transaction committed')

        // Verify broker deposit was created
        console.log('🔄 Step 6: Verifying broker deposit...')
        const verifyBrokerDeposit = await BrokerDepositModel.findById(brokerDepositId)
        
        if (verifyBrokerDeposit) {
          console.log('✅ BROKER DEPOSIT VERIFIED in database!')
          console.log('   Database:', brokerConnection.db.databaseName)
          console.log('   Collection: deposits')
          console.log('   Deposit ID:', verifyBrokerDeposit._id)
          console.log('   User ID:', verifyBrokerDeposit.userId)
          console.log('   User Email:', verifyBrokerDeposit.userEmail)
          console.log('   Amount (USD):', verifyBrokerDeposit.amount)
          console.log('   Method:', verifyBrokerDeposit.method)
          console.log('   Status:', verifyBrokerDeposit.status)
          console.log('   Crypto Details:', JSON.stringify(verifyBrokerDeposit.cryptoDetails, null, 2))
          console.log('   Processing Completed At:', verifyBrokerDeposit.processingCompletedAt)
          console.log('   Reviewed At:', verifyBrokerDeposit.reviewedAt)
        } else {
          console.error('❌ BROKER DEPOSIT NOT FOUND IN DATABASE!')
          console.error('   Searched in database:', brokerConnection.db.databaseName)
          console.error('   Searched in collection: deposits')
          console.error('   Searched for ID:', brokerDepositId)
          
          // Try direct database query
          console.log('🔄 Trying direct database query...')
          const directQuery = await brokerConnection.db.collection('deposits').findOne({ _id: brokerDepositId })
          if (directQuery) {
            console.log('✅ Found via direct query:', directQuery)
          } else {
            console.error('❌ Not found via direct query either')
          }
          
          throw new Error('Broker deposit verification failed')
        }
        
        // Also verify broker balance was updated
        console.log('🔄 Step 7: Verifying broker balance...')
        const verifyBrokerUser = await BrokerUserModel.findById(brokerRecipient._id)
        console.log('✅ Broker user balances verified:')
        console.log('   User:', verifyBrokerUser.name)
        console.log('   Wallet balance (crypto):', verifyBrokerUser.wallets?.[brokerWalletKey]?.balance, assetSymbol)
        console.log('   Total balance (USD):', '$' + verifyBrokerUser.balance?.total)
        console.log('   Full balance object:', JSON.stringify(verifyBrokerUser.balance, null, 2))
        console.log('')
        console.log('📊 SUMMARY:')
        console.log('   Crypto transferred:', amount, assetSymbol)
        console.log('   USD value:', '$' + usdValue)
        console.log('   Broker wallet balance updated: +', amount, assetSymbol)
        console.log('   Broker total balance updated: +$', usdValue)
        console.log('   Broker deposit record created in "deposits" collection ✅')

        // 5️⃣ Send emails
        try {
          const senderName = sender.firstName ? `${sender.firstName} ${sender.lastName}` : sender.name
          
          await sendTransferSentEmail({
            recipientEmail: sender.email,
            recipientName: senderName,
            senderName: senderName,
            amount: amount,
            asset: assetSymbol,
            assetName: getAssetName(assetSymbol),
            value: transactionValue,
            fee: transactionFee,
            recipientAddress: recipientAddress
          })

          await sendTransferReceivedEmail({
            recipientEmail: brokerRecipient.email,
            recipientName: brokerRecipient.name,
            senderName: senderName,
            amount: amount,
            asset: assetSymbol,
            assetName: getAssetName(assetSymbol),
            value: transactionValue,
            senderAddress: senderWallet.address,
            isBroker: true
          })
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
async function processMainToMainTransfer({ sender, senderWallet, recipient, recipientAddress, asset, amount, notes, price }) {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    // Get recipient's wallet
    const recipientWallet = await Wallet.getUserWallet(recipient._id, asset)
    if (!recipientWallet) {
      throw new Error(`Recipient doesn't have a ${asset} wallet`)
    }

    // Get sender's portfolio to get the price
    const senderPortfolio = await Portfolio.findOne({ 
      userId: sender._id, 
      symbol: asset 
    })
    
    // Use passed price or fallback to portfolio's averageBuyPrice
    const currentPrice = price || senderPortfolio?.averageBuyPrice || 0
    
    // Calculate transaction value and fee
    const transactionValue = parseFloat((amount * currentPrice).toFixed(2))
    const feePercentage = 0.001 // 0.1%
    const calculatedFee = transactionValue * feePercentage
    const transactionFee = Math.max(0.01, Math.min(10, calculatedFee))

    // 1️⃣ Deduct from sender's portfolio
    await Portfolio.findOneAndUpdate(
      { userId: sender._id, symbol: asset },
      { 
        $inc: { 
          holdings: -amount 
        }
      },
      { session, new: true }
    )

    // 2️⃣ Add to recipient's portfolio (create if doesn't exist)
    const existingRecipientPortfolio = await Portfolio.findOne({ 
      userId: recipient._id, 
      symbol: asset 
    })
    
    if (existingRecipientPortfolio) {
      // Update existing portfolio
      await Portfolio.findOneAndUpdate(
        { userId: recipient._id, symbol: asset },
        { 
          $inc: { 
            holdings: amount 
          }
        },
        { session, new: true }
      )
    } else {
      // Create new portfolio entry with default averageBuyPrice of 0 for received transfers
      await Portfolio.create([{
        userId: recipient._id,
        symbol: asset,
        holdings: amount,
        averageBuyPrice: 0 // Received transfers have no cost basis
      }], { session })
    }

    // 3️⃣ Create "send" transaction
    const sendTransaction = new Transaction({
      userId: sender._id,
      type: 'send',
      asset: asset,
      assetName: getAssetName(asset),
      amount: amount,
      price: currentPrice,
      value: transactionValue,
      fee: transactionFee,
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
      price: currentPrice,
      value: transactionValue,
      fee: 0, // Recipient doesn't pay the fee
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
      
      await sendTransferSentEmail({
        recipientEmail: sender.email,
        recipientName: senderName,
        senderName: senderName,
        amount: amount,
        asset: asset,
        assetName: getAssetName(asset),
        value: transactionValue,
        fee: transactionFee,
        recipientAddress: recipientAddress
      })

      await sendTransferReceivedEmail({
        recipientEmail: recipient.email,
        recipientName: recipientName,
        senderName: senderName,
        amount: amount,
        asset: asset,
        assetName: getAssetName(asset),
        value: transactionValue,
        senderAddress: senderWallet.address
      })
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
