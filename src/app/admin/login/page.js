'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/lib/adminContext'

export default function AdminLoginPage() {
  const router = useRouter()
  const { login, isAuthenticated } = useAdmin()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/admin')
    }
  }, [isAuthenticated, router])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(formData.email, formData.password, formData.remember)
      
      if (result.success) {
        router.push('/admin')
      } else {
        setError(result.error || 'Invalid credentials')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="orb orb-cyan w-96 h-96 -top-48 -right-48" />
      <div className="orb orb-emerald w-96 h-96 -bottom-48 -left-48" />

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="glass-card p-8 sm:p-10">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-heading font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-dark-400">Sign in to manage your platform</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-red-500/50 transition-colors"
                placeholder="admin@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-red-500/50 transition-colors"
                placeholder="Enter your password"
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="w-4 h-4 rounded border-white/10 bg-dark-800 text-red-500 focus:ring-red-500 focus:ring-offset-0"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-dark-300">
                Remember me for 24 hours
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-red-500 to-orange-500 text-white hover:opacity-90 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Back to Website */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-dark-400 hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Website
            </a>
          </div>
        </div>

        {/* Warning Notice */}
        <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
          <p className="text-orange-400 text-xs text-center flex items-center justify-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Restricted area - Authorized personnel only
          </p>
        </div>
      </div>
    </div>
  )
}

