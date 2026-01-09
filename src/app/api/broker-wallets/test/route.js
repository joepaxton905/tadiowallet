import { NextResponse } from 'next/server'
import mongoose from 'mongoose'

export const dynamic = 'force-dynamic'

/**
 * DEBUG ENDPOINT - Test Broker Database Connection
 * Visit: http://localhost:3000/api/broker-wallets/test
 * 
 * Database: mongodb+srv://maverickandretti:samuellucky12@cluster0.hbqidou.mongodb.net/
 * Structure: users collection with nested wallets (btc, eth, usdt_trc20)
 */
export async function GET(request) {
  let brokerConnection = null
  
  try {
    const BROKER_WALLET_URI = process.env.BROKER_WALLET_URI || 'mongodb+srv://maverickandretti:samuellucky12@cluster0.hbqidou.mongodb.net/'
    
    console.log('🔌 Testing broker database connection...')

    // Connect to broker database
    brokerConnection = await mongoose.createConnection(BROKER_WALLET_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    }).asPromise()

    console.log('✅ Connected to broker database!')
    console.log('📊 Database name:', brokerConnection.db.databaseName)

    // List all collections
    const collections = await brokerConnection.db.listCollections().toArray()
    console.log('📋 Collections:', collections.map(c => c.name))

    // Define flexible model
    const BrokerUserModel = brokerConnection.model('User', new mongoose.Schema({}, { strict: false }), 'users')

    // Get all users with wallets
    const users = await BrokerUserModel.find({}).limit(20)

    const usersWithWallets = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      balance: user.balance,
      wallets: {
        btc: user.wallets?.btc ? {
          address: user.wallets.btc.address,
          legacyAddress: user.wallets.btc.legacyAddress,
          balance: user.wallets.btc.balance,
          currency: user.wallets.btc.currency
        } : null,
        eth: user.wallets?.eth ? {
          address: user.wallets.eth.address,
          balance: user.wallets.eth.balance,
          currency: user.wallets.eth.currency
        } : null,
        usdt_trc20: user.wallets?.usdt_trc20 ? {
          address: user.wallets.usdt_trc20.address,
          balance: user.wallets.usdt_trc20.balance,
          currency: user.wallets.usdt_trc20.currency
        } : null
      }
    }))

    // Test address search
    const testAddress = 'bc1qu2xf0gq3usyxuqz2u93s9pwx723g0cmv5h2yl3'
    const foundUser = await BrokerUserModel.findOne({
      $or: [
        { 'wallets.btc.address': testAddress },
        { 'wallets.btc.legacyAddress': testAddress },
        { 'wallets.eth.address': testAddress },
        { 'wallets.usdt_trc20.address': testAddress }
      ]
    })

    console.log(`✅ Found ${users.length} users in broker database`)
    console.log(`🔍 Test search for ${testAddress}:`, foundUser ? 'FOUND' : 'NOT FOUND')

    return NextResponse.json({
      success: true,
      database: brokerConnection.db.databaseName,
      collections: collections.map(c => c.name),
      userCount: users.length,
      users: usersWithWallets,
      testSearch: {
        address: testAddress,
        found: !!foundUser,
        user: foundUser ? {
          name: foundUser.name,
          email: foundUser.email
        } : null
      },
      message: '✅ Broker database connection successful'
    })

  } catch (error) {
    console.error('❌ Broker database test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
    
  } finally {
    if (brokerConnection) {
      await brokerConnection.close()
      console.log('🔌 Connection closed')
    }
  }
}
