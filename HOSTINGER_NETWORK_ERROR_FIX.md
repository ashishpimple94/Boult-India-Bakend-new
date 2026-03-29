# 🚨 Hostinger Network Error Fix

## Error: "Network error: Unable to connect to payment server"

### 🔍 Root Causes:
1. **CORS Issues** - Hostinger domain not in backend CORS
2. **HTTPS Mixed Content** - HTTP requests from HTTPS site
3. **Environment Variables** - Backend URL not set correctly
4. **Render Backend Sleeping** - Cold start issues

---

## 🔧 Immediate Fixes

### Fix 1: Update Backend CORS (URGENT)
Add your Hostinger domain to backend CORS:

```javascript
// In boult-backend/server.js - Update CORS origins
const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:3001', 
  'https://your-hostinger-domain.com',  // ADD YOUR ACTUAL DOMAIN
  'https://www.your-hostinger-domain.com',  // ADD WWW VERSION
  'https://boult-india-ecommerce.vercel.app',
  'https://boult-india-admin.vercel.app',
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL
].filter(Boolean);
```

### Fix 2: Wake Up Backend
Backend might be sleeping. Test:
```bash
curl -X GET "https://boult-india-bakend-new.onrender.com/health"
```

### Fix 3: Check Environment Variables
Verify in browser console:
```javascript
console.log('Backend URL:', process.env.REACT_APP_BACKEND_URL);
```

---

## 🛠️ Step-by-Step Solution

### Step 1: Update Backend CORS
1. **Tell me your Hostinger domain**
2. I'll update the backend CORS
3. Redeploy backend to Render

### Step 2: Test Backend Connection
```bash
# Test from your domain
curl -X GET "https://boult-india-bakend-new.onrender.com/health" \
  -H "Origin: https://your-domain.com"
```

### Step 3: Check Browser Console
1. Open browser console (F12)
2. Go to Network tab
3. Try placing order
4. Check failed requests

### Step 4: Test API Endpoints
```javascript
// Test in browser console on your site
fetch('https://boult-india-bakend-new.onrender.com/health')
  .then(r => r.json())
  .then(d => console.log('Backend:', d))
  .catch(e => console.error('Error:', e));
```

---

## 🚨 Emergency Workaround

### Temporary Fix: Use COD Only
If Razorpay fails, COD will still work:

```javascript
// In Checkout.tsx - Force COD for now
const handleSubmit = async (e) => {
  // ... existing code
  
  // Force COD if network issues
  if (formData.paymentMethod !== 'cod') {
    setError('Online payments temporarily unavailable. Please use Cash on Delivery.');
    return;
  }
  
  // ... rest of COD logic
};
```

---

## 🔍 Debugging Steps

### 1. Check Network Tab
- Open F12 → Network
- Try checkout
- Look for failed requests
- Check response codes

### 2. Check Console Errors
- Look for CORS errors
- Check for mixed content warnings
- Verify environment variables

### 3. Test Backend Directly
```bash
# Test health endpoint
curl https://boult-india-bakend-new.onrender.com/health

# Test with your domain origin
curl -H "Origin: https://your-domain.com" \
     https://boult-india-bakend-new.onrender.com/health
```

---

## 📋 Quick Checklist

### Backend Issues:
- [ ] Backend is awake (not sleeping)
- [ ] CORS includes your domain
- [ ] API endpoints responding
- [ ] Environment variables correct

### Frontend Issues:
- [ ] HTTPS site (not HTTP)
- [ ] Environment variables set
- [ ] No mixed content errors
- [ ] Network requests working

### Hostinger Issues:
- [ ] SSL certificate active
- [ ] .htaccess uploaded
- [ ] No server-side blocking
- [ ] Domain properly configured

---

## 🎯 Most Likely Fix

**The issue is probably CORS!** Your Hostinger domain needs to be added to the backend CORS configuration.

### What I Need:
1. **Your exact Hostinger domain** (e.g., `https://boultindia.com`)
2. **Browser console errors** (screenshot)
3. **Network tab failed requests** (screenshot)

### What I'll Do:
1. Update backend CORS with your domain
2. Redeploy backend
3. Test the connection
4. Verify payments work

---

## 📞 Immediate Action

**Send me your Hostinger domain URL and I'll fix the CORS issue right away!**

Example: `https://yoursite.com` or `https://boultindia.hostinger.com`

This should resolve the network error immediately! 🚀