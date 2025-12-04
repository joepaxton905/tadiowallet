'use client'

import { useState } from 'react'
import { transactions } from '@/lib/mockData'
import { format } from 'date-fns'

const typeConfig = {
  buy: { icon: '+', color: 'text-green-400 bg-green-400/10', label: 'Buy' },
  sell: { icon: '-', color: 'text-red-400 bg-red-400/10', label: 'Sell' },
  send: { icon: '↑', color: 'text-orange-400 bg-orange-400/10', label: 'Send' },
  receive: { icon: '↓', color: 'text-blue-400 bg-blue-400/10', label: 'Receive' },
  swap: { icon: '⇄', color: 'text-purple-400 bg-purple-400/10', label: 'Swap' },
  stake: { icon: '◎', color: 'text-cyan-400 bg-cyan-400/10', label: 'Stake' },
}

const statusColors = {
  completed: { bg: 'bg-green-400/10', text: 'text-green-400' },
  pending: { bg: 'bg-yellow-400/10', text: 'text-yellow-400' },
  active: { bg: 'bg-cyan-400/10', text: 'text-cyan-400' },
  failed: { bg: 'bg-red-400/10', text: 'text-red-400' },
}

const filterOptions = [
  { id: 'all', label: 'All' },
  { id: 'buy', label: 'Buy' },
  { id: 'sell', label: 'Sell' },
  { id: 'send', label: 'Send' },
  { id: 'receive', label: 'Receive' },
  { id: 'swap', label: 'Swap' },
  { id: 'stake', label: 'Stake' },
]

export default function TransactionsPage() {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTx, setSelectedTx] = useState(null)

  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter = filter === 'all' || tx.type === filter
    const matchesSearch = tx.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.assetName.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header - Hidden on mobile */}
      <div className="hidden lg:flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Transactions</h1>
          <p className="text-dark-400">View your complete transaction history</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-dark-300 hover:text-white hover:bg-white/10 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2.5 bg-dark-800/50 border border-white/5 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500/50"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setFilter(option.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  filter === option.id
                    ? 'bg-primary-500 text-dark-950'
                    : 'bg-white/5 text-dark-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-dark-400 border-b border-white/5">
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Asset</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Value</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.map((tx) => {
                const config = typeConfig[tx.type]
                const status = statusColors[tx.status]
                return (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.color}`}>
                          <span className="text-sm font-bold">{config.icon}</span>
                        </div>
                        <span className="font-medium text-white">{config.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                          style={{ backgroundColor: tx.assetColor + '20', color: tx.assetColor }}
                        >
                          {tx.assetIcon}
                        </div>
                        <div>
                          <p className="font-medium text-white">{tx.assetName}</p>
                          <p className="text-xs text-dark-400">{tx.asset}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${
                        tx.type === 'receive' || tx.type === 'buy' ? 'text-green-400' :
                        tx.type === 'send' || tx.type === 'sell' ? 'text-red-400' : 'text-white'
                      }`}>
                        {tx.type === 'receive' || tx.type === 'buy' ? '+' : tx.type === 'send' || tx.type === 'sell' ? '-' : ''}
                        {tx.amount} {tx.asset}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white">
                        ${tx.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${status.bg} ${status.text}`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-dark-300 text-sm">
                        {format(new Date(tx.date), 'MMM d, yyyy')}
                      </span>
                      <br />
                      <span className="text-dark-500 text-xs">
                        {format(new Date(tx.date), 'h:mm a')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="px-3 py-1.5 text-xs font-medium text-primary-400 border border-primary-400/30 rounded-lg hover:bg-primary-400/10 transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-12 h-12 mx-auto text-dark-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-dark-400">No transactions found</p>
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTx(null)} />
          <div className="relative w-full max-w-md bg-dark-900 rounded-2xl border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h3 className="text-lg font-semibold text-white">Transaction Details</h3>
              <button onClick={() => setSelectedTx(null)} className="p-2 text-dark-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center py-4">
                <div
                  className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-2xl font-bold mb-4"
                  style={{ backgroundColor: selectedTx.assetColor + '20', color: selectedTx.assetColor }}
                >
                  {selectedTx.assetIcon}
                </div>
                <p className={`text-3xl font-heading font-bold ${
                  selectedTx.type === 'receive' || selectedTx.type === 'buy' ? 'text-green-400' :
                  selectedTx.type === 'send' || selectedTx.type === 'sell' ? 'text-red-400' : 'text-white'
                }`}>
                  {selectedTx.type === 'receive' || selectedTx.type === 'buy' ? '+' : selectedTx.type === 'send' || selectedTx.type === 'sell' ? '-' : ''}
                  {selectedTx.amount} {selectedTx.asset}
                </p>
                <p className="text-dark-400">${selectedTx.value.toLocaleString()}</p>
              </div>

              <div className="space-y-3 bg-dark-800/30 rounded-xl p-4">
                <div className="flex justify-between">
                  <span className="text-dark-400">Type</span>
                  <span className="text-white capitalize">{selectedTx.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">Status</span>
                  <span className={statusColors[selectedTx.status].text}>{selectedTx.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">Date</span>
                  <span className="text-white">{format(new Date(selectedTx.date), 'MMM d, yyyy h:mm a')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">Fee</span>
                  <span className="text-white">${selectedTx.fee.toFixed(2)}</span>
                </div>
                {selectedTx.from && (
                  <div className="flex justify-between">
                    <span className="text-dark-400">From</span>
                    <span className="text-white font-mono text-sm">{selectedTx.from}</span>
                  </div>
                )}
                {selectedTx.to && (
                  <div className="flex justify-between">
                    <span className="text-dark-400">To</span>
                    <span className="text-white font-mono text-sm">{selectedTx.to}</span>
                  </div>
                )}
              </div>

              <button className="w-full py-3 rounded-xl bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-colors">
                View on Explorer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

