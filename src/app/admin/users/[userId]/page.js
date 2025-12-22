'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { adminUsersAPI, adminUserStatsAPI } from '@/lib/adminApi'
import Link from 'next/link'
import EditUserModal from '@/components/admin/EditUserModal'
import EditPortfolioModal from '@/components/admin/EditPortfolioModal'
import EditStatsModal from '@/components/admin/EditStatsModal'

export default function AdminUserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showEditPortfolio, setShowEditPortfolio] = useState(false)
  const [showEditStats, setShowEditStats] = useState(false)
  const [recalculating, setRecalculating] = useState(false)

  useEffect(() => {
    if (params.userId) {
      fetchUser()
    }
  }, [params.userId])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const result = await adminUsersAPI.getById(params.userId)
      if (result.success) {
        setUser(result.user)
      } else {
        setError('Failed to load user details')
      }
    } catch (err) {
      setError(err.message || 'Failed to load user details')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (action) => {
    const confirmMessage = action === 'delete' 
      ? 'This will permanently delete the user and all their data. This action cannot be undone!'
      : `Are you sure you want to ${action} this user?`
    
    if (!confirm(confirmMessage)) return

    try {
      setActionLoading(true)
      if (action === 'delete') {
        await adminUsersAPI.delete(params.userId)
        alert('User deleted successfully')
        router.push('/admin/users')
      } else {
        await adminUsersAPI.update(params.userId, { action })
        await fetchUser()
      }
    } catch (err) {
      alert(err.message || `Failed to ${action} user`)
    } finally {
      setActionLoading(false)
    }
  }

  const handleSaveProfile = async (profileData) => {
    try {
      await adminUsersAPI.updateProfile(params.userId, profileData)
      await fetchUser()
    } catch (err) {
      throw err
    }
  }

  const handleSavePortfolio = async (portfolio) => {
    try {
      const result = await adminUsersAPI.updatePortfolio(params.userId, portfolio)
      if (result.success) {
        // Refresh user data immediately to show updated portfolio and stats
        await fetchUser()
      }
    } catch (err) {
      console.error('Error saving portfolio:', err)
      throw err
    }
  }

  const handleSaveStats = async (stats) => {
    try {
      const result = await adminUsersAPI.updateStats(params.userId, stats)
      if (result.success) {
        // Refresh user data immediately
        await fetchUser()
        // Force recalculate to ensure stats are in sync
        await adminUserStatsAPI.recalculateUserStats(params.userId)
        // Fetch again to get the recalculated stats
        await fetchUser()
      }
    } catch (err) {
      console.error('Error saving stats:', err)
      throw err
    }
  }

  // Get stats from stored database fields or calculate as fallback
  const getStats = () => {
    // Use stored calculated stats if available
    if (user?.calculatedStats) {
      return {
        totalInvested: user.calculatedStats.totalInvested || 0,
        currentValue: user.calculatedStats.portfolioValue || 0,
        pnl: user.calculatedStats.profitLoss || 0,
        pnlPercentage: user.calculatedStats.profitLossPercentage || 0,
        totalTransactions: user.calculatedStats.totalTransactions || 0,
        totalVolume: user.calculatedStats.totalVolume || 0,
        totalFees: user.calculatedStats.totalFees || 0,
        numberOfAssets: user.calculatedStats.numberOfAssets || 0,
        lastCalculated: user.calculatedStats.lastCalculated,
      }
    }

    // Fallback calculation if stats not available
    if (!user?.portfolio || !user?.recentTransactions) {
      return { 
        totalInvested: 0, 
        currentValue: 0, 
        pnl: 0, 
        pnlPercentage: 0,
        totalTransactions: 0,
        totalVolume: 0,
        totalFees: 0,
        numberOfAssets: 0,
        lastCalculated: null,
      }
    }

    const buyTransactions = user.recentTransactions.filter(tx => tx.type === 'buy')
    const totalInvested = buyTransactions.reduce((sum, tx) => sum + tx.value, 0)
    const currentValue = user.portfolio.reduce((sum, holding) => {
      return sum + (holding.holdings * holding.averageBuyPrice)
    }, 0)
    const pnl = currentValue - totalInvested
    const pnlPercentage = totalInvested > 0 ? (pnl / totalInvested) * 100 : 0

    return { 
      totalInvested, 
      currentValue, 
      pnl, 
      pnlPercentage,
      totalTransactions: user.recentTransactions?.length || 0,
      totalVolume: 0,
      totalFees: 0,
      numberOfAssets: user.portfolio?.length || 0,
      lastCalculated: null,
    }
  }

  const handleRecalculateStats = async () => {
    try {
      setRecalculating(true)
      await adminUserStatsAPI.recalculateUserStats(params.userId)
      await fetchUser() // Refresh user data to get updated stats
    } catch (err) {
      alert(err.message || 'Failed to recalculate statistics')
    } finally {
      setRecalculating(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-dark-800 rounded w-1/3" />
          <div className="h-96 bg-dark-800 rounded-xl" />
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Error</h3>
        <p className="text-dark-400 mb-6">{error || 'User not found'}</p>
        <Link
          href="/admin/users"
          className="inline-flex px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          Back to Users
        </Link>
      </div>
    )
  }

  const statsData = getStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/users"
            className="p-2 text-dark-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-3xl font-heading font-bold text-white">User Details</h1>
            <p className="text-dark-400">
              Manage user account and view activity
              {statsData.lastCalculated && (
                <span className="text-dark-500 text-xs ml-2">
                  • Stats updated {new Date(statsData.lastCalculated).toLocaleString()}
                </span>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={handleRecalculateStats}
          disabled={recalculating}
          className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-xl font-medium hover:bg-purple-500/20 transition-colors disabled:opacity-50 flex items-center gap-2"
          title="Recalculate Statistics"
        >
          <svg className={`w-4 h-4 ${recalculating ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {recalculating ? 'Recalculating...' : 'Recalculate Stats'}
        </button>
      </div>

      {/* User Info Card */}
      <div className="glass-card p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-dark-400">{user.email}</p>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-lg ${
                user.status === 'active' ? 'bg-green-500/20 text-green-400' :
                user.status === 'suspended' ? 'bg-red-500/20 text-red-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {user.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-dark-400 text-sm mb-1">Role</p>
                <p className="text-white font-medium capitalize">{user.role}</p>
              </div>
              <div>
                <p className="text-dark-400 text-sm mb-1">KYC Status</p>
                <p className="text-white font-medium capitalize">{user.kycStatus}</p>
              </div>
              <div>
                <p className="text-dark-400 text-sm mb-1">2FA</p>
                <p className="text-white font-medium">{user.twoFactorEnabled ? 'Enabled' : 'Disabled'}</p>
              </div>
              <div>
                <p className="text-dark-400 text-sm mb-1">Joined</p>
                <p className="text-white font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setShowEditProfile(true)}
                className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-xl font-medium hover:bg-blue-500/20 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
              {user.status === 'active' ? (
                <button
                  onClick={() => handleAction('suspend')}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-orange-500/10 text-orange-400 rounded-xl font-medium hover:bg-orange-500/20 transition-colors disabled:opacity-50"
                >
                  Suspend Account
                </button>
              ) : user.status === 'suspended' ? (
                <button
                  onClick={() => handleAction('activate')}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-green-500/10 text-green-400 rounded-xl font-medium hover:bg-green-500/20 transition-colors disabled:opacity-50"
                >
                  Activate Account
                </button>
              ) : null}
              <button
                onClick={() => handleAction('delete')}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-500/10 text-red-400 rounded-xl font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Account Statistics</h2>
          <button
            onClick={() => {
              console.log('Opening Edit Stats modal, user:', user)
              console.log('User calculatedStats:', user?.calculatedStats)
              setShowEditStats(true)
            }}
            className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-xl font-medium hover:bg-purple-500/20 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Stats
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-dark-400 text-sm mb-2">Portfolio Value</h3>
            <p className="text-3xl font-bold text-white">
              ${statsData.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-dark-500 mt-1">{statsData.numberOfAssets} assets</p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-dark-400 text-sm mb-2">Total Invested</h3>
            <p className="text-3xl font-bold text-white">
              ${statsData.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-dark-500 mt-1">From buy transactions</p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-dark-400 text-sm mb-2">Profit/Loss</h3>
            <p className={`text-3xl font-bold ${statsData.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {statsData.pnl >= 0 ? '+' : ''}${statsData.pnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className={`text-xs mt-1 ${statsData.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {statsData.pnl >= 0 ? '+' : ''}{statsData.pnlPercentage.toFixed(2)}%
            </p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-dark-400 text-sm mb-2">Transactions</h3>
            <p className="text-3xl font-bold text-white">{statsData.totalTransactions}</p>
            <p className="text-xs text-dark-500 mt-1">
              Volume: ${statsData.totalVolume.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </div>

      {/* Portfolio */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Portfolio</h3>
          <button
            onClick={() => setShowEditPortfolio(true)}
            className="px-4 py-2 bg-primary-500/10 text-primary-400 rounded-xl font-medium hover:bg-primary-500/20 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Balance
          </button>
        </div>
        {user.portfolio && user.portfolio.length > 0 ? (
          <div className="space-y-3">
            {user.portfolio.map((holding) => (
              <div key={holding._id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="text-white font-medium text-lg">{holding.symbol}</p>
                  <p className="text-sm text-dark-400">Holdings: {holding.holdings.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">
                    ${(holding.holdings * holding.averageBuyPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-dark-400">@ ${holding.averageBuyPrice.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-dark-400">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p>No portfolio holdings</p>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      {user.recentTransactions && user.recentTransactions.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {user.recentTransactions.slice(0, 10).map((tx) => (
              <div key={tx._id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tx.type === 'buy' || tx.type === 'receive' ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    <span className={tx.type === 'buy' || tx.type === 'receive' ? 'text-green-400' : 'text-red-400'}>
                      {tx.assetIcon}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium capitalize">{tx.type} {tx.asset}</p>
                    <p className="text-sm text-dark-400">{new Date(tx.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    tx.type === 'buy' || tx.type === 'receive' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {tx.type === 'buy' || tx.type === 'receive' ? '+' : '-'}{tx.amount} {tx.asset}
                  </p>
                  <p className="text-sm text-dark-400">${tx.value.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wallets */}
      {user.wallets && user.wallets.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Wallets</h3>
          <div className="space-y-3">
            {user.wallets.map((wallet) => (
              <div key={wallet._id} className="p-4 bg-white/5 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-medium">{wallet.symbol}</p>
                  <span className="text-xs text-dark-400">{wallet.network}</span>
                </div>
                <p className="text-sm text-dark-400 font-mono break-all">{wallet.address}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showEditProfile && (
        <EditUserModal
          user={user}
          onClose={() => setShowEditProfile(false)}
          onSave={handleSaveProfile}
        />
      )}

      {showEditPortfolio && (
        <EditPortfolioModal
          user={user}
          onClose={() => setShowEditPortfolio(false)}
          onSave={handleSavePortfolio}
        />
      )}

      {showEditStats && (
        <EditStatsModal
          user={user}
          onClose={() => setShowEditStats(false)}
          onSave={handleSaveStats}
        />
      )}
    </div>
  )
}

