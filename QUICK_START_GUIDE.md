# Quick Start Guide - TadioWallet Real Data Integration

## 🚀 Getting Started

### 1. Environment Setup
Ensure your `.env` file has:
```env
MONGODB_URI=mongodb://localhost:27017/tadiowallet
# or your MongoDB Atlas connection string
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

---

## 📝 Creating Your First User

1. Go to `http://localhost:3000/signup`
2. Fill in the signup form
3. You'll be automatically logged in after signup

---

## 🎯 Adding Test Data (Browser Console Method)

After logging in, open browser console (F12) and run these commands:

### Add Portfolio Holdings
```javascript
const token = localStorage.getItem('authToken');

// Add Bitcoin
fetch('/api/portfolio', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    symbol: 'BTC',
    holdings: 1.5,
    averageBuyPrice: 42000
  })
}).then(r => r.json()).then(console.log);

// Add Ethereum
fetch('/api/portfolio', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    symbol: 'ETH',
    holdings: 10,
    averageBuyPrice: 2200
  })
}).then(r => r.json()).then(console.log);
```

### Add Transactions
```javascript
// Add a buy transaction
fetch('/api/transactions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    type: 'buy',
    asset: 'BTC',
    assetName: 'Bitcoin',
    assetIcon: '₿',
    assetColor: '#F7931A',
    amount: 0.5,
    price: 43000,
    value: 21500,
    fee: 10,
    status: 'completed'
  })
}).then(r => r.json()).then(console.log);
```

### Add Notifications
```javascript
// Add a notification
fetch('/api/notifications', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    type: 'price_alert',
    title: 'Bitcoin Price Alert',
    message: 'BTC has reached $43,000!'
  })
}).then(r => r.json()).then(console.log);
```

---

## 📱 Using the Application

### Dashboard
- Shows your **real portfolio balance** calculated from your holdings × live prices
- Displays your **actual assets** with live market data
- Shows your **recent transactions** from the database

### Portfolio Page
- View all your **real holdings** with allocation breakdown
- See accurate **24h profit/loss** based on live prices
- Pie chart shows your actual asset allocation

### Transactions Page
- View your **complete transaction history** from database
- Filter by type (buy, sell, send, receive, swap)
- Search by asset name or symbol

### Send Page
- Only shows assets you **actually own**
- Displays your **real available balance**
- Max button uses your actual holdings

### Receive Page
- Shows your **real wallet addresses** from database
- Auto-generates addresses if they don't exist
- Each cryptocurrency has its own wallet address

### Settings Page
- Edit your **real profile** (first name, last name)
- Update **preferences** (currency, language, notifications)
- All changes save to MongoDB

---

## 🔧 API Endpoints Reference

### Portfolio
- `GET /api/portfolio` - Get all holdings
- `POST /api/portfolio` - Create/update holding
- `PATCH /api/portfolio` - Add/subtract from holding

### Transactions
- `GET /api/transactions` - Get transaction history
- `GET /api/transactions?type=buy` - Filter by type
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/stats` - Get statistics

### Wallets
- `GET /api/wallets` - Get all wallets
- `GET /api/wallets?symbol=BTC` - Get specific wallet
- `POST /api/wallets` - Create/update wallet

### Notifications
- `GET /api/notifications` - Get notifications
- `POST /api/notifications` - Create notification
- `PATCH /api/notifications` - Mark as read

### User Profile
- `GET /api/user/profile` - Get user profile
- `PATCH /api/user/profile` - Update profile

---

## 🎨 What's Real vs. Mock

### ✅ Real Data (from MongoDB)
- Portfolio holdings
- Transaction history
- Wallet addresses
- Notifications
- User profile & preferences

### 🔴 Still Using External APIs
- **Crypto prices** (CoinGecko API) - This is correct!
- Market data (volume, market cap)
- These should remain external as they're real-time market data

### 📊 Mock Data (Visual Only)
- **Portfolio history chart** - Shows sample historical data
  - Implementing real history requires background jobs
  - Not critical for MVP

---

## 🐛 Troubleshooting

### "Unauthorized" errors
- Check if you're logged in
- Verify token exists: `localStorage.getItem('authToken')`
- Token might be expired - try logging in again

### Empty portfolio/transactions
- You need to add data first (see "Adding Test Data" above)
- New accounts start with no data

### Database connection errors
- Check MongoDB is running
- Verify MONGODB_URI in `.env`
- Check MongoDB logs for connection issues

### Pages show loading forever
- Check browser console for errors
- Verify API routes are working: `curl http://localhost:3000/api/portfolio`
- Check MongoDB connection

---

## 💡 Tips

1. **Start with portfolio data** - Add some holdings first so you see your balance
2. **Add a few transactions** - Makes the transactions page more interesting
3. **Create notifications** - Test the notification system
4. **Update your profile** - Personalize your account

---

## 🔐 Security Notes

- Passwords are stored in **plain text** (as per requirements)
- All API routes check JWT authentication
- Users can only access their own data
- Token stored in localStorage (persistent) or sessionStorage (session only)

---

## 📚 Additional Resources

- See `IMPLEMENTATION_SUMMARY.md` for complete technical details
- See `scripts/seed-example.js` for bulk data seeding
- Check API route files in `src/app/api/` for endpoint documentation

---

## 🎉 You're All Set!

Your TadioWallet now uses **real MongoDB data** for everything user-related. Enjoy building!

For questions or issues, check the implementation summary or review the code comments.

