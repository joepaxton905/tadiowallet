'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { getMarketData, getSimplePrices } from '@/lib/crypto'

/**
 * Hook to fetch and auto-refresh cryptocurrency market data
 * IMPORTANT: Pass a stable array reference or use useMemo for symbols array
 */
export function useMarketData(symbols, refreshInterval = 30000) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Stabilize symbols array to prevent infinite loops
  const symbolsString = useMemo(() => JSON.stringify(symbols), [symbols])

  const fetchData = useCallback(async () => {
    try {
      const parsedSymbols = JSON.parse(symbolsString)
      const result = await getMarketData(parsedSymbols)
      setData(result)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [symbolsString])

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

  // Stabilize symbols array to prevent infinite loops
  const symbolsString = useMemo(() => JSON.stringify(symbols), [symbols])

  const fetchPrices = useCallback(async () => {
    try {
      const parsedSymbols = JSON.parse(symbolsString)
      const result = await getSimplePrices(parsedSymbols)
      setPrices(result)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [symbolsString])

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

