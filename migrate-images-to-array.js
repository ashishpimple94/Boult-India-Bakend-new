const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://boultindia:Test12345@cluster0.ezzkjmw.mongodb.net/boult-india?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// Product Schema
const productSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  discount: Number,
  image: String,
  images: [String],
  category: String,
  featured: Boolean,
  onSale: Boolean,
  rating: Number,
  reviews: Number,
  variants: Array,
  stock: Number,
  tags: [String],
  isActive: Boolean
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

async function migrateImages() {
  try {
    console.log('\n🔄 Starting image migration...\n');
    
    // Find all products
    const products = await Product.find();
    console.log(`📦 Found ${products.length} products\n`);
    
    let updated = 0;
    let skipped = 0;
    
    for (const product of products) {
      // Check if images array is empty but image field exists
      if ((!product.images || product.images.length === 0) && product.image) {
        console.log(`🔧 Updating: ${product.name}`);
        console.log(`   Old: image="${product.image}", images=${JSON.stringify(product.images)}`);
        
        // Update images array with the image field value
        product.images = [product.image];
        await product.save();
        
        console.log(`   New: images=${JSON.stringify(product.images)}`);
        console.log(`   ✅ Updated!\n`);
        updated++;
      } else if (product.images && product.images.length > 0) {
        console.log(`⏭️  Skipping: ${product.name} (already has images array)`);
        skipped++;
      } else {
        console.log(`⚠️  Warning: ${product.name} has no image at all!`);
        // Set placeholder
        product.images = ['/placeholder-product.svg'];
        await product.save();
        updated++;
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 Migration Summary:');
    console.log('='.repeat(50));
    console.log(`✅ Updated: ${updated} products`);
    console.log(`⏭️  Skipped: ${skipped} products`);
    console.log(`📦 Total: ${products.length} products`);
    console.log('='.repeat(50));
    console.log('\n✨ Migration complete!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateImages();
