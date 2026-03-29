const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/boult-ecommerce';

// Order Schema
const orderSchema = new mongoose.Schema({
  id: String,
  customer: String,
  email: String,
  phone: String,
  amount: Number,
  shippingCharges: { type: Number, default: 0 },
  status: String,
  date: Date,
  items: Array,
  address: String,
  city: String,
  state: String,
  pincode: String,
  paymentMethod: String,
  deliveryDate: String,
  courierPartner: String,
  processingDateTime: Date,
  dispatchDateTime: Date,
  deliveredDateTime: Date
}, { collection: 'orders' });

const Order = mongoose.model('Order', orderSchema);

async function deleteAllOrders() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Count orders before deletion
    const countBefore = await Order.countDocuments();
    console.log(`📦 Total orders before deletion: ${countBefore}`);

    if (countBefore === 0) {
      console.log('ℹ️  No orders to delete');
      await mongoose.connection.close();
      return;
    }

    // Delete all orders
    console.log('🗑️  Deleting all orders...');
    const result = await Order.deleteMany({});
    console.log(`✅ Successfully deleted ${result.deletedCount} orders`);

    // Verify deletion
    const countAfter = await Order.countDocuments();
    console.log(`📦 Total orders after deletion: ${countAfter}`);

    console.log('✅ All orders deleted successfully!');
    console.log('🔄 Fresh start - ready for new orders');

    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');

  } catch (error) {
    console.error('❌ Error deleting orders:', error);
    process.exit(1);
  }
}

// Run the deletion
deleteAllOrders();
