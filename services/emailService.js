const nodemailer = require('nodemailer');
const path = require('path');

// Hostinger SMTP Configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: true, // SSL for port 465
  auth: {
    user: process.env.SMTP_USER, // admin-orders@boultindia.com
    pass: process.env.SMTP_PASS
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000
});

// Send Order Confirmation Email
const sendOrderConfirmation = async (orderData) => {
  try {
    const { customer, email, id, amount, items, address, city, state, pincode, phone } = orderData;
    
    // Create items list HTML
    const itemsHTML = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.name}</strong><br>
          <small>Variant: ${item.variant || 'Default'}</small>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;"><strong>₹${(item.price * item.quantity).toLocaleString('en-IN')}</strong></td>
      </tr>
    `).join('');

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%); padding: 30px; text-align: center;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <img src="cid:boult-logo" alt="Boult India" style="max-width: 180px; height: auto; margin-bottom: 15px; display: block;" />
                        </td>
                      </tr>
                    </table>
                    <h1 style="color: #ffffff; margin: 15px 0 0 0; font-size: 28px;">Order Confirmed! 🎉</h1>
                    <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Thank you for your order</p>
                  </td>
                </tr>

                <!-- Order Details -->
                <tr>
                  <td style="padding: 30px;">
                    <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">Hi <strong>${customer}</strong>,</p>
                    <p style="font-size: 14px; color: #666; margin: 0 0 20px 0;">Your order has been successfully placed and is being processed.</p>
                    
                    <table width="100%" cellpadding="10" style="background-color: #f9f9f9; border-radius: 8px; margin-bottom: 20px;">
                      <tr>
                        <td style="padding: 15px;">
                          <p style="margin: 0; color: #666; font-size: 12px;">ORDER ID</p>
                          <p style="margin: 5px 0 0 0; color: #333; font-size: 18px; font-weight: bold;">${id}</p>
                        </td>
                        <td style="padding: 15px; text-align: right;">
                          <p style="margin: 0; color: #666; font-size: 12px;">TOTAL AMOUNT</p>
                          <p style="margin: 5px 0 0 0; color: #ff6b35; font-size: 24px; font-weight: bold;">₹${amount.toLocaleString('en-IN')}</p>
                        </td>
                      </tr>
                    </table>

                    <!-- Order Items -->
                    <h3 style="color: #333; margin: 30px 0 15px 0; font-size: 18px;">Order Items</h3>
                    <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                      <thead>
                        <tr style="background-color: #f9f9f9;">
                          <th style="padding: 12px; text-align: left; font-size: 12px; color: #666;">PRODUCT</th>
                          <th style="padding: 12px; text-align: center; font-size: 12px; color: #666;">QTY</th>
                          <th style="padding: 12px; text-align: right; font-size: 12px; color: #666;">PRICE</th>
                          <th style="padding: 12px; text-align: right; font-size: 12px; color: #666;">TOTAL</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${itemsHTML}
                      </tbody>
                    </table>

                    <!-- Delivery Address -->
                    <h3 style="color: #333; margin: 30px 0 15px 0; font-size: 18px;">Delivery Address</h3>
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #ff6b35;">
                      <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6;">
                        <strong>${customer}</strong><br>
                        ${address}<br>
                        ${city}, ${state} - ${pincode}<br>
                        Phone: ${phone}
                      </p>
                    </div>

                    <!-- Track Order Button -->
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="https://boultindia.com/track-order" 
                         style="display: inline-block; background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; margin-right: 10px;">
                        Track Your Order
                      </a>
                      <a href="https://boultindia.com/invoice/${id}" 
                         style="display: inline-block; background: #ffffff; color: #ff6b35; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; border: 2px solid #ff6b35;">
                        Download Invoice
                      </a>
                    </div>

                    <p style="font-size: 14px; color: #666; margin: 20px 0 0 0; line-height: 1.6;">
                      We'll send you shipping confirmation when your items are on the way. If you have any questions, please contact us.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eee;">
                    <p style="margin: 0; color: #999; font-size: 12px;">
                      © 2024 Boult India. All rights reserved.<br>
                      <a href="https://boultindia.com" style="color: #ff6b35; text-decoration: none;">Visit our website</a>
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Email options with logo attachment
    const mailOptions = {
      from: `"Boult India Orders" <${process.env.SMTP_USER}>`, // admin-orders@boultindia.com
      to: email, // Customer email
      cc: process.env.ADMIN_EMAIL, // vtechmultisolutions@gmail.com
      subject: `Order Confirmation - ${id} | Boult India`,
      html: emailHTML,
      attachments: [
        {
          filename: 'logo.png',
          path: path.join(__dirname, '../public/logo2.png'),
          cid: 'boult-logo' // Same CID value as in the html img src
        }
      ]
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOrderConfirmation
};
