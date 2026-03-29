// Test script to simulate frontend Razorpay request
const { default: fetch } = require('node-fetch');

async function testRazorpayFlow() {
  console.log('🔄 Testing Razorpay flow from frontend perspective...\n');
  
  const backendUrl = 'https://boult-india-bakend-new.onrender.com';
  
  try {
    // Step 1: Test basic connection
    console.log('1️⃣ Testing basic connection...');
    const healthResponse = await fetch(`${backendUrl}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Step 2: Test Razorpay create order (simulating frontend request)
    console.log('\n2️⃣ Testing Razorpay create order...');
    const createOrderResponse = await fetch(`${backendUrl}/api/razorpay/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'http://localhost:3002',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        amount: 2500,
        orderId: 'FRONTEND_TEST_001',
        customer: 'Frontend Test User'
      })
    });
    
    console.log('📊 Response status:', createOrderResponse.status);
    console.log('📊 Response ok:', createOrderResponse.ok);
    console.log('📊 Response headers:', Object.fromEntries(createOrderResponse.headers.entries()));
    
    if (createOrderResponse.ok) {
      const orderData = await createOrderResponse.json();
      console.log('✅ Razorpay order created successfully:', orderData);
      
      // Step 3: Test save order
      console.log('\n3️⃣ Testing save order...');
      const saveOrderResponse = await fetch(`${backendUrl}/api/save-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'http://localhost:3002'
        },
        body: JSON.stringify({
          id: 'FRONTEND_TEST_001',
          customer: 'Frontend Test User',
          email: 'test@frontend.com',
          phone: '9876543210',
          address: 'Test Address',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          amount: 2500,
          paymentMethod: 'card',
          items: [
            {
              name: 'Test Product',
              variant: 'Default',
              quantity: 1,
              price: 2500,
              image: 'test.jpg'
            }
          ],
          status: 'paid',
          paymentId: 'pay_test_123',
          date: new Date().toISOString()
        })
      });
      
      if (saveOrderResponse.ok) {
        const saveData = await saveOrderResponse.json();
        console.log('✅ Order saved successfully:', saveData);
      } else {
        const errorData = await saveOrderResponse.text();
        console.log('❌ Save order failed:', errorData);
      }
      
    } else {
      const errorText = await createOrderResponse.text();
      console.log('❌ Razorpay order creation failed:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Error details:', error);
  }
}

// Run the test
testRazorpayFlow();