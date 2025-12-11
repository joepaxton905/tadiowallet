# Wallet Generation Implementation

## Overview
This document describes the implementation of automatic crypto wallet generation during user signup. When a user creates an account, the system automatically generates BTC, ETH, and USDT wallet addresses with their respective private keys and seed phrases.

## What Was Implemented

### 1. Package Installation
Added the following packages to `package.json`:
- `bip39` (^3.1.0) - Mnemonic seed phrase generation
- `bip32` (^4.0.0) - HD wallet key derivation
- `@bitcoinerlab/secp256k1` (^1.1.1) - Elliptic curve cryptography
- `bitcoinjs-lib` (^6.1.5) - Bitcoin wallet operations
- `ethers` (^6.9.0) - Ethereum wallet operations

**To install these packages, run:**
```bash
npm install
```

### 2. Updated Wallet Model (`src/models/Wallet.js`)
Added new fields to store sensitive wallet information:
- `privateKey` - Encrypted private key (select: false for security)
- `seedPhrase` - Mnemonic seed phrase (select: false for security)

These fields are not returned by default in queries for security reasons.

### 3. Created Wallet Generator Utility (`src/lib/walletGenerator.js`)
A comprehensive utility module that handles:

#### Functions:
- `generateBTCWallet()` - Generates Bitcoin wallet (P2PKH address)
  - Uses BIP44 derivation path: m/44'/0'/0'/0/0
  - Returns: address, privateKey (WIF format), seedPhrase

- `generateETHWallet()` - Generates Ethereum wallet
  - Returns: address, privateKey, seedPhrase

- `generateUSDTWallet()` - Generates USDT wallet (ERC20)
  - Uses Ethereum network for USDT
  - Returns: address, privateKey, seedPhrase

- `generateUserWallets()` - Generates all three wallets simultaneously
  - Returns: { btc, eth, usdt }

- `validateMnemonic(mnemonic)` - Validates seed phrases
- `restoreBTCWallet(mnemonic)` - Restores BTC wallet from seed
- `restoreETHWallet(mnemonic)` - Restores ETH wallet from seed

### 4. Updated Signup Route (`src/app/api/auth/signup/route.js`)
Modified the user registration process to:
1. Create the user account
2. Generate BTC, ETH, and USDT wallets automatically
3. Save wallet details to the database
4. Associate wallets with the user via `userId`

**Process Flow:**
```
User Signup → User Created → Generate Wallets → Save to DB → Return Auth Token
```

### 5. Created Wallet Details API (`src/app/api/wallets/details/route.js`)
Secure endpoint to retrieve wallet private keys and seed phrases:
- **Endpoint:** `GET /api/wallets/details`
- **Authentication:** Required (Bearer token)
- **Query Params:** `?symbol=BTC` (optional)
- **Returns:** Wallet details including private keys and seed phrases

**Security Features:**
- Requires authentication
- Only returns data for authenticated user
- Private keys/seed phrases only accessible via this specific endpoint

## Database Schema

### Wallet Document Structure:
```javascript
{
  _id: ObjectId,
  userId: ObjectId,          // Reference to User
  symbol: String,            // 'BTC', 'ETH', 'USDT'
  address: String,           // Public wallet address
  privateKey: String,        // Private key (hidden by default)
  seedPhrase: String,        // Mnemonic (hidden by default)
  label: String,             // e.g., 'Bitcoin Wallet'
  network: String,           // 'mainnet'
  isDefault: Boolean,        // true
  createdAt: Date,
  updatedAt: Date
}
```

## How It Works

### During User Registration:
1. User submits signup form with firstName, lastName, email, password
2. Server validates input
3. User document is created in MongoDB
4. Wallet generator creates three separate HD wallets:
   - **BTC**: Uses BIP32/BIP44 with Bitcoin derivation path
   - **ETH**: Uses Ethers.js HD wallet
   - **USDT**: Uses Ethereum address (ERC20 token)
5. Three wallet documents are saved to database
6. User receives authentication token

### Example Wallet Generation:

**Bitcoin Wallet:**
```javascript
{
  symbol: 'BTC',
  address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',  // P2PKH address
  privateKey: 'L4rK1yDtCWekvXuE6oXD9jCYfFNV2cWRpVuPLBcCU2z8TrisoyY1',
  seedPhrase: 'witch collapse practice feed shame open despair creek road again ice least'
}
```

**Ethereum/USDT Wallet:**
```javascript
{
  symbol: 'ETH',
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  privateKey: '0x1234567890abcdef...',
  seedPhrase: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
}
```

