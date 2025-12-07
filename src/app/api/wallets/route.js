import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Wallet from '@/models/Wallet'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET - Get user's wallets
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

    // Get query parameter for specific symbol
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')

    let wallets
    if (symbol) {
      wallets = await Wallet.getUserWallet(decoded.userId, symbol)
    } else {
      wallets = await Wallet.getUserWallets(decoded.userId)
    }

    return NextResponse.json({
      success: true,
      wallets: symbol ? (wallets ? [wallets] : []) : wallets,
    })

  } catch (error) {
    console.error('Get wallets error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wallets' },
      { status: 500 }
    )
  }
}

// POST - Create or update wallet
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
    const { symbol, address, label } = body

    if (!symbol) {
      return NextResponse.json(
        { success: false, error: 'Symbol is required' },
        { status: 400 }
      )
    }

    // If no address provided, generate a mock one
    const walletAddress = address || Wallet.generateMockAddress(symbol)

    const wallet = await Wallet.upsertWallet(
      decoded.userId,
      symbol,
      walletAddress,
      label || 'Main Wallet'
    )

    return NextResponse.json({
      success: true,
      wallet,
    })

  } catch (error) {
    console.error('Create/update wallet error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create/update wallet' },
      { status: 500 }
    )
  }
}

