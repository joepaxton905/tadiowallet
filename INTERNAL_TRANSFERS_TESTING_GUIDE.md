# 🧪 Internal Transfers - Testing Guide

## Quick Testing Steps

### Prerequisites

1. **MongoDB Running:** Ensure MongoDB is running and connected
2. **Dev Server:** Start the Next.js dev server
   ```bash
   npm run dev
   ```
3. **Test Accounts:** You need at least 2 user accounts

---

## Method 1: Quick Test with Seed Data

### Step 1: Create Test Account with Balance

Visit the seed endpoint:
```
http://localhost:3000/api/seed
```

This creates:
- **User:** test@example.com / Test1234
- **Balance:** 1.45 BTC, 12.5 ETH, 150 SOL, 10,000 USDT, etc.

### Step 2: Create Second User

1. Navigate to: `http://localhost:3000/signup`
2. Create account:
   - Name: Recipient User
   - Email: recipient@example.com
   - Password: Test1234

### Step 3: Get Recipient's Wallet Address

1. Login as recipient@example.com
2. Go to: `http://localhost:3000/dashboard/receive`
3. Select BTC
4. Copy the wallet address (e.g., `1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2`)

### Step 4: Send Transfer

1. Logout and login as test@example.com
2. Go to: `http://localhost:3000/dashboard/send`
3. Select BTC from dropdown
4. Paste recipient's address
5. Wait for validation (should show "Recipient User")
6. Enter amount: 0.5 BTC
7. Click "Continue"
8. Review details:
   - Amount: 0.5 BTC
   - Value: ~$21,625
   - Fee: ~$21.63 (0.1%)
9. Click "Confirm Send"

### Step 5: Verify Transfer

**Check Sender (test@example.com):**
1. Go to Dashboard
   - BTC balance should be: 1.45 → 0.95 BTC
2. Go to Transactions
   - Should see "Send" transaction with fee
3. Check notifications
   - Should have "Transfer Sent" notification

**Check Recipient (recipient@example.com):**
1. Login as recipient
2. Go to Dashboard
   - BTC balance should be: 0 → 0.5 BTC
3. Go to Transactions
   - Should see "Receive" transaction (no fee)
4. Check notifications
   - Should have "Transfer Received" notification

---

## Method 2: Manual Testing from Scratch

### Step 1: Create Two Users

**User A (Sender):**
```
POST /api/auth/signup
{
  "firstName": "Alice",
  "lastName": "Sender",
  "email": "alice@test.com",
  "password": "Test1234",
  "confirmPassword": "Test1234",
  "agreedToTerms": true
}
```

**User B (Recipient):**
```
POST /api/auth/signup
{
  "firstName": "Bob",
  "lastName": "Receiver",
  "email": "bob@test.com",
  "password": "Test1234",
  "confirmPassword": "Test1234",
  "agreedToTerms": true
}
```

### Step 2: Add Balance to Alice

Using MongoDB shell or Compass:
```javascript
// Find Alice's user ID
const alice = db.users.findOne({ email: 'alice@test.com' })

// Add BTC to portfolio
db.portfolios.insertOne({
  userId: alice._id,
  symbol: 'BTC',
  holdings: 1.0,
  averageBuyPrice: 40000,
  createdAt: new Date(),
  updatedAt: new Date()
})

// Verify
db.portfolios.find({ userId: alice._id })
```

### Step 3: Get Bob's Wallet Address

Using MongoDB:
```javascript
const bob = db.users.findOne({ email: 'bob@test.com' })
const bobWallet = db.wallets.findOne({ userId: bob._id, symbol: 'BTC' })
console.log(bobWallet.address)
// Copy this address
```

### Step 4: Send Transfer

1. Login as Alice (alice@test.com)
2. Navigate to Send page
3. Follow same steps as Method 1

---

## Test Cases Checklist

### ✅ Positive Test Cases

- [ ] **TC01:** Transfer BTC successfully
- [ ] **TC02:** Transfer ETH successfully
- [ ] **TC03:** Transfer USDT successfully
- [ ] **TC04:** Transfer BNB successfully
- [ ] **TC05:** Transfer SOL successfully
- [ ] **TC06:** Transfer XRP successfully
- [ ] **TC07:** Sender balance decreases correctly
- [ ] **TC08:** Recipient balance increases correctly
- [ ] **TC09:** Both users receive notifications
- [ ] **TC10:** Transaction records created for both
- [ ] **TC11:** Fee calculated correctly (0.1%)
- [ ] **TC12:** Real-time price used in value calculation
- [ ] **TC13:** Stats updated for both users

### ❌ Negative Test Cases

- [ ] **TC14:** Cannot send with insufficient balance
  - Action: Try to send 10 BTC when having 1 BTC
  - Expected: Error "Insufficient balance..."

- [ ] **TC15:** Cannot send to invalid address
  - Action: Enter random string as address
  - Expected: Error "Recipient wallet not found"

