/**
 * Email Service using Zoho Mail
 * Sends transaction notifications and other email alerts
 */

const nodemailer = require('nodemailer')

// Email configuration from environment variables
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.zoho.com'
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '465')
const EMAIL_SECURE = process.env.EMAIL_SECURE !== 'false' // true for 465, false for other ports
const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD
const EMAIL_FROM = process.env.EMAIL_FROM || process.env.EMAIL_USER
const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME || 'TadioWallet'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Create reusable transporter
let transporter = null

function getTransporter() {
  if (!transporter) {
    if (!EMAIL_USER || !EMAIL_PASSWORD) {
      console.warn('⚠️ Email credentials not configured. Emails will be logged to console only.')
      return null
    }

    transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: EMAIL_SECURE,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
      // Zoho specific settings
      tls: {
        rejectUnauthorized: false // Accept self-signed certificates
      }
    })

    // Verify connection
    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Email transporter verification failed:', error)
      } else {
        console.log('✅ Email server is ready to send messages')
      }
    })
  }

  return transporter
}

/**
 * Send email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content (optional)
 */
async function sendEmail({ to, subject, html, text }) {
  const transporter = getTransporter()

  // If no transporter, log email instead of sending
  if (!transporter) {
    console.log('📧 [EMAIL - Not Sent]', {
      to,
      subject,
      html: html.substring(0, 100) + '...',
    })
    return { success: true, preview: true }
  }

  try {
    const info = await transporter.sendMail({
      from: `"${COMPANY_NAME}" <${EMAIL_FROM}>`,
      to,
      subject,
      text: text || '', // Plain text fallback
      html,
      // Anti-spam headers
      headers: {
        'X-Entity-Ref-ID': `${Date.now()}-${Math.random().toString(36).substring(7)}`,
        'X-Mailer': `${COMPANY_NAME} Notification System`,
        'X-Priority': '1',
        'Importance': 'high',
        'X-MSMail-Priority': 'High',
        'Reply-To': EMAIL_FROM,
        'Return-Path': EMAIL_FROM,
        // List headers to avoid spam filters
        'List-Unsubscribe': `<${APP_URL}/settings>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
      // Message priority
      priority: 'high',
    })

    console.log('✅ Email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Error sending email:', error)
    throw error
  }
}

/**
 * Send transfer sent notification to sender
 */
async function sendTransferSentEmail({
  recipientEmail,
  recipientName,
  senderName,
  amount,
  asset,
  assetName,
  value,
  fee,
  recipientAddress,
}) {
  const subject = `Transfer Sent: ${amount} ${asset}`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Transfer Sent</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f1419; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f1419;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1f2e; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #ffffff;">Transfer Sent</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; color: rgba(255, 255, 255, 0.9);">${COMPANY_NAME}</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #e5e7eb; line-height: 1.5;">
                Hi ${senderName},
              </p>
              
              <p style="margin: 0 0 30px 0; font-size: 16px; color: #e5e7eb; line-height: 1.5;">
                Your transfer has been completed successfully!
              </p>
              
              <!-- Transfer Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #2d3748; border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 25px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #9ca3af;">Amount</td>
                        <td align="right" style="padding: 8px 0; font-size: 18px; font-weight: bold; color: #ffffff;">
                          ${amount} ${asset}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #9ca3af;">Asset</td>
                        <td align="right" style="padding: 8px 0; font-size: 16px; color: #ffffff;">
                          ${assetName}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #9ca3af;">USD Value</td>
                        <td align="right" style="padding: 8px 0; font-size: 16px; color: #ffffff;">
                          $${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #9ca3af;">Fee</td>
                        <td align="right" style="padding: 8px 0; font-size: 16px; color: #ffffff;">
                          $${fee.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding: 15px 0 8px 0; border-top: 1px solid #374151;">
                          <p style="margin: 0; font-size: 14px; color: #9ca3af;">Recipient</p>
                          <p style="margin: 5px 0 0 0; font-size: 16px; color: #ffffff; font-weight: 500;">
                            ${recipientName}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding: 8px 0;">
                          <p style="margin: 0; font-size: 14px; color: #9ca3af;">To Address</p>
                          <p style="margin: 5px 0 0 0; font-size: 12px; color: #ffffff; font-family: monospace; word-break: break-all;">
                            ${recipientAddress}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Action Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 10px 0 30px 0;">
                    <a href="${APP_URL}/dashboard/transactions" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      View Transaction
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0; font-size: 14px; color: #9ca3af; line-height: 1.5;">
                If you did not make this transfer, please contact support immediately.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #0f1419; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #6b7280;">
                © ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.
              </p>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #6b7280;">
                This is an automated message. Please do not reply.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  const text = `
Transfer Sent

Hi ${senderName},

Your transfer has been completed successfully!

Amount: ${amount} ${asset}
Asset: ${assetName}
USD Value: $${value.toFixed(2)}
Fee: $${fee.toFixed(2)}
Recipient: ${recipientName}
To Address: ${recipientAddress}

View your transaction: ${APP_URL}/dashboard/transactions

If you did not make this transfer, please contact support immediately.

© ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.
  `

  return sendEmail({ to: recipientEmail, subject, html, text })
}

/**
 * Send transfer received notification to recipient
 */
async function sendTransferReceivedEmail({
  recipientEmail,
  recipientName,
  senderName,
  amount,
  asset,
  assetName,
  value,
  senderAddress,
}) {
  const subject = `Transfer Received: ${amount} ${asset}`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Transfer Received</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f1419; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f1419;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1f2e; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #ffffff;">Transfer Received</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; color: rgba(255, 255, 255, 0.9);">${COMPANY_NAME}</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #e5e7eb; line-height: 1.5;">
                Hi ${recipientName},
              </p>
              
              <p style="margin: 0 0 30px 0; font-size: 16px; color: #e5e7eb; line-height: 1.5;">
                You've received a new transfer! 🎉
              </p>
              
              <!-- Transfer Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #2d3748; border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 25px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #9ca3af;">Amount</td>
                        <td align="right" style="padding: 8px 0; font-size: 18px; font-weight: bold; color: #10b981;">
                          +${amount} ${asset}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #9ca3af;">Asset</td>
                        <td align="right" style="padding: 8px 0; font-size: 16px; color: #ffffff;">
                          ${assetName}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #9ca3af;">USD Value</td>
                        <td align="right" style="padding: 8px 0; font-size: 16px; color: #ffffff;">
                          $${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding: 15px 0 8px 0; border-top: 1px solid #374151;">
                          <p style="margin: 0; font-size: 14px; color: #9ca3af;">From</p>
                          <p style="margin: 5px 0 0 0; font-size: 16px; color: #ffffff; font-weight: 500;">
                            ${senderName}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding: 8px 0;">
                          <p style="margin: 0; font-size: 14px; color: #9ca3af;">From Address</p>
                          <p style="margin: 5px 0 0 0; font-size: 12px; color: #ffffff; font-family: monospace; word-break: break-all;">
                            ${senderAddress}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Action Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 10px 0 30px 0;">
                    <a href="${APP_URL}/dashboard" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      View Balance
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0; font-size: 14px; color: #9ca3af; line-height: 1.5;">
                Your balance has been updated automatically. Check your dashboard to see the latest balance.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #0f1419; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #6b7280;">
                © ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.
              </p>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #6b7280;">
                This is an automated message. Please do not reply.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  const text = `
Transfer Received

Hi ${recipientName},

You've received a new transfer!

Amount: +${amount} ${asset}
Asset: ${assetName}
USD Value: $${value.toFixed(2)}
From: ${senderName}
From Address: ${senderAddress}

View your balance: ${APP_URL}/dashboard

Your balance has been updated automatically.

© ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.
  `

  return sendEmail({ to: recipientEmail, subject, html, text })
}

module.exports = {
  sendEmail,
  sendTransferSentEmail,
  sendTransferReceivedEmail,
}

