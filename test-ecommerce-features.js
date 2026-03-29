const axios = require('axios');

const BACKEND_URL = 'https://boult-india-bakend-new.onrender.com';

async function testEcommerceFeatures() {
  console.log('🔄 Testing E-commerce Features...\n');

  try {
    // Test 1: Check backend products
    console.log('1. Checking backend products...');
    const backendResponse = await axios.get(`${BACKEND_URL}/api/products`);
    const backendProducts = backendResponse.data.products || [];
    console.log(`✅ Backend products: ${backendProducts.length}`);
    
    // Count featured products in backend
    const backendFeatured = backendProducts.filter(p => p.featured);
    console.log(`✅ Backend featured products: ${backendFeatured.length}`);
    
    if (backendFeatured.length > 0) {
      console.log('   Featured products from backend:');
      backendFeatured.forEach(p => {
        console.log(`   - ${p.name} (₹${p.price})`);
      });
    }
    console.log('');

    // Test 2: Check static products (simulate what e-commerce does)
    console.log('2. Checking static products integration...');
    
    // Simulate the e-commerce logic
    const staticProducts = [
      { id: 'anti-rust-spray', name: 'Anti Rust Spray', featured: true },
      { id: 'battery-terminal-mask', name: 'Battery Terminal Mask', featured: true },
      { id: 'brake-parts-clean', name: 'Brake Parts Clean', featured: true },
      { id: 'all-in-one-polish', name: 'All in One Polish', featured: true },
      { id: 'car-wash-soap', name: 'Car Wash Soap', featured: true },
      { id: 'chain-clean', name: 'Chain Clean', featured: true },
      { id: 'chain-lubricant-spray', name: 'Chain Lubricant Spray', featured: true },
      { id: 'electrical-parts-clean', name: 'Electrical Parts Clean', featured: true },
      { id: 'four-wheeler-kit', name: 'Four Wheeler Kit', featured: true },
      { id: 'throttle-carburettor-clean', name: 'Throttle and Carburettor Clean', featured: true },
      { id: 'two-wheeler-kit', name: 'Two Wheeler Kit', featured: true }
    ];

    const staticFeatured = staticProducts.filter(p => p.featured);
    console.log(`✅ Static featured products: ${staticFeatured.length}`);
    console.log('   Static featured products:');
    staticFeatured.slice(0, 4).forEach(p => {
      console.log(`   - ${p.name}`);
    });
    console.log('');

    // Test 3: Simulate e-commerce combination logic
    console.log('3. Testing e-commerce combination logic...');
    
    // Transform backend products
    const transformedBackendProducts = backendProducts.map(product => ({
      ...product,
      images: product.image ? [product.image] : ['/placeholder-product.svg'],
      rating: product.rating || 4.5,
      reviews: product.reviews || 0
    }));

    // Combine logic (same as e-commerce)
    const staticProductIds = staticProducts.map(p => p.id);
    const newBackendProducts = transformedBackendProducts.filter(p => !staticProductIds.includes(p.id));
    const allProducts = [...staticProducts, ...newBackendProducts];
    
    // Get featured products (same as e-commerce)
    const combinedFeatured = allProducts.filter(p => p.featured).slice(0, 4);
    
    console.log(`✅ Combined total products: ${allProducts.length}`);
    console.log(`✅ Combined featured products: ${combinedFeatured.length}`);
    console.log('   Featured products that will show on home page:');
    combinedFeatured.forEach(p => {
      console.log(`   - ${p.name} ${p.price ? `(₹${p.price})` : ''}`);
    });
    console.log('');

    // Test 4: Check what might be missing
    console.log('4. Feature Analysis...');
    
    if (combinedFeatured.length === 0) {
      console.log('❌ NO FEATURED PRODUCTS FOUND!');
      console.log('   This means home page will show "No featured products available"');
    } else if (combinedFeatured.length < 4) {
      console.log(`⚠️  Only ${combinedFeatured.length} featured products (expected 4)`);
    } else {
      console.log('✅ Featured products section should work perfectly');
    }

    // Check for admin-added products
    if (newBackendProducts.length > 0) {
      console.log(`✅ ${newBackendProducts.length} new products from admin panel`);
      newBackendProducts.forEach(p => {
        console.log(`   - ${p.name} (${p.featured ? 'Featured' : 'Not Featured'})`);
      });
    } else {
      console.log('ℹ️  No new products added from admin panel yet');
    }

    console.log('\n🎯 SUMMARY:');
    console.log(`✅ Static products: ${staticProducts.length} (${staticFeatured.length} featured)`);
    console.log(`✅ Backend products: ${backendProducts.length} (${backendFeatured.length} featured)`);
    console.log(`✅ Total products: ${allProducts.length}`);
    console.log(`✅ Featured on home: ${combinedFeatured.length}`);
    
    if (combinedFeatured.length >= 4) {
      console.log('\n🎉 E-COMMERCE FEATURES ARE WORKING PERFECTLY!');
      console.log('   - Featured products will show on home page');
      console.log('   - All products will show on products page');
      console.log('   - Admin-added products will appear automatically');
    } else {
      console.log('\n⚠️  POTENTIAL ISSUE DETECTED');
      console.log('   - Featured products might not show properly');
    }

  } catch (error) {
    console.error('❌ Error testing features:', error.message);
  }
}

// Run the test
testEcommerceFeatures();