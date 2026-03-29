const axios = require('axios');

// Test 1: Check if PHP file exists
async function testPHPFileExists() {
  console.log('\n🔍 TEST 1: Checking if PHP file exists...');
  console.log('URL: https://boultindia.com/send-order-email.php');
  
  try {
    const response = await axios.get('https://boultindia.com/send-order-email.php', {
      timeout: 10000
    });
    
    console.log('✅ Status:', response.status);
    console.log('📄 Response:', response.data);
    
    if (response.data.includes('Method not allowed')) {
      console.log('✅ PHP file is working! (GET method blocked as expected)');
      return true;
    } else if (response.data.includes('<!doctype html>')) {
      console.log('❌ PHP file NOT found - React app is responding instead');
      return false;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', JSON.stringify(error.response.data, null, 2));
      
      // 405 Method Not Allowed means PHP file exists!
      if (error.response.status === 405 || 
          (error.response.data && error.response.data.error === 'Method not allowed')) {
        console.log('✅ PHP file is working! (GET method blocked as expected)');
        return true;
      }
    }
    return false;
  }
}

// Test 2: Try sending test email
async function testSendEmail() {
  console.log('\n📧 TEST 2: Trying to send test email...');
  
  const testData = {
    orderId: 'TEST-' + Date.now(),
    customerEmail: 'test@example.com',
    customerName: 'Test Customer',
    amount: 500,
    items: [
      { name: 'Test Product', quantity: 1, price: 500 }
    ],
    address: 'Test Address',
    city: 'Test City',
    state: 'Test State',
    pincode: '123456',
    phone: '9876543210'
  };
  
  try {
    const response = await axios.post('https://boultindia.com/send-order-email.php', testData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });
    
    console.log('✅ Status:', response.status);
    console.log('📄 Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      console.log('✅ Email sent successfully!');
    } else {
      console.log('❌ Email failed:', response.data.error);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Hostinger Email Tests...\n');
  
  const phpExists = await testPHPFileExists();
  
  if (phpExists) {
    await testSendEmail();
  } else {
    console.log('\n❌ PROBLEM FOUND:');
    console.log('PHP file is NOT uploaded to correct location!');
    console.log('\n📋 SOLUTION:');
    console.log('1. Upload send-order-email.php to: public_html/send-order-email.php');
    console.log('2. NOT in any subfolder like /api/ or /email-service/');
    console.log('3. File should be at ROOT level of public_html');
  }
  
  console.log('\n✅ Tests completed!');
}

runTests();
