'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { usePortfolio, useWallets } from '@/hooks/useUserData'
import { useMarketData } from '@/hooks/useCryptoPrices'
import QRCode from 'qrcode'

export default function ReceivePage() {
  const { portfolio, loading: portfolioLoading } = usePortfolio()
  const { wallets, createOrUpdateWallet, loading: walletsLoading } = useWallets()
  
  // Get portfolio symbols (show all available coins, not just ones with holdings)
  const availableSymbols = ['BTC', 'ETH', 'SOL', 'ADA', 'MATIC', 'AVAX', 'LINK', 'DOT']
  
  const { data: marketData, loading: marketLoading } = useMarketData(availableSymbols, 30000)
  
  const loading = marketLoading // Main loading state for market data
  
  // Combine market data into assets
  const assets = useMemo(() => {
    return marketData.map(coin => ({
      ...coin,
      id: coin.symbol.toLowerCase(),
    }))
  }, [marketData])
  
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [showAssetSelector, setShowAssetSelector] = useState(false)
  const [copied, setCopied] = useState(false)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('')
  const canvasRef = useRef(null)
  
  // Set initial selected asset once assets are loaded
  useEffect(() => {
    if (!selectedAsset && assets.length > 0) {
      setSelectedAsset(assets[0])
    }
  }, [assets, selectedAsset])
  
  // Get wallet address for selected asset
  const walletAddress = useMemo(() => {
    if (!selectedAsset) return ''
    const wallet = wallets.find(w => w.symbol === selectedAsset.symbol)
    return wallet?.address || ''
  }, [selectedAsset, wallets])
  
  // Generate wallet if none exists for this asset
  useEffect(() => {
    if (selectedAsset && !walletAddress) {
      // Auto-generate wallet address for this asset
      createOrUpdateWallet(selectedAsset.symbol).catch(console.error)
    }
  }, [selectedAsset, walletAddress, createOrUpdateWallet])

  // Generate QR code when wallet address changes
  useEffect(() => {
    if (walletAddress) {
      // Generate QR code
      QRCode.toDataURL(walletAddress, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      })
      .then(url => {
        setQrCodeDataUrl(url)
      })
      .catch(err => {
        console.error('Error generating QR code:', err)
      })
    } else {
      setQrCodeDataUrl('')
    }
  }, [walletAddress])

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  
  // Show loading skeleton while data is loading
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="glass-card p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-dark-700 rounded w-1/2" />
            <div className="h-48 bg-dark-700 rounded" />
            <div className="h-16 bg-dark-700 rounded" />
          </div>
        </div>
      </div>
    )
  }
  
  // Ensure selectedAsset is set (should always have assets for receive)
  if (!selectedAsset && assets.length > 0) {
    return null // Will be set by useEffect on next render
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
      {/* Page Header - Hidden on mobile */}
      <div className="hidden lg:block text-center">
        <h1 className="text-2xl font-heading font-bold text-white">Receive Crypto</h1>
        <p className="text-dark-400">Share your wallet address to receive cryptocurrency</p>
      </div>

      <div className="glass-card p-6 space-y-6">
        {/* Asset Selection */}
        <div>
          <label className="block text-sm text-dark-400 mb-2">Select Asset</label>
          <button
            onClick={() => setShowAssetSelector(true)}
            className="w-full flex items-center justify-between p-4 bg-dark-800/50 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                style={{ backgroundColor: selectedAsset.color + '20', color: selectedAsset.color }}
              >
                {selectedAsset.icon}
              </div>
              <div className="text-left">
                <p className="font-medium text-white">{selectedAsset.name}</p>
                <p className="text-sm text-dark-400">{selectedAsset.symbol}</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center py-8">
          <div className="p-4 bg-white rounded-2xl mb-6">
            {qrCodeDataUrl && walletAddress ? (
              <img 
                src={qrCodeDataUrl} 
                alt={`QR Code for ${selectedAsset.symbol} address`}
                className="w-48 h-48 rounded-xl"
              />
            ) : (
              <div className="w-48 h-48 bg-dark-800 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-12 h-12 text-dark-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <p className="text-dark-600 text-sm">Generating QR...</p>
                </div>
              </div>
            )}
          </div>
          <p className="text-dark-400 text-sm">
            {walletAddress ? 'Scan QR code to get wallet address' : 'Generating wallet address...'}
          </p>
        </div>

        {/* Wallet Address */}
        <div>
          <label className="block text-sm text-dark-400 mb-2">Your {selectedAsset.symbol} Address</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-4 py-3 bg-dark-800/50 rounded-xl border border-white/5 font-mono text-sm text-white overflow-hidden">
              <span className="block truncate">{walletAddress}</span>
            </div>
            <button
              onClick={copyAddress}
              className={`p-3 rounded-xl transition-all ${
                copied 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-white/5 text-dark-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {copied ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-medium text-yellow-400 mb-1">Important</p>
            <p className="text-sm text-dark-300">
              Only send {selectedAsset.name} ({selectedAsset.symbol}) to this address. Sending any other asset may result in permanent loss.
            </p>
          </div>
        </div>

        {/* Share Button */}
        <button className="w-full py-4 rounded-xl font-semibold bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share Address
        </button>
      </div>

      {/* Asset Selector Modal */}
      {showAssetSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAssetSelector(false)} />
          <div className="relative w-full max-w-md bg-dark-900 rounded-2xl border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h3 className="text-lg font-semibold text-white">Select Asset</h3>
              <button onClick={() => setShowAssetSelector(false)} className="p-2 text-dark-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto p-4 space-y-1">
              {assets.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => { setSelectedAsset(asset); setShowAssetSelector(false); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                    style={{ backgroundColor: asset.color + '20', color: asset.color }}
                  >
                    {asset.icon}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-white">{asset.name}</p>
                    <p className="text-sm text-dark-400">{asset.symbol}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

