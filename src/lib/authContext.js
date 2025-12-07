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
      // Check localStorage first, then sessionStorage
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

