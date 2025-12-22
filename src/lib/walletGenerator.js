/**
 * Wallet Generation Utility
 * Generates BTC, ETH, USDT, SOL, XRP, and BNB wallet addresses using BIP39 and BIP32
 */

import * as bip39 from 'bip39'
import { BIP32Factory } from 'bip32'
import * as ecc from '@bitcoinerlab/secp256k1'
import * as bitcoinjs from 'bitcoinjs-lib'
import { HDNodeWallet } from 'ethers'
import { Keypair } from '@solana/web3.js'
import * as rippleKeypairs from 'ripple-keypairs'

/**
 * Generate BTC wallet
 * @returns {Object} { address, privateKey, seedPhrase }
 */
export async function generateBTCWallet() {
  try {
    const bip32 = BIP32Factory(ecc)
    
    // Generate mnemonic (seed phrase)
    const mnemonic = bip39.generateMnemonic()
    
    // Convert mnemonic to seed
    const seed = await bip39.mnemonicToSeed(mnemonic)
    
    // Create root from seed
    const root = bip32.fromSeed(seed)
    
    // Derive child key using BIP44 path for Bitcoin (m/44'/0'/0'/0/0)
    const child = root.derivePath("m/44'/0'/0'/0/0")
    
    // Generate P2PKH address (legacy Bitcoin address starting with 1)
    const { address } = bitcoinjs.payments.p2pkh({
      pubkey: Buffer.from(child.publicKey),
      network: bitcoinjs.networks.bitcoin,
    })
    
    // Get private key in WIF format
    const privateKey = child.toWIF()
    
    return {
      address,
      privateKey,
      seedPhrase: mnemonic,
    }
  } catch (error) {
    console.error('Error generating BTC wallet:', error)
    throw new Error('Failed to generate BTC wallet')
  }
}

/**
 * Generate ETH wallet
 * @returns {Object} { address, privateKey, seedPhrase }
 */
export async function generateETHWallet() {
  try {
    // Generate mnemonic (seed phrase)
    const mnemonic = bip39.generateMnemonic()
    
    // Create HD wallet from mnemonic
    const hdWallet = HDNodeWallet.fromPhrase(mnemonic)
    
    return {
      address: hdWallet.address,
      privateKey: hdWallet.privateKey,
      seedPhrase: mnemonic,
    }
  } catch (error) {
    console.error('Error generating ETH wallet:', error)
    throw new Error('Failed to generate ETH wallet')
  }
}

/**
 * Generate USDT wallet (uses Ethereum network - ERC20)
 * @returns {Object} { address, privateKey, seedPhrase }
 */
export async function generateUSDTWallet() {
  try {
    // USDT (ERC20) uses the same address format as Ethereum
    // So we generate an Ethereum wallet for USDT
    const mnemonic = bip39.generateMnemonic()
    const hdWallet = HDNodeWallet.fromPhrase(mnemonic)
    
    return {
      address: hdWallet.address,
      privateKey: hdWallet.privateKey,
      seedPhrase: mnemonic,
    }
  } catch (error) {
    console.error('Error generating USDT wallet:', error)
    throw new Error('Failed to generate USDT wallet')
  }
}

/**
 * Generate Solana (SOL) wallet
 * @returns {Object} { address, privateKey, seedPhrase, publicKey }
 */
export async function generateSOLWallet() {
  try {
    // Generate mnemonic (seed phrase)
    const mnemonic = bip39.generateMnemonic()
    
    // Convert mnemonic to seed
    const seed = await bip39.mnemonicToSeed(mnemonic)
    
    // Solana uses the first 32 bytes of the seed
    const keypair = Keypair.fromSeed(seed.slice(0, 32))
    
    return {
      address: keypair.publicKey.toBase58(),
      publicKey: keypair.publicKey.toBase58(),
      privateKey: Buffer.from(keypair.secretKey).toString('hex'),
      seedPhrase: mnemonic,
    }
  } catch (error) {
    console.error('Error generating SOL wallet:', error)
    throw new Error('Failed to generate SOL wallet')
  }
}

/**
 * Generate XRP (Ripple) wallet
 * @returns {Object} { address, privateKey, seedPhrase, publicKey }
 */
export async function generateXRPWallet() {
  try {
    // Generate mnemonic (seed phrase)
    const mnemonic = bip39.generateMnemonic()
    
    // Convert mnemonic to seed
    const seed = await bip39.mnemonicToSeed(mnemonic)
    
    // Use the seed to generate XRP keypair
    const seedHex = seed.slice(0, 16).toString('hex').toUpperCase()
    const keypair = rippleKeypairs.deriveKeypair(seedHex)
    const address = rippleKeypairs.deriveAddress(keypair.publicKey)
    
    return {
      address,
      publicKey: keypair.publicKey,
      privateKey: keypair.privateKey,
      seedPhrase: mnemonic,
    }
  } catch (error) {
    console.error('Error generating XRP wallet:', error)
    throw new Error('Failed to generate XRP wallet')
  }
}

/**
 * Generate BNB wallet (Binance Smart Chain - EVM compatible)
 * @returns {Object} { address, privateKey, seedPhrase }
 */
export async function generateBNBWallet() {
  try {
    // BNB Chain (BSC) is EVM compatible, uses same format as Ethereum
    const mnemonic = bip39.generateMnemonic()
    const hdWallet = HDNodeWallet.fromPhrase(mnemonic)
    
    return {
      address: hdWallet.address,
      privateKey: hdWallet.privateKey,
      seedPhrase: mnemonic,
    }
  } catch (error) {
    console.error('Error generating BNB wallet:', error)
    throw new Error('Failed to generate BNB wallet')
  }
}

/**
 * Generate all wallets for a new user (BTC, ETH, USDT, SOL, XRP, BNB)
 * @returns {Object} { btc, eth, usdt, sol, xrp, bnb }
 */
export async function generateUserWallets() {
  try {
    const [btc, eth, usdt, sol, xrp, bnb] = await Promise.all([
      generateBTCWallet(),
      generateETHWallet(),
      generateUSDTWallet(),
      generateSOLWallet(),
      generateXRPWallet(),
      generateBNBWallet(),
    ])
    
    return { btc, eth, usdt, sol, xrp, bnb }
  } catch (error) {
    console.error('Error generating user wallets:', error)
    throw new Error('Failed to generate user wallets')
  }
}

/**
 * Validate a mnemonic phrase
 * @param {string} mnemonic - The mnemonic to validate
 * @returns {boolean}
 */
export function validateMnemonic(mnemonic) {
  return bip39.validateMnemonic(mnemonic)
}

/**
 * Restore BTC wallet from seed phrase
 * @param {string} mnemonic - The seed phrase
 * @returns {Object} { address, privateKey }
 */
export async function restoreBTCWallet(mnemonic) {
  if (!validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic phrase')
  }
  
  try {
    const bip32 = BIP32Factory(ecc)
    const seed = await bip39.mnemonicToSeed(mnemonic)
    const root = bip32.fromSeed(seed)
    const child = root.derivePath("m/44'/0'/0'/0/0")
    
    const { address } = bitcoinjs.payments.p2pkh({
      pubkey: Buffer.from(child.publicKey),
      network: bitcoinjs.networks.bitcoin,
    })
    
    return {
      address,
      privateKey: child.toWIF(),
    }
  } catch (error) {
    console.error('Error restoring BTC wallet:', error)
    throw new Error('Failed to restore BTC wallet')
  }
}

/**
 * Restore ETH wallet from seed phrase
 * @param {string} mnemonic - The seed phrase
 * @returns {Object} { address, privateKey }
 */
export function restoreETHWallet(mnemonic) {
  if (!validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic phrase')
  }
  
  try {
    const hdWallet = HDNodeWallet.fromPhrase(mnemonic)
    
    return {
      address: hdWallet.address,
      privateKey: hdWallet.privateKey,
    }
  } catch (error) {
    console.error('Error restoring ETH wallet:', error)
    throw new Error('Failed to restore ETH wallet')
  }
}

/**
 * Restore SOL wallet from seed phrase
 * @param {string} mnemonic - The seed phrase
 * @returns {Object} { address, privateKey, publicKey }
 */
export async function restoreSOLWallet(mnemonic) {
  if (!validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic phrase')
  }
  
  try {
    const seed = await bip39.mnemonicToSeed(mnemonic)
    const keypair = Keypair.fromSeed(seed.slice(0, 32))
    
    return {
      address: keypair.publicKey.toBase58(),
      publicKey: keypair.publicKey.toBase58(),
      privateKey: Buffer.from(keypair.secretKey).toString('hex'),
    }
  } catch (error) {
    console.error('Error restoring SOL wallet:', error)
    throw new Error('Failed to restore SOL wallet')
  }
}

/**
 * Restore XRP wallet from seed phrase
 * @param {string} mnemonic - The seed phrase
 * @returns {Object} { address, privateKey, publicKey }
 */
export async function restoreXRPWallet(mnemonic) {
  if (!validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic phrase')
  }
  
  try {
    const seed = await bip39.mnemonicToSeed(mnemonic)
    const seedHex = seed.slice(0, 16).toString('hex').toUpperCase()
    const keypair = rippleKeypairs.deriveKeypair(seedHex)
    const address = rippleKeypairs.deriveAddress(keypair.publicKey)
    
    return {
      address,
      publicKey: keypair.publicKey,
      privateKey: keypair.privateKey,
    }
  } catch (error) {
    console.error('Error restoring XRP wallet:', error)
    throw new Error('Failed to restore XRP wallet')
  }
}

/**
 * Restore BNB wallet from seed phrase
 * @param {string} mnemonic - The seed phrase
 * @returns {Object} { address, privateKey }
 */
export function restoreBNBWallet(mnemonic) {
  if (!validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic phrase')
  }
  
  try {
    const hdWallet = HDNodeWallet.fromPhrase(mnemonic)
    
    return {
      address: hdWallet.address,
      privateKey: hdWallet.privateKey,
    }
  } catch (error) {
    console.error('Error restoring BNB wallet:', error)
    throw new Error('Failed to restore BNB wallet')
  }
}

export default {
  generateBTCWallet,
  generateETHWallet,
  generateUSDTWallet,
  generateSOLWallet,
  generateXRPWallet,
  generateBNBWallet,
  generateUserWallets,
  validateMnemonic,
  restoreBTCWallet,
  restoreETHWallet,
  restoreSOLWallet,
  restoreXRPWallet,
  restoreBNBWallet,
}

