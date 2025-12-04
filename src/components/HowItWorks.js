'use client'

import { config } from '@/lib/config'

const steps = [
  {
    number: '01',
    title: 'Create Your Account',
    description: 'Sign up in under 2 minutes with your email. Verify your identity to unlock all features and higher trading limits.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Fund Your Wallet',
    description: 'Add funds using your preferred payment method. We support credit cards, bank transfers, and crypto deposits.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Start Trading',
    description: 'Buy, sell, or swap from 150+ cryptocurrencies. Track your portfolio performance in real-time.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dark-900/50" />
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 rounded-full bg-accent-500/10 text-accent-400 text-sm font-medium mb-6">
            Getting Started
          </span>
          <h2 className="section-heading text-white mb-6">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="section-subheading">
            Get started with {config.companyName} in just three simple steps. 
            No complicated setup, no hidden fees.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-500/30 to-transparent -translate-y-1/2" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Card */}
                <div className="glass-card p-8 lg:p-10 text-center lg:text-left h-full">
                  {/* Step Number */}
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/20 mb-8 mx-auto lg:mx-0">
                    <span className="text-3xl font-heading font-bold gradient-text">{step.number}</span>
                  </div>
                  
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white mb-6 mx-auto lg:mx-0">
                    {step.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-heading font-semibold text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-dark-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow - Mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-dark-300 mb-6">Ready to start your crypto journey?</p>
          <a href="#" className="btn-primary inline-flex items-center">
            <span>Create Free Account</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

