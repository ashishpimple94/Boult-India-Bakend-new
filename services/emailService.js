const nodemailer = require('nodemailer');

// Hostinger SMTP Configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.HOSTINGER_EMAIL || 'orders@boultindia.com',
      pass: process.env.HOSTINGER_PASSWORD || 'Hrishi@123*'
    }
  });
};

// Send Order Confirmation Email via Gmail SMTP
const sendOrderConfirmation = async (orderData) => {
  try {
    const { customer, email, id, amount, items, address, city, state, pincode, phone } = orderData;
    
    console.log('📧 Sending email via Hostinger SMTP...');
    console.log('📦 Order ID:', id);
    console.log('📧 To:', email);
    
    // Build items HTML
    let itemsHTML = '';
    items.forEach(item => {
      const itemName = item.name || '';
      const itemVariant = item.variant || 'Default';
      const itemQty = item.quantity || 1;
      const itemPrice = (item.price || 0).toFixed(2);
      const itemTotal = ((item.price || 0) * itemQty).toFixed(2);
      
      itemsHTML += `
        <tr>
          <td style='padding: 10px; border-bottom: 1px solid #eee;'>
            <strong>${itemName}</strong><br>
            <small style='color: #666;'>Variant: ${itemVariant}</small>
          </td>
          <td style='padding: 10px; border-bottom: 1px solid #eee; text-align: center;'>${itemQty}</td>
          <td style='padding: 10px; border-bottom: 1px solid #eee; text-align: right;'>₹${itemPrice}</td>
          <td style='padding: 10px; border-bottom: 1px solid #eee; text-align: right;'><strong>₹${itemTotal}</strong></td>
        </tr>
      `;
    });
    
    const formattedAmount = amount.toFixed(2);
    
    // Email HTML
    const emailHTML = `
<!DOCTYPE html>
<html>
<head><meta charset='UTF-8'></head>
<body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;'>
    <table width='100%' cellpadding='0' cellspacing='0' style='background-color: #f5f5f5; padding: 20px;'>
        <tr><td align='center'>
            <table width='600' cellpadding='0' cellspacing='0' style='background-color: #ffffff; border-radius: 10px;'>
                <tr>
                    <td style='background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>
                        <h1 style='color: #ffffff; margin: 0; font-size: 28px;'>Order Confirmed! 🎉</h1>
                        <p style='color: #ffffff; margin: 10px 0 0 0;'>Thank you for your order</p>
                    </td>
                </tr>
                <tr>
                    <td style='padding: 30px;'>
                        <p style='font-size: 16px; color: #333; margin: 0 0 20px 0;'>Hi <strong>${customer}</strong>,</p>
                        <p style='font-size: 14px; color: #666; margin: 0 0 20px 0;'>Your order has been successfully placed.</p>
                        
                        <table width='100%' cellpadding='10' style='background-color: #f9f9f9; border-radius: 8px; margin-bottom: 20px;'>
                            <tr>
                                <td style='padding: 15px;'>
                                    <p style='margin: 0; color: #666; font-size: 12px;'>ORDER ID</p>
                                    <p style='margin: 5px 0 0 0; color: #333; font-size: 18px; font-weight: bold;'>${id}</p>
                                </td>
                                <td style='padding: 15px; text-align: right;'>
                                    <p style='margin: 0; color: #666; font-size: 12px;'>TOTAL AMOUNT</p>
                                    <p style='margin: 5px 0 0 0; color: #ff6b35; font-size: 24px; font-weight: bold;'>₹${formattedAmount}</p>
                                </td>
                            </tr>
                        </table>

                        <h3 style='color: #333; margin: 30px 0 15px 0;'>Order Items</h3>
                        <table width='100%' cellpadding='0' cellspacing='0' style='border: 1px solid #eee;'>
                            <thead>
                                <tr style='background-color: #f9f9f9;'>
                                    <th style='padding: 12px; text-align: left; font-size: 12px;'>PRODUCT</th>
                                    <th style='padding: 12px; text-align: center; font-size: 12px;'>QTY</th>
                                    <th style='padding: 12px; text-align: right; font-size: 12px;'>PRICE</th>
                                    <th style='padding: 12px; text-align: right; font-size: 12px;'>TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>${itemsHTML}</tbody>
                        </table>

                        <h3 style='color: #333; margin: 30px 0 15px 0;'>Delivery Address</h3>
                        <div style='background-color: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #ff6b35;'>
                            <p style='margin: 0; color: #333; font-size: 14px; line-height: 1.6;'>
                                <strong>${customer}</strong><br>
                                ${address}<br>
                                ${city}, ${state} - ${pincode}<br>
                                Phone: ${phone}
                            </p>
                        </div>

                        <div style='margin-top: 30px; text-align: center;'>
                            <a href='https://boultindia.com/track-order' style='display: inline-block; background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%); color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-right: 10px;'>Track Order</a>
                            <a href='https://boultindia.com/order-confirmation?orderId=${id}' style='display: inline-block; background-color: #333; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;'>Download Invoice</a>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td style='background-color: #f9f9f9; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;'>
                        <p style='margin: 0; color: #999; font-size: 12px;'>© 2024 Boult India. All rights reserved.</p>
                    </td>
                </tr>
            </table>
        </td></tr>
    </table>
</body>
</html>
    `;
    
    // Create transporter
    const transporter = createTransporter();
    
    // Email options
    const mailOptions = {
      from: '"Boult India Orders" <orders@boultindia.com>',
      to: email,
      cc: 'vtechmultisolutions@gmail.com',
      replyTo: 'orders@boultindia.com',
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
