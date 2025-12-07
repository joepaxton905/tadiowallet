'use client'

import { useState, useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useMarketData } from '@/hooks/useCryptoPrices'
import { usePortfolio } from '@/hooks/useUserData'
import { formatPrice } from '@/lib/crypto'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-dark-800/95 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-white font-medium">{data.name}</p>
        <p className="text-dark-400 text-sm">{data.allocation.toFixed(1)}% of portfolio</p>
        <p className="text-primary-400 font-semibold">${formatPrice(data.value)}</p>
      </div>
    )
  }
  return null
}

export default function PortfolioPage() {
  const [sortBy, setSortBy] = useState('value')
  const [sortOrder, setSortOrder] = useState('desc')

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

  // Calculate portfolio data from live prices
  const { assets, totalValue, pieData, bestPerformer, worstPerformer } = useMemo(() => {
    const assetsWithValue = marketData
      .filter(coin => holdings[coin.symbol] > 0)
      .map(coin => ({
        ...coin,
        holdings: holdings[coin.symbol] || 0,
        value: (holdings[coin.symbol] || 0) * coin.price,
      }))

    const total = assetsWithValue.reduce((sum, a) => sum + a.value, 0)

    const withAllocation = assetsWithValue.map(a => ({
      ...a,
      allocation: total > 0 ? (a.value / total) * 100 : 0,
    }))

    const sorted = [...withAllocation].sort((a, b) => b.priceChange24h - a.priceChange24h)
    const best = sorted[0]
    const worst = sorted[sorted.length - 1]

    return {
      assets: withAllocation,
      totalValue: total,
      pieData: withAllocation.map(a => ({
        name: a.name,
        value: a.value,
        allocation: a.allocation,
        color: a.color,
      })),
      bestPerformer: best,
      worstPerformer: worst,
    }
  }, [marketData])

  const sortedAssets = useMemo(() => {
    return [...assets].sort((a, b) => {
      const aVal = a[sortBy]
      const bVal = b[sortBy]
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal
    })
  }, [assets, sortBy, sortOrder])

  // Calculate 24h change
  const dayChange = useMemo(() => {
    return assets.reduce((sum, a) => {
      const previousValue = a.value / (1 + a.priceChange24h / 100)
      return sum + (a.value - previousValue)
    }, 0)
  }, [assets])

  const dayChangePercent = totalValue > 0 ? (dayChange / (totalValue - dayChange)) * 100 : 0

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header - Hidden on mobile */}
      <div className="hidden lg:flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Portfolio</h1>
          <p className="text-dark-400">Detailed view of your crypto holdings</p>
        </div>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm text-green-400">Live prices</span>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Allocation Chart */}
        <div className="lg:col-span-1 glass-card p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-6">Asset Allocation</h3>
          <div className="h-52 sm:h-64 relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-4 border-dark-700 border-t-primary-400 animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
            {/* Center Text */}
            {!loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-dark-400 text-xs">Total Value</p>
                <p className="text-lg sm:text-xl font-heading font-bold text-white">
                  ${formatPrice(totalValue)}
                </p>
              </div>
            )}
          </div>
          
          {/* Legend */}
          <div className="mt-6 space-y-2">
            {pieData.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-dark-300">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-white">{item.allocation.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-3 sm:gap-4">
          <div className="glass-card p-4 sm:p-6">
            <p className="text-dark-400 text-xs sm:text-sm mb-2">Total Value</p>
            {loading ? (
              <div className="h-8 w-32 bg-dark-700 rounded animate-pulse" />
            ) : (
              <>
                <p className="text-2xl sm:text-3xl font-heading font-bold text-white">
                  ${formatPrice(totalValue)}
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <span className={`text-sm ${dayChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {dayChange >= 0 ? '+' : ''}${formatPrice(Math.abs(dayChange))}
                  </span>
                  <span className="text-dark-500 text-xs">24h</span>
                </div>
              </>
            )}
          </div>

          <div className="glass-card p-4 sm:p-6">
            <p className="text-dark-400 text-xs sm:text-sm mb-2">24h P&L</p>
            {loading ? (
              <div className="h-8 w-24 bg-dark-700 rounded animate-pulse" />
            ) : (
              <>
                <p className={`text-2xl sm:text-3xl font-heading font-bold ${dayChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {dayChange >= 0 ? '+' : ''}{dayChangePercent.toFixed(2)}%
                </p>
                <div className="mt-2">
                  <span className={`text-sm ${dayChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {dayChange >= 0 ? '+' : ''}${formatPrice(Math.abs(dayChange))}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="glass-card p-4 sm:p-6">
            <p className="text-dark-400 text-xs sm:text-sm mb-2">Best Performer</p>
            {loading || !bestPerformer ? (
              <div className="h-10 w-full bg-dark-700 rounded animate-pulse" />
            ) : (
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold"
                  style={{ backgroundColor: bestPerformer.color + '20', color: bestPerformer.color }}
                >
                  {bestPerformer.icon}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm sm:text-base">{bestPerformer.symbol}</p>
                  <p className="text-green-400 text-xs sm:text-sm">+{bestPerformer.priceChange24h.toFixed(2)}%</p>
                </div>
              </div>
            )}
          </div>

          <div className="glass-card p-4 sm:p-6">
            <p className="text-dark-400 text-xs sm:text-sm mb-2">Worst Performer</p>
            {loading || !worstPerformer ? (
              <div className="h-10 w-full bg-dark-700 rounded animate-pulse" />
            ) : (
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold"
                  style={{ backgroundColor: worstPerformer.color + '20', color: worstPerformer.color }}
                >
                  {worstPerformer.icon}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm sm:text-base">{worstPerformer.symbol}</p>
                  <p className={`text-xs sm:text-sm ${worstPerformer.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {worstPerformer.priceChange24h >= 0 ? '+' : ''}{worstPerformer.priceChange24h.toFixed(2)}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/5">
          <h3 className="text-base sm:text-lg font-semibold text-white">All Assets</h3>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary-500/50"
            >
              <option value="value">Value</option>
              <option value="allocation">Allocation</option>
              <option value="priceChange24h">24h Change</option>
              <option value="holdings">Holdings</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="p-2 bg-white/5 border border-white/10 rounded-lg text-dark-400 hover:text-white transition-colors"
            >
              <svg className={`w-4 h-4 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-dark-400 border-b border-white/5">
                <th className="px-4 sm:px-6 py-3 font-medium">Asset</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Price</th>
                <th className="px-4 sm:px-6 py-3 font-medium">24h</th>
                <th className="px-4 sm:px-6 py-3 font-medium hidden sm:table-cell">Holdings</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Value</th>
                <th className="px-4 sm:px-6 py-3 font-medium hidden md:table-cell">Allocation</th>
                <th className="px-4 sm:px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [...Array(6)].map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-dark-700" />
                        <div>
                          <div className="h-4 w-20 bg-dark-700 rounded mb-1" />
                          <div className="h-3 w-12 bg-dark-700 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4"><div className="h-4 w-20 bg-dark-700 rounded" /></td>
                    <td className="px-4 sm:px-6 py-4"><div className="h-4 w-14 bg-dark-700 rounded" /></td>
                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell"><div className="h-4 w-16 bg-dark-700 rounded" /></td>
                    <td className="px-4 sm:px-6 py-4"><div className="h-4 w-20 bg-dark-700 rounded" /></td>
                    <td className="px-4 sm:px-6 py-4 hidden md:table-cell"><div className="h-4 w-16 bg-dark-700 rounded" /></td>
                    <td className="px-4 sm:px-6 py-4 text-right"><div className="h-8 w-16 bg-dark-700 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : (
                sortedAssets.map((asset) => (
                  <tr key={asset.symbol} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                          style={{ backgroundColor: asset.color + '20', color: asset.color }}
                        >
                          {asset.icon}
                        </div>
                        <div>
                          <p className="font-medium text-white">{asset.name}</p>
                          <p className="text-xs text-dark-400">{asset.symbol}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className="text-white">${formatPrice(asset.price)}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className={`inline-flex items-center gap-1 ${asset.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {asset.priceChange24h >= 0 ? '+' : ''}{asset.priceChange24h.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                      <span className="text-white">{asset.holdings} {asset.symbol}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className="text-white font-medium">${formatPrice(asset.value)}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-dark-800 rounded-full overflow-hidden max-w-[80px]">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${asset.allocation}%`, backgroundColor: asset.color }}
                          />
                        </div>
                        <span className="text-dark-300 text-sm">{asset.allocation.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a 
                          href={`/dashboard/trade?asset=${asset.symbol}`}
                          className="px-3 py-1.5 text-xs font-medium text-primary-400 border border-primary-400/30 rounded-lg hover:bg-primary-400/10 transition-colors"
                        >
                          Trade
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
