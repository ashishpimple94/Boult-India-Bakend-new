# React JS Deployment Guide - Boult India

## Project Structure
```
boult-backend/          - Express.js backend (Node.js)
boult-react-admin/      - React admin dashboard
boult-react-ecommerce/  - React e-commerce app
```

## Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- Git for version control

## Local Development Setup

### 1. Backend Setup
```bash
cd boult-backend
npm install
npm start
```
Backend runs on: `http://localhost:5000`

Health check: `http://localhost:5000/health`

### 2. React Admin Dashboard Setup
```bash
cd boult-react-admin
npm install
npm start
```
Admin runs on: `http://localhost:3000`

### 3. React E-commerce Setup
```bash
cd boult-react-ecommerce
npm install
npm start
```
E-commerce runs on: `http://localhost:3001` (or next available port)

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=production
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### React Apps (.env.local)
```
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_API_URL=http://localhost:5000/api
```

For production, update these URLs to your deployed backend URL.

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/save-order` - Create order
- `PUT /api/update-order` - Update order status (admin)
- `DELETE /api/delete-order` - Delete order (admin)

### Health
- `GET /health` - Backend health check

## Deployment to Render

### Step 1: Deploy Backend
1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repository (boult-backend)
4. Configure:
   - **Name**: boult-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - PORT=5000
     - NODE_ENV=production
     - RAZORPAY_KEY_ID=your_key
     - RAZORPAY_KEY_SECRET=your_secret
5. Deploy

Backend URL: `https://boult-backend.onrender.com`

### Step 2: Deploy React Admin
1. Create new Static Site on Render
2. Connect GitHub repository (boult-react-admin)
3. Configure:
   - **Name**: boult-react-admin
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - **Environment Variables**:
     - REACT_APP_BACKEND_URL=https://boult-backend.onrender.com
     - REACT_APP_API_URL=https://boult-backend.onrender.com/api
4. Deploy

Admin URL: `https://boult-react-admin.onrender.com`

### Step 3: Deploy React E-commerce
1. Create new Static Site on Render
2. Connect GitHub repository (boult-react-ecommerce)
3. Configure:
   - **Name**: boult-react-ecommerce
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - **Environment Variables**:
     - REACT_APP_BACKEND_URL=https://boult-backend.onrender.com
     - REACT_APP_API_URL=https://boult-backend.onrender.com/api
4. Deploy

E-commerce URL: `https://boult-react-ecommerce.onrender.com`

## Testing Deployment

1. **Backend Health**: Visit `https://boult-backend.onrender.com/health`
2. **Admin Dashboard**: Visit `https://boult-react-admin.onrender.com`
3. **E-commerce**: Visit `https://boult-react-ecommerce.onrender.com`

## Troubleshooting

### Backend not connecting
- Check environment variables are set correctly
- Verify backend URL in React apps matches deployed URL
- Check Render logs for errors

### React apps showing blank page
- Clear browser cache
- Check browser console for errors
- Verify build command completed successfully
- Check environment variables are set

### Data not persisting
- Backend uses JSON files in `data/` directory
- Render free tier may reset files on redeploy
- Consider upgrading to paid tier or using database

## Next Steps

1. Push code to GitHub
2. Deploy backend first
3. Update React apps with backend URL
4. Deploy React apps
5. Test all features end-to-end
