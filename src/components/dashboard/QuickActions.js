'use client'

import Link from 'next/link'

const actions = [
  {
    name: 'Buy',
    href: '/dashboard/trade?action=buy',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
      </svg>
    ),
    gradient: 'from-green-400 to-emerald-600',
  },
  {
    name: 'Sell',
    href: '/dashboard/trade?action=sell',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
      </svg>
    ),
    gradient: 'from-red-400 to-rose-600',
  },
  {
    name: 'Send',
    href: '/dashboard/send',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    gradient: 'from-orange-400 to-amber-600',
  },
  {
    name: 'Receive',
    href: '/dashboard/receive',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    gradient: 'from-blue-400 to-indigo-600',
  },
]

export default function QuickActions() {
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {actions.map((action) => (
        <Link
          key={action.name}
          href={action.href}
          className="glass-card p-3 sm:p-4 flex flex-col items-center gap-2 group active:scale-95 transition-transform"
        >
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
            {action.icon}
          </div>
          <span className="text-xs sm:text-sm font-medium text-dark-300 group-hover:text-white transition-colors">
            {action.name}
          </span>
        </Link>
      ))}
    </div>
  )
}
