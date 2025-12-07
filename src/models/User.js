import mongoose from 'mongoose'
import validator from 'validator'

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [50, 'First name cannot exceed 50 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [50, 'Last name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email address',
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false, // Don't include password in queries by default
  },
  avatar: {
    type: String,
    default: null,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
    default: null,
  },
  emailVerificationExpires: {
    type: Date,
    default: null,
  },
  passwordResetToken: {
    type: String,
    default: null,
  },
  passwordResetExpires: {
    type: Date,
    default: null,
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  twoFactorSecret: {
    type: String,
    default: null,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'deleted'],
    default: 'active',
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
    default: null,
  },
  preferences: {
    currency: {
      type: String,
      default: 'USD',
    },
    language: {
      type: String,
      default: 'en',
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    notifications: {
      email: { type: Boolean, default: true },
      priceAlerts: { type: Boolean, default: true },
      transactionAlerts: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
    },
  },
  kycStatus: {
    type: String,
    enum: ['none', 'pending', 'verified', 'rejected'],
    default: 'none',
  },
  agreedToTerms: {
    type: Boolean,
    required: [true, 'You must agree to the terms of service'],
    default: false,
  },
  termsAgreedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password
      delete ret.twoFactorSecret
      delete ret.emailVerificationToken
      delete ret.passwordResetToken
      delete ret.__v
      return ret
    }
  }
})

// Index for faster queries
userSchema.index({ email: 1 })
userSchema.index({ status: 1 })
userSchema.index({ createdAt: -1 })

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`
})

// Method to compare password (plain text comparison)
userSchema.methods.comparePassword = function(candidatePassword) {
  return this.password === candidatePassword
}

// Method to check if account is locked
userSchema.methods.isLocked = function() {
  return this.lockUntil && this.lockUntil > Date.now()
}

// Method to increment login attempts
userSchema.methods.incrementLoginAttempts = async function() {
  // Reset login attempts if lock has expired
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    })
  }
  
  const updates = { $inc: { loginAttempts: 1 } }
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }
  }
  
  return this.updateOne(updates)
}

// Static method to find user by email (including password for auth)
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() }).select('+password')
}

// Static method to check if email exists
userSchema.statics.emailExists = async function(email) {
  const user = await this.findOne({ email: email.toLowerCase() })
  return !!user
}

// Prevent model recompilation in development
const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User

