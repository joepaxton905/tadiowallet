# 🚀 DNS Quick Fix - Stop Emails Going to Spam

## ⚡ Critical: Add These 3 DNS Records NOW

### 1. SPF Record (REQUIRED)

Go to your DNS provider and add:

```
Type: TXT
Host: @
Value: v=spf1 include:zoho.com ~all
TTL: 1 hour (or Auto)
```

**What it does:** Authorizes Zoho to send emails for your domain.

---

### 2. DKIM Record (REQUIRED)

**First, get your DKIM from Zoho:**

1. Login: https://mailadmin.zoho.com/
2. Navigate: Email Configuration → DKIM Keys
3. Click "Enable DKIM" (if not enabled)
4. Copy the DKIM TXT record

**Then add to DNS:**

```
Type: TXT
Host: zoho._domainkey
Value: [Paste the DKIM value from Zoho - it's a long string starting with "v=DKIM1;"]
TTL: 1 hour (or Auto)
```

---

### 3. DMARC Record (IMPORTANT)

```
Type: TXT
Host: _dmarc
Value: v=DMARC1; p=none; rua=mailto:admin@yourdomain.com
TTL: 1 hour (or Auto)
```

**Replace `admin@yourdomain.com` with your actual email.**

---

## 🔍 Quick Verification

### Check if DNS is working:

**SPF Check:**
```bash
nslookup -type=txt yourdomain.com
```
Look for: `v=spf1 include:zoho.com ~all`

**DKIM Check:**
```bash
nslookup -type=txt zoho._domainkey.yourdomain.com
```
Look for: `v=DKIM1; k=rsa; p=...`

**Or use online tool:**
https://mxtoolbox.com/SuperTool.aspx

---

## ⏰ Timeline

- Add records: **5-10 minutes**
- DNS propagation: **15 minutes to 48 hours** (usually 1-2 hours)
- Full effect: **24-48 hours**

---

## 🎯 After DNS is Set Up

### Test Your Emails:

1. Go to: https://www.mail-tester.com/
2. Copy the test email address
3. Make a transfer in your app using that email
4. Go back to mail-tester and click "Check Score"
5. **You should get 8-10/10**

---

## ✅ Expected Results

### BEFORE (No DNS):
```
📧 Email Sent
📁 Goes to: SPAM
🔴 SPF: FAIL
🔴 DKIM: FAIL
Score: 3/10
```

### AFTER (With DNS):
```
📧 Email Sent
📥 Goes to: INBOX ✓
✅ SPF: PASS
✅ DKIM: PASS
✅ DMARC: PASS
Score: 9/10
```

---

## 🆘 Quick Troubleshooting

### "SPF failing"
→ Make sure SPF record is added to your ROOT domain (@)

### "DKIM failing"
→ Enable DKIM in Zoho first, then add DNS record
→ Make sure host is exactly: `zoho._domainkey`

### "Still going to spam"
→ Wait 24 hours for DNS to propagate
→ Make sure `EMAIL_FROM` in `.env` matches your verified domain

### "Can't add DNS records"
→ Contact your domain provider (GoDaddy, Namecheap, Cloudflare, etc.)
→ Or send them these exact records to add

---

## 📋 Copy-Paste Template for Your DNS Provider

Send this to your DNS provider support if you need help:

```
Please add the following DNS records to my domain:

Record 1 - SPF:
Type: TXT
Host: @
Value: v=spf1 include:zoho.com ~all

Record 2 - DKIM:
Type: TXT  
Host: zoho._domainkey
Value: [I will provide this from Zoho Mail]

Record 3 - DMARC:
Type: TXT
Host: _dmarc
Value: v=DMARC1; p=none; rua=mailto:admin@mydomain.com
```

---

## 🎉 That's It!

These 3 DNS records will fix 95% of spam folder issues.

**Full guide:** See `EMAIL_SPAM_FIX_GUIDE.md`

---

**Still stuck?** Check your DNS provider's documentation:
- **Cloudflare:** https://developers.cloudflare.com/dns/
- **GoDaddy:** https://www.godaddy.com/help/add-a-txt-record-19232
- **Namecheap:** https://www.namecheap.com/support/knowledgebase/article.aspx/317
- **Google Domains:** https://support.google.com/domains/answer/3290350

