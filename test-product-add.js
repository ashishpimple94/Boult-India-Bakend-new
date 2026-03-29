#!/usr/bin/env node

const axios = require('axios');

const BACKEND_URL = 'https://boult-india-bakend-new.onrender.com';

async function testProductAdd() {
  console.log('🔍 Testing Product Add Functionality...\n');
  
  try {
    // Test 1: Add a simple product
    console.log('1. Testing Add Product...');
    const productData = {
      name: 'Test Product',
      description: 'This is a test product',
      price: 100,
      category: 'test',
      image: '/test-image.png',
      featured: false,
      onSale: false,
      variants: [],
      specifications: [],
      directions: [],
      benefits: []
    };
    
    const addResponse = await axios.post(`${BACKEND_URL}/api/products`, productData, {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://login.boultindia.com'
      }
    });
    
    console.log('✅ Add Product Response:', addResponse.data);
    
    // Test 2: Get all products to verify
    console.log('\n2. Testing Get Products...');
    const getResponse = await axios.get(`${BACKEND_URL}/api/products`, {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://login.boultindia.com'
      }
    });
    
    console.log('✅ Get Products Response:', getResponse.data);
    console.log('Products count:', getResponse.data.products?.length || 0);
    
    if (getResponse.data.products?.length > 0) {
      const productId = getResponse.data.products[0].id;
      
      // Test 3: Delete the test product
      console.log('\n3. Testing Delete Product...');
      const deleteResponse = await axios.delete(`${BACKEND_URL}/api/products`, {
        data: { id: productId },
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://login.boultindia.com'
        }
      });
      
      console.log('✅ Delete Product Response:', deleteResponse.data);
    }
    
    console.log('\n🎉 All product operations working correctly!');
    
  } catch (error) {
    console.error('❌ Product operation failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testProductAdd();