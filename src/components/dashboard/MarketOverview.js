'use client'

import Link from 'next/link'
import { marketData } from '@/lib/mockData'

const cryptoIcons = {
  BTC: { icon: '₿', color: '#F7931A' },
  ETH: { icon: 'Ξ', color: '#627EEA' },
  SOL: { icon: '◎', color: '#9945FF' },
  BNB: { icon: '◆', color: '#F3BA2F' },
  XRP: { icon: '✕', color: '#23292F' },
  ADA: { icon: '₳', color: '#0033AD' },
  AVAX: { icon: '◆', color: '#E84142' },
  DOGE: { icon: 'Ð', color: '#C2A633' },
}

export default function MarketOverview() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <h3 className="text-lg font-semibold text-white">Market Overview</h3>
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
            {marketData.slice(0, 5).map((coin) => {
              const iconData = cryptoIcons[coin.symbol] || { icon: '●', color: '#888' }
              return (
                <tr key={coin.symbol} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                        style={{ backgroundColor: iconData.color + '20', color: iconData.color }}
                      >
                        {iconData.icon}
                      </div>
                      <div>
                        <p className="font-medium text-white">{coin.symbol}</p>
                        <p className="text-xs text-dark-400">{coin.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">
                      ${coin.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 ${coin.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {coin.change >= 0 ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                      {Math.abs(coin.change)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className="text-dark-300">${coin.volume}</span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-dark-300">${coin.marketCap}</span>
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
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

