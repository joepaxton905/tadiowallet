// Central configuration file that reads from environment variables
// All dynamic company information is sourced from .env

export const config = {
  // Company Information
  companyName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'TadioWallet',
  tagline: process.env.NEXT_PUBLIC_TAGLINE || 'The Future of Digital Finance',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@tadiowallet.com',
  
  // Social Links
  socialLinks: {
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com/tadiowallet',
    discord: process.env.NEXT_PUBLIC_DISCORD_URL || 'https://discord.gg/tadiowallet',
    telegram: process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/tadiowallet',
    github: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/tadiowallet',
  },
  
  // App Download Links
  appLinks: {
    appStore: process.env.NEXT_PUBLIC_APP_STORE_URL || '#',
    playStore: process.env.NEXT_PUBLIC_PLAY_STORE_URL || '#',
  },
  
  // Navigation Links
  navLinks: [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Security', href: '#security' },
    { name: 'Cryptocurrencies', href: '#cryptocurrencies' },
  ],
  
  // Footer Links
  footerLinks: {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Security', href: '#security' },
      { name: 'Pricing', href: '#' },
      { name: 'Roadmap', href: '#' },
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press Kit', href: '#' },
      { name: 'Contact', href: '#' },
    ],
    resources: [
      { name: 'Documentation', href: '#' },
      { name: 'Help Center', href: '#' },
      { name: 'API Reference', href: '#' },
      { name: 'Status', href: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'Compliance', href: '#' },
    ],
  },
  
  // Supported Cryptocurrencies
  cryptocurrencies: [
    { name: 'Bitcoin', symbol: 'BTC', color: '#F7931A' },
    { name: 'Ethereum', symbol: 'ETH', color: '#627EEA' },
    { name: 'Solana', symbol: 'SOL', color: '#9945FF' },
    { name: 'Cardano', symbol: 'ADA', color: '#0033AD' },
    { name: 'Polygon', symbol: 'MATIC', color: '#8247E5' },
    { name: 'Avalanche', symbol: 'AVAX', color: '#E84142' },
    { name: 'Chainlink', symbol: 'LINK', color: '#2A5ADA' },
    { name: 'Polkadot', symbol: 'DOT', color: '#E6007A' },
    { name: 'Cosmos', symbol: 'ATOM', color: '#2E3148' },
    { name: 'Litecoin', symbol: 'LTC', color: '#BFBBBB' },
  ],
}

export default config

