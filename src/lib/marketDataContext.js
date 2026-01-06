'use client'

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { getMarketData } from '@/lib/crypto'
import { useAuth } from '@/lib/authContext'

const MarketDataContext = createContext(null)

export function MarketDataProvider({ children }) {
  const [marketData, setMarketData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token } = useAuth()

  // Default symbols to track
  const defaultSymbols = useMemo(() => 
    ['BTC', 'ETH', 'SOL', 'ADA', 'MATIC', 'AVAX', 'LINK', 'DOT', 'BNB', 'XRP'],
    []
  )

  const fetchData = useCallback(async (symbols = defaultSymbols) => {
    if (!token) return
    
    try {
      const result = await getMarketData(symbols)
      setMarketData(result)
      setError(null)
    } catch (err) {
      console.error('Market data fetch error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [token, defaultSymbols])

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    // Initial fetch
    fetchData()
    
    // Set up 30-second refresh interval
    const interval = setInterval(() => {
      fetchData()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [fetchData, token])

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    marketData,
    loading,
    error,
    refetch: fetchData
  }), [marketData, loading, error, fetchData])

  return (
    <MarketDataContext.Provider value={value}>
      {children}
    </MarketDataContext.Provider>
  )
}

export function useMarketDataContext() {
  const context = useContext(MarketDataContext)
  if (!context) {
    throw new Error('useMarketDataContext must be used within MarketDataProvider')
  }
  return context
}
