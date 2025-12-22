import { NextResponse } from 'next/server'
import { verifyAdminCredentials, generateAdminToken } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/auth/login
 * Admin login endpoint
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Verify admin credentials
    const isValid = verifyAdminCredentials(email, password)

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate admin token
    const token = generateAdminToken()

    return NextResponse.json({
      success: true,
      token,
      admin: {
        email,
        role: 'admin',
      },
      expiresIn: '24h',
    })

  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    )
  }
}

