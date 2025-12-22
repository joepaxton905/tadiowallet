# Environment Setup Guide

## Required Environment Variables

Create a `.env` file in the root directory of your project with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/tadiowallet

# JWT Secret for Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# JWT Expiration
JWT_EXPIRES_IN=7d

# Admin Panel Credentials
# IMPORTANT: Change these immediately in production!
ADMIN_EMAIL=admin@tadiowallet.com
ADMIN_PASSWORD=change-this-secure-password

# Application Settings
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Important Security Notes

### Admin Credentials

The admin panel uses the following environment variables for authentication:

- `ADMIN_EMAIL`: The email address for admin login
- `ADMIN_PASSWORD`: The password for admin login

**⚠️ CRITICAL SECURITY REQUIREMENTS:**

1. **Change Default Credentials**: Never use the default credentials in production
2. **Strong Password**: Use a password with:
   - At least 12 characters
   - Mix of uppercase and lowercase letters
   - Numbers and special characters
   - No dictionary words
3. **Unique Credentials**: Don't reuse passwords from other systems
4. **Secure Storage**: Never commit the `.env` file to version control
5. **Limited Access**: Only share credentials with authorized administrators

### JWT Secret

The `JWT_SECRET` is used to sign authentication tokens. Requirements:

- Minimum 32 characters
- Random and unpredictable
- Different for each environment (development, staging, production)
- Never shared or committed to version control

**Generate a secure JWT secret:**

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

### MongoDB Connection

For production, use a secure MongoDB connection string:

```env
# Production MongoDB (example)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tadiowallet?retryWrites=true&w=majority
```

Requirements:
- Use strong database passwords
- Enable authentication
- Use connection string with credentials
- Enable SSL/TLS for remote connections
- Restrict IP access where possible

## Environment-Specific Configuration

### Development

```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/tadiowallet
```

### Production

```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/tadiowallet
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-very-strong-production-password
JWT_SECRET=your-production-jwt-secret-from-crypto-random
```

## Setup Steps

1. **Copy environment template**:
   ```bash
   # Create .env file with above content
   ```

2. **Update MongoDB URI**:
   - For local development: Keep the localhost URI
   - For production: Use your MongoDB Atlas or hosted MongoDB URI

3. **Generate and set JWT_SECRET**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy the output to your `.env` file

4. **Set Admin Credentials**:
   - Choose a secure email address
   - Generate or create a strong password
   - Update `ADMIN_EMAIL` and `ADMIN_PASSWORD`

5. **Verify Setup**:
   ```bash
   npm run dev
   ```
   Navigate to `/admin/login` and test admin login

## Accessing the Admin Panel

1. Start your application:
   ```bash
   npm run dev
   ```

2. Open your browser and go to:
   ```
   http://localhost:3000/admin/login
   ```

3. Enter your admin credentials:
   - Email: The value from `ADMIN_EMAIL`
   - Password: The value from `ADMIN_PASSWORD`

4. You'll be redirected to the admin dashboard upon successful login

## Troubleshooting

### "Invalid credentials" error
- Double-check your `.env` file has the correct credentials
- Ensure no extra spaces in the values
- Verify the file is named exactly `.env`
- Restart your development server after changing `.env`

### "Unauthorized" errors
- Check that JWT_SECRET is set
- Verify the admin token hasn't expired (24 hours)
- Try logging out and logging in again
- Clear browser cookies and cache

### Admin panel not loading
- Ensure your development server is running
- Check browser console for errors
- Verify MongoDB connection is working
- Check that all required environment variables are set

## Best Practices

### Development
- Use different credentials for development and production
- Don't share development credentials in documentation
- Test admin features thoroughly before deploying

### Production
- Use environment variable management (AWS Secrets Manager, HashiCorp Vault, etc.)
- Rotate credentials regularly
- Enable audit logging
- Use HTTPS only
- Implement rate limiting on admin endpoints
- Set up monitoring and alerts
- Regular security audits

### Credential Management
- Never commit `.env` files
- Use `.env.local` for local overrides
- Document required variables (without values)
- Use strong, unique passwords
- Enable 2FA where possible (future enhancement)

## Security Checklist

Before deploying to production:

- [ ] Changed default admin email
- [ ] Set strong admin password
- [ ] Generated random JWT_SECRET
- [ ] Secured MongoDB connection
- [ ] Enabled HTTPS
- [ ] Updated NEXT_PUBLIC_APP_URL
- [ ] Verified .env is in .gitignore
- [ ] Tested admin login
- [ ] Configured firewall rules
- [ ] Set up backup procedures
- [ ] Implemented monitoring
- [ ] Documented admin procedures

## Support

If you encounter issues:

1. Check this documentation
2. Verify all environment variables are set correctly
3. Check the console for error messages
4. Review the `ADMIN_PANEL_GUIDE.md` for usage instructions

---

**Important**: Keep this file updated as new environment variables are added to the project.

