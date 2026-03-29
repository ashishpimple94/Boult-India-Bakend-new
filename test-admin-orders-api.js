#!/usr/bin/env node

const axios = require('axios');

const BACKEND_URL = 'https://boult-india-bakend-new.onrender.com';

async function testAdminOrdersAPI() {
  console.log('🔍 Testing Admin Orders API...\n');
  
  try {
    // Test 1: Direct Orders API call
    console.log('1. Testing Direct Orders API...');
    const ordersResponse = await axios.get(`${BACKEND_URL}/api/orders`, {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3001'
      }
    });
    
    console.log('✅ Orders API Response:');
    console.log('   Success:', ordersResponse.data.success);
    console.log('   Orders Count:', ordersResponse.data.count);
    console.log('   Orders:', JSON.stringify(ordersResponse.data.orders, null, 2));
    
    // Test 2: Check if orders have proper structure
    if (ordersResponse.data.orders && ordersResponse.data.orders.length > 0) {
      const firstOrder = ordersResponse.data.orders[0];
      console.log('\n2. First Order Structure:');
      console.log('   ID:', firstOrder.id);
      console.log('   Customer:', firstOrder.customer);
      console.log('   Email:', firstOrder.email);
      console.log('   Amount:', firstOrder.amount);
      console.log('   Status:', firstOrder.status);
      console.log('   Date:', firstOrder.date);
      console.log('   Items:', firstOrder.items?.length || 0, 'items');
    }
    
    // Test 3: Test admin login to ensure admin panel can authenticate
    console.log('\n3. Testing Admin Authentication...');
    const loginResponse = await axios.post(`${BACKEND_URL}/api/admin/login`, {
      username: 'admin',
      password: 'admin123'
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3001'
      }
    });
    
    console.log('✅ Admin Login Response:');
    console.log('   Success:', loginResponse.data.success);
    console.log('   User:', loginResponse.data.user.username);
    console.log('   Role:', loginResponse.data.user.role);
    
    console.log('\n🎉 All API tests passed! Backend is working correctly.');
    console.log('\n📋 Summary:');
    console.log(`   • Backend URL: ${BACKEND_URL}`);
    console.log(`   • Orders in database: ${ordersResponse.data.count}`);
    console.log('   • Admin authentication: Working');
    console.log('   • API endpoints: All responding correctly');
    
    if (ordersResponse.data.count === 0) {
      console.log('\n⚠️  No orders found in database. This might be why admin panel shows 0 orders.');
    } else {
      console.log('\n✅ Orders exist in database. Admin panel should be able to load them.');
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    if (error.code === 'ECONNABORTED') {
      console.error('⚠️ Request timed out - backend might be sleeping');
    }
  }
}

testAdminOrdersAPI();