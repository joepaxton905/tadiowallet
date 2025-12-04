# TadioWallet - Crypto Wallet Web App

A modern, beautiful crypto wallet web application built with Next.js 14, Tailwind CSS, and React. Features a stunning landing page and a comprehensive dashboard for managing cryptocurrency.

## Features

### Landing Page
- **Modern Dark Theme**: Deep navy backgrounds with vibrant cyan-to-emerald gradients
- **Glass-morphism Effects**: Beautiful frosted glass cards with subtle animations
- **Fully Responsive**: Mobile-first design that looks great on all devices
- **Dynamic Configuration**: Company name and details sourced from environment variables
- **Smooth Animations**: CSS-only animations for optimal performance

### Dashboard
- **Portfolio Overview**: Real-time portfolio value with performance charts
- **Asset Management**: View and manage all your cryptocurrency holdings
- **Trading Interface**: Buy, sell, and swap cryptocurrencies with intuitive UI
- **Send & Receive**: Easy crypto transfers with QR code support
- **Transaction History**: Comprehensive transaction log with filters
- **Market Data**: Live market overview with price charts
- **Settings**: Full account management and preferences

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tadiowallet
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
# Company Information
NEXT_PUBLIC_COMPANY_NAME=TadioWallet
NEXT_PUBLIC_TAGLINE=The Future of Digital Finance
NEXT_PUBLIC_SUPPORT_EMAIL=support@tadiowallet.com

# Social Links
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/tadiowallet
NEXT_PUBLIC_DISCORD_URL=https://discord.gg/tadiowallet
NEXT_PUBLIC_TELEGRAM_URL=https://t.me/tadiowallet
NEXT_PUBLIC_GITHUB_URL=https://github.com/tadiowallet

# App Links
NEXT_PUBLIC_APP_STORE_URL=https://apps.apple.com/app/tadiowallet
NEXT_PUBLIC_PLAY_STORE_URL=https://play.google.com/store/apps/details?id=com.tadiowallet
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) for the landing page
6. Navigate to [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the dashboard

## Project Structure

```
src/
├── app/
│   ├── globals.css           # Global styles and Tailwind utilities
│   ├── layout.js             # Root layout with fonts and metadata
│   ├── page.js               # Landing page
│   └── dashboard/
│       ├── layout.js         # Dashboard layout with sidebar
│       ├── page.js           # Dashboard overview
│       ├── portfolio/        # Portfolio page
│       ├── trade/            # Buy/Sell/Swap interface
│       ├── send/             # Send crypto page
│       ├── receive/          # Receive crypto page
│       ├── transactions/     # Transaction history
│       ├── markets/          # Market overview
│       └── settings/         # Account settings
├── components/
│   ├── Navbar.js             # Landing page navigation
│   ├── Hero.js               # Hero section
│   ├── Features.js           # Features section
│   ├── HowItWorks.js         # How it works section
│   ├── Security.js           # Security features
│   ├── Cryptocurrencies.js   # Supported crypto
│   ├── CTA.js                # Call to action
│   ├── Footer.js             # Footer
│   └── dashboard/
│       ├── Sidebar.js        # Dashboard sidebar
│       ├── Header.js         # Dashboard header
│       ├── PortfolioChart.js # Portfolio chart component
│       ├── AssetList.js      # Asset list component
│       ├── QuickActions.js   # Quick action buttons
│       ├── RecentTransactions.js
│       └── MarketOverview.js
└── lib/
    ├── config.js             # Environment configuration
    └── mockData.js           # Mock data for dashboard
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS 3.4
- **Charts**: Recharts
- **Fonts**: Google Fonts (Outfit & Inter)
- **Utilities**: clsx, date-fns
- **Language**: JavaScript

## Dependencies

```json
{
  "next": "14.2.15",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "recharts": "^2.12.7",
  "clsx": "^2.1.1",
  "date-fns": "^3.6.0"
}
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Pages Overview

### Landing Page (/)
- Hero with animated gradient background
- Features showcase (Buy, Sell, Swap, Send, Receive, Stake)
- How it works guide
- Security features
- Supported cryptocurrencies
- Call to action with email signup

### Dashboard (/dashboard)
- **Overview**: Portfolio value, 24h/7d changes, quick actions, charts
- **Portfolio**: Asset allocation pie chart, detailed holdings table
- **Trade**: Buy/Sell/Swap interface with asset selector
- **Send**: Multi-step send flow with address input
- **Receive**: QR code and wallet address display
- **Transactions**: Filterable transaction history with details modal
- **Markets**: Market overview with mini charts and trading links
- **Settings**: Profile, security, notifications, preferences

## Customization

### Changing Colors

Edit `tailwind.config.js` to customize the color palette:

```js
theme: {
  extend: {
    colors: {
      primary: { /* cyan shades */ },
      accent: { /* emerald shades */ },
      dark: { /* slate/navy shades */ },
    }
  }
}
```

### Adding New Dashboard Pages

1. Create a new folder in `src/app/dashboard/`
2. Add a `page.js` file with your component
3. Add navigation link in `src/components/dashboard/Sidebar.js`

## License

MIT License - feel free to use this for your own projects!
