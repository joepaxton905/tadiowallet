'use client'

import { useState } from 'react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { marketData, priceHistory } from '@/lib/mockData'
import Link from 'next/link'

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

// Mock mini chart data
const generateMiniChartData = (positive) => {
  const data = []
  let value = 50
  for (let i = 0; i < 20; i++) {
    value += (Math.random() - (positive ? 0.3 : 0.7)) * 10
    value = Math.max(10, Math.min(90, value))
    data.push({ value })
  }
  return data
}

export default function MarketsPage() {
  const [sortBy, setSortBy] = useState('marketCap')
  const [sortOrder, setSortOrder] = useState('desc')
  const [searchTerm, setSearchTerm] = useState('')

  const sortedData = [...marketData]
    .filter(coin => 
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aVal, bVal
      if (sortBy === 'price') {
        aVal = a.price
        bVal = b.price
      } else if (sortBy === 'change') {
        aVal = a.change
        bVal = b.change
      } else {
        aVal = parseFloat(a.marketCap.replace(/[^0-9.]/g, ''))
        bVal = parseFloat(b.marketCap.replace(/[^0-9.]/g, ''))
      }
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal
    })

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header - Hidden on mobile */}
      <div className="hidden lg:flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Markets</h1>
          <p className="text-dark-400">Explore cryptocurrency prices and market data</p>
        </div>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <p className="text-dark-400 text-sm mb-1">Market Cap</p>
          <p className="text-xl font-heading font-bold text-white">$1.82T</p>
          <p className="text-green-400 text-sm">+2.34%</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-dark-400 text-sm mb-1">24h Volume</p>
          <p className="text-xl font-heading font-bold text-white">$76.5B</p>
          <p className="text-green-400 text-sm">+5.12%</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-dark-400 text-sm mb-1">BTC Dominance</p>
          <p className="text-xl font-heading font-bold text-white">52.4%</p>
          <p className="text-red-400 text-sm">-0.32%</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-dark-400 text-sm mb-1">Active Coins</p>
          <p className="text-xl font-heading font-bold text-white">12,847</p>
          <p className="text-dark-400 text-sm">+28 today</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search cryptocurrencies..."
              className="w-full pl-10 pr-4 py-2.5 bg-dark-800/50 border border-white/5 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500/50"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 bg-dark-800/50 border border-white/5 rounded-xl text-white focus:outline-none focus:border-primary-500/50"
            >
              <option value="marketCap">Market Cap</option>
              <option value="price">Price</option>
              <option value="change">24h Change</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="p-2.5 bg-dark-800/50 border border-white/5 rounded-xl text-dark-400 hover:text-white transition-colors"
            >
              <svg className={`w-5 h-5 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Markets Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-dark-400 border-b border-white/5">
                <th className="px-6 py-4 font-medium">#</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">24h Change</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">7d Chart</th>
                <th className="px-6 py-4 font-medium hidden sm:table-cell">Volume (24h)</th>
                <th className="px-6 py-4 font-medium hidden lg:table-cell">Market Cap</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sortedData.map((coin, index) => {
                const iconData = cryptoIcons[coin.symbol] || { icon: '●', color: '#888' }
                const chartData = generateMiniChartData(coin.change >= 0)
                return (
                  <tr key={coin.symbol} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-dark-400">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                          style={{ backgroundColor: iconData.color + '20', color: iconData.color }}
                        >
                          {iconData.icon}
                        </div>
                        <div>
                          <p className="font-medium text-white">{coin.name}</p>
                          <p className="text-xs text-dark-400">{coin.symbol}</p>
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
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="w-24 h-10">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke={coin.change >= 0 ? '#22c55e' : '#ef4444'}
                              strokeWidth={1.5}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-dark-300">${coin.volume}</span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-dark-300">${coin.marketCap}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/trade?asset=${coin.symbol}`}
                        className="px-4 py-2 text-sm font-medium text-dark-950 bg-gradient-to-r from-primary-400 to-accent-500 rounded-lg hover:opacity-90 transition-opacity"
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
    </div>
  )
}

