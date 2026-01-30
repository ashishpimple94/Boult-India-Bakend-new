const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000', 
      'http://localhost:3001', 
      'http://localhost:3002',
      'http://localhost:3003',
      'https://boult-india-ecommerce.vercel.app',
      'https://boult-india-admin.vercel.app',
      process.env.FRONTEND_URL,
      process.env.ADMIN_URL
    ].filter(Boolean);
    
    // Allow any localhost origin for development
    if (origin.includes('localhost') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cache-Control',
    'X-File-Name'
  ],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  optionsSuccessStatus: 200,
  preflightContinue: false
}));
app.use(express.json());

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Data file paths
const productsFile = path.join(__dirname, 'data', 'products.json');
const ordersFile = path.join(__dirname, 'data', 'orders.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// Initialize files if they don't exist
if (!fs.existsSync(productsFile)) {
  fs.writeFileSync(productsFile, '[]');
}
if (!fs.existsSync(ordersFile)) {
  fs.writeFileSync(ordersFile, '[]');
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal server error' });
});

// GET all products
app.get('/api/products', (req, res) => {
  try {
    const data = fs.readFileSync(productsFile, 'utf-8');
    const products = JSON.parse(data);
    res.json({ success: true, products, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error reading products:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

// POST save order
app.post('/api/save-order', (req, res) => {
  try {
    const order = req.body;
    
    // Validate order data
    if (!order.id || !order.email || !order.amount) {
      return res.status(400).json({ success: false, error: 'Missing required order fields' });
    }

    const data = fs.readFileSync(ordersFile, 'utf-8');
    const orders = JSON.parse(data);
    
    // Check if order already exists
    if (orders.find(o => o.id === order.id)) {
      return res.status(400).json({ success: false, error: 'Order already exists' });
    }

    orders.push(order);
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
    res.json({ success: true, message: 'Order saved', orderId: order.id, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ success: false, error: 'Failed to save order' });
  }
});

// GET all orders
app.get('/api/orders', (req, res) => {
  try {
    const data = fs.readFileSync(ordersFile, 'utf-8');
    const orders = JSON.parse(data);
    res.json({ success: true, orders, count: orders.length, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error reading orders:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

// GET order by ID
app.get('/api/orders/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;
    const data = fs.readFileSync(ordersFile, 'utf-8');
    const orders = JSON.parse(data);
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    res.json({ success: true, order, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch order' });
  }
});

// PUT update order
app.put('/api/update-order', (req, res) => {
  try {
    const { orderId, ...updates } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ success: false, error: 'Order ID is required' });
    }

    const data = fs.readFileSync(ordersFile, 'utf-8');
    let orders = JSON.parse(data);
    
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    orders[orderIndex] = { ...orders[orderIndex], ...updates, updatedAt: new Date().toISOString() };
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
    res.json({ success: true, message: 'Order updated', order: orders[orderIndex], timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ success: false, error: 'Failed to update order' });
  }
});

// DELETE order
app.delete('/api/delete-order', (req, res) => {
  try {
    const { orderId } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ success: false, error: 'Order ID is required' });
    }

    const data = fs.readFileSync(ordersFile, 'utf-8');
    let orders = JSON.parse(data);
    
    const initialLength = orders.length;
    orders = orders.filter(order => order.id !== orderId);
    
    if (orders.length === initialLength) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
    res.json({ success: true, message: 'Order deleted', timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ success: false, error: 'Failed to delete order' });
  }
});

// Razorpay: Create Order
app.post('/api/razorpay/create-order', async (req, res) => {
  try {
    console.log('🔄 Creating Razorpay order:', req.body);
    console.log('🔄 Request headers:', req.headers);
    console.log('🔄 Request origin:', req.headers.origin);
    
    const { amount, orderId, customer } = req.body;

    if (!amount || !orderId) {
      console.error('❌ Missing required fields:', { amount, orderId });
      return res.status(400).json({ success: false, error: 'Missing amount or orderId' });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('❌ Razorpay credentials not configured');
      return res.status(500).json({ success: false, error: 'Payment gateway not configured' });
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: orderId,
      notes: {
        orderId: orderId,
        customer: customer
      }
    };

    console.log('🔄 Razorpay order options:', options);
    const order = await razorpay.orders.create(options);
    console.log('✅ Razorpay order created:', order.id);
    
    // Set CORS headers explicitly
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    res.json({ success: true, order });
  } catch (error) {
    console.error('❌ Error creating Razorpay order:', error);
    
    // Set CORS headers even for errors
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create payment order',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Razorpay: Verify Payment
app.post('/api/razorpay/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Missing payment details' });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, error: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, error: 'Failed to verify payment' });
  }
});

// Razorpay: Get Payment Details
app.get('/api/razorpay/payment/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await razorpay.payments.fetch(paymentId);
    res.json({ success: true, payment });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch payment details' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running', timestamp: new Date().toISOString(), port: PORT });
});

// Test endpoint for debugging CORS
app.get('/api/test-connection', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.json({ 
    success: true, 
    message: 'Connection successful',
    origin: req.headers.origin,
    userAgent: req.headers['user-agent'],
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
