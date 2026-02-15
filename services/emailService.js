const nodemailer = require('nodemailer');

// Email SMTP Configuration - Try Gmail first, fallback to Hostinger
const createTransporter = () => {
  // Check if Gmail credentials are properly set (both must exist and not be empty)
  const hasGmailCredentials = process.env.GMAIL_USER && 
                               process.env.GMAIL_APP_PASSWORD && 
                               process.env.GMAIL_USER.trim() !== '' && 
                               process.env.GMAIL_APP_PASSWORD.trim() !== '';
  
  // Try Gmail SMTP if configured
  if (hasGmailCredentials) {
    console.log('📧 Using Gmail SMTP');
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }
  
  // Check if Hostinger credentials are set
  const hasHostingerCredentials = process.env.HOSTINGER_EMAIL && 
                                   process.env.HOSTINGER_PASSWORD &&
                                   process.env.HOSTINGER_EMAIL.trim() !== '' &&
                                   process.env.HOSTINGER_PASSWORD.trim() !== '';
  
  if (!hasHostingerCredentials) {
    throw new Error('No email credentials configured. Please set either Gmail or Hostinger SMTP credentials in .env file');
  }
  
  // Use Hostinger SMTP
  console.log('📧 Using Hostinger SMTP');
  return nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.HOSTINGER_EMAIL,
      pass: process.env.HOSTINGER_PASSWORD
    }
  });
};

// Send Order Confirmation Email
const sendOrderConfirmation = async (orderData) => {
  try {
    const { customer, email, id, amount, items, address, city, state, pincode, phone } = orderData;
    
    console.log('📧 Attempting to send order confirmation email...');
    console.log('📦 Order ID:', id);
    console.log('📧 To:', email);
    console.log('🔧 GMAIL_USER:', process.env.GMAIL_USER ? 'SET' : 'NOT SET');
    console.log('🔧 GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? 'SET' : 'NOT SET');
    console.log('🔧 HOSTINGER_EMAIL:', process.env.HOSTINGER_EMAIL ? 'SET' : 'NOT SET');
    console.log('🔧 HOSTINGER_PASSWORD:', process.env.HOSTINGER_PASSWORD ? 'SET' : 'NOT SET');
    
    // Build items HTML with better styling
    let itemsHTML = '';
    items.forEach((item, index) => {
      const itemName = item.name || '';
      const itemVariant = item.variant || 'Default';
      const itemQty = item.quantity || 1;
      const itemPrice = (item.price || 0).toFixed(2);
      const itemTotal = ((item.price || 0) * itemQty).toFixed(2);
      const bgColor = index % 2 === 0 ? '#ffffff' : '#f9fafb';
      
      itemsHTML += `
        <tr style='background-color: ${bgColor};'>
          <td style='padding: 14px 12px; border-bottom: 1px solid #e5e7eb;'>
            <strong style='color: #333; font-size: 14px;'>${itemName}</strong><br>
            <small style='color: #6b7280; font-size: 12px;'>Variant: <span style='background-color: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-weight: 600;'>${itemVariant}</span></small>
          </td>
          <td style='padding: 14px 12px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #333; font-weight: 600; font-size: 14px;'>${itemQty}</td>
          <td style='padding: 14px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #6b7280; font-size: 14px;'>₹${itemPrice}</td>
          <td style='padding: 14px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #ff6b35; font-weight: bold; font-size: 15px;'>₹${itemTotal}</td>
        </tr>
      `;
    });
    
    const formattedAmount = amount.toFixed(2);
    
    // Email HTML with Boult India Logo and Professional Structure
    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Order Confirmation - Boult India</title>
</head>
<body style='margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; background-color: #f4f4f4;'>
    <table width='100%' cellpadding='0' cellspacing='0' style='background-color: #f4f4f4; padding: 20px 0;'>
        <tr>
            <td align='center'>
                <!-- Main Container -->
                <table width='600' cellpadding='0' cellspacing='0' style='background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;'>
                    
                    <!-- Header with Logo and Gradient -->
                    <tr>
                        <td style='background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%); padding: 40px 30px; text-align: center;'>
                            <!-- Boult India Logo -->
                            <img src='https://boultindia.com/logos/logo1.png' alt='Boult India' style='height: 70px; width: auto; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;' />
                            <h1 style='color: #ffffff; margin: 0; font-size: 32px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.2);'>Order Confirmed! 🎉</h1>
                            <p style='color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.95;'>Thank you for choosing Boult India</p>
                        </td>
                    </tr>

                    <!-- Greeting -->
                    <tr>
                        <td style='padding: 30px 30px 20px 30px;'>
                            <p style='font-size: 18px; color: #333; margin: 0 0 10px 0;'>Hi <strong style='color: #ff6b35;'>${customer}</strong>,</p>
                            <p style='font-size: 15px; color: #666; margin: 0; line-height: 1.6;'>Your order has been successfully placed and is being processed. We'll notify you once it's shipped!</p>
                        </td>
                    </tr>

                    <!-- Order Summary Box -->
                    <tr>
                        <td style='padding: 0 30px 20px 30px;'>
                            <table width='100%' cellpadding='0' cellspacing='0' style='background: linear-gradient(135deg, #fff5f0 0%, #ffe8dc 100%); border-radius: 10px; border: 2px solid #ff6b35; overflow: hidden;'>
                                <tr>
                                    <td style='padding: 20px;'>
                                        <table width='100%'>
                                            <tr>
                                                <td style='width: 50%; vertical-align: top;'>
                                                    <p style='margin: 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;'>Order ID</p>
                                                    <p style='margin: 5px 0 0 0; color: #333; font-size: 20px; font-weight: bold;'>#${id}</p>
                                                </td>
                                                <td style='width: 50%; text-align: right; vertical-align: top;'>
                                                    <p style='margin: 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;'>Total Amount</p>
                                                    <p style='margin: 5px 0 0 0; color: #ff6b35; font-size: 28px; font-weight: bold;'>₹${formattedAmount}</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Order Items Section -->
                    <tr>
                        <td style='padding: 0 30px 20px 30px;'>
                            <h3 style='color: #333; margin: 0 0 15px 0; font-size: 20px; border-bottom: 2px solid #ff6b35; padding-bottom: 10px;'>📦 Order Items</h3>
                            <table width='100%' cellpadding='0' cellspacing='0' style='border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;'>
                                <thead>
                                    <tr style='background: linear-gradient(135deg, #333 0%, #555 100%);'>
                                        <th style='padding: 14px 12px; text-align: left; font-size: 12px; color: #ffffff; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;'>Product</th>
                                        <th style='padding: 14px 12px; text-align: center; font-size: 12px; color: #ffffff; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;'>Qty</th>
                                        <th style='padding: 14px 12px; text-align: right; font-size: 12px; color: #ffffff; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;'>Price</th>
                                        <th style='padding: 14px 12px; text-align: right; font-size: 12px; color: #ffffff; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;'>Total</th>
                                    </tr>
                                </thead>
                                <tbody>${itemsHTML}</tbody>
                            </table>
                        </td>
                    </tr>

                    <!-- Delivery Address Section -->
                    <tr>
                        <td style='padding: 0 30px 20px 30px;'>
                            <h3 style='color: #333; margin: 0 0 15px 0; font-size: 20px; border-bottom: 2px solid #ff6b35; padding-bottom: 10px;'>🚚 Delivery Address</h3>
                            <div style='background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 20px; border-radius: 10px; border-left: 5px solid #0ea5e9; box-shadow: 0 2px 4px rgba(0,0,0,0.05);'>
                                <p style='margin: 0; color: #333; font-size: 15px; line-height: 1.8;'>
                                    <strong style='color: #0ea5e9; font-size: 16px;'>${customer}</strong><br>
                                    ${address}<br>
                                    ${city}, ${state} - ${pincode}<br>
                                    📱 Phone: <strong>${phone}</strong>
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Action Buttons -->
                    <tr>
                        <td style='padding: 0 30px 30px 30px; text-align: center;'>
                            <table width='100%' cellpadding='0' cellspacing='0'>
                                <tr>
                                    <td style='padding: 10px;'>
                                        <a href='https://boultindia.com/track-order' style='display: block; background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%); color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; box-shadow: 0 4px 6px rgba(255,107,53,0.3); transition: all 0.3s;'>🔍 Track Your Order</a>
                                    </td>
                                    <td style='padding: 10px;'>
                                        <a href='https://boultindia.com/account' style='display: block; background: linear-gradient(135deg, #333 0%, #555 100%); color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.2); transition: all 0.3s;'>📄 View Invoice</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Support Section -->
                    <tr>
                        <td style='padding: 0 30px 30px 30px;'>
                            <div style='background-color: #f9fafb; padding: 20px; border-radius: 10px; border: 1px solid #e5e7eb; text-align: center;'>
                                <p style='margin: 0 0 10px 0; color: #666; font-size: 14px;'>Need help with your order?</p>
                                <p style='margin: 0; color: #333; font-size: 14px;'>
                                    📧 Email: <a href='mailto:support@boultindia.com' style='color: #ff6b35; text-decoration: none; font-weight: 600;'>support@boultindia.com</a><br>
                                    📞 Phone: <strong>+91-XXXXXXXXXX</strong>
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style='background: linear-gradient(135deg, #1f2937 0%, #374151 100%); padding: 30px; text-align: center;'>
                            <img src='https://boultindia.com/logos/logo1.png' alt='Boult India' style='height: 50px; width: auto; margin-bottom: 15px; opacity: 0.9; display: block; margin-left: auto; margin-right: auto;' />
                            <p style='margin: 0 0 10px 0; color: #d1d5db; font-size: 14px; font-weight: 600;'>Boult India - Premium Vehicle Care Products</p>
                            <p style='margin: 0 0 15px 0; color: #9ca3af; font-size: 12px;'>Quality products for your vehicle's care and maintenance</p>
                            <div style='margin: 15px 0;'>
                                <a href='https://boultindia.com' style='color: #ff6b35; text-decoration: none; margin: 0 10px; font-size: 13px; font-weight: 600;'>Visit Website</a>
                                <span style='color: #6b7280;'>|</span>
                                <a href='https://boultindia.com/contact' style='color: #ff6b35; text-decoration: none; margin: 0 10px; font-size: 13px; font-weight: 600;'>Contact Us</a>
                                <span style='color: #6b7280;'>|</span>
                                <a href='https://boultindia.com/return-refund-policy' style='color: #ff6b35; text-decoration: none; margin: 0 10px; font-size: 13px; font-weight: 600;'>Return Policy</a>
                            </div>
                            <p style='margin: 15px 0 0 0; color: #6b7280; font-size: 11px;'>© 2024 Boult India. All rights reserved.</p>
                            <p style='margin: 5px 0 0 0; color: #6b7280; font-size: 10px;'>This is an automated email. Please do not reply to this message.</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
    
    // Create transporter
    const transporter = createTransporter();
    
    // Email options
    const fromEmail = process.env.GMAIL_USER || process.env.HOSTINGER_EMAIL || 'orders@boultindia.com';
    const mailOptions = {
      from: `"Boult India Orders" <${fromEmail}>`,
      to: email,
      cc: 'vtechmultisolutions@gmail.com',
      replyTo: fromEmail,
      subject: `Order Confirmation - ${id} | Boult India`,
      html: emailHTML
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Error sending order confirmation email:');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return { success: false, error: error.message };
  }
};

// Send Contact Form Email
async function sendContactEmail(contactData) {
  const { name, email, phone, enquiryType, subject, message } = contactData;
  
  const enquiryTypeLabels = {
    general: 'General Inquiry',
    distributorship: 'Enquiry for Distributorship',
    orders: 'Contact for Orders Query',
    technical: 'Technical Support',
    bulk: 'Bulk Orders'
  };

  // Create transporter
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Boult India Contact" <${process.env.HOSTINGER_EMAIL}>`,
    to: 'vtechmultisolutions@gmail.com',
    cc: process.env.HOSTINGER_EMAIL,
    subject: `[${enquiryTypeLabels[enquiryType] || 'Contact Form'}] ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-row { margin: 15px 0; padding: 15px; background: white; border-left: 4px solid #f97316; border-radius: 5px; }
          .label { font-weight: bold; color: #f97316; margin-bottom: 5px; }
          .value { color: #333; }
          .message-box { background: white; padding: 20px; border-radius: 5px; margin-top: 20px; border: 1px solid #e5e7eb; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">📧 New Contact Form Submission</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">${enquiryTypeLabels[enquiryType] || 'Contact Form'}</p>
          </div>
          
          <div class="content">
            <div class="info-row">
              <div class="label">👤 Name:</div>
              <div class="value">${name}</div>
            </div>
            
            <div class="info-row">
              <div class="label">📧 Email:</div>
              <div class="value"><a href="mailto:${email}" style="color: #f97316;">${email}</a></div>
            </div>
            
            ${phone ? `
            <div class="info-row">
              <div class="label">📱 Phone:</div>
              <div class="value"><a href="tel:${phone}" style="color: #f97316;">${phone}</a></div>
            </div>
            ` : ''}
            
            <div class="info-row">
              <div class="label">📋 Enquiry Type:</div>
              <div class="value">${enquiryTypeLabels[enquiryType] || 'General Inquiry'}</div>
            </div>
            
            <div class="info-row">
              <div class="label">📌 Subject:</div>
              <div class="value">${subject}</div>
            </div>
            
            <div class="message-box">
              <div class="label">💬 Message:</div>
              <div class="value" style="margin-top: 10px; white-space: pre-wrap;">${message}</div>
            </div>
            
            <div class="footer">
              <p><strong>Boult India</strong></p>
              <p>This email was sent from the contact form on boultindia.com</p>
              <p>Received on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Contact email sent to vtechmultisolutions@gmail.com`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending contact email:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendOrderConfirmation,
  sendContactEmail
};
