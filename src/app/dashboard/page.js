'use client'

import { portfolioData } from '@/lib/mockData'
import PortfolioChart from '@/components/dashboard/PortfolioChart'
import QuickActions from '@/components/dashboard/QuickActions'
import AssetList from '@/components/dashboard/AssetList'
import RecentTransactions from '@/components/dashboard/RecentTransactions'
import MarketOverview from '@/components/dashboard/MarketOverview'

export default function DashboardPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header - Hidden on mobile as MobileHeader shows title */}
      <div className="hidden lg:flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Dashboard</h1>
          <p className="text-dark-400">Welcome back! Here's your portfolio overview.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-dark-400">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Last updated: Just now
        </div>
      </div>

      {/* Mobile Welcome Card */}
      <div className="lg:hidden glass-card p-4">
        <p className="text-dark-400 text-sm">Good morning,</p>
        <p className="text-lg font-semibold text-white">John Doe</p>
      </div>

      {/* Portfolio Balance Card - Mobile Optimized */}
      <div className="glass-card p-4 sm:p-6 lg:hidden">
        <p className="text-dark-400 text-sm mb-1">Total Balance</p>
        <p className="text-3xl sm:text-4xl font-heading font-bold text-white mb-2">
          ${portfolioData.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm ${
            portfolioData.totalBalanceChange >= 0 
              ? 'bg-green-400/10 text-green-400' 
              : 'bg-red-400/10 text-red-400'
          }`}>
            {portfolioData.totalBalanceChange >= 0 ? (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
            {portfolioData.totalBalanceChange >= 0 ? '+' : ''}{portfolioData.totalBalanceChange}%
          </span>
          <span className="text-dark-500 text-sm">this month</span>
        </div>
      </div>

      {/* Desktop Portfolio Summary Cards */}
      <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Balance */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-dark-400 text-sm">Total Balance</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400/20 to-accent-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-heading font-bold text-white mb-1">
            ${portfolioData.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1">
            <span className={`text-sm ${portfolioData.totalBalanceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {portfolioData.totalBalanceChange >= 0 ? '+' : ''}{portfolioData.totalBalanceChange}%
            </span>
            <span className="text-dark-500 text-sm">this month</span>
          </div>
        </div>

        {/* 24h Change */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-dark-400 text-sm">24h Change</span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              portfolioData.dayChangePercent >= 0 ? 'bg-green-400/20' : 'bg-red-400/20'
            }`}>
              {portfolioData.dayChangePercent >= 0 ? (
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              )}
            </div>
          </div>
          <p className={`text-3xl font-heading font-bold ${portfolioData.dayChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {portfolioData.dayChangePercent >= 0 ? '+' : ''}${portfolioData.dayChange.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1">
            <span className={`text-sm ${portfolioData.dayChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {portfolioData.dayChangePercent >= 0 ? '+' : ''}{portfolioData.dayChangePercent}%
            </span>
            <span className="text-dark-500 text-sm">vs yesterday</span>
          </div>
        </div>

        {/* 7d Change */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-dark-400 text-sm">7d Change</span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              portfolioData.weekChangePercent >= 0 ? 'bg-green-400/20' : 'bg-red-400/20'
            }`}>
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-heading font-bold text-green-400">
            +${portfolioData.weekChange.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1">
            <span className="text-sm text-green-400">+{portfolioData.weekChangePercent}%</span>
            <span className="text-dark-500 text-sm">this week</span>
          </div>
        </div>

        {/* Active Positions */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-dark-400 text-sm">Active Assets</span>
            <div className="w-10 h-10 rounded-xl bg-purple-400/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-heading font-bold text-white">8</p>
          <div className="flex items-center gap-1">
            <span className="text-sm text-primary-400">+2 new</span>
            <span className="text-dark-500 text-sm">this month</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Mobile Stats Row */}
      <div className="grid grid-cols-3 gap-2 lg:hidden">
        <div className="glass-card p-3 text-center">
          <p className="text-xs text-dark-400 mb-1">24h</p>
          <p className={`text-sm font-semibold ${portfolioData.dayChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {portfolioData.dayChangePercent >= 0 ? '+' : ''}{portfolioData.dayChangePercent}%
          </p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-xs text-dark-400 mb-1">7d</p>
          <p className="text-sm font-semibold text-green-400">+{portfolioData.weekChangePercent}%</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-xs text-dark-400 mb-1">Assets</p>
          <p className="text-sm font-semibold text-white">8</p>
        </div>
      </div>

      {/* Portfolio Chart - Hidden on small mobile, compact on tablet */}
      <div className="hidden sm:block">
        <PortfolioChart />
      </div>

      {/* Assets & Transactions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <AssetList limit={5} />
        <RecentTransactions limit={5} />
      </div>

      {/* Market Overview - Hidden on mobile */}
      <div className="hidden lg:block">
        <MarketOverview />
      </div>
    </div>
  )
}
