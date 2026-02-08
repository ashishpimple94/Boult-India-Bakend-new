const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Database connection
const connectDB = require('./config/database');

// Models
const Product = require('./models/Product');
const Order = require('./models/Order');
const User = require('./models/User');

// Razorpay
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Utils
const sanitizeUser = (userDoc) => {
  if (!userDoc) re// Connect to MongoDB
connectDB();

// Seed default admin users
const seedAdminUsers = async () => {
  try {
    const defaultAdmins = [
      {
        username: 'admin',
        email: 'admin@boultindia.com',
        firstName: 'Boult',
        lastName: 'Admin',
        password: 'admin123',
        role: 'super_admin'
      },
      {
        username: 'boultadmin',
        email: 'support@boultindia.com',
        firstName: 'Boult',
        lastName: 'Support',
        password: 'boult2026',
        role: 'admin'
      }
    ];

    for (const admin of defaultAdmins) {
      const existing = await User.findOne({
        $or: [
          { username: admin.username.toLowerCase() },
          { email: admin.email.toLowerCase() }
        ]
      });

      if (!existing) {
        const newAdmin = new User({
          ...admin,
          username: admin.username.toLowerCase(),
          email: admin.email.toLowerCase(),
          isActive: true
        });
        await newAdmin.save();
        console.log(`✅ Seeded admin user: ${admin.username}`);
      }
    }
  } catch (error) {
    console.error('❌ Failed to seed admin users:', error);
  }
};

seedAdminUsers();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.ADMIN_URL || 'http://localhost:3001',
    'http://localhost:3002',
    'https://boult-india-ecommerce.vercel.app',
    'https://boult-india-admin.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ 
    success: false, 
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message 
  });
});

// ==================== PRODUCT ROUTES ====================

