# 🚀 Wallet Generation - Quick Reference

## Installation
```bash
npm install
```

## Test Wallet Generation
```bash
node test-wallet-generation.js
```

## How It Works

### When a User Signs Up:
```
User Signup
    ↓
Create User Account
    ↓
Generate BTC Wallet
    ↓
Generate ETH Wallet  
    ↓
Generate USDT Wallet
    ↓
Save All to Database
    ↓
Return Auth Token
```

## API Endpoints

### 1. Signup (Creates User + Wallets)
```http
POST /api/auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com", 
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "agreedToTerms": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": { ... },
  "token": "eyJhbGci..."
}
```

**What Happens Behind the Scenes:**
- User account created ✅
- BTC wallet generated and saved ✅
- ETH wallet generated and saved ✅  
- USDT wallet generated and saved ✅

### 2. Get Wallets (Public Info Only)
```http
GET /api/wallets
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "wallets": [
    { "symbol": "BTC", "address": "1A1zP1...", "label": "Bitcoin Wallet" },
    { "symbol": "ETH", "address": "0x742d3...", "label": "Ethereum Wallet" },
    { "symbol": "USDT", "address": "0x8f3Cf...", "label": "USDT Wallet" }
  ]
}
```

**Note:** No private keys in this response

### 3. Get Wallet Details (Includes Private Keys)
```http
GET /api/wallets/details
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "wallets": [
    {
      "symbol": "BTC",
      "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      "privateKey": "L4rK1yDtCWekvXuE6oXD9jCYfFNV2cWRpVuPLBcCU2z8TrisoyY1",
      "seedPhrase": "witch collapse practice feed shame open despair creek...",
      "label": "Bitcoin Wallet"
    },
    { ... ETH wallet with keys ... },
    { ... USDT wallet with keys ... }
  ]
}
```

### 4. Get Specific Wallet Details
```http
GET /api/wallets/details?symbol=BTC
Authorization: Bearer <token>
```

## Wallet Types Generated

| Symbol | Network | Address Format | Example |
|--------|---------|---------------|---------|
| BTC | Bitcoin Mainnet | P2PKH (starts with 1) | `1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa` |
| ETH | Ethereum Mainnet | Hex (starts with 0x) | `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb` |
| USDT | Ethereum (ERC20) | Hex (starts with 0x) | `0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063` |

## Database Schema

```javascript
// Wallet Document
{
  userId: ObjectId,           // References User._id
  symbol: "BTC",             // "BTC", "ETH", or "USDT"
  address: String,           // Public wallet address
  privateKey: String,        // Private key (hidden by default)
  seedPhrase: String,        // 12-word mnemonic (hidden by default)
  label: String,             // "Bitcoin Wallet", etc.
  network: "mainnet",
  isDefault: true,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Notes

🔒 **Private Keys**
- Stored in database with `select: false`
- Not returned in regular wallet queries
- Only accessible via `/api/wallets/details` endpoint
- Requires authentication

🔒 **Seed Phrases**
- 12-word BIP39 mnemonic
- Stored with `select: false`
- Can restore wallet if private key lost
- Requires authentication to access

🔒 **Authentication**
- All wallet endpoints require JWT token
- Token generated during signup/login
- Users can only access their own wallets

## Key Functions (walletGenerator.js)

```javascript
// Generate all three wallets at once
const { btc, eth, usdt } = await generateUserWallets()

// Generate individual wallets
const btc = await generateBTCWallet()
const eth = await generateETHWallet()  
const usdt = await generateUSDTWallet()

// Validate seed phrase
const isValid = validateMnemonic("your seed phrase here")

// Restore wallets from seed phrase
const btc = await restoreBTCWallet("your seed phrase")
const eth = restoreETHWallet("your seed phrase")
```

## Files Changed

### Modified:
- `package.json` - Added crypto packages
- `src/models/Wallet.js` - Added privateKey & seedPhrase
- `src/app/api/auth/signup/route.js` - Integrated wallet generation

### Created:
- `src/lib/walletGenerator.js` - Wallet generation utility
- `src/app/api/wallets/details/route.js` - Secure details endpoint
- `test-wallet-generation.js` - Test script
- Documentation files

## Testing Steps

1. **Install packages:**
   ```bash
   npm install
   ```

2. **Test wallet generation:**
   ```bash
   node test-wallet-generation.js
   ```

3. **Start app:**
   ```bash
   npm run dev
   ```

4. **Create test user:**
   - Visit signup page or use API
   - Fill in user details
   - Submit form

5. **Verify in database:**
   ```javascript
   // MongoDB shell or Compass
   db.users.findOne({ email: "test@example.com" })
   db.wallets.find({ userId: ObjectId("user_id") })
   ```

6. **Retrieve wallet details:**
   ```bash
   curl -H "Authorization: Bearer TOKEN" \
     http://localhost:3000/api/wallets/details
   ```

## Example Wallet Data

**Bitcoin (BTC):**
```json
{
  "symbol": "BTC",
  "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  "privateKey": "L4rK1yDtCWekvXuE6oXD9jCYfFNV2cWRpVuPLBcCU2z8TrisoyY1",
  "seedPhrase": "witch collapse practice feed shame open despair creek road again ice least"
}
```

**Ethereum (ETH):**
```json
{
  "symbol": "ETH",
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "privateKey": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  "seedPhrase": "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
}
```

**USDT (ERC20):**
```json
{
  "symbol": "USDT",
  "address": "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  "privateKey": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
  "seedPhrase": "word word word word word word word word word word word word"
}
```

## Common Issues

| Issue | Solution |
|-------|----------|
| Module not found: bip39 | Run `npm install` |
| Wallets not created | Check server logs during signup |
| Can't access private keys | Use `/api/wallets/details` endpoint |
| Unauthorized error | Include Bearer token in Authorization header |

## Production Recommendations

Before deploying to production:

1. ✅ Add encryption for private keys in database
2. ✅ Use environment variables for encryption keys
3. ✅ Implement rate limiting on wallet endpoints
4. ✅ Add audit logging for private key access
5. ✅ Set up backup system for wallet data
6. ✅ Implement 2FA for sensitive operations
7. ✅ Consider hardware security modules (HSM)
8. ✅ Regular security audits

## Support

📖 Full documentation: `WALLET_GENERATION_IMPLEMENTATION.md`  
📋 Implementation summary: `IMPLEMENTATION_COMPLETE.md`  
🧪 Test script: `test-wallet-generation.js`  

---

**Created by:** AI Assistant  
**Date:** December 11, 2025  
**Version:** 1.0.0

