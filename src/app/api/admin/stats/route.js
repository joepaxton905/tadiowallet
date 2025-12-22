import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Transaction from '@/models/Transaction'
import Portfolio from '@/models/Portfolio'
import { requireAdmin } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/stats
 * Get system-wide statistics
 */
export async function GET(request) {
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

    // Get various statistics in parallel
    const [
      totalUsers,
      activeUsers,
      suspendedUsers,
      totalTransactions,
      completedTransactions,
      pendingTransactions,
      recentUsers,
      recentTransactions,
      portfolioStats,
      transactionVolume
    ] = await Promise.all([
      // User statistics
      User.countDocuments(),
      User.countDocuments({ status: 'active' }),
      User.countDocuments({ status: 'suspended' }),
      
      // Transaction statistics
      Transaction.countDocuments(),
      Transaction.countDocuments({ status: 'completed' }),
      Transaction.countDocuments({ status: 'pending' }),
      
      // Recent users (last 7 days)
      User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
      
      // Recent transactions (last 24 hours)
      Transaction.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }),
      
      // Total portfolio value (sum of all holdings)
      Portfolio.aggregate([
        {
          $group: {
            _id: null,
            totalHoldings: { $sum: '$holdings' }
          }
        }
      ]),
      
      // Transaction volume (last 30 days)
      Transaction.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
            status: 'completed'
          }
        },
        {
          $group: {
            _id: null,
            totalVolume: { $sum: '$value' },
            totalFees: { $sum: '$fee' }
          }
        }
      ])
    ])

    // Transaction type breakdown
    const transactionsByType = await Transaction.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalValue: { $sum: '$value' }
        }
      }
    ])

    // Top assets by transaction count
    const topAssets = await Transaction.aggregate([
      {
        $group: {
          _id: '$asset',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ])

    // User registration trend (last 30 days)
    const registrationTrend = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])

    return NextResponse.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          active: activeUsers,
          suspended: suspendedUsers,
          deleted: totalUsers - activeUsers - suspendedUsers,
          recentSignups: recentUsers,
        },
        transactions: {
          total: totalTransactions,
          completed: completedTransactions,
          pending: pendingTransactions,
          failed: totalTransactions - completedTransactions - pendingTransactions,
          recent24h: recentTransactions,
          byType: transactionsByType,
          volume30d: transactionVolume[0] || { totalVolume: 0, totalFees: 0 },
        },
        portfolio: {
          totalHoldings: portfolioStats[0]?.totalHoldings || 0,
          topAssets,
        },
        trends: {
          registrations: registrationTrend,
        },
      },
    })

  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}

