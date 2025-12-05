'use client'

import { useMarketData } from '@/hooks/useCryptoPrices'
import { formatPrice } from '@/lib/crypto'

export default function Cryptocurrencies() {
  const { data: cryptoData, loading } = useMarketData(
    ['BTC', 'ETH', 'SOL', 'ADA', 'MATIC', 'AVAX', 'LINK', 'DOT'],
    60000 // Refresh every 60 seconds
  )

  return (
    <section id="cryptocurrencies" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dark-900/30" />
      <div className="absolute inset-0 bg-grid opacity-10" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium mb-6">
            Live Prices
          </span>
          <h2 className="section-heading text-white mb-6">
            Trade <span className="gradient-text">150+ Cryptocurrencies</span>
          </h2>
          <p className="section-subheading">
            Access the most popular digital assets with real-time pricing. 
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
              {loading ? (
                // Loading skeleton
                [...Array(8)].map((_, index) => (
                  <div key={index} className="flex-shrink-0 mx-3">
                    <div className="glass-card px-6 py-4 flex items-center gap-4 min-w-[200px] animate-pulse">
                      <div className="w-10 h-10 rounded-xl bg-dark-700" />
                      <div>
                        <div className="h-4 w-16 bg-dark-700 rounded mb-2" />
                        <div className="h-3 w-20 bg-dark-700 rounded" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                [...cryptoData, ...cryptoData].map((crypto, index) => (
                  <div key={index} className="flex-shrink-0 mx-3">
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
                          <span className={`text-xs ${crypto.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {crypto.priceChange24h >= 0 ? '+' : ''}{crypto.priceChange24h.toFixed(2)}%
                          </span>
                        </div>
                        <span className="text-sm text-dark-400">${formatPrice(crypto.price)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Crypto Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {loading ? (
            // Loading skeleton
            [...Array(8)].map((_, index) => (
              <div key={index} className="glass-card p-6 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-dark-700" />
                  <div className="h-4 w-12 bg-dark-700 rounded" />
                </div>
                <div className="h-5 w-24 bg-dark-700 rounded mb-2" />
                <div className="h-4 w-32 bg-dark-700 rounded" />
              </div>
            ))
          ) : (
            cryptoData.map((crypto, index) => (
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
                  <span className={`text-sm font-medium ${crypto.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {crypto.priceChange24h >= 0 ? '+' : ''}{crypto.priceChange24h.toFixed(2)}%
                  </span>
                </div>
                <h3 className="font-semibold text-white mb-1">{crypto.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-dark-400 text-sm">{crypto.symbol}</span>
                  <span className="text-white font-medium">${formatPrice(crypto.price)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Live indicator */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-green-400">Live prices from CoinGecko</span>
          </div>
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
