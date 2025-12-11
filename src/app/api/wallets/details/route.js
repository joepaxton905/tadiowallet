import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Wallet from '@/models/Wallet'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * GET - Get wallet details including private keys and seed phrases (authenticated users only)
 * Query params: ?symbol=BTC (optional - if not provided, returns all wallets)
 */
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

    // Get symbol from query params
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')

    let wallets

    if (symbol) {
      // Get specific wallet with private keys and seed phrases
      wallets = await Wallet.findOne({ 
        userId: decoded.userId, 
        symbol: symbol.toUpperCase(),
        isDefault: true 
      }).select('+privateKey +seedPhrase')
    } else {
      // Get all wallets with private keys and seed phrases
      wallets = await Wallet.find({ 
        userId: decoded.userId 
      })
      .select('+privateKey +seedPhrase')
      .sort({ isDefault: -1, createdAt: -1 })
    }

    if (!wallets || (Array.isArray(wallets) && wallets.length === 0)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No wallets found. Please create a wallet first.' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      wallets: Array.isArray(wallets) ? wallets : [wallets],
    })

  } catch (error) {
    console.error('Get wallet details error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wallet details' },
      { status: 500 }
    )
  }
}

// Only GET is allowed for security reasons
export async function POST() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}

