'use client'

import { config } from '@/lib/config'

const cryptoData = [
  { name: 'Bitcoin', symbol: 'BTC', price: '$43,250.00', change: '+2.45%', positive: true, color: '#F7931A', icon: '₿' },
  { name: 'Ethereum', symbol: 'ETH', price: '$2,280.50', change: '+5.12%', positive: true, color: '#627EEA', icon: 'Ξ' },
  { name: 'Solana', symbol: 'SOL', price: '$98.75', change: '-1.23%', positive: false, color: '#9945FF', icon: '◎' },
  { name: 'Cardano', symbol: 'ADA', price: '$0.52', change: '+3.78%', positive: true, color: '#0033AD', icon: '₳' },
  { name: 'Polygon', symbol: 'MATIC', price: '$0.89', change: '+4.56%', positive: true, color: '#8247E5', icon: '⬡' },
  { name: 'Avalanche', symbol: 'AVAX', price: '$35.20', change: '-0.89%', positive: false, color: '#E84142', icon: '◆' },
  { name: 'Chainlink', symbol: 'LINK', price: '$14.85', change: '+6.32%', positive: true, color: '#2A5ADA', icon: '⬢' },
  { name: 'Polkadot', symbol: 'DOT', price: '$7.45', change: '+1.98%', positive: true, color: '#E6007A', icon: '●' },
]

export default function Cryptocurrencies() {
  return (
    <section id="cryptocurrencies" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dark-900/30" />
      <div className="absolute inset-0 bg-grid opacity-10" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium mb-6">
            Supported Assets
          </span>
          <h2 className="section-heading text-white mb-6">
            Trade <span className="gradient-text">150+ Cryptocurrencies</span>
          </h2>
          <p className="section-subheading">
            Access the most popular digital assets and discover emerging tokens. 
            New cryptocurrencies are added regularly.
          </p>
        </div>

        {/* Crypto Ticker - Animated */}
        <div className="relative mb-16">
          {/* Gradient Overlays for Fade Effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-dark-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-dark-950 to-transparent z-10 pointer-events-none" />
          
          {/* Scrolling Ticker */}
          <div className="overflow-hidden">
            <div className="flex animate-[scroll_30s_linear_infinite] hover:[animation-play-state:paused]">
              {[...cryptoData, ...cryptoData].map((crypto, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 mx-3"
                >
                  <div className="glass-card px-6 py-4 flex items-center gap-4 min-w-[200px]">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: crypto.color + '20', color: crypto.color }}
                    >
                      {crypto.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{crypto.symbol}</span>
                        <span className={`text-xs ${crypto.positive ? 'text-green-400' : 'text-red-400'}`}>
                          {crypto.change}
                        </span>
                      </div>
                      <span className="text-sm text-dark-400">{crypto.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Crypto Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {cryptoData.map((crypto, index) => (
            <div
              key={index}
              className="glass-card-hover p-6 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: crypto.color + '20', color: crypto.color }}
                >
                  {crypto.icon}
                </div>
                <span className={`text-sm font-medium ${crypto.positive ? 'text-green-400' : 'text-red-400'}`}>
                  {crypto.change}
                </span>
              </div>
              <h3 className="font-semibold text-white mb-1">{crypto.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-dark-400 text-sm">{crypto.symbol}</span>
                <span className="text-white font-medium">{crypto.price}</span>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors duration-200 font-medium"
          >
            View all supported cryptocurrencies
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Inline Keyframes for scroll animation */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  )
}

