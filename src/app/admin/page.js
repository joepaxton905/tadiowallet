'use client'

import { useState, useEffect } from 'react'
import { adminStatsAPI } from '@/lib/adminApi'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Fetch stats immediately on mount
    fetchStats()

    // Set up periodic refresh every 30 seconds for real-time accuracy
    const interval = setInterval(fetchStats, 30000)

    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const result = await adminStatsAPI.getStats()
      if (result.success) {
        setStats(result.stats)
      } else {
        setError('Failed to load statistics')
      }
    } catch (err) {
      setError(err.message || 'Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-dark-800 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-dark-800 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Error Loading Data</h3>
        <p className="text-dark-400 mb-6">{error}</p>
        <button
          onClick={fetchStats}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Dashboard</h1>
        <p className="text-dark-400">System overview and statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <Link href="/admin/users" className="glass-card p-6 hover:bg-white/10 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-green-400 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +{stats?.users?.recentSignups || 0}
            </span>
          </div>
          <h3 className="text-dark-400 text-sm mb-1">Total Users</h3>
          <p className="text-3xl font-bold text-white">{stats?.users?.total.toLocaleString() || 0}</p>
          <p className="text-xs text-dark-500 mt-2">
            {stats?.users?.active || 0} active • {stats?.users?.suspended || 0} suspended
          </p>
        </Link>

        {/* Total Transactions */}
        <Link href="/admin/transactions" className="glass-card p-6 hover:bg-white/10 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-xs font-medium text-green-400 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              {stats?.transactions?.recent24h || 0} today
            </span>
          </div>
          <h3 className="text-dark-400 text-sm mb-1">Total Transactions</h3>
          <p className="text-3xl font-bold text-white">{stats?.transactions?.total.toLocaleString() || 0}</p>
          <p className="text-xs text-dark-500 mt-2">
            {stats?.transactions?.completed || 0} completed • {stats?.transactions?.pending || 0} pending
          </p>
        </Link>

        {/* Transaction Volume */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-dark-500">30 days</span>
          </div>
          <h3 className="text-dark-400 text-sm mb-1">Transaction Volume</h3>
          <p className="text-3xl font-bold text-white">
            ${(stats?.transactions?.volume30d?.totalVolume || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-dark-500 mt-2">
            Fees: ${(stats?.transactions?.volume30d?.totalFees || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Active Assets */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-dark-400 text-sm mb-1">Portfolio Holdings</h3>
          <p className="text-3xl font-bold text-white">
            {(stats?.portfolio?.totalHoldings || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-dark-500 mt-2">
            {stats?.portfolio?.topAssets?.length || 0} unique assets
          </p>
        </div>
      </div>

      {/* Transaction Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Breakdown */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Transaction Types</h3>
          <div className="space-y-3">
            {stats?.transactions?.byType?.map((type) => {
              const total = stats.transactions.total
              const percentage = ((type.count / total) * 100).toFixed(1)
              
              const typeColors = {
                buy: 'bg-green-500',
                sell: 'bg-red-500',
                send: 'bg-blue-500',
                receive: 'bg-purple-500',
                swap: 'bg-orange-500',
                stake: 'bg-cyan-500',
                unstake: 'bg-pink-500',
              }

              return (
                <div key={type._id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-dark-300 capitalize">{type._id}</span>
                    <span className="text-sm text-white font-medium">{type.count} ({percentage}%)</span>
                  </div>
                  <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${typeColors[type._id] || 'bg-gray-500'} transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Assets */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Assets by Transactions</h3>
          <div className="space-y-3">
            {stats?.portfolio?.topAssets?.slice(0, 5).map((asset, index) => (
              <div key={asset._id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{asset._id}</p>
                  <p className="text-xs text-dark-400">{asset.count} transactions</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{asset.totalAmount.toFixed(2)}</p>
                  <p className="text-xs text-dark-400">Total</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Quick Stats</h3>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-white/5 text-dark-300 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-dark-400 text-sm mb-1">New Users (7d)</p>
            <p className="text-2xl font-bold text-white">{stats?.users?.recentSignups || 0}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-dark-400 text-sm mb-1">Active Users</p>
            <p className="text-2xl font-bold text-white">{stats?.users?.active || 0}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-dark-400 text-sm mb-1">Recent Txns (24h)</p>
            <p className="text-2xl font-bold text-white">{stats?.transactions?.recent24h || 0}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-dark-400 text-sm mb-1">Pending Txns</p>
            <p className="text-2xl font-bold text-white">{stats?.transactions?.pending || 0}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

