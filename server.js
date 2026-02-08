const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { sendOrderConfirmation } = require('./services/emailService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://boultindia:Test12345@cluster0.ezzkjmw.mongodb.net/boult-india?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected - Orders are PERMANENT!'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// MongoDB Schemas
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

const bannerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  image: String,
  link: String,
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
const Product = mongoose.model('Product', productSchema);
const Banner = mongoose.model('Banner', bannerSchema);

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const allowedOrigins = [
      'http://localhost:3000', 
      'http://localhost:3001', 
      'https://boultindia.com',
      'https://www.boultindia.com',
      'https://admin.boultindia.com',
      'https://boult-india-backend-new.onrender.com'
    ];
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// File upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'Boult India Backend Running with MongoDB!',
    database: 'MongoDB Atlas',
    orders: 'PERMANENT STORAGE',
    timestamp: new Date().toISOString()
  });
});

// ============ ORDERS API ============

// GET all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json({ 
      success: true, 
      orders, 
      count: orders.length,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

// POST save order
app.post('/api/save-order', async (req, res) => {
  try {
    const orderData = req.body;
    
    if (!orderData.id || !orderData.email || !orderData.amount) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Check if order exists
    const existing = await Order.findOne({ id: orderData.id });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Order already exists' });
    }

    // Create order
    const order = new Order(orderData);
    await order.save();
    
    console.log(`✅ Order saved to MongoDB: ${order.id}`);
    
    // Send email
    sendOrderConfirmation(orderData).then(result => {
      if (result.success) {
        console.log('✅ Order confirmation email sent');
      } else {
        console.error('❌ Email failed:', result.error);
      }
    }).catch(err => console.error('❌ Email error:', err));
    
    res.json({ 
      success: true, 
      message: 'Order saved permanently in MongoDB', 
      orderId: order.id,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ success: false, error: 'Failed to save order' });
  }
});

// PUT update order
app.put('/api/update-order', async (req, res) => {
  try {
    const { orderId, ...updates } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ success: false, error: 'Order ID required' });
    }

    const order = await Order.findOneAndUpdate(
      { id: orderId },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({ 
      success: true, 
      message: 'Order updated', 
      order,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ success: false, error: 'Failed to update order' });
  }
});

// DELETE order - DISABLED FOR SAFETY
app.delete('/api/delete-order', (req, res) => {
  res.status(403).json({ 
    success: false, 
    error: 'Order deletion is DISABLED for data protection',
    message: 'Orders cannot be deleted - they are permanent records'
  });
});

// ============ PRODUCTS API ============

// GET all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products, count: products.length });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

// POST add product
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const productData = {
      ...req.body,
      id: `PROD_${Date.now()}`,
      price: parseFloat(req.body.price),
      image: req.file ? `/uploads/${req.file.filename}` : req.body.image,
      createdAt: new Date().toISOString()
    };

    const product = new Product(productData);
    await product.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Product added', 
      product 
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, error: 'Failed to add product' });
  }
});

// PUT update product
app.put('/api/products', async (req, res) => {
  try {
    const { id, ...updates } = req.body;
    
    if (!id) {
      return res.status(400).json({ success: false, error: 'Product ID required' });
    }

    const product = await Product.findOneAndUpdate(
      { id },
      { ...updates, price: parseFloat(updates.price), updatedAt: new Date() },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({ success: true, message: 'Product updated', product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, error: 'Failed to update product' });
  }
});

// DELETE product
app.delete('/api/products', async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ success: false, error: 'Product ID required' });
    }

    const product = await Product.findOneAndDelete({ id });
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
});

// ============ BANNERS API ============

// GET all banners
app.get('/api/banners', async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, banners, count: banners.length });
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch banners' });
  }
});

// GET active banners only (for ecommerce site)
app.get('/api/banners/active', async (req, res) => {
  try {
    const banners = await Banner.find({ active: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, banners, count: banners.length });
  } catch (error) {
    console.error('Error fetching active banners:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch active banners' });
  }
});

// POST add banner
app.post('/api/banners', upload.single('image'), async (req, res) => {
  try {
    const bannerData = {
      ...req.body,
      id: `BANNER_${Date.now()}`,
      image: req.file ? `/uploads/${req.file.filename}` : req.body.image,
      active: req.body.active === 'true' || req.body.active === true,
      order: parseInt(req.body.order) || 0,
      createdAt: new Date().toISOString()
    };

    const banner = new Banner(bannerData);
    await banner.save();
    
    console.log(`✅ Banner added: ${banner.id}`);
    res.status(201).json({ 
      success: true, 
      message: 'Banner added successfully', 
      banner 
    });
  } catch (error) {
    console.error('Error adding banner:', error);
    res.status(500).json({ success: false, error: 'Failed to add banner' });
  }
});

// PUT update banner
app.put('/api/banners', async (req, res) => {
  try {
    const { id, ...updates } = req.body;
    
    if (!id) {
      return res.status(400).json({ success: false, error: 'Banner ID required' });
    }

    // Convert active to boolean if it's a string
    if (typeof updates.active === 'string') {
      updates.active = updates.active === 'true';
    }

    // Convert order to number
    if (updates.order) {
      updates.order = parseInt(updates.order);
    }

    const banner = await Banner.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
    
    if (!banner) {
      return res.status(404).json({ success: false, error: 'Banner not found' });
    }

    console.log(`✅ Banner updated: ${banner.id}`);
    res.json({ success: true, message: 'Banner updated successfully', banner });
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).json({ success: false, error: 'Failed to update banner' });
  }
});

// DELETE banner
app.delete('/api/banners', async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ success: false, error: 'Banner ID required' });
    }

    const banner = await Banner.findOneAndDelete({ id });
    
    if (!banner) {
      return res.status(404).json({ success: false, error: 'Banner not found' });
    }

    console.log(`✅ Banner deleted: ${banner.id}`);
    res.json({ success: true, message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({ success: false, error: 'Failed to delete banner' });
  }
});

// ============ RAZORPAY API ============

// Create Razorpay order
app.post('/api/razorpay/create-order', async (req, res) => {
  try {
    const { amount, orderId, customer } = req.body;
    
    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: orderId,
      notes: { customer, orderId }
    };
    
    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.error('Razorpay error:', error);
    res.status(500).json({ success: false, error: 'Failed to create Razorpay order' });
  }
});

// Verify Razorpay payment
app.post('/api/razorpay/verify', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');
    
    if (razorpay_signature === expectedSign) {
      res.json({ success: true, message: 'Payment verified' });
    } else {
      res.status(400).json({ success: false, error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ success: false, error: 'Verification failed' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📊 Database: MongoDB Atlas`);
  console.log(`✅ Orders: PERMANENT STORAGE`);
  console.log(`📧 Emails: Hostinger SMTP\n`);
});