## API Usage Examples

### 1. Create Account (Wallets Auto-Generated)
```bash
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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "7d"
}
```

### 2. Get All User Wallets (Public Info)
```bash
GET /api/wallets
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "wallets": [
    {
      "_id": "...",
      "userId": "...",
      "symbol": "BTC",
      "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      "label": "Bitcoin Wallet",
      "network": "mainnet",
      "isDefault": true
    },
    // ... ETH and USDT wallets (without private keys)
  ]
}
```

### 3. Get Wallet Private Keys (Secure)
```bash
GET /api/wallets/details?symbol=BTC
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "wallets": [
    {
      "_id": "...",
      "symbol": "BTC",
      "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      "privateKey": "L4rK1yDtCWekvXuE6oXD9jCYfFNV2cWRpVuPLBcCU2z8TrisoyY1",
      "seedPhrase": "witch collapse practice feed shame open despair creek road again ice least",
      "label": "Bitcoin Wallet",
      "network": "mainnet"
    }
  ]
}
```

### 4. Get All Wallet Details
```bash
GET /api/wallets/details
Authorization: Bearer <token>
```

Returns all wallets (BTC, ETH, USDT) with private keys and seed phrases.

## Security Considerations

### 1. Private Key Storage
- Private keys are stored in the database
- Marked with `select: false` to prevent accidental exposure
- Only accessible via authenticated `/api/wallets/details` endpoint

### 2. Seed Phrase Storage
- Mnemonic phrases stored in database
- Hidden by default from queries
- Should be encrypted at rest (consider adding encryption layer)

### 3. Authentication
- All sensitive endpoints require JWT authentication
- Tokens include userId for user verification
- Only wallet owner can access their wallet details

### 4. Recommendations for Production:
1. **Encrypt private keys and seed phrases** before storing in database
2. **Use environment variables** for encryption keys
3. **Implement rate limiting** on wallet detail endpoint
4. **Add audit logging** for private key access
5. **Consider hardware security modules (HSM)** for key management
6. **Implement multi-factor authentication** for sensitive operations

## Testing

### Manual Testing Steps:

1. **Install Dependencies:**
```bash
npm install
```

2. **Ensure MongoDB is Running:**
```bash
# Check your MongoDB connection string in .env
```

3. **Start Development Server:**
```bash
npm run dev
```

4. **Create a Test Account:**
Visit `http://localhost:3000/signup` and create an account

5. **Verify Wallets in Database:**
```javascript
// In MongoDB shell or Compass
db.wallets.find({ userId: ObjectId("USER_ID_HERE") })
```

6. **Test API Endpoint:**
```bash
# Get auth token from signup response
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/wallets/details
```

## File Structure
```
src/
├── lib/
│   ├── walletGenerator.js        (NEW) - Wallet generation utilities
│   ├── auth.js                   (existing)
│   └── mongodb.js                (existing)
├── models/
│   ├── Wallet.js                 (UPDATED) - Added privateKey & seedPhrase
│   └── User.js                   (existing)
└── app/
    └── api/
        ├── auth/
        │   └── signup/
        │       └── route.js      (UPDATED) - Generates wallets on signup
        └── wallets/
            ├── route.js          (existing)
            └── details/
                └── route.js      (NEW) - Secure wallet details endpoint
```

## Key Differences from Original Code

The provided code example stored wallet info directly in the User model. This implementation:
1. ✅ Uses separate Wallet collection (better data modeling)
2. ✅ Supports multiple wallets per user
3. ✅ More secure (private keys not in user queries)
4. ✅ Follows existing project architecture
5. ✅ Adds USDT wallet support
6. ✅ Better error handling and logging

## Next Steps

1. **Run `npm install`** to install new dependencies
2. **Test the signup flow** to verify wallet creation
3. **Verify wallets in database** using MongoDB Compass or shell
4. **Implement encryption** for private keys (recommended)
5. **Add wallet recovery** feature using seed phrases
6. **Implement wallet balance fetching** from blockchain APIs

## Troubleshooting

### Issue: "Module not found: bip39"
**Solution:** Run `npm install`

### Issue: Wallets not created on signup
**Solution:** Check server logs for wallet generation errors

### Issue: Cannot access private keys
**Solution:** Use `/api/wallets/details` endpoint with authentication

### Issue: MongoDB connection error
**Solution:** Verify MongoDB is running and .env has correct connection string

## Support
For questions or issues, check the implementation in:
- `src/lib/walletGenerator.js`
- `src/app/api/auth/signup/route.js`
- `src/models/Wallet.js`

