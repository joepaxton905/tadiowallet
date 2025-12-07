import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export const dynamic = 'force-dynamic'

/**
 * Check if an email is already registered
 * POST /api/auth/check-email
 */
export async function POST(request) {
  try {
    // Connect to database
    await connectDB()

    // Parse request body
    const body = await request.json()
    const { email } = body

    // Validate email
    if (!email) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Email is required'
        },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Please enter a valid email address'
        },
        { status: 400 }
      )
    }

    // Check if email exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    
    return NextResponse.json({
      success: true,
      exists: !!existingUser,
      message: existingUser 
        ? 'An account with this email already exists' 
        : 'Email is available'
    })

  } catch (error) {
    console.error('Check email error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'An error occurred while checking the email'
      },
      { status: 500 }
    )
  }
}

