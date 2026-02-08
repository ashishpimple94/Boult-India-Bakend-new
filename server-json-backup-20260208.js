const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { sendOrderConfirmation } = require('./services/emailService');
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
      // Hostinger domains
      'https://boultindia.com',
      'https://www.boultindia.com',
      'https://login.boultindia.com',
      'https://admin.boultindia.com',
      'https://boult-india.hostinger.com',
      'https://www.boult-india.hostinger.com',
      // Add your actual Hostinger domain here
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

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve public product images statically (for images like /Anti-Rust-Spray-500ml-Website-2.png)
app.use('/product-images', express.static(path.join(__dirname, 'public')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Keep original filename with timestamp to avoid conflicts
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Data file paths
const productsFile = path.join(__dirname, 'data', 'products.json');
const ordersFile = path.join(__dirname, 'data', 'orders.json');
const usersFile = path.join(__dirname, 'data', 'users.json');
const enquiriesFile = path.join(__dirname, 'data', 'enquiries.json');
const reviewsFile = path.join(__dirname, 'data', 'reviews.json');

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
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, '[]');
}
if (!fs.existsSync(enquiriesFile)) {
  fs.writeFileSync(enquiriesFile, '[]');
}
if (!fs.existsSync(reviewsFile)) {
  fs.writeFileSync(reviewsFile, '[]');
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal server error' });
});

// POST upload image
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file provided' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      fullUrl: `${req.protocol}://${req.get('host')}${imageUrl}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, error: 'Failed to upload image' });
  }
});

// GET all products
app.get('/api/products', (req, res) => {
  try {
    const data = fs.readFileSync(productsFile, 'utf-8');
    const products = JSON.parse(data);
    
    // Return products as-is with relative image paths
    // Frontend will serve images from its own public folder
    res.json({ success: true, products, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error reading products:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

// POST add new product
app.post('/api/products', (req, res) => {
  try {
    const product = req.body;
    
    // Validate required fields
    if (!product.name || !product.price) {
      return res.status(400).json({ success: false, error: 'Product name and price are required' });
    }

    const data = fs.readFileSync(productsFile, 'utf-8');
    const products = JSON.parse(data);
    
    // Generate unique ID
    const newProduct = {
      ...product,
      id: `PROD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      price: parseFloat(product.price),
      featured: product.featured || false,
      onSale: product.onSale || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    products.push(newProduct);
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
    
    res.status(201).json({ 
      success: true, 
      message: 'Product added successfully', 
      product: newProduct,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, error: 'Failed to add product' });
  }
});

// PUT update product
app.put('/api/products', (req, res) => {
  try {
    const { id, ...updates } = req.body;
    
    if (!id) {
      return res.status(400).json({ success: false, error: 'Product ID is required' });
    }

    const data = fs.readFileSync(productsFile, 'utf-8');
    let products = JSON.parse(data);
    
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Update product
    products[productIndex] = { 
      ...products[productIndex], 
      ...updates, 
      price: parseFloat(updates.price || products[productIndex].price),
      updatedAt: new Date().toISOString() 
    };
    
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
    
    res.json({ 
      success: true, 
      message: 'Product updated successfully', 
      product: products[productIndex],
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, error: 'Failed to update product' });
  }
});

// DELETE product
app.delete('/api/products', (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ success: false, error: 'Product ID is required' });
    }

    const data = fs.readFileSync(productsFile, 'utf-8');
    let products = JSON.parse(data);
    
    const initialLength = products.length;
    products = products.filter(product => product.id !== id);
    
    if (products.length === initialLength) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
    
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

// ==================== SIMPLE AUTHENTICATION ENDPOINTS ====================

// POST register user (simple version)
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long' });
    }

    // Read existing users
    const data = fs.readFileSync(usersFile, 'utf-8');
    const users = JSON.parse(data);

    // Check if user already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' });
    }

    // Create new user (simple password storage - in production use proper hashing)
    const newUser = {
      id: `USER_${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || '',
      password: password, // Simple storage for demo
      role: 'customer',
      addresses: [],
      wishlist: [],
      isActive: true,
      emailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save user
    users.push(newUser);
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userWithoutPassword,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, error: 'Failed to register user' });
  }
});

// POST login user (simple version)
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    // Read users
    const data = fs.readFileSync(usersFile, 'utf-8');
    const users = JSON.parse(data);

    // Find user
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ success: false, error: 'Account is deactivated. Please contact support.' });
    }

    // Verify password (simple comparison - in production use proper verification)
    if (user.password !== password) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    user.updatedAt = new Date().toISOString();
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ success: false, error: 'Failed to login' });
  }
});

// ==================== ADMIN AUTHENTICATION ENDPOINTS ====================

// Default admin credentials
const DEFAULT_ADMIN_USERS = [
  {
    id: 'ADMIN_001',
    username: 'admin',
    email: 'admin@boultindia.com',
    password: 'admin123',
    role: 'super_admin',
    name: 'Boult Admin',
    createdAt: '2026-01-30T00:00:00.000Z'
  },
  {
    id: 'ADMIN_002',
    username: 'boultadmin',
    email: 'support@boultindia.com',
    password: 'boult2026',
    role: 'admin',
    name: 'Boult Support',
    createdAt: '2026-01-30T00:00:00.000Z'
  }
];

