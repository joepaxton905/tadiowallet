import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Portfolio from '@/models/Portfolio'
import Transaction from '@/models/Transaction'
import { requireAdmin } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/users
 * Get all users with pagination and filters
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 20
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build query
    const query = {}
    if (status) {
      query.status = status
    }
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    }

    // Get total count
    const total = await User.countDocuments(query)

    // Get users with pagination
    const users = await User.find(query)
      .select('-password -twoFactorSecret')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    // Enrich user data with portfolio and transaction counts
    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        const [portfolioCount, transactionCount, totalValue] = await Promise.all([
          Portfolio.countDocuments({ userId: user._id, holdings: { $gt: 0 } }),
          Transaction.countDocuments({ userId: user._id }),
          Transaction.aggregate([
            { $match: { userId: user._id, status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$value' } } }
          ])
        ])

        return {
          ...user,
          portfolioAssets: portfolioCount,
          totalTransactions: transactionCount,
          totalTransactionValue: totalValue[0]?.total || 0,
        }
      })
    )

    return NextResponse.json({
      success: true,
      users: enrichedUsers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })

  } catch (error) {
    console.error('Admin get users error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

