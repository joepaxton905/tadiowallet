// API utility functions for making authenticated requests

const API_BASE = '/api'

/**
 * Get auth token from storage
 */
function getAuthToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
}

/**
 * Make authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken()
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const config = {
    ...options,
    headers,
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, config)
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'API request failed')
  }
  
  return data
}

// Portfolio API
export const portfolioAPI = {
  get: () => apiRequest('/portfolio'),
  
  update: (symbol, holdings, averageBuyPrice) =>
    apiRequest('/portfolio', {
      method: 'POST',
      body: JSON.stringify({ symbol, holdings, averageBuyPrice }),
    }),
  
  add: (symbol, amount, price) =>
    apiRequest('/portfolio', {
      method: 'PATCH',
      body: JSON.stringify({ symbol, amount, price, action: 'add' }),
    }),
  
  subtract: (symbol, amount) =>
    apiRequest('/portfolio', {
      method: 'PATCH',
      body: JSON.stringify({ symbol, amount, action: 'subtract' }),
    }),
}

// Transactions API
export const transactionsAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.type) params.append('type', filters.type)
    if (filters.asset) params.append('asset', filters.asset)
    if (filters.status) params.append('status', filters.status)
    if (filters.limit) params.append('limit', filters.limit.toString())
    
    const queryString = params.toString()
    return apiRequest(`/transactions${queryString ? `?${queryString}` : ''}`)
  },
  
  getStats: () => apiRequest('/transactions/stats'),
  
  create: (transactionData) =>
    apiRequest('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    }),
  
  transfer: (recipientAddress, asset, amount, notes = '', price = 0) =>
    apiRequest('/transactions/transfer', {
      method: 'POST',
      body: JSON.stringify({ recipientAddress, asset, amount, notes, price }),
    }),
  
  validateRecipient: (address, asset) =>
    apiRequest(`/transactions/transfer?address=${encodeURIComponent(address)}&asset=${asset}`),
}

// Wallets API
export const walletsAPI = {
  getAll: () => apiRequest('/wallets'),
  
  getBySymbol: (symbol) =>
    apiRequest(`/wallets?symbol=${symbol}`),
  
  createOrUpdate: (symbol, address, label) =>
    apiRequest('/wallets', {
      method: 'POST',
      body: JSON.stringify({ symbol, address, label }),
    }),
}

// Notifications API
export const notificationsAPI = {
  getAll: (limit = 50) =>
    apiRequest(`/notifications?limit=${limit}`),
  
  create: (type, title, message, metadata = {}) =>
    apiRequest('/notifications', {
      method: 'POST',
      body: JSON.stringify({ type, title, message, metadata }),
    }),
  
  markAsRead: (notificationId) =>
    apiRequest('/notifications', {
      method: 'PATCH',
      body: JSON.stringify({ notificationId }),
    }),
  
  markAllAsRead: () =>
    apiRequest('/notifications', {
      method: 'PATCH',
      body: JSON.stringify({ markAllAsRead: true }),
    }),
}

// User API
export const userAPI = {
  getProfile: () => apiRequest('/user/profile'),
  
  updateProfile: (profileData) =>
    apiRequest('/user/profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    }),
  
  getStats: () => apiRequest('/user/stats'),
}

