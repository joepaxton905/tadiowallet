'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePortfolio } from '@/hooks/useUserData'
import { useMarketData } from '@/hooks/useCryptoPrices'
import { transactionsAPI } from '@/lib/api'

export default function SendPage() {
  const router = useRouter()
  const { portfolio, loading: portfolioLoading, refetch: refetchPortfolio } = usePortfolio()
  
  // Get portfolio symbols
  const portfolioSymbols = useMemo(() => {
    if (!portfolio.length) return []
    return portfolio.map(h => h.symbol)
  }, [portfolio])
  
  const { data: marketData, loading: marketLoading } = useMarketData(portfolioSymbols, 30000)
  
  const loading = portfolioLoading || marketLoading
  
  // Combine portfolio with market data
  const assets = useMemo(() => {
    return marketData
      .map(coin => {
        const holding = portfolio.find(h => h.symbol === coin.symbol)
        return {
          ...coin,
          id: coin.symbol.toLowerCase(),
          holdings: holding?.holdings || 0,
          value: (holding?.holdings || 0) * coin.price,
        }
      })
      .filter(asset => asset.holdings > 0)
  }, [marketData, portfolio])
  
  const [selectedAsset, setSelectedAsset] = useState(null)
  
  // Set initial selected asset once assets are loaded
  useEffect(() => {
    if (!selectedAsset && assets.length > 0) {
      setSelectedAsset(assets[0])
    }
  }, [assets, selectedAsset])
  
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [showAssetSelector, setShowAssetSelector] = useState(false)
  const [step, setStep] = useState(1)
  const [validatingAddress, setValidatingAddress] = useState(false)
  const [recipientInfo, setRecipientInfo] = useState(null)
  const [addressError, setAddressError] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [sendSuccess, setSendSuccess] = useState(false)

  const estimatedValue = amount && selectedAsset ? parseFloat(amount) * selectedAsset.price : 0
  
  // Calculate network fee (0.1% of transaction value, min $0.01, max $10)
  const calculateFee = () => {
    if (!estimatedValue) return 0
    const feePercentage = 0.001 // 0.1%
    const calculatedFee = estimatedValue * feePercentage
    return Math.max(0.01, Math.min(10, calculatedFee))
  }
  
  const networkFee = calculateFee()

  // Validate recipient address
  const validateAddress = useCallback(async () => {
    if (!recipient || !selectedAsset) return
    
    setValidatingAddress(true)
    setAddressError('')
    setRecipientInfo(null)
    
    try {
      const result = await transactionsAPI.validateRecipient(recipient, selectedAsset.symbol)
      if (result.success && result.valid) {
        setRecipientInfo(result.recipient)
        setAddressError('')
      }
    } catch (error) {
      setAddressError(error.message || 'Invalid wallet address')
      setRecipientInfo(null)
    } finally {
      setValidatingAddress(false)
    }
  }, [recipient, selectedAsset])

  const handleContinue = async () => {
    if (step === 1 && recipient && amount && selectedAsset) {
      // Validate address before proceeding
      if (!recipientInfo) {
        await validateAddress()
        // Check again after validation
        if (!recipientInfo) {
          return
        }
      }
      setStep(2)
    }
  }

  const handleConfirmSend = async () => {
    if (!selectedAsset || !amount || !recipient) return
    
    setSending(true)
    setSendError('')
    
    try {
      const result = await transactionsAPI.transfer(
        recipient,
        selectedAsset.symbol,
        parseFloat(amount),
        '' // notes
      )
      
      if (result.success) {
        setSendSuccess(true)
        // Refetch portfolio to update balances
        await refetchPortfolio()
        
        // Redirect to transactions page after 2 seconds
        setTimeout(() => {
          router.push('/dashboard/transactions')
        }, 2000)
      }
    } catch (error) {
      setSendError(error.message || 'Failed to send transaction')
      setSending(false)
    }
  }

  // Validate address when recipient changes
  useEffect(() => {
    if (recipient && recipient.length > 10 && selectedAsset) {
      const timer = setTimeout(() => {
        validateAddress()
      }, 500) // Debounce
      
      return () => clearTimeout(timer)
    } else {
      setRecipientInfo(null)
      setAddressError('')
    }
  }, [recipient, selectedAsset, validateAddress])
  
  // Show loading skeleton while data is loading
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="glass-card p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-dark-700 rounded w-1/2" />
            <div className="h-20 bg-dark-700 rounded" />
            <div className="h-20 bg-dark-700 rounded" />
          </div>
        </div>
      </div>
    )
  }
  
  // Show empty state if user has no assets
  if (assets.length === 0) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="hidden lg:block text-center">
          <h1 className="text-2xl font-heading font-bold text-white">Send Crypto</h1>
          <p className="text-dark-400">Transfer cryptocurrency to any wallet address</p>
        </div>
        
        <div className="glass-card p-8 sm:p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Assets to Send</h3>
          <p className="text-dark-400 mb-6">
            You don't have any cryptocurrency in your portfolio yet.
          </p>
          <a
            href="/dashboard/trade"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-dark-950 font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Buy Crypto
          </a>
        </div>
      </div>
    )
  }
  
  // Ensure selectedAsset is set
  if (!selectedAsset && assets.length > 0) {
    return null // Will be set by useEffect on next render
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
                onChange={(e) => {
                  setRecipient(e.target.value)
                  setRecipientInfo(null)
                  setAddressError('')
                }}
                placeholder="Enter wallet address"
                className={`w-full px-4 py-4 pr-12 bg-dark-800/50 border rounded-xl text-white placeholder-dark-500 focus:outline-none transition-colors ${
                  addressError 
                    ? 'border-red-500/50 focus:border-red-500' 
                    : recipientInfo 
                    ? 'border-green-500/50 focus:border-green-500' 
                    : 'border-white/5 focus:border-primary-500/50'
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {validatingAddress ? (
                  <div className="animate-spin h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full" />
                ) : recipientInfo ? (
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : addressError && recipient ? (
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : null}
              </div>
            </div>
            
            {/* Recipient Info */}
            {recipientInfo && (
              <div className="mt-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <p className="text-green-400 font-medium">{recipientInfo.name}</p>
                    <p className="text-green-500/70 text-xs">{recipientInfo.email}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Error Message */}
            {addressError && recipient && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {addressError}
              </p>
            )}
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
            disabled={!amount || !recipient || !recipientInfo || validatingAddress}
            className="w-full py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-primary-500 to-accent-500 text-dark-950 hover:opacity-90"
          >
            {validatingAddress ? 'Validating...' : 'Continue'}
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

          {/* Recipient Info */}
          {recipientInfo && (
            <div className="bg-dark-800/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg">
                  {recipientInfo.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-medium">{recipientInfo.name}</p>
                  <p className="text-dark-400 text-sm">{recipientInfo.email}</p>
                </div>
              </div>
            </div>
          )}

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
              <span className="text-dark-400">
                Transfer Fee 
                <span className="text-xs text-dark-500 ml-1">(0.1%)</span>
              </span>
              <span className="text-white">~${networkFee.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <span className="text-dark-400">Total</span>
              <span className="text-white font-semibold">
                ${(estimatedValue + networkFee).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {sendError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {sendError}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                setStep(1)
                setSendError('')
              }}
              disabled={sending}
              className="py-4 rounded-xl font-semibold bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button 
              onClick={handleConfirmSend}
              disabled={sending}
              className="py-4 rounded-xl font-semibold bg-gradient-to-r from-primary-500 to-accent-500 text-dark-950 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-dark-950 border-t-transparent rounded-full" />
                  Sending...
                </>
              ) : (
                'Confirm Send'
              )}
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
                  onClick={() => { 
                    setSelectedAsset(asset); 
                    setShowAssetSelector(false);
                    setRecipientInfo(null);
                    setAddressError('');
                  }}
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

      {/* Success Modal */}
      {sendSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-dark-900 rounded-2xl border border-white/10 shadow-2xl p-8 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center animate-scale-in">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">Transfer Successful!</h3>
            <p className="text-dark-400 mb-6">
              You've successfully sent <span className="text-white font-semibold">{amount} {selectedAsset?.symbol}</span> to {recipientInfo?.name}
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg">
                <span className="text-dark-400">Amount</span>
                <span className="text-white font-medium">{amount} {selectedAsset?.symbol}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg">
                <span className="text-dark-400">Value</span>
                <span className="text-white font-medium">
                  ${estimatedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg">
                <span className="text-dark-400">Recipient</span>
                <span className="text-white font-medium">{recipientInfo?.name}</span>
              </div>
            </div>

            <p className="mt-6 text-sm text-dark-500">
              Redirecting to transactions...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

