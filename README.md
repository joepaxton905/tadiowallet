# TadioWallet - Crypto Wallet Landing Page

A modern, beautiful landing page for a cryptocurrency wallet built with Next.js 14, Tailwind CSS, and React.

## Features

- **Modern Dark Theme**: Deep navy backgrounds with vibrant cyan-to-emerald gradients
- **Glass-morphism Effects**: Beautiful frosted glass cards with subtle animations
- **Fully Responsive**: Mobile-first design that looks great on all devices
- **Dynamic Configuration**: Company name and details sourced from environment variables
- **Smooth Animations**: CSS-only animations for optimal performance
- **Accessible**: Semantic HTML and proper ARIA labels

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

3. Create a `.env` file in the root directory (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env` file with the following variables:

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

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles and Tailwind utilities
│   ├── layout.js        # Root layout with fonts and metadata
│   └── page.js          # Main landing page
├── components/
│   ├── Navbar.js        # Sticky navigation with glass effect
│   ├── Hero.js          # Hero section with animated visuals
│   ├── Features.js      # Feature cards grid
│   ├── HowItWorks.js    # Step-by-step guide
│   ├── Security.js      # Security features showcase
│   ├── Cryptocurrencies.js # Supported crypto ticker
│   ├── CTA.js           # Call-to-action section
│   └── Footer.js        # Footer with links and socials
└── lib/
    └── config.js        # Central configuration from env
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS 3.4
- **Fonts**: Google Fonts (Outfit & Inter)
- **Language**: JavaScript

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

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

### Adding New Sections

1. Create a new component in `src/components/`
2. Import and add it to `src/app/page.js`
3. Add navigation link in `src/lib/config.js`

## License

MIT License - feel free to use this for your own projects!

