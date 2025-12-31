# 🚀 Admin Panel Quick Reference

## 📍 Access

**URL:** `http://localhost:3000/admin/login`

**Credentials:** Set in `.env` file:
```env
ADMIN_EMAIL=admin@tadiowallet.com
ADMIN_PASSWORD=your_secure_password
```

---

## 🗺️ Navigation

| Page | URL | Purpose |
|------|-----|---------|
| **Dashboard** | `/admin` | System overview & stats |
| **Analytics** | `/admin/analytics` | Charts & data insights |
| **Users** | `/admin/users` | User management |
| **Transactions** | `/admin/transactions` | Transaction monitoring |
| **Portfolios** | `/admin/portfolios` | Holdings overview |
| **Notifications** | `/admin/notifications` | Broadcast & alerts |
| **Activity Logs** | `/admin/logs` | Audit trail |
| **Settings** | `/admin/settings` | System configuration |

---

## ⚡ Quick Actions

### User Management
```
View All Users → /admin/users
Search Users → Use search bar
Suspend User → User detail page → Suspend button
Delete User → User detail page → Delete button
```

### Send Broadcast
```
Notifications → Broadcast button
Fill title, message, type → Send
```

### View Analytics
```
Analytics → View charts
Refresh → Click refresh icon
```

### Check Activity Logs
```
Activity Logs → Filter by type
Search IP or description
```

---

## 📊 Key Features by Page

### Dashboard
- ✅ Total users
- ✅ Transaction volume
- ✅ Portfolio value
- ✅ Recent activity

### Analytics
- ✅ User growth charts
- ✅ Transaction volume trends
- ✅ Asset popularity
- ✅ Portfolio distribution

### Users
- ✅ Search & filter
- ✅ Suspend/activate
- ✅ View portfolios
- ✅ Delete users

### Transactions
- ✅ Filter by type/status/asset
- ✅ View details
- ✅ Track fees

### Portfolios
- ✅ Platform value
- ✅ Top holders
- ✅ Asset summary

### Notifications
- ✅ Broadcast to all users
- ✅ View history
- ✅ Delete read

### Activity Logs
- ✅ Filter by severity
- ✅ Search logs
- ✅ Track actions

### Settings
- ✅ General config
- ✅ Security settings
- ✅ Feature flags
- ✅ Email settings

---

## 🔐 Admin API Methods

```javascript
// Import
import { adminAPI } from '@/lib/adminApi'

// Usage
const stats = await adminAPI.getStats()
const users = await adminAPI.getUsers('page=1&limit=20')
const analytics = await adminAPI.getAnalytics()
const portfolios = await adminAPI.getPortfolios()
const logs = await adminAPI.getActivityLogs()
await adminAPI.createBroadcastNotification({ title, message, type })
```

---

## 🎯 Common Tasks

### Task 1: Find a specific user
```
1. Go to Users page
2. Use search bar (name or email)
3. Click on user row
4. View full profile
```

### Task 2: Monitor recent transactions
```
1. Go to Transactions page
2. Filter by date/type
3. Sort by newest first
4. View transaction details
```

### Task 3: Send platform announcement
```
1. Go to Notifications page
2. Click "Broadcast" button
3. Enter title and message
4. Select type (info/success/warning/error)
5. Click "Send Broadcast"
```

### Task 4: Check system health
```
1. Go to Dashboard
2. View key metrics
3. Check recent activity
4. Go to Analytics for trends
```

### Task 5: Review security events
```
1. Go to Activity Logs
2. Filter by severity: "critical" or "error"
3. Check recent admin actions
4. Review IP addresses
```

---

## 🛠️ Troubleshooting

### Can't login?
- Check `.env` file has correct credentials
- Verify `JWT_SECRET` is set
- Clear browser cache and try again

### Data not loading?
- Check MongoDB connection
- Click refresh button
- Check browser console for errors

### Charts not displaying?
- Ensure recharts is installed: `npm install`
- Check data is available in database
- Refresh the page

---

## 📞 Support

For issues or questions:
- Check documentation files in project root
- Review `COMPREHENSIVE_ADMIN_PANEL_COMPLETE.md`
- Check console for error messages

---

## ✅ Quick Checklist

Before deploying to production:
- [ ] Change default admin password
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Configure email settings
- [ ] Test all features
- [ ] Review activity logs
- [ ] Set up backup system
- [ ] Configure monitoring

---

**Admin Panel Version:** 1.0.0 (Comprehensive)
**Last Updated:** December 2024
**Status:** Production Ready ✅

