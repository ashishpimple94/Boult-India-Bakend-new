const fs = require('fs');
const path = require('path');
require('dotenv').config();

const connectDB = require('../config/database');
const Product = require('../models/Product');
const Order = require('../models/Order');

const migrateData = async () => {
  try {
    console.log('🚀 Starting data migration...');
    
    // Connect to MongoDB
    await connectDB();

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Product.deleteMany({});
    await Order.deleteMany({});

    // Migrate Products
    console.log('📦 Migrating products...');
    const productsPath = path.join(__dirname, '../data/products.json');
    if (fs.existsSync(productsPath)) {
      const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
      
      for (const product of productsData) {
        await Product.create({
          ...product,
          isActive: true
        });
      }
      console.log(`✅ Migrated ${productsData.length} products`);
    } else {
      console.log('⚠️ Products file not found, skipping...');
    }

    // Migrate Orders
    console.log('📋 Migrating orders...');
    const ordersPath = path.join(__dirname, '../data/orders.json');
    if (fs.existsSync(ordersPath)) {
      const ordersData = JSON.parse(fs.readFileSync(ordersPath, 'utf-8'));
      
      for (const order of ordersData) {
        await Order.create({
          ...order,
          paymentStatus: order.paymentId ? 'paid' : 'pending'
        });
      }
      console.log(`✅ Migrated ${ordersData.length} orders`);
    } else {
      console.log('⚠️ Orders file not found, skipping...');
    }

    console.log('🎉 Data migration completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migration if called directly
if (require.main === module) {
  migrateData();
}

module.exports = migrateData;