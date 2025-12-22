'use client'

import { useState, useEffect } from 'react'
import { adminTransactionsAPI } from '@/lib/adminApi'

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, pages: 0 })
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    asset: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  useEffect(() => {
    fetchTransactions()
  }, [pagination.page, filters])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const result = await adminTransactionsAPI.getAll({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      })
      
      if (result.success) {
        setTransactions(result.transactions)
        setPagination(result.pagination)
      } else {
        setError('Failed to load transactions')
      }
    } catch (err) {
      setError(err.message || 'Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  const getTypeBadge = (type) => {
    const styles = {
      buy: 'bg-green-500/20 text-green-400 border-green-500/30',
      sell: 'bg-red-500/20 text-red-400 border-red-500/30',
      send: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      receive: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      swap: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      stake: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      unstake: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-lg border ${styles[type] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
        {type}
      </span>
    )
  }

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-500/20 text-green-400',
      pending: 'bg-yellow-500/20 text-yellow-400',
      failed: 'bg-red-500/20 text-red-400',
      cancelled: 'bg-gray-500/20 text-gray-400',
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-lg ${styles[status] || styles.completed}`}>
        {status}
      </span>
    )
  }

  if (loading && transactions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-dark-800 rounded w-1/3" />
          <div className="h-96 bg-dark-800 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Transactions</h1>
          <p className="text-dark-400">{pagination.total} total transactions</p>
        </div>
        <button
          onClick={fetchTransactions}
          className="px-4 py-2 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Type */}
          <div>
            <label className="block text-sm text-dark-400 mb-2">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-4 py-2 bg-dark-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500/50"
            >
              <option value="">All Types</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
              <option value="send">Send</option>
              <option value="receive">Receive</option>
              <option value="swap">Swap</option>
              <option value="stake">Stake</option>
              <option value="unstake">Unstake</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm text-dark-400 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-2 bg-dark-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500/50"
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Asset */}
          <div>
            <label className="block text-sm text-dark-400 mb-2">Asset</label>
            <input
              type="text"
              value={filters.asset}
              onChange={(e) => setFilters(prev => ({ ...prev, asset: e.target.value.toUpperCase() }))}
              placeholder="BTC, ETH..."
              className="w-full px-4 py-2 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/50"
            />
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm text-dark-400 mb-2">Sort By</label>
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-')
                setFilters(prev => ({ ...prev, sortBy, sortOrder }))
              }}
              className="w-full px-4 py-2 bg-dark-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500/50"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="value-desc">Highest Value</option>
              <option value="value-asc">Lowest Value</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark-300">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark-300">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark-300">Asset</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-dark-300">Amount</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-dark-300">Value</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-dark-300">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-medium">
                        {tx.userId?.firstName} {tx.userId?.lastName}
                      </p>
                      <p className="text-sm text-dark-400">{tx.userId?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getTypeBadge(tx.type)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg" style={{ color: tx.assetColor }}>
                        {tx.assetIcon}
                      </span>
                      <div>
                        <p className="text-white font-medium">{tx.asset}</p>
                        <p className="text-sm text-dark-400">{tx.assetName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-white font-medium">{tx.amount}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-white font-medium">
                      ${tx.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    {tx.fee > 0 && (
                      <div className="text-sm text-dark-400">
                        Fee: ${tx.fee.toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(tx.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white text-sm">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-dark-400">
                      {new Date(tx.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
            <div className="text-sm text-dark-400">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-white/5 text-white rounded-lg font-medium hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-white px-4">{pagination.page} of {pagination.pages}</span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 bg-white/5 text-white rounded-lg font-medium hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

