import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { config } from '@/lib/config'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
})

export const metadata = {
  title: `${config.companyName} - ${config.tagline}`,
  description: `${config.companyName} is your secure gateway to the world of cryptocurrency. Buy, sell, swap, and manage your digital assets with ease.`,
  keywords: ['crypto wallet', 'cryptocurrency', 'bitcoin', 'ethereum', 'defi', 'web3', 'blockchain'],
  authors: [{ name: config.companyName }],
  openGraph: {
    title: `${config.companyName} - ${config.tagline}`,
    description: `${config.companyName} is your secure gateway to the world of cryptocurrency. Buy, sell, swap, and manage your digital assets with ease.`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${config.companyName} - ${config.tagline}`,
    description: `${config.companyName} is your secure gateway to the world of cryptocurrency.`,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-dark-950 text-dark-100 font-body antialiased">
        {children}
      </body>
    </html>
  )
}

