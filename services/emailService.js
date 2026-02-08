const nodemailer = require('nodemailer');

// Gmail SMTP Configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER || 'vtechmultisolutions@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD || 'YOUR_APP_PASSWORD_HERE'
    }
  });
};

// Send Order Confirmation Email via Gmail SMTP
const sendOrderConfirmation = async (orderData) => {
  try {
    const { customer, email, id, amount, items, address, city, state, pincode, phone } = orderData;
    
    console.log('📧 Sending email via Gmail SMTP...');
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
      from: '"Boult India Orders" <vtechmultisolutions@gmail.com>',
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

module.exports = {
  sendOrderConfirmation
};
