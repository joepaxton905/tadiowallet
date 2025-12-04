'use client'

import { config } from '@/lib/config'

const securityFeatures = [
  {
    title: 'Bank-Grade Encryption',
    description: 'Your data is protected with AES-256 encryption, the same standard used by leading financial institutions.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    title: 'Cold Storage',
    description: '95% of all crypto assets are stored in air-gapped cold storage, protected from online threats.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    title: 'Two-Factor Auth',
    description: 'Add an extra layer of security with biometric authentication and hardware security keys.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Insurance Coverage',
    description: 'Your assets are protected with up to $250M in insurance coverage against security breaches.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

const certifications = [
  { name: 'SOC 2 Type II', description: 'Certified' },
  { name: 'ISO 27001', description: 'Compliant' },
  { name: 'GDPR', description: 'Compliant' },
  { name: 'PCI DSS', description: 'Level 1' },
]

export default function Security() {
  return (
    <section id="security" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="orb orb-emerald w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-accent-500/10 text-accent-400 text-sm font-medium mb-6">
              Security First
            </span>
            <h2 className="section-heading text-white mb-6">
              Your Security is Our
              <span className="gradient-text"> Top Priority</span>
            </h2>
            <p className="text-lg text-dark-300 mb-10">
              At {config.companyName}, we employ industry-leading security measures to ensure 
              your assets and personal information are always protected.
            </p>

            {/* Security Features */}
            <div className="space-y-6">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-400 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-dark-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Security Visualization */}
          <div className="relative">
            {/* Main Security Card */}
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-500/20 to-primary-500/20 rounded-3xl blur-3xl" />
              
              <div className="relative glass-card p-8 lg:p-10">
                {/* Shield Icon */}
                <div className="w-24 h-24 mx-auto mb-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-400 to-primary-500 rounded-2xl animate-pulse-glow" />
                  <div className="absolute inset-1 bg-dark-900 rounded-xl flex items-center justify-center">
                    <svg className="w-12 h-12 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>

                <h3 className="text-2xl font-heading font-bold text-white text-center mb-3">
                  Military-Grade Protection
                </h3>
                <p className="text-dark-300 text-center mb-8">
                  Your assets are secured with the most advanced cryptographic protocols available.
                </p>

                {/* Security Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                    <div className="text-3xl font-heading font-bold text-white mb-1">$0</div>
                    <div className="text-sm text-dark-400">Lost to Breaches</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                    <div className="text-3xl font-heading font-bold text-white mb-1">99.99%</div>
                    <div className="text-sm text-dark-400">Uptime</div>
                  </div>
                </div>

                {/* Certifications */}
                <div className="border-t border-white/10 pt-6">
                  <p className="text-sm text-dark-400 text-center mb-4">Certifications & Compliance</p>
                  <div className="grid grid-cols-4 gap-3">
                    {certifications.map((cert, index) => (
                      <div key={index} className="text-center">
                        <div className="w-10 h-10 mx-auto rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                          <svg className="w-5 h-5 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-xs text-dark-300 font-medium">{cert.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 glass-card flex items-center justify-center animate-float">
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 glass-card flex items-center justify-center animate-float-delayed">
              <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

