import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Portfolio from '@/models/Portfolio'
import Transaction from '@/models/Transaction'
import Wallet from '@/models/Wallet'
import Notification from '@/models/Notification'
import UserStats from '@/models/UserStats'
import { requireAdmin } from '@/lib/adminAuth'
import { queueStatsUpdate } from '@/lib/updateUserStats'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/users/[userId]
 * Get detailed user information
 */
export async function GET(request, { params }) {
  try {
    // Check admin authorization
    const authCheck = requireAdmin(request)
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, error: authCheck.error },
        { status: authCheck.status }
      )
    }

    await connectDB()

    const { userId } = params

    // Get user details
    const user = await User.findById(userId).select('-password -twoFactorSecret')

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Get user's portfolio, transactions, wallets, and stats
    const [portfolio, transactions, wallets, notificationCount, userStats] = await Promise.all([
      Portfolio.find({ userId }).lean(),
      Transaction.find({ userId }).sort({ createdAt: -1 }).limit(50).lean(),
      Wallet.find({ userId }).lean(),
      Notification.countDocuments({ userId }),
      UserStats.getUserStats(userId)
    ])

    // Calculate stats
    const stats = await Transaction.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalValue: { $sum: '$value' }
        }
      }
    ])

    return NextResponse.json({
      success: true,
      user: {
        ...user.toObject(),
        portfolio,
        recentTransactions: transactions,
        wallets,
        stats: {
          notifications: notificationCount,
          transactionsByType: stats,
        },
        calculatedStats: userStats,
      },
    })

  } catch (error) {
    console.error('Admin get user error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user details' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/users/[userId]
 * Update user status or information
 */
export async function PATCH(request, { params }) {
  try {
    // Check admin authorization
    const authCheck = requireAdmin(request)
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, error: authCheck.error },
        { status: authCheck.status }
      )
    }

    await connectDB()

    const { userId } = params
    const body = await request.json()
    const { 
      status, 
      kycStatus, 
      role, 
      action,
      firstName,
      lastName,
      email,
      portfolio,
      preferences
    } = body

    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Handle different actions
    if (action === 'suspend') {
      user.status = 'suspended'
      await user.save()
      
      // Create notification for user
      await Notification.createNotification(
        userId,
        'security',
        'Account Suspended',
        'Your account has been suspended. Please contact support for more information.',
        { action: 'suspend', by: 'admin' }
      )
    } else if (action === 'activate') {
      user.status = 'active'
      await user.save()
      
      await Notification.createNotification(
        userId,
        'security',
        'Account Activated',
        'Your account has been activated and is now fully operational.',
        { action: 'activate', by: 'admin' }
      )
    } else if (action === 'delete') {
      user.status = 'deleted'
      await user.save()
    } else if (action === 'updateProfile') {
      // Update profile information
      if (firstName) user.firstName = firstName
      if (lastName) user.lastName = lastName
      if (email) {
        // Check if email is already taken by another user
        const existingUser = await User.findOne({ email, _id: { $ne: userId } })
        if (existingUser) {
          return NextResponse.json(
            { success: false, error: 'Email already in use by another user' },
            { status: 400 }
          )
        }
        user.email = email
      }
      
      await user.save()
      
      await Notification.createNotification(
        userId,
        'security',
        'Profile Updated',
        'Your profile information has been updated by an administrator.',
        { action: 'profile_update', by: 'admin' }
      )
    } else if (action === 'updatePortfolio') {
      // Update portfolio holdings
      if (portfolio && Array.isArray(portfolio)) {
        for (const holding of portfolio) {
          await Portfolio.findOneAndUpdate(
            { userId, symbol: holding.symbol },
            { 
              holdings: holding.holdings,
              averageBuyPrice: holding.averageBuyPrice || 0
            },
            { upsert: true }
          )
        }
      }
      
      await Notification.createNotification(
        userId,
        'general',
        'Portfolio Adjusted',
        'Your portfolio has been adjusted by an administrator.',
        { action: 'portfolio_update', by: 'admin' }
      )
      
      // Force immediate stats recalculation (not queued)
      await UserStats.calculateUserStats(userId)
    } else if (action === 'updateStats') {
      // Direct stats update for manual corrections
      const { stats } = body
      
      console.log('updateStats action received:', { userId, stats })
      
      if (stats) {
        const updateFields = {}
        
        // Allow updating specific stat fields
        if (stats.portfolioValue !== undefined) {
          updateFields.portfolioValue = parseFloat(stats.portfolioValue) || 0
          updateFields.totalBalance = parseFloat(stats.portfolioValue) || 0 // Same as portfolio value
        }
        if (stats.totalInvested !== undefined) {
          updateFields.totalInvested = parseFloat(stats.totalInvested) || 0
        }
        
        // Recalculate dependent values
        if (updateFields.portfolioValue !== undefined && updateFields.totalInvested !== undefined) {
          updateFields.profitLoss = updateFields.portfolioValue - updateFields.totalInvested
          updateFields.profitLossPercentage = updateFields.totalInvested > 0 
            ? (updateFields.profitLoss / updateFields.totalInvested) * 100 
            : 0
        }
        
        updateFields.lastCalculated = new Date()
        
        console.log('Updating UserStats with fields:', updateFields)
        
        const result = await UserStats.findOneAndUpdate(
          { userId },
          updateFields,
          { upsert: true, new: true }
        )
        
        console.log('UserStats updated:', result)
      }
      
      await Notification.createNotification(
        userId,
        'general',
        'Account Statistics Updated',
        'Your account statistics have been adjusted by an administrator.',
        { action: 'stats_update', by: 'admin' }
      )
    } else if (action === 'updatePreferences') {
      // Update user preferences
      if (preferences) {
        user.preferences = { ...user.preferences, ...preferences }
        await user.save()
      }
    } else {
      // Update fields
      if (status) user.status = status
      if (kycStatus) user.kycStatus = kycStatus
      if (role) user.role = role
      
      await user.save()
    }

    return NextResponse.json({
      success: true,
      user: user.toObject(),
      message: 'User updated successfully',
    })

  } catch (error) {
    console.error('Admin update user error:', error)
    
    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0]
      return NextResponse.json(
        { success: false, error: firstError.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/users/[userId]
 * Permanently delete user (use with caution)
 */
export async function DELETE(request, { params }) {
  try {
    // Check admin authorization
    const authCheck = requireAdmin(request)
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, error: authCheck.error },
        { status: authCheck.status }
      )
    }

    await connectDB()

    const { userId } = params

    // Delete user and all related data
    await Promise.all([
      User.findByIdAndDelete(userId),
      Portfolio.deleteMany({ userId }),
      Transaction.deleteMany({ userId }),
      Wallet.deleteMany({ userId }),
      Notification.deleteMany({ userId }),
    ])

    return NextResponse.json({
      success: true,
      message: 'User and all related data permanently deleted',
    })

  } catch (error) {
    console.error('Admin delete user error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}

