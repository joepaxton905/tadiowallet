import UserStats from '@/models/UserStats'

/**
 * Update user statistics after a transaction or portfolio change
 * This function should be called after any operation that affects user's portfolio or transactions
 * 
 * @param {string} userId - The user ID to update stats for
 * @returns {Promise<Object>} Updated stats
 */
export async function updateUserStats(userId) {
  try {
    const stats = await UserStats.calculateUserStats(userId)
    return stats
  } catch (error) {
    console.error('Error updating user stats:', error)
    // Don't throw - stats update should not break the main operation
    return null
  }
}

/**
 * Queue a stats update for later (non-blocking)
 * Useful when you don't want to wait for stats calculation
 * 
 * @param {string} userId - The user ID to update stats for
 */
export function queueStatsUpdate(userId) {
  // Run in background without blocking
  setImmediate(async () => {
    try {
      await UserStats.calculateUserStats(userId)
    } catch (error) {
      console.error('Error in queued stats update:', error)
    }
  })
}

export default updateUserStats

