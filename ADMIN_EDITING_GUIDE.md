# Admin User Editing Guide

## Overview

The admin panel now includes comprehensive editing capabilities for all aspects of user profiles, including personal information, portfolio balances, and account settings.

---

## ✨ What Can Be Edited

### 1. User Profile Information
- First Name
- Last Name
- Email Address
- Account Status (Active, Suspended, Deleted)
- KYC Status (None, Pending, Verified, Rejected)
- User Role (User, Admin)

### 2. Portfolio & Balances
- Add new assets to portfolio
- Edit existing asset holdings
- Modify average buy prices
- Remove assets from portfolio
- View real-time total portfolio value

### 3. Calculated Metrics (Auto-calculated)
- Total Portfolio Value
- Total Invested Amount
- Profit/Loss (PnL)
- PnL Percentage
- Transaction counts

---

## 📝 How to Edit User Profiles

### Step 1: Navigate to User Details

1. Go to **Admin Panel** → **Users**
2. Find the user you want to edit
3. Click the **eye icon** or click on the user row
4. You'll see the detailed user page

### Step 2: Edit Profile Information

1. Click the **"Edit Profile"** button (blue button with pencil icon)
2. A modal will appear with editable fields:
   - **First Name**: User's first name
   - **Last Name**: User's last name
   - **Email**: User's email address (must be unique)
   - **Account Status**: Active, Suspended, or Deleted
   - **KYC Status**: Verification status
   - **User Role**: User or Admin
3. Make your changes
4. Click **"Save Changes"**
5. The user will receive a notification about the profile update

### Important Notes:
- ✅ Email addresses must be unique across all users
- ✅ Changes are saved immediately
- ✅ User receives an automatic notification
- ⚠️ Changing email doesn't require re-verification (admin override)

---

## 💰 How to Edit Portfolio Balances

### Step 1: Open Portfolio Editor

1. On the user detail page, scroll to the **Portfolio** section
2. Click the **"Edit Balance"** button (cyan button with pencil icon)
3. The portfolio editor modal will open

### Step 2: Edit Existing Holdings

For each asset in the portfolio, you can edit:

1. **Asset Symbol**: The cryptocurrency symbol (e.g., BTC, ETH)
2. **Holdings**: The amount of the asset the user owns
3. **Average Buy Price**: The average price at which the user acquired the asset

**To modify an existing holding:**
- Simply change the values in the input fields
- The total value updates automatically
- Click the **trash icon** to remove an asset completely

### Step 3: Add New Assets

1. Click the **"Add Asset"** button (green button with plus icon)
2. A new form will appear with three fields:
   - **Symbol**: Enter the asset symbol (e.g., SOL, ADA)
   - **Holdings**: Enter the amount
   - **Avg Price**: Enter the average buy price
3. Click the **checkmark** to add the asset
4. Click **"Cancel"** to discard

### Step 4: Save Changes

1. Review all changes in the modal
2. Check the total portfolio value at the top
3. Click **"Save Portfolio Changes"**
4. The user will receive a notification about the adjustment

### Important Warnings:

⚠️ **Critical Information:**
- Portfolio edits directly affect the user's balance
- **No transaction records are created** for manual adjustments
- This is for corrections and adjustments only
- Use responsibly - changes are immediate
- User receives a notification about the adjustment

---

## 📊 Understanding PnL (Profit & Loss)

The admin panel automatically calculates and displays PnL metrics:

### What is PnL?

**Profit and Loss (PnL)** shows how much money a user has gained or lost on their investments.

### How It's Calculated:

1. **Total Invested**: Sum of all "buy" transaction values
2. **Current Value**: Sum of (holdings × average buy price) for all assets
3. **PnL**: Current Value - Total Invested
4. **PnL %**: (PnL / Total Invested) × 100

### Display Colors:
- 🟢 **Green**: Positive PnL (profit)
- 🔴 **Red**: Negative PnL (loss)

### Example:

