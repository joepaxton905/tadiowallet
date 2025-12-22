'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { adminAuthAPI } from '@/lib/adminApi'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const storedToken = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')

      if (storedToken) {
        setToken(storedToken)
        
        // Verify token with server
        try {
          const result = await adminAuthAPI.verify()
          if (result.success) {
            setAdmin(result.admin)
          } else {
            logout()
          }
        } catch (error) {
          console.error('Token verification failed:', error)
          logout()
        }
      }
    } catch (error) {
      console.error('Auth check error:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password, remember = false) => {
    try {
      const result = await adminAuthAPI.login(email, password)
      
      if (!result.success) {
        throw new Error(result.error || 'Login failed')
      }

      setAdmin(result.admin)
      setToken(result.token)
      
      if (remember) {
        localStorage.setItem('adminToken', result.token)
      } else {
        sessionStorage.setItem('adminToken', result.token)
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setAdmin(null)
    setToken(null)
    localStorage.removeItem('adminToken')
    sessionStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  const isAuthenticated = useCallback(() => {
    return !!token && !!admin
  }, [token, admin])

  return (
    <AdminContext.Provider value={{
      admin,
      token,
      loading,
      login,
      logout,
      isAuthenticated,
      checkAuth
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

