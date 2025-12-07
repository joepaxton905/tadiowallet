'use client'

import { useState, useMemo, useEffect } from 'react'
import { usePortfolio, useWallets } from '@/hooks/useUserData'
import { useMarketData } from '@/hooks/useCryptoPrices'

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
            {/* Mock QR Code - In production, use a QR library */}
            <div className="w-48 h-48 bg-dark-950 rounded-xl flex items-center justify-center">
              <svg className="w-32 h-32 text-white" viewBox="0 0 100 100">
                <rect x="10" y="10" width="20" height="20" fill="currentColor"/>
                <rect x="70" y="10" width="20" height="20" fill="currentColor"/>
                <rect x="10" y="70" width="20" height="20" fill="currentColor"/>
                <rect x="35" y="10" width="5" height="5" fill="currentColor"/>
                <rect x="45" y="10" width="5" height="5" fill="currentColor"/>
                <rect x="55" y="10" width="5" height="5" fill="currentColor"/>
                <rect x="35" y="20" width="5" height="5" fill="currentColor"/>
                <rect x="50" y="20" width="5" height="5" fill="currentColor"/>
                <rect x="35" y="35" width="5" height="5" fill="currentColor"/>
                <rect x="45" y="35" width="5" height="5" fill="currentColor"/>
                <rect x="55" y="35" width="5" height="5" fill="currentColor"/>
                <rect x="65" y="35" width="5" height="5" fill="currentColor"/>
                <rect x="35" y="45" width="5" height="5" fill="currentColor"/>
                <rect x="50" y="45" width="5" height="5" fill="currentColor"/>
                <rect x="65" y="45" width="5" height="5" fill="currentColor"/>
                <rect x="35" y="55" width="5" height="5" fill="currentColor"/>
                <rect x="45" y="55" width="5" height="5" fill="currentColor"/>
                <rect x="55" y="55" width="5" height="5" fill="currentColor"/>
                <rect x="70" y="55" width="5" height="5" fill="currentColor"/>
                <rect x="85" y="55" width="5" height="5" fill="currentColor"/>
                <rect x="35" y="65" width="5" height="5" fill="currentColor"/>
                <rect x="50" y="65" width="5" height="5" fill="currentColor"/>
                <rect x="70" y="70" width="5" height="5" fill="currentColor"/>
                <rect x="80" y="70" width="5" height="5" fill="currentColor"/>
                <rect x="35" y="80" width="5" height="5" fill="currentColor"/>
                <rect x="45" y="80" width="5" height="5" fill="currentColor"/>
                <rect x="55" y="80" width="5" height="5" fill="currentColor"/>
                <rect x="65" y="80" width="5" height="5" fill="currentColor"/>
                <rect x="75" y="80" width="5" height="5" fill="currentColor"/>
                <rect x="85" y="80" width="5" height="5" fill="currentColor"/>
              </svg>
            </div>
          </div>
          <p className="text-dark-400 text-sm">Scan QR code to get wallet address</p>
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

