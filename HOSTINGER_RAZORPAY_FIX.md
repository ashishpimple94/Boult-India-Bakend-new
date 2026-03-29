# Hostinger Deployment - Razorpay Fix Guide

## 🚨 Common Razorpay Issues on Hostinger

### Issue 1: HTTPS Requirement
**Problem**: Razorpay modal doesn't open on HTTP domains
**Solution**: 
- Use HTTPS domain only
- Enable SSL certificate in Hostinger
- Force HTTPS redirect

### Issue 2: Domain Not Whitelisted
**Problem**: "This merchant doesn't accept payments from your location"
**Solution**: Add domain to Razorpay dashboard

### Issue 3: CORS Issues
**Problem**: Backend API calls fail from production domain
**Solution**: Update backend CORS settings

### Issue 4: Environment Variables
**Problem**: Frontend can't connect to backend
**Solution**: Update production environment variables

---

## 🔧 Step-by-Step Fix

### Step 1: Update Frontend Environment Variables
Create `.env.production` file:

```bash
# Production Environment Variables
REACT_APP_BACKEND_URL=https://boult-india-bakend-new.onrender.com
REACT_APP_API_URL=https://boult-india-bakend-new.onrender.com/api
REACT_APP_ENVIRONMENT=production
```

### Step 2: Update Backend CORS for Hostinger Domain
Add your Hostinger domain to backend CORS:

```javascript
// In server.js - Update CORS origins
const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:3001', 
  'https://your-hostinger-domain.com',  // Add this
  'https://www.your-hostinger-domain.com',  // Add this
  'https://boult-india-ecommerce.vercel.app',
  'https://boult-india-admin.vercel.app',
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL
].filter(Boolean);
```

### Step 3: Razorpay Dashboard Settings
1. Login to Razorpay Dashboard
2. Go to Settings > API Keys
3. Add your Hostinger domain to "Authorized Domains"
4. Enable "Accept International Payments" if needed

### Step 4: Build with Production Settings
```bash
# Build with production environment
npm run build
```

### Step 5: Upload to Hostinger
1. Upload `build` folder contents to `public_html`
2. Ensure `.htaccess` file is included
3. Test HTTPS access

---

## 🧪 Testing Checklist

### Before Upload:
- [ ] HTTPS domain ready
- [ ] SSL certificate active
- [ ] Domain added to Razorpay dashboard
- [ ] Backend CORS updated
- [ ] Environment variables set

### After Upload:
- [ ] Site loads on HTTPS
- [ ] API calls work
- [ ] Razorpay script loads
- [ ] Payment modal opens
- [ ] Test payment works

---

## 🚨 Emergency Fixes

### If Razorpay Modal Still Doesn't Open:

1. **Check Browser Console**:
   ```javascript
   // Open browser console and check:
   console.log('Razorpay available:', !!window.Razorpay);
   console.log('Current protocol:', window.location.protocol);
   ```

2. **Force HTTPS Redirect** (add to .htaccess):
   ```apache
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

3. **Test with Simple HTML**:
   Upload `test-razorpay-modal.html` to test Razorpay directly

4. **Check Network Tab**:
   - Razorpay script loading?
   - API calls successful?
   - CORS errors?

---

## 📞 Support Commands

### Test Backend Connection:
```bash
curl -X GET "https://boult-india-bakend-new.onrender.com/health"
```

### Test Razorpay Endpoint:
```bash
curl -X POST "https://boult-india-bakend-new.onrender.com/api/razorpay/create-order" \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "orderId": "TEST_123", "customer": "Test"}'
```

---

## 🎯 Quick Fix Summary

1. **Use HTTPS domain only**
2. **Add domain to Razorpay dashboard**
3. **Update backend CORS**
4. **Set production environment variables**
5. **Test thoroughly before going live**

Need help with any specific step? Let me know!