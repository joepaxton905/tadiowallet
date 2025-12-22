'use client'

import Link from 'next/link'
import { useMarketData } from '@/hooks/useCryptoPrices'
import { formatPrice, formatLargeNumber } from '@/lib/crypto'

export default function MarketOverview() {
  const { data: marketData, loading } = useMarketData(
    ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'ADA', 'MATIC'],
    30000
  )

  return (
    <div className="glass-card overflow-hidden group">
      {/* Gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400/20 to-accent-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Market Overview</h3>
              <p className="text-xs text-dark-400">Top cryptocurrencies by market cap</p>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 rounded-lg border border-green-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="text-[10px] font-semibold text-green-400">LIVE</span>
            </div>
          </div>
          <Link
            href="/dashboard/markets"
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary-400 hover:text-primary-300 bg-primary-400/10 hover:bg-primary-400/20 rounded-lg transition-all border border-primary-400/20 hover:border-primary-400/30"
          >
            <span>View All</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-dark-400 border-b border-white/5 bg-dark-800/30">
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Asset</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">24h Change</th>
                <th className="px-6 py-4 hidden lg:table-cell">Volume (24h)</th>
                <th className="px-6 py-4 hidden xl:table-cell">Market Cap</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                // Loading skeleton
                [...Array(7)].map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 w-6 bg-dark-700/50 rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-dark-700/50" />
                        <div>
                          <div className="h-4 w-20 bg-dark-700/50 rounded mb-2" />
                          <div className="h-3 w-16 bg-dark-700/50 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-dark-700/50 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-20 bg-dark-700/50 rounded" /></td>
                    <td className="px-6 py-4 hidden lg:table-cell"><div className="h-4 w-20 bg-dark-700/50 rounded" /></td>
                    <td className="px-6 py-4 hidden xl:table-cell"><div className="h-4 w-24 bg-dark-700/50 rounded" /></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 w-20 bg-dark-700/50 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : (
                marketData.map((coin, index) => (
                  <tr 
                    key={coin.symbol} 
                    className="group/row hover:bg-white/5 transition-all duration-300"
                  >
                    {/* Rank */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-dark-400 group-hover/row:text-dark-300">
                        {index + 1}
                      </span>
                    </td>

                    {/* Asset */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold shadow-lg transform group-hover/row:scale-110 transition-transform duration-300"
                            style={{ 
                              backgroundColor: coin.color + '20', 
                              color: coin.color,
                              border: `2px solid ${coin.color}30`
                            }}
                          >
                            {coin.icon}
                          </div>
                          {/* Glow effect on hover */}
                          <div 
                            className="absolute inset-0 rounded-xl blur-lg opacity-0 group-hover/row:opacity-40 transition-opacity"
                            style={{ backgroundColor: coin.color }}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-white text-base">{coin.symbol}</p>
                          <p className="text-xs text-dark-400">{coin.name}</p>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      <span className="text-white font-semibold text-base">
                        ${formatPrice(coin.price)}
                      </span>
                    </td>

                    {/* 24h Change */}
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold ${
                        coin.priceChange24h >= 0 
                          ? 'bg-green-400/10 text-green-400 border border-green-400/20' 
                          : 'bg-red-400/10 text-red-400 border border-red-400/20'
                      }`}>
                        {coin.priceChange24h >= 0 ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                          </svg>
                        )}
                        <span className="text-sm">
                          {coin.priceChange24h >= 0 ? '+' : ''}{Math.abs(coin.priceChange24h).toFixed(2)}%
                        </span>
                      </div>
                    </td>

                    {/* Volume */}
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span className="text-dark-300 font-medium">{formatLargeNumber(coin.volume)}</span>
                      </div>
                    </td>

                    {/* Market Cap */}
                    <td className="px-6 py-4 hidden xl:table-cell">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-dark-300 font-medium">{formatLargeNumber(coin.marketCap)}</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/trade?asset=${coin.symbol}`}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg hover:from-primary-400 hover:to-accent-400 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <span>Trade</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Stats */}
        {!loading && marketData.length > 0 && (
          <div className="px-6 py-4 bg-gradient-to-r from-dark-800/50 to-dark-900/50 border-t border-white/5">
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                  <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="text-xs text-dark-400 font-medium">Global Volume</span>
                </div>
                <p className="text-base font-bold text-white">
                  {formatLargeNumber(marketData.reduce((sum, coin) => sum + coin.volume, 0))}
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-dark-400 font-medium">Total Market Cap</span>
                </div>
                <p className="text-base font-bold text-white">
                  {formatLargeNumber(marketData.reduce((sum, coin) => sum + coin.marketCap, 0))}
                </p>
              </div>
              <div className="text-center lg:text-right">
                <div className="flex items-center justify-center lg:justify-end gap-2 mb-1">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                  <span className="text-xs text-dark-400 font-medium">Assets Tracked</span>
                </div>
                <p className="text-base font-bold text-white">{marketData.length} coins</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
