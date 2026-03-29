const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://boultindia:Test12345@cluster0.ezzkjmw.mongodb.net/boult-india?retryWrites=true&w=majority&appName=Cluster0';

// Product Schema
const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  featured: Boolean,
  inStock: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

async function importProducts() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB!\n');

    // Read products from JSON file
    const productsFile = path.join(__dirname, 'data', 'products.json');
    
    if (!fs.existsSync(productsFile)) {
      console.log('❌ No products.json file found!');
      process.exit(1);
    }

    const productsData = JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
    console.log(`📦 Found ${productsData.length} products in JSON file\n`);

    if (productsData.length === 0) {
      console.log('⚠️  No products to import!');
      process.exit(0);
    }

    // Import each product
    let imported = 0;
    let skipped = 0;

    for (const productData of productsData) {
      try {
        // Check if product already exists
        const existing = await Product.findOne({ id: productData.id });
        
        if (existing) {
          console.log(`⏭️  Skipped: ${productData.name} (already exists)`);
          skipped++;
          continue;
        }

        // Create new product
        const product = new Product(productData);
        await product.save();
        
        console.log(`✅ Imported: ${productData.name} - ₹${productData.price}`);
        imported++;
      } catch (err) {
        console.error(`❌ Failed to import ${productData.name}:`, err.message);
      }
    }

    console.log('\n📊 IMPORT SUMMARY:');
    console.log(`✅ Imported: ${imported} products`);
    console.log(`⏭️  Skipped: ${skipped} products (already existed)`);
    console.log(`📦 Total in MongoDB: ${await Product.countDocuments()}`);
    
    console.log('\n🎉 Import complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

importProducts();
