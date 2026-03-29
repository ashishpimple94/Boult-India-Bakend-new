require('dotenv').config({ path: './boult-backend/.env' });
const { sendOrderConfirmation } = require('./boult-backend/services/emailService');

// Test order data
const testOrder = {
  id: 'TEST-' + Date.now(),
  customer: 'Test Customer',
  email: 'vtechmultisolutions@gmail.com', // Test email
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

sendOrderConfirmation(testOrder)
  .then(result => {
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('📬 Message ID:', result.messageId);
    } else {
      console.error('❌ Email failed:', result.error);
    }
  })
  .catch(error => {
    console.error('❌ Error:', error);
  });
