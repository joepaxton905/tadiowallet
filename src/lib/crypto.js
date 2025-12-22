// Cryptocurrency price service using CoinGecko API (free, no API key required)

const COINGECKO_API = 'https://api.coingecko.com/api/v3'

// Map of our symbols to CoinGecko IDs
const COIN_IDS = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  USDT: 'tether',
  SOL: 'solana',
  XRP: 'ripple',
  BNB: 'binancecoin',
  ADA: 'cardano',
  MATIC: 'matic-network',
  AVAX: 'avalanche-2',
  LINK: 'chainlink',
  DOT: 'polkadot',
  DOGE: 'dogecoin',
  ATOM: 'cosmos',
  UNI: 'uniswap',
  AAVE: 'aave',
  LTC: 'litecoin',
}

// Coin metadata (icons, colors)
export const COIN_META = {
  BTC: { name: 'Bitcoin', icon: '₿', color: '#F7931A' },
  ETH: { name: 'Ethereum', icon: 'Ξ', color: '#627EEA' },
  USDT: { name: 'Tether', icon: '₮', color: '#26A17B' },
  SOL: { name: 'Solana', icon: '◎', color: '#9945FF' },
  XRP: { name: 'Ripple', icon: '✕', color: '#23292F' },
  BNB: { name: 'BNB', icon: '◆', color: '#F3BA2F' },
  ADA: { name: 'Cardano', icon: '₳', color: '#0033AD' },
  MATIC: { name: 'Polygon', icon: '⬡', color: '#8247E5' },
  AVAX: { name: 'Avalanche', icon: '◆', color: '#E84142' },
  LINK: { name: 'Chainlink', icon: '⬢', color: '#2A5ADA' },
  DOT: { name: 'Polkadot', icon: '●', color: '#E6007A' },
  DOGE: { name: 'Dogecoin', icon: 'Ð', color: '#C2A633' },
  ATOM: { name: 'Cosmos', icon: '⚛', color: '#2E3148' },
  UNI: { name: 'Uniswap', icon: '🦄', color: '#FF007A' },
  AAVE: { name: 'Aave', icon: '👻', color: '#B6509E' },
  LTC: { name: 'Litecoin', icon: 'Ł', color: '#BFBBBB' },
}

// Cache for API responses
let priceCache = {
  data: null,
  timestamp: 0,
}

const CACHE_DURATION = 30000 // 30 seconds

/**
 * Fetch market data for multiple coins
 * Returns price, 24h change, market cap, volume
 */
export async function getMarketData(symbols = Object.keys(COIN_IDS)) {
  const now = Date.now()
  
  // Return cached data if still valid
  if (priceCache.data && now - priceCache.timestamp < CACHE_DURATION) {
    return filterBySymbols(priceCache.data, symbols)
  }

  try {
    const ids = Object.values(COIN_IDS).join(',')
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false&price_change_percentage=24h,7d`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch market data')
    }
    
    const data = await response.json()
    
    // Transform to our format
    const transformed = data.map(coin => {
      const symbol = Object.keys(COIN_IDS).find(s => COIN_IDS[s] === coin.id)
      const meta = COIN_META[symbol] || {}
      
      return {
        id: coin.id,
        symbol: symbol || coin.symbol.toUpperCase(),
        name: coin.name,
        icon: meta.icon || '●',
        color: meta.color || '#888888',
        price: coin.current_price,
        priceChange24h: coin.price_change_percentage_24h || 0,
        priceChange7d: coin.price_change_percentage_7d_in_currency || 0,
        marketCap: coin.market_cap,
        volume: coin.total_volume,
        image: coin.image,
      }
    })
    
    // Update cache
    priceCache = {
      data: transformed,
      timestamp: now,
    }
    
    return filterBySymbols(transformed, symbols)
  } catch (error) {
    console.error('Error fetching market data:', error)
    // Return cached data if available, even if stale
    if (priceCache.data) {
      return filterBySymbols(priceCache.data, symbols)
    }
    return getFallbackData(symbols)
  }
}

/**
 * Get simple price data (faster, lighter)
 */
export async function getSimplePrices(symbols = ['BTC', 'ETH', 'SOL']) {
  try {
    const ids = symbols.map(s => COIN_IDS[s]).filter(Boolean).join(',')
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch prices')
    }
    
    const data = await response.json()
    
    return symbols.map(symbol => {
      const id = COIN_IDS[symbol]
      const coinData = data[id]
      const meta = COIN_META[symbol] || {}
      
      return {
        symbol,
        name: meta.name || symbol,
        icon: meta.icon || '●',
        color: meta.color || '#888888',
        price: coinData?.usd || 0,
        priceChange24h: coinData?.usd_24h_change || 0,
      }
    })
  } catch (error) {
    console.error('Error fetching simple prices:', error)
    return getFallbackData(symbols)
  }
}

/**
 * Format price for display
 */
export function formatPrice(price) {
  if (price == null || isNaN(price)) {
    return '0.00'
  }
  if (price >= 1000) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  } else if (price >= 1) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
  } else {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })
  }
}

/**
 * Format large numbers (market cap, volume)
 */
export function formatLargeNumber(num) {
  if (num == null || isNaN(num)) {
    return '$0'
  }
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
  return `$${num.toLocaleString()}`
}

/**
 * Filter data by symbols
 */
function filterBySymbols(data, symbols) {
  if (!symbols || symbols.length === 0) return data
  return data.filter(coin => symbols.includes(coin.symbol))
}

/**
 * Fallback data when API fails
 */
function getFallbackData(symbols) {
  return symbols.map(symbol => {
    const meta = COIN_META[symbol] || {}
    return {
      symbol,
      name: meta.name || symbol,
      icon: meta.icon || '●',
      color: meta.color || '#888888',
      price: 0,
      priceChange24h: 0,
      priceChange7d: 0,
      marketCap: 0,
      volume: 0,
    }
  })
}

export default {
  getMarketData,
  getSimplePrices,
  formatPrice,
  formatLargeNumber,
  COIN_META,
  COIN_IDS,
}

