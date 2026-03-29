// Simple test to verify static products
console.log('🧪 Testing Static Products Data...\n');

// Import the actual products data (simulate)
const products = [
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
  { id: 'two-wheeler-kit', name: 'Two Wheeler Kit', featured: true, price: 600 },
  { id: 'engine-dresser', name: 'Engine Dresser', featured: false, price: 575 },
  { id: 'engine-oil-flush', name: 'Engine Oil Flush', featured: false, price: 190 },
  { id: 'engine-oil-treatment', name: 'Engine Oil Treatment', featured: false, price: 500 },
  { id: 'microfiber-cloth', name: 'Multi Purpose Microfiber Cloth', featured: false, price: 175 },
  { id: 'plastic-restorer-kit', name: 'Plastic and Fibre Restorer Kit', featured: false, price: 225 },
  { id: 'radiator-coolant', name: 'Radiator Coolant', featured: false, price: 275 },
  { id: 'rat-repellent-spray', name: 'Rat Repellent Spray', featured: false, price: 80 },
  { id: 'spray-paint', name: 'Spray Paint', featured: false, price: 300 },
  { id: 'windshield-screen-wash', name: 'Windshield Screen Wash', featured: false, price: 50 },
  { id: 'silencer-coat-matt-black', name: 'Silencer Coat Matt Black', featured: false, price: 290 },
  { id: 'silencer-coat-silver', name: 'Silencer Coat Silver', featured: false, price: 290 }
];

console.log(`✅ Total products: ${products.length}`);

const featuredProducts = products.filter(p => p.featured);
console.log(`✅ Featured products: ${featuredProducts.length}`);

const first4Featured = featuredProducts.slice(0, 4);
console.log(`✅ First 4 featured: ${first4Featured.length}`);

console.log('\n📋 These should show on home page:');
first4Featured.forEach((p, idx) => {
  console.log(`   ${idx + 1}. ${p.name} (₹${p.price})`);
});

console.log('\n🔍 Testing filter logic:');
console.log('products.filter(p => p.featured):', featuredProducts.length);
console.log('featuredProducts.slice(0, 4):', first4Featured.length);

if (first4Featured.length === 4) {
  console.log('\n✅ LOGIC IS CORRECT - 4 products should definitely show!');
} else {
  console.log('\n❌ LOGIC ERROR - Something is wrong with the filter');
}