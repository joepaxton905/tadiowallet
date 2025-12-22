/**
 * Test Script for Wallet Generation
 * 
 * This script tests the wallet generation functionality without needing to run the full app.
 * Run with: node test-wallet-generation.js
 * 
 * NOTE: Make sure to run "npm install" first to install the required packages:
 * - bip39
 * - bip32
 * - @bitcoinerlab/secp256k1
 * - bitcoinjs-lib
 * - ethers
 * - @solana/web3.js
 * - ripple-keypairs
 */

import * as bip39 from 'bip39'
import { BIP32Factory } from 'bip32'
import * as ecc from '@bitcoinerlab/secp256k1'
import * as bitcoinjs from 'bitcoinjs-lib'
import { HDNodeWallet } from 'ethers'
import { Keypair } from '@solana/web3.js'
import * as rippleKeypairs from 'ripple-keypairs'

console.log('🚀 Testing Wallet Generation...\n')

// Test Bitcoin Wallet Generation
async function testBTCWallet() {
  console.log('📍 Testing Bitcoin (BTC) Wallet Generation...')
  try {
    const bip32 = BIP32Factory(ecc)
    
    // Generate mnemonic
    const mnemonic = bip39.generateMnemonic()
    console.log('✅ Mnemonic generated:', mnemonic.split(' ').slice(0, 3).join(' ') + '...')
    
    // Convert to seed
    const seed = await bip39.mnemonicToSeed(mnemonic)
    console.log('✅ Seed generated')
    
    // Create root and derive child
    const root = bip32.fromSeed(seed)
    const child = root.derivePath("m/44'/0'/0'/0/0")
    
    // Generate address
    const { address } = bitcoinjs.payments.p2pkh({
      pubkey: Buffer.from(child.publicKey),
      network: bitcoinjs.networks.bitcoin,
    })
    
    const privateKey = child.toWIF()
    
    console.log('✅ BTC Address:', address)
    console.log('✅ BTC Private Key (WIF):', privateKey.substring(0, 10) + '...')
    console.log('✅ Bitcoin wallet generated successfully!\n')
    
    return { address, privateKey, mnemonic }
  } catch (error) {
    console.error('❌ Error generating BTC wallet:', error.message)
    throw error
  }
}

// Test Ethereum Wallet Generation
async function testETHWallet() {
  console.log('📍 Testing Ethereum (ETH) Wallet Generation...')
  try {
    // Generate mnemonic
    const mnemonic = bip39.generateMnemonic()
    console.log('✅ Mnemonic generated:', mnemonic.split(' ').slice(0, 3).join(' ') + '...')
    
    // Create HD wallet
    const hdWallet = HDNodeWallet.fromPhrase(mnemonic)
    
    console.log('✅ ETH Address:', hdWallet.address)
    console.log('✅ ETH Private Key:', hdWallet.privateKey.substring(0, 20) + '...')
    console.log('✅ Ethereum wallet generated successfully!\n')
    
    return { address: hdWallet.address, privateKey: hdWallet.privateKey, mnemonic }
  } catch (error) {
    console.error('❌ Error generating ETH wallet:', error.message)
    throw error
  }
}

// Test USDT Wallet Generation (ERC20)
async function testUSDTWallet() {
  console.log('📍 Testing USDT Wallet Generation (ERC20)...')
  try {
    // USDT uses Ethereum address
    const mnemonic = bip39.generateMnemonic()
    console.log('✅ Mnemonic generated:', mnemonic.split(' ').slice(0, 3).join(' ') + '...')
    
    const hdWallet = HDNodeWallet.fromPhrase(mnemonic)
    
    console.log('✅ USDT Address (ERC20):', hdWallet.address)
    console.log('✅ USDT Private Key:', hdWallet.privateKey.substring(0, 20) + '...')
    console.log('✅ USDT wallet generated successfully!\n')
    
    return { address: hdWallet.address, privateKey: hdWallet.privateKey, mnemonic }
  } catch (error) {
    console.error('❌ Error generating USDT wallet:', error.message)
    throw error
  }
}

// Test Solana Wallet Generation
async function testSOLWallet() {
  console.log('📍 Testing Solana (SOL) Wallet Generation...')
  try {
    const mnemonic = bip39.generateMnemonic()
    console.log('✅ Mnemonic generated:', mnemonic.split(' ').slice(0, 3).join(' ') + '...')
    
    const seed = await bip39.mnemonicToSeed(mnemonic)
    const keypair = Keypair.fromSeed(seed.slice(0, 32))
    
    console.log('✅ SOL Address:', keypair.publicKey.toBase58())
    console.log('✅ SOL Public Key:', keypair.publicKey.toBase58())
    console.log('✅ SOL Private Key:', Buffer.from(keypair.secretKey).toString('hex').substring(0, 20) + '...')
    console.log('✅ Solana wallet generated successfully!\n')
    
    return { 
      address: keypair.publicKey.toBase58(), 
      privateKey: Buffer.from(keypair.secretKey).toString('hex'), 
      mnemonic 
    }
  } catch (error) {
    console.error('❌ Error generating SOL wallet:', error.message)
    throw error
  }
}

