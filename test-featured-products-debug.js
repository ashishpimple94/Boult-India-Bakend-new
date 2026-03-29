const axios = require('axios');

const BACKEND_URL = 'https://boult-india-bakend-new.onrender.com';

async function debugFeaturedProducts() {
  console.log('🔍 Debugging Featured Products Display Issue...\n');

  try {
    // Test 1: Check backend products
    console.log('1. Checking backend API...');
    const backendResponse = await axios.get(`${BACKEND_URL}/api/products`);
    const backendProducts = backendResponse.data.products || [];
    console.log(`✅ Backend products: ${backendProducts.length}`);
    
    // Transform backend products (same as frontend)
    const transformedBackendProducts = backendProducts.map(product => ({
      ...product,
      images: product.image ? [product.image] : ['/placeholder-product.svg'],
      rating: product.rating || 4.5,
      reviews: product.reviews || 0
    }));

    // Test 2: Simulate static products (from data/products.ts)
    console.log('\n2. Simulating static products...');
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

    console.log(`✅ Static products: ${staticProducts.length}`);
    const staticFeatured = staticProducts.filter(p => p.featured);
    console.log(`✅ Static featured: ${staticFeatured.length}`);

    // Test 3: Simulate exact frontend logic
    console.log('\n3. Simulating exact frontend logic...');
    
    // Combine static and backend products (exact same logic as Home.tsx)
    const staticProductIds = staticProducts.map(p => p.id);
    const newBackendProducts = transformedBackendProducts.filter(p => !staticProductIds.includes(p.id));
    const allProducts = [...staticProducts, ...newBackendProducts];
    
    console.log(`✅ All products combined: ${allProducts.length}`);
    console.log(`✅ New backend products: ${newBackendProducts.length}`);
    
    // Get featured products (exact same logic as Home.tsx)
    const featured = allProducts.filter(p => p.featured).slice(0, 4);
    
    console.log(`\n🎯 FINAL RESULT:`);
    console.log(`✅ Featured products for home page: ${featured.length}`);
    
    if (featured.length > 0) {
      console.log('\n📋 Featured products that should display:');
      featured.forEach((p, idx) => {
        console.log(`   ${idx + 1}. ${p.name} ${p.price ? `(₹${p.price})` : ''}`);
      });
      
      console.log('\n✅ HOME PAGE SHOULD SHOW 4 FEATURED PRODUCTS!');
      console.log('   If not showing, there might be a frontend rendering issue.');
    } else {
      console.log('\n❌ NO FEATURED PRODUCTS FOUND!');
      console.log('   This would show "No featured products available" message.');
    }

    // Test 4: Check if API is accessible from frontend
    console.log('\n4. Testing API accessibility...');
    try {
      const testResponse = await axios.get(`${BACKEND_URL}/api/products`, {
        timeout: 5000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ API is accessible and responding correctly');
    } catch (apiError) {
      console.log('❌ API accessibility issue:', apiError.message);
      console.log('   This could cause frontend to fallback to static products only');
    }

  } catch (error) {
    console.error('❌ Error in debug:', error.message);
  }
}

// Run the debug
debugFeaturedProducts();