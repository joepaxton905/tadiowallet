import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { verifyAdminToken } from '@/lib/adminAuth'
import ActivityLog from '@/models/ActivityLog'

export const dynamic = 'force-dynamic'

// GET - Get activity logs
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 50
    const action = searchParams.get('action')
    const actorType = searchParams.get('actorType')
    const severity = searchParams.get('severity')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build query
    const query = {}

    if (action) {
      query.action = action
    }

    if (actorType) {
      query.actorType = actorType
    }

    if (severity) {
      query.severity = severity
    }

    if (status) {
      query.status = status
    }

    if (search) {
      query.$or = [
        { description: { $regex: search, $options: 'i' } },
        { ipAddress: { $regex: search, $options: 'i' } }
      ]
    }

    // Get logs
    const logs = await ActivityLog.find(query)
      .populate('actor', 'firstName lastName email')
      .populate('target')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await ActivityLog.countDocuments(query)

    // Get action statistics
    const actionStats = await ActivityLog.aggregate([
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ])

    // Get severity distribution
    const severityStats = await ActivityLog.aggregate([
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      }
    ])

    // Get actor type distribution
    const actorTypeStats = await ActivityLog.aggregate([
      {
        $group: {
          _id: '$actorType',
          count: { $sum: 1 }
        }
      }
    ])

    // Recent activity summary
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const recentCount = await ActivityLog.countDocuments({
      createdAt: { $gte: last24Hours }
    })

    return NextResponse.json({
      success: true,
      data: {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        statistics: {
          actionStats,
          severityStats,
          actorTypeStats,
          recentCount
        }
      }
    })

  } catch (error) {
    console.error('Activity logs fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activity logs' },
      { status: 500 }
    )
  }
}

// POST - Create activity log (for manual logging)
export async function POST(request) {
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

    const body = await request.json()
    
    const log = await ActivityLog.create({
      action: body.action || 'admin_action',
      actorType: 'admin',
      description: body.description,
      metadata: body.metadata || {},
      severity: body.severity || 'info',
      status: body.status || 'success'
    })

    return NextResponse.json({
      success: true,
      log
    })

  } catch (error) {
    console.error('Activity log creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create activity log' },
      { status: 500 }
    )
  }
}

