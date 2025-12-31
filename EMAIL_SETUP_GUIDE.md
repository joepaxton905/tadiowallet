# 📧 Email Notifications Setup Guide (Zoho Mail)

## ✅ Email Notifications Implemented!

Email alerts are now sent for all transfer transactions. Both sender and recipient receive beautiful HTML emails.

---

## 🔧 Zoho Mail Configuration

### Step 1: Add to `.env` File

Add these lines to your `.env` or `.env.local` file:

```bash
# Zoho Mail SMTP Configuration
EMAIL_HOST=smtp.zoho.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASSWORD=your-zoho-app-password
EMAIL_FROM=noreply@yourdomain.com

# App URL (for email links)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_COMPANY_NAME=TadioWallet
```

### Step 2: Get Zoho App-Specific Password

**You need an app-specific password, NOT your regular Zoho password!**

1. **Login to Zoho Mail:**
   - Go to: https://mail.zoho.com

2. **Go to Account Settings:**
   - Click your profile icon (top right)
   - Select "My Account"

3. **Navigate to Security:**
   - Go to "Account Security" or "Security" tab
   - Find "App Passwords" or "Application-Specific Passwords"

4. **Generate App Password:**
   - Click "Generate New Password"
   - Name it: "TadioWallet SMTP"
   - Copy the generated password

5. **Use in `.env`:**
   ```bash
   EMAIL_USER=yourname@yourdomain.com
   EMAIL_PASSWORD=generated-app-password-here
   EMAIL_FROM=noreply@yourdomain.com
   ```

---

## 📊 Example `.env` Configuration

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017/tadiowallet

# JWT
JWT_SECRET=your-secret-key-change-this
JWT_EXPIRES_IN=7d

# Zoho Mail (REQUIRED FOR EMAILS)
EMAIL_HOST=smtp.zoho.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=hello@yourdomain.com
EMAIL_PASSWORD=xxxxyourzohoappppasswordxxxx
EMAIL_FROM=noreply@yourdomain.com

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_COMPANY_NAME=TadioWallet
NEXT_PUBLIC_SUPPORT_EMAIL=support@yourdomain.com
```

---

## 🎨 Email Templates

### 1. Transfer Sent Email (Sender)

**Subject:** `Transfer Sent: 0.5 BTC`

**Content:**
- Purple gradient header
- Transaction details (amount, asset, value, fee)
- Recipient info
- "View Transaction" button
- Security notice

### 2. Transfer Received Email (Recipient)

**Subject:** `Transfer Received: 0.5 BTC`

**Content:**
- Green gradient header
- Transaction details (amount shown with + sign)
- Sender info
- "View Balance" button
- Balance update notice

Both emails are:
- ✅ Fully responsive (mobile-friendly)
- ✅ Beautiful HTML design
- ✅ Dark theme matching your app
- ✅ Include plain text fallback
- ✅ Company branding

---

## 🚀 How It Works

### When a Transfer Happens:

```
1. User sends 0.5 BTC to another user
   ↓
2. Transfer completes in database
   ↓
3. Two emails sent automatically:
   
   📧 Sender Email:
   - To: alice@test.com
   - Subject: "Transfer Sent: 0.5 BTC"
   - Content: Transaction details
   
   📧 Recipient Email:
   - To: bob@test.com
   - Subject: "Transfer Received: 0.5 BTC"
   - Content: Transfer details
```

### Email Sending is Non-Blocking:
- Transfer completes immediately
- Emails sent in background
- If email fails, transfer still succeeds
- Errors logged to console

---

## 🧪 Testing Email Setup

### Method 1: Quick Test

1. **Configure `.env` with your Zoho credentials**

2. **Restart dev server:**
   ```bash
   npm run dev
   ```

3. **Make a transfer:**
   - Login as test user
   - Send crypto to another user
   - Check both email inboxes

### Method 2: Check Console Logs

When emails are configured:
```
✅ Email server is ready to send messages
✅ Email sent successfully: <message-id>
```

When emails are NOT configured:
```
⚠️ Email credentials not configured. Emails will be logged to console only.
📧 [EMAIL - Not Sent] { to: 'user@example.com', subject: '...' }
```

---

## 🔒 Security Best Practices

### 1. Use App-Specific Password
- ✅ Never use your main Zoho password
- ✅ Generate app-specific password
- ✅ Store in `.env` (never commit!)

### 2. Email Configuration
```bash
# SECURE (Port 465 with SSL)
EMAIL_PORT=465
EMAIL_SECURE=true

# OR use TLS (Port 587)
EMAIL_PORT=587
EMAIL_SECURE=false
```

### 3. Environment Variables
- Keep `.env` in `.gitignore`
- Never commit credentials
- Use different credentials for dev/prod

---

## 🛠️ Troubleshooting

### Issue: "Authentication failed"

**Causes:**
- Wrong password
- Using regular password instead of app password
- Wrong email address

**Fix:**
1. Generate new app-specific password
2. Copy it exactly (no spaces)
3. Update `.env` file
4. Restart server

### Issue: "Connection timeout"

**Causes:**
- Wrong port number
- Firewall blocking SMTP
- ISP blocking port 465

**Fix:**
Try alternate configuration:
```bash
EMAIL_HOST=smtp.zoho.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

### Issue: Emails not sending but no error

**Causes:**
- Email credentials not configured
- Environment variables not loaded

**Fix:**
1. Check `.env` file exists
2. Check variables are set correctly
3. Restart dev server
4. Check console for warnings

### Issue: Emails going to spam

**Causes:**
- SPF/DKIM not configured
- Sender domain not verified

**Fix:**
1. Verify your domain in Zoho
2. Add SPF record to DNS
3. Add DKIM record to DNS
4. Use verified sender address

---

## 📝 Zoho Mail SMTP Settings

### Standard Configuration:

| Setting | Value |
|---------|-------|
| **Host** | smtp.zoho.com |
| **Port (SSL)** | 465 |
| **Port (TLS)** | 587 |
| **Security** | SSL/TLS |
| **Authentication** | Required |
| **Username** | Your Zoho email |
| **Password** | App-specific password |

### Zoho Mail Regions:

Different regions use different SMTP servers:

| Region | SMTP Host |
|--------|-----------|
| **US** | smtp.zoho.com |
| **EU** | smtp.zoho.eu |
| **India** | smtp.zoho.in |
| **Australia** | smtp.zoho.com.au |
| **China** | smtp.zoho.com.cn |

---

## 🎯 Production Setup

### For Production Deployment:

1. **Use Production Email:**
   ```bash
   EMAIL_USER=noreply@yourdomain.com
   EMAIL_FROM=noreply@yourdomain.com
   ```

2. **Verify Domain:**
   - Add your domain to Zoho
   - Verify ownership
   - Configure SPF/DKIM

3. **Update App URL:**
   ```bash
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

4. **Test Thoroughly:**
   - Send test transfers
   - Check email delivery
   - Verify links work
   - Test on mobile

---

## 📦 Files Modified

### New Files:
1. **`src/lib/email.js`**
   - Email service
   - Zoho SMTP configuration
   - Email templates (HTML + text)
   - `sendTransferSentEmail()`
   - `sendTransferReceivedEmail()`

### Modified Files:
1. **`package.json`**
   - Added: `nodemailer@^6.9.7`

2. **`src/app/api/transactions/transfer/route.js`**
   - Imported email functions
   - Send emails after transfer commits
   - Non-blocking email sending
   - Error handling

---

## ✅ What You Get

### For Senders:
- ✅ Instant email confirmation
- ✅ Transaction details
- ✅ Recipient information
- ✅ Fee breakdown
- ✅ Link to transaction history

### For Recipients:
- ✅ Instant notification
- ✅ Amount received
- ✅ Sender information
- ✅ Link to dashboard
- ✅ Balance update notice

### For You:
- ✅ Professional email system
- ✅ Automated notifications
- ✅ Beautiful HTML templates
- ✅ Non-blocking performance
- ✅ Error handling
- ✅ Production-ready

---

## 🚀 Installation

**1. Install dependencies:**
```bash
npm install
```

**2. Configure `.env`:**
```bash
# Add Zoho Mail settings (see above)
```

**3. Restart server:**
```bash
npm run dev
```

**4. Test transfer:**
- Send crypto between users
- Check email inboxes
- Verify emails received

---

## 📧 Email Preview

### Sender Email (Purple Theme):
```
┌────────────────────────────────────┐
│   Transfer Sent                    │
│   TadioWallet                      │
├────────────────────────────────────┤
│                                    │
│   Hi Alice,                        │
│                                    │
│   Your transfer has been           │
│   completed successfully!          │
│                                    │
│   Amount:     0.5 BTC              │
│   Asset:      Bitcoin              │
│   USD Value:  $21,625.00           │
│   Fee:        $21.63               │
│   Recipient:  Bob Receiver         │
│                                    │
│   [View Transaction]               │
│                                    │
└────────────────────────────────────┘
```

### Recipient Email (Green Theme):
```
┌────────────────────────────────────┐
│   Transfer Received                │
│   TadioWallet                      │
├────────────────────────────────────┤
│                                    │
│   Hi Bob,                          │
│                                    │
│   You've received a new transfer! 🎉│
│                                    │
│   Amount:     +0.5 BTC             │
│   Asset:      Bitcoin              │
│   USD Value:  $21,625.00           │
│   From:       Alice Sender         │
│                                    │
│   [View Balance]                   │
│                                    │
└────────────────────────────────────┘
```

---

## 🎉 Ready!

Email notifications are **fully implemented and ready to use!**

Just configure your Zoho credentials and emails will start sending automatically with every transfer. 🚀

---

**Need Help?**
- Check console logs for email status
- Verify Zoho app password is correct
- Make sure `.env` file is loaded
- Restart server after configuration changes

