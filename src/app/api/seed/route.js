import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Portfolio from '@/models/Portfolio'
import Transaction from '@/models/Transaction'
import Wallet from '@/models/Wallet'
import Notification from '@/models/Notification'

export const dynamic = 'force-dynamic'

// Generate mock wallet address
function generateWalletAddress() {
  const chars = '0123456789abcdef'
  let address = '0x'
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)]
  }
  return address
}

export async function GET() {
  try {
    await connectDB()

    // Check if test user already exists
    let user = await User.findOne({ email: 'test2@example.com' })
    
    if (user) {
      return NextResponse.json({
        success: false,
        message: 'Test account already exists! Login with: test2@example.com / Test1234',
        user: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      })
    }

    // Create test user in DATABASE
    user = await User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test2@example.com',
      password: 'Test1234', // Plain text as per your requirements
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

    const userId = user._id

    // Add Portfolio Holdings to DATABASE
    const portfolioData = [
      { symbol: 'BTC', holdings: 1.45, averageBuyPrice: 42000 },
      { symbol: 'ETH', holdings: 12.5, averageBuyPrice: 2200 },
      { symbol: 'SOL', holdings: 150, averageBuyPrice: 95 },
      { symbol: 'ADA', holdings: 10000, averageBuyPrice: 0.48 },
      { symbol: 'MATIC', holdings: 5000, averageBuyPrice: 0.85 },
      { symbol: 'AVAX', holdings: 100, averageBuyPrice: 33 },
      { symbol: 'LINK', holdings: 200, averageBuyPrice: 14 },
      { symbol: 'DOT', holdings: 300, averageBuyPrice: 7.2 },
    ]

    await Portfolio.insertMany(
      portfolioData.map(item => ({ ...item, userId }))
    )

    // Add Transactions to DATABASE
    const transactionData = [
      {
        userId,
        type: 'buy',
        asset: 'BTC',
        assetName: 'Bitcoin',
        assetIcon: '₿',
        assetColor: '#F7931A',
        amount: 0.15,
        price: 43250.00,
        value: 6487.50,
        fee: 12.50,
        status: 'completed',
      },
      {
        userId,
        type: 'receive',
        asset: 'ETH',
        assetName: 'Ethereum',
        assetIcon: 'Ξ',
        assetColor: '#627EEA',
        amount: 2.5,
        price: 2280.50,
        value: 5701.25,
        from: '0x742d35Cc6634C0532925a3b844Bc9e7595f8b3F8b',
        fee: 0,
        status: 'completed',
      },
      {
        userId,
        type: 'swap',
        asset: 'SOL',
        assetName: 'Solana',
        assetIcon: '◎',
        assetColor: '#9945FF',
        amount: 50,
        toAsset: 'ETH',
        toAmount: 2.15,
        value: 4937.50,
        status: 'completed',
        fee: 8.75,
      },
      {
        userId,
        type: 'send',
        asset: 'BTC',
        assetName: 'Bitcoin',
        assetIcon: '₿',
        assetColor: '#F7931A',
        amount: 0.05,
        price: 43250.00,
        value: 2162.50,
        to: '0x8a2f742d35Cc6634C0532925a3b844Bc9e7595f8b9c4d',
        fee: 5.00,
        status: 'completed',
      },
      {
        userId,
        type: 'sell',
        asset: 'ADA',
        assetName: 'Cardano',
        assetIcon: '₳',
        assetColor: '#0033AD',
        amount: 2000,
        price: 0.52,
        value: 1040.00,
        fee: 2.50,
        status: 'completed',
      },
      {
        userId,
        type: 'buy',
        asset: 'AVAX',
        assetName: 'Avalanche',
        assetIcon: '◆',
        assetColor: '#E84142',
        amount: 50,
        price: 35.20,
        value: 1760.00,
        fee: 4.25,
        status: 'pending',
      },
    ]

    await Transaction.insertMany(transactionData)

    // Generate Wallets in DATABASE
    const coins = ['BTC', 'ETH', 'SOL', 'ADA', 'MATIC', 'AVAX', 'LINK', 'DOT']
    const walletData = coins.map(symbol => ({
      userId,
      symbol,
      address: generateWalletAddress(),
      label: 'Main Wallet',
      network: 'mainnet',
      isDefault: true,
    }))

    await Wallet.insertMany(walletData)

    // Add Notifications to DATABASE
    const notificationData = [
      {
        userId,
        type: 'price_alert',
        title: 'Bitcoin reached $43,000',
        message: 'BTC has crossed your price alert threshold.',
        read: false,
      },
      {
        userId,
        type: 'transaction',
        title: 'Transaction completed',
        message: 'Your purchase of 0.15 BTC has been completed.',
        read: false,
      },
      {
        userId,
        type: 'security',
        title: 'New login detected',
        message: 'A new login was detected from Chrome on Windows.',
        read: true,
      },
      {
        userId,
        type: 'reward',
        title: 'Staking rewards received',
        message: 'You earned 0.012 ETH from staking rewards.',
        read: true,
      },
    ]

    await Notification.insertMany(notificationData)

    return NextResponse.json({
      success: true,
      message: 'Test account created and populated in DATABASE!',
      credentials: {
        email: 'test2@example.com',
        password: 'Test1234',
      },
      stats: {
        portfolioItems: portfolioData.length,
        transactions: transactionData.length,
        wallets: walletData.length,
        notifications: notificationData.length,
      },
      instructions: 'Now go to /login and login with the credentials above'
    })

  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      hint: 'Make sure MongoDB is running and MONGODB_URI is set in .env'
    }, { status: 500 })
  }
}

