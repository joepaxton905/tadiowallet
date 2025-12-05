import Link from 'next/link'
import { config } from '@/lib/config'

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="orb orb-cyan w-[600px] h-[600px] -top-20 -left-20 animate-float" />
          <div className="orb orb-emerald w-[400px] h-[400px] bottom-20 right-0 animate-float-delayed" />
          <div className="orb orb-purple w-[300px] h-[300px] bottom-0 left-1/4 animate-float-slow" />
          <div className="absolute inset-0 bg-grid opacity-20" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-accent-500 rounded-xl rotate-6" />
              <div className="absolute inset-0 bg-dark-950 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-primary-400" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <span className="text-2xl font-heading font-bold text-white">{config.companyName}</span>
          </Link>

          {/* Hero Content */}
          <div className="max-w-lg">
            <h1 className="text-4xl xl:text-5xl font-heading font-bold text-white mb-6">
              Your Gateway to
              <span className="gradient-text"> Digital Finance</span>
            </h1>
            <p className="text-lg text-dark-300 mb-8">
              Join millions of users who trust {config.companyName} for secure cryptocurrency 
              trading. Buy, sell, and manage your digital assets with ease.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-2xl font-heading font-bold text-white">2M+</p>
                <p className="text-sm text-dark-400">Active Users</p>
              </div>
              <div>
                <p className="text-2xl font-heading font-bold text-white">$12B+</p>
                <p className="text-sm text-dark-400">Trading Volume</p>
              </div>
              <div>
                <p className="text-2xl font-heading font-bold text-white">150+</p>
                <p className="text-sm text-dark-400">Cryptocurrencies</p>
              </div>
            </div>
          </div>

          {/* Floating Coins */}
          <div className="absolute top-1/4 right-20 animate-float">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <span className="text-2xl font-bold text-white">₿</span>
            </div>
          </div>
          <div className="absolute bottom-1/3 right-40 animate-float-delayed">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-lg font-bold text-white">Ξ</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-dark-500">
            © {new Date().getFullYear()} {config.companyName}. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}

