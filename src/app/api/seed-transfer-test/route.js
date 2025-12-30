import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Portfolio from '@/models/Portfolio'
import Wallet from '@/models/Wallet'
import UserStats from '@/models/UserStats'
import { generateUserWallets } from '@/lib/walletGenerator'

export const dynamic = 'force-dynamic'

/**
 * Creates TWO test users with crypto balances for testing transfers
 * 
 * User 1 (Alice - Sender):
 * - Email: alice@test.com
 * - Password: Test1234
 * - Has: 2 BTC, 20 ETH, 200 SOL, 10000 USDT, 5 BNB, 1000 XRP
 * 
 * User 2 (Bob - Recipient):
 * - Email: bob@test.com
 * - Password: Test1234
 * - Has: 0.5 BTC, 5 ETH, 50 SOL, 1000 USDT, 1 BNB, 100 XRP
 */
export async function GET() {
  try {
    await connectDB()

    // Check if users already exist
    const existingAlice = await User.findOne({ email: 'alice@test.com' })
    const existingBob = await User.findOne({ email: 'bob@test.com' })
    
    if (existingAlice && existingBob) {
      return NextResponse.json({
        success: false,
        message: 'Test accounts already exist!',
        instructions: {
          alice: {
            email: 'alice@test.com',
            password: 'Test1234',
            role: 'Sender (has lots of crypto)'
          },
          bob: {
            email: 'bob@test.com',
            password: 'Test1234',
            role: 'Recipient (has some crypto)'
          }
        },
        nextSteps: [
          '1. Login as Alice: alice@test.com / Test1234',
          '2. Go to Dashboard → Receive',
          '3. Select BTC and copy Bob\'s wallet address',
          '4. Logout and login as Bob',
          '5. Go to Dashboard → Send',
          '6. Paste Alice\'s BTC address',
          '7. Enter amount (e.g., 0.5 BTC)',
          '8. Confirm transfer',
          '',
          'OR delete both users from MongoDB and run this endpoint again'
        ]
      }, { status: 200 })
    }

    // Create Alice (Sender)
    console.log('👤 Creating Alice...')
    const alice = await User.create({
      firstName: 'Alice',
      lastName: 'Sender',
      email: 'alice@test.com',
      password: 'Test1234',
      agreedToTerms: true,
      termsAgreedAt: new Date(),
      preferences: {
        currency: 'USD',
        language: 'en',
        timezone: 'UTC',
        notifications: {
          email: true,
          priceAlerts: true,
          transactionAlerts: true,
          marketing: false,
        },
      },
    })

    // Create Bob (Recipient)
    console.log('👤 Creating Bob...')
    const bob = await User.create({
      firstName: 'Bob',
      lastName: 'Receiver',
      email: 'bob@test.com',
      password: 'Test1234',
      agreedToTerms: true,
      termsAgreedAt: new Date(),
      preferences: {
        currency: 'USD',
        language: 'en',
        timezone: 'UTC',
        notifications: {
          email: true,
          priceAlerts: true,
          transactionAlerts: true,
          marketing: false,
        },
      },
    })

    // Generate wallets for both users
    console.log('🔑 Generating wallets for Alice...')
    const aliceWallets = await generateUserWallets()
    
    console.log('🔑 Generating wallets for Bob...')
    const bobWallets = await generateUserWallets()

    // Create wallet records for Alice
    await Promise.all([
      Wallet.create({
        userId: alice._id,
        symbol: 'BTC',
        address: aliceWallets.btc.address,
        privateKey: aliceWallets.btc.privateKey,
        seedPhrase: aliceWallets.seedPhrase,
        label: 'Bitcoin Wallet',
        network: 'mainnet',
        isDefault: true,
      }),
      Wallet.create({
        userId: alice._id,
        symbol: 'ETH',
        address: aliceWallets.eth.address,
        privateKey: aliceWallets.eth.privateKey,
        seedPhrase: aliceWallets.seedPhrase,
        label: 'Ethereum Wallet',
        network: 'mainnet',
        isDefault: true,
      }),
      Wallet.create({
        userId: alice._id,
        symbol: 'USDT',
        address: aliceWallets.usdt.address,
        privateKey: aliceWallets.usdt.privateKey,
        seedPhrase: aliceWallets.seedPhrase,
        label: 'USDT Wallet',
        network: 'mainnet',
        isDefault: true,
      }),
      Wallet.create({
        userId: alice._id,
        symbol: 'SOL',
        address: aliceWallets.sol.address,
        privateKey: aliceWallets.sol.privateKey,
        seedPhrase: aliceWallets.seedPhrase,
        label: 'Solana Wallet',
        network: 'mainnet',
        isDefault: true,
      }),
      Wallet.create({
        userId: alice._id,
        symbol: 'XRP',
        address: aliceWallets.xrp.address,
        privateKey: aliceWallets.xrp.privateKey,
        seedPhrase: aliceWallets.seedPhrase,
        label: 'XRP Wallet',
        network: 'mainnet',
        isDefault: true,
      }),
      Wallet.create({
        userId: alice._id,
        symbol: 'BNB',
        address: aliceWallets.bnb.address,
        privateKey: aliceWallets.bnb.privateKey,
        seedPhrase: aliceWallets.seedPhrase,
        label: 'BNB Wallet',
        network: 'mainnet',
        isDefault: true,
      }),
    ])

    // Create wallet records for Bob
    await Promise.all([
      Wallet.create({
        userId: bob._id,
        symbol: 'BTC',
        address: bobWallets.btc.address,
        privateKey: bobWallets.btc.privateKey,
        seedPhrase: bobWallets.seedPhrase,
        label: 'Bitcoin Wallet',
        network: 'mainnet',
        isDefault: true,
      }),
      Wallet.create({
        userId: bob._id,
        symbol: 'ETH',
        address: bobWallets.eth.address,
        privateKey: bobWallets.eth.privateKey,
        seedPhrase: bobWallets.seedPhrase,
        label: 'Ethereum Wallet',
        network: 'mainnet',
        isDefault: true,
      }),
      Wallet.create({
        userId: bob._id,
        symbol: 'USDT',
        address: bobWallets.usdt.address,
        privateKey: bobWallets.usdt.privateKey,
        seedPhrase: bobWallets.seedPhrase,
        label: 'USDT Wallet',
        network: 'mainnet',
        isDefault: true,
      }),
      Wallet.create({
        userId: bob._id,
        symbol: 'SOL',
        address: bobWallets.sol.address,
        privateKey: bobWallets.sol.privateKey,
        seedPhrase: bobWallets.seedPhrase,
        label: 'Solana Wallet',
        network: 'mainnet',
        isDefault: true,
      }),
      Wallet.create({
        userId: bob._id,
        symbol: 'XRP',
        address: bobWallets.xrp.address,
        privateKey: bobWallets.xrp.privateKey,
        seedPhrase: bobWallets.seedPhrase,
        label: 'XRP Wallet',
        network: 'mainnet',
        isDefault: true,
      }),
      Wallet.create({
        userId: bob._id,
        symbol: 'BNB',
        address: bobWallets.bnb.address,
        privateKey: bobWallets.bnb.privateKey,
        seedPhrase: bobWallets.seedPhrase,
        label: 'BNB Wallet',
        network: 'mainnet',
        isDefault: true,
      }),
    ])

    // Create portfolio with actual balances for Alice (SENDER - HAS LOTS)
    console.log('💰 Adding crypto balances for Alice...')
    await Portfolio.insertMany([
      { userId: alice._id, symbol: 'BTC', holdings: 2.0, averageBuyPrice: 40000 },
      { userId: alice._id, symbol: 'ETH', holdings: 20.0, averageBuyPrice: 2000 },
      { userId: alice._id, symbol: 'SOL', holdings: 200.0, averageBuyPrice: 90 },
      { userId: alice._id, symbol: 'USDT', holdings: 10000.0, averageBuyPrice: 1 },
      { userId: alice._id, symbol: 'BNB', holdings: 5.0, averageBuyPrice: 300 },
      { userId: alice._id, symbol: 'XRP', holdings: 1000.0, averageBuyPrice: 0.6 },
    ])

    // Create portfolio with some balances for Bob (RECIPIENT - HAS SOME)
    console.log('💰 Adding crypto balances for Bob...')
    await Portfolio.insertMany([
      { userId: bob._id, symbol: 'BTC', holdings: 0.5, averageBuyPrice: 42000 },
      { userId: bob._id, symbol: 'ETH', holdings: 5.0, averageBuyPrice: 2200 },
      { userId: bob._id, symbol: 'SOL', holdings: 50.0, averageBuyPrice: 95 },
      { userId: bob._id, symbol: 'USDT', holdings: 1000.0, averageBuyPrice: 1 },
      { userId: bob._id, symbol: 'BNB', holdings: 1.0, averageBuyPrice: 305 },
      { userId: bob._id, symbol: 'XRP', holdings: 100.0, averageBuyPrice: 0.62 },
    ])

    // Initialize UserStats for both
    await Promise.all([
      UserStats.create({
        userId: alice._id,
        portfolioValue: 0,
        totalBalance: 0,
        totalInvested: 0,
        profitLoss: 0,
        profitLossPercentage: 0,
        totalTransactions: 0,
        completedTransactions: 0,
        pendingTransactions: 0,
        failedTransactions: 0,
        buyTransactions: 0,
        sellTransactions: 0,
        sendTransactions: 0,
        receiveTransactions: 0,
        swapTransactions: 0,
        totalVolume: 0,
        totalFees: 0,
        numberOfAssets: 6,
        largestHolding: { symbol: '', value: 0 },
        lastTransactionDate: null,
        accountAge: 0,
        lastCalculated: new Date(),
      }),
      UserStats.create({
        userId: bob._id,
        portfolioValue: 0,
        totalBalance: 0,
        totalInvested: 0,
        profitLoss: 0,
        profitLossPercentage: 0,
        totalTransactions: 0,
        completedTransactions: 0,
        pendingTransactions: 0,
        failedTransactions: 0,
        buyTransactions: 0,
        sellTransactions: 0,
        sendTransactions: 0,
        receiveTransactions: 0,
        swapTransactions: 0,
        totalVolume: 0,
        totalFees: 0,
        numberOfAssets: 6,
        largestHolding: { symbol: '', value: 0 },
        lastTransactionDate: null,
        accountAge: 0,
        lastCalculated: new Date(),
      }),
    ])

    // Get wallet addresses for easy reference
    const aliceBTC = await Wallet.findOne({ userId: alice._id, symbol: 'BTC' })
    const bobBTC = await Wallet.findOne({ userId: bob._id, symbol: 'BTC' })

    return NextResponse.json({
      success: true,
      message: '✅ Test accounts created with crypto balances!',
      users: {
        alice: {
          email: 'alice@test.com',
          password: 'Test1234',
          role: 'SENDER (has lots of crypto)',
          balances: {
            BTC: '2.0',
            ETH: '20.0',
            SOL: '200.0',
            USDT: '10000.0',
            BNB: '5.0',
            XRP: '1000.0'
          },
          btcWalletAddress: aliceBTC.address
        },
        bob: {
          email: 'bob@test.com',
          password: 'Test1234',
          role: 'RECIPIENT (has some crypto)',
          balances: {
            BTC: '0.5',
            ETH: '5.0',
            SOL: '50.0',
            USDT: '1000.0',
            BNB: '1.0',
            XRP: '100.0'
          },
          btcWalletAddress: bobBTC.address
        }
      },
      testingInstructions: {
        step1: 'Login as Alice: alice@test.com / Test1234',
        step2: 'Go to Dashboard → Send',
        step3: `Paste Bob's BTC address: ${bobBTC.address}`,
        step4: 'Enter amount: 0.5 BTC',
        step5: 'Click Continue → Confirm Send',
        step6: 'Transfer complete! Check both accounts'
      },
      quickTest: {
        description: 'Quick copy-paste for testing',
        aliceLogin: { email: 'alice@test.com', password: 'Test1234' },
        bobBTCAddress: bobBTC.address,
        testAmount: '0.5'
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Seed transfer test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create test accounts',
      details: error.toString()
    }, { status: 500 })
  }
}

