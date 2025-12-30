# 🧪 Receive Page - Testing Guide

## Quick Testing Steps

### Method 1: Using Existing Test Account (Fastest)

If you've already seeded the database:

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Login:**
   - Navigate to: `http://localhost:3000/login`
   - Email: `test@example.com`
   - Password: `Test1234`

3. **Go to Receive Page:**
   - Navigate to: `http://localhost:3000/dashboard/receive`
   - Or click "Receive" in the sidebar

4. **Verify Wallet Addresses:**
   - Page should display BTC wallet address by default
   - Click on the asset selector to choose different coins
   - Each coin should show a wallet address from database
   - Try copying the address (should show green checkmark)

### Method 2: Create Fresh Account

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Sign Up:**
   - Navigate to: `http://localhost:3000/signup`
   - Fill in the form:
     - First Name: Your Name
     - Last Name: Your Last Name
     - Email: your@email.com
     - Password: YourPassword123
     - Confirm Password: YourPassword123
     - Check "I agree to terms"
   - Click "Create Account"

3. **Verify Wallets Created:**
   - You should be automatically logged in
   - 6 real wallets should be generated (BTC, ETH, USDT, SOL, XRP, BNB)

4. **Go to Receive Page:**
   - Navigate to: `http://localhost:3000/dashboard/receive`
   - Or click "Receive" in the sidebar

5. **Test Each Coin:**
   - Select BTC → See real Bitcoin address (starts with 1, 3, or bc1)
   - Select ETH → See real Ethereum address (starts with 0x)
   - Select SOL → See real Solana address (Base58 format)
   - Select ADA/MATIC/AVAX → See mock address (0x... format)

### Method 3: Seed via Browser

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Visit seed endpoint:**
   - Navigate to: `http://localhost:3000/api/seed`
   - You should see JSON response confirming account creation

3. **Login:**
   - Navigate to: `http://localhost:3000/login`
   - Email: `test@example.com`
   - Password: `Test1234`

4. **Test Receive Page:**
   - Navigate to: `http://localhost:3000/dashboard/receive`
   - Verify wallet addresses display correctly

---

## 🔍 What to Look For

### ✅ Expected Behavior:

1. **Wallet Address Display:**
   - Shows actual wallet address (not empty)
   - Address is consistent on page reload
   - Address format matches cryptocurrency type:
     - BTC: Starts with `1`, `3`, or `bc1`
     - ETH/USDT: Starts with `0x` followed by 40 hex characters
     - SOL: Base58 string (alphanumeric)
     - Mock: Starts with `0x` followed by 40 hex characters

2. **Copy Functionality:**
   - Click copy button next to address
   - Button changes to green with checkmark
   - Address copied to clipboard
   - Paste to verify it's the correct address

3. **Asset Selector:**
   - Click on asset selector
   - Modal opens with list of cryptocurrencies
   - Select different coin
   - Wallet address updates immediately

4. **Auto-Generation:**
   - Select a coin you don't have wallet for yet
   - Address should appear after brief loading
   - Check browser console - should see wallet creation
   - Reload page - same address should persist

### ❌ Issues to Report:

1. **Empty Address:**
   - If wallet address field is empty
   - Check if user is logged in
   - Check browser console for errors
   - Verify MongoDB connection

2. **Mock Address for BTC/ETH/SOL:**
   - These should show real addresses
   - If seeing `0x` address for BTC, something's wrong
   - Check API logs for generation errors

3. **Different Address on Reload:**
   - Address should be consistent
   - If changing, wallet not saving to database
   - Check database connection

4. **Copy Not Working:**
   - Try different browser
   - Check clipboard permissions
   - Check browser console for errors

---

## 🔧 Verification Checklist

### Pre-Testing:
- [ ] MongoDB is running and connected
- [ ] `.env` file has correct `MONGODB_URI`
- [ ] Dev server is running (`npm run dev`)
- [ ] Test account exists OR ready to create new account

### During Testing:
- [ ] Can login successfully
- [ ] Receive page loads without errors
- [ ] Wallet address displays for BTC
- [ ] Can select different cryptocurrencies
- [ ] Each selected coin shows an address
- [ ] Copy button works
- [ ] Address format matches coin type
- [ ] No console errors

### After Testing:
- [ ] Same address displays on page reload
- [ ] Address remains consistent across sessions
- [ ] Can logout and login again - same addresses
- [ ] Wallet auto-generates for new coins

---

## 📊 Database Verification

### Check Wallets in MongoDB:

**Using MongoDB Compass:**
1. Connect to your database
2. Navigate to `wallets` collection
3. Find your user's wallets (filter by `userId`)
4. Verify addresses match what's shown on receive page

**Using MongoDB Shell:**
```javascript
// Connect to your database
use tadiowallet

// Find all wallets for a user (replace with actual userId)
db.wallets.find({ userId: ObjectId("your_user_id") })

// Check if addresses exist
db.wallets.find({ userId: ObjectId("your_user_id") }).forEach(wallet => {
  print(`${wallet.symbol}: ${wallet.address}`)
})
```

**Using Database Seed:**
```bash
# Run seed script
npm run seed

# Check what was created
# MongoDB will have new wallets for test@example.com
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Failed to fetch wallets" error
**Cause:** Database connection issue or auth token invalid

**Solutions:**
- Check if MongoDB is running
- Verify `.env` has correct `MONGODB_URI`
- Try logging out and logging in again
- Check browser console for specific error
- Verify JWT_SECRET in `.env`

### Issue 2: Wallet address shows as empty
**Cause:** No wallet exists in database

**Solutions:**
- If using test account, run seed script
- If new account, wallets should auto-generate
- Check browser console for errors
- Try manually clicking "refresh" or reload page
- Verify API endpoint `/api/wallets` is working

### Issue 3: Mock address shows for BTC/ETH
**Cause:** Wallet generation failed or coin not supported

**Solutions:**
- Check server logs for wallet generation errors
- Verify all wallet generation packages installed:
  ```bash
  npm install bip39 bip32 @bitcoinerlab/secp256k1 bitcoinjs-lib ethers @solana/web3.js ed25519-hd-key
  ```
- Restart dev server after installing packages
- Try deleting wallet and letting it regenerate

### Issue 4: Different address on each reload
**Cause:** Wallet not being saved to database

**Solutions:**
- Check MongoDB connection
- Verify write permissions on database
- Check server logs for save errors
- Clear browser cache and try again
- Verify `Wallet.upsertWallet()` is working

---

## 🎯 Expected Test Results

### For BTC:
```
Symbol: BTC
Address Format: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
Address Length: 26-35 characters
Starts with: 1, 3, or bc1
Example: 1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2
```

### For ETH:
```
Symbol: ETH
Address Format: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Address Length: 42 characters (including 0x)
Starts with: 0x
Example: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

### For SOL:
```
Symbol: SOL
Address Format: 7EqQdEUomNX7SHVdTwghJgdXYJz8fXpYTtJVLdxGuJeE
Address Length: 32-44 characters
Format: Base58 (alphanumeric)
Example: 7EqQdEUomNX7SHVdTwghJgdXYJz8fXpYTtJVLdxGuJeE
```

### For USDT (ERC-20):
```
Symbol: USDT
Address Format: Same as ETH (0x...)
Address Length: 42 characters
Starts with: 0x
Example: 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063
```

---

## ✅ Success Indicators

If you see ALL of these, implementation is working correctly:

1. ✅ Wallet addresses display immediately on page load
2. ✅ Addresses are consistent on page reload
3. ✅ BTC address starts with 1, 3, or bc1 (not 0x)
4. ✅ ETH address starts with 0x
5. ✅ SOL address is Base58 format
6. ✅ Copy button works and shows confirmation
7. ✅ Can switch between different cryptocurrencies
8. ✅ Same addresses in MongoDB match what's displayed
9. ✅ No console errors
10. ✅ Addresses persist after logout and login

---

## 📸 Visual Verification

### What You Should See:

```
┌─────────────────────────────────────────────────┐
│  Receive Crypto                                 │
│                                                 │
│  Select Asset                                   │
│  ┌─────────────────────────────────────┐       │
│  │ [₿] Bitcoin                          │       │
│  │     BTC                              │       │
│  └─────────────────────────────────────┘       │
│                                                 │
│  [QR Code Display]                              │
│                                                 │
│  Your BTC Address                               │
│  ┌──────────────────────────────────┐  [📋]   │
│  │ 1BvBMSEYstWetqTFn5Au4m4GFg7xJ... │         │
│  └──────────────────────────────────┘          │
│                                                 │
│  ⚠️ Important                                   │
│  Only send Bitcoin (BTC) to this address...    │
│                                                 │
│  [Share Address Button]                         │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Ready to Test!

Follow the steps above to verify that wallet addresses from the database are displaying correctly on the receive page. If you encounter any issues, refer to the troubleshooting section or check the main implementation document.

**Good luck testing! 🎉**