// GET all products
app.get('/api/products', async (req, res) => {
  try {
    const { category, featured, onSale, search, limit, page } = req.query;
    
    // Build query
    let query = { isActive: true };
    
    if (category && category !== 'all') {
      query.category = category.toLowerCase();
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (onSale === 'true') {
      query.onSale = true;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 50;
    const skip = (pageNum - 1) * limitNum;
    
    const products = await Product.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    const total = await Product.countDocuments(query);
    
    res.json({ 
      success: true, 
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      },
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

// GET single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id, isActive: true });
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    res.json({ success: true, product, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
});

// CREATE product
app.post('/api/products', async (req, res) => {
  try {
    const productData = req.body;

    if (!productData.id || !productData.name || !productData.price) {
      return res.status(400).json({ success: false, error: 'Product id, name, and price are required' });
    }

    const existing = await Product.findOne({ id: productData.id });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Product with this id already exists' });
    }

    const product = await Product.create(productData);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, error: 'Failed to create product' });
  }
});

// UPDATE product
app.put('/api/products', async (req, res) => {
  try {
    const productData = req.body;

    if (!productData.id) {
      return res.status(400).json({ success: false, error: 'Product id is required' });
    }

    const product = await Product.findOneAndUpdate(
      { id: productData.id },
      { ...productData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product,
      timestamp: new Date().toISOString()
    });
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
      return res.status(400).json({ success: false, error: 'Product id is required' });
    }

    const product = await Product.findOneAndDelete({ id });

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
});

// ==================== ORDER ROUTES ====================

// GET all orders
app.get('/api/orders', async (req, res) => {
  try {
    const { status, paymentMethod, email, limit, page, sortBy } = req.query;
    
    // Build query
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (paymentMethod && paymentMethod !== 'all') {
      query.paymentMethod = paymentMethod;
    }
    
    if (email) {
      query.email = { $regex: email, $options: 'i' };
    }
    
    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 50;
    const skip = (pageNum - 1) * limitNum;
    
    // Sorting
    let sort = { createdAt: -1 }; // Default: newest first
    if (sortBy === 'amount_asc') sort = { amount: 1 };
    if (sortBy === 'amount_desc') sort = { amount: -1 };
    if (sortBy === 'customer') sort = { customer: 1 };
    
    const orders = await Order.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);
    
    const total = await Order.countDocuments(query);
    
    res.json({ 
      success: true, 
      orders,
      count: orders.length,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      },
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

// GET single order
app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ id: req.params.orderId });
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    res.json({ success: true, order, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch order' });
  }
});

// POST save order
app.post('/api/save-order', async (req, res) => {
  try {
    const orderData = req.body;
    
    // Validate required fields
    if (!orderData.id || !orderData.email || !orderData.amount) {
      return res.status(400).json({ success: false, error: 'Missing required order fields' });
    }

    // Check if order already exists
    const existingOrder = await Order.findOne({ id: orderData.id });
    if (existingOrder) {
      return res.status(400).json({ success: false, error: 'Order already exists' });
    }

    // Create new order
    const order = new Order({
      ...orderData,
      paymentStatus: orderData.paymentId ? 'paid' : 'pending'
    });
    
    await order.save();
    
    res.json({ 
      success: true, 
      message: 'Order saved successfully', 
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
      return res.status(400).json({ success: false, error: 'Order ID is required' });
    }

    const order = await Order.findOneAndUpdate(
      { id: orderId },
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({ 
      success: true, 
      message: 'Order updated successfully', 
      order, 
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ success: false, error: 'Failed to update order' });
  }
});

// DELETE order
app.delete('/api/delete-order', async (req, res) => {
  try {
    const { orderId } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ success: false, error: 'Order ID is required' });
    }

    const order = await Order.findOneAndDelete({ id: orderId });
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({ 
      success: true, 
      message: 'Order deleted successfully', 
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ success: false, error: 'Failed to delete order' });
  }
});

// ==================== AUTHENTICATION ROUTES ====================

// User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' });
    }

    const [firstName, ...rest] = name.trim().split(' ');
    const lastName = rest.join(' ') || firstName;

    const user = await User.create({
      username: email.toLowerCase(),
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone: phone || '',
      password,
      role: 'customer',
      isActive: true,
      emailVerified: false
    });

    const safeUser = sanitizeUser(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: safeUser,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, error: 'Failed to register user' });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, error: 'Account is deactivated. Please contact support.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    user.lastLogin = new Date();
    await user.save();

    const safeUser = sanitizeUser(user);

    res.json({
      success: true,
      message: 'Login successful',
      user: safeUser,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ success: false, error: 'Failed to login' });
  }
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required' });
    }

    const query = username.includes('@')
      ? { email: username.toLowerCase() }
      : { username: username.toLowerCase() };

    const adminUser = await User.findOne({
      ...query,
      role: { $in: ['admin', 'super_admin'] }
    });

    if (!adminUser) {
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }

    if (!adminUser.isActive) {
      return res.status(401).json({ success: false, error: 'Admin account is deactivated. Please contact support.' });
    }

    const isMatch = await adminUser.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }

    adminUser.lastLogin = new Date();
    await adminUser.save();

    const safeAdmin = sanitizeUser(adminUser);

    res.json({
      success: true,
      message: 'Admin login successful',
      user: safeAdmin,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in admin login:', error);
    res.status(500).json({ success: false, error: 'Failed to login' });
  }
});

// ==================== RAZORPAY ROUTES ====================

// Create Razorpay order
app.post('/api/razorpay/create-order', async (req, res) => {
  try {
    const { amount, orderId, customer } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ success: false, error: 'Missing amount or orderId' });
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

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ success: false, error: 'Failed to create payment order' });
  }
});

// Verify Razorpay payment
app.post('/api/razorpay/verify-payment', async (req, res) => {
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

// Get payment details
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

// ==================== ANALYTICS ROUTES ====================

// GET order analytics
app.get('/api/analytics/orders', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const ordersByPaymentMethod = await Order.aggregate([
      { $group: { _id: '$paymentMethod', count: { $sum: 1 } } }
    ]);
    
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json({
      success: true,
      analytics: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        ordersByStatus,
        ordersByPaymentMethod,
        recentOrders
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch analytics' });
  }
});

// ==================== HEALTH CHECK ====================

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check MongoDB connection
    const dbStatus = await Order.findOne().limit(1);
    
    res.json({ 
      status: 'Backend is running with MongoDB', 
      database: 'Connected',
      timestamp: new Date().toISOString(), 
      port: PORT,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      status: 'Backend running but database error',
      database: 'Disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Database: MongoDB`);
});