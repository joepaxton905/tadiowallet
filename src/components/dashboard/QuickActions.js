'use client'

import Link from 'next/link'

const actions = [
  {
    name: 'Buy Crypto',
    shortName: 'Buy',
    href: '/dashboard/trade?action=buy',
    description: 'Purchase cryptocurrency',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
    gradient: 'from-green-400 via-emerald-500 to-green-600',
    bgGradient: 'from-green-500/20 to-emerald-500/20',
    iconBg: 'bg-green-500/20',
    textColor: 'text-green-400',
    borderColor: 'border-green-500/30',
  },
  {
    name: 'Sell Crypto',
    shortName: 'Sell',
    href: '/dashboard/trade?action=sell',
    description: 'Sell your holdings',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
      </svg>
    ),
    gradient: 'from-red-400 via-rose-500 to-red-600',
    bgGradient: 'from-red-500/20 to-rose-500/20',
    iconBg: 'bg-red-500/20',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/30',
  },
  {
    name: 'Send',
    shortName: 'Send',
    href: '/dashboard/send',
    description: 'Transfer to wallet',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    gradient: 'from-orange-400 via-amber-500 to-orange-600',
    bgGradient: 'from-orange-500/20 to-amber-500/20',
    iconBg: 'bg-orange-500/20',
    textColor: 'text-orange-400',
    borderColor: 'border-orange-500/30',
  },
  {
    name: 'Receive',
    shortName: 'Receive',
    href: '/dashboard/receive',
    description: 'Get your address',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    gradient: 'from-blue-400 via-indigo-500 to-blue-600',
    bgGradient: 'from-blue-500/20 to-indigo-500/20',
    iconBg: 'bg-blue-500/20',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
  },
]

export default function QuickActions() {
  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400/20 to-accent-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Quick Actions</h3>
            <p className="text-xs text-dark-400">Fast access to key features</p>
          </div>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="group relative overflow-hidden"
          >
            {/* Card Background */}
            <div className="glass-card p-5 sm:p-6 h-full relative overflow-hidden transition-all duration-300 group-hover:border-white/20 group-active:scale-98">
              {/* Gradient Background Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${action.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              {/* Glow Effect on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center gap-3">
                {/* Icon Container */}
                <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  {/* Glow ring */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${action.gradient} blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
                  <div className="relative">
                    {action.icon}
                  </div>
                </div>
                
                {/* Text */}
                <div className="space-y-0.5">
                  <p className="font-bold text-white text-sm sm:text-base group-hover:text-white transition-colors">
                    <span className="hidden sm:inline">{action.name}</span>
                    <span className="sm:hidden">{action.shortName}</span>
                  </p>
                  <p className="text-xs text-dark-400 group-hover:text-dark-300 transition-colors hidden sm:block">
                    {action.description}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className={`absolute top-3 right-3 w-6 h-6 rounded-full ${action.iconBg} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0`}>
                  <svg className={`w-3 h-3 ${action.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Bottom accent line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${action.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
            </div>
          </Link>
        ))}
      </div>

      {/* Additional Quick Stats */}
      <div className="glass-card p-4">
        <div className="grid grid-cols-3 divide-x divide-white/5">
          <div className="px-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-dark-400">24h Volume</span>
            </div>
            <p className="text-sm font-bold text-white">$2.4M</p>
          </div>
          <div className="px-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-xs text-dark-400">Transactions</span>
            </div>
            <p className="text-sm font-bold text-white">1,234</p>
          </div>
          <div className="px-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-dark-400">Avg. Time</span>
            </div>
            <p className="text-sm font-bold text-white">~2 min</p>
          </div>
        </div>
      </div>
    </div>
  )
}
