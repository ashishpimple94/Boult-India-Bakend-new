// Test static featured products
const staticProducts = [
  { id: 'anti-rust-spray', name: 'Anti Rust Spray', featured: true, price: 90 },
  { id: 'battery-terminal-mask', name: 'Battery Terminal Mask', featured: true, price: 265 },
  { id: 'brake-parts-clean', name: 'Brake Parts Clean', featured: true, price: 205 },
  { id: 'all-in-one-polish', name: 'All in One Polish', featured: true, price: 1800 },
  { id: 'car-wash-soap', name: 'Car Wash Soap', featured: true, price: 325 },
  { id: 'chain-clean', name: 'Chain Clean', featured: true, price: 220 },
  { id: 'chain-lubricant-spray', name: 'Chain Lubricant Spray', featured: true, price: 175 },
  { id: 'electrical-parts-clean', name: 'Electrical Parts Clean', featured: true, price: 275 },
  { id: 'four-wheeler-kit', name: 'Four Wheeler Kit', featured: true, price: 675 },
  { id: 'throttle-carburettor-clean', name: 'Throttle and Carburettor Clean', featured: true, price: 225 },
  { id: 'two-wheeler-kit', name: 'Two Wheeler Kit', featured: true, price: 600 }
];

console.log('🧪 Testing Static Featured Products...\n');

const allFeatured = staticProducts.filter(p => p.featured);
console.log(`✅ Total featured products: ${allFeatured.length}`);

const first4Featured = allFeatured.slice(0, 4);
console.log(`✅ First 4 featured products: ${first4Featured.length}`);

console.log('\n📋 Featured products that should display on home page:');
first4Featured.forEach((p, idx) => {
  console.log(`   ${idx + 1}. ${p.name} (₹${p.price})`);
});

console.log('\n🎯 RESULT: These 4 products should definitely show on home page!');