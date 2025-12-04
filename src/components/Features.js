'use client'

import { config } from '@/lib/config'

const features = [
  {
    title: 'Buy Crypto',
    description: 'Purchase cryptocurrency instantly with your credit card, debit card, or bank transfer. Low fees and fast processing.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: 'from-green-400 to-emerald-600',
  },
  {
    title: 'Sell Crypto',
    description: 'Convert your digital assets back to fiat currency anytime. Withdraw directly to your bank account within minutes.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    gradient: 'from-blue-400 to-indigo-600',
  },
  {
    title: 'Swap Tokens',
    description: 'Exchange between 150+ cryptocurrencies with the best rates. Instant swaps with no hidden fees.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    gradient: 'from-purple-400 to-pink-600',
  },
  {
    title: 'Send & Receive',
    description: 'Transfer crypto to anyone, anywhere in the world. Fast, secure, and with minimal transaction fees.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    gradient: 'from-cyan-400 to-blue-600',
  },
  {
    title: 'Stake & Earn',
    description: 'Put your crypto to work. Earn up to 12% APY by staking your assets in our secure pools.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    gradient: 'from-amber-400 to-orange-600',
  },
  {
    title: 'DeFi Access',
    description: 'Connect to the world of decentralized finance. Access DEXs, lending protocols, and yield farming.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    gradient: 'from-rose-400 to-red-600',
  },
]

export default function Features() {
  return (
    <section id="features" className="relative section-padding overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="orb orb-cyan w-[400px] h-[400px] top-0 right-0 opacity-20" />
        <div className="orb orb-emerald w-[300px] h-[300px] bottom-0 left-0 opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium mb-6">
            Features
          </span>
          <h2 className="section-heading text-white mb-6">
            Everything You Need to
            <span className="gradient-text"> Trade Crypto</span>
          </h2>
          <p className="section-subheading">
            {config.companyName} provides all the tools you need to buy, sell, and manage 
            your cryptocurrency portfolio in one secure platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group glass-card-hover p-8"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-heading font-semibold text-white mb-3 group-hover:text-primary-400 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-dark-300 leading-relaxed">
                {feature.description}
              </p>
              
              {/* Learn More Link */}
              <a
                href="#"
                className="inline-flex items-center mt-6 text-primary-400 hover:text-primary-300 transition-colors duration-200 text-sm font-medium"
              >
                Learn more
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <a href="#" className="btn-primary inline-flex items-center">
            <span>Explore All Features</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

