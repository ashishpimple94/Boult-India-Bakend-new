const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://boultindia:Test12345@cluster0.ezzkjmw.mongodb.net/boult-india?retryWrites=true&w=majority&appName=Cluster0';

// Order Schema
const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customer: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  amount: Number,
  paymentMethod: String,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  items: Array,
  status: { type: String, default: 'pending' },
  date: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

async function importOrders() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB!\n');

    // Read orders from JSON file
    const ordersFile = path.join(__dirname, 'data', 'orders.json');
    
    if (!fs.existsSync(ordersFile)) {
      console.log('❌ No orders.json file found!');
      process.exit(1);
    }

    const ordersData = JSON.parse(fs.readFileSync(ordersFile, 'utf-8'));
    console.log(`📦 Found ${ordersData.length} orders in JSON file\n`);

    if (ordersData.length === 0) {
      console.log('⚠️  No orders to import!');
      process.exit(0);
    }

    // Import each order
    let imported = 0;
    let skipped = 0;

    for (const orderData of ordersData) {
      try {
        // Check if order already exists
        const existing = await Order.findOne({ id: orderData.id });
        
        if (existing) {
          console.log(`⏭️  Skipped: ${orderData.id} (already exists)`);
          skipped++;
          continue;
        }

        // Create new order
        const order = new Order(orderData);
        await order.save();
        
        console.log(`✅ Imported: ${orderData.id} - ${orderData.customer} - ₹${orderData.amount}`);
        imported++;
      } catch (err) {
        console.error(`❌ Failed to import ${orderData.id}:`, err.message);
      }
    }

    console.log('\n📊 IMPORT SUMMARY:');
    console.log(`✅ Imported: ${imported} orders`);
    console.log(`⏭️  Skipped: ${skipped} orders (already existed)`);
    console.log(`📦 Total in MongoDB: ${await Order.countDocuments()}`);
    
    console.log('\n🎉 Import complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

importOrders();
