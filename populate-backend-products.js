const axios = require('axios');
const fs = require('fs');

const BACKEND_URL = 'https://boult-india-bakend-new.onrender.com';

async function populateProducts() {
  console.log('🔄 Populating backend with existing products...\n');

  try {
    // Read the products from the local file
    const productsData = fs.readFileSync('./boult-backend/data/products.json', 'utf-8');
    const products = JSON.parse(productsData);

    console.log(`📦 Found ${products.length} products to upload\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        console.log(`⬆️  Uploading: ${product.name}`);
        
        const response = await axios.post(`${BACKEND_URL}/api/products`, product);
        
        if (response.data.success) {
          console.log(`✅ Success: ${product.name}`);
          successCount++;
        } else {
          console.log(`❌ Failed: ${product.name} - ${response.data.error}`);
          errorCount++;
        }
      } catch (error) {
        console.log(`❌ Error: ${product.name} - ${error.response?.data?.error || error.message}`);
        errorCount++;
      }

      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n📊 Upload Summary:`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`📦 Total: ${products.length}`);

    // Verify the upload
    console.log(`\n🔍 Verifying products in backend...`);
    const getResponse = await axios.get(`${BACKEND_URL}/api/products`);
    console.log(`✅ Backend now has ${getResponse.data.products.length} products`);

    if (getResponse.data.products.length > 0) {
      console.log(`\n🎉 SUCCESS! Admin panel can now manage products!`);
      console.log(`\n📋 Available products:`);
      getResponse.data.products.slice(0, 5).forEach(p => {
        console.log(`   • ${p.name} - ₹${p.price}`);
      });
      if (getResponse.data.products.length > 5) {
        console.log(`   ... and ${getResponse.data.products.length - 5} more`);
      }
    }

  } catch (error) {
    console.error('❌ Error populating products:', error.message);
  }
}

// Run the population
populateProducts();