import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Wallet from '@/models/Wallet'
import Portfolio from '@/models/Portfolio'
import UserStats from '@/models/UserStats'
import { validatePassword, createAuthResponse } from '@/lib/auth'
import { generateUserWallets } from '@/lib/walletGenerator'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    // Connect to database
    await connectDB()

    // Parse request body
    const body = await request.json()
    const { firstName, lastName, email, password, confirmPassword, agreedToTerms } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { 
          success: false,
          error: 'All fields are required',
          field: !firstName ? 'firstName' : !lastName ? 'lastName' : !email ? 'email' : !password ? 'password' : 'confirmPassword'
        },
        { status: 400 }
      )
    }

    // Validate name length
    if (firstName.trim().length < 2) {
      return NextResponse.json(
        { 
          success: false,
          error: 'First name must be at least 2 characters',
          field: 'firstName'
        },
        { status: 400 }
      )
    }

    if (lastName.trim().length < 2) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Last name must be at least 2 characters',
          field: 'lastName'
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

    // Validate passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Passwords do not match',
          field: 'confirmPassword'
        },
        { status: 400 }
      )
    }

    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { 
          success: false,
          error: passwordValidation.errors[0],
          errors: passwordValidation.errors,
          field: 'password'
        },
        { status: 400 }
      )
    }

    // Validate terms agreement
    if (!agreedToTerms) {
      return NextResponse.json(
        { 
          success: false,
          error: 'You must agree to the terms of service',
          field: 'agreedToTerms'
        },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { 
          success: false,
          error: 'An account with this email already exists',
          field: 'email'
        },
        { status: 409 }
      )
    }

    // Create new user
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password,
      agreedToTerms: true,
      termsAgreedAt: new Date(),
    })

    // Generate crypto wallets for the user using ONE seed phrase
    // This follows BIP-44 standard for multi-coin wallets
    try {
      const wallets = await generateUserWallets()
      
      // Validate wallet generation
      if (!wallets || !wallets.seedPhrase) {
        throw new Error('Failed to generate wallets - no seed phrase returned')
      }
      
      // Validate all wallet addresses
      if (!wallets.btc?.address || !wallets.eth?.address || !wallets.usdt?.address ||
          !wallets.sol?.address || !wallets.xrp?.address || !wallets.bnb?.address) {
        throw new Error('Failed to generate all wallet addresses')
      }
      
      console.log('Wallet generation successful:', {
        btc: wallets.btc.address,
        eth: wallets.eth.address,
        usdt: wallets.usdt.address,
        sol: wallets.sol.address,
        xrp: wallets.xrp.address,
        bnb: wallets.bnb.address,
      })
      
      // wallets.seedPhrase is the MASTER seed for ALL wallets
      // All 6 wallets (BTC, ETH, USDT, SOL, XRP, BNB) are derived from this ONE seed
      
      // Create wallet records in database
      const createdWallets = await Promise.all([
        Wallet.create({
          userId: user._id,
          symbol: 'BTC',
          address: wallets.btc.address,
          privateKey: wallets.btc.privateKey,
          seedPhrase: wallets.seedPhrase, // Master seed phrase
          label: 'Bitcoin Wallet',
          network: 'mainnet',
          isDefault: true,
        }),
        Wallet.create({
          userId: user._id,
          symbol: 'ETH',
          address: wallets.eth.address,
          privateKey: wallets.eth.privateKey,
          seedPhrase: wallets.seedPhrase, // Same master seed
          label: 'Ethereum Wallet',
          network: 'mainnet',
          isDefault: true,
        }),
        Wallet.create({
          userId: user._id,
          symbol: 'USDT',
          address: wallets.usdt.address,
          privateKey: wallets.usdt.privateKey,
          seedPhrase: wallets.seedPhrase, // Same master seed
          label: 'USDT Wallet',
          network: 'mainnet',
          isDefault: true,
        }),
        Wallet.create({
          userId: user._id,
          symbol: 'SOL',
          address: wallets.sol.address,
          privateKey: wallets.sol.privateKey,
          seedPhrase: wallets.seedPhrase, // Same master seed
          label: 'Solana Wallet',
          network: 'mainnet',
          isDefault: true,
        }),
        Wallet.create({
          userId: user._id,
          symbol: 'XRP',
          address: wallets.xrp.address,
          privateKey: wallets.xrp.privateKey,
          seedPhrase: wallets.seedPhrase, // Same master seed
          label: 'XRP Wallet',
          network: 'mainnet',
          isDefault: true,
        }),
        Wallet.create({
          userId: user._id,
          symbol: 'BNB',
          address: wallets.bnb.address,
          privateKey: wallets.bnb.privateKey,
          seedPhrase: wallets.seedPhrase, // Same master seed
          label: 'BNB Wallet',
          network: 'mainnet',
          isDefault: true,
        }),
      ])

      console.log(`✅ Successfully created ${createdWallets.length} wallets (BTC, ETH, USDT, SOL, XRP, BNB) from ONE master seed for user: ${user.email}`)
      console.log('Wallet IDs:', createdWallets.map(w => ({ symbol: w.symbol, id: w._id.toString() })))
      
      // Verify wallets were actually saved to database
      const savedWallets = await Wallet.find({ userId: user._id })
      console.log(`✅ Verified: ${savedWallets.length} wallets found in database for user ${user.email}`)
      
      if (savedWallets.length !== 6) {
        throw new Error(`Expected 6 wallets but only ${savedWallets.length} were saved to database`)
      }

      // Initialize Portfolio entries with 0 holdings for each crypto
      console.log('📊 Initializing portfolio entries...')
      const portfolioEntries = await Promise.all([
        Portfolio.create({
          userId: user._id,
          symbol: 'BTC',
          holdings: 0,
          averageBuyPrice: 0,
        }),
        Portfolio.create({
          userId: user._id,
          symbol: 'ETH',
          holdings: 0,
          averageBuyPrice: 0,
        }),
        Portfolio.create({
          userId: user._id,
          symbol: 'USDT',
          holdings: 0,
          averageBuyPrice: 0,
        }),
        Portfolio.create({
          userId: user._id,
          symbol: 'SOL',
          holdings: 0,
          averageBuyPrice: 0,
        }),
        Portfolio.create({
          userId: user._id,
          symbol: 'XRP',
          holdings: 0,
          averageBuyPrice: 0,
        }),
        Portfolio.create({
          userId: user._id,
          symbol: 'BNB',
          holdings: 0,
          averageBuyPrice: 0,
        }),
      ])
      console.log(`✅ Created ${portfolioEntries.length} portfolio entries`)

      // Initialize UserStats with default values
      console.log('📈 Initializing user stats...')
      const userStats = await UserStats.create({
        userId: user._id,
        portfolioValue: 0,
        totalBalance: 0,
        totalInvested: 0,
        profitLoss: 0,
        profitLossPercentage: 0,
        totalTransactions: 0,
        completedTransactions: 0,
        pendingTransactions: 0,
        failedTransactions: 0,
        buyTransactions: 0,
        sellTransactions: 0,
        sendTransactions: 0,
        receiveTransactions: 0,
        swapTransactions: 0,
        totalVolume: 0,
        totalFees: 0,
        numberOfAssets: 0,
        largestHolding: { symbol: '', value: 0 },
        lastTransactionDate: null,
        accountAge: 0,
        lastCalculated: new Date(),
      })
      console.log(`✅ User stats initialized for ${user.email}`)
      
    } catch (walletError) {
      console.error('❌ Error creating wallets/portfolio/stats:', walletError)
      console.error('Stack trace:', walletError.stack)
      
      // Clean up user, wallets, portfolio, and stats if creation fails
      try {
        await Promise.all([
          User.findByIdAndDelete(user._id),
          Wallet.deleteMany({ userId: user._id }),
          Portfolio.deleteMany({ userId: user._id }),
          UserStats.deleteOne({ userId: user._id }),
        ])
        console.log('Rolled back user creation and all related data due to initialization failure')
      } catch (rollbackError) {
        console.error('Failed to rollback user creation:', rollbackError)
      }
      
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to initialize user account. Please try again.',
          details: walletError.message
        },
        { status: 500 }
      )
    }

    // Generate auth response with token
    const authResponse = createAuthResponse(user)

    return NextResponse.json(
      { 
        success: true,
        message: 'Account created successfully',
        ...authResponse
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Signup error:', error)

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          success: false,
          error: 'An account with this email already exists',
          field: 'email'
        },
        { status: 409 }
      )
    }

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0]
      return NextResponse.json(
        { 
          success: false,
          error: firstError.message,
          field: firstError.path
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'An error occurred while creating your account. Please try again.'
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

