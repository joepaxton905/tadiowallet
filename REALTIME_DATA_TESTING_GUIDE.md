# Real-Time Data Testing Guide

This guide provides step-by-step instructions to test and verify that real-time data fetching is working correctly across both user and admin dashboards.

## Prerequisites

1. Application is running (`npm run dev`)
2. MongoDB is connected and accessible
3. At least one test user account exists
4. Admin account credentials available

## Test Scenarios

### Test 1: User Profile Data Real-Time Update

**Objective**: Verify that user profile changes made by admin are reflected in user dashboard within 30 seconds.

**Steps**:
1. **Open User Dashboard**:
   - Login as a regular user
   - Navigate to `/dashboard`
   - Note the displayed user name in the header
   - Keep this browser window open

2. **Open Admin Panel (in a different browser/incognito)**:
   - Login as admin
   - Navigate to `/admin/users`
   - Find the test user in the list
   - Click to view user details
   - Click "Edit Profile"
   - Change first name or last name
   - Save changes

3. **Verify in User Dashboard**:
   - Switch back to user dashboard window
   - Wait up to 30 seconds (do not manually refresh)
   - The user name in the header should update automatically

**Expected Result**: ✅ User name updates within 30 seconds without manual refresh

**Troubleshooting**:
- If name doesn't update, check browser console for errors
- Verify `/api/user/profile` is being called every 30 seconds
- Check that the API response contains updated data

---

### Test 2: Portfolio Balance Real-Time Sync

**Objective**: Verify that portfolio changes made by admin are reflected in user dashboard.

**Steps**:
1. **Open User Dashboard**:
   - Login as a regular user
   - Navigate to `/dashboard`
   - Note the current portfolio value and holdings
   - Keep window open

2. **Open Admin Panel**:
   - Login as admin
   - Navigate to `/admin/users`
   - Click on the test user
   - Click "Edit Balance"
   - Add or modify a cryptocurrency holding (e.g., add 100 BTC)
   - Save changes

3. **Verify in User Dashboard**:
   - Switch back to user dashboard
   - Wait up to 30 seconds
   - Portfolio value and asset list should update automatically

**Expected Result**: ✅ Portfolio updates within 30 seconds

---

### Test 3: User Statistics Real-Time Calculation

**Objective**: Verify that UserStats are calculated in real-time without caching.

**Steps**:
1. **Check Initial Stats**:
   - Login as admin
   - Navigate to a user detail page
   - Note the current statistics (Portfolio Value, Total Invested, P&L)
   - Note the timestamp shown for "Stats updated"

2. **Make Changes via Admin**:
   - Click "Edit Balance"
   - Add a new asset or modify existing holdings
   - Save changes

3. **Verify Stats Recalculation**:
   - Stats should update immediately on the same page
   - Click "Recalculate Stats" button
   - Verify stats update with new timestamp
   - Navigate away and come back - stats should still be fresh (no 1-hour cache)

**Expected Result**: ✅ Stats always reflect latest database state

---

### Test 4: Admin Dashboard Auto-Refresh

**Objective**: Verify admin dashboard statistics refresh automatically.

**Steps**:
1. **Open Admin Dashboard**:
   - Login as admin
   - Navigate to `/admin`
   - Note the current statistics (Total Users, Total Transactions, etc.)
   - Keep browser console open

2. **Monitor Auto-Refresh**:
   - Watch the Network tab in browser DevTools
   - Look for calls to `/api/admin/stats` every 30 seconds
   - Note the response contains fresh data

3. **Trigger a Change**:
   - In another window, create a new user or transaction
   - Switch back to admin dashboard
   - Wait up to 30 seconds
   - Stats should update automatically

**Expected Result**: ✅ Admin stats refresh every 30 seconds

---

### Test 5: Multiple Browser Windows Consistency

**Objective**: Verify data consistency across multiple browser windows.

**Steps**:
1. **Open Multiple Windows**:
   - Window 1: User dashboard (logged in as user)
   - Window 2: Admin dashboard (logged in as admin)
   - Window 3: Same user's profile in admin panel

2. **Make a Change**:
   - In Window 3 (admin user detail), edit the user's portfolio
   - Save changes

3. **Verify All Windows Update**:
   - Wait up to 30 seconds
   - Window 1: User dashboard should show new portfolio
   - Window 2: Admin stats should reflect change (if it affects totals)
   - Window 3: User detail should show updated data

**Expected Result**: ✅ All windows show consistent data within 30 seconds

---

### Test 6: Database Direct Update Detection

**Objective**: Verify changes made directly to database are picked up.

**Steps**:
1. **Open Dashboards**:
   - Open user dashboard for a specific user
   - Open admin dashboard showing that user

2. **Update Database Directly**:
   ```javascript
   // Using MongoDB shell or script
   db.users.updateOne(
     { email: "test@example.com" },
     { $set: { firstName: "UpdatedName" } }
   )
   ```

3. **Verify Detection**:
   - Wait up to 30 seconds
   - Both dashboards should show "UpdatedName"
   - No manual refresh required

**Expected Result**: ✅ Database changes detected automatically

---

### Test 7: Portfolio After Transaction

**Objective**: Verify portfolio updates after creating a transaction.

