# 📧 Email Notifications - QUICK SETUP

## ✅ What's Done

Email notifications are **fully implemented**! Both sender and recipient get beautiful HTML emails for every transfer.

---

## 🚀 Quick Setup (2 Minutes)

### Step 1: Install nodemailer

```bash
npm install
```

### Step 2: Get Zoho App Password

1. Go to: https://accounts.zoho.com/home#security/application-specific-passwords
2. Click "Generate New Password"
3. Name it: "TadioWallet"
4. Copy the password

### Step 3: Add to `.env` File

Create or update your `.env` or `.env.local` file:

```bash
# Zoho Mail Configuration
EMAIL_HOST=smtp.zoho.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASSWORD=your-app-password-from-step-2
EMAIL_FROM=noreply@yourdomain.com

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Replace:**
- `your-email@yourdomain.com` → Your Zoho email
- `your-app-password-from-step-2` → The password you just generated

### Step 4: Restart Server

```bash
npm run dev
```

### Step 5: Test!

1. Make a transfer between two users
2. Check both email inboxes
3. Should see beautiful transfer emails ✓

---

## 📧 Email Examples

### Sender Gets:
```
Subject: Transfer Sent: 0.5 BTC

✓ Purple-themed email
✓ Transaction details
✓ Recipient info
✓ "View Transaction" button
```

### Recipient Gets:
```
Subject: Transfer Received: 0.5 BTC

✓ Green-themed email
✓ Amount with + sign
✓ Sender info
✓ "View Balance" button
```

---

## ⚠️ Important Notes

### Use App-Specific Password!
**NOT your regular Zoho password!**

Generate it here:
- Settings → Security → App Passwords

### If Emails Don't Send:
Check console output:
```
✅ Email server is ready to send messages  ← Working!
⚠️ Email credentials not configured         ← Not configured
```

### Port 465 Blocked?
Try alternate config in `.env`:
```bash
EMAIL_PORT=587
EMAIL_SECURE=false
```

---

## 🔒 Security

- ✅ App password (not main password)
- ✅ Stored in `.env` (gitignored)
- ✅ Non-blocking (won't slow transfers)
- ✅ Error handling (transfers work even if email fails)

---

## 📁 What Was Changed

### New Files:
- `src/lib/email.js` - Email service with templates

### Modified Files:
- `package.json` - Added nodemailer
- `src/app/api/transactions/transfer/route.js` - Send emails on transfer

### No Breaking Changes:
- Transfers work even if email not configured
- Emails log to console if SMTP not set up
- Non-blocking (emails sent in background)

---

## ✅ Testing Checklist

- [ ] Added Zoho credentials to `.env`
- [ ] Ran `npm install`
- [ ] Restarted server
- [ ] Made test transfer
- [ ] Sender received email
- [ ] Recipient received email
- [ ] Emails look good on mobile
- [ ] Links work correctly

---

## 🎉 Done!

Emails are now automatically sent for every transfer transaction!

**Full documentation:** `EMAIL_SETUP_GUIDE.md`

---

**Need Help?**

Common issues:
1. **"Authentication failed"** → Check app password
2. **"Connection timeout"** → Try port 587
3. **"No emails"** → Check `.env` file exists and is loaded
4. **"Emails in spam"** → Normal for development, configure SPF/DKIM for production

**Working?** You should see in console:
```
✅ Email server is ready to send messages
✅ Email sent successfully: <message-id>
```

