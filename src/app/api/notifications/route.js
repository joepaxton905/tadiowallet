import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Notification from '@/models/Notification'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET - Get user's notifications
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

    // Get query parameter for limit
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit')) || 50

    const notifications = await Notification.getUserNotifications(decoded.userId, limit)
    const unreadCount = await Notification.getUnreadCount(decoded.userId)

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    })

  } catch (error) {
    console.error('Get notifications error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// POST - Create new notification
export async function POST(request) {
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

    const body = await request.json()
    const { type, title, message, metadata } = body

    if (!title || !message) {
      return NextResponse.json(
        { success: false, error: 'Title and message are required' },
        { status: 400 }
      )
    }

    const notification = await Notification.createNotification(
      decoded.userId,
      type || 'general',
      title,
      message,
      metadata || {}
    )

    return NextResponse.json({
      success: true,
      notification,
    }, { status: 201 })

  } catch (error) {
    console.error('Create notification error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}

// PATCH - Mark notifications as read
export async function PATCH(request) {
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

    const body = await request.json()
    const { notificationId, markAllAsRead } = body

    if (markAllAsRead) {
      // Mark all notifications as read
      await Notification.markAllAsRead(decoded.userId)
      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read',
      })
    } else if (notificationId) {
      // Mark specific notification as read
      const notification = await Notification.findOne({ _id: notificationId, userId: decoded.userId })
      
      if (!notification) {
        return NextResponse.json(
          { success: false, error: 'Notification not found' },
          { status: 404 }
        )
      }

      await notification.markAsRead()
      
      return NextResponse.json({
        success: true,
        notification,
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'notificationId or markAllAsRead is required' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Mark notification as read error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to mark notification as read' },
      { status: 500 }
    )
  }
}

