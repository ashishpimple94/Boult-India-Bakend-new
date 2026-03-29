# Boult India API Integration Guide

## 🌐 Live API Base URL
```
https://boult-india-bakend-new.onrender.com
```

## ✅ API Status Check

Your API is **LIVE** and working! Here's the current status:

### Health Check
```bash
curl https://boult-india-bakend-new.onrender.com/health
```
**Response:**
```json
{
  "status": "Backend is running",
  "timestamp": "2026-01-30T06:42:35.778Z",
  "port": "10000"
}
```

### Products API
```bash
curl https://boult-india-bakend-new.onrender.com/api/products
```
**Response:**
```json
{
  "success": true,
  "products": [],
  "timestamp": "2026-01-30T06:43:19.571Z"
}
```

### Orders API
```bash
curl https://boult-india-bakend-new.onrender.com/api/orders
```
**Response:**
```json
{
  "success": true,
  "orders": [],
  "count": 0,
  "timestamp": "2026-01-30T06:43:31.861Z"
}
```

## 🔧 Frontend Integration Complete

### E-commerce Frontend (.env.local)
```env
REACT_APP_BACKEND_URL=https://boult-india-bakend-new.onrender.com
REACT_APP_API_URL=https://boult-india-bakend-new.onrender.com/api
```

### Admin Panel (.env.local)
```env
REACT_APP_BACKEND_URL=https://boult-india-bakend-new.onrender.com
REACT_APP_API_URL=https://boult-india-bakend-new.onrender.com/api
```

## 📊 Available API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- Query parameters: `category`, `featured`, `onSale`, `search`, `limit`, `page`

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:orderId` - Get single order
- `POST /api/save-order` - Create new order
- `PUT /api/update-order` - Update order status
- `DELETE /api/delete-order` - Delete order

### Razorpay Payment
- `POST /api/razorpay/create-order` - Create payment order
- `POST /api/razorpay/verify-payment` - Verify payment
- `GET /api/razorpay/payment/:paymentId` - Get payment details

### Analytics
- `GET /api/analytics/orders` - Get order analytics

### Health
- `GET /health` - Backend health check

## 🗄️ Data Population Needed

Your database is currently empty. You need to populate it with products:

### Option 1: Manual Migration (Recommended)
1. SSH into your Render service
2. Run the migration script:
```bash
npm run migrate
```

### Option 2: API Upload Script
```bash
cd boult-backend
node scripts/populateProducts.js
```

### Option 3: Admin Panel
- Use the admin panel to manually add products
- Bulk import feature (if implemented)

## 🚀 Testing the Integration

### Test Products API
```javascript
fetch('https://boult-india-bakend-new.onrender.com/api/products')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Test Orders API
```javascript
fetch('https://boult-india-bakend-new.onrender.com/api/orders')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Test Health Check
```javascript
fetch('https://boult-india-bakend-new.onrender.com/health')
  .then(res => res.json())
  .then(data => console.log(data));
```

## 🔐 CORS Configuration

Your API is configured to accept requests from:
- `http://localhost:3000` (E-commerce dev)
- `http://localhost:3001` (Admin dev)
- `https://boult-india-ecommerce.vercel.app` (E-commerce prod)
- `https://boult-india-admin.vercel.app` (Admin prod)

## 📱 Frontend Usage Examples

### Fetch Products in React
```javascript
const [products, setProducts] = useState([]);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  
  fetchProducts();
}, []);
```

### Create Order
```javascript
const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/save-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};
```

## 🎯 Next Steps

1. **Populate Database**: Add products to your live database
2. **Test Frontend**: Restart your React apps to use the new API
3. **Test Orders**: Place a test order to verify payment flow
4. **Monitor**: Check Render logs for any issues

## 🔍 Troubleshooting

### API Not Responding
- Check Render service status
- Verify environment variables
- Check service logs in Render dashboard

### CORS Errors
- Ensure frontend URLs are in CORS configuration
- Check if requests include proper headers

### Empty Data
- Run migration script to populate database
- Check MongoDB connection in Render logs

## 📞 Support

- **API Issues**: Check Render service logs
- **Frontend Issues**: Check browser console
- **Contact**: vtechmultisolutions@gmail.com

---

**Your Boult India API is live and ready! 🎉**

**API Base URL**: `https://boult-india-bakend-new.onrender.com`