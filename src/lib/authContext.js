'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing auth on mount
    checkAuth()
  }, [])

  const checkAuth = () => {
    try {
      // First, check if there's an admin login-as-user token
      const adminToken = localStorage.getItem('__admin_login_as_user_token__')
      const adminEmail = localStorage.getItem('__admin_login_as_user_email__')
      
      if (adminToken && adminEmail) {
        console.log('Found admin login token in checkAuth, processing...', adminEmail)
        
        try {
          // Decode the token
          const tokenParts = adminToken.split('.')
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]))
            const userData = {
              _id: payload.userId,
              email: payload.email,
              role: payload.role,
            }
            
            // Store in sessionStorage (not localStorage)
            sessionStorage.setItem('authToken', adminToken)
            sessionStorage.setItem('user', JSON.stringify(userData))
            
            setToken(adminToken)
            setUser(userData)
            
            // Clear the temporary admin token
            localStorage.removeItem('__admin_login_as_user_token__')
            localStorage.removeItem('__admin_login_as_user_email__')
            
            console.log('Admin login-as-user successful')
            setLoading(false)
            return
          }
        } catch (err) {
          console.error('Error processing admin token:', err)
          localStorage.removeItem('__admin_login_as_user_token__')
          localStorage.removeItem('__admin_login_as_user_email__')
        }
      }
      
      // Normal auth check - Check localStorage first, then sessionStorage
      let storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      let storedUser = localStorage.getItem('user') || sessionStorage.getItem('user')

      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error('Auth check error:', error)
      // Clear invalid data
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = (userData, authToken, remember = false) => {
    setUser(userData)
    setToken(authToken)
    
    if (remember) {
      localStorage.setItem('authToken', authToken)
      localStorage.setItem('user', JSON.stringify(userData))
    } else {
      sessionStorage.setItem('authToken', authToken)
      sessionStorage.setItem('user', JSON.stringify(userData))
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('user')
    router.push('/login')
  }

  const isAuthenticated = useCallback(() => {
    return !!token && !!user
  }, [token, user])

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout,
      isAuthenticated,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

