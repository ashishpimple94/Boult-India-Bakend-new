const fs = require('fs');

// Read the products file
let content = fs.readFileSync('boult-react-ecommerce/src/data/products.ts', 'utf8');

// Define the correct image mappings
const imageMap = {
  'anti-rust-spray': '/images/products/anti-rust-spray.svg',
  'battery-terminal-mask': '/images/products/battery-terminal-mask.svg',
  'brake-parts-clean': '/images/products/brake-clean.svg',
  'all-in-one-polish': '/images/products/all-in-one-polish.svg',
  'car-wash-soap': '/images/products/car-wash-soap.svg',
  'chain-clean': '/images/products/chain-clean.svg',
  'chain-lubricant-spray': '/images/products/chain-lubricant-spray.svg',
  'electrical-parts-clean': '/images/products/electrical-parts-clean.svg',
  'engine-dresser': '/images/products/engine-dresser.svg',
  'engine-oil-flush': '/images/products/engine-oil-flush.svg',
  'engine-oil-treatment': '/images/products/engine-oil-treatment.svg',
  'four-wheeler-kit': '/images/products/four-wheeler-kit.svg',
  'microfiber-cloth': '/images/products/microfiber-cloth.svg',
  'plastic-restorer-kit': '/images/products/plastic-restorer-kit.svg',
  'radiator-coolant': '/images/products/radiator-coolant.svg',
  'rat-repellent-spray': '/images/products/rat-repellent-spray.svg',
  'spray-paint': '/images/products/spray-paint.svg',
  'throttle-carburettor-clean': '/images/products/throttle-carburettor-clean.svg',
  'two-wheeler-kit': '/images/products/two-wheeler-kit.svg',
  'windshield-screen-wash': '/images/products/windshield-screen-wash.svg',
  'silencer-coat-matt-black': '/images/products/silencer-coat-matt-black.svg',
  'silencer-coat-silver': '/images/products/silencer-coat-silver.svg'
};

// Replace images for each product
Object.keys(imageMap).forEach(productId => {
  const imagePath = imageMap[productId];
  
  // Pattern to match the product and its images array
  const productPattern = new RegExp(
    `(id: '${productId}',[\\s\\S]*?images: \\[)[\\s\\S]*?(\\],)`,
    'g'
  );
  
  content = content.replace(productPattern, (match, before, after) => {
    if (productId === 'chain-clean' || productId === 'chain-lubricant-spray' || 
        productId === 'electrical-parts-clean' || productId === 'spray-paint' || 
        productId === 'throttle-carburettor-clean' || productId === 'silencer-coat-matt-black' || 
        productId === 'silencer-coat-silver') {
      // These products have 2 images
      return `${before}\n      '${imagePath}',\n      '${imagePath}'\n    ${after}`;
    } else {
      // Single image
      return `${before}\n      '${imagePath}'\n    ${after}`;
    }
  });
});

// Write the updated content back
fs.writeFileSync('boult-react-ecommerce/src/data/products.ts', content);
console.log('✅ Product images updated successfully!');