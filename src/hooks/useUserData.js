'use client'

import { useState, useEffect, useCallback } from 'react'
import { portfolioAPI, transactionsAPI, walletsAPI, notificationsAPI, userAPI } from '@/lib/api'
import { useAuth } from '@/lib/authContext'

/**
 * IMPORTANT: When using object parameters in hooks, stabilize them to prevent infinite loops.
 * Object references change on every render even if content is the same.
 * Solution: Stringify object dependencies or use useMemo in the calling component.
 */

/**
 * Hook to fetch and manage user portfolio
 */
export function usePortfolio() {
  const [portfolio, setPortfolio] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token } = useAuth()

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    let isMounted = true

    const fetchPortfolio = async () => {
      try {
        setLoading(true)
        const data = await portfolioAPI.get()
        if (isMounted) {
          setPortfolio(data.portfolio || [])
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message)
          console.error('Error fetching portfolio:', err)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchPortfolio()

    return () => {
      isMounted = false
    }
  }, [token])

  const refetch = useCallback(async () => {
    if (!token) return
    
    try {
      const data = await portfolioAPI.get()
      setPortfolio(data.portfolio || [])
      setError(null)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [token])

  const updateHolding = useCallback(async (symbol, holdings, averageBuyPrice) => {
    try {
      const data = await portfolioAPI.update(symbol, holdings, averageBuyPrice)
      await refetch()
      return data.holding
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [refetch])

  const addToHolding = useCallback(async (symbol, amount, price) => {
    try {
      const data = await portfolioAPI.add(symbol, amount, price)
      await refetch()
      return data.holding
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [refetch])

  const subtractFromHolding = useCallback(async (symbol, amount) => {
    try {
      const data = await portfolioAPI.subtract(symbol, amount)
      await refetch()
      return data.holding
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [refetch])

  return {
    portfolio,
    loading,
    error,
    refetch,
    updateHolding,
    addToHolding,
    subtractFromHolding,
  }
}

/**
 * Hook to fetch and manage user transactions
 */
export function useTransactions(filters = {}) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token } = useAuth()

  // Stabilize filters object to prevent infinite loops
  const filtersString = JSON.stringify(filters)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    let isMounted = true

    const fetchTransactions = async () => {
      try {
        setLoading(true)
        const parsedFilters = JSON.parse(filtersString)
        const data = await transactionsAPI.getAll(parsedFilters)
        if (isMounted) {
          setTransactions(data.transactions || [])
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message)
          console.error('Error fetching transactions:', err)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchTransactions()

    return () => {
      isMounted = false
    }
  }, [token, filtersString])

  const refetch = useCallback(async () => {
    if (!token) return
    
    try {
      const parsedFilters = JSON.parse(filtersString)
      const data = await transactionsAPI.getAll(parsedFilters)
      setTransactions(data.transactions || [])
      setError(null)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [token, filtersString])

  const createTransaction = useCallback(async (transactionData) => {
    try {
      const data = await transactionsAPI.create(transactionData)
      await refetch()
      return data.transaction
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [refetch])

  return {
    transactions,
    loading,
    error,
    refetch,
    createTransaction,
  }
}

/**
 * Hook to fetch user wallets
 */
export function useWallets(symbol = null) {
  const [wallets, setWallets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token } = useAuth()

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    let isMounted = true

    const fetchWallets = async () => {
      try {
        setLoading(true)
        const data = symbol 
          ? await walletsAPI.getBySymbol(symbol)
          : await walletsAPI.getAll()
        if (isMounted) {
          setWallets(data.wallets || [])
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message)
          console.error('Error fetching wallets:', err)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchWallets()

    return () => {
      isMounted = false
    }
  }, [token, symbol])

  const refetch = useCallback(async () => {
    if (!token) return
    
    try {
      const data = symbol 
        ? await walletsAPI.getBySymbol(symbol)
        : await walletsAPI.getAll()
      setWallets(data.wallets || [])
      setError(null)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [token, symbol])

  const createOrUpdateWallet = useCallback(async (sym, address, label) => {
    try {
      const data = await walletsAPI.createOrUpdate(sym, address, label)
      await refetch()
      return data.wallet
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [refetch])

  return {
    wallets,
    wallet: wallets[0] || null,
    loading,
    error,
    refetch,
    createOrUpdateWallet,
  }
}

/**
 * Hook to fetch and manage notifications
 */
export function useNotifications(limit = 50) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token } = useAuth()

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    let isMounted = true

    const fetchNotifications = async () => {
      try {
        setLoading(true)
        const data = await notificationsAPI.getAll(limit)
        if (isMounted) {
          setNotifications(data.notifications || [])
          setUnreadCount(data.unreadCount || 0)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message)
          console.error('Error fetching notifications:', err)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchNotifications()

    return () => {
      isMounted = false
    }
  }, [token, limit])

  const refetch = useCallback(async () => {
    if (!token) return
    
    try {
      const data = await notificationsAPI.getAll(limit)
      setNotifications(data.notifications || [])
      setUnreadCount(data.unreadCount || 0)
      setError(null)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [token, limit])

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId)
      await refetch()
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [refetch])

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsAPI.markAllAsRead()
      await refetch()
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [refetch])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refetch,
    markAsRead,
    markAllAsRead,
  }
}

/**
 * Hook to fetch and update user profile
 */
export function useUserProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token } = useAuth()

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    let isMounted = true

    const fetchProfile = async () => {
      try {
        setLoading(true)
        const data = await userAPI.getProfile()
        if (isMounted) {
          setProfile(data.user)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message)
          console.error('Error fetching profile:', err)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchProfile()

    return () => {
      isMounted = false
    }
  }, [token])

  const refetch = useCallback(async () => {
    if (!token) return
    
    try {
      const data = await userAPI.getProfile()
      setProfile(data.user)
      setError(null)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [token])

  const updateProfile = useCallback(async (profileData) => {
    try {
      const data = await userAPI.updateProfile(profileData)
      setProfile(data.user)
      return data.user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  return {
    profile,
    loading,
    error,
    refetch,
    updateProfile,
  }
}

