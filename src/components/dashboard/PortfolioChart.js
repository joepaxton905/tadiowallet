'use client'

import { useState, useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { portfolioHistory } from '@/lib/mockData'

const timeframes = [
  { key: '1D', label: '24H', description: 'Last 24 hours' },
  { key: '1W', label: '1W', description: 'Last 7 days' },
  { key: '1M', label: '1M', description: 'Last 30 days' },
  { key: '3M', label: '3M', description: 'Last 3 months' },
  { key: '1Y', label: '1Y', description: 'Last year' },
  { key: 'All', label: 'All', description: 'All time' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value
    const previousValue = payload[0].payload.previousValue || value
    const change = value - previousValue
    const changePercent = previousValue > 0 ? (change / previousValue) * 100 : 0
    
    return (
      <div className="bg-dark-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl">
        <p className="text-dark-300 text-xs mb-2 font-medium">{label}</p>
        <p className="text-white font-bold text-2xl mb-2">
          ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${
          change >= 0 ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'
        }`}>
          {change >= 0 ? (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
          <span className="text-xs font-bold">
            {change >= 0 ? '+' : ''}${Math.abs(change).toFixed(2)} ({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>
    )
  }
  return null
}

const CustomDot = (props) => {
  const { cx, cy, payload } = props
  if (payload.highlight) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={6} fill="#22d3ee" fillOpacity={0.3} />
        <circle cx={cx} cy={cy} r={3} fill="#22d3ee" />
      </g>
    )
  }
  return null
}

export default function PortfolioChart() {
  const [activeTimeframe, setActiveTimeframe] = useState('1Y')

  // Calculate chart statistics
  const chartStats = useMemo(() => {
    if (!portfolioHistory || portfolioHistory.length === 0) {
      return { high: 0, low: 0, change: 0, changePercent: 0 }
    }

    const values = portfolioHistory.map(d => d.value)
    const high = Math.max(...values)
    const low = Math.min(...values)
    const firstValue = values[0]
    const lastValue = values[values.length - 1]
    const change = lastValue - firstValue
    const changePercent = firstValue > 0 ? (change / firstValue) * 100 : 0

    return { high, low, change, changePercent }
  }, [])

  const isPositive = chartStats.change >= 0

  return (
    <div className="glass-card overflow-hidden group">
      {/* Gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative p-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400/20 to-accent-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Portfolio Performance</h3>
                <p className="text-sm text-dark-400">Track your growth over time</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border ${
                isPositive 
                  ? 'bg-green-400/10 border-green-400/30' 
                  : 'bg-red-400/10 border-red-400/30'
              }`}>
                {isPositive ? (
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                )}
                <span className={`text-sm font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {chartStats.change >= 0 ? '+' : ''}${Math.abs(chartStats.change).toFixed(2)}
                </span>
                <span className={`text-xs font-medium ${isPositive ? 'text-green-400/70' : 'text-red-400/70'}`}>
                  ({chartStats.changePercent >= 0 ? '+' : ''}{chartStats.changePercent.toFixed(2)}%)
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-dark-400">High:</span>
                  <span className="text-white font-semibold">${chartStats.high.toFixed(2)}</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-1.5">
                  <span className="text-dark-400">Low:</span>
                  <span className="text-white font-semibold">${chartStats.low.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Timeframe Selector */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl backdrop-blur-sm" style={{
            background: 'linear-gradient(135deg, rgba(10, 15, 28, 0.8) 0%, rgba(15, 23, 42, 0.6) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)'
          }}>
            {timeframes.map((tf) => (
              <button
                key={tf.key}
                onClick={() => setActiveTimeframe(tf.key)}
                title={tf.description}
                className={`relative px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-300 ${
                  activeTimeframe === tf.key
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-dark-950 shadow-lg'
                    : 'text-dark-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {activeTimeframe === tf.key && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-400 to-accent-400 blur-lg opacity-30 -z-10" />
                )}
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Container */}
        <div className="relative">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />
          
          <div className="relative h-80 sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={portfolioHistory} 
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <defs>
                  {/* Enhanced gradient with multiple stops */}
                  <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.4} />
                    <stop offset="50%" stopColor="#22d3ee" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                  
                  {/* Gradient for the stroke */}
                  <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>

                  {/* Glow effect */}
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="rgba(255,255,255,0.06)" 
                  vertical={false}
                  strokeWidth={1}
                />
                
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                  dy={15}
                  tickMargin={10}
                />
                
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
                    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`
                    return `$${value}`
                  }}
                  dx={-15}
                  tickMargin={10}
                />
                
                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{ 
                    stroke: '#22d3ee', 
                    strokeWidth: 2, 
                    strokeDasharray: '5 5',
                    opacity: 0.5 
                  }}
                />
                
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="url(#strokeGradient)"
                  strokeWidth={3}
                  fill="url(#portfolioGradient)"
                  dot={<CustomDot />}
                  activeDot={{ 
                    r: 6, 
                    fill: '#22d3ee',
                    stroke: '#0a0f1c',
                    strokeWidth: 2,
                    filter: 'url(#glow)'
                  }}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart Legend */}
        <div className="mt-6 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary-400 to-accent-400" />
                <span className="text-xs text-dark-400 font-medium">Portfolio Value</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-dark-600" />
                <span className="text-xs text-dark-400 font-medium">Historical Range</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-500/10 rounded-lg border border-primary-500/20">
              <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-primary-400 font-medium">Hover over the chart for details</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

