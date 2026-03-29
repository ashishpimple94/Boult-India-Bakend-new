// Admin Panel Connection Test
const testAdminConnection = async () => {
  console.log('🔍 Testing Admin Panel Connection...');
  
  const backendUrl = 'https://boult-india-bakend-new.onrender.com';
  
  try {
    // Test 1: Backend Health Check
    console.log('🔄 Testing backend health...');
    const healthResponse = await fetch(`${backendUrl}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Backend Health:', healthData);
    
    // Test 2: Admin Login Endpoint
    console.log('🔄 Testing admin login endpoint...');
    const loginResponse = await fetch(`${backendUrl}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });
    
    console.log('Admin login status:', loginResponse.status);
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Admin Login Success:', loginData);
    } else {
      const errorText = await loginResponse.text();
      console.error('❌ Admin Login Failed:', errorText);
    }
    
    // Test 3: Orders Endpoint
    console.log('🔄 Testing orders endpoint...');
    const ordersResponse = await fetch(`${backendUrl}/api/orders`);
    console.log('Orders status:', ordersResponse.status);
    if (ordersResponse.ok) {
      const ordersData = await ordersResponse.json();
      console.log('✅ Orders Data:', ordersData);
    } else {
      const errorText = await ordersResponse.text();
      console.error('❌ Orders Failed:', errorText);
    }
    
    // Test 4: Products Endpoint
    console.log('🔄 Testing products endpoint...');
    const productsResponse = await fetch(`${backendUrl}/api/products`);
    console.log('Products status:', productsResponse.status);
    if (productsResponse.ok) {
      const productsData = await productsResponse.json();
      console.log('✅ Products Data:', productsData.products?.length || 0, 'products found');
    } else {
      const errorText = await productsResponse.text();
      console.error('❌ Products Failed:', errorText);
    }
    
    // Test 5: CORS Check
    console.log('🔄 Testing CORS...');
    const corsResponse = await fetch(`${backendUrl}/api/products`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3001',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    console.log('CORS status:', corsResponse.status);
    console.log('CORS headers:', Object.fromEntries(corsResponse.headers.entries()));
    
    console.log('🎉 Admin Panel Connection Test Complete!');
    
  } catch (error) {
    console.error('❌ Admin Connection Test Failed:', error);
  }
};

// Run the test
testAdminConnection();