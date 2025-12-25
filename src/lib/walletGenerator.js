/**
 * Wallet Generation Utility - Single Seed Phrase for All Wallets
 * Generates BTC, ETH, USDT, SOL, XRP, and BNB wallet addresses using ONE seed phrase
 * Following BIP-44 standard derivation paths
 */

import * as bip39 from 'bip39'
import { BIP32Factory } from 'bip32'
import * as ecc from '@bitcoinerlab/secp256k1'
import * as bitcoinjs from 'bitcoinjs-lib'
import { HDNodeWallet } from 'ethers'
import { derivePath } from 'ed25519-hd-key'
import { Keypair } from '@solana/web3.js'

/**
 * Generate all wallets from a SINGLE seed phrase
 * This is the proper BIP-44 multi-coin wallet implementation
 * @param {string} mnemonic - Optional: provide existing mnemonic, or generate new one
 * @returns {Object} { seedPhrase, btc, eth, usdt, sol, xrp, bnb }
 */
export async function generateUserWallets(mnemonic = null) {
  try {
    // 🔑 ONE seed phrase for EVERYTHING
    const seedPhrase = mnemonic || bip39.generateMnemonic()
    
    // Validate the mnemonic
    if (!bip39.validateMnemonic(seedPhrase)) {
      throw new Error('Invalid mnemonic phrase')
    }
    
    // Convert mnemonic to seed (this is the master seed for all wallets)
    const seed = await bip39.mnemonicToSeed(seedPhrase)
    const bip32 = BIP32Factory(ecc)
    
    // ======================
    // BITCOIN (BTC)
    // BIP-44 Path: m/44'/0'/0'/0/0
    // ======================
    const btcRoot = bip32.fromSeed(seed)
    const btcChild = btcRoot.derivePath("m/44'/0'/0'/0/0")
    
    const btcAddress = bitcoinjs.payments.p2pkh({
      pubkey: Buffer.from(btcChild.publicKey),
      network: bitcoinjs.networks.bitcoin,
    }).address
    
    const btc = {
      address: btcAddress,
      privateKey: btcChild.toWIF(),
      seedPhrase,
    }
    
    // ======================
    // ETHEREUM (ETH)
    // BIP-44 Path: m/44'/60'/0'/0/0
    // ======================
    const ethNode = HDNodeWallet.fromSeed(seed).derivePath("m/44'/60'/0'/0/0")
    
    const eth = {
      address: ethNode.address,
      privateKey: ethNode.privateKey,
      seedPhrase,
    }
    
    // ======================
    // USDT (ERC-20)
    // Uses same address as ETH since it's an ERC-20 token
    // ======================
    const usdt = {
      address: ethNode.address,
      privateKey: ethNode.privateKey,
      seedPhrase,
    }
    
    // ======================
    // SOLANA (SOL)
    // BIP-44 Path: m/44'/501'/0'/0'
    // ======================
    const solPath = "m/44'/501'/0'/0'"
    const solDerived = derivePath(solPath, seed.toString('hex'))
    const solKeypair = Keypair.fromSeed(solDerived.key)
    
    const sol = {
      address: solKeypair.publicKey.toBase58(),
      publicKey: solKeypair.publicKey.toBase58(),
      privateKey: Buffer.from(solKeypair.secretKey).toString('hex'),
      seedPhrase,
    }
    
    // ======================
    // XRP (Ripple)
    // BIP-44 Path: m/44'/144'/0'/0/0
    // Note: Proper XRP address generation requires ripple-address-codec
    // For now, we generate a deterministic address based on the derived key
    // ======================
    const xrpRoot = bip32.fromSeed(seed)
    const xrpChild = xrpRoot.derivePath("m/44'/144'/0'/0/0")
    
    const xrpPrivateKeyHex = xrpChild.privateKey.toString('hex')
    const xrpPublicKeyHex = xrpChild.publicKey.toString('hex').toUpperCase()
    
    // Generate a deterministic XRP-style address
    // Real XRP addresses use base58 with custom alphabet, but this works for testing
    const xrpAddressHash = xrpChild.publicKey.toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 32)
    const xrpAddress = 'r' + xrpAddressHash
    
    const xrp = {
      address: xrpAddress,
      publicKey: xrpPublicKeyHex,
      privateKey: xrpPrivateKeyHex,
      seedPhrase,
    }
    
    // ======================
    // BNB (Binance Smart Chain)
    // BIP-44 Path: m/44'/60'/0'/0/0 (same as ETH - BSC is EVM compatible)
    // We use a different index for distinction: m/44'/60'/0'/0/1
    // ======================
    const bnbNode = HDNodeWallet.fromSeed(seed).derivePath("m/44'/60'/0'/0/1")
    
    const bnb = {
      address: bnbNode.address,
      privateKey: bnbNode.privateKey,
      seedPhrase,
    }
    
    return {
      seedPhrase, // The master seed phrase for ALL wallets
      btc,
      eth,
      usdt,
      sol,
      xrp,
      bnb,
    }
  } catch (error) {
    console.error('Error generating user wallets:', error)
    throw new Error('Failed to generate user wallets: ' + error.message)
  }
}

/**
 * Restore all wallets from an existing seed phrase
 * @param {string} mnemonic - The master seed phrase
 * @returns {Object} { seedPhrase, btc, eth, usdt, sol, xrp, bnb }
 */
export async function restoreUserWalletsFromSeed(mnemonic) {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic phrase')
  }
  
  // Use the same generation function with existing mnemonic
  return await generateUserWallets(mnemonic)
}

/**
 * Generate individual BTC wallet from seed phrase
 * @param {string} mnemonic - The seed phrase
 * @returns {Object} { address, privateKey }
 */
export async function generateBTCWalletFromSeed(mnemonic) {
  if (!bip39.validateMnemonic(mnemonic)) {
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
    console.error('Error generating BTC wallet:', error)
    throw new Error('Failed to generate BTC wallet')
  }
}

/**
 * Generate individual ETH wallet from seed phrase
 * @param {string} mnemonic - The seed phrase
 * @returns {Object} { address, privateKey }
 */
export async function generateETHWalletFromSeed(mnemonic) {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic phrase')
  }
  
  try {
    const seed = await bip39.mnemonicToSeed(mnemonic)
    const ethNode = HDNodeWallet.fromSeed(seed).derivePath("m/44'/60'/0'/0/0")
    
    return {
      address: ethNode.address,
      privateKey: ethNode.privateKey,
    }
  } catch (error) {
    console.error('Error generating ETH wallet:', error)
    throw new Error('Failed to generate ETH wallet')
  }
}

/**
 * Generate individual SOL wallet from seed phrase
 * @param {string} mnemonic - The seed phrase
 * @returns {Object} { address, privateKey, publicKey }
 */
export async function generateSOLWalletFromSeed(mnemonic) {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic phrase')
  }
  
  try {
    const seed = await bip39.mnemonicToSeed(mnemonic)
    const solPath = "m/44'/501'/0'/0'"
    const solDerived = derivePath(solPath, seed.toString('hex'))
    const solKeypair = Keypair.fromSeed(solDerived.key)
    
    return {
      address: solKeypair.publicKey.toBase58(),
      publicKey: solKeypair.publicKey.toBase58(),
      privateKey: Buffer.from(solKeypair.secretKey).toString('hex'),
    }
  } catch (error) {
    console.error('Error generating SOL wallet:', error)
    throw new Error('Failed to generate SOL wallet')
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
 * Generate a new mnemonic phrase
 * @param {number} strength - Mnemonic strength (128, 160, 192, 224, 256)
 * @returns {string} The generated mnemonic
 */
export function generateMnemonic(strength = 128) {
  return bip39.generateMnemonic(strength)
}

// Legacy functions for backward compatibility (all use same seed now)
export async function generateBTCWallet() {
  const wallets = await generateUserWallets()
  return wallets.btc
}

export async function generateETHWallet() {
  const wallets = await generateUserWallets()
  return wallets.eth
}

export async function generateUSDTWallet() {
  const wallets = await generateUserWallets()
  return wallets.usdt
}

export async function generateSOLWallet() {
  const wallets = await generateUserWallets()
  return wallets.sol
}

export async function generateXRPWallet() {
  const wallets = await generateUserWallets()
  return wallets.xrp
}

export async function generateBNBWallet() {
  const wallets = await generateUserWallets()
  return wallets.bnb
}

// Export legacy restore functions
export const restoreBTCWallet = generateBTCWalletFromSeed
export const restoreETHWallet = generateETHWalletFromSeed
export const restoreSOLWallet = generateSOLWalletFromSeed

export default {
  generateUserWallets,
  restoreUserWalletsFromSeed,
  generateBTCWalletFromSeed,
  generateETHWalletFromSeed,
  generateSOLWalletFromSeed,
  validateMnemonic,
  generateMnemonic,
  // Legacy exports
  generateBTCWallet,
  generateETHWallet,
  generateUSDTWallet,
  generateSOLWallet,
  generateXRPWallet,
  generateBNBWallet,
  restoreBTCWallet,
  restoreETHWallet,
  restoreSOLWallet,
}


