'use client'

import { useState, useEffect } from 'react'

export default function EditStatsModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    portfolioValue: '',
    totalInvested: '',
    profitLoss: '',
    profitLossPercentage: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      // Get stats from calculatedStats or calculate from portfolio
      let portfolioValue = 0
      let totalInvested = 0
      
      if (user.calculatedStats) {
        portfolioValue = user.calculatedStats.portfolioValue || 0
        totalInvested = user.calculatedStats.totalInvested || 0
      } else if (user.portfolio && user.portfolio.length > 0) {
        // Calculate from portfolio if stats don't exist
        portfolioValue = user.portfolio.reduce((sum, holding) => {
          return sum + (holding.holdings * holding.averageBuyPrice)
        }, 0)
        
        // Calculate from buy transactions if available
        if (user.recentTransactions) {
          const buyTxs = user.recentTransactions.filter(tx => tx.type === 'buy')
          totalInvested = buyTxs.reduce((sum, tx) => sum + tx.value, 0)
        }
      }
      
      const profitLoss = portfolioValue - totalInvested
      const profitLossPercentage = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0
      
      setFormData({
        portfolioValue,
        totalInvested,
        profitLoss,
        profitLossPercentage,
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    const numValue = parseFloat(value) || 0
    
    setFormData(prev => {
      const updated = { ...prev, [name]: numValue }
      
      // Auto-calculate profit/loss when portfolio value or total invested changes
      if (name === 'portfolioValue' || name === 'totalInvested') {
        const pv = name === 'portfolioValue' ? numValue : updated.portfolioValue
        const ti = name === 'totalInvested' ? numValue : updated.totalInvested
        updated.profitLoss = pv - ti
        updated.profitLossPercentage = ti > 0 ? ((pv - ti) / ti) * 100 : 0
      }
      
      return updated
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    console.log('Submitting stats:', formData)

    try {
      await onSave(formData)
      console.log('Stats saved successfully')
      onClose()
    } catch (err) {
      console.error('Error saving stats:', err)
      setError(err.message || 'Failed to update statistics')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-dark-900 rounded-2xl border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h3 className="text-2xl font-bold text-white">Edit Statistics</h3>
            <p className="text-dark-400 text-sm mt-1">
              {user?.firstName} {user?.lastName} - Manual Stats Correction
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-dark-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            </div>
          )}

          {/* Portfolio Value */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Portfolio Value
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400">$</span>
              <input
                type="number"
                step="0.01"
                name="portfolioValue"
                value={formData.portfolioValue}
                onChange={handleChange}
                required
                className="w-full pl-8 pr-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/50 transition-colors"
              />
            </div>
            <p className="text-xs text-dark-500 mt-1">Current total value of all holdings</p>
          </div>

          {/* Total Invested */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Total Invested
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400">$</span>
              <input
                type="number"
                step="0.01"
                name="totalInvested"
                value={formData.totalInvested}
                onChange={handleChange}
                required
                className="w-full pl-8 pr-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/50 transition-colors"
              />
            </div>
            <p className="text-xs text-dark-500 mt-1">Amount user has invested (from buy transactions)</p>
          </div>

          {/* Calculated Fields (Read-only display) */}
          <div className="p-4 bg-white/5 rounded-xl space-y-3">
            <h4 className="text-sm font-semibold text-white mb-3">Auto-Calculated Values</h4>
            
            {/* Profit/Loss */}
            <div className="flex items-center justify-between">
              <span className="text-dark-400 text-sm">Profit/Loss (absolute)</span>
              <span className={`text-lg font-bold ${formData.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formData.profitLoss >= 0 ? '+' : ''}${formData.profitLoss.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            
            {/* Profit/Loss Percentage */}
            <div className="flex items-center justify-between">
              <span className="text-dark-400 text-sm">Profit/Loss (percentage)</span>
              <span className={`text-lg font-bold ${formData.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formData.profitLoss >= 0 ? '+' : ''}{(formData.profitLossPercentage || 0).toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Warning */}
          <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
            <p className="text-orange-400 text-sm flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>
                <strong>Warning:</strong> Manually editing statistics overrides calculated values. 
                This is for corrections only. Use "Edit Balance" to change actual portfolio holdings. 
                Stats can be recalculated from actual data at any time.
              </span>
            </p>
          </div>

          {/* Info */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-blue-400 text-sm flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                These changes only affect displayed statistics. To change actual portfolio holdings, 
                use the "Edit Balance" button. Profit/Loss is automatically calculated from the two values above.
              </span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/5 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Saving...
                </>
              ) : (
                'Save Statistics'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

