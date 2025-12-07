'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useTransactions } from '@/hooks/useUserData'
import { format } from 'date-fns'

const typeConfig = {
  buy: {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
    color: 'text-green-400 bg-green-400/10',
    label: 'Bought',
  },
  sell: {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
      </svg>
    ),
    color: 'text-red-400 bg-red-400/10',
    label: 'Sold',
  },
  send: {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    color: 'text-orange-400 bg-orange-400/10',
    label: 'Sent',
  },
  receive: {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    color: 'text-blue-400 bg-blue-400/10',
    label: 'Received',
  },
  swap: {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    color: 'text-purple-400 bg-purple-400/10',
    label: 'Swapped',
  },
  stake: {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'text-cyan-400 bg-cyan-400/10',
    label: 'Staked',
  },
}

export default function RecentTransactions({ limit = 5 }) {
  // Memoize filters object to prevent infinite loop
  const transactionFilters = useMemo(() => ({ limit: limit * 2 }), [limit])
  const { transactions, loading } = useTransactions(transactionFilters)
  const displayTx = transactions.slice(0, limit)

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5">
        <h3 className="text-base sm:text-lg font-semibold text-white">Recent Activity</h3>
        <Link
          href="/dashboard/transactions"
          className="text-sm text-primary-400 hover:text-primary-300 active:text-primary-500 transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="divide-y divide-white/5">
        {loading ? (
          [...Array(limit)].map((_, index) => (
            <div key={index} className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-dark-700" />
                <div>
                  <div className="h-4 w-24 bg-dark-700 rounded mb-1" />
                  <div className="h-3 w-20 bg-dark-700 rounded" />
                </div>
              </div>
              <div className="text-right">
                <div className="h-4 w-20 bg-dark-700 rounded mb-1" />
                <div className="h-3 w-16 bg-dark-700 rounded ml-auto" />
              </div>
            </div>
          ))
        ) : displayTx.length === 0 ? (
          <div className="px-4 sm:px-6 py-8 text-center text-dark-400">
            No recent transactions
          </div>
        ) : (
          displayTx.map((tx) => {
          const config = typeConfig[tx.type]
          return (
            <div
              key={tx.id}
              className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 hover:bg-white/5 active:bg-white/10 transition-colors cursor-pointer"
            >
              {/* Transaction Info */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${config.color}`}>
                  {config.icon}
                </div>
                <div>
                  <p className="font-medium text-white text-sm sm:text-base">
                    {config.label} {tx.asset}
                  </p>
                  <p className="text-xs text-dark-400">
                    {format(new Date(tx.date), 'MMM d, h:mm a')}
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div className="text-right">
                <p className={`font-medium text-sm sm:text-base ${
                  tx.type === 'receive' || tx.type === 'buy' ? 'text-green-400' : 
                  tx.type === 'send' || tx.type === 'sell' ? 'text-red-400' : 'text-white'
                }`}>
                  {tx.type === 'receive' || tx.type === 'buy' ? '+' : tx.type === 'send' || tx.type === 'sell' ? '-' : ''}
                  {tx.amount} {tx.asset}
                </p>
                <p className="text-xs text-dark-400">
                  ${tx.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          )
          })
        )}
      </div>
    </div>
  )
}
