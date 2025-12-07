import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { createAuthResponse } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    // Connect to database
    await connectDB()

    // Parse request body
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Email and password are required',
          field: !email ? 'email' : 'password'
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
          error: 'Please enter a valid email address',
          field: 'email'
        },
        { status: 400 }
      )
    }

    // Find user by email (include password field)
    const user = await User.findByEmail(email)
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid email or password'
        },
        { status: 401 }
      )
    }

    // Check if account is locked
    if (user.isLocked()) {
      const lockTimeRemaining = Math.ceil((user.lockUntil - Date.now()) / 60000)
      return NextResponse.json(
        { 
          success: false,
          error: `Account is temporarily locked. Please try again in ${lockTimeRemaining} minutes.`
        },
        { status: 423 }
      )
    }

    // Check if account is active
    if (user.status !== 'active') {
      return NextResponse.json(
        { 
          success: false,
          error: user.status === 'suspended' 
            ? 'Your account has been suspended. Please contact support.'
            : 'This account has been deleted.'
        },
        { status: 403 }
      )
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password)
    
    if (!isPasswordValid) {
      // Increment login attempts
      await user.incrementLoginAttempts()
      
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid email or password'
        },
        { status: 401 }
      )
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.updateOne({
        $set: { loginAttempts: 0 },
        $unset: { lockUntil: 1 }
      })
    }

    // Update last login timestamp
    await user.updateOne({ $set: { lastLogin: new Date() } })

    // Generate auth response with token
    const authResponse = createAuthResponse(user)

    return NextResponse.json(
      { 
        success: true,
        message: 'Login successful',
        ...authResponse
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'An error occurred during login. Please try again.'
      },
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