- [ ] **TC16:** Cannot send to own wallet
  - Action: Enter your own wallet address
  - Expected: Error "Cannot send to your own wallet"

- [ ] **TC17:** Cannot send below minimum amount
  - Action: Try to send 0.00001 BTC (min is 0.0001)
  - Expected: Error "Minimum transfer amount..."

- [ ] **TC18:** Cannot send unsupported asset
  - Action: Try to send ADA (if you have it)
  - Expected: Error "Asset not supported..."

- [ ] **TC19:** Cannot send zero or negative amount
  - Action: Enter 0 or -1 as amount
  - Expected: Error "Amount must be greater than zero"

- [ ] **TC20:** Cannot send with too many decimals
  - Action: Enter 0.123456789 (9 decimals, max is 8)
  - Expected: Error "Cannot have more than 8 decimal places"

- [ ] **TC21:** Cannot send when leaving dust balance
  - Action: If you have 1.00000001 BTC, try to send 1 BTC
  - Expected: Error "Would leave a dust balance..."

---

## Detailed Test Scenarios

### Scenario 1: Complete Transfer Flow

**Objective:** Verify entire transfer process works correctly

**Steps:**
1. Login as Alice
2. Note initial BTC balance (e.g., 1.5 BTC)
3. Navigate to Send page
4. Select BTC asset
5. Enter Bob's wallet address
6. Wait for validation
7. Verify recipient info shows: "Bob Receiver (bob@test.com)"
8. Enter amount: 0.5 BTC
9. Note estimated USD value
10. Click "Continue"
11. On confirmation screen, verify:
    - Amount: 0.5 BTC
    - USD value is correct
    - Transfer fee is ~0.1% of value
    - Recipient shows correctly
12. Click "Confirm Send"
13. Wait for success message
14. Check Alice's dashboard:
    - BTC balance: 1.5 → 1.0 BTC ✓
15. Go to Transactions page:
    - See "Send" transaction ✓
    - Amount: 0.5 BTC ✓
    - Fee: $X.XX ✓
    - To: Bob's address ✓
16. Check notifications:
    - "Transfer Sent" notification ✓
17. Logout and login as Bob
18. Check Bob's dashboard:
    - BTC balance: 0 → 0.5 BTC ✓
19. Go to Transactions:
    - See "Receive" transaction ✓
    - Amount: 0.5 BTC ✓
    - Fee: $0.00 ✓
    - From: Alice's address ✓
20. Check notifications:
    - "Transfer Received" notification ✓

**Expected Result:** All steps pass ✅

### Scenario 2: Address Validation

**Objective:** Verify address validation works in real-time

**Steps:**
1. Login as Alice
2. Go to Send page
3. Select BTC
4. Start typing random characters in address field
5. Should not show any validation
6. Enter a complete but invalid address
7. After 500ms, should show: "Wallet not found"
8. Enter Bob's valid wallet address
9. After 500ms, should show:
   - Green checkmark ✓
   - "Bob Receiver"
   - "bob@test.com"
10. Try to enter your own wallet address
11. Should show: "Cannot send to your own wallet"

**Expected Result:** All validations work correctly ✅

### Scenario 3: Fee Calculation

**Objective:** Verify fee bounds (min $0.01, max $10)

**Test Cases:**

**Case A: Normal Fee**
- Amount: 0.5 BTC
- Price: $43,250
- Value: $21,625
- Raw Fee (0.1%): $21.63
- Actual Fee: $21.63 ✓

**Case B: Below Minimum**
- Amount: 5 USDT
- Price: $1
- Value: $5
- Raw Fee (0.1%): $0.005
- Actual Fee: $0.01 (min) ✓

**Case C: Above Maximum**
- Amount: 100 BTC
- Price: $43,250
- Value: $4,325,000
- Raw Fee (0.1%): $4,325
- Actual Fee: $10.00 (max) ✓

### Scenario 4: All Assets Test

**Objective:** Verify all 6 supported assets work

**For each asset (BTC, ETH, USDT, BNB, SOL, XRP):**

1. Give Alice balance of asset
2. Send to Bob
3. Verify transfer succeeds
4. Check balances updated correctly
5. Verify transactions created
6. Verify notifications sent

**Expected:** All 6 assets work identically ✅

### Scenario 5: Error Recovery

**Objective:** Verify system handles errors gracefully

**Steps:**
1. Attempt transfer with insufficient balance
2. Should show error, but not crash
3. Fix the issue (reduce amount)
4. Should be able to send successfully
5. System should recover and work normally

**Expected:** Errors don't break the system ✅

### Scenario 6: Database Consistency

**Objective:** Verify database remains consistent

**Steps:**
1. Before transfer:
   - Note Alice BTC balance
   - Note Bob BTC balance
   - Note transaction count
2. Send 0.5 BTC from Alice to Bob
3. After transfer:
   - Alice balance decreased by 0.5 ✓
   - Bob balance increased by 0.5 ✓
   - Total BTC unchanged (minus fee) ✓
   - 2 new transactions created ✓
   - 2 new notifications created ✓
   - No orphan records ✓

