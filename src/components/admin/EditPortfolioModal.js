'use client'

import { useState, useEffect } from 'react'

export default function EditPortfolioModal({ user, onClose, onSave }) {
  const [holdings, setHoldings] = useState([])
  const [newHolding, setNewHolding] = useState({ symbol: '', holdings: '', averageBuyPrice: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showAddNew, setShowAddNew] = useState(false)

  useEffect(() => {
    if (user?.portfolio) {
      setHoldings(user.portfolio.map(p => ({
        symbol: p.symbol,
        holdings: p.holdings,
        averageBuyPrice: p.averageBuyPrice || 0,
        _id: p._id
      })))
    }
  }, [user])

  const handleHoldingChange = (index, field, value) => {
    const updated = [...holdings]
    updated[index][field] = field === 'symbol' ? value.toUpperCase() : parseFloat(value) || 0
    setHoldings(updated)
  }

  const handleRemoveHolding = (index) => {
    const updated = holdings.filter((_, i) => i !== index)
    setHoldings(updated)
  }

  const handleAddNew = () => {
    if (!newHolding.symbol) {
      setError('Asset symbol is required')
      return
    }

    const exists = holdings.find(h => h.symbol === newHolding.symbol.toUpperCase())
    if (exists) {
      setError('This asset already exists in the portfolio')
      return
    }

    setHoldings([...holdings, {
      symbol: newHolding.symbol.toUpperCase(),
      holdings: parseFloat(newHolding.holdings) || 0,
      averageBuyPrice: parseFloat(newHolding.averageBuyPrice) || 0,
    }])

    setNewHolding({ symbol: '', holdings: '', averageBuyPrice: '' })
    setShowAddNew(false)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      await onSave(holdings)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to update portfolio')
    } finally {
      setSaving(false)
    }
  }

  const calculateTotalValue = () => {
    return holdings.reduce((sum, h) => sum + (h.holdings * h.averageBuyPrice), 0)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-dark-900 rounded-2xl border border-white/10 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h3 className="text-2xl font-bold text-white">Edit Portfolio</h3>
            <p className="text-dark-400 text-sm mt-1">
              {user?.firstName} {user?.lastName} - Total Value: ${calculateTotalValue().toLocaleString('en-US', { minimumFractionDigits: 2 })}
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

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
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

          {/* Holdings List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">Current Holdings</h4>
              <button
                type="button"
                onClick={() => setShowAddNew(true)}
                className="px-4 py-2 bg-green-500/10 text-green-400 rounded-xl font-medium hover:bg-green-500/20 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Asset
              </button>
            </div>

            {holdings.length === 0 ? (
              <div className="text-center py-12 text-dark-400">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p>No holdings yet. Add an asset to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {holdings.map((holding, index) => (
                  <div key={holding._id || index} className="p-4 bg-white/5 rounded-xl">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Asset Symbol */}
                      <div className="col-span-3">
                        <label className="block text-xs text-dark-400 mb-1">Asset</label>
                        <input
                          type="text"
                          value={holding.symbol}
                          onChange={(e) => handleHoldingChange(index, 'symbol', e.target.value)}
                          className="w-full px-3 py-2 bg-dark-800/50 border border-white/10 rounded-lg text-white font-semibold uppercase focus:outline-none focus:border-primary-500/50"
                          placeholder="BTC"
                        />
                      </div>

                      {/* Holdings Amount */}
                      <div className="col-span-4">
                        <label className="block text-xs text-dark-400 mb-1">Holdings</label>
                        <input
                          type="number"
                          step="any"
                          value={holding.holdings}
                          onChange={(e) => handleHoldingChange(index, 'holdings', e.target.value)}
                          className="w-full px-3 py-2 bg-dark-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500/50"
                          placeholder="0.00"
                        />
                      </div>

                      {/* Average Buy Price */}
                      <div className="col-span-4">
                        <label className="block text-xs text-dark-400 mb-1">Avg Buy Price</label>
                        <input
                          type="number"
                          step="any"
                          value={holding.averageBuyPrice}
                          onChange={(e) => handleHoldingChange(index, 'averageBuyPrice', e.target.value)}
                          className="w-full px-3 py-2 bg-dark-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500/50"
                          placeholder="0.00"
                        />
                      </div>

                      {/* Remove Button */}
                      <div className="col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveHolding(index)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Remove"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* Value Display */}
                    <div className="mt-2 text-sm text-dark-400">
                      Total Value: ${(holding.holdings * holding.averageBuyPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Holding Form */}
            {showAddNew && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <h5 className="text-white font-semibold mb-3">Add New Asset</h5>
                <div className="grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-3">
                    <label className="block text-xs text-dark-400 mb-1">Symbol</label>
                    <input
                      type="text"
                      value={newHolding.symbol}
                      onChange={(e) => setNewHolding(prev => ({ ...prev, symbol: e.target.value }))}
                      className="w-full px-3 py-2 bg-dark-800/50 border border-white/10 rounded-lg text-white uppercase focus:outline-none focus:border-green-500/50"
                      placeholder="ETH"
                    />
                  </div>
                  <div className="col-span-4">
                    <label className="block text-xs text-dark-400 mb-1">Holdings</label>
                    <input
                      type="number"
                      step="any"
                      value={newHolding.holdings}
                      onChange={(e) => setNewHolding(prev => ({ ...prev, holdings: e.target.value }))}
                      className="w-full px-3 py-2 bg-dark-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-green-500/50"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="col-span-4">
                    <label className="block text-xs text-dark-400 mb-1">Avg Price</label>
                    <input
                      type="number"
                      step="any"
                      value={newHolding.averageBuyPrice}
                      onChange={(e) => setNewHolding(prev => ({ ...prev, averageBuyPrice: e.target.value }))}
                      className="w-full px-3 py-2 bg-dark-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-green-500/50"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="col-span-1 flex gap-2">
                    <button
                      type="button"
                      onClick={handleAddNew}
                      className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                      title="Add"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddNew(false)
                    setNewHolding({ symbol: '', holdings: '', averageBuyPrice: '' })
                    setError('')
                  }}
                  className="mt-3 text-sm text-dark-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Warning */}
          <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
            <p className="text-orange-400 text-sm flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>
                <strong>Warning:</strong> Manually editing portfolio holdings will directly affect the user's balance. 
                This will not create transaction records. Use this feature carefully for adjustments or corrections only.
              </span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-white/10">
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
                'Save Portfolio Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

