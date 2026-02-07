const nodemailer = require('nodemailer');
const path = require('path');
const axios = require('axios');

// Hostinger PHP Email Service URL
const HOSTINGER_EMAIL_API = process.env.HOSTINGER_EMAIL_API || 'https://boultindia.com/api/send-order-email.php';

// Send Order Confirmation Email via Hostinger PHP Script
const sendOrderConfirmation = async (orderData) => {
  try {
    const { customer, email, id, amount, items, address, city, state, pincode, phone } = orderData;
    
    // Prepare data for PHP script
    const emailData = {
      orderId: id,
      customerEmail: email,
      customerName: customer,
      amount: amount,
      items: items,
      address: address,
      city: city,
      state: state,
      pincode: pincode,
      phone: phone
    };

    console.log('📧 Sending email via Hostinger PHP script...');
    
    // Call Hostinger PHP script
    const response = await axios.post(HOSTINGER_EMAIL_API, emailData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });

    if (response.data && response.data.success) {
      console.log('✅ Order confirmation email sent successfully via Hostinger');
      return { success: true, messageId: response.data.orderId };
    } else {
      throw new Error(response.data?.error || 'Unknown error from email service');
    }

  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOrderConfirmation
};
