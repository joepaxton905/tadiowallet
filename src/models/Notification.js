import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: [true, 'Notification type is required'],
    enum: ['price_alert', 'transaction', 'security', 'reward', 'general'],
    default: 'general',
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters'],
  },
  read: {
    type: Boolean,
    default: false,
  },
  link: {
    type: String,
    trim: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
})

// Indexes for faster queries
notificationSchema.index({ userId: 1, createdAt: -1 })
notificationSchema.index({ userId: 1, read: 1 })
notificationSchema.index({ userId: 1, type: 1 })

// Virtual for relative time
notificationSchema.virtual('time').get(function() {
  const now = new Date()
  const diff = now - this.createdAt
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  return 'Just now'
})

// Ensure virtuals are included in JSON
notificationSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v
    return ret
  }
})

// Static method to get user notifications
notificationSchema.statics.getUserNotifications = function(userId, limit = 50) {
  return this.find({ userId }).sort({ createdAt: -1 }).limit(limit)
}

// Static method to get unread count
notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ userId, read: false })
}

// Static method to mark all as read
notificationSchema.statics.markAllAsRead = function(userId) {
  return this.updateMany({ userId, read: false }, { read: true })
}

// Static method to create notification
notificationSchema.statics.createNotification = function(userId, type, title, message, metadata = {}) {
  return this.create({
    userId,
    type,
    title,
    message,
    metadata,
  })
}

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.read = true
  return this.save()
}

// Prevent model recompilation in development
const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema)

export default Notification

