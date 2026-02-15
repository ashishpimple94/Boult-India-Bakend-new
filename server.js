const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { sendOrderConfirmation, sendContactEmail } = require('./services/emailService');
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

// Import Models
const Order = require('./models/Order');
const Product = require('./models/Product');
const Banner = require('./models/Banner');
const Review = require('./models/Review');

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

// Debug endpoint to check environment variables (REMOVE AFTER TESTING)
app.get('/debug/env', (req, res) => {
  res.json({
    HOSTINGER_EMAIL: process.env.HOSTINGER_EMAIL ? 'SET' : 'NOT SET',
    HOSTINGER_PASSWORD: process.env.HOSTINGER_PASSWORD ? 'SET (***' + process.env.HOSTINGER_PASSWORD.slice(-3) + ')' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV,
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
    
    // Transform products to include 'image' field for frontend compatibility
    const productsWithImage = products.map(p => {
      const product = p.toObject();
      product.image = product.images?.[0] || product.image || '';
      return product;
    });
    
    res.json({ success: true, products: productsWithImage, count: productsWithImage.length });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

// POST add product
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.image;
    
    const productData = {
      ...req.body,
      id: `PROD_${Date.now()}`,
      price: parseFloat(req.body.price),
      originalPrice: req.body.originalPrice ? parseFloat(req.body.originalPrice) : undefined,
      discount: req.body.discount ? parseFloat(req.body.discount) : undefined,
      images: imageUrl ? [imageUrl] : [],
      createdAt: new Date().toISOString()
    };
    
    // Remove the old 'image' field if it exists
    delete productData.image;

    const product = new Product(productData);
    await product.save();
    
    // Return product with 'image' field for frontend compatibility
    const productResponse = product.toObject();
    productResponse.image = productResponse.images?.[0] || '';
    
    res.status(201).json({ 
      success: true, 
      message: 'Product added', 
      product: productResponse 
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, error: 'Failed to add product' });
  }
});

// PUT update product
app.put('/api/products', async (req, res) => {
  try {
    const { id, image, ...updates } = req.body;
    
    if (!id) {
      return res.status(400).json({ success: false, error: 'Product ID required' });
    }

    // Build update data - only include fields that are actually provided
    const updateData = {};
    
    // Handle basic fields
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.featured !== undefined) updateData.featured = updates.featured;
    if (updates.onSale !== undefined) updateData.onSale = updates.onSale;
    if (updates.stock !== undefined) updateData.stock = updates.stock;
    if (updates.isActive !== undefined) updateData.isActive = updates.isActive;
    
    // Handle numeric fields
    if (updates.price !== undefined) updateData.price = parseFloat(updates.price);
    if (updates.originalPrice !== undefined) updateData.originalPrice = parseFloat(updates.originalPrice);
    if (updates.discount !== undefined) updateData.discount = parseFloat(updates.discount);
    if (updates.rating !== undefined) updateData.rating = parseFloat(updates.rating);
    if (updates.reviews !== undefined) updateData.reviews = parseInt(updates.reviews);
    
    // Handle array fields - only update if provided
    if (updates.variants !== undefined) updateData.variants = updates.variants;
    if (updates.directions !== undefined) updateData.directions = updates.directions;
    if (updates.benefits !== undefined) updateData.benefits = updates.benefits;
    if (updates.tags !== undefined) updateData.tags = updates.tags;
    
    // Handle image
    if (image) {
      updateData.images = [image];
    }
    
    // Always update timestamp
    updateData.updatedAt = new Date();

    const product = await Product.findOneAndUpdate(
      { id },
      { $set: updateData },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Return product with 'image' field for frontend compatibility
    const productResponse = product.toObject();
    productResponse.image = productResponse.images?.[0] || '';

    res.json({ success: true, message: 'Product updated', product: productResponse });
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

// ============ CONTACT API ============

// POST contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, enquiryType, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Send email
    const result = await sendContactEmail({ name, email, phone, enquiryType, subject, message });
    
    if (result.success) {
      console.log(`✅ Contact form submitted by ${name} (${email})`);
      res.json({ success: true, message: 'Message sent successfully' });
    } else {
      res.status(500).json({ success: false, error: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ success: false, error: 'Failed to process contact form' });
  }
});

// ============ REVIEWS API ============

// GET reviews for a product
app.get('/api/reviews/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    
    const reviews = await Review.find({ 
      productId, 
      isApproved: true 
    }).sort({ createdAt: -1 });
    
    res.json({ 
      success: true, 
      reviews, 
      count: reviews.length 
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
  }
});

// POST add review
app.post('/api/reviews', async (req, res) => {
  try {
    const { productId, customerName, email, rating, title, comment } = req.body;
    
    if (!productId || !customerName || !email || !rating || !title || !comment) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5' });
    }

    const reviewData = {
      id: `REVIEW_${Date.now()}`,
      productId,
      customerName,
      email,
      rating: parseInt(rating),
      title,
      comment,
      isApproved: true // Auto-approve for now
    };

    const review = new Review(reviewData);
    await review.save();
    
    // Update product rating and review count
    const reviews = await Review.find({ productId, isApproved: true });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await Product.findOneAndUpdate(
      { id: productId },
      { 
        rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
        reviews: reviews.length 
      }
    );
    
    console.log(`✅ Review added for product ${productId} by ${customerName}`);
    res.status(201).json({ 
      success: true, 
      message: 'Review submitted successfully', 
      review 
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ success: false, error: 'Failed to add review' });
  }
});

// DELETE review (admin only - add auth later)
app.delete('/api/reviews/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    const review = await Review.findOneAndDelete({ id: reviewId });
    
    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    // Update product rating and review count
    const reviews = await Review.find({ productId: review.productId, isApproved: true });
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;
    
    await Product.findOneAndUpdate(
      { id: review.productId },
      { 
        rating: Math.round(avgRating * 10) / 10,
        reviews: reviews.length 
      }
    );

    console.log(`✅ Review deleted: ${reviewId}`);
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ success: false, error: 'Failed to delete review' });
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
