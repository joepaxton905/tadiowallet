import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Transaction from '@/models/Transaction'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET - Get user's transactions
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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const asset = searchParams.get('asset')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit')) || 100

    const filters = { limit }
    if (type) filters.type = type
    if (asset) filters.asset = asset
    if (status) filters.status = status

    const transactions = await Transaction.getUserTransactions(decoded.userId, filters)

    return NextResponse.json({
      success: true,
      transactions,
    })

  } catch (error) {
    console.error('Get transactions error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

// POST - Create new transaction
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
    const {
      type,
      asset,
      assetName,
      assetIcon,
      assetColor,
      amount,
      price,
      value,
      fee,
      status,
      toAsset,
      toAmount,
      to,
      from,
      apy,
      txHash,
      notes,
    } = body

    // Validate required fields
    if (!type || !asset || !assetName || !amount || value === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create transaction
    const transaction = await Transaction.create({
      userId: decoded.userId,
      type,
      asset: asset.toUpperCase(),
      assetName,
      assetIcon: assetIcon || '●',
      assetColor: assetColor || '#888888',
      amount,
      price: price || 0,
      value,
      fee: fee || 0,
      status: status || 'completed',
      toAsset: toAsset ? toAsset.toUpperCase() : undefined,
      toAmount,
      to,
      from,
      apy,
      txHash,
      notes,
    })

    return NextResponse.json({
      success: true,
      transaction,
    }, { status: 201 })

  } catch (error) {
    console.error('Create transaction error:', error)
    
    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0]
      return NextResponse.json(
        { success: false, error: firstError.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}

