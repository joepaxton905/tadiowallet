/**
 * Example Seed Script for TadioWallet
 * 
 * This script helps you populate your database with test data
 * for development and testing purposes.
 * 
 * Usage:
 * 1. Make sure you're logged in and have a user account
 * 2. Get your userId from MongoDB or from the browser console after login
 * 3. Update the USER_ID constant below
 * 4. Run: node scripts/seed-example.js
 */

// Note: To run this script, you'll need to:
// 1. Set up a way to run Node scripts with ES modules
// 2. Or convert this to CommonJS require() syntax
// 3. Or call the API endpoints directly using curl/Postman

const USER_ID = 'YOUR_USER_ID_HERE' // Replace with actual MongoDB ObjectId
const API_BASE = 'http://localhost:3000/api'
const AUTH_TOKEN = 'YOUR_JWT_TOKEN_HERE' // Get from localStorage after login

// Sample Portfolio Data
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

// Sample Transaction Data
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
    from: '0x742d...3f8b',
    fee: 0,
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
]

// Sample Notification Data
const notificationData = [
  {
    type: 'price_alert',
    title: 'Bitcoin reached $43,000',
    message: 'BTC has crossed your price alert threshold.',
  },
  {
    type: 'transaction',
    title: 'Transaction completed',
    message: 'Your purchase of 0.15 BTC has been completed.',
  },
  {
    type: 'security',
    title: 'New login detected',
    message: 'A new login was detected from Chrome on Windows.',
  },
]

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n')
  
  // Seed Portfolio
  console.log('📊 Seeding portfolio data...')
  for (const holding of portfolioData) {
    try {
      const response = await fetch(`${API_BASE}/portfolio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(holding),
      })
      const data = await response.json()
      console.log(`  ✓ Added ${holding.holdings} ${holding.symbol}`)
    } catch (error) {
      console.error(`  ✗ Failed to add ${holding.symbol}:`, error.message)
    }
  }
  
  // Seed Transactions
  console.log('\n💸 Seeding transaction data...')
  for (const transaction of transactionData) {
    try {
      const response = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(transaction),
      })
      const data = await response.json()
      console.log(`  ✓ Added ${transaction.type} transaction for ${transaction.asset}`)
    } catch (error) {
      console.error(`  ✗ Failed to add transaction:`, error.message)
    }
  }
  
  // Seed Notifications
  console.log('\n🔔 Seeding notification data...')
  for (const notification of notificationData) {
    try {
      const response = await fetch(`${API_BASE}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(notification),
      })
      const data = await response.json()
      console.log(`  ✓ Added notification: ${notification.title}`)
    } catch (error) {
      console.error(`  ✗ Failed to add notification:`, error.message)
    }
  }
  
  // Auto-generate wallets
  console.log('\n💼 Generating wallet addresses...')
  const coins = ['BTC', 'ETH', 'SOL', 'ADA', 'MATIC', 'AVAX', 'LINK', 'DOT']
  for (const symbol of coins) {
    try {
      const response = await fetch(`${API_BASE}/wallets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({ symbol }),
      })
      const data = await response.json()
      console.log(`  ✓ Generated wallet for ${symbol}`)
    } catch (error) {
      console.error(`  ✗ Failed to generate wallet for ${symbol}:`, error.message)
    }
  }
  
  console.log('\n✅ Database seeding completed!\n')
}

// Uncomment to run (make sure to update USER_ID and AUTH_TOKEN first)
// seedDatabase().catch(console.error)

/* 
 * EASIER METHOD: Use the browser console
 * 
 * After logging in, open browser console and paste:
 * 
 * // Get your auth token from localStorage
 * const token = localStorage.getItem('authToken');
 * 
 * // Example: Add portfolio holdings
 * fetch('/api/portfolio', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'Authorization': `Bearer ${token}`
 *   },
 *   body: JSON.stringify({
 *     symbol: 'BTC',
 *     holdings: 1.5,
 *     averageBuyPrice: 42000
 *   })
 * }).then(r => r.json()).then(console.log)
 * 
 * // Example: Add a transaction
 * fetch('/api/transactions', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'Authorization': `Bearer ${token}`
 *   },
 *   body: JSON.stringify({
 *     type: 'buy',
 *     asset: 'BTC',
 *     assetName: 'Bitcoin',
 *     assetIcon: '₿',
 *     assetColor: '#F7931A',
 *     amount: 0.5,
 *     price: 43000,
 *     value: 21500,
 *     fee: 10
 *   })
 * }).then(r => r.json()).then(console.log)
 */

console.log(`
📖 Seed Script Instructions:
============================

METHOD 1: Using Browser Console (Recommended)
---------------------------------------------
1. Sign up or log in to your account
2. Open browser DevTools (F12)
3. Go to Console tab
4. Copy the examples from the comments above
5. Paste and run them one by one

METHOD 2: Using This Script
---------------------------
1. Update USER_ID and AUTH_TOKEN constants
2. Uncomment the seedDatabase() call at the bottom
3. Run: node scripts/seed-example.js

METHOD 3: Using API Client (Postman/Insomnia)
---------------------------------------------
1. Import the API endpoints
2. Set Authorization header: Bearer YOUR_TOKEN
3. Send POST requests with the sample data
`)

module.exports = { portfolioData, transactionData, notificationData }