```
User bought:
- $1,000 worth of BTC
- $500 worth of ETH
Total Invested: $1,500

Current Portfolio:
- BTC holdings worth $1,200
- ETH holdings worth $600
Current Value: $1,800

PnL: $1,800 - $1,500 = +$300 (profit)
PnL %: ($300 / $1,500) × 100 = +20%
```

---

## 🎯 Use Cases

### 1. Correcting User Balances

**Scenario**: User reports incorrect balance after a system issue.

**Steps:**
1. Navigate to user details
2. Click "Edit Balance"
3. Adjust the holdings to the correct amount
4. Save changes
5. Document the reason internally

### 2. Manual Airdrops or Bonuses

**Scenario**: Giving users promotional tokens or rewards.

**Steps:**
1. Open portfolio editor
2. Click "Add Asset"
3. Enter the asset symbol and amount
4. Set average buy price (can be 0 for free tokens)
5. Save changes

### 3. Refunds or Reversals

**Scenario**: Need to refund a user for a failed transaction.

**Steps:**
1. Check the transaction history
2. Open portfolio editor
3. Add back the amount that should be refunded
4. Save changes
5. Optionally suspend the account if investigating

### 4. Account Cleanup

**Scenario**: Removing dust balances or inactive assets.

**Steps:**
1. Open portfolio editor
2. Click the trash icon next to small/inactive holdings
3. Save changes

### 5. Updating User Information

**Scenario**: User requests email change or name correction.

**Steps:**
1. Click "Edit Profile"
2. Update the relevant fields
3. Save changes
4. User receives notification

---

## 🔒 Security & Best Practices

### Before Making Changes:

1. ✅ **Verify the request**: Ensure you have proper authorization
2. ✅ **Document the reason**: Keep internal records of why changes were made
3. ✅ **Double-check amounts**: Verify numbers before saving
4. ✅ **Consider alternatives**: Check if a regular transaction would be more appropriate

### After Making Changes:

1. ✅ **Verify the change**: Refresh and confirm the update was applied
2. ✅ **Monitor the account**: Watch for any unusual activity
3. ✅ **Communicate**: Inform the user if necessary (beyond automatic notification)
4. ✅ **Log the action**: Document in your admin activity log

### What NOT to Do:

- ❌ Don't make changes without authorization
- ❌ Don't edit portfolios for personal gain
- ❌ Don't make large adjustments without verification
- ❌ Don't ignore the warnings in the interface
- ❌ Don't forget that changes are immediate and permanent

---

## 📋 Editing Checklist

Before editing any user account:

- [ ] I have proper authorization to make this change
- [ ] I have verified the user's identity
- [ ] I understand what I'm changing and why
- [ ] I have documented the reason for this change
- [ ] I have double-checked all amounts and values
- [ ] I understand this change is immediate and permanent
- [ ] I will monitor the account after making changes

---

## 🚨 Emergency Procedures

### If You Made a Mistake:

1. **Don't panic** - most changes can be reversed
2. **Document what happened** - note the incorrect change
3. **Reverse the change immediately**:
   - For profile: Edit profile again with correct info
   - For portfolio: Edit balance back to correct amount
4. **Notify your supervisor** if the mistake was significant
5. **Learn from it** - review what went wrong

### If You Suspect Fraud:

1. **Suspend the account immediately** (if not already suspended)
2. **Document everything** you observe
3. **Don't make any portfolio changes** that could destroy evidence
4. **Notify security team** or your supervisor
5. **Preserve transaction history** for investigation

---

## 💡 Tips & Tricks

### Efficient Editing:

1. **Use keyboard navigation**: Tab through fields quickly
2. **Copy-paste carefully**: When entering addresses or long values
3. **Check calculations**: Use the auto-calculated totals to verify
4. **Batch similar changes**: If editing multiple users, do similar tasks together

### Avoiding Errors:

1. **Always read the warnings**: They're there for a reason
2. **Preview before saving**: Review all changes in the modal
3. **Start with small changes**: Test with minor adjustments first
4. **Keep records**: Screenshot or note what you changed
5. **Verify afterward**: Always check that changes applied correctly

