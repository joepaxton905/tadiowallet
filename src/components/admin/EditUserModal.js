'use client'

import { useState, useEffect } from 'react'

export default function EditUserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    status: '',
    kycStatus: '',
    role: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        status: user.status || '',
        kycStatus: user.kycStatus || '',
        role: user.role || '',
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      await onSave(formData)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to update user')
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
          <h3 className="text-2xl font-bold text-white">Edit User Profile</h3>
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

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/50 transition-colors"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Account Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500/50 transition-colors"
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>

          {/* KYC Status */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              KYC Status
            </label>
            <select
              name="kycStatus"
              value={formData.kycStatus}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500/50 transition-colors"
            >
              <option value="none">None</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              User Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500/50 transition-colors"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Warning */}
          <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
            <p className="text-orange-400 text-sm flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>
                Changes to user profile will be saved immediately. The user will receive a notification about this update.
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
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

