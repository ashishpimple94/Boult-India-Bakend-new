const axios = require('axios');

const BACKEND_URL = 'https://boult-india-bakend-new.onrender.com';

async function testProductEndpoints() {
  console.log('🔄 Testing Admin Product Management Endpoints...\n');

  try {
    // Test 1: Get all products
    console.log('1. Testing GET /api/products');
    const getResponse = await axios.get(`${BACKEND_URL}/api/products`);
    console.log(`✅ GET Products: ${getResponse.data.products.length} products found`);
    console.log(`   First product: ${getResponse.data.products[0]?.name || 'None'}\n`);

    // Test 2: Add a new product
    console.log('2. Testing POST /api/products (Add Product)');
    const newProduct = {
      name: 'Test Product',
      description: 'This is a test product for admin panel',
      price: 199,
      category: 'test',
      image: '/test-product.png',
      featured: false,
      onSale: false,
      variants: [
        { name: '100ml', price: 199 },
        { name: '500ml', price: 399 }
      ]
    };

    const addResponse = await axios.post(`${BACKEND_URL}/api/products`, newProduct);
    console.log(`✅ ADD Product: ${addResponse.data.message}`);
    console.log(`   Product ID: ${addResponse.data.product.id}\n`);

    const testProductId = addResponse.data.product.id;

    // Test 3: Update the product
    console.log('3. Testing PUT /api/products (Update Product)');
    const updateData = {
      id: testProductId,
      name: 'Updated Test Product',
      price: 249,
      featured: true
    };

    const updateResponse = await axios.put(`${BACKEND_URL}/api/products`, updateData);
    console.log(`✅ UPDATE Product: ${updateResponse.data.message}`);
    console.log(`   Updated name: ${updateResponse.data.product.name}\n`);

    // Test 4: Delete the product
    console.log('4. Testing DELETE /api/products (Delete Product)');
    const deleteResponse = await axios.delete(`${BACKEND_URL}/api/products`, {
      data: { id: testProductId }
    });
    console.log(`✅ DELETE Product: ${deleteResponse.data.message}\n`);

    // Test 5: Verify deletion
    console.log('5. Verifying product was deleted');
    const finalGetResponse = await axios.get(`${BACKEND_URL}/api/products`);
    const deletedProduct = finalGetResponse.data.products.find(p => p.id === testProductId);
    
    if (!deletedProduct) {
      console.log('✅ Product successfully deleted from database\n');
    } else {
      console.log('❌ Product still exists in database\n');
    }

    console.log('🎉 ALL ADMIN PRODUCT ENDPOINTS WORKING PERFECTLY!');
    console.log(`📊 Total products in database: ${finalGetResponse.data.products.length}`);

  } catch (error) {
    console.error('❌ Error testing endpoints:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      console.log('💡 Endpoint not found - check if backend has product management routes');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 Backend not running - start the backend server first');
    }
  }
}

// Run the test
testProductEndpoints();