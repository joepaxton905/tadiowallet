'use client'

import Link from 'next/link'
import { useMarketData } from '@/hooks/useCryptoPrices'
import { formatPrice, formatLargeNumber } from '@/lib/crypto'

export default function MarketOverview() {
  const { data: marketData, loading } = useMarketData(
    ['BTC', 'ETH', 'SOL', 'BNB', 'XRP'],
    30000
  )

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-white">Market Overview</h3>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400">Live</span>
          </div>
        </div>
        <Link
          href="/dashboard/markets"
          className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-dark-400 border-b border-white/5">
              <th className="px-6 py-3 font-medium">Asset</th>
              <th className="px-6 py-3 font-medium">Price</th>
              <th className="px-6 py-3 font-medium">24h Change</th>
              <th className="px-6 py-3 font-medium hidden sm:table-cell">Volume</th>
              <th className="px-6 py-3 font-medium hidden md:table-cell">Market Cap</th>
              <th className="px-6 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              // Loading skeleton
              [...Array(5)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-dark-700" />
                      <div>
                        <div className="h-4 w-16 bg-dark-700 rounded mb-1" />
                        <div className="h-3 w-12 bg-dark-700 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><div className="h-4 w-20 bg-dark-700 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-14 bg-dark-700 rounded" /></td>
                  <td className="px-6 py-4 hidden sm:table-cell"><div className="h-4 w-16 bg-dark-700 rounded" /></td>
                  <td className="px-6 py-4 hidden md:table-cell"><div className="h-4 w-16 bg-dark-700 rounded" /></td>
                  <td className="px-6 py-4 text-right"><div className="h-8 w-16 bg-dark-700 rounded ml-auto" /></td>
                </tr>
              ))
            ) : (
              marketData.map((coin) => (
                <tr key={coin.symbol} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                        style={{ backgroundColor: coin.color + '20', color: coin.color }}
                      >
                        {coin.icon}
                      </div>
                      <div>
                        <p className="font-medium text-white">{coin.symbol}</p>
                        <p className="text-xs text-dark-400">{coin.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">
                      ${formatPrice(coin.price)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 ${coin.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {coin.priceChange24h >= 0 ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                      {Math.abs(coin.priceChange24h).toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className="text-dark-300">{formatLargeNumber(coin.volume)}</span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-dark-300">{formatLargeNumber(coin.marketCap)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/dashboard/trade?asset=${coin.symbol}`}
                      className="px-3 py-1.5 text-xs font-medium text-primary-400 border border-primary-400/30 rounded-lg hover:bg-primary-400/10 transition-colors"
                    >
                      Trade
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
