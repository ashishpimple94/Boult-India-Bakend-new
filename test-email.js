require('dotenv').config();
const { sendOrderConfirmation } = require('./services/emailService');

// Test order data
const testOrder = {
  id: 'TEST-' + Date.now(),
  customer: 'Ashish Pimple',
  email: 'ashishpimple94@gmail.com',
  phone: '+91 9876543210',
  amount: 1299,
  address: '123 Test Street, Apartment 4B',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001',
  items: [
    {
      name: 'Chain Lube Spray 500ml',
      variant: 'Standard',
      quantity: 2,
      price: 499
    },
    {
      name: 'Brake Parts Cleaner',
      variant: 'Premium',
      quantity: 1,
      price: 299
    }
  ],
  date: new Date().toISOString(),
  status: 'pending'
};

console.log('🧪 Testing email service...');
console.log('📧 Sending to:', testOrder.email);
console.log('📧 CC to:', process.env.ADMIN_EMAIL);
console.log('📧 SMTP User:', process.env.SMTP_USER);

sendOrderConfirmation(testOrder)
  .then(result => {
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('📬 Message ID:', result.messageId);
    } else {
      console.error('❌ Email failed:', result.error);
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
