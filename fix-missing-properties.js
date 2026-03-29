const fs = require('fs');

// Read the products file
let content = fs.readFileSync('boult-react-ecommerce/src/data/products.ts', 'utf8');

// Add missing rating and reviews after images array for products that don't have them
const fixes = [
  {
    id: 'four-wheeler-kit',
    rating: 4.7,
    reviews: 203
  },
  {
    id: 'microfiber-cloth', 
    rating: 4.6,
    reviews: 234
  },
  {
    id: 'plastic-restorer-kit',
    rating: 4.3,
    reviews: 145
  },
  {
    id: 'radiator-coolant',
    rating: 4.5,
    reviews: 167
  },
  {
    id: 'rat-repellent-spray',
    rating: 4.2,
    reviews: 89
  },
  {
    id: 'spray-paint',
    rating: 4.4,
    reviews: 134
  },
  {
    id: 'two-wheeler-kit',
    rating: 4.7,
    reviews: 267
  },
  {
    id: 'windshield-screen-wash',
    rating: 4.5,
    reviews: 198
  },
  {
    id: 'silencer-coat-matt-black',
    rating: 4.5,
    reviews: 156
  },
  {
    id: 'silencer-coat-silver',
    rating: 4.5,
    reviews: 156
  }
];

fixes.forEach(fix => {
  // Pattern to find the product and add rating/reviews after images
  const pattern = new RegExp(
    `(id: '${fix.id}',[\\s\\S]*?images: \\[[\\s\\S]*?\\],)([\\s\\S]*?variants)`,
    'g'
  );
  
  content = content.replace(pattern, (match, beforeVariants, afterImages) => {
    return `${beforeVariants}\n    rating: ${fix.rating},\n    reviews: ${fix.reviews},\n    ${afterImages}`;
  });
  
  // For products without variants, add before specifications
  const patternNoVariants = new RegExp(
    `(id: '${fix.id}',[\\s\\S]*?images: \\[[\\s\\S]*?\\],)([\\s\\S]*?specifications)`,
    'g'
  );
  
  content = content.replace(patternNoVariants, (match, beforeSpecs, afterImages) => {
    if (!match.includes('rating:')) {
      return `${beforeSpecs}\n    rating: ${fix.rating},\n    reviews: ${fix.reviews},\n    ${afterImages}`;
    }
    return match;
  });
});

// Write the updated content back
fs.writeFileSync('boult-react-ecommerce/src/data/products.ts', content);
console.log('✅ Missing properties added successfully!');