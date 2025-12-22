import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Portfolio from '@/models/Portfolio'
import { verifyToken } from '@/lib/auth'
import { queueStatsUpdate } from '@/lib/updateUserStats'

export const dynamic = 'force-dynamic'

// GET - Get user's portfolio
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

    const portfolio = await Portfolio.getUserPortfolio(decoded.userId)

    return NextResponse.json({
      success: true,
      portfolio,
    })

  } catch (error) {
    console.error('Get portfolio error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch portfolio' },
      { status: 500 }
    )
  }
}

// POST - Add or update holding
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
    const { symbol, holdings, averageBuyPrice } = body

    if (!symbol || holdings === undefined) {
      return NextResponse.json(
        { success: false, error: 'Symbol and holdings are required' },
        { status: 400 }
      )
    }

    const holding = await Portfolio.updateHolding(
      decoded.userId,
      symbol,
      holdings,
      averageBuyPrice
    )

    // Update user stats (non-blocking)
    queueStatsUpdate(decoded.userId)

    return NextResponse.json({
      success: true,
      holding,
    })

  } catch (error) {
    console.error('Update portfolio error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update portfolio' },
      { status: 500 }
    )
  }
}

// PATCH - Add or subtract from holding
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
    const { symbol, amount, price, action } = body

    if (!symbol || !amount || !action) {
      return NextResponse.json(
        { success: false, error: 'Symbol, amount, and action are required' },
        { status: 400 }
      )
    }

    let holding
    if (action === 'add') {
      holding = await Portfolio.addToHolding(decoded.userId, symbol, amount, price || 0)
    } else if (action === 'subtract') {
      holding = await Portfolio.subtractFromHolding(decoded.userId, symbol, amount)
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Use "add" or "subtract"' },
        { status: 400 }
      )
    }

    // Update user stats (non-blocking)
    queueStatsUpdate(decoded.userId)

    return NextResponse.json({
      success: true,
      holding,
    })

  } catch (error) {
    console.error('Adjust portfolio error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to adjust portfolio' 
      },
      { status: 500 }
    )
  }
}

