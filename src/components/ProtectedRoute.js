'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/authContext'

export default function ProtectedRoute({ children }) {
  const { user, loading, isAuthenticated, login } = useAuth()
  const router = useRouter()

  // Check for admin login-as-user token on mount
  useEffect(() => {
    const checkAdminLoginToken = () => {
      const adminToken = localStorage.getItem('__admin_login_as_user_token__')
      const adminEmail = localStorage.getItem('__admin_login_as_user_email__')
      
      if (adminToken && adminEmail) {
        console.log('Found admin login-as-user token, logging in...', adminEmail)
        
        try {
          // Decode the token to get user info
          const tokenParts = adminToken.split('.')
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]))
            const userData = {
              _id: payload.userId,
              email: payload.email,
              role: payload.role,
            }
            
            console.log('Decoded user data:', userData)
            
            // Login with the admin-provided token (use sessionStorage)
            login(userData, adminToken, false)
            
            // Clear the temporary token immediately
            localStorage.removeItem('__admin_login_as_user_token__')
            localStorage.removeItem('__admin_login_as_user_email__')
            
            console.log('Successfully logged in as user via admin, reloading...')
            
            // Reload to ensure everything is in sync
            setTimeout(() => {
              window.location.reload()
            }, 100)
          }
        } catch (err) {
          console.error('Error processing admin login token:', err)
          // Clean up on error
          localStorage.removeItem('__admin_login_as_user_token__')
          localStorage.removeItem('__admin_login_as_user_email__')
        }
      }
    }
    
    // Check immediately on mount
    checkAdminLoginToken()
  }, [login])

  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      router.push('/login')
    }
  }, [loading, user, router, isAuthenticated])

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] to-[#1a1f2e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-dark-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render children if not authenticated
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] to-[#1a1f2e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-dark-400 text-sm">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return children
}

