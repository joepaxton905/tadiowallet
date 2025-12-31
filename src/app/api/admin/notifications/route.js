import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { verifyAdminToken } from '@/lib/adminAuth'
import Notification from '@/models/Notification'
import User from '@/models/User'

export const dynamic = 'force-dynamic'

// GET - Get all notifications
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
    const type = searchParams.get('type')
    const read = searchParams.get('read')

    const skip = (page - 1) * limit

    // Build query
    const query = {}

    if (type) {
      query.type = type
    }

    if (read !== null && read !== undefined) {
      query.read = read === 'true'
    }

    // Get notifications
    const notifications = await Notification.find(query)
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Notification.countDocuments(query)

    // Get statistics
    const stats = await Notification.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          unread: {
            $sum: { $cond: [{ $eq: ['$read', false] }, 1, 0] }
          }
        }
      }
    ])

    const totalUnread = await Notification.countDocuments({ read: false })

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        statistics: {
          stats,
          totalUnread
        }
      }
    })

  } catch (error) {
    console.error('Notifications fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// POST - Create broadcast notification
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
    const { title, message, type = 'info', targetUsers = 'all' } = body

    if (!title || !message) {
      return NextResponse.json(
        { success: false, error: 'Title and message are required' },
        { status: 400 }
      )
    }

    // Get target users
    let userIds
    if (targetUsers === 'all') {
      const users = await User.find({ status: 'active' }).select('_id').lean()
      userIds = users.map(u => u._id)
    } else if (Array.isArray(targetUsers)) {
      userIds = targetUsers
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid targetUsers parameter' },
        { status: 400 }
      )
    }

    // Create notifications for all users
    const notifications = userIds.map(userId => ({
      userId,
      type,
      title,
      message,
      read: false
    }))

    await Notification.insertMany(notifications)

    return NextResponse.json({
      success: true,
      message: `Notification sent to ${userIds.length} users`,
      count: userIds.length
    })

  } catch (error) {
    console.error('Notification creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}

// DELETE - Delete multiple notifications
export async function DELETE(request) {
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
    const deleteAll = searchParams.get('deleteAll') === 'true'
    const deleteRead = searchParams.get('deleteRead') === 'true'

    let result
    if (deleteAll) {
      result = await Notification.deleteMany({})
    } else if (deleteRead) {
      result = await Notification.deleteMany({ read: true })
    } else {
      return NextResponse.json(
        { success: false, error: 'Specify deleteAll or deleteRead parameter' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} notifications`
    })

  } catch (error) {
    console.error('Notification deletion error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete notifications' },
      { status: 500 }
    )
  }
}

