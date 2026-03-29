// Debug Razorpay Issue
console.log('🔍 Debugging Razorpay Issue...');

// Check environment variables
console.log('Environment Variables:');
console.log('REACT_APP_BACKEND_URL:', process.env.REACT_APP_BACKEND_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Test backend connection
const testBackend = async () => {
  try {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://boult-india-bakend-new.onrender.com';
    console.log('🔄 Testing backend URL:', backendUrl);
    
    // Test health endpoint
    const healthResponse = await fetch(`${backendUrl}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Backend health check:', healthData);
    
    // Test Razorpay endpoint
    const testOrder = {
      amount: 100,
      orderId: 'DEBUG_' + Date.now(),
      customer: 'Debug User'
    };
    
    console.log('🔄 Testing Razorpay order creation...');
    const orderResponse = await fetch(`${backendUrl}/api/razorpay/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testOrder)
    });
    
    console.log('Response status:', orderResponse.status);
    console.log('Response headers:', Object.fromEntries(orderResponse.headers.entries()));
    
    if (orderResponse.ok) {
      const orderData = await orderResponse.json();
      console.log('✅ Razorpay order created successfully:', orderData);
      
      // Test Razorpay script loading
      console.log('🔄 Testing Razorpay script...');
      
      if (typeof window !== 'undefined') {
        // Check if script already exists
        const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
        console.log('Existing Razorpay script:', !!existingScript);
        
        // Check if Razorpay is already loaded
        console.log('Razorpay object available:', !!window.Razorpay);
        
        if (!window.Razorpay && !existingScript) {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => {
            console.log('✅ Razorpay script loaded');
            console.log('✅ Razorpay object:', !!window.Razorpay);
          };
          script.onerror = (error) => {
            console.error('❌ Failed to load Razorpay script:', error);
          };
          document.head.appendChild(script);
        }
      }
      
    } else {
      const errorText = await orderResponse.text();
      console.error('❌ Razorpay order creation failed:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Backend test failed:', error);
  }
};

// Run the test
testBackend();

// Export for use in React components
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testBackend };
}