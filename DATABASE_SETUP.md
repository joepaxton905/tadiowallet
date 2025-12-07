# Database Setup - IMPORTANT READ

## 🔑 Understanding Crypto Balances

### Your Holdings ARE Stored in the Database!

The **Portfolio** collection stores your **crypto balances**:

```javascript
{
  userId: ObjectId,
  symbol: "BTC",           // Which cryptocurrency
  holdings: 1.45,          // ← THIS IS YOUR BTC BALANCE!
  averageBuyPrice: 42000   // Average price you bought at
}
```

### How Balances Work:
- **holdings** = Your crypto balance (1.45 BTC, 10 ETH, etc.)
- **USD value** = holdings × current_market_price (calculated live)

Example:
- You own: **1.45 BTC** (stored in database)
- BTC price: **$43,250** (from CoinGecko API)
- Your balance: **$62,712.50** (calculated: 1.45 × $43,250)

This is the CORRECT approach because:
✅ Crypto prices change every second
✅ Storing USD values would be instantly outdated
✅ Holdings (amount of coins) only change during transactions

---

## 🚀 Quick Start - Populate Database NOW

### Step 1: Run the Seed Script

```bash
npm run seed
```

This will:
1. Create a test account: **test@example.com** / **Test1234**
2. Add crypto holdings (BTC, ETH, SOL, ADA, etc.)
3. Create transaction history
4. Generate wallet addresses
5. Add notifications

### Step 2: Login and View Your Data

1. Start dev server: `npm run dev`
2. Go to: http://localhost:3000/login
3. Login with:
   - Email: **test@example.com**
   - Password: **Test1234**
4. View your portfolio with LIVE data!

---

## 📊 What's Stored in MongoDB

### ✅ Collections Created:

1. **users** - User accounts
   - firstName, lastName, email, password
   - preferences (currency, language, notifications)

2. **portfolios** - Crypto holdings (BALANCES!)
   - symbol (BTC, ETH, etc.)
   - holdings (amount of crypto you own)
   - averageBuyPrice

3. **transactions** - Transaction history
   - type (buy, sell, send, receive, swap)
   - asset, amount, value, fee
   - status, dates

4. **wallets** - Wallet addresses
   - symbol (which crypto)
   - address (wallet address)
   - network

5. **notifications** - User notifications
   - type, title, message
   - read/unread status

---

## 💰 Example: Your BTC Balance

**Database stores:**
```json
{
  "userId": "...",
  "symbol": "BTC",
  "holdings": 1.45
}
```

**Dashboard calculates:**
```javascript
// Gets live BTC price from CoinGecko API
const btcPrice = 43250  // Live price

// Calculates your USD balance
const yourBalance = 1.45 * 43250  // = $62,712.50
```

**You see on dashboard:**
- BTC Holdings: **1.45 BTC**
- USD Value: **$62,712.50**
- Changes in real-time as BTC price changes!

---

## 🔍 Verify Database Contents

### Check what's in your database:

```javascript
// In MongoDB shell or Compass:

// See all users
db.users.find()

// See portfolio holdings
db.portfolios.find()

// See transactions
db.transactions.find()

// See wallets
db.wallets.find()

// See notifications
db.notifications.find()
```

---

## 🎯 Summary

### Your Crypto Balances ARE in the Database:
- ✅ **holdings** field = your crypto amount
- ✅ Stored per cryptocurrency (BTC, ETH, SOL, etc.)
- ✅ USD value calculated from holdings × live price
- ✅ Updates in real-time as prices change

### What You Need to Do:
1. Run: `npm run seed`
2. Login: test@example.com / Test1234
3. View your portfolio with real data!

---

## 🆘 Still Confused?

The system IS working correctly:
- Holdings (crypto amounts) are stored in MongoDB ✅
- Prices fetched from CoinGecko API in real-time ✅
- Balances calculated live (holdings × price) ✅
- All CRUD operations working ✅

Run `npm run seed` and login to see it working!

