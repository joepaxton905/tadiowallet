import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Transaction from '@/models/Transaction'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET - Get user's transaction stats
export async function GET(request) {
  try {
    // Get auth token from header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    await connectDB()

    const stats = await Transaction.getUserStats(decoded.userId)

    return NextResponse.json({
      success: true,
      stats,
    })

  } catch (error) {
    console.error('Get transaction stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transaction stats' },
      { status: 500 }
    )
  }
}

