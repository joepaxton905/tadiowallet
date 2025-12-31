// Admin API utility functions

const API_BASE = '/api/admin'

/**
 * Get admin auth token from storage
 */
function getAdminToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')
}

/**
 * Make authenticated admin API request
 */
async function adminApiRequest(endpoint, options = {}) {
  const token = getAdminToken()
  
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

// Admin Auth API
export const adminAuthAPI = {
  login: (email, password) =>
    fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(res => res.json()),
  
  verify: () => adminApiRequest('/auth/verify'),
}

// Admin Stats API
export const adminStatsAPI = {
  getStats: () => adminApiRequest('/stats'),
}

// Admin Users API
export const adminUsersAPI = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams()
    Object.keys(params).forEach(key => {
      if (params[key]) queryParams.append(key, params[key])
    })
    const queryString = queryParams.toString()
    return adminApiRequest(`/users${queryString ? `?${queryString}` : ''}`)
  },
  
  getById: (userId) => adminApiRequest(`/users/${userId}`),
  
  update: (userId, data) =>
    adminApiRequest(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  updateProfile: (userId, profileData) =>
    adminApiRequest(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ 
        action: 'updateProfile',
        ...profileData 
      }),
    }),
  
  updatePortfolio: (userId, portfolio) =>
    adminApiRequest(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ 
        action: 'updatePortfolio',
        portfolio 
      }),
    }),
  
  updateStats: (userId, stats) =>
    adminApiRequest(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ 
        action: 'updateStats',
        stats 
      }),
    }),
  
  delete: (userId) =>
    adminApiRequest(`/users/${userId}`, {
      method: 'DELETE',
    }),
  
  loginAsUser: (userId) =>
    adminApiRequest(`/users/${userId}/login-as`, {
      method: 'POST',
    }),
}

// Admin Transactions API
export const adminTransactionsAPI = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams()
    Object.keys(params).forEach(key => {
      if (params[key]) queryParams.append(key, params[key])
    })
    const queryString = queryParams.toString()
    return adminApiRequest(`/transactions${queryString ? `?${queryString}` : ''}`)
  },
}

// Admin User Stats API
export const adminUserStatsAPI = {
  getUserStats: (userId) => adminApiRequest(`/stats/user/${userId}`),
  
  recalculateUserStats: (userId) =>
    adminApiRequest(`/stats/user/${userId}`, {
      method: 'POST',
    }),
  
  recalculateAllStats: () =>
    adminApiRequest('/stats/recalculate', {
      method: 'POST',
      body: JSON.stringify({ all: true }),
    }),
}

// Unified Admin API (all methods in one place)
export const adminAPI = {
  // Auth
  ...adminAuthAPI,
  
  // Stats
  getStats: adminStatsAPI.getStats,
  
  // Users
  getUsers: adminUsersAPI.getAll,
  getUser: adminUsersAPI.getById,
  updateUser: adminUsersAPI.update,
  deleteUser: adminUsersAPI.delete,
  
  // Transactions
  getTransactions: adminTransactionsAPI.getAll,
  
  // Analytics
  getAnalytics: () => adminApiRequest('/analytics'),
  
  // Portfolios
  getPortfolios: (queryString = '') => 
    adminApiRequest(`/portfolios${queryString ? `?${queryString}` : ''}`),
  
  // Activity Logs
  getActivityLogs: (queryString = '') => 
    adminApiRequest(`/logs${queryString ? `?${queryString}` : ''}`),
  
  createActivityLog: (logData) =>
    adminApiRequest('/logs', {
      method: 'POST',
      body: JSON.stringify(logData),
    }),
  
  // Notifications
  getNotifications: (queryString = '') => 
    adminApiRequest(`/notifications${queryString ? `?${queryString}` : ''}`),
  
  createBroadcastNotification: (notificationData) =>
    adminApiRequest('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    }),
  
  deleteNotifications: (queryString = '') =>
    adminApiRequest(`/notifications?${queryString}`, {
      method: 'DELETE',
    }),
}

