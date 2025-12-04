'use client'

import Link from 'next/link'
import { assets } from '@/lib/mockData'

export default function AssetList({ limit, showViewAll = true }) {
  const displayAssets = limit ? assets.slice(0, limit) : assets

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5">
        <h3 className="text-base sm:text-lg font-semibold text-white">Your Assets</h3>
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
        {displayAssets.map((asset) => (
          <Link
            key={asset.id}
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
                ${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className={`text-xs sm:text-sm ${asset.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {asset.priceChange24h >= 0 ? '+' : ''}{asset.priceChange24h}%
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
