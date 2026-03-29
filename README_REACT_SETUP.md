# Boult India - React JS Full Stack Application

Complete React-based e-commerce platform with admin dashboard and Express.js backend.

## 🚀 Quick Start

### Option 1: Automated Setup (macOS/Linux)
```bash
chmod +x START_LOCAL_DEVELOPMENT.sh
./START_LOCAL_DEVELOPMENT.sh
```

This will start all three services automatically:
- Backend: http://localhost:5000
- Admin: http://localhost:3000
- E-commerce: http://localhost:3001

### Option 2: Manual Setup

#### Backend
```bash
cd boult-backend
npm install
npm start
```

#### React Admin Dashboard
```bash
cd boult-react-admin
npm install
npm start
```

#### React E-commerce
```bash
cd boult-react-ecommerce
npm install
npm start
```

## 📁 Project Structure

```
boult-backend/
├── server.js              # Express server
├── package.json
├── .env                   # Environment variables
├── data/
│   ├── products.json      # Products database
│   └── orders.json        # Orders database
└── render.yaml            # Render deployment config

boult-react-admin/
├── src/
│   ├── App.tsx            # Main app component
│   ├── index.tsx          # Entry point
│   ├── pages/
│   │   ├── Dashboard.tsx  # Admin dashboard
│   │   ├── Orders.tsx     # Order management
│   │   └── Products.tsx   # Product management
│   └── components/
├── public/
│   └── index.html
├── package.json
└── .env.local             # Environment variables

boult-react-ecommerce/
├── src/
│   ├── App.tsx            # Main app component
│   ├── index.tsx          # Entry point
│   ├── pages/
│   │   ├── Home.tsx       # Home page
│   │   ├── Products.tsx   # Products listing
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx       # Shopping cart
│   │   ├── Checkout.tsx   # Checkout page
│   │   ├── Login.tsx      # Login page
│   │   ├── Signup.tsx     # Signup page
│   │   ├── Account.tsx    # User account
│   │   └── OrderConfirmation.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── context/
│   │   └── CartContext.tsx # Cart state management
│   └── pages/
├── public/
│   └── index.html
├── package.json
└── .env.local             # Environment variables
```

## 🔧 Configuration

### Backend Environment Variables (.env)
```
PORT=5000
NODE_ENV=production
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### React Apps Environment Variables (.env.local)
```
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_API_URL=http://localhost:5000/api
```

## 📡 API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/save-order` - Create order
- `PUT /api/update-order` - Update order status
- `DELETE /api/delete-order` - Delete order

### Health
- `GET /health` - Backend health check

## 🌐 Deployment

### Deploy to Render

1. **Backend**
   - Create Web Service on Render
   - Connect GitHub repo
   - Build: `npm install`
   - Start: `npm start`
   - Set environment variables

2. **React Admin**
   - Create Static Site on Render
   - Connect GitHub repo
   - Build: `npm install && npm run build`
   - Publish: `build`
   - Set environment variables

3. **React E-commerce**
   - Create Static Site on Render
   - Connect GitHub repo
   - Build: `npm install && npm run build`
   - Publish: `build`
   - Set environment variables

See `REACT_DEPLOYMENT_GUIDE.md` for detailed instructions.

## 🎯 Features

### Admin Dashboard
- 📊 Real-time statistics (revenue, orders, customers)
- 📦 Order management (view, update status, delete)
- 🛍️ Product management (add, edit, delete)
- 🔍 Search and filter functionality
- 📄 Invoice generation (PDF)

### E-commerce App
- 🏠 Home page with featured products
- 🛍️ Product catalog with search/filter
- 🛒 Shopping cart with quantity controls
- 💳 Checkout with multiple payment methods
- 👤 User authentication (login/signup)
- 📋 Order tracking and history
- 📄 Invoice download

## 🔐 Authentication

- Email/password login
- User registration with validation
- Session stored in localStorage
- Auto-redirect to login for protected pages
- Remember me functionality

## 💳 Payment Methods

- Razorpay (online payment)
- Cash on Delivery (COD)
- Demo payment option

## 📦 Dependencies

### Backend
- express
- cors
- dotenv

### React Apps
- react
- react-router-dom
- axios
- lucide-react
- jspdf
- html2canvas
- tailwindcss

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill process using port 5000
kill -9 <PID>
```

### React app won't start
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API calls failing
- Verify backend is running
- Check environment variables
- Verify backend URL in React apps
- Check browser console for errors

## 📝 Notes

- Backend uses JSON files for data storage
- Data persists in `boult-backend/data/` directory
- For production, consider using a database (MongoDB, PostgreSQL)
- Razorpay keys should be kept secure in environment variables

## 🚀 Next Steps

1. Install dependencies: `npm install` in each folder
2. Start local development
3. Test all features
4. Push to GitHub
5. Deploy to Render
6. Update production URLs

## 📞 Support

For issues or questions, check:
- Browser console for errors
- Render logs for backend issues
- Network tab for API call failures
