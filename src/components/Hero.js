'use client'

import { config } from '@/lib/config'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-dark-950">
        {/* Gradient Orbs */}
        <div className="orb orb-cyan w-[600px] h-[600px] -top-40 -left-40 animate-float" />
        <div className="orb orb-emerald w-[500px] h-[500px] top-1/3 -right-40 animate-float-delayed" />
        <div className="orb orb-purple w-[400px] h-[400px] bottom-0 left-1/4 animate-float-slow" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        
        {/* Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-dark-950/50 to-dark-950" />
      </div>

      {/* Floating Crypto Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Bitcoin */}
        <div className="absolute top-1/4 left-[10%] animate-float">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <span className="text-2xl font-bold text-white">₿</span>
          </div>
        </div>
        
        {/* Ethereum */}
        <div className="absolute top-1/3 right-[15%] animate-float-delayed">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="text-xl font-bold text-white">Ξ</span>
          </div>
        </div>
        
        {/* Solana */}
        <div className="absolute bottom-1/3 left-[20%] animate-float-slow">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <span className="text-lg font-bold text-white">◎</span>
          </div>
        </div>
        
        {/* Generic Coin 1 */}
        <div className="absolute top-1/2 right-[8%] animate-float">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30 opacity-60">
            <span className="text-sm font-bold text-white">◆</span>
          </div>
        </div>
        
        {/* Generic Coin 2 */}
        <div className="absolute bottom-1/4 right-[25%] animate-float-delayed">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/30 opacity-50">
            <span className="text-xs font-bold text-white">●</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-accent-400 mr-2 animate-pulse" />
            <span className="text-sm text-dark-200">
              Trusted by 2M+ users worldwide
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tight mb-8 animate-slide-up">
            <span className="text-white">Your Gateway to</span>
            <br />
            <span className="gradient-text-hero">{config.tagline.split(' ').slice(-2).join(' ')}</span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-dark-300 mb-12 animate-slide-up animation-delay-200">
            Buy, sell, swap, and securely manage your cryptocurrency portfolio with 
            {' '}<span className="text-white font-medium">{config.companyName}</span>. 
            Experience the future of finance today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up animation-delay-400">
            <a href="#" className="btn-primary w-full sm:w-auto">
              <span>Start Trading Now</span>
            </a>
            <a href="#how-it-works" className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch Demo
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in animation-delay-600">
            {[
              { value: '$12B+', label: 'Trading Volume' },
              { value: '2M+', label: 'Active Users' },
              { value: '150+', label: 'Cryptocurrencies' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-heading font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-dark-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Image / App Preview */}
        <div className="mt-20 relative animate-slide-up animation-delay-800">
          <div className="relative max-w-5xl mx-auto">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-accent-500/20 to-primary-500/20 blur-3xl" />
            
            {/* App Preview Card */}
            <div className="relative glass-card p-2 sm:p-4">
              <div className="bg-dark-900 rounded-xl overflow-hidden">
                {/* Mock App Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-sm text-dark-400">{config.companyName} Dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <svg className="w-4 h-4 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <svg className="w-4 h-4 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Mock App Content */}
                <div className="p-6 space-y-6">
                  {/* Portfolio Value */}
                  <div className="text-center py-8">
                    <p className="text-dark-400 text-sm mb-2">Total Portfolio Value</p>
                    <p className="text-4xl sm:text-5xl font-heading font-bold text-white mb-2">$124,523.89</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent-500/20 text-accent-400 text-sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      +12.5% this month
                    </span>
                  </div>
                  
                  {/* Asset List Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { name: 'Bitcoin', symbol: 'BTC', price: '$43,250', change: '+2.4%', positive: true },
                      { name: 'Ethereum', symbol: 'ETH', price: '$2,280', change: '+5.1%', positive: true },
                      { name: 'Solana', symbol: 'SOL', price: '$98.50', change: '-1.2%', positive: false },
                    ].map((asset, index) => (
                      <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/5">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-white font-medium">{asset.symbol}</span>
                          <span className={`text-sm ${asset.positive ? 'text-accent-400' : 'text-red-400'}`}>
                            {asset.change}
                          </span>
                        </div>
                        <p className="text-2xl font-heading font-bold text-white">{asset.price}</p>
                        <p className="text-dark-400 text-sm">{asset.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-dark-600 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-dark-400 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}