---

## 📊 Statistics Dashboard

After editing, the user detail page shows updated statistics:

### Portfolio Value Card
- Shows total current value of all holdings
- Number of assets in portfolio

### Total Invested Card
- Sum of all buy transactions
- Basis for PnL calculations

### Profit/Loss Card
- Real-time PnL calculation
- Percentage gain/loss
- Color-coded (green = profit, red = loss)

### Transactions Card
- Total transaction count
- Number of notifications

---

## 🔄 Workflow Example

### Complete User Balance Adjustment Workflow:

1. **Receive Request**
   - User contacts support about incorrect balance
   - Ticket created: "User reports missing 0.5 BTC"

2. **Verify Request**
   - Check user's transaction history
   - Confirm the issue exists
   - Get authorization from supervisor

3. **Navigate to User**
   - Login to admin panel
   - Go to Users → Search for user
   - Click to view user details

4. **Review Current State**
   - Check current BTC holdings
   - Review recent transactions
   - Note current portfolio value

5. **Make Adjustment**
   - Click "Edit Balance"
   - Find BTC in the list
   - Increase holdings by 0.5 BTC
   - Verify the new total value
   - Click "Save Portfolio Changes"

6. **Verify Change**
   - Refresh the page
   - Confirm BTC holdings increased
   - Check portfolio value updated
   - Verify user received notification

7. **Document**
   - Update support ticket
   - Note the change in admin log
   - Inform user the issue is resolved

8. **Follow Up**
   - Monitor account for 24-48 hours
   - Ensure no further issues
   - Close the ticket

---

## ❓ FAQ

### Q: Will editing portfolio create transaction records?
**A:** No. Manual portfolio edits do not create transaction records. They directly modify the holdings. Use this only for corrections and adjustments.

### Q: Can I edit multiple users at once?
**A:** No. Each user must be edited individually for security and accuracy.

### Q: What happens if I enter a negative number?
**A:** The system may reject it or set it to zero, depending on the field. Holdings cannot be negative.

### Q: Can I undo a change?
**A:** Not automatically. You must manually reverse the change by editing again with the correct values.

### Q: Will the user know I edited their account?
**A:** Yes. Users receive automatic notifications when their profile or portfolio is adjusted by an admin.

### Q: Can I edit my own admin account?
**A:** It's not recommended. Have another admin make changes to admin accounts to maintain audit trails.

### Q: What if I try to set an email that's already in use?
**A:** The system will reject it and show an error message. Each email must be unique.

### Q: How precise can I be with amounts?
**A:** You can enter decimal values with high precision (e.g., 0.00000001 BTC).

### Q: Is there an audit log of changes?
**A:** Currently, changes create notifications for users. For admin audit logs, implement additional logging as needed.

### Q: Can I bulk import portfolio data?
**A:** Not through the UI. This would require a custom script or database import.

---

## 🎓 Training Scenarios

Practice these scenarios to become proficient:

### Scenario 1: Simple Balance Correction
User reports 1 ETH missing from their account.
- Find user
- Verify transaction history
- Add 1 ETH to their portfolio
- Verify change

### Scenario 2: Email Update
User changed their email and wants it updated.
- Find user
- Edit profile
- Change email to new address
- Save and verify

### Scenario 3: Account Suspension
User violated terms of service.
- Find user
- Review activity
- Click "Suspend Account"
- Document reason

### Scenario 4: Promotional Airdrop
Give 100 USDT to active users.
- Find user
- Edit balance
- Add 100 USDT at $1.00 average price
- Save changes

---

## 📞 Support

If you need help with admin editing features:

1. Review this documentation thoroughly
2. Check the in-app warnings and tooltips
3. Consult with senior admin team members
4. Document any issues or suggestions for improvement

---

**Remember**: With great power comes great responsibility. Always double-check your changes and maintain proper documentation.

---

**Last Updated**: December 2025
**Version**: 2.0.0

