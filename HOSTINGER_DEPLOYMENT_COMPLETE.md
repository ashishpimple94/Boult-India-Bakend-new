# Hostinger Deployment - Complete Guide with Razorpay

## 🚀 Pre-Deployment Checklist

### 1. Domain & SSL Setup
- [ ] HTTPS domain ready (Razorpay requires HTTPS)
- [ ] SSL certificate active
- [ ] Domain pointing to Hostinger

### 2. Razorpay Dashboard Configuration
- [ ] Login to Razorpay Dashboard
- [ ] Go to Settings > Website and App URLs
- [ ] Add your Hostinger domain:
  ```
  https://your-domain.com
  https://www.your-domain.com
  ```
- [ ] Save settings

### 3. Backend CORS Update
Update your Hostinger domain in backend CORS (already done):
```javascript
// In server.js - CORS origins include:
'https://your-hostinger-domain.com',
'https://www.your-hostinger-domain.com',
```

---

## 📦 Build & Upload Process

### Step 1: Build Production Files
```bash
# Build e-commerce
cd boult-react-ecommerce
npm run build

# Build admin panel
cd ../boult-react-admin
npm run build
```

### Step 2: Upload to Hostinger
1. **E-commerce**: Upload `boult-react-ecommerce/build/*` to `public_html/`
2. **Admin Panel**: Upload `boult-react-admin/build/*` to `public_html/admin/`

### Step 3: Verify .htaccess Files
Ensure these files are uploaded:
- `public_html/.htaccess` (for e-commerce)
- `public_html/admin/.htaccess` (for admin panel)

---

## 🔧 Razorpay Configuration

### Environment Variables (Already Set)
```bash
# Production environment
REACT_APP_BACKEND_URL=https://boult-india-bakend-new.onrender.com
REACT_APP_API_URL=https://boult-india-bakend-new.onrender.com/api
```

### Razorpay Keys (Backend)
```javascript
// In backend .env
RAZORPAY_KEY_ID=rzp_live_S9KdjLbjrue2F0
RAZORPAY_KEY_SECRET=sKJSmRJ7peYBxdkYIebeyXaV
```

---

## 🧪 Testing Checklist

### After Upload - Test These:

#### 1. Basic Site Loading
- [ ] `https://your-domain.com` loads
- [ ] `https://your-domain.com/admin` loads
- [ ] All pages accessible
- [ ] Images loading properly

#### 2. API Connectivity
- [ ] Products page loads
- [ ] User registration works
- [ ] Admin login works
- [ ] Orders visible in admin

#### 3. Razorpay Testing
- [ ] Add product to cart
- [ ] Go to checkout
- [ ] Select card/UPI payment
- [ ] Razorpay modal opens
- [ ] Test payment works

---

## 🚨 Common Issues & Fixes

### Issue 1: Razorpay Modal Not Opening
**Cause**: HTTP instead of HTTPS
**Fix**: Force HTTPS redirect in .htaccess:
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### Issue 2: "Domain Not Authorized"
**Cause**: Domain not added to Razorpay
**Fix**: Add domain in Razorpay Dashboard

### Issue 3: API Calls Failing
**Cause**: CORS issues
**Fix**: Backend CORS already updated with Hostinger domains

### Issue 4: Images Not Loading
**Cause**: Missing images in build
**Fix**: All images already in public folders

---

## 📋 Final Verification Commands

### Test Backend Connection:
```bash
curl -X GET "https://boult-india-bakend-new.onrender.com/health"
```

### Test Razorpay Order Creation:
```bash
curl -X POST "https://boult-india-bakend-new.onrender.com/api/razorpay/create-order" \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "orderId": "TEST_123", "customer": "Test"}'
```

---

## 🎯 Quick Deployment Steps

1. **Get HTTPS domain ready**
2. **Add domain to Razorpay dashboard**
3. **Build both apps**: `npm run build`
4. **Upload build folders to Hostinger**
5. **Test on HTTPS domain**
6. **Verify Razorpay payment**

---

## 📞 Support & Troubleshooting

### If Razorpay Still Doesn't Work:

1. **Check Browser Console**:
   - Look for Razorpay script errors
   - Check API call responses
   - Verify HTTPS protocol

2. **Test with Simple HTML**:
   Upload `test-razorpay-modal.html` to test directly

3. **Verify Domain**:
   - Ensure domain is HTTPS
   - Check Razorpay dashboard settings
   - Verify CORS in backend

### Emergency Fallback:
If Razorpay fails, COD (Cash on Delivery) will still work perfectly!

---

## ✅ Success Indicators

- [ ] Site loads on HTTPS
- [ ] All pages work
- [ ] Images display
- [ ] API calls successful
- [ ] Admin panel accessible
- [ ] Razorpay modal opens
- [ ] Test payment completes
- [ ] Orders save to backend

**Once all checkboxes are ✅, your site is ready for production!**