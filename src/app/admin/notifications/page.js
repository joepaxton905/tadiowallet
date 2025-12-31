'use client'

import { useState, useEffect } from 'react'
import { adminAPI } from '@/lib/adminApi'
import { format } from 'date-fns'

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [statistics, setStatistics] = useState({})
  const [pagination, setPagination] = useState({})
  const [error, setError] = useState(null)
  const [showBroadcastModal, setShowBroadcastModal] = useState(false)
  const [broadcasting, setBroadcasting] = useState(false)

  const [filters, setFilters] = useState({
    page: 1,
    limit: 50,
    type: '',
    read: ''
  })

  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    message: '',
    type: 'info'
  })

  useEffect(() => {
    fetchNotifications()
  }, [filters])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '') params.append(key, value)
      })
      
      const data = await adminAPI.getNotifications(params.toString())
      setNotifications(data.data.notifications)
      setStatistics(data.data.statistics)
      setPagination(data.data.pagination)
    } catch (err) {
      console.error('Error fetching notifications:', err)
      setError(err.message || 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const handleBroadcast = async (e) => {
    e.preventDefault()
    
    if (!broadcastForm.title || !broadcastForm.message) {
      alert('Please fill in all fields')
      return
    }

    try {
      setBroadcasting(true)
      await adminAPI.createBroadcastNotification(broadcastForm)
      setShowBroadcastModal(false)
      setBroadcastForm({ title: '', message: '', type: 'info' })
      fetchNotifications()
      alert('Broadcast notification sent successfully!')
    } catch (err) {
      console.error('Error broadcasting:', err)
      alert('Failed to send broadcast: ' + err.message)
    } finally {
      setBroadcasting(false)
    }
  }

  const handleDeleteRead = async () => {
    if (!confirm('Are you sure you want to delete all read notifications?')) return
    
    try {
      await adminAPI.deleteNotifications('deleteRead=true')
      fetchNotifications()
      alert('Read notifications deleted successfully!')
    } catch (err) {
      console.error('Error deleting:', err)
      alert('Failed to delete notifications: ' + err.message)
    }
  }

  const getTypeColor = (type) => {
    const colors = {
      info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      success: 'bg-green-500/20 text-green-400 border-green-500/30',
      warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      error: 'bg-red-500/20 text-red-400 border-red-500/30',
      transaction: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    }
    return colors[type] || colors.info
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-white">Notifications Management</h1>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteRead}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Read
            </button>
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              Broadcast
            </button>
            <button
              onClick={fetchNotifications}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
        <p className="text-dark-400">Manage user notifications and send broadcasts</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-dark-400 text-sm">Total Notifications</span>
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{pagination.total?.toLocaleString() || 0}</p>
          <p className="text-xs text-blue-400">All notifications</p>
        </div>

        <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-dark-400 text-sm">Unread</span>
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{statistics.totalUnread?.toLocaleString() || 0}</p>
          <p className="text-xs text-red-400">Pending read</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-dark-400 text-sm">Notification Types</span>
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{statistics.stats?.length || 0}</p>
          <p className="text-xs text-purple-400">Distinct types</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-dark-400 text-sm">Read Rate</span>
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {pagination.total && statistics.totalUnread 
              ? Math.round(((pagination.total - statistics.totalUnread) / pagination.total) * 100)
              : 0}%
          </p>
          <p className="text-xs text-green-400">Notifications read</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-dark-900 border border-white/10 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-400 mb-2">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
              className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500"
            >
              <option value="">All Types</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="transaction">Transaction</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-400 mb-2">Status</label>
            <select
              value={filters.read}
              onChange={(e) => setFilters({ ...filters, read: e.target.value, page: 1 })}
              className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500"
            >
              <option value="">All Status</option>
              <option value="false">Unread</option>
              <option value="true">Read</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-400 mb-2">Per Page</label>
            <select
              value={filters.limit}
              onChange={(e) => setFilters({ ...filters, limit: parseInt(e.target.value), page: 1 })}
              className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="bg-dark-900 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr className="text-left text-sm text-dark-400">
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Message</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="px-6 py-4" colSpan={6}>
                      <div className="h-4 bg-dark-800 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : notifications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-dark-400">
                    No notifications found
                  </td>
                </tr>
              ) : (
                notifications.map((notification) => (
                  <tr key={notification._id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">
                          {notification.userId?.firstName} {notification.userId?.lastName}
                        </p>
                        <p className="text-xs text-dark-400">{notification.userId?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getTypeColor(notification.type)}`}>
                        {notification.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      {notification.title}
                    </td>
                    <td className="px-6 py-4 text-dark-300 text-sm max-w-md truncate">
                      {notification.message}
                    </td>
                    <td className="px-6 py-4">
                      {notification.read ? (
                        <span className="inline-flex items-center text-green-400 text-sm">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Read
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-yellow-400 text-sm">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Unread
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-dark-300 text-sm whitespace-nowrap">
                      {format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && notifications.length > 0 && (
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-sm text-dark-400">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} notifications
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

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dark-900 border border-white/10 rounded-2xl max-w-2xl w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Broadcast Notification</h3>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="p-2 text-dark-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Title *</label>
                <input
                  type="text"
                  value={broadcastForm.title}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500"
                  placeholder="Notification title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Message *</label>
                <textarea
                  value={broadcastForm.message}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500"
                  placeholder="Notification message"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Type</label>
                <select
                  value={broadcastForm.type}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, type: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-yellow-400 font-medium text-sm">Warning</p>
                    <p className="text-yellow-300 text-xs mt-1">This will send a notification to all active users on the platform.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-6 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={broadcasting}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {broadcasting ? 'Sending...' : 'Send Broadcast'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

