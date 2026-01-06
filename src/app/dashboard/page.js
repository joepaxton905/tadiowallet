'use client'

import { useMemo, memo } from 'react'
import { useMarketDataContext } from '@/lib/marketDataContext'
import { usePortfolio } from '@/hooks/useUserData'
import { formatPrice } from '@/lib/crypto'
import PortfolioChart from '@/components/dashboard/PortfolioChart'
import QuickActions from '@/components/dashboard/QuickActions'
import AssetList from '@/components/dashboard/AssetList'
import RecentTransactions from '@/components/dashboard/RecentTransactions'
import MarketOverview from '@/components/dashboard/MarketOverview'
import { useAuth } from '@/lib/authContext'

function DashboardPage() {
  const { user } = useAuth()
  const { portfolio, loading: portfolioLoading } = usePortfolio()
  const { marketData, loading: marketLoading } = useMarketDataContext()
  
  const loading = portfolioLoading || marketLoading
  
  // Convert portfolio array to holdings object
  const holdings = useMemo(() => {
    const holdingsMap = {}
    portfolio.forEach(item => {
      holdingsMap[item.symbol] = item.holdings
    })
    return holdingsMap
  }, [portfolio])

  // Calculate portfolio values from live prices
  const portfolioData = useMemo(() => {
    if (!marketData.length || !Object.keys(holdings).length) {
      return {
        totalBalance: 0,
        dayChange: 0,
        dayChangePercent: 0,
        weekChange: 0,
        weekChangePercent: 0,
        assetCount: Object.keys(holdings).length,
        bestPerformer: null,
        worstPerformer: null,
        totalInvested: 0,
        totalGainLoss: 0,
        totalGainLossPercent: 0,
      }
    }

    let totalValue = 0
    let totalPreviousValue = 0
    let totalInvested = 0
    let bestPerformer = null
    let worstPerformer = null

    const assetPerformances = marketData
      .filter(coin => holdings[coin.symbol] > 0)
      .map(coin => {
        const userHoldings = holdings[coin.symbol] || 0
        const currentValue = userHoldings * coin.price
        const previousValue = currentValue / (1 + coin.priceChange24h / 100)
        
        // Get average buy price from portfolio
        const portfolioItem = portfolio.find(p => p.symbol === coin.symbol)
        const avgBuyPrice = portfolioItem?.averageBuyPrice || coin.price
        const investedValue = userHoldings * avgBuyPrice
        
        totalValue += currentValue
        totalPreviousValue += previousValue
        totalInvested += investedValue

        return {
          ...coin,
          currentValue,
          change24h: coin.priceChange24h,
          gainLoss: currentValue - investedValue,
          gainLossPercent: ((currentValue - investedValue) / investedValue) * 100,
        }
      })

    // Find best and worst performers
    if (assetPerformances.length > 0) {
      assetPerformances.sort((a, b) => b.change24h - a.change24h)
      bestPerformer = assetPerformances[0]
      worstPerformer = assetPerformances[assetPerformances.length - 1]
    }

    const dayChange = totalValue - totalPreviousValue
    const dayChangePercent = totalPreviousValue > 0 ? (dayChange / totalPreviousValue) * 100 : 0
    const totalGainLoss = totalValue - totalInvested
    const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0

    // Mock week change (in production, would need historical data)
    const weekChangePercent = 7.12
    const weekChange = totalValue * (weekChangePercent / 100)

    return {
      totalBalance: totalValue,
      dayChange,
      dayChangePercent,
      weekChange,
      weekChangePercent,
      assetCount: assetPerformances.length,
      bestPerformer,
      worstPerformer,
      totalInvested,
      totalGainLoss,
      totalGainLossPercent,
    }
  }, [marketData, holdings, portfolio])

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden">
        {/* Animated background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl animate-pulse animation-delay-400" />
        </div>

        {/* Main Hero Card */}
        <div className="relative glass-card p-6 sm:p-8 overflow-hidden group">
          {/* Subtle animated background pattern */}
          <div className="absolute inset-0 bg-grid opacity-20" />
          
          <div className="relative z-10">
            {/* Header Row */}
            <div className="flex items-start justify-between mb-6">
              <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white">
                  {getGreeting()}, {user ? user.firstName : 'Welcome'}
                </h1>
                <p className="text-dark-300 text-base">Here's your portfolio performance today</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30 backdrop-blur-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
                </span>
                <span className="text-sm font-medium text-green-400">Live</span>
              </div>
            </div>

            {/* Main Balance Display */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Total Balance */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400/30 to-accent-500/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-dark-300 text-sm font-medium">Total Portfolio Value</span>
                </div>
                {loading ? (
                  <div className="h-16 w-64 bg-dark-700/50 rounded-xl animate-pulse" />
                ) : (
                  <div className="space-y-2">
                    <h2 className="text-5xl sm:text-6xl font-heading font-bold bg-gradient-to-r from-white via-primary-200 to-white bg-clip-text text-transparent">
                      ${formatPrice(portfolioData.totalBalance)}
                    </h2>
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ${
                        portfolioData.dayChangePercent >= 0 
                          ? 'bg-green-400/10 border border-green-400/20' 
                          : 'bg-red-400/10 border border-red-400/20'
                      }`}>
                        {portfolioData.dayChangePercent >= 0 ? (
                          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                          </svg>
                        )}
                        <span className={`text-lg font-bold ${portfolioData.dayChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {portfolioData.dayChange >= 0 ? '+' : ''}${formatPrice(Math.abs(portfolioData.dayChange))}
                        </span>
                        <span className={`text-sm font-medium ${portfolioData.dayChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ({portfolioData.dayChangePercent >= 0 ? '+' : ''}{portfolioData.dayChangePercent.toFixed(2)}%)
                        </span>
                      </div>
                      <span className="text-dark-400 text-sm font-medium">Today</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Portfolio Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* All-Time Gain/Loss */}
                <div className="p-4 rounded-xl backdrop-blur-sm transition-colors" style={{
                  background: 'linear-gradient(135deg, rgba(10, 15, 28, 0.6) 0%, rgba(15, 23, 42, 0.4) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.03)'
                }}>
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-dark-400 text-xs font-medium">All-Time P&L</span>
                  </div>
                  {loading ? (
                    <div className="h-6 w-20 bg-dark-700/50 rounded animate-pulse" />
                  ) : (
                    <>
                      <p className={`text-xl font-bold ${portfolioData.totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {portfolioData.totalGainLoss >= 0 ? '+' : ''}${formatPrice(Math.abs(portfolioData.totalGainLoss))}
                      </p>
                      <p className={`text-xs ${portfolioData.totalGainLossPercent >= 0 ? 'text-green-400/70' : 'text-red-400/70'}`}>
                        {portfolioData.totalGainLossPercent >= 0 ? '+' : ''}{portfolioData.totalGainLossPercent.toFixed(2)}%
                      </p>
                    </>
                  )}
                </div>

                {/* 7d Change */}
                <div className="p-4 rounded-xl backdrop-blur-sm transition-colors" style={{
                  background: 'linear-gradient(135deg, rgba(10, 15, 28, 0.6) 0%, rgba(15, 23, 42, 0.4) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.03)'
                }}>
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-dark-400 text-xs font-medium">7 Days</span>
                  </div>
                  {loading ? (
                    <div className="h-6 w-20 bg-dark-700/50 rounded animate-pulse" />
                  ) : (
                    <>
                      <p className="text-xl font-bold text-accent-400">
                        +${formatPrice(portfolioData.weekChange)}
                      </p>
                      <p className="text-xs text-accent-400/70">+{portfolioData.weekChangePercent}%</p>
                    </>
                  )}
                </div>

                {/* Best Performer */}
                <div className="p-4 rounded-xl backdrop-blur-sm transition-all" style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.05) 100%), linear-gradient(135deg, rgba(10, 15, 28, 0.7) 0%, rgba(15, 23, 42, 0.5) 100%)',
                  border: '1px solid rgba(16, 185, 129, 0.15)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(16, 185, 129, 0.1)'
                }}>
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <span className="text-green-400 text-xs font-medium">Top Gainer</span>
                  </div>
                  {loading || !portfolioData.bestPerformer ? (
                    <div className="h-6 w-16 bg-dark-700/50 rounded animate-pulse" />
                  ) : (
                    <>
                      <p className="text-lg font-bold text-white">{portfolioData.bestPerformer.symbol}</p>
                      <p className="text-xs text-green-400">+{portfolioData.bestPerformer.change24h.toFixed(2)}%</p>
                    </>
                  )}
                </div>

                {/* Worst Performer */}
                <div className="p-4 rounded-xl backdrop-blur-sm transition-all" style={{
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.05) 100%), linear-gradient(135deg, rgba(10, 15, 28, 0.7) 0%, rgba(15, 23, 42, 0.5) 100%)',
                  border: '1px solid rgba(239, 68, 68, 0.15)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(239, 68, 68, 0.1)'
                }}>
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="text-red-400 text-xs font-medium">Top Loser</span>
                  </div>
                  {loading || !portfolioData.worstPerformer ? (
                    <div className="h-6 w-16 bg-dark-700/50 rounded animate-pulse" />
                  ) : (
                    <>
                      <p className="text-lg font-bold text-white">{portfolioData.worstPerformer.symbol}</p>
                      <p className="text-xs text-red-400">{portfolioData.worstPerformer.change24h.toFixed(2)}%</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Stats Bar */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center lg:text-left">
                  <p className="text-dark-400 text-xs mb-1">Total Invested</p>
                  {loading ? (
                    <div className="h-5 w-24 bg-dark-700/50 rounded animate-pulse mx-auto lg:mx-0" />
                  ) : (
                    <p className="text-lg font-bold text-white">${formatPrice(portfolioData.totalInvested)}</p>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-dark-400 text-xs mb-1">Active Assets</p>
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-lg font-bold text-white">{portfolioData.assetCount}</p>
                    <span className="text-xs px-2 py-0.5 bg-primary-500/20 text-primary-400 rounded-full">
                      Diversified
                    </span>
                  </div>
                </div>
                <div className="text-center lg:text-right">
                  <p className="text-dark-400 text-xs mb-1">Current Value</p>
                  {loading ? (
                    <div className="h-5 w-24 bg-dark-700/50 rounded animate-pulse mx-auto lg:ml-auto" />
                  ) : (
                    <p className="text-lg font-bold text-white">${formatPrice(portfolioData.totalBalance)}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Enhanced */}
      <div className="animate-fade-in">
        <QuickActions />
      </div>

      {/* Portfolio Performance Chart */}
      <div className="animate-fade-in animation-delay-200">
        <PortfolioChart />
      </div>

      {/* Assets & Transactions Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-fade-in animation-delay-400">
        <AssetList limit={5} />
        <RecentTransactions limit={5} />
      </div>

      {/* Market Overview */}
      <div className="animate-fade-in animation-delay-600">
        <MarketOverview />
      </div>
    </div>
  )
}

// Export memoized version to prevent unnecessary re-renders
export default memo(DashboardPage)
