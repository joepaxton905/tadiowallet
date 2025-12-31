import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import ActivityLog from '@/models/ActivityLog'
import { requireAdmin } from '@/lib/adminAuth'
import { generateToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/users/[userId]/login-as
 * Generate a user token for admin to login as the user
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

    // Get user details
    const user = await User.findById(userId).select('-password -twoFactorSecret')

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user account is active
    if (user.status !== 'active') {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot login as ${user.status} user. User account must be active.` 
        },
        { status: 403 }
      )
    }

    // Generate user token (not admin token)
    const userToken = generateToken(user)

    // Get IP address and user agent for logging
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Log this action for audit trail
    await ActivityLog.log({
      action: 'admin_action',
      actor: null, // Admin user (we could store admin email from token if needed)
      actorType: 'admin',
      target: userId,
      targetModel: 'User',
      description: `Admin logged in as user: ${user.firstName} ${user.lastName} (${user.email})`,
      metadata: {
        adminEmail: authCheck.admin.email,
        targetUserEmail: user.email,
        targetUserName: `${user.firstName} ${user.lastName}`,
        action: 'login_as_user',
      },
      ipAddress,
      userAgent,
      severity: 'warning', // This is a sensitive action
      status: 'success',
    })

    return NextResponse.json({
      success: true,
      token: userToken,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      message: 'User token generated successfully',
    })

  } catch (error) {
    console.error('Admin login-as-user error:', error)
    
    // Log failed attempt
    try {
      const ipAddress = request.headers.get('x-forwarded-for') || 
                        request.headers.get('x-real-ip') || 
                        'unknown'
      const userAgent = request.headers.get('user-agent') || 'unknown'
      
      await ActivityLog.log({
        action: 'admin_action',
        actor: null,
        actorType: 'admin',
        target: params.userId,
        targetModel: 'User',
        description: `Failed admin login-as-user attempt: ${error.message}`,
        metadata: {
          error: error.message,
          action: 'login_as_user',
        },
        ipAddress,
        userAgent,
        severity: 'error',
        status: 'failure',
      })
    } catch (logError) {
      console.error('Failed to log error:', logError)
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to generate user token' },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}

