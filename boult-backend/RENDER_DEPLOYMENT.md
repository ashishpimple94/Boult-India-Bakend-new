# Render Deployment Guide for Boult India Backend

## 🚀 Quick Deployment Steps

### 1. **Connect GitHub Repository**
- Go to [Render Dashboard](https://dashboard.render.com)
- Click "New" → "Web Service"
- Connect your GitHub account
- Select repository: `Boult-India-Bakend-new`

### 2. **Configure Deployment Settings**
```
Name: boult-backend
Environment: Node
Region: Oregon (US West)
Branch: main
Build Command: npm install
Start Command: node server.js
```

### 3. **Set Environment Variables**
Add these environment variables in Render dashboard:

```env
PORT=10000
NODE_ENV=production
RAZORPAY_KEY_ID=rzp_live_S9KdjLbjrue2F0
RAZORPAY_KEY_SECRET=sKJSmRJ7peYBxdkYIebeyXaV
MONGODB_URI=mongodb+srv://boultindia:Test12345@cluster0.ezzkjmw.mongodb.net/boult-india?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB_NAME=boult-india
JWT_SECRET=boult-india-super-secret-jwt-key-2026-v-tech-multi-solutions
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend-url.vercel.app
ADMIN_URL=https://your-admin-url.vercel.app
```

### 4. **Deploy**
- Click "Create Web Service"
- Wait for deployment to complete
- Your backend will be live at: `https://your-service-name.onrender.com`

## 🔧 Troubleshooting Common Issues

### **Error: Cannot find module '/opt/render/project/src/index.js'**
✅ **Fixed!** We've added:
- `index.js` entry point
- Updated `render.yaml` with correct start command
- Explicit `node server.js` command

### **Port Issues**
- Render uses dynamic ports, our app uses `process.env.PORT`
- Default fallback is port 5000 for local development

### **Environment Variables**
- Set all required variables in Render dashboard
- Don't commit sensitive data to GitHub
- Use Render's environment variable sync feature

### **MongoDB Connection**
- Ensure MongoDB Atlas allows connections from `0.0.0.0/0`
- Check connection string format
- Verify username/password

## 📊 Health Check

Once deployed, test these endpoints:

```bash
# Health check
curl https://your-service-name.onrender.com/health

# Products API
curl https://your-service-name.onrender.com/api/products

# Orders API
curl https://your-service-name.onrender.com/api/orders
```

## 🔄 Auto-Deploy Setup

Render automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

## 🌐 Update Frontend URLs

After deployment, update your React apps:

### E-commerce Frontend (.env.local):
```env
REACT_APP_BACKEND_URL=https://your-service-name.onrender.com
```

### Admin Panel (.env.local):
```env
REACT_APP_BACKEND_URL=https://your-service-name.onrender.com
```

## 📈 Performance Tips

1. **Free Tier Limitations**:
   - Service sleeps after 15 minutes of inactivity
   - First request after sleep takes ~30 seconds
   - Consider upgrading for production

2. **Keep Service Awake**:
   - Use a service like UptimeRobot to ping every 14 minutes
   - Or upgrade to paid plan

3. **Database Optimization**:
   - MongoDB Atlas M0 (free) is sufficient for development
   - Consider M2+ for production traffic

## 🔐 Security Checklist

- ✅ Environment variables set securely
- ✅ CORS configured for your domains
- ✅ Rate limiting enabled
- ✅ Helmet security headers
- ✅ Input validation
- ✅ MongoDB connection secured

## 📞 Support

If deployment fails:
1. Check Render build logs
2. Verify all environment variables
3. Test locally first: `npm start`
4. Contact: vtechmultisolutions@gmail.com

---

**Your Boult India backend is ready for production! 🎉**