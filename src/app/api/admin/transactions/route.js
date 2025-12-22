import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Transaction from '@/models/Transaction'
import User from '@/models/User'
import { requireAdmin } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/transactions
 * Get all transactions with pagination and filters
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
    const limit = parseInt(searchParams.get('limit')) || 50
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const asset = searchParams.get('asset')
    const userId = searchParams.get('userId')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build query
    const query = {}
    if (type) query.type = type
    if (status) query.status = status
    if (asset) query.asset = asset.toUpperCase()
    if (userId) query.userId = userId

    // Get total count
    const total = await Transaction.countDocuments(query)

    // Get transactions with pagination
    const transactions = await Transaction.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('userId', 'firstName lastName email')
      .lean()

    return NextResponse.json({
      success: true,
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })

  } catch (error) {
    console.error('Admin get transactions error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

