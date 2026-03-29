const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000';

async function testProductImages() {
  console.log('🧪 Testing Product Images from Backend\n');
  
  try {
    // Test 1: Fetch products
    console.log('1️⃣ Fetching products from backend...');
    const response = await axios.get(`${BACKEND_URL}/api/products`);
    const products = response.data.products;
    
    console.log(`✅ Fetched ${products.length} products\n`);
    
    // Test 2: Check first 5 product images
    console.log('2️⃣ Checking first 5 product image URLs:\n');
    for (let i = 0; i < Math.min(5, products.length); i++) {
      const product = products[i];
      console.log(`Product: ${product.name}`);
      console.log(`Image URL: ${product.image}`);
      
      // Try to fetch the image
      try {
        const imgResponse = await axios.head(product.image);
        console.log(`✅ Image accessible (Status: ${imgResponse.status})`);
      } catch (error) {
        console.log(`❌ Image NOT accessible`);
      }
      console.log('');
    }
    
    // Test 3: Check image URL format
    console.log('3️⃣ Checking image URL formats:\n');
    const imageFormats = {
      'Full URL (http/https)': 0,
      'Relative path (/)': 0,
      'Uploads path (/uploads/)': 0,
      'Product images path (/product-images/)': 0,
      'Other': 0
    };
    
    products.forEach(p => {
      if (p.image.startsWith('http')) {
        imageFormats['Full URL (http/https)']++;
      } else if (p.image.startsWith('/uploads/')) {
        imageFormats['Uploads path (/uploads/)']++;
      } else if (p.image.startsWith('/product-images/')) {
        imageFormats['Product images path (/product-images/)']++;
      } else if (p.image.startsWith('/')) {
        imageFormats['Relative path (/)']++;
      } else {
        imageFormats['Other']++;
      }
    });
    
    console.log('Image URL Format Distribution:');
    Object.entries(imageFormats).forEach(([format, count]) => {
      if (count > 0) {
        console.log(`  ${format}: ${count} products`);
      }
    });
    
    console.log('\n✅ All tests completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testProductImages();
