# Admin Features Quick Guide

## 🔑 Login as User Feature

### How to Use
1. Navigate to **Admin Panel** → **Users**
2. Click on any user to view their details
3. Look for the **"Login as User"** button (has a key icon 🔑)
4. Click the button
5. Confirm the action in the dialog
6. A new tab will open with the user's dashboard
7. You're now logged in as that user!

### Important Notes
- ✅ Only works for **active** users
- ✅ Disabled button for suspended/deleted users
- ✅ All actions are **logged** for security audits
- ✅ Your admin session stays active in the original tab
- ✅ User session opens in a **new tab**

### Security
- Every login is recorded in **Activity Logs**
- Logs include: timestamp, admin email, user email, IP address
- View logs at: **Admin Panel** → **Activity Logs**

---

## 📱 Mobile Responsive Admin Panel

### Mobile Navigation
1. Open admin panel on your mobile device
2. Look for the **☰ hamburger menu** in the top-right corner
3. Tap it to open the sidebar
4. Navigate to any page
5. Sidebar auto-closes when you select a page

### Features
- ✅ **Hamburger menu** at top for easy access
- ✅ **Swipeable sidebar** with smooth animations
- ✅ **Optimized tables** - scroll horizontally if needed
- ✅ **Responsive cards** and layouts
- ✅ **Touch-friendly buttons** with proper spacing
- ✅ **Compact text** on mobile, full text on desktop

### Quick Tips
- **Close sidebar**: Tap the X button or tap outside the sidebar
- **Scroll tables**: Swipe left/right on tables to see all columns
- **Buttons**: Some button text is shortened on mobile (e.g., "Edit" instead of "Edit Profile")
- **Filters**: Stack vertically on mobile for easy access

---

## 🎯 Common Use Cases

### Customer Support
1. Customer reports an issue
2. Admin logs into admin panel
3. Finds user in **Users** section
4. Clicks **"Login as User"**
5. Sees exactly what the user sees
6. Troubleshoots the issue
7. Returns to admin panel tab

### On-the-Go Management
1. Receive notification on mobile
2. Open admin panel on phone
3. Use hamburger menu to navigate
4. Review user details
5. Make necessary changes
6. Log action is automatically recorded

---

## 📊 Where to Find Things

### Desktop
- **Sidebar**: Always visible on the left
- **Login as User**: User detail page → Top of user info card
- **Activity Logs**: Sidebar → Activity Logs

### Mobile
- **Menu**: Top-right hamburger icon (☰)
- **Login as User**: Same location, responsive button
- **Tables**: Scroll horizontally to see all columns

---

## ⚠️ Troubleshooting

### Login as User Issues

**Button is disabled**
- Check if user status is "active"
- Only active users can be logged into

**New tab doesn't open**
- Allow popups for your admin domain
- Check browser settings

**Not logged in after opening**
- Check browser console for errors
- Try refreshing the page
- Ensure cookies are enabled

### Mobile Issues

**Sidebar won't open**
- Tap the hamburger icon (☰) in top-right
- Refresh the page if needed

**Can't see all columns**
- Scroll the table horizontally (swipe left/right)

**Text too small**
- Zoom in using browser controls
- Use browser's font size settings

---

## 🔐 Best Practices

### Security
1. ✅ Always log out when done
2. ✅ Use "Login as User" only when necessary
3. ✅ Review Activity Logs regularly
4. ✅ Keep admin credentials secure
5. ✅ Don't share admin access

### Mobile Usage
1. ✅ Use WiFi when possible for better performance
2. ✅ Clear browser cache if experiencing issues
3. ✅ Update mobile browser regularly
4. ✅ Use landscape mode for tables
5. ✅ Close sidebar when not needed

---

## 📞 Need Help?

### Check Activity Logs
- **Path**: Admin Panel → Activity Logs
- **Filter by**: `admin_action` to see all "login as user" actions
- **Details**: Shows admin email, target user, timestamp, IP

### Common Questions

**Q: Can users see when I log into their account?**
A: Not directly, but the action is logged in the system.

**Q: Does logging in as a user affect their data?**
A: No, you're just viewing their account. Any changes you make are the same as if they made them.

**Q: Can I use this feature on mobile?**
A: Yes! The button works the same on mobile devices.

**Q: How long does the user session last?**
A: It follows the same expiry rules as normal user sessions (typically 7 days).

**Q: Can I have multiple user sessions open?**
A: Yes, you can open multiple tabs with different user accounts.

---

## 🎉 Tips & Tricks

### Efficiency Tips
- **Bookmark frequently used pages** on mobile
- **Use browser tabs** to keep admin and user sessions separate
- **Check Activity Logs** to track your actions
- **Use landscape mode** on mobile for better table viewing

### Mobile Navigation
- **Double-tap** to zoom on specific sections
- **Swipe** to scroll tables horizontally
- **Tap X or outside** to quickly close sidebar
- **Use browser back button** for navigation

---

## 📋 Quick Reference

| Feature | Desktop | Mobile |
|---------|---------|--------|
| Open Menu | Always visible | Tap ☰ icon |
| Login as User | Click button | Tap button |
| Close Sidebar | N/A (always visible) | Tap X or outside |
| Scroll Table | Mouse wheel | Swipe left/right |
| Action Buttons | Full text | Short text |
| View Logs | Sidebar → Activity Logs | Menu → Activity Logs |

---

## 🚀 Getting Started

### First Time Setup (Mobile)
1. Open admin panel on mobile browser
2. Log in with admin credentials
3. Allow notifications if prompted
4. Bookmark the page for quick access
5. Familiarize yourself with hamburger menu

### First Time Using "Login as User"
1. Go to Users page
2. Click on any active user
3. Find "Login as User" button
4. Read the confirmation dialog
5. Allow popups if prompted
6. Verify you're in the user's dashboard
7. Check Activity Logs to see your action recorded

---

**Need more help?** Check the full documentation in `ADMIN_FEATURES_IMPLEMENTATION.md`

