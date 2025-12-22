import mongoose from 'mongoose'

const userStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  },
  // Portfolio Metrics
  portfolioValue: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalBalance: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalInvested: {
    type: Number,
    default: 0,
    min: 0,
  },
  profitLoss: {
    type: Number,
    default: 0,
  },
  profitLossPercentage: {
    type: Number,
    default: 0,
  },
  // Transaction Metrics
  totalTransactions: {
    type: Number,
    default: 0,
    min: 0,
  },
  completedTransactions: {
    type: Number,
    default: 0,
    min: 0,
  },
  pendingTransactions: {
    type: Number,
    default: 0,
    min: 0,
  },
  failedTransactions: {
    type: Number,
    default: 0,
    min: 0,
  },
  // Transaction Type Counts
  buyTransactions: {
    type: Number,
    default: 0,
    min: 0,
  },
  sellTransactions: {
    type: Number,
    default: 0,
    min: 0,
  },
  sendTransactions: {
    type: Number,
    default: 0,
    min: 0,
  },
  receiveTransactions: {
    type: Number,
    default: 0,
    min: 0,
  },
  swapTransactions: {
    type: Number,
    default: 0,
    min: 0,
  },
  // Transaction Volume
  totalVolume: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalFees: {
    type: Number,
    default: 0,
    min: 0,
  },
  // Portfolio Composition
  numberOfAssets: {
    type: Number,
    default: 0,
    min: 0,
  },
  largestHolding: {
    symbol: String,
    value: {
      type: Number,
      default: 0,
    },
  },
  // Activity Metrics
  lastTransactionDate: {
    type: Date,
    default: null,
  },
  accountAge: {
    type: Number, // Days since account creation
    default: 0,
  },
  // Last calculation timestamp
  lastCalculated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
})

// Indexes for faster queries
userStatsSchema.index({ portfolioValue: -1 })
userStatsSchema.index({ totalTransactions: -1 })
userStatsSchema.index({ lastCalculated: 1 })

// Static method to calculate stats for a user
userStatsSchema.statics.calculateUserStats = async function(userId) {
  const User = mongoose.model('User')
  const Portfolio = mongoose.model('Portfolio')
  const Transaction = mongoose.model('Transaction')

  try {
    // Get user
    const user = await User.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    // Get portfolio
    const portfolio = await Portfolio.find({ userId })
    
    // Get transactions
    const transactions = await Transaction.find({ userId })

    // Calculate portfolio value
    const portfolioValue = portfolio.reduce((sum, holding) => {
      return sum + (holding.holdings * holding.averageBuyPrice)
    }, 0)

    // Calculate total invested (sum of buy transactions)
    const buyTxs = transactions.filter(tx => tx.type === 'buy' && tx.status === 'completed')
    const totalInvested = buyTxs.reduce((sum, tx) => sum + tx.value, 0)

    // Calculate profit/loss
    const profitLoss = portfolioValue - totalInvested
    const profitLossPercentage = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0

    // Count transactions by status
    const completedTransactions = transactions.filter(tx => tx.status === 'completed').length
    const pendingTransactions = transactions.filter(tx => tx.status === 'pending').length
    const failedTransactions = transactions.filter(tx => tx.status === 'failed').length

    // Count transactions by type
    const buyTransactions = transactions.filter(tx => tx.type === 'buy').length
    const sellTransactions = transactions.filter(tx => tx.type === 'sell').length
    const sendTransactions = transactions.filter(tx => tx.type === 'send').length
    const receiveTransactions = transactions.filter(tx => tx.type === 'receive').length
    const swapTransactions = transactions.filter(tx => tx.type === 'swap').length

    // Calculate total volume and fees
    const completedTxs = transactions.filter(tx => tx.status === 'completed')
    const totalVolume = completedTxs.reduce((sum, tx) => sum + tx.value, 0)
    const totalFees = completedTxs.reduce((sum, tx) => sum + (tx.fee || 0), 0)

    // Find largest holding
    let largestHolding = { symbol: '', value: 0 }
    if (portfolio.length > 0) {
      const holdings = portfolio.map(h => ({
        symbol: h.symbol,
        value: h.holdings * h.averageBuyPrice
      }))
      largestHolding = holdings.reduce((max, h) => h.value > max.value ? h : max, holdings[0])
    }

    // Get last transaction date
    const sortedTxs = transactions.sort((a, b) => b.createdAt - a.createdAt)
    const lastTransactionDate = sortedTxs.length > 0 ? sortedTxs[0].createdAt : null

    // Calculate account age in days
    const accountAge = Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24))

    // Prepare stats object
    const stats = {
      userId,
      portfolioValue,
      totalBalance: portfolioValue, // Same as portfolio value
      totalInvested,
      profitLoss,
      profitLossPercentage,
      totalTransactions: transactions.length,
      completedTransactions,
      pendingTransactions,
      failedTransactions,
      buyTransactions,
      sellTransactions,
      sendTransactions,
      receiveTransactions,
      swapTransactions,
      totalVolume,
      totalFees,
      numberOfAssets: portfolio.filter(h => h.holdings > 0).length,
      largestHolding,
      lastTransactionDate,
      accountAge,
      lastCalculated: new Date(),
    }

    // Update or create stats
    const result = await this.findOneAndUpdate(
      { userId },
      stats,
      { upsert: true, new: true, runValidators: true }
    )

    return result
  } catch (error) {
    console.error('Error calculating user stats:', error)
    throw error
  }
}

// Static method to recalculate all user stats
userStatsSchema.statics.recalculateAllStats = async function() {
  const User = mongoose.model('User')
  
  try {
    const users = await User.find({ status: 'active' })
    const results = []

    for (const user of users) {
      try {
        const stats = await this.calculateUserStats(user._id)
        results.push({ userId: user._id, success: true, stats })
      } catch (error) {
        results.push({ userId: user._id, success: false, error: error.message })
      }
    }

    return results
  } catch (error) {
    console.error('Error recalculating all stats:', error)
    throw error
  }
}

// Static method to get stats for a user
userStatsSchema.statics.getUserStats = async function(userId) {
  let stats = await this.findOne({ userId })
  
  // If stats don't exist or are outdated (more than 1 hour old), recalculate
  if (!stats || (Date.now() - stats.lastCalculated > 60 * 60 * 1000)) {
    stats = await this.calculateUserStats(userId)
  }
  
  return stats
}

// Method to check if stats need updating
userStatsSchema.methods.needsUpdate = function() {
  const oneHourAgo = Date.now() - (60 * 60 * 1000)
  return this.lastCalculated < oneHourAgo
}

// Prevent model recompilation in development
const UserStats = mongoose.models.UserStats || mongoose.model('UserStats', userStatsSchema)

export default UserStats