**Expected:** Database fully consistent ✅

---

## Automated Testing (Optional)

### Using API Directly

```javascript
// Test transfer endpoint
async function testTransfer() {
  // Login as Alice
  const aliceLogin = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'alice@test.com',
      password: 'Test1234'
    })
  })
  const { token: aliceToken } = await aliceLogin.json()
  
  // Get Bob's wallet address
  const bobWallet = await db.wallets.findOne({
    userId: bobId,
    symbol: 'BTC'
  })
  
  // Send transfer
  const transfer = await fetch('/api/transactions/transfer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${aliceToken}`
    },
    body: JSON.stringify({
      recipientAddress: bobWallet.address,
      asset: 'BTC',
      amount: 0.5,
      notes: 'Test transfer'
    })
  })
  
  const result = await transfer.json()
  console.log('Transfer result:', result)
  
  // Verify balances
  const alicePortfolio = await db.portfolios.findOne({
    userId: aliceId,
    symbol: 'BTC'
  })
  const bobPortfolio = await db.portfolios.findOne({
    userId: bobId,
    symbol: 'BTC'
  })
  
  console.log('Alice balance:', alicePortfolio.holdings)
  console.log('Bob balance:', bobPortfolio.holdings)
}
```

---

## MongoDB Verification Queries

### Check Balances
```javascript
// Alice's BTC balance
db.portfolios.findOne({
  userId: ObjectId("alice_id"),
  symbol: "BTC"
})

// Bob's BTC balance
db.portfolios.findOne({
  userId: ObjectId("bob_id"),
  symbol: "BTC"
})
```

### Check Transactions
```javascript
// Alice's send transaction
db.transactions.find({
  userId: ObjectId("alice_id"),
  type: "send",
  asset: "BTC"
}).sort({ createdAt: -1 }).limit(1)

// Bob's receive transaction
db.transactions.find({
  userId: ObjectId("bob_id"),
  type: "receive",
  asset: "BTC"
}).sort({ createdAt: -1 }).limit(1)
```

### Check Notifications
```javascript
// Alice's notifications
db.notifications.find({
  userId: ObjectId("alice_id"),
  type: "transaction"
}).sort({ createdAt: -1 })

// Bob's notifications
db.notifications.find({
  userId: ObjectId("bob_id"),
  type: "transaction"
}).sort({ createdAt: -1 })
```

---

## Performance Testing

### Load Test Scenario

**Objective:** Verify system handles multiple concurrent transfers

**Setup:**
- 10 users with balances
- Each sends 1 transfer simultaneously

**Expected:**
- All transfers complete successfully
- No race conditions
- No duplicate transactions
- All balances correct
- Database consistent

### Stress Test

**Objective:** Test system limits

**Test:**
1. Create 100 transfers in rapid succession
2. Monitor server response times
3. Check database performance
4. Verify all transactions processed

**Expected:**
- System remains responsive
- No crashes
- All transactions eventually complete
- Database remains consistent

---

## Troubleshooting Guide

### Issue: "Wallet not found"

**Check:**
1. Does recipient have a wallet for this asset?
   ```javascript
   db.wallets.findOne({ userId: bobId, symbol: 'BTC' })
   ```
2. Is the address correct?
3. Does the wallet belong to a different asset?

**Fix:**
- Create wallet for recipient if missing
- Verify address is correct
- Check asset symbol matches

### Issue: "Insufficient balance"

**Check:**
1. What is sender's balance?
   ```javascript
   db.portfolios.findOne({ userId: aliceId, symbol: 'BTC' })
   ```
2. Is it enough for amount + fee?

**Fix:**
- Add more balance to sender
- Reduce transfer amount

### Issue: Transfer not showing up

**Check:**
1. Was transfer successful?
2. Check database directly
3. Try refreshing the page
4. Check portfolio was updated

**Fix:**
- Verify transaction in database
- Refetch portfolio data
- Check for JavaScript errors

### Issue: Price is $0 or wrong

**Check:**
1. Is CoinGecko API working?
2. Check fallback prices
3. Look for API errors in console

**Fix:**
- Verify internet connection
- Check API rate limits
- Use fallback prices

---

## ✅ Test Results Checklist

After completing all tests, verify:

- [ ] All 6 supported assets work
- [ ] Balances update correctly
- [ ] Transactions created properly
- [ ] Notifications sent
- [ ] Stats updated
- [ ] Fees calculated correctly
- [ ] Prices fetched accurately
- [ ] Validation works
- [ ] Error handling works
- [ ] UI is responsive
- [ ] No crashes or bugs
- [ ] Database remains consistent
- [ ] Security validations pass

---

## 🎉 Ready for Production!

Once all tests pass, the internal transfer system is ready for production use. Users can safely send and receive cryptocurrency within the platform!

**Happy Testing! 🚀**

