# Quick Database Seeding via Browser

## Problem: Seed script not running? Use browser instead!

### Step 1: Create Account
1. Go to: http://localhost:3000/signup
2. Sign up with:
   - First Name: **Test**
   - Last Name: **User**
   - Email: **test@example.com**
   - Password: **Test1234**

### Step 2: Open Browser Console
After login, press **F12** and go to **Console** tab

### Step 3: Paste and Run This Code

```javascript
// Get your auth token
const token = localStorage.getItem('authToken');

// Function to add data
async function seedMyAccount() {
  console.log('🌱 Starting to seed your account...\n');
  
  // 1. Add Portfolio Holdings
  console.log('💰 Adding crypto holdings...');
  const holdings = [
    { symbol: 'BTC', holdings: 1.45, averageBuyPrice: 42000 },
    { symbol: 'ETH', holdings: 12.5, averageBuyPrice: 2200 },
    { symbol: 'SOL', holdings: 150, averageBuyPrice: 95 },
    { symbol: 'ADA', holdings: 10000, averageBuyPrice: 0.48 },
    { symbol: 'MATIC', holdings: 5000, averageBuyPrice: 0.85 },
    { symbol: 'AVAX', holdings: 100, averageBuyPrice: 33 },
    { symbol: 'LINK', holdings: 200, averageBuyPrice: 14 },
    { symbol: 'DOT', holdings: 300, averageBuyPrice: 7.2 }
  ];
  
  for (const h of holdings) {
    await fetch('/api/portfolio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(h)
    });
    console.log(`  ✓ Added ${h.holdings} ${h.symbol}`);
  }
  
  // 2. Add Transactions
  console.log('\n💸 Adding transactions...');
  const transactions = [
    {
      type: 'buy',
      asset: 'BTC',
      assetName: 'Bitcoin',
      assetIcon: '₿',
      assetColor: '#F7931A',
      amount: 0.15,
      price: 43250,
      value: 6487.50,
      fee: 12.50,
      status: 'completed'
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
      status: 'completed'
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
      status: 'completed'
    },
    {
      type: 'buy',
      asset: 'SOL',
      assetName: 'Solana',
      assetIcon: '◎',
      assetColor: '#9945FF',
      amount: 50,
      price: 98.75,
      value: 4937.50,
      fee: 8.75,
      status: 'completed'
    }
  ];
  
  for (const tx of transactions) {
    await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(tx)
    });
    console.log(`  ✓ Added ${tx.type} transaction`);
  }
  
  // 3. Generate Wallets
  console.log('\n💼 Generating wallets...');
  const coins = ['BTC', 'ETH', 'SOL', 'ADA', 'MATIC', 'AVAX', 'LINK', 'DOT'];
  for (const symbol of coins) {
    await fetch('/api/wallets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ symbol })
    });
    console.log(`  ✓ Generated ${symbol} wallet`);
  }
  
  // 4. Add Notifications
  console.log('\n🔔 Adding notifications...');
  const notifications = [
    {
      type: 'price_alert',
      title: 'Bitcoin reached $43,000',
      message: 'BTC has crossed your price alert threshold.'
    },
    {
      type: 'transaction',
      title: 'Transaction completed',
      message: 'Your purchase of 0.15 BTC has been completed.'
    },
    {
      type: 'security',
      title: 'New login detected',
      message: 'A new login was detected from your device.'
    }
  ];
  
  for (const notif of notifications) {
    await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(notif)
    });
    console.log(`  ✓ Added notification`);
  }
  
  console.log('\n✨ SEEDING COMPLETE! Refresh the page to see your data!');
}

// Run it
seedMyAccount().catch(console.error);
```

### Step 4: Refresh Page
After the script completes, **refresh the page** (F5) to see:
- ✅ Your portfolio with real balances
- ✅ Transaction history
- ✅ Wallet addresses
- ✅ Notifications

---

## Alternative: Use Existing Account

If you already have an account, just:
1. Login with your credentials
2. Open Console (F12)
3. Run the seed script above
4. Refresh page

That's it! Your account now has data! 🎉

