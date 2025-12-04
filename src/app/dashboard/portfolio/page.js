'use client'

import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { assets, portfolioData } from '@/lib/mockData'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-dark-800/95 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-white font-medium">{data.name}</p>
        <p className="text-dark-400 text-sm">{data.allocation}% of portfolio</p>
        <p className="text-primary-400 font-semibold">${data.value.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

export default function PortfolioPage() {
  const [sortBy, setSortBy] = useState('value')
  const [sortOrder, setSortOrder] = useState('desc')

  const sortedAssets = [...assets].sort((a, b) => {
    const aVal = a[sortBy]
    const bVal = b[sortBy]
    return sortOrder === 'desc' ? bVal - aVal : aVal - bVal
  })

  const pieData = assets.map(asset => ({
    name: asset.name,
    value: asset.value,
    allocation: asset.allocation,
    color: asset.color,
  }))

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header - Hidden on mobile */}
      <div className="hidden lg:flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Portfolio</h1>
          <p className="text-dark-400">Detailed view of your crypto holdings</p>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Allocation Chart */}
        <div className="lg:col-span-1 glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Asset Allocation</h3>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
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
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-dark-400 text-xs">Total Value</p>
              <p className="text-xl font-heading font-bold text-white">
                ${portfolioData.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
          
          {/* Legend */}
          <div className="mt-6 space-y-2">
            {pieData.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-dark-300">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-white">{item.allocation}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="glass-card p-6">
            <p className="text-dark-400 text-sm mb-2">Total Value</p>
            <p className="text-3xl font-heading font-bold text-white">
              ${portfolioData.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <div className="mt-2 flex items-center gap-1">
              <span className="text-green-400 text-sm">+${portfolioData.totalBalanceChangeAmount.toLocaleString()}</span>
              <span className="text-dark-500 text-sm">(+{portfolioData.totalBalanceChange}%)</span>
            </div>
          </div>

          <div className="glass-card p-6">
            <p className="text-dark-400 text-sm mb-2">24h P&L</p>
            <p className={`text-3xl font-heading font-bold ${portfolioData.dayChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {portfolioData.dayChange >= 0 ? '+' : ''}${portfolioData.dayChange.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <div className="mt-2 flex items-center gap-1">
              <span className={`text-sm ${portfolioData.dayChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {portfolioData.dayChangePercent >= 0 ? '+' : ''}{portfolioData.dayChangePercent}%
              </span>
            </div>
          </div>

          <div className="glass-card p-6">
            <p className="text-dark-400 text-sm mb-2">Best Performer (24h)</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-400 font-bold">⬢</span>
              </div>
              <div>
                <p className="font-semibold text-white">LINK</p>
                <p className="text-green-400 text-sm">+6.32%</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <p className="text-dark-400 text-sm mb-2">Worst Performer (24h)</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <span className="text-purple-400 font-bold">◎</span>
              </div>
              <div>
                <p className="font-semibold text-white">SOL</p>
                <p className="text-red-400 text-sm">-1.23%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h3 className="text-lg font-semibold text-white">All Assets</h3>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary-500/50"
            >
              <option value="value">Sort by Value</option>
              <option value="allocation">Sort by Allocation</option>
              <option value="priceChange24h">Sort by 24h Change</option>
              <option value="holdings">Sort by Holdings</option>
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
                <th className="px-6 py-3 font-medium">Asset</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">24h Change</th>
                <th className="px-6 py-3 font-medium">Holdings</th>
                <th className="px-6 py-3 font-medium">Value</th>
                <th className="px-6 py-3 font-medium">Allocation</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sortedAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4">
                    <span className="text-white">
                      ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 ${asset.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {asset.priceChange24h >= 0 ? '+' : ''}{asset.priceChange24h}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white">{asset.holdings} {asset.symbol}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">
                      ${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-dark-800 rounded-full overflow-hidden max-w-[80px]">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${asset.allocation}%`, backgroundColor: asset.color }}
                        />
                      </div>
                      <span className="text-dark-300 text-sm">{asset.allocation}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="px-3 py-1.5 text-xs font-medium text-primary-400 border border-primary-400/30 rounded-lg hover:bg-primary-400/10 transition-colors">
                        Buy
                      </button>
                      <button className="px-3 py-1.5 text-xs font-medium text-dark-300 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                        Sell
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

