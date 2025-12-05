'use client'

import { useState, useEffect, useCallback } from 'react'
import { getMarketData, getSimplePrices } from '@/lib/crypto'

/**
 * Hook to fetch and auto-refresh cryptocurrency market data
 */
export function useMarketData(symbols, refreshInterval = 30000) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      const result = await getMarketData(symbols)
      setData(result)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [symbols])

  useEffect(() => {
    fetchData()
    
    const interval = setInterval(fetchData, refreshInterval)
    return () => clearInterval(interval)
  }, [fetchData, refreshInterval])

  return { data, loading, error, refetch: fetchData }
}

/**
 * Hook for simple price data (lighter, faster)
 */
export function useSimplePrices(symbols = ['BTC', 'ETH', 'SOL'], refreshInterval = 30000) {
  const [prices, setPrices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPrices = useCallback(async () => {
    try {
      const result = await getSimplePrices(symbols)
      setPrices(result)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [symbols])

  useEffect(() => {
    fetchPrices()
    
    const interval = setInterval(fetchPrices, refreshInterval)
    return () => clearInterval(interval)
  }, [fetchPrices, refreshInterval])

  return { prices, loading, error, refetch: fetchPrices }
}

/**
 * Hook to get a single coin's price
 */
export function useCoinPrice(symbol, refreshInterval = 30000) {
  const { prices, loading, error } = useSimplePrices([symbol], refreshInterval)
  return { 
    price: prices[0]?.price || 0, 
    change: prices[0]?.priceChange24h || 0,
    loading, 
    error 
  }
}

