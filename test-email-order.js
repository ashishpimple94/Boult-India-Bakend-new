const { sendOrderConfirmation } = require('./services/emailService');
require('dotenv').config();

// Test order data
const testOrder = {
  id: 'ORDER_TEST_' + Date.now(),
  customer: 'Ashish Pimple',
  email: 'ashishpimple94@gmail.com',
  phone: '+91-9876543210',
  address: 'Test Address, Near Test Location',
  city: 'Pune',
  state: 'Maharashtra',
  pincode: '411009',
  amount: 1299,
  items: [
    {
      name: 'Chain Lube Spray 500ml',
      variant: 'Standard',
      quantity: 2,
      price: 499,
      image: 'https://example.com/product.jpg'
    },
    {
      name: 'Brake Parts Cleaner',
      variant: 'Premium',
      quantity: 1,
      price: 299,
      image: 'https://example.com/product2.jpg'
    }
  ]
};

console.log('🧪 Testing Order Confirmation Email');
console.log('=====================================');
console.log('📧 Sending to:', testOrder.email);
console.log('📦 Order ID:', testOrder.id);
console.log('💰 Amount: ₹' + testOrder.amount);
console.log('');

// Check environment variables
console.log('🔧 Environment Variables:');
console.log('GMAIL_USER:', process.env.GMAIL_USER || 'NOT SET');
console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? 'SET (***' + process.env.GMAIL_APP_PASSWORD.slice(-3) + ')' : 'NOT SET');
console.log('HOSTINGER_EMAIL:', process.env.HOSTINGER_EMAIL || 'NOT SET');
console.log('HOSTINGER_PASSWORD:', process.env.HOSTINGER_PASSWORD ? 'SET (***' + process.env.HOSTINGER_PASSWORD.slice(-3) + ')' : 'NOT SET');
console.log('');

// Send email
sendOrderConfirmation(testOrder)
  .then(result => {
    console.log('');
    console.log('=====================================');
    if (result.success) {
      console.log('✅ SUCCESS! Email sent successfully!');
      console.log('📧 Message ID:', result.messageId);
      console.log('');
      console.log('📬 Check your inbox at: ashishpimple94@gmail.com');
      console.log('📬 Also check spam folder if not in inbox');
    } else {
      console.log('❌ FAILED! Email could not be sent');
      console.log('Error:', result.error);
    }
    console.log('=====================================');
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.log('');
    console.log('=====================================');
    console.log('❌ ERROR! Exception occurred');
    console.log('Error:', error.message);
    console.log('Stack:', error.stack);
    console.log('=====================================');
    process.exit(1);
  });
