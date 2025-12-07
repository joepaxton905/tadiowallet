import mongoose from 'mongoose'

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  symbol: {
    type: String,
    required: [true, 'Symbol is required'],
    uppercase: true,
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Wallet address is required'],
    trim: true,
  },
  label: {
    type: String,
    default: 'Main Wallet',
    trim: true,
  },
  network: {
    type: String,
    default: 'mainnet',
  },
  isDefault: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
})

// Compound index for userId + symbol
walletSchema.index({ userId: 1, symbol: 1 })
walletSchema.index({ userId: 1, isDefault: 1 })

// Static method to get user's wallet for a specific symbol
walletSchema.statics.getUserWallet = function(userId, symbol) {
  return this.findOne({ 
    userId, 
    symbol: symbol.toUpperCase(),
    isDefault: true,
  })
}

// Static method to get all user wallets
walletSchema.statics.getUserWallets = function(userId) {
  return this.find({ userId }).sort({ isDefault: -1, createdAt: -1 })
}

// Static method to create or update wallet
walletSchema.statics.upsertWallet = async function(userId, symbol, address, label = 'Main Wallet') {
  return this.findOneAndUpdate(
    { userId, symbol: symbol.toUpperCase(), isDefault: true },
    { 
      address,
      label,
      network: 'mainnet',
    },
    { 
      upsert: true, 
      new: true,
      runValidators: true,
    }
  )
}

// Generate a mock wallet address (for demo purposes - in production, use real wallet generation)
walletSchema.statics.generateMockAddress = function(symbol) {
  const randomHex = () => Math.floor(Math.random() * 16).toString(16)
  const randomAddress = '0x' + Array.from({ length: 40 }, randomHex).join('')
  return randomAddress
}

// Prevent model recompilation in development
const Wallet = mongoose.models.Wallet || mongoose.model('Wallet', walletSchema)

export default Wallet

