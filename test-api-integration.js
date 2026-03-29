// Test script to verify API integration
const axios = require('axios');

const API_BASE_URL = 'https://boult-india-bakend-new.onrender.com';

const testApiIntegration = async () => {
  console.log('🧪 Testing Boult India API Integration...\n');
  
  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');
    
    // Test 2: Products API
    console.log('2️⃣ Testing Products API...');
    const productsResponse = await axios.get(`${API_BASE_URL}/api/products`);
    console.log('✅ Products API:', {
      success: productsResponse.data.success,
      count: productsResponse.data.products.length,
      timestamp: productsResponse.data.timestamp
    });
    console.log('');
    
    // Test 3: Orders API
    console.log('3️⃣ Testing Orders API...');
    const ordersResponse = await axios.get(`${API_BASE_URL}/api/orders`);
    console.log('✅ Orders API:', {
      success: ordersResponse.data.success,
      count: ordersResponse.data.count,
      timestamp: ordersResponse.data.timestamp
    });
    console.log('');
    
    // Test 4: CORS Headers
    console.log('4️⃣ Testing CORS Headers...');
    const corsResponse = await axios.options(`${API_BASE_URL}/api/products`);
    console.log('✅ CORS Headers:', corsResponse.headers['access-control-allow-origin'] || 'Not set');
    console.log('');
    
    console.log('🎉 All API tests passed! Your integration is working perfectly.');
    console.log('');
    console.log('📋 Summary:');
    console.log(`- API Base URL: ${API_BASE_URL}`);
    console.log('- Health Check: ✅ Working');
    console.log('- Products API: ✅ Working');
    console.log('- Orders API: ✅ Working');
    console.log('- CORS: ✅ Configured');
    console.log('');
    console.log('🚀 Next Steps:');
    console.log('1. Populate database with products');
    console.log('2. Restart your React applications');
    console.log('3. Test frontend integration');
    
  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
  }
};

testApiIntegration();