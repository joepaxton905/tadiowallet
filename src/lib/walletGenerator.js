/**
 * Wallet Generation Utility
 * Generates BTC, ETH, and USDT wallet addresses using BIP39 and BIP32
 */

import * as bip39 from 'bip39'
import { BIP32Factory } from 'bip32'
import * as ecc from '@bitcoinerlab/secp256k1'
import * as bitcoinjs from 'bitcoinjs-lib'
import { HDNodeWallet } from 'ethers'

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
 * Generate all wallets for a new user (BTC, ETH, USDT)
 * @returns {Object} { btc, eth, usdt }
 */
export async function generateUserWallets() {
  try {
    const [btc, eth, usdt] = await Promise.all([
      generateBTCWallet(),
      generateETHWallet(),
      generateUSDTWallet(),
    ])
    
    return { btc, eth, usdt }
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

export default {
  generateBTCWallet,
  generateETHWallet,
  generateUSDTWallet,
  generateUserWallets,
  validateMnemonic,
  restoreBTCWallet,
  restoreETHWallet,
}

