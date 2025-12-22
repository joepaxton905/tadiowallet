# Admin Panel Guide

## Overview

The TadioWallet Admin Panel provides comprehensive administrative capabilities for managing users, monitoring transactions, and viewing system statistics.

## Setup Instructions

### 1. Environment Variables

Add the following variables to your `.env` file:

```env
# Admin Credentials
ADMIN_EMAIL=admin@tadiowallet.com
ADMIN_PASSWORD=your_secure_admin_password_here

# JWT Secret (if not already set)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Important Security Notes:**
- Change the default admin credentials immediately
- Use a strong, unique password for the admin account
- Never commit the `.env` file to version control
- Keep the admin credentials secure and share only with trusted personnel

### 2. Access the Admin Panel

1. Navigate to `/admin/login` in your browser
2. Enter the admin email and password from your `.env` file
3. You'll be redirected to the admin dashboard upon successful login

## Features

### 🎯 Dashboard
- **System Overview**: Real-time statistics on users, transactions, and portfolio data
- **Key Metrics**:
  - Total users (active, suspended, deleted)
  - Transaction counts and volumes
  - Recent signups and activity
  - Transaction type breakdown
  - Top assets by transaction count
- **Quick Stats**: 7-day and 24-hour activity summaries
- **Visual Analytics**: Transaction distribution charts

### 👥 User Management
- **User List**: Paginated view of all registered users
- **Advanced Filtering**:
  - Search by name or email
  - Filter by status (active, suspended, deleted)
  - Sort by various fields
- **User Actions**:
  - View detailed user information
  - Suspend/activate user accounts
  - Delete users permanently
- **User Details**:
  - Complete profile information
  - Portfolio holdings
  - Transaction history
  - Wallet addresses
  - Activity statistics

### 💳 Transaction Monitoring
- **Transaction List**: Real-time view of all platform transactions
- **Advanced Filtering**:
  - Filter by type (buy, sell, send, receive, swap, stake, unstake)
  - Filter by status (completed, pending, failed, cancelled)
  - Filter by asset (BTC, ETH, etc.)
  - Sort by date or value
- **Transaction Details**:
  - User information
  - Asset details
  - Amount and value
  - Fees
  - Timestamp
  - Status indicators

## Security Features

### 🔒 Authentication
- JWT-based authentication
- Secure token storage
- 24-hour session duration
- "Remember me" option for extended sessions

### 🛡️ Authorization
- Role-based access control
- Admin-only endpoints
- Protected routes with middleware
- Automatic token verification

### 🔐 Data Protection
- Passwords never stored in admin context
- Secure API communication
- Environment-based credentials
- Session management

## API Endpoints

### Authentication
```
POST   /api/admin/auth/login     - Admin login
GET    /api/admin/auth/verify    - Verify admin token
```

### Statistics
```
GET    /api/admin/stats          - Get system-wide statistics
```

### Users
```
GET    /api/admin/users          - Get all users (with pagination/filters)
GET    /api/admin/users/:id      - Get user details
PATCH  /api/admin/users/:id      - Update user (suspend/activate/update)
DELETE /api/admin/users/:id      - Delete user permanently
```

### Transactions
```
GET    /api/admin/transactions   - Get all transactions (with pagination/filters)
```

## Usage Examples

### Viewing System Statistics
1. Log in to the admin panel
2. The dashboard displays real-time statistics
3. Click "Refresh" to update data
4. View transaction breakdowns by type
5. See top assets by transaction count

### Managing Users
1. Navigate to "Users" from the sidebar
2. Use filters to find specific users
3. Click on a user to view detailed information
4. Use action buttons to:
   - Suspend accounts for policy violations
   - Activate previously suspended accounts
   - Delete accounts permanently (with confirmation)

### Monitoring Transactions
1. Navigate to "Transactions" from the sidebar
2. Apply filters to narrow down results:
   - Select transaction type
   - Choose status
   - Enter asset symbol
3. Review transaction details in the table
4. Monitor recent activity in real-time

## Admin Actions

### Suspending a User
1. Go to User Management or User Details page
2. Click "Suspend Account"
3. Confirm the action
4. User receives a notification
5. User cannot access their account until reactivated

### Activating a User
1. Find the suspended user
2. Click "Activate Account"
3. Confirm the action
4. User receives a notification
5. User can log in again

### Deleting a User
1. Go to User Details page
2. Click "Delete User"
3. **Important**: Confirm permanent deletion
4. All user data is permanently removed:
   - User profile
   - Portfolio holdings
   - Transaction history
   - Wallets
   - Notifications

⚠️ **Warning**: User deletion is irreversible!

## Best Practices

### Security
- [ ] Change default admin credentials immediately
- [ ] Use strong, unique passwords
- [ ] Log out when finished
- [ ] Don't share admin credentials
- [ ] Monitor admin access logs
- [ ] Use "Remember me" only on secure devices

### User Management
- [ ] Document reasons for suspensions
- [ ] Give users notice before suspension when possible
- [ ] Review user activity before taking action
- [ ] Double-check before deleting users
- [ ] Communicate with users about account status

### Transaction Monitoring
- [ ] Regularly review failed transactions
- [ ] Monitor for unusual patterns
- [ ] Check pending transactions periodically
- [ ] Investigate high-value transactions
- [ ] Keep records of administrative actions

## Design Features

### Beautiful UI
- **Modern Design**: Glass-morphism effects with gradient accents
- **Responsive Layout**: Works on all screen sizes
- **Smooth Animations**: Transitions and loading states
- **Color-Coded Status**: Visual indicators for quick recognition
- **Intuitive Navigation**: Easy-to-use sidebar and breadcrumbs
- **Professional Aesthetics**: Consistent with main application theme

### Color Scheme
- **Primary**: Red to Orange gradient (admin branding)
- **Success**: Green indicators
- **Warning**: Orange/Yellow alerts
- **Error**: Red notifications
- **Info**: Blue badges
- **Neutral**: Dark theme with glass effects

## Troubleshooting

### Cannot Login
- Verify credentials in `.env` file
- Check that environment variables are loaded
- Ensure JWT_SECRET is set
- Try clearing browser cache and cookies

### Missing Data
- Check database connection
- Verify MongoDB is running
- Ensure collections exist
- Check API endpoint responses

### Authorization Errors
- Confirm admin token is valid
- Check token expiration (24 hours)
- Verify role in JWT payload
- Re-login if necessary

## Support

For technical support or questions about the admin panel:
1. Check this documentation first
2. Review the codebase for implementation details
3. Check browser console for errors
4. Verify environment variables are correctly set

## License

This admin panel is part of the TadioWallet project and follows the same license terms.

---

**Last Updated**: December 2025
**Version**: 1.0.0

