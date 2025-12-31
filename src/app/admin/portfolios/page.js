'use client'

import { useState, useEffect } from 'react'
import { adminAPI } from '@/lib/adminApi'
import Link from 'next/link'

export default function PortfoliosPage() {
  const [loading, setLoading] = useState(true)
  const [portfolios, setPortfolios] = useState([])
  const [assetSummary, setAssetSummary] = useState([])
  const [topHolders, setTopHolders] = useState([])
  const [platformTotals, setPlatformTotals] = useState({})
  const [pagination, setPagination] = useState({})
  const [error, setError] = useState(null)

  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    asset: '',
    sortBy: 'value',
    order: 'desc'
  })

  useEffect(() => {
    fetchPortfolios()
  }, [filters])

  const fetchPortfolios = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      
      const data = await adminAPI.getPortfolios(params.toString())
      setPortfolios(data.data.portfolios)
      setAssetSummary(data.data.assetSummary)
      setTopHolders(data.data.topHolders)
      setPlatformTotals(data.data.platformTotals)
      setPagination(data.data.pagination)
    } catch (err) {
      console.error('Error fetching portfolios:', err)
      setError(err.message || 'Failed to load portfolios')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) => `$${value?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`
  const formatNumber = (value) => value?.toLocaleString('en-US') || '0'

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-white">Portfolios & Wallets</h1>
          <button
            onClick={fetchPortfolios}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
        <p className="text-dark-400">Overview of all user holdings and wallets</p>
      </div>

      {/* Platform Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-dark-400 text-sm">Total Platform Value</span>
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{formatCurrency(platformTotals.totalValue)}</p>
          <p className="text-xs text-green-400">Across all portfolios</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-dark-400 text-sm">Total Holders</span>
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{formatNumber(platformTotals.totalHolders)}</p>
          <p className="text-xs text-blue-400">Unique users with holdings</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-dark-400 text-sm">Total Assets</span>
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{formatNumber(platformTotals.totalAssets)}</p>
          <p className="text-xs text-purple-400">Different cryptocurrencies</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Asset Summary */}
        <div className="lg:col-span-2 bg-dark-900 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Asset Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-dark-400 border-b border-white/5">
                  <th className="pb-3 font-medium">Asset</th>
                  <th className="pb-3 font-medium text-right">Total Amount</th>
                  <th className="pb-3 font-medium text-right">Total Value</th>
                  <th className="pb-3 font-medium text-right">Holders</th>
                </tr>
              </thead>
              <tbody>
                {assetSummary.map((asset, index) => (
                  <tr key={index} className="border-b border-white/5 last:border-0">
                    <td className="py-3">
                      <span className="text-white font-medium">{asset._id}</span>
                    </td>
                    <td className="py-3 text-right text-dark-300">
                      {asset.totalAmount.toLocaleString('en-US', { maximumFractionDigits: 8 })}
                    </td>
                    <td className="py-3 text-right text-white font-medium">
                      {formatCurrency(asset.totalValue)}
                    </td>
                    <td className="py-3 text-right text-dark-300">
                      {formatNumber(asset.holders)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Holders */}
        <div className="bg-dark-900 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Holders</h3>
          <div className="space-y-3">
            {topHolders.map((holder, index) => (
              <Link
                key={holder._id}
                href={`/admin/users/${holder._id}`}
                className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                  #{index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {holder.user.firstName} {holder.user.lastName}
                  </p>
                  <p className="text-xs text-dark-400">{holder.assetCount} assets</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-400">
                    {formatCurrency(holder.totalValue)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-dark-900 border border-white/10 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-400 mb-2">Filter by Asset</label>
            <select
              value={filters.asset}
              onChange={(e) => setFilters({ ...filters, asset: e.target.value, page: 1 })}
              className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500"
            >
              <option value="">All Assets</option>
              {assetSummary.map((asset) => (
                <option key={asset._id} value={asset._id}>{asset._id}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-400 mb-2">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500"
            >
              <option value="value">Value</option>
              <option value="amount">Amount</option>
              <option value="symbol">Asset</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-400 mb-2">Order</label>
            <select
              value={filters.order}
              onChange={(e) => setFilters({ ...filters, order: e.target.value })}
              className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-400 mb-2">Per Page</label>
            <select
              value={filters.limit}
              onChange={(e) => setFilters({ ...filters, limit: parseInt(e.target.value), page: 1 })}
              className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Portfolios Table */}
      <div className="bg-dark-900 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr className="text-left text-sm text-dark-400">
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Asset</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
                <th className="px-6 py-4 font-medium text-right">Value</th>
                <th className="px-6 py-4 font-medium text-right">Price</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="px-6 py-4" colSpan={6}>
                      <div className="h-4 bg-dark-800 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : portfolios.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-dark-400">
                    No portfolio holdings found
                  </td>
                </tr>
              ) : (
                portfolios.map((portfolio) => (
                  <tr key={portfolio._id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">
                          {portfolio.userId?.firstName} {portfolio.userId?.lastName}
                        </p>
                        <p className="text-xs text-dark-400">{portfolio.userId?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-400">
                        {portfolio.symbol}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-white font-mono">
                      {portfolio.amount.toLocaleString('en-US', { maximumFractionDigits: 8 })}
                    </td>
                    <td className="px-6 py-4 text-right text-white font-semibold">
                      {formatCurrency(portfolio.value)}
                    </td>
                    <td className="px-6 py-4 text-right text-dark-300 font-mono text-sm">
                      {formatCurrency(portfolio.currentPrice)}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/users/${portfolio.userId?._id}`}
                        className="text-red-400 hover:text-red-300 text-sm font-medium"
                      >
                        View User
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && portfolios.length > 0 && (
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-sm text-dark-400">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                disabled={filters.page === 1}
                className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                disabled={filters.page >= pagination.pages}
                className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

