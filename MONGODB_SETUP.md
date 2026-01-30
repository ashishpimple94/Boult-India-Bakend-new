# MongoDB Setup Guide for Boult India Backend

This guide will help you set up MongoDB for the Boult India backend application.

## 🚀 Quick Start

### Option 1: MongoDB Atlas (Cloud - Recommended)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster (M0 Sandbox is free)

2. **Configure Database Access**
   - Go to Database Access → Add New Database User
   - Create username and password
   - Set role to "Read and write to any database"

3. **Configure Network Access**
   - Go to Network Access → Add IP Address
   - Add `0.0.0.0/0` for development (allow from anywhere)
   - For production, add specific IP addresses

4. **Get Connection String**
   - Go to Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<dbname>`

### Option 2: Local MongoDB Installation

1. **Install MongoDB Community Server**
   ```bash
   # macOS (using Homebrew)
   brew tap mongodb/brew
   brew install mongodb-community
   
   # Ubuntu
   sudo apt-get install mongodb
   
   # Windows
   # Download from https://www.mongodb.com/try/download/community
   ```

2. **Start MongoDB Service**
   ```bash
   # macOS
   brew services start mongodb/brew/mongodb-community
   
   # Ubuntu
   sudo systemctl start mongod
   
   # Windows
   # MongoDB runs as a Windows service
   ```

3. **Connection String for Local**
   ```
   MONGODB_URI=mongodb://localhost:27017/boult-india
   ```

## 📝 Environment Configuration

1. **Copy Environment File**
   ```bash
   cp .env.example .env
   ```

2. **Update .env File**
   ```env
   # MongoDB Atlas Example
   MONGODB_URI=mongodb+srv://boultuser:yourpassword@cluster0.abc123.mongodb.net/boult-india?retryWrites=true&w=majority
   
   # Local MongoDB Example
   MONGODB_URI=mongodb://localhost:27017/boult-india
   
   MONGODB_DB_NAME=boult-india
   ```

## 🔄 Data Migration

### Migrate Existing JSON Data to MongoDB

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Migration Script**
   ```bash
   npm run migrate
   ```

   This will:
   - Connect to MongoDB
   - Clear existing data (if any)
   - Import products from `data/products.json`
   - Import orders from `data/orders.json`

### Manual Data Import (Alternative)

If you prefer to import data manually:

```bash
# Import products
mongoimport --uri="your_mongodb_uri" --collection=products --file=data/products.json --jsonArray

# Import orders
mongoimport --uri="your_mongodb_uri" --collection=orders --file=data/orders.json --jsonArray
```

## 🚀 Running the Application

### Start with MongoDB
```bash
# Development
npm run dev:mongodb

# Production
npm run start:mongodb
```

### Start with JSON Files (Fallback)
```bash
# Development
npm run dev

# Production
npm start
```

## 📊 Database Schema

### Products Collection
```javascript
{
  id: String (unique),
  name: String,
  description: String,
  price: Number,
  category: String,
  images: [String],
  variants: [{
    name: String,
    price: Number,
    stock: Number
  }],
  rating: Number,
  reviews: Number,
  featured: Boolean,
  onSale: Boolean,
  discount: Number,
  stock: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  id: String (unique),
  customer: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  amount: Number,
  paymentMethod: String, // 'cod', 'card', 'upi', 'netbanking'
  paymentId: String,
  paymentStatus: String, // 'pending', 'paid', 'failed', 'refunded'
  status: String, // 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  items: [{
    productId: String,
    name: String,
    variant: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Users Collection (Future)
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: String, // 'customer', 'admin'
  addresses: [{
    type: String,
    flatNumber: String,
    streetAddress: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: Boolean
  }],
  wishlist: [String], // Product IDs
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 MongoDB Compass (GUI Tool)

1. **Download MongoDB Compass**
   - Go to [MongoDB Compass](https://www.mongodb.com/products/compass)
   - Download and install

2. **Connect to Database**
   - Use your MongoDB URI
   - Browse collections and documents
   - Run queries and aggregations

## 📈 Performance Optimization

### Indexes Created
- Products: `category`, `featured`, `onSale`, `name` (text search)
- Orders: `email`, `status`, `paymentMethod`, `createdAt`, `id`
- Users: `email`, `role`

### Additional Indexes (if needed)
```javascript
// In MongoDB shell or Compass
db.products.createIndex({ "name": "text", "description": "text" })
db.orders.createIndex({ "createdAt": -1 })
db.orders.createIndex({ "customer": 1 })
```

## 🛠️ Troubleshooting

### Common Issues

1. **Connection Timeout**
   - Check network access settings in MongoDB Atlas
   - Verify connection string format
   - Ensure IP address is whitelisted

2. **Authentication Failed**
   - Verify username and password
   - Check database user permissions
   - Ensure special characters are URL encoded

3. **Migration Fails**
   - Check if JSON files exist in `data/` folder
   - Verify MongoDB connection
   - Check console for specific error messages

### Debug Commands
```bash
# Test MongoDB connection
node -e "require('./config/database')()"

# Check database status
curl http://localhost:5000/health

# View logs
npm run dev:mongodb
```

## 🔐 Security Best Practices

1. **Database Security**
   - Use strong passwords
   - Enable authentication
   - Restrict network access
   - Regular backups

2. **Application Security**
   - Validate all inputs
   - Use environment variables
   - Enable rate limiting
   - Use HTTPS in production

## 📞 Support

If you encounter issues:
- Check MongoDB Atlas documentation
- Review application logs
- Contact: vtechmultisolutions@gmail.com

---

**Ready to scale with MongoDB! 🚀**