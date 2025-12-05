'use client'

import { useState, useEffect, useMemo } from 'react'
import { useMarketData } from '@/hooks/useCryptoPrices'
import { formatPrice, COIN_META } from '@/lib/crypto'

const tabs = [
  { id: 'buy', name: 'Buy', icon: '↓' },
  { id: 'sell', name: 'Sell', icon: '↑' },
  { id: 'swap', name: 'Swap', icon: '⇄' },
]

// Mock holdings for sell functionality
const mockHoldings = {
  BTC: 1.45,
  ETH: 12.5,
  SOL: 150,
  ADA: 10000,
  MATIC: 5000,
  AVAX: 100,
  LINK: 200,
  DOT: 300,
}

export default function TradePage() {
  const [activeTab, setActiveTab] = useState('buy')
  const [selectedSymbol, setSelectedSymbol] = useState('BTC')
  const [swapToSymbol, setSwapToSymbol] = useState('ETH')
  const [amount, setAmount] = useState('')
  const [showAssetSelector, setShowAssetSelector] = useState(false)
  const [selectingFor, setSelectingFor] = useState('from')

  const { data: marketData, loading } = useMarketData(
    ['BTC', 'ETH', 'SOL', 'ADA', 'MATIC', 'AVAX', 'LINK', 'DOT'],
    15000 // Faster refresh for trading
  )

  // Get selected asset data
  const selectedAsset = useMemo(() => {
    const asset = marketData.find(a => a.symbol === selectedSymbol)
    if (asset) return { ...asset, holdings: mockHoldings[asset.symbol] || 0 }
    const meta = COIN_META[selectedSymbol] || {}
    return {
      symbol: selectedSymbol,
      name: meta.name || selectedSymbol,
      icon: meta.icon || '●',
      color: meta.color || '#888',
      price: 0,
      priceChange24h: 0,
      holdings: mockHoldings[selectedSymbol] || 0,
    }
  }, [marketData, selectedSymbol])

  const swapToAsset = useMemo(() => {
    const asset = marketData.find(a => a.symbol === swapToSymbol)
    if (asset) return asset
    const meta = COIN_META[swapToSymbol] || {}
    return {
      symbol: swapToSymbol,
      name: meta.name || swapToSymbol,
      icon: meta.icon || '●',
      color: meta.color || '#888',
      price: 0,
      priceChange24h: 0,
    }
  }, [marketData, swapToSymbol])

  const openAssetSelector = (type) => {
    setSelectingFor(type)
    setShowAssetSelector(true)
  }

  const selectAsset = (symbol) => {
    if (selectingFor === 'from') {
      setSelectedSymbol(symbol)
    } else {
      setSwapToSymbol(symbol)
    }
    setShowAssetSelector(false)
  }

  const estimatedValue = amount && selectedAsset.price ? parseFloat(amount) * selectedAsset.price : 0
  const estimatedReceive = activeTab === 'swap' && amount && selectedAsset.price && swapToAsset.price
    ? (parseFloat(amount) * selectedAsset.price) / swapToAsset.price 
    : 0

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
      {/* Page Header - Hidden on mobile */}
      <div className="hidden lg:block text-center">
        <h1 className="text-2xl font-heading font-bold text-white">Trade Crypto</h1>
        <p className="text-dark-400">Buy, sell, or swap your cryptocurrency</p>
      </div>

      {/* Live Price Banner */}
      <div className="flex items-center justify-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm text-green-400">Live prices</span>
        </div>
      </div>

      {/* Trade Card */}
      <div className="glass-card overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 text-center font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-white bg-white/5 border-b-2 border-primary-400'
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* From Section */}
          <div>
            <label className="block text-sm text-dark-400 mb-2">
              {activeTab === 'buy' ? 'You pay' : activeTab === 'sell' ? 'You sell' : 'From'}
            </label>
            <div className="bg-dark-800/50 rounded-xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 bg-transparent text-2xl sm:text-3xl font-heading font-bold text-white placeholder-dark-600 focus:outline-none"
                />
                <button
                  onClick={() => openAssetSelector('from')}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  {loading ? (
                    <div className="w-6 h-6 rounded-lg bg-dark-700 animate-pulse" />
                  ) : (
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-sm font-bold"
                      style={{ backgroundColor: selectedAsset.color + '20', color: selectedAsset.color }}
                    >
                      {selectedAsset.icon}
                    </div>
                  )}
                  <span className="font-medium text-white">{selectedAsset.symbol}</span>
                  <svg className="w-4 h-4 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-400">
                  ≈ ${formatPrice(estimatedValue)}
                </span>
                {activeTab !== 'buy' && (
                  <button 
                    onClick={() => setAmount(selectedAsset.holdings.toString())}
                    className="text-primary-400 hover:text-primary-300"
                  >
                    Max: {selectedAsset.holdings} {selectedAsset.symbol}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Swap Arrow */}
          {activeTab === 'swap' && (
            <div className="flex justify-center -my-2">
              <button
                onClick={() => {
                  const temp = selectedSymbol
                  setSelectedSymbol(swapToSymbol)
                  setSwapToSymbol(temp)
                }}
                className="w-10 h-10 rounded-xl bg-dark-800 border border-white/10 flex items-center justify-center text-dark-400 hover:text-white hover:border-primary-500/50 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>
          )}

          {/* To Section (for Swap) */}
          {activeTab === 'swap' && (
            <div>
              <label className="block text-sm text-dark-400 mb-2">To</label>
              <div className="bg-dark-800/50 rounded-xl p-4 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl sm:text-3xl font-heading font-bold text-white">
                    {estimatedReceive ? estimatedReceive.toFixed(6) : '0.00'}
                  </span>
                  <button
                    onClick={() => openAssetSelector('to')}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    {loading ? (
                      <div className="w-6 h-6 rounded-lg bg-dark-700 animate-pulse" />
                    ) : (
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-sm font-bold"
                        style={{ backgroundColor: swapToAsset.color + '20', color: swapToAsset.color }}
                      >
                        {swapToAsset.icon}
                      </div>
                    )}
                    <span className="font-medium text-white">{swapToAsset.symbol}</span>
                    <svg className="w-4 h-4 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                <div className="text-sm text-dark-400">
                  ≈ ${formatPrice(estimatedReceive * swapToAsset.price)}
                </div>
              </div>
            </div>
          )}

          {/* Price Info */}
          <div className="bg-dark-800/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark-400">Current Price</span>
              <span className="text-white font-medium">
                1 {selectedAsset.symbol} = ${formatPrice(selectedAsset.price)}
                <span className={`ml-2 ${selectedAsset.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ({selectedAsset.priceChange24h >= 0 ? '+' : ''}{selectedAsset.priceChange24h?.toFixed(2)}%)
                </span>
              </span>
            </div>
            {activeTab === 'swap' && swapToAsset.price > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-400">Exchange Rate</span>
                <span className="text-white">
                  1 {selectedAsset.symbol} = {(selectedAsset.price / swapToAsset.price).toFixed(6)} {swapToAsset.symbol}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark-400">Network Fee</span>
              <span className="text-white">~$2.50</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark-400">Estimated Time</span>
              <span className="text-white">~30 seconds</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            disabled={!amount || parseFloat(amount) <= 0 || loading}
            className="w-full py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-primary-500 to-accent-500 text-dark-950 hover:opacity-90"
          >
            {loading ? 'Loading...' : (
              <>
                {activeTab === 'buy' && 'Buy'} 
                {activeTab === 'sell' && 'Sell'} 
                {activeTab === 'swap' && 'Swap'} 
                {' '}{selectedAsset.symbol}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Buy Options */}
      {activeTab === 'buy' && selectedAsset.price > 0 && (
        <div className="glass-card p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Quick Buy</h3>
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {['$50', '$100', '$250', '$500'].map((value) => (
              <button
                key={value}
                onClick={() => setAmount((parseFloat(value.replace('$', '')) / selectedAsset.price).toFixed(6))}
                className="py-2 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm sm:text-base font-medium hover:bg-white/10 hover:border-primary-500/50 transition-all active:scale-95"
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Asset Selector Modal */}
      {showAssetSelector && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAssetSelector(false)} />
          <div className="relative w-full sm:max-w-md bg-dark-900 sm:rounded-2xl rounded-t-2xl border-t sm:border border-white/10 shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h3 className="text-lg font-semibold text-white">Select Asset</h3>
              <button
                onClick={() => setShowAssetSelector(false)}
                className="p-2 text-dark-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <input
                type="text"
                placeholder="Search assets..."
                className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500/50"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-4 pt-0 space-y-1">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                    <div className="w-10 h-10 rounded-xl bg-dark-700" />
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-dark-700 rounded mb-1" />
                      <div className="h-3 w-16 bg-dark-700 rounded" />
                    </div>
                  </div>
                ))
              ) : (
                marketData.map((asset) => (
                  <button
                    key={asset.symbol}
                    onClick={() => selectAsset(asset.symbol)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
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
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">${formatPrice(asset.price)}</p>
                      <p className={`text-sm ${asset.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {asset.priceChange24h >= 0 ? '+' : ''}{asset.priceChange24h.toFixed(2)}%
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
