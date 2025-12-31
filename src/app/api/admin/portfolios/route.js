import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { verifyAdminToken } from '@/lib/adminAuth'
import Portfolio from '@/models/Portfolio'
import User from '@/models/User'

export const dynamic = 'force-dynamic'

// GET - Get all portfolios with aggregated data
export async function GET(request) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = verifyAdminToken(token)
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin token' },
        { status: 401 }
      )
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 20
    const asset = searchParams.get('asset')
    const sortBy = searchParams.get('sortBy') || 'value'
    const order = searchParams.get('order') === 'asc' ? 1 : -1

    const skip = (page - 1) * limit

    // Build match query
    const matchQuery = {
      amount: { $gt: 0 } // Only show portfolios with holdings
    }

    if (asset) {
      matchQuery.symbol = asset.toUpperCase()
    }

    // Get aggregated portfolio data
    const portfolios = await Portfolio.find(matchQuery)
      .populate('userId', 'firstName lastName email')
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Portfolio.countDocuments(matchQuery)

    // Get asset summary
    const assetSummary = await Portfolio.aggregate([
      {
        $match: { amount: { $gt: 0 } }
      },
      {
        $group: {
          _id: '$symbol',
          totalAmount: { $sum: '$amount' },
          totalValue: { $sum: '$value' },
          holders: { $sum: 1 }
        }
      },
      {
        $sort: { totalValue: -1 }
      }
    ])

    // Get top holders
    const topHolders = await Portfolio.aggregate([
      {
        $group: {
          _id: '$userId',
          totalValue: { $sum: '$value' },
          assetCount: { $sum: 1 }
        }
      },
      {
        $sort: { totalValue: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 1,
          totalValue: 1,
          assetCount: 1,
          'user.firstName': 1,
          'user.lastName': 1,
          'user.email': 1
        }
      }
    ])

    // Platform totals
    const platformTotals = await Portfolio.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: '$value' },
          totalHolders: { $addToSet: '$userId' }
        }
      }
    ])

    return NextResponse.json({
      success: true,
      data: {
        portfolios,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        assetSummary,
        topHolders,
        platformTotals: {
          totalValue: platformTotals[0]?.totalValue || 0,
          totalHolders: platformTotals[0]?.totalHolders?.length || 0,
          totalAssets: assetSummary.length
        }
      }
    })

  } catch (error) {
    console.error('Portfolios fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch portfolios' },
      { status: 500 }
    )
  }
}

