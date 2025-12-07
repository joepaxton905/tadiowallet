import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: [true, 'Transaction type is required'],
    enum: ['buy', 'sell', 'send', 'receive', 'swap', 'stake', 'unstake'],
  },
  asset: {
    type: String,
    required: [true, 'Asset symbol is required'],
    uppercase: true,
  },
  assetName: {
    type: String,
    required: true,
  },
  assetIcon: {
    type: String,
    default: '●',
  },
  assetColor: {
    type: String,
    default: '#888888',
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0,
  },
  price: {
    type: Number,
    default: 0,
    min: 0,
  },
  value: {
    type: Number,
    required: [true, 'Transaction value is required'],
    min: 0,
  },
  fee: {
    type: Number,
    default: 0,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'active', 'cancelled'],
    default: 'completed',
  },
  // For swaps
  toAsset: {
    type: String,
    uppercase: true,
  },
  toAmount: {
    type: Number,
    min: 0,
  },
  // For send transactions
  to: {
    type: String,
  },
  // For receive transactions
  from: {
    type: String,
  },
  // For staking
  apy: {
    type: Number,
    min: 0,
  },
  // Transaction hash (if applicable)
  txHash: {
    type: String,
  },
  // Additional notes
  notes: {
    type: String,
  },
}, {
  timestamps: true,
})

// Indexes for faster queries
transactionSchema.index({ userId: 1, createdAt: -1 })
transactionSchema.index({ userId: 1, type: 1 })
transactionSchema.index({ userId: 1, asset: 1 })
transactionSchema.index({ status: 1 })

// Virtual for formatted date
transactionSchema.virtual('date').get(function() {
  return this.createdAt
})

// Ensure virtuals are included when converting to JSON
transactionSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v
    return ret
  }
})

transactionSchema.set('toObject', {
  virtuals: true
})

// Static method to get user transactions with filters
transactionSchema.statics.getUserTransactions = function(userId, filters = {}) {
  const query = { userId }
  
  if (filters.type && filters.type !== 'all') {
    query.type = filters.type
  }
  
  if (filters.asset) {
    query.asset = filters.asset.toUpperCase()
  }
  
  if (filters.status) {
    query.status = filters.status
  }
  
  return this.find(query).sort({ createdAt: -1 }).limit(filters.limit || 100)
}

// Static method to get user transaction stats
transactionSchema.statics.getUserStats = async function(userId) {
  const transactions = await this.find({ userId, status: 'completed' })
  
  let totalBought = 0
  let totalSold = 0
  let totalFees = 0
  
  transactions.forEach(tx => {
    if (tx.type === 'buy') totalBought += tx.value
    if (tx.type === 'sell') totalSold += tx.value
    totalFees += tx.fee || 0
  })
  
  return {
    totalTransactions: transactions.length,
    totalBought,
    totalSold,
    totalFees,
    netProfit: totalSold - totalBought,
  }
}

// Method to mark transaction as completed
transactionSchema.methods.markCompleted = function() {
  this.status = 'completed'
  return this.save()
}

// Method to mark transaction as failed
transactionSchema.methods.markFailed = function() {
  this.status = 'failed'
  return this.save()
}

// Prevent model recompilation in development
const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema)

export default Transaction

