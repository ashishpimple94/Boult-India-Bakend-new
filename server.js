const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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

// GET all products
app.get('/api/products', (req, res) => {
  try {
    const data = fs.readFileSync(productsFile, 'utf-8');
    const products = JSON.parse(data);
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error reading products:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

// POST save order
app.post('/api/save-order', (req, res) => {
  try {
    const order = req.body;
    const data = fs.readFileSync(ordersFile, 'utf-8');
    const orders = JSON.parse(data);
    orders.push(order);
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
    res.json({ success: true, message: 'Order saved' });
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
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error reading orders:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

// PUT update order
app.put('/api/update-order', (req, res) => {
  try {
    const { orderId, ...updates } = req.body;
    const data = fs.readFileSync(ordersFile, 'utf-8');
    let orders = JSON.parse(data);
    orders = orders.map(order => 
      order.id === orderId ? { ...order, ...updates } : order
    );
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
    res.json({ success: true, message: 'Order updated' });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ success: false, error: 'Failed to update order' });
  }
});

// DELETE order
app.delete('/api/delete-order', (req, res) => {
  try {
    const { orderId } = req.body;
    const data = fs.readFileSync(ordersFile, 'utf-8');
    let orders = JSON.parse(data);
    orders = orders.filter(order => order.id !== orderId);
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
    res.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ success: false, error: 'Failed to delete order' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
