import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import UserStats from '@/models/UserStats'
import { requireAdmin } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/stats/user/[userId]
 * Get user statistics
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

    // Get user stats (will recalculate if needed)
    const stats = await UserStats.getUserStats(userId)

    return NextResponse.json({
      success: true,
      stats,
    })

  } catch (error) {
    console.error('Get user stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user statistics' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/stats/user/[userId]
 * Force recalculate user statistics
 */
export async function POST(request, { params }) {
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

    // Force recalculate
    const stats = await UserStats.calculateUserStats(userId)

    return NextResponse.json({
      success: true,
      stats,
      message: 'Statistics recalculated successfully',
    })

  } catch (error) {
    console.error('Recalculate user stats error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to recalculate statistics' },
      { status: 500 }
    )
  }
}

