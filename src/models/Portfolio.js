import mongoose from 'mongoose'

const portfolioSchema = new mongoose.Schema({
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
  holdings: {
    type: Number,
    required: [true, 'Holdings amount is required'],
    min: [0, 'Holdings cannot be negative'],
    default: 0,
  },
  averageBuyPrice: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
})

// Compound index for userId + symbol (one entry per user per coin)
portfolioSchema.index({ userId: 1, symbol: 1 }, { unique: true })

// Index for faster queries
portfolioSchema.index({ createdAt: -1 })

// Static method to get user's complete portfolio
portfolioSchema.statics.getUserPortfolio = function(userId) {
  return this.find({ userId, holdings: { $gt: 0 } }).sort({ createdAt: -1 })
}

// Static method to update or create holding
portfolioSchema.statics.updateHolding = async function(userId, symbol, holdings, averageBuyPrice) {
  return this.findOneAndUpdate(
    { userId, symbol: symbol.toUpperCase() },
    { 
      holdings,
      averageBuyPrice: averageBuyPrice || 0,
    },
    { 
      upsert: true, 
      new: true,
      runValidators: true,
    }
  )
}

// Static method to add to holding (for buys)
portfolioSchema.statics.addToHolding = async function(userId, symbol, amount, price) {
  const existing = await this.findOne({ userId, symbol: symbol.toUpperCase() })
  
  if (existing && existing.holdings > 0) {
    // Calculate new average buy price
    const totalCost = (existing.holdings * existing.averageBuyPrice) + (amount * price)
    const newHoldings = existing.holdings + amount
    const newAverageBuyPrice = totalCost / newHoldings
    
    return this.findOneAndUpdate(
      { userId, symbol: symbol.toUpperCase() },
      { 
        holdings: newHoldings,
        averageBuyPrice: newAverageBuyPrice,
      },
      { new: true }
    )
  } else {
    // Create new holding
    return this.create({
      userId,
      symbol: symbol.toUpperCase(),
      holdings: amount,
      averageBuyPrice: price,
    })
  }
}

// Static method to subtract from holding (for sells/sends)
portfolioSchema.statics.subtractFromHolding = async function(userId, symbol, amount) {
  const existing = await this.findOne({ userId, symbol: symbol.toUpperCase() })
  
  if (!existing || existing.holdings < amount) {
    throw new Error('Insufficient holdings')
  }
  
  const newHoldings = existing.holdings - amount
  
  return this.findOneAndUpdate(
    { userId, symbol: symbol.toUpperCase() },
    { holdings: newHoldings },
    { new: true }
  )
}

// Prevent model recompilation in development
const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioSchema)

export default Portfolio

