'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useTransactions } from '@/hooks/useUserData'
import { format } from 'date-fns'

const typeConfig = {
  buy: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
      </svg>
    ),
    color: 'text-green-400 bg-green-400/10',
    borderColor: 'border-green-400/30',
    gradient: 'from-green-400/20 to-emerald-500/20',
    label: 'Bought',
  },
  sell: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
      </svg>
    ),
    color: 'text-red-400 bg-red-400/10',
    borderColor: 'border-red-400/30',
    gradient: 'from-red-400/20 to-rose-500/20',
    label: 'Sold',
  },
  send: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    color: 'text-orange-400 bg-orange-400/10',
    borderColor: 'border-orange-400/30',
    gradient: 'from-orange-400/20 to-amber-500/20',
    label: 'Sent',
  },
  receive: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    color: 'text-blue-400 bg-blue-400/10',
    borderColor: 'border-blue-400/30',
    gradient: 'from-blue-400/20 to-indigo-500/20',
    label: 'Received',
  },
  swap: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    color: 'text-purple-400 bg-purple-400/10',
    borderColor: 'border-purple-400/30',
    gradient: 'from-purple-400/20 to-pink-500/20',
    label: 'Swapped',
  },
  stake: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'text-cyan-400 bg-cyan-400/10',
    borderColor: 'border-cyan-400/30',
    gradient: 'from-cyan-400/20 to-teal-500/20',
    label: 'Staked',
  },
}

export default function RecentTransactions({ limit = 5 }) {
  // Memoize filters object to prevent infinite loop
  const transactionFilters = useMemo(() => ({ limit: limit * 2 }), [limit])
  const { transactions, loading } = useTransactions(transactionFilters)
  const displayTx = transactions.slice(0, limit)

  return (
    <div className="glass-card overflow-hidden group">
      {/* Gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400/20 to-accent-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Recent Activity</h3>
              <p className="text-xs text-dark-400">Your latest transactions</p>
            </div>
          </div>
          <Link
            href="/dashboard/transactions"
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary-400 hover:text-primary-300 bg-primary-400/10 hover:bg-primary-400/20 rounded-lg transition-all border border-primary-400/20 hover:border-primary-400/30"
          >
            <span>View All</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Transactions List */}
        <div className="divide-y divide-white/5">
          {loading ? (
            [...Array(limit)].map((_, index) => (
              <div key={index} className="flex items-center justify-between px-5 py-4 animate-pulse">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-dark-700/50" />
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-dark-700/50 rounded mb-2" />
                    <div className="h-3 w-24 bg-dark-700/50 rounded" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-5 w-24 bg-dark-700/50 rounded mb-2" />
                  <div className="h-3 w-20 bg-dark-700/50 rounded ml-auto" />
                </div>
              </div>
            ))
          ) : displayTx.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-dark-700 to-dark-800 flex items-center justify-center">
                <svg className="w-8 h-8 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-dark-400 text-sm">No transactions yet</p>
              <Link 
                href="/dashboard/trade"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Make Your First Trade
              </Link>
            </div>
          ) : (
            displayTx.map((tx) => {
              const config = typeConfig[tx.type]
              const isPositive = tx.type === 'receive' || tx.type === 'buy'
              const isNegative = tx.type === 'send' || tx.type === 'sell'
              
              return (
                <div
                  key={tx.id}
                  className="group/tx relative flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-all duration-300 cursor-pointer"
                >
                  {/* Gradient accent on hover */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${config.gradient} opacity-0 group-hover/tx:opacity-100 transition-opacity`} />

                  {/* Transaction Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.color} border ${config.borderColor} transform group-hover/tx:scale-110 transition-transform duration-300`}>
                        {config.icon}
                      </div>
                      {/* Glow on hover */}
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${config.gradient} opacity-0 group-hover/tx:opacity-50 blur-lg transition-opacity`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-white text-base">
                          {config.label} {tx.asset}
                        </p>
                        {tx.status && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            tx.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {tx.status}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-3 h-3 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs text-dark-400 font-medium">
                          {format(new Date(tx.createdAt || tx.date), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right space-y-1">
                    <p className={`font-bold text-base ${
                      isPositive ? 'text-green-400' : 
                      isNegative ? 'text-red-400' : 'text-white'
                    }`}>
                      {isPositive ? '+' : isNegative ? '-' : ''}
                      {tx.amount} {tx.asset}
                    </p>
                    <div className="flex items-center justify-end gap-1">
                      <svg className="w-3 h-3 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xs text-dark-400 font-medium">
                        ${tx.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  {/* Arrow indicator */}
                  <div className="ml-3 opacity-0 group-hover/tx:opacity-100 transition-opacity">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer Summary */}
        {!loading && displayTx.length > 0 && (
          <div className="px-5 py-3 bg-gradient-to-r from-dark-800/50 to-dark-900/50 border-t border-white/5">
            <Link 
              href="/dashboard/transactions"
              className="flex items-center justify-center gap-2 text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              <span>View all {transactions.length} transactions</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
