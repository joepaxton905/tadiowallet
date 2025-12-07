/**
 * Database Seeding Script
 * Run this to populate your account with test data
 * 
 * Usage: node scripts/seed-database.js
 */

const mongoose = require('mongoose')

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tadiowallet'

// Define schemas inline
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  agreedToTerms: Boolean,
  termsAgreedAt: Date,
  preferences: {
    currency: { type: String, default: 'USD' },
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'UTC' },
    notifications: {
      email: { type: Boolean, default: true },
      priceAlerts: { type: Boolean, default: true },
      transactionAlerts: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
    },
  },
}, { timestamps: true })

const portfolioSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  symbol: String,
  holdings: Number,
  averageBuyPrice: Number,
}, { timestamps: true })

const transactionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  type: String,
  asset: String,
  assetName: String,
  assetIcon: String,
  assetColor: String,
  amount: Number,
  price: Number,
  value: Number,
  fee: Number,
  status: String,
  toAsset: String,
  toAmount: Number,
  to: String,
  from: String,
  apy: Number,
  txHash: String,
  notes: String,
}, { timestamps: true })

const walletSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  symbol: String,
  address: String,
  label: String,
  network: String,
  isDefault: Boolean,
}, { timestamps: true })

const notificationSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  type: String,
  title: String,
  message: String,
  read: Boolean,
  link: String,
  metadata: Object,
}, { timestamps: true })

// Models
const User = mongoose.models.User || mongoose.model('User', userSchema)
const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioSchema)
const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema)
const Wallet = mongoose.models.Wallet || mongoose.model('Wallet', walletSchema)
const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema)

// Generate mock wallet address
function generateWalletAddress() {
  const chars = '0123456789abcdef'
  let address = '0x'
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)]
  }
  return address
}

async function seedDatabase() {
  try {
    console.log('🌱 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB\n')

    // Check if user already exists
    console.log('👤 Looking for existing test user...')
    let user = await User.findOne({ email: 'test@example.com' })
    
    if (!user) {
      console.log('📝 Creating test user...')
      user = await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'Test1234', // Plain text as per requirements
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
      console.log('✅ Test user created:', user.email)
    } else {
      console.log('✅ Test user found:', user.email)
    }

    const userId = user._id

    // Clear existing data for this user
    console.log('\n🗑️  Clearing existing data...')
    await Portfolio.deleteMany({ userId })
    await Transaction.deleteMany({ userId })
    await Wallet.deleteMany({ userId })
    await Notification.deleteMany({ userId })
    console.log('✅ Old data cleared')

    // Seed Portfolio (CRYPTO HOLDINGS)
    console.log('\n💰 Creating portfolio holdings...')
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

    for (const item of portfolioData) {
      await Portfolio.create({
        userId,
        ...item,
      })
      console.log(`  ✓ Added ${item.holdings} ${item.symbol}`)
    }

    // Seed Transactions
    console.log('\n💸 Creating transaction history...')
    const transactionData = [
      {
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

    for (const tx of transactionData) {
      await Transaction.create({
        userId,
        ...tx,
      })
      console.log(`  ✓ Added ${tx.type} transaction for ${tx.asset}`)
    }

    // Seed Wallets
    console.log('\n💼 Generating wallet addresses...')
    const coins = ['BTC', 'ETH', 'SOL', 'ADA', 'MATIC', 'AVAX', 'LINK', 'DOT']
    
    for (const symbol of coins) {
      const address = generateWalletAddress()
      await Wallet.create({
        userId,
        symbol,
        address,
        label: 'Main Wallet',
        network: 'mainnet',
        isDefault: true,
      })
      console.log(`  ✓ Generated ${symbol} wallet: ${address.substring(0, 10)}...`)
    }

    // Seed Notifications
    console.log('\n🔔 Creating notifications...')
    const notificationData = [
      {
        type: 'price_alert',
        title: 'Bitcoin reached $43,000',
        message: 'BTC has crossed your price alert threshold.',
        read: false,
      },
      {
        type: 'transaction',
        title: 'Transaction completed',
        message: 'Your purchase of 0.15 BTC has been completed.',
        read: false,
      },
      {
        type: 'security',
        title: 'New login detected',
        message: 'A new login was detected from Chrome on Windows.',
        read: true,
      },
      {
        type: 'reward',
        title: 'Staking rewards received',
        message: 'You earned 0.012 ETH from staking rewards.',
        read: true,
      },
    ]

    for (const notif of notificationData) {
      await Notification.create({
        userId,
        ...notif,
      })
      console.log(`  ✓ Added notification: ${notif.title}`)
    }

    console.log('\n' + '='.repeat(60))
    console.log('✨ DATABASE SEEDING COMPLETED! ✨')
    console.log('='.repeat(60))
    console.log('\n📧 Login Credentials:')
    console.log('   Email: test@example.com')
    console.log('   Password: Test1234')
    console.log('\n💡 Now you can:')
    console.log('   1. Go to http://localhost:3000/login')
    console.log('   2. Login with the credentials above')
    console.log('   3. View your portfolio with REAL data!')
    console.log('\n' + '='.repeat(60) + '\n')

  } catch (error) {
    console.error('\n❌ Seeding failed:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('👋 Disconnected from MongoDB\n')
    process.exit(0)
  }
}

// Run the seeder
seedDatabase()

