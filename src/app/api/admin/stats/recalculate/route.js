import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import UserStats from '@/models/UserStats'
import { requireAdmin } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/stats/recalculate
 * Recalculate all user statistics
 */
export async function POST(request) {
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

    const body = await request.json()
    const { userId, all } = body

    if (all) {
      // Recalculate all user stats
      const results = await UserStats.recalculateAllStats()
      
      const successCount = results.filter(r => r.success).length
      const failCount = results.filter(r => !r.success).length

      return NextResponse.json({
        success: true,
        message: `Recalculated ${successCount} users successfully, ${failCount} failed`,
        results,
      })
    } else if (userId) {
      // Recalculate single user
      const stats = await UserStats.calculateUserStats(userId)
      
      return NextResponse.json({
        success: true,
        stats,
        message: 'Statistics recalculated successfully',
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'userId or all parameter required' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Recalculate stats error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to recalculate statistics' },
      { status: 500 }
    )
  }
}

