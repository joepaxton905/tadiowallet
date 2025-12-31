import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { verifyAdminToken } from '@/lib/adminAuth'
import User from '@/models/User'
import Transaction from '@/models/Transaction'
import Portfolio from '@/models/Portfolio'

export const dynamic = 'force-dynamic'

// GET - Analytics data
export async function GET(request) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = verifyAdminToken(token)
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin token' },
        { status: 401 }
      )
    }

    await connectDB()

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // User growth over last 30 days
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
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
      {
        $sort: { _id: 1 }
      }
    ])

    // Transaction volume over last 30 days
    const transactionVolume = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 },
          totalValue: { $sum: '$value' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ])

    // Transaction by type (last 30 days)
    const transactionsByType = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalValue: { $sum: '$value' }
        }
      }
    ])

    // Transactions by asset (last 30 days)
    const transactionsByAsset = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: '$asset',
          count: { $sum: 1 },
          totalValue: { $sum: '$value' }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ])

    // Portfolio distribution
    const portfolioDistribution = await Portfolio.aggregate([
      {
        $match: {
          amount: { $gt: 0 }
        }
      },
      {
        $group: {
          _id: '$symbol',
          totalAmount: { $sum: '$amount' },
          totalValue: { $sum: '$value' },
          holders: { $sum: 1 }
        }
      },
      {
        $sort: { totalValue: -1 }
      },
      {
        $limit: 10
      }
    ])

    // Active users (last 7 days - users with transactions)
    const activeUsersLast7Days = await Transaction.distinct('userId', {
      createdAt: { $gte: sevenDaysAgo }
    })

    // Platform statistics
    const totalUsers = await User.countDocuments()
    const totalTransactions = await Transaction.countDocuments()
    const totalTransactionValue = await Transaction.aggregate([
      {
        $match: { status: 'completed' }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$value' }
        }
      }
    ])

    const totalPortfolioValue = await Portfolio.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$value' }
        }
      }
    ])

    // Average transaction value
    const avgTransactionValue = totalTransactionValue[0]?.total / (totalTransactions || 1)

    // User activity distribution
    const userActivityDistribution = await Transaction.aggregate([
      {
        $group: {
          _id: '$userId',
          transactionCount: { $sum: 1 }
        }
      },
      {
        $bucket: {
          groupBy: '$transactionCount',
          boundaries: [0, 1, 5, 10, 20, 50, 100],
          default: '100+',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ])

    // Transaction status distribution
    const transactionStatusDistribution = await Transaction.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    // Daily active users trend (last 30 days)
    const dailyActiveUsers = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            userId: '$userId'
          }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          activeUsers: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ])

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalTransactions,
          totalTransactionValue: totalTransactionValue[0]?.total || 0,
          totalPortfolioValue: totalPortfolioValue[0]?.total || 0,
          avgTransactionValue: avgTransactionValue || 0,
          activeUsersLast7Days: activeUsersLast7Days.length
        },
        userGrowth,
        transactionVolume,
        transactionsByType,
        transactionsByAsset,
        portfolioDistribution,
        userActivityDistribution,
        transactionStatusDistribution,
        dailyActiveUsers
      }
    })

  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