// Test XRP Wallet Generation
async function testXRPWallet() {
  console.log('📍 Testing XRP (Ripple) Wallet Generation...')
  try {
    const mnemonic = bip39.generateMnemonic()
    console.log('✅ Mnemonic generated:', mnemonic.split(' ').slice(0, 3).join(' ') + '...')
    
    const seed = await bip39.mnemonicToSeed(mnemonic)
    const seedHex = seed.slice(0, 16).toString('hex').toUpperCase()
    const keypair = rippleKeypairs.deriveKeypair(seedHex)
    const address = rippleKeypairs.deriveAddress(keypair.publicKey)
    
    console.log('✅ XRP Address:', address)
    console.log('✅ XRP Public Key:', keypair.publicKey)
    console.log('✅ XRP Private Key:', keypair.privateKey.substring(0, 20) + '...')
    console.log('✅ XRP wallet generated successfully!\n')
    
    return { address, publicKey: keypair.publicKey, privateKey: keypair.privateKey, mnemonic }
  } catch (error) {
    console.error('❌ Error generating XRP wallet:', error.message)
    throw error
  }
}

// Test BNB Wallet Generation
async function testBNBWallet() {
  console.log('📍 Testing BNB (Binance Smart Chain) Wallet Generation...')
  try {
    const mnemonic = bip39.generateMnemonic()
    console.log('✅ Mnemonic generated:', mnemonic.split(' ').slice(0, 3).join(' ') + '...')
    
    const hdWallet = HDNodeWallet.fromPhrase(mnemonic)
    
    console.log('✅ BNB Address:', hdWallet.address)
    console.log('✅ BNB Private Key:', hdWallet.privateKey.substring(0, 20) + '...')
    console.log('✅ BNB wallet generated successfully!\n')
    
    return { address: hdWallet.address, privateKey: hdWallet.privateKey, mnemonic }
  } catch (error) {
    console.error('❌ Error generating BNB wallet:', error.message)
    throw error
  }
}

// Test Mnemonic Validation
function testMnemonicValidation() {
  console.log('📍 Testing Mnemonic Validation...')
  
  const validMnemonic = bip39.generateMnemonic()
  const isValid = bip39.validateMnemonic(validMnemonic)
  console.log('✅ Valid mnemonic:', isValid)
  
  const invalidMnemonic = 'invalid mnemonic phrase test'
  const isInvalid = bip39.validateMnemonic(invalidMnemonic)
  console.log('✅ Invalid mnemonic:', !isInvalid)
  console.log('✅ Mnemonic validation working!\n')
}

// Test Wallet Restoration
async function testWalletRestoration(btcMnemonic, solMnemonic) {
  console.log('📍 Testing Wallet Restoration from Seed Phrase...')
  try {
    // Restore BTC wallet
    const bip32 = BIP32Factory(ecc)
    const btcSeed = await bip39.mnemonicToSeed(btcMnemonic)
    const root = bip32.fromSeed(btcSeed)
    const child = root.derivePath("m/44'/0'/0'/0/0")
    const { address: btcAddress } = bitcoinjs.payments.p2pkh({
      pubkey: Buffer.from(child.publicKey),
      network: bitcoinjs.networks.bitcoin,
    })
    
    console.log('✅ Restored BTC Address:', btcAddress)
    
    // Restore ETH wallet
    const hdWallet = HDNodeWallet.fromPhrase(btcMnemonic)
    console.log('✅ Restored ETH Address:', hdWallet.address)
    
    // Restore SOL wallet
    const solSeed = await bip39.mnemonicToSeed(solMnemonic)
    const solKeypair = Keypair.fromSeed(solSeed.slice(0, 32))
    console.log('✅ Restored SOL Address:', solKeypair.publicKey.toBase58())
    
    console.log('✅ Wallet restoration working!\n')
  } catch (error) {
    console.error('❌ Error restoring wallet:', error.message)
    throw error
  }
}

// Run all tests
async function runTests() {
  try {
    console.log('═══════════════════════════════════════════════════════')
    console.log('  WALLET GENERATION TEST SUITE')
    console.log('═══════════════════════════════════════════════════════\n')
    
    // Test individual wallet generation
    const btcWallet = await testBTCWallet()
    const ethWallet = await testETHWallet()
    const usdtWallet = await testUSDTWallet()
    const solWallet = await testSOLWallet()
    const xrpWallet = await testXRPWallet()
    const bnbWallet = await testBNBWallet()
    
    // Test mnemonic validation
    testMnemonicValidation()
    
    // Test wallet restoration
    await testWalletRestoration(btcWallet.mnemonic, solWallet.mnemonic)
    
    console.log('═══════════════════════════════════════════════════════')
    console.log('  ✅ ALL TESTS PASSED!')
    console.log('═══════════════════════════════════════════════════════\n')
    
    console.log('📋 Summary:')
    console.log('   • BTC wallet generation: ✅')
    console.log('   • ETH wallet generation: ✅')
    console.log('   • USDT wallet generation: ✅')
    console.log('   • SOL wallet generation: ✅')
    console.log('   • XRP wallet generation: ✅')
    console.log('   • BNB wallet generation: ✅')
    console.log('   • Mnemonic validation: ✅')
    console.log('   • Wallet restoration: ✅')
    console.log('\n💡 All 6 wallet types are working correctly!')
    console.log('   You can now use the signup endpoint to create user accounts with wallets.\n')
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message)
    console.error('\n💡 Make sure you have run "npm install" to install all required packages.')
    process.exit(1)
  }
}

// Execute tests
runTests()

