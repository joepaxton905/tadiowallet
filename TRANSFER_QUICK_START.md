# 🚀 Internal Transfers - QUICK START GUIDE

## Problem: Users Need Crypto Balance to Send!

You're absolutely right - new signups have **0 balance** and can't send anything. Here's how to fix it:

---

## ✅ Solution 1: Use Test Account Creator (EASIEST)

### Step 1: Create Test Accounts with Balance

Visit this endpoint in your browser:
```
http://localhost:3000/api/seed-transfer-test
```

This creates **TWO users with actual crypto**:

**Alice (Sender):**
- Email: `alice@test.com`
- Password: `Test1234`
- Balance: 2 BTC, 20 ETH, 200 SOL, 10,000 USDT, 5 BNB, 1,000 XRP

**Bob (Recipient):**
- Email: `bob@test.com`
- Password: `Test1234`
- Balance: 0.5 BTC, 5 ETH, 50 SOL, 1,000 USDT, 1 BNB, 100 XRP

### Step 2: Test Transfer (5 minutes)

1. **Login as Alice:**
   - Go to: `http://localhost:3000/login`
   - Email: `alice@test.com`
   - Password: `Test1234`

2. **Get Bob's Wallet Address:**
   - Logout and login as Bob
   - Go to: Dashboard → Receive
   - Select BTC
   - Copy Bob's BTC address (e.g., `1BvBMSEYst...`)

3. **Send Transfer:**
   - Logout and login as Alice
   - Go to: Dashboard → Send
   - Select BTC
   - Paste Bob's BTC address
   - Enter amount: `0.5` BTC
   - Click Continue
   - Review details
   - Click Confirm Send

4. **Verify Success:**
   - Alice's BTC: 2.0 → 1.5 BTC ✓
   - Bob's BTC: 0.5 → 1.0 BTC ✓
   - Both see transactions ✓
   - Both got notifications ✓

**Done! Transfer working!** 🎉

---

## ✅ Solution 2: Manual Balance Addition (Database)

### Using MongoDB Compass or Shell

```javascript
// 1. Find user ID
const user = db.users.findOne({ email: 'youruser@example.com' })

// 2. Add BTC balance
db.portfolios.insertOne({
  userId: user._id,
  symbol: 'BTC',
  holdings: 1.0,
  averageBuyPrice: 40000,
  createdAt: new Date(),
  updatedAt: new Date()
})

// 3. Add more crypto
db.portfolios.insertMany([
  { userId: user._id, symbol: 'ETH', holdings: 10.0, averageBuyPrice: 2000 },
  { userId: user._id, symbol: 'USDT', holdings: 5000.0, averageBuyPrice: 1 },
  { userId: user._id, symbol: 'SOL', holdings: 100.0, averageBuyPrice: 90 },
  { userId: user._id, symbol: 'BNB', holdings: 2.0, averageBuyPrice: 300 },
  { userId: user._id, symbol: 'XRP', holdings: 500.0, averageBuyPrice: 0.6 },
].map(item => ({ ...item, createdAt: new Date(), updatedAt: new Date() })))

// 4. Verify
db.portfolios.find({ userId: user._id })
```

---

## ✅ Solution 3: Use Existing Seed (Has Balance)

The original seed endpoint creates a user with balance:

```
http://localhost:3000/api/seed
```

**Creates:**
- Email: `test@example.com`
- Password: `Test1234`
- Balance: 1.45 BTC, 12.5 ETH, 150 SOL, etc.

But you still need a second user as recipient!

---

## 🎯 Best Practice: Test Setup

### For Development:
1. Use `seed-transfer-test` endpoint
2. Creates Alice + Bob with balances
3. Test transfers between them

### For Production:
Users get balance by:
1. **Buying crypto** (via Trade page - if implemented)
2. **Receiving from others** (someone sends first)
3. **Admin credit** (admin adds balance)

---

## 💡 Why This Happens

**Signup Flow:**
```javascript
// src/app/api/auth/signup/route.js
// Lines 236-272

// Creates portfolio with 0 balance
Portfolio.create({
  userId: user._id,
  symbol: 'BTC',
  holdings: 0,  // ← ZERO balance!
  averageBuyPrice: 0,
})
```

**This is correct!** New users shouldn't have free crypto. They need to:
- Buy it (Trade page)
- Receive it (from transfers)
- Get it from admin (for testing)

---

## 🔧 Quick Commands

### Create test accounts:
```bash
curl http://localhost:3000/api/seed-transfer-test
```

### Check user balance in MongoDB:
```javascript
db.portfolios.find({ userId: ObjectId("user_id_here") })
```

### Add balance manually:
```javascript
db.portfolios.updateOne(
  { userId: ObjectId("user_id"), symbol: "BTC" },
  { $set: { holdings: 1.0 } }
)
```

---

## ✅ Transfer Testing Checklist

Before testing transfers:
- [ ] Two users exist
- [ ] Both have wallet addresses (auto-created on signup)
- [ ] Sender has crypto balance (not 0!)
- [ ] You know recipient's wallet address
- [ ] MongoDB is running
- [ ] Dev server is running (`npm run dev`)

During transfer:
- [ ] Login as sender
- [ ] Go to Send page
- [ ] Select asset (BTC, ETH, etc.)
- [ ] Paste recipient address
- [ ] Address validates (green checkmark)
- [ ] Enter amount (less than balance)
- [ ] Review details
- [ ] Confirm send
- [ ] Success message appears

After transfer:
- [ ] Sender balance decreased
- [ ] Recipient balance increased
- [ ] Both see transactions in history
- [ ] Both got notifications
- [ ] Stats updated for both

---

## 🆘 Common Errors & Fixes

### "You don't have any BTC in your portfolio"
**Problem:** User has 0 balance  
**Fix:** Add balance using seed-transfer-test or MongoDB

### "Recipient wallet not found"
**Problem:** Invalid address or wrong asset  
**Fix:** 
- Make sure recipient has account
- Make sure recipient has wallet for that asset
- Check you copied full address

### "Cannot send to your own wallet"
**Problem:** Trying to send to yourself  
**Fix:** Use different user as recipient

### "Insufficient balance"
**Problem:** Trying to send more than you have  
**Fix:** Reduce amount or add more balance

---

## 🎉 Summary

**The transfer system works perfectly!** The issue was just that new users have 0 balance.

**Solutions:**
1. ✅ Use `seed-transfer-test` endpoint (EASIEST)
2. ✅ Add balance via MongoDB
3. ✅ Implement buy/trade functionality
4. ✅ Admin panel to credit accounts

**Now you can test transfers properly!** 🚀

---

*If you still have issues, check:*
- MongoDB is connected
- Both users exist
- Balances are > 0
- Wallet addresses are correct
- Dev server is running

