#!/usr/bin/env node

const axios = require('axios');

const BACKEND_URL = 'https://boult-india-bakend-new.onrender.com';

async function testConnection() {
  console.log('🔍 Testing Backend Connection...\n');
  
  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BACKEND_URL}/health`, {
      timeout: 10000
    });
    console.log('✅ Health Check:', healthResponse.data);
    
    // Test 2: Products API
    console.log('\n2. Testing Products API...');
    const productsResponse = await axios.get(`${BACKEND_URL}/api/products`, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://boultindia.com'
      }
    });
    console.log('✅ Products API:', productsResponse.data);
    
    // Test 3: Test Connection Endpoint
    console.log('\n3. Testing Connection Endpoint...');
    const testResponse = await axios.get(`${BACKEND_URL}/api/test-connection`, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://boultindia.com'
      }
    });
    console.log('✅ Test Connection:', testResponse.data);
    
    // Test 4: Admin Login
    console.log('\n4. Testing Admin Login...');
    const loginResponse = await axios.post(`${BACKEND_URL}/api/admin/login`, {
      username: 'admin',
      password: 'admin123'
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://boultindia.com'
      }
    });
    console.log('✅ Admin Login:', loginResponse.data);
    
    console.log('\n🎉 All tests passed! Backend is working correctly.');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    if (error.code === 'ECONNABORTED') {
      console.error('⚠️ Request timed out - backend might be sleeping');
    }
  }
}

testConnection();