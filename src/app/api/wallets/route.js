import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Wallet from '@/models/Wallet'
import { verifyToken } from '@/lib/auth'
import { 
  generateBTCWalletFromSeed, 
  generateETHWalletFromSeed, 
  generateSOLWalletFromSeed,
  generateMnemonic 
} from '@/lib/walletGenerator'

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

    let walletAddress = address
    let privateKey = null
    let seedPhrase = null

    // If no address provided, generate a real one for supported coins
    if (!walletAddress) {
      // Try to get existing seed phrase from any user wallet
      const existingWallet = await Wallet.findOne({ userId: decoded.userId })
        .select('+seedPhrase')
        .lean()
      
      // Use existing seed phrase or generate new one
      const mnemonic = existingWallet?.seedPhrase || generateMnemonic()
      seedPhrase = mnemonic

      try {
        // Generate real wallet addresses for supported coins
        switch (symbol.toUpperCase()) {
          case 'BTC': {
            const btcWallet = await generateBTCWalletFromSeed(mnemonic)
            walletAddress = btcWallet.address
            privateKey = btcWallet.privateKey
            break
          }
          case 'ETH': {
            const ethWallet = await generateETHWalletFromSeed(mnemonic)
            walletAddress = ethWallet.address
            privateKey = ethWallet.privateKey
            break
          }
          case 'USDT': {
            // USDT uses Ethereum address (ERC-20)
            const usdtWallet = await generateETHWalletFromSeed(mnemonic)
            walletAddress = usdtWallet.address
            privateKey = usdtWallet.privateKey
            break
          }
          case 'SOL': {
            const solWallet = await generateSOLWalletFromSeed(mnemonic)
            walletAddress = solWallet.address
            privateKey = solWallet.privateKey
            break
          }
          // For other coins not yet supported by wallet generator, use mock addresses
          default:
            walletAddress = Wallet.generateMockAddress(symbol)
            console.log(`Generated mock address for ${symbol} - real wallet generation not yet implemented`)
        }
      } catch (error) {
        console.error(`Error generating ${symbol} wallet:`, error)
        // Fallback to mock address if generation fails
        walletAddress = Wallet.generateMockAddress(symbol)
      }
    }

    const wallet = await Wallet.upsertWallet(
      decoded.userId,
      symbol,
      walletAddress,
      label || 'Main Wallet',
      privateKey,
      seedPhrase
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

