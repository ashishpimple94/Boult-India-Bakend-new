// Direct Razorpay Test
const testRazorpayDirect = async () => {
  try {
    console.log('🔄 Testing Razorpay integration...');
    
    // Test 1: Backend connection
    const backendUrl = 'https://boult-india-bakend-new.onrender.com';
    console.log('🔄 Testing backend:', backendUrl);
    
    const healthResponse = await fetch(`${backendUrl}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Backend health:', healthData);
    
    // Test 2: Razorpay order creation
    const orderData = {
      amount: 1000,
      orderId: 'TEST_' + Date.now(),
      customer: 'Test Customer'
    };
    
    console.log('🔄 Creating Razorpay order:', orderData);
    
    const orderResponse = await fetch(`${backendUrl}/api/razorpay/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    
    console.log('📊 Order response status:', orderResponse.status);
    console.log('📊 Order response headers:', Object.fromEntries(orderResponse.headers.entries()));
    
    if (orderResponse.ok) {
      const orderResult = await orderResponse.json();
      console.log('✅ Razorpay order created:', orderResult);
      
      // Test 3: Check if Razorpay script can be loaded
      console.log('🔄 Testing Razorpay script loading...');
      
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        console.log('✅ Razorpay script loaded successfully');
        console.log('✅ Razorpay object available:', !!window.Razorpay);
        
        if (window.Razorpay) {
          console.log('🎉 Razorpay integration test PASSED!');
        } else {
          console.error('❌ Razorpay object not available after script load');
        }
      };
      script.onerror = () => {
        console.error('❌ Failed to load Razorpay script');
      };
      document.head.appendChild(script);
      
    } else {
      const errorText = await orderResponse.text();
      console.error('❌ Order creation failed:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Razorpay test failed:', error);
  }
};

// Run the test
testRazorpayDirect();