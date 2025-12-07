import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { verifyToken, sanitizeUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET - Get user profile
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

    const user = await User.findById(decoded.userId)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: sanitizeUser(user),
    })

  } catch (error) {
    console.error('Get user profile error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}

// PATCH - Update user profile
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
    const {
      firstName,
      lastName,
      avatar,
      preferences,
    } = body

    const updateData = {}
    if (firstName) updateData.firstName = firstName
    if (lastName) updateData.lastName = lastName
    if (avatar !== undefined) updateData.avatar = avatar
    if (preferences) {
      if (preferences.currency) updateData['preferences.currency'] = preferences.currency
      if (preferences.language) updateData['preferences.language'] = preferences.language
      if (preferences.timezone) updateData['preferences.timezone'] = preferences.timezone
      if (preferences.notifications) {
        if (preferences.notifications.email !== undefined) 
          updateData['preferences.notifications.email'] = preferences.notifications.email
        if (preferences.notifications.priceAlerts !== undefined) 
          updateData['preferences.notifications.priceAlerts'] = preferences.notifications.priceAlerts
        if (preferences.notifications.transactionAlerts !== undefined) 
          updateData['preferences.notifications.transactionAlerts'] = preferences.notifications.transactionAlerts
        if (preferences.notifications.marketing !== undefined) 
          updateData['preferences.notifications.marketing'] = preferences.notifications.marketing
      }
    }

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    )

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: sanitizeUser(user),
    })

  } catch (error) {
    console.error('Update user profile error:', error)
    
    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0]
      return NextResponse.json(
        { success: false, error: firstError.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update user profile' },
      { status: 500 }
    )
  }
}

