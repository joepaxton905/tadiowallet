'use client'

import Link from 'next/link'
import { useMarketData } from '@/hooks/useCryptoPrices'
import { formatPrice } from '@/lib/crypto'

// Mock holdings - in production this would come from user data
const mockHoldings = {
  BTC: 1.45,
  ETH: 12.5,
  SOL: 150,
  ADA: 10000,
  MATIC: 5000,
  AVAX: 100,
  LINK: 200,
  DOT: 300,
}

export default function AssetList({ limit, showViewAll = true }) {
  const { data: marketData, loading } = useMarketData(
    ['BTC', 'ETH', 'SOL', 'ADA', 'MATIC', 'AVAX', 'LINK', 'DOT'],
    30000
  )

  // Combine market data with holdings
  const assets = marketData
    .filter(coin => mockHoldings[coin.symbol])
    .map(coin => ({
      ...coin,
      holdings: mockHoldings[coin.symbol] || 0,
      value: (mockHoldings[coin.symbol] || 0) * coin.price,
    }))
    .sort((a, b) => b.value - a.value)

  const displayAssets = limit ? assets.slice(0, limit) : assets

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-white">Your Assets</h3>
          {!loading && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/10 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-green-400">Live</span>
            </div>
          )}
        </div>
        {showViewAll && (
          <Link
            href="/dashboard/portfolio"
            className="text-sm text-primary-400 hover:text-primary-300 active:text-primary-500 transition-colors"
          >
            View All
          </Link>
        )}
      </div>

      <div className="divide-y divide-white/5">
        {loading ? (
          // Loading skeleton
          [...Array(limit || 5)].map((_, index) => (
            <div key={index} className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-dark-700" />
                <div>
                  <div className="h-4 w-20 bg-dark-700 rounded mb-1" />
                  <div className="h-3 w-16 bg-dark-700 rounded" />
                </div>
              </div>
              <div className="text-right">
                <div className="h-4 w-24 bg-dark-700 rounded mb-1" />
                <div className="h-3 w-12 bg-dark-700 rounded ml-auto" />
              </div>
            </div>
          ))
        ) : (
          displayAssets.map((asset) => (
            <Link
              key={asset.symbol}
              href={`/dashboard/trade?asset=${asset.symbol}`}
              className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 hover:bg-white/5 active:bg-white/10 transition-colors"
            >
              {/* Asset Info */}
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-base sm:text-lg font-bold"
                  style={{ backgroundColor: asset.color + '20', color: asset.color }}
                >
                  {asset.icon}
                </div>
                <div>
                  <p className="font-medium text-white text-sm sm:text-base">{asset.name}</p>
                  <p className="text-xs sm:text-sm text-dark-400">{asset.holdings} {asset.symbol}</p>
                </div>
              </div>

              {/* Price & Change */}
              <div className="text-right">
                <p className="font-medium text-white text-sm sm:text-base">
                  ${formatPrice(asset.value)}
                </p>
                <p className={`text-xs sm:text-sm ${asset.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {asset.priceChange24h >= 0 ? '+' : ''}{asset.priceChange24h.toFixed(2)}%
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
