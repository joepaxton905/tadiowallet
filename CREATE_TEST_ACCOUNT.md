# Create Test Account - SIMPLE INSTRUCTIONS

## 🎯 ONE-CLICK DATABASE SEEDING

### Step 1: Make Sure Dev Server is Running
```bash
npm run dev
```

### Step 2: Visit This URL in Your Browser
```
http://localhost:3000/api/seed
```

### Step 3: You'll See This Response
```json
{
  "success": true,
  "message": "Test account created and populated in DATABASE!",
  "credentials": {
    "email": "test@example.com",
    "password": "Test1234"
  },
  "stats": {
    "portfolioItems": 8,
    "transactions": 6,
    "wallets": 8,
    "notifications": 4
  }
}
```

### Step 4: Login
1. Go to: http://localhost:3000/login
2. Enter:
   - Email: **test@example.com**
   - Password: **Test1234**
3. View your portfolio!

---

## ✅ What Gets Created in DATABASE:

### 1. User Account (users collection)
- Email: test@example.com
- Password: Test1234 (plain text)
- Name: Test User

### 2. Portfolio Holdings (portfolios collection)
- 1.45 BTC
- 12.5 ETH
- 150 SOL
- 10,000 ADA
- 5,000 MATIC
- 100 AVAX
- 200 LINK
- 300 DOT

### 3. Transactions (transactions collection)
- 6 different transactions
- Types: buy, sell, send, receive, swap
- Complete with amounts, fees, status

### 4. Wallets (wallets collection)
- 8 wallet addresses
- One for each cryptocurrency
- Auto-generated addresses

### 5. Notifications (notifications collection)
- 4 notifications
- Price alerts, transaction alerts, security alerts
- Mix of read/unread

---

## 🔄 Need to Reset?

Visit the seed URL again - it will tell you account already exists.

To delete and recreate:
1. Delete the user from MongoDB
2. Visit the seed URL again

---

## 💾 Verify Data is in MongoDB

Check your MongoDB database (Compass or shell):
```javascript
// Show all users
db.users.find()

// Show portfolios (CRYPTO BALANCES)
db.portfolios.find()

// Show transactions
db.transactions.find()

// Show wallets
db.wallets.find()
```

**Everything is stored in MongoDB, NOT localStorage!**

---

That's it! Just visit the URL and login! 🚀