**Steps**:
1. **Check Initial State**:
   - Login as user
   - Navigate to `/dashboard`
   - Note current portfolio holdings and values

2. **Create Transaction**:
   - Navigate to `/dashboard/send` or use another method to create transaction
   - Complete a send/buy/sell transaction
   - Transaction should be created in database

3. **Verify Updates**:
   - Return to dashboard
   - Wait up to 30 seconds
   - Portfolio should reflect the transaction
   - Stats should be recalculated

**Expected Result**: ✅ Portfolio and stats update after transaction

---

### Test 8: Performance Under Load

**Objective**: Verify system performs well with multiple users refreshing.

**Steps**:
1. **Open Multiple User Sessions**:
   - Open 5-10 browser windows with different users
   - All logged into their dashboards

2. **Monitor Server**:
   - Watch server logs
   - Monitor database query performance
   - Check for any errors or slowdowns

3. **Verify Smooth Operation**:
   - All windows should refresh every 30 seconds
   - No lag or errors
   - Server should handle the load gracefully

**Expected Result**: ✅ System handles multiple concurrent users smoothly

---

## Automated Testing Scripts

### Test API Endpoint Freshness

Create a script to verify API returns fresh data:

```javascript
// test-freshness.js
async function testFreshness() {
  const token = 'YOUR_AUTH_TOKEN'
  
  // Call API twice
  const call1 = await fetch('http://localhost:3000/api/user/stats', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  const data1 = await call1.json()
  
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const call2 = await fetch('http://localhost:3000/api/user/stats', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  const data2 = await call2.json()
  
  console.log('Call 1 timestamp:', data1.stats.lastCalculated)
  console.log('Call 2 timestamp:', data2.stats.lastCalculated)
  console.log('Timestamps differ:', data1.stats.lastCalculated !== data2.stats.lastCalculated)
}

testFreshness()
```

### Monitor Refresh Intervals

Add this to your browser console to monitor refresh timing:

```javascript
// Monitor Network Requests
let lastRefresh = Date.now()
const originalFetch = window.fetch
window.fetch = function(...args) {
  const url = args[0]
  if (url.includes('/api/user/profile') || url.includes('/api/portfolio')) {
    const now = Date.now()
    const elapsed = now - lastRefresh
    console.log(`🔄 Refresh: ${url} (${elapsed}ms since last)`)
    lastRefresh = now
  }
  return originalFetch.apply(this, args)
}
console.log('Monitoring active - watch for refresh calls')
```

---

## Common Issues and Solutions

### Issue 1: Data Not Updating

**Symptoms**: Changes in admin don't appear in user dashboard

**Possible Causes**:
- JavaScript interval not running
- API returning cached data
- Network errors

**Solutions**:
1. Check browser console for errors
2. Verify `/api/user/profile` is being called (Network tab)
3. Check that API has `dynamic = 'force-dynamic'`
4. Ensure no browser extensions are blocking requests

---

### Issue 2: Updates Too Slow

**Symptoms**: Takes longer than 30 seconds to update

**Possible Causes**:
- Interval not set correctly
- Database query slow
- Network latency

**Solutions**:
1. Check interval timing in code (should be 30000ms)
2. Monitor database query performance
3. Check network latency
4. Consider reducing interval if acceptable

---

### Issue 3: Too Many Requests

**Symptoms**: Server overloaded, database queries piling up

**Possible Causes**:
- Too many users
- Interval too short
- Inefficient queries

**Solutions**:
1. Increase interval duration (e.g., 60 seconds)
2. Optimize database queries with better indexes
3. Implement request throttling
4. Consider WebSocket for real-time updates instead

---

## Verification Checklist

After testing, verify:

- [ ] User profile updates appear within 30 seconds
- [ ] Portfolio changes sync across dashboards
- [ ] Statistics are always fresh (no 1-hour cache)
- [ ] Admin dashboard auto-refreshes every 30 seconds
- [ ] User dashboard auto-refreshes every 30 seconds
- [ ] Multiple windows show consistent data
- [ ] Database changes are detected automatically
- [ ] No errors in browser console
- [ ] No errors in server logs
- [ ] Acceptable server performance under load

---

## Success Criteria

✅ **All tests pass** if:
1. Data updates within 30 seconds without manual refresh
2. Both admin and user dashboards show consistent information
3. No caching issues (data always fresh from database)
4. System performance remains acceptable
5. No errors in console or logs

---

## Additional Notes

### Development vs Production

In development:
- Refresh interval: 30 seconds
- `dynamic = 'force-dynamic'` on all API routes
- No caching layers

In production, consider:
- Adjusting interval based on load
- Adding Redis cache with short TTL
- Implementing WebSocket for instant updates
- Monitoring and alerting for performance

### Monitoring Recommendations

Set up monitoring for:
1. API response times (should be < 500ms)
2. Database query performance
3. Number of concurrent refresh requests
4. Error rates on refresh endpoints
5. User experience metrics (time to fresh data)

---

## Contact

If issues persist after following this guide:
1. Check server logs for detailed error messages
2. Review browser console for client-side errors
3. Verify MongoDB connection and query performance
4. Check that all code changes were applied correctly
