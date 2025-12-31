'use client'

import { useState, useEffect } from 'react'
import { adminUsersAPI } from '@/lib/adminApi'
import Link from 'next/link'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 })
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [pagination.page, filters])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const result = await adminUsersAPI.getAll({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      })
      
      if (result.success) {
        setUsers(result.users)
        setPagination(result.pagination)
      } else {
        setError('Failed to load users')
      }
    } catch (err) {
      setError(err.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (userId, action) => {
    if (!confirm(`Are you sure you want to ${action} this user?`)) return

    try {
      setActionLoading(userId)
      await adminUsersAPI.update(userId, { action })
      await fetchUsers()
    } catch (err) {
      alert(err.message || `Failed to ${action} user`)
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      suspended: 'bg-red-500/20 text-red-400 border-red-500/30',
      deleted: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-lg border ${styles[status] || styles.active}`}>
        {status}
      </span>
    )
  }

  if (loading && users.length === 0) {
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-2">User Management</h1>
          <p className="text-dark-400">{pagination.total} total users</p>
        </div>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm text-dark-400 mb-2">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Name or email..."
              className="w-full px-4 py-2 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/50"
            />
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
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="deleted">Deleted</option>
            </select>
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
              <option value="email-asc">Email A-Z</option>
              <option value="email-desc">Email Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-dark-300">User</th>
                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-dark-300">Status</th>
                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-dark-300">Portfolio</th>
                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-dark-300">Transactions</th>
                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-dark-300">Joined</th>
                <th className="px-4 sm:px-6 py-4 text-right text-sm font-semibold text-dark-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-dark-400 truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-white">{user.portfolioAssets} assets</div>
                    <div className="text-sm text-dark-400">
                      ${user.totalTransactionValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-white">{user.totalTransactions}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-dark-300 text-sm whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-end gap-2 flex-shrink-0">
                      <Link
                        href={`/admin/users/${user._id}`}
                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                      {user.status === 'active' ? (
                        <button
                          onClick={() => handleAction(user._id, 'suspend')}
                          disabled={actionLoading === user._id}
                          className="p-2 text-orange-400 hover:bg-orange-500/10 rounded-lg transition-colors disabled:opacity-50"
                          title="Suspend User"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAction(user._id, 'activate')}
                          disabled={actionLoading === user._id}
                          className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors disabled:opacity-50"
                          title="Activate User"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-4 border-t border-white/10">
            <div className="text-sm text-dark-400 text-center sm:text-left">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 sm:px-4 py-2 bg-white/5 text-white rounded-lg font-medium hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Previous
              </button>
              <span className="text-white px-2 sm:px-4 text-sm">{pagination.page} of {pagination.pages}</span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="px-3 sm:px-4 py-2 bg-white/5 text-white rounded-lg font-medium hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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

