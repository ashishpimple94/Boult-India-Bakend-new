#!/usr/bin/env node

const fetch = require('node-fetch');

async function testConnections() {
  console.log('🔄 Testing Backend Connections...\n');

  // Test 1: Backend Health Check
  try {
    console.log('1. Testing Backend Health...');
    const healthResponse = await fetch('http://localhost:5000/health');
    const healthData = await healthResponse.json();
    console.log('✅ Backend Health:', healthData.status);
  } catch (error) {
    console.log('❌ Backend Health Failed:', error.message);
  }

  // Test 2: Admin Login
  try {
    console.log('\n2. Testing Admin Login...');
    const adminResponse = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    const adminData = await adminResponse.json();
    if (adminData.success) {
      console.log('✅ Admin Login:', adminData.user.name, '(' + adminData.user.role + ')');
    } else {
      console.log('❌ Admin Login Failed:', adminData.error);
    }
  } catch (error) {
    console.log('❌ Admin Login Error:', error.message);
  }

  // Test 3: Razorpay Order Creation
  try {
    console.log('\n3. Testing Razorpay Order Creation...');
    const razorpayResponse = await fetch('http://localhost:5000/api/razorpay/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 1000, orderId: 'TEST_' + Date.now(), customer: 'Test User' })
    });
    const razorpayData = await razorpayResponse.json();
    if (razorpayData.success) {
      console.log('✅ Razorpay Order:', razorpayData.order.id, '(₹' + (razorpayData.order.amount / 100) + ')');
    } else {
      console.log('❌ Razorpay Failed:', razorpayData.error);
    }
  } catch (error) {
    console.log('❌ Razorpay Error:', error.message);
  }

  // Test 4: User Registration
  try {
    console.log('\n4. Testing User Registration...');
    const userResponse = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: 'Test User', 
        email: 'test' + Date.now() + '@example.com', 
        password: 'test123' 
      })
    });
    const userData = await userResponse.json();
    if (userData.success) {
      console.log('✅ User Registration:', userData.user.name, '(' + userData.user.email + ')');
    } else {
      console.log('❌ User Registration Failed:', userData.error);
    }
  } catch (error) {
    console.log('❌ User Registration Error:', error.message);
  }

  console.log('\n🎯 Connection Tests Complete!');
  console.log('\n📱 Frontend URLs:');
  console.log('   Admin Panel: http://localhost:3001');
  console.log('   E-commerce:  http://localhost:3002');
  console.log('   Backend API: http://localhost:5000');
}

testConnections();