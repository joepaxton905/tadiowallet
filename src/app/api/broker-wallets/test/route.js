import { NextResponse } from 'next/server'
import mongoose from 'mongoose'

export const dynamic = 'force-dynamic'

/**
 * GET /api/broker-wallets/test
 * Debug endpoint to test broker wallet database connection and list wallets
 * Reads your existing database structure as-is
 */
export async function GET(request) {
  let connection = null
  
  try {
    console.log('🔧 Testing BROKER_WALLET database connection...')
    
    // Check if BROKER_WALLET_URI is set
    if (!process.env.BROKER_WALLET_URI) {
      return NextResponse.json({
        success: false,
        error: 'BROKER_WALLET_URI not found in environment variables',
        hint: 'Add BROKER_WALLET_URI to your .env file'
      }, { status: 500 })
    }

    console.log('✅ BROKER_WALLET_URI found')

    // Connect to broker database
    connection = await mongoose.createConnection(process.env.BROKER_WALLET_URI).asPromise()
    console.log('✅ Connected to BROKER_WALLET database')

    // List all collections
    const collections = await connection.db.listCollections().toArray()
    console.log('📋 Collections found:', collections.map(c => c.name))

    const allDocuments = []
    const stats = {
      totalCollections: collections.length,
      totalDocuments: 0,
      collectionDetails: []
    }

    // Read from all collections and extract wallet addresses
    const walletAddresses = []
    
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name
      const collection = connection.db.collection(collectionName)
      
      const docs = await collection.find({}).limit(100).toArray()
      const count = await collection.countDocuments()
      
      stats.totalDocuments += count
      stats.collectionDetails.push({
        name: collectionName,
        documentCount: count,
        sampleFields: docs.length > 0 ? Object.keys(docs[0]) : []
      })
      
      // Extract wallet addresses from nested structure: user.wallets.btc.address
      docs.forEach(doc => {
        if (doc.wallets) {
          Object.keys(doc.wallets).forEach(symbol => {
            const wallet = doc.wallets[symbol]
            if (wallet && wallet.address) {
              walletAddresses.push({
                collection: collectionName,
                userId: doc._id,
                symbol: symbol.toUpperCase(),
                address: wallet.address,
                balance: wallet.balance || wallet.amount || wallet.holdings || 0,
                userEmail: doc.email || doc.Email,
                userName: doc.name || doc.username || doc.fullName
              })
            }
          })
        }
        
        allDocuments.push({
          collection: collectionName,
          document: doc
        })
      })
    }

    return NextResponse.json({
      success: true,
      message: 'BROKER_WALLET database read successfully',
      databaseStructure: {
        uri: 'mongodb+srv://cluster0.hbqidou.mongodb.net/',
        stats,
        walletAddresses: walletAddresses.slice(0, 20),
        sampleDocuments: allDocuments.slice(0, 5).map(item => ({
          collection: item.collection,
          fields: Object.keys(item.document),
          hasWallets: !!item.document.wallets,
          walletSymbols: item.document.wallets ? Object.keys(item.document.wallets) : [],
          sample: item.document
        }))
      },
      hint: 'Structure is: user.wallets.btc.address, user.wallets.eth.address, etc. Use addresses from walletAddresses array for testing.'
    })

  } catch (error) {
    console.error('❌ Broker wallet test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      hint: 'Check if BROKER_WALLET_URI is correct and database is accessible'
    }, { status: 500 })
  } finally {
    if (connection) {
      await connection.close()
    }
  }
}