// POST admin login
app.post('/api/admin/login', (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required' });
    }

    // Find admin user
    const adminUser = DEFAULT_ADMIN_USERS.find(u => 
      (u.username === username || u.email === username) && u.password === password
    );

    if (!adminUser) {
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }

    // Return admin data (without password)
    const { password: _, ...userWithoutPassword } = adminUser;
    const authenticatedUser = {
      ...userWithoutPassword,
      lastLogin: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Admin login successful',
      user: authenticatedUser,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in admin login:', error);
    res.status(500).json({ success: false, error: 'Failed to login' });
  }
});

// ==================== END AUTHENTICATION ENDPOINTS ====================

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

    // Create backup before saving new order
    const backupDir = path.join(__dirname, 'backups', 'orders');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    const backupFile = path.join(backupDir, `orders-backup-${Date.now()}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(orders, null, 2));
    console.log(`📦 Order backup created: ${backupFile}`);

    orders.push(order);
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
    
    // Send order confirmation email
    sendOrderConfirmation(order).then(result => {
      if (result.success) {
        console.log('✅ Order confirmation email sent successfully');
      } else {
        console.error('❌ Failed to send order confirmation email:', result.error);
      }
    }).catch(err => {
      console.error('❌ Email sending error:', err);
    });
    
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

    // Create backup before updating
    const backupDir = path.join(__dirname, 'backups', 'orders');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    const backupFile = path.join(backupDir, `orders-backup-${Date.now()}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(orders, null, 2));
    console.log(`📦 Order backup created before update: ${backupFile}`);

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
    
    // Create backup before deleting
    const backupDir = path.join(__dirname, 'backups', 'orders');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    const backupFile = path.join(backupDir, `orders-backup-before-delete-${Date.now()}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(orders, null, 2));
    console.log(`📦 Order backup created before delete: ${backupFile}`);
    
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

// ==================== ENQUIRY ENDPOINTS ====================

// POST submit enquiry
app.post('/api/enquiries', (req, res) => {
  try {
    const enquiry = req.body;
    
    if (!enquiry.name || !enquiry.email || !enquiry.message) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const data = fs.readFileSync(enquiriesFile, 'utf-8');
    const enquiries = JSON.parse(data);
    
    const newEnquiry = {
      ...enquiry,
      id: `ENQ_${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    enquiries.push(newEnquiry);
    fs.writeFileSync(enquiriesFile, JSON.stringify(enquiries, null, 2));
    
    res.status(201).json({ 
      success: true, 
      message: 'Enquiry submitted successfully', 
      enquiry: newEnquiry,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    res.status(500).json({ success: false, error: 'Failed to submit enquiry' });
  }
});

// GET all enquiries (admin only)
app.get('/api/enquiries', (req, res) => {
  try {
    const data = fs.readFileSync(enquiriesFile, 'utf-8');
    const enquiries = JSON.parse(data);
    res.json({ success: true, enquiries, count: enquiries.length, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error reading enquiries:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch enquiries' });
  }
});

// ==================== REVIEW ENDPOINTS ====================

// POST submit review
app.post('/api/reviews', (req, res) => {
  try {
    const review = req.body;
    
    if (!review.productId || !review.rating || !review.comment) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const data = fs.readFileSync(reviewsFile, 'utf-8');
    const reviews = JSON.parse(data);
    
    const newReview = {
      ...review,
      id: `REV_${Date.now()}`,
      approved: false,
      createdAt: new Date().toISOString(),
    };

    reviews.push(newReview);
    fs.writeFileSync(reviewsFile, JSON.stringify(reviews, null, 2));
    
    res.status(201).json({ 
      success: true, 
      message: 'Review submitted successfully', 
      review: newReview,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ success: false, error: 'Failed to submit review' });
  }
});

// GET reviews for a product
app.get('/api/reviews/:productId', (req, res) => {
  try {
    const { productId } = req.params;
    const data = fs.readFileSync(reviewsFile, 'utf-8');
    const allReviews = JSON.parse(data);
    const reviews = allReviews.filter(r => r.productId === productId && r.approved);
    
    res.json({ success: true, reviews, count: reviews.length, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
  }
});

// GET all reviews (admin only)
app.get('/api/reviews', (req, res) => {
  try {
    const data = fs.readFileSync(reviewsFile, 'utf-8');
    const reviews = JSON.parse(data);
    res.json({ success: true, reviews, count: reviews.length, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error reading reviews:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
  }
});

// PUT approve review (admin only)
app.put('/api/reviews/approve', (req, res) => {
  try {
    const { reviewId } = req.body;
    
    if (!reviewId) {
      return res.status(400).json({ success: false, error: 'Review ID is required' });
    }

    const data = fs.readFileSync(reviewsFile, 'utf-8');
    let reviews = JSON.parse(data);
    
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);
    if (reviewIndex === -1) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    reviews[reviewIndex].approved = true;
    reviews[reviewIndex].approvedAt = new Date().toISOString();
    
    fs.writeFileSync(reviewsFile, JSON.stringify(reviews, null, 2));
    
    res.json({ 
      success: true, 
      message: 'Review approved', 
      review: reviews[reviewIndex],
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Error approving review:', error);
    res.status(500).json({ success: false, error: 'Failed to approve review' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Backend is running with authentication', 
    timestamp: new Date().toISOString(), 
    port: PORT,
    version: '2.0.0'
  });
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
