import { NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/auth/verify
 * Verify admin token
 */
export async function GET(request) {
  try {
    const admin = getAdminFromRequest(request)

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      admin: {
        email: admin.email,
        role: admin.role,
      },
    })

  } catch (error) {
    console.error('Admin token verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    )
  }
}

