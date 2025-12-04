'use client'

import { useState } from 'react'
import { assets } from '@/lib/mockData'

export default function SendPage() {
  const [selectedAsset, setSelectedAsset] = useState(assets[0])
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [showAssetSelector, setShowAssetSelector] = useState(false)
  const [step, setStep] = useState(1)

  const estimatedValue = amount ? parseFloat(amount) * selectedAsset.price : 0
  const networkFee = 0.0001 * selectedAsset.price

  const handleContinue = () => {
    if (step === 1 && recipient && amount) {
      setStep(2)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
      {/* Page Header - Hidden on mobile */}
      <div className="hidden lg:block text-center">
        <h1 className="text-2xl font-heading font-bold text-white">Send Crypto</h1>
        <p className="text-dark-400">Transfer cryptocurrency to any wallet address</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= s 
                ? 'bg-primary-500 text-dark-950' 
                : 'bg-dark-800 text-dark-400'
            }`}>
              {step > s ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : s}
            </div>
            <span className={`text-sm ${step >= s ? 'text-white' : 'text-dark-400'}`}>
              {s === 1 ? 'Details' : 'Confirm'}
            </span>
            {s < 2 && <div className="w-12 h-0.5 bg-dark-700" />}
          </div>
        ))}
      </div>

      {step === 1 ? (
        <div className="glass-card p-6 space-y-6">
          {/* Asset Selection */}
          <div>
            <label className="block text-sm text-dark-400 mb-2">Asset to Send</label>
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
                  <p className="text-sm text-dark-400">Balance: {selectedAsset.holdings} {selectedAsset.symbol}</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Recipient Address */}
          <div>
            <label className="block text-sm text-dark-400 mb-2">Recipient Address</label>
            <div className="relative">
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter wallet address"
                className="w-full px-4 py-4 bg-dark-800/50 border border-white/5 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/50"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-primary-400 hover:text-primary-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm text-dark-400 mb-2">Amount</label>
            <div className="bg-dark-800/50 rounded-xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 bg-transparent text-3xl font-heading font-bold text-white placeholder-dark-600 focus:outline-none"
                />
                <span className="text-lg font-medium text-white">{selectedAsset.symbol}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-400">
                  ≈ ${estimatedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <button
                  onClick={() => setAmount(selectedAsset.holdings.toString())}
                  className="text-primary-400 hover:text-primary-300"
                >
                  Max
                </button>
              </div>
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-3">
            {['25%', '50%', '75%', '100%'].map((pct) => (
              <button
                key={pct}
                onClick={() => {
                  const percent = parseInt(pct) / 100
                  setAmount((selectedAsset.holdings * percent).toFixed(6))
                }}
                className="py-2 bg-white/5 border border-white/10 rounded-xl text-dark-300 font-medium hover:bg-white/10 hover:text-white transition-all"
              >
                {pct}
              </button>
            ))}
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!amount || !recipient}
            className="w-full py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-primary-500 to-accent-500 text-dark-950 hover:opacity-90"
          >
            Continue
          </button>
        </div>
      ) : (
        <div className="glass-card p-6 space-y-6">
          {/* Confirmation Details */}
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <p className="text-dark-400 text-sm">You are sending</p>
            <p className="text-4xl font-heading font-bold text-white mt-2">
              {amount} {selectedAsset.symbol}
            </p>
            <p className="text-dark-400">
              ≈ ${estimatedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* Transaction Details */}
          <div className="bg-dark-800/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-dark-400">To</span>
              <span className="text-white font-mono text-sm">
                {recipient.slice(0, 6)}...{recipient.slice(-4)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dark-400">Network</span>
              <span className="text-white">{selectedAsset.name} Network</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dark-400">Network Fee</span>
              <span className="text-white">~${networkFee.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <span className="text-dark-400">Total</span>
              <span className="text-white font-semibold">
                ${(estimatedValue + networkFee).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setStep(1)}
              className="py-4 rounded-xl font-semibold bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all"
            >
              Back
            </button>
            <button className="py-4 rounded-xl font-semibold bg-gradient-to-r from-primary-500 to-accent-500 text-dark-950 hover:opacity-90 transition-all">
              Confirm Send
            </button>
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
                      <p className="text-sm text-dark-400">{asset.holdings} {asset.symbol}</p>
                    </div>
                  </div>
                  <span className="text-white">${asset.value.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

