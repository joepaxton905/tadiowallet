import mongoose from 'mongoose'

const activityLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      'user_login',
      'user_register',
      'user_suspended',
      'user_activated',
      'user_deleted',
      'transaction_created',
      'portfolio_updated',
      'wallet_created',
      'admin_login',
      'admin_action',
      'system_event',
      'password_reset',
      'email_verified',
      'settings_changed'
    ]
  },
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // null for system events
  },
  actorType: {
    type: String,
    enum: ['user', 'admin', 'system'],
    required: true
  },
  target: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'targetModel',
    default: null
  },
  targetModel: {
    type: String,
    enum: ['User', 'Transaction', 'Portfolio', 'Wallet', null],
    default: null
  },
  description: {
    type: String,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  severity: {
    type: String,
    enum: ['info', 'warning', 'error', 'critical'],
    default: 'info'
  },
  status: {
    type: String,
    enum: ['success', 'failure', 'pending'],
    default: 'success'
  }
}, {
  timestamps: true
})

// Indexes for efficient querying
activityLogSchema.index({ createdAt: -1 })
activityLogSchema.index({ actor: 1, createdAt: -1 })
activityLogSchema.index({ action: 1, createdAt: -1 })
activityLogSchema.index({ actorType: 1 })

// Static method to log activity
activityLogSchema.statics.log = async function(data) {
  try {
    return await this.create(data)
  } catch (error) {
    console.error('Error logging activity:', error)
    // Don't throw error to prevent breaking the main flow
    return null
  }
}

const ActivityLog = mongoose.models.ActivityLog || mongoose.model('ActivityLog', activityLogSchema)

export default ActivityLog

