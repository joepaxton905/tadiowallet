'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useMarketData } from '@/hooks/useCryptoPrices'
import { usePortfolio } from '@/hooks/useUserData'
import { formatPrice } from '@/lib/crypto'

export default function AssetList({ limit, showViewAll = true }) {
  const { portfolio, loading: portfolioLoading } = usePortfolio()
  
  // Get list of symbols from user's portfolio
  const portfolioSymbols = useMemo(() => {
    if (!portfolio.length) return ['BTC', 'ETH', 'SOL', 'ADA', 'MATIC', 'AVAX', 'LINK', 'DOT']
    return [...new Set(portfolio.map(h => h.symbol))]
  }, [portfolio])
  
  const { data: marketData, loading: marketLoading } = useMarketData(
    portfolioSymbols,
    30000
  )
  
  const loading = portfolioLoading || marketLoading
  
  // Convert portfolio array to holdings object
  const holdings = useMemo(() => {
    const holdingsMap = {}
    portfolio.forEach(item => {
      holdingsMap[item.symbol] = item.holdings
    })
    return holdingsMap
  }, [portfolio])

  // Combine market data with holdings
  const assets = useMemo(() => {
    return marketData
      .filter(coin => holdings[coin.symbol] > 0)
      .map(coin => ({
        ...coin,
        holdings: holdings[coin.symbol] || 0,
        value: (holdings[coin.symbol] || 0) * coin.price,
      }))
      .sort((a, b) => b.value - a.value)
  }, [marketData, holdings])

  const displayAssets = limit ? assets.slice(0, limit) : assets

  // Calculate total portfolio value for percentage
  const totalValue = useMemo(() => {
    return assets.reduce((sum, asset) => sum + asset.value, 0)
  }, [assets])

  return (
    <div className="glass-card overflow-hidden group">
      {/* Gradient background effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400/20 to-accent-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Your Assets</h3>
              <p className="text-xs text-dark-400">Holdings & performance</p>
            </div>
            {!loading && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 rounded-lg border border-green-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                </span>
                <span className="text-[10px] font-semibold text-green-400">LIVE</span>
              </div>
            )}
          </div>
          {showViewAll && (
            <Link
              href="/dashboard/portfolio"
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary-400 hover:text-primary-300 bg-primary-400/10 hover:bg-primary-400/20 rounded-lg transition-all border border-primary-400/20 hover:border-primary-400/30"
            >
              <span>View All</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>

        {/* Assets List */}
        <div className="divide-y divide-white/5">
          {loading ? (
            // Loading skeleton
            [...Array(limit || 5)].map((_, index) => (
              <div key={index} className="flex items-center justify-between px-5 py-4 animate-pulse">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-dark-700/50" />
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-dark-700/50 rounded mb-2" />
                    <div className="h-3 w-20 bg-dark-700/50 rounded" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-5 w-28 bg-dark-700/50 rounded mb-2" />
                  <div className="h-3 w-16 bg-dark-700/50 rounded ml-auto" />
                </div>
              </div>
            ))
          ) : displayAssets.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-dark-700 to-dark-800 flex items-center justify-center">
                <svg className="w-8 h-8 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-dark-400 text-sm">No assets yet</p>
              <Link 
                href="/dashboard/trade"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Buy Your First Crypto
              </Link>
            </div>
          ) : (
            displayAssets.map((asset, index) => {
              const percentOfPortfolio = totalValue > 0 ? (asset.value / totalValue) * 100 : 0
              
              return (
                <Link
                  key={asset.symbol}
                  href={`/dashboard/trade?asset=${asset.symbol}`}
                  className="group/item relative flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-all duration-300"
                >
                  {/* Rank badge */}
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-dark-800/50 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity">
                    <span className="text-xs font-bold text-dark-400">#{index + 1}</span>
                  </div>

                  {/* Asset Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg transform group-hover/item:scale-110 transition-transform duration-300"
                        style={{ 
                          backgroundColor: asset.color + '20', 
                          color: asset.color,
                          border: `2px solid ${asset.color}30`
                        }}
                      >
                        {asset.icon}
                      </div>
                      {/* Glow effect on hover */}
                      <div 
                        className="absolute inset-0 rounded-xl blur-lg opacity-0 group-hover/item:opacity-50 transition-opacity"
                        style={{ backgroundColor: asset.color }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-white text-base truncate">{asset.name}</p>
                        <span className="text-xs text-dark-500 font-mono">{asset.symbol}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-dark-400">
                          {asset.holdings.toFixed(6)} {asset.symbol}
                        </p>
                        <span className="text-dark-600">•</span>
                        <p className="text-xs text-dark-500">
                          {percentOfPortfolio.toFixed(1)}% of portfolio
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Value & Change */}
                  <div className="text-right space-y-1">
                    <p className="font-bold text-white text-base">
                      ${formatPrice(asset.value)}
                    </p>
                    <div className="flex items-center justify-end gap-2">
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg ${
                        asset.priceChange24h >= 0 
                          ? 'bg-green-400/10 text-green-400' 
                          : 'bg-red-400/10 text-red-400'
                      }`}>
                        {asset.priceChange24h >= 0 ? (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                        <span className="text-xs font-bold">
                          {asset.priceChange24h >= 0 ? '+' : ''}{asset.priceChange24h.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow indicator */}
                  <div className="ml-3 opacity-0 group-hover/item:opacity-100 transition-opacity">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-dark-800">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-400 to-accent-400 transition-all duration-500"
                      style={{ width: `${Math.min(percentOfPortfolio * 2, 100)}%` }}
                    />
                  </div>
                </Link>
              )
            })
          )}
        </div>

        {/* Footer Summary */}
        {!loading && displayAssets.length > 0 && (
          <div className="px-5 py-3 border-t border-white/5" style={{
            background: 'linear-gradient(to right, rgba(5, 10, 20, 0.8) 0%, rgba(10, 15, 28, 0.9) 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.03)'
          }}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark-400">Total Value</span>
              <span className="font-bold text-white text-base">${formatPrice(totalValue)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
