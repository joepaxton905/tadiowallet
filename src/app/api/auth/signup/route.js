import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Wallet from '@/models/Wallet'
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

    // Generate crypto wallets for the user (BTC, ETH, USDT)
    try {
      const wallets = await generateUserWallets()
      
      // Create wallet records in database
      await Promise.all([
        Wallet.create({
          userId: user._id,
          symbol: 'BTC',
          address: wallets.btc.address,
          privateKey: wallets.btc.privateKey,
          seedPhrase: wallets.btc.seedPhrase,
          label: 'Bitcoin Wallet',
          network: 'mainnet',
          isDefault: true,
        }),
        Wallet.create({
          userId: user._id,
          symbol: 'ETH',
          address: wallets.eth.address,
          privateKey: wallets.eth.privateKey,
          seedPhrase: wallets.eth.seedPhrase,
          label: 'Ethereum Wallet',
          network: 'mainnet',
          isDefault: true,
        }),
        Wallet.create({
          userId: user._id,
          symbol: 'USDT',
          address: wallets.usdt.address,
          privateKey: wallets.usdt.privateKey,
          seedPhrase: wallets.usdt.seedPhrase,
          label: 'USDT Wallet',
          network: 'mainnet',
          isDefault: true,
        }),
      ])

      console.log(`Created wallets for user: ${user.email}`)
    } catch (walletError) {
      console.error('Error creating wallets:', walletError)
      // Note: User is already created, but wallet creation failed
      // You might want to handle this differently in production
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

