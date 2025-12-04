'use client'

import { useState } from 'react'
import { assets, marketData } from '@/lib/mockData'

const tabs = [
  { id: 'buy', name: 'Buy', icon: '↓' },
  { id: 'sell', name: 'Sell', icon: '↑' },
  { id: 'swap', name: 'Swap', icon: '⇄' },
]

export default function TradePage() {
  const [activeTab, setActiveTab] = useState('buy')
  const [selectedAsset, setSelectedAsset] = useState(assets[0])
  const [swapToAsset, setSwapToAsset] = useState(assets[1])
  const [amount, setAmount] = useState('')
  const [showAssetSelector, setShowAssetSelector] = useState(false)
  const [selectingFor, setSelectingFor] = useState('from')

  const openAssetSelector = (type) => {
    setSelectingFor(type)
    setShowAssetSelector(true)
  }

  const selectAsset = (asset) => {
    if (selectingFor === 'from') {
      setSelectedAsset(asset)
    } else {
      setSwapToAsset(asset)
    }
    setShowAssetSelector(false)
  }

  const estimatedValue = amount ? parseFloat(amount) * selectedAsset.price : 0
  const estimatedReceive = activeTab === 'swap' && amount 
    ? (parseFloat(amount) * selectedAsset.price) / swapToAsset.price 
    : 0

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
      {/* Page Header - Hidden on mobile */}
      <div className="hidden lg:block text-center">
        <h1 className="text-2xl font-heading font-bold text-white">Trade Crypto</h1>
        <p className="text-dark-400">Buy, sell, or swap your cryptocurrency</p>
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

        <div className="p-6 space-y-6">
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
                  className="flex-1 bg-transparent text-3xl font-heading font-bold text-white placeholder-dark-600 focus:outline-none"
                />
                <button
                  onClick={() => openAssetSelector('from')}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: selectedAsset.color + '20', color: selectedAsset.color }}
                  >
                    {selectedAsset.icon}
                  </div>
                  <span className="font-medium text-white">{selectedAsset.symbol}</span>
                  <svg className="w-4 h-4 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-400">
                  ≈ ${estimatedValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                {activeTab !== 'buy' && (
                  <button className="text-primary-400 hover:text-primary-300">
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
                  const temp = selectedAsset
                  setSelectedAsset(swapToAsset)
                  setSwapToAsset(temp)
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
                  <span className="text-3xl font-heading font-bold text-white">
                    {estimatedReceive.toFixed(6)}
                  </span>
                  <button
                    onClick={() => openAssetSelector('to')}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-sm font-bold"
                      style={{ backgroundColor: swapToAsset.color + '20', color: swapToAsset.color }}
                    >
                      {swapToAsset.icon}
                    </div>
                    <span className="font-medium text-white">{swapToAsset.symbol}</span>
                    <svg className="w-4 h-4 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                <div className="text-sm text-dark-400">
                  ≈ ${(estimatedReceive * swapToAsset.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          )}

          {/* Price Info */}
          <div className="bg-dark-800/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark-400">Price</span>
              <span className="text-white">
                1 {selectedAsset.symbol} = ${selectedAsset.price.toLocaleString()}
              </span>
            </div>
            {activeTab === 'swap' && (
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
            disabled={!amount || parseFloat(amount) <= 0}
            className="w-full py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-primary-500 to-accent-500 text-dark-950 hover:opacity-90"
          >
            {activeTab === 'buy' && 'Buy'} 
            {activeTab === 'sell' && 'Sell'} 
            {activeTab === 'swap' && 'Swap'} 
            {' '}{selectedAsset.symbol}
          </button>
        </div>
      </div>

      {/* Quick Buy Options */}
      {activeTab === 'buy' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Buy</h3>
          <div className="grid grid-cols-4 gap-3">
            {['$50', '$100', '$250', '$500'].map((value) => (
              <button
                key={value}
                onClick={() => setAmount((parseFloat(value.replace('$', '')) / selectedAsset.price).toFixed(6))}
                className="py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 hover:border-primary-500/50 transition-all"
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Asset Selector Modal */}
      {showAssetSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAssetSelector(false)} />
          <div className="relative w-full max-w-md bg-dark-900 rounded-2xl border border-white/10 shadow-2xl">
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
            <div className="max-h-80 overflow-y-auto p-4 pt-0 space-y-1">
              {assets.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => selectAsset(asset)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
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
                    <p className="font-medium text-white">${asset.price.toLocaleString()}</p>
                    <p className={`text-sm ${asset.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {asset.priceChange24h >= 0 ? '+' : ''}{asset.priceChange24h}%
                    </p>
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

