# Deploy to Hostinger - Quick Guide

## Your Production Builds Are Ready! 🚀

### Files to Upload:
```
FINAL_HOSTINGER_UPLOAD/
├── ecommerce.zip       (17.3 MB) → Upload to public_html
└── admin-panel.zip     (9.1 MB)  → Upload to admin subdomain
```

## Step-by-Step Deployment:

### 1. Deploy Ecommerce Site (Main Website)

**Login to Hostinger:**
- Go to: https://hpanel.hostinger.com
- Navigate to: File Manager → public_html

**Upload & Extract:**
```bash
1. Click "Upload Files"
2. Select: FINAL_HOSTINGER_UPLOAD/ecommerce.zip
3. Wait for upload to complete
4. Right-click on ecommerce.zip → Extract
5. Move all files from extracted folder to public_html root
6. Delete the zip file and empty folder
```

**Verify Files:**
- index.html (main file)
- static/ folder (JS and CSS)
- All product images (.png files)
- .htaccess file (for React routing)

### 2. Deploy Admin Panel

**Setup Admin Subdomain:**
- Go to: Hostinger → Domains → Subdomains
- Create subdomain: admin.boultindia.com
- Point to folder: /public_html/admin

**Upload & Extract:**
```bash
1. Create folder: /public_html/admin
2. Upload: FINAL_HOSTINGER_UPLOAD/admin-panel.zip
3. Extract to /public_html/admin
4. Move all files to admin folder root
5. Delete zip file
```

### 3. Test Your Deployment

**Ecommerce Site:**
- Visit: https://boultindia.com
- Test: Browse products, add to cart
- Test: Place COD order
- Test: Track order with Order ID + Email

**Admin Panel:**
- Visit: https://admin.boultindia.com
- Login with admin credentials
- Check: Dashboard loads orders
- Check: Can update order status
- Check: Can add shipping charges (triggers invoice email)

### 4. Verify Email System

**Order Confirmation Email:**
- Place a test order
- Check email inbox
- Should receive: "Delivery charges may apply" notice

**Invoice Email:**
- Login to admin panel
- Add shipping charges to an order
- Customer should receive: Updated invoice with final total

## Backend Status:

✅ AWS Backend Running: http://3.110.160.80:5000
✅ MongoDB Connected: 10 orders in database
✅ Email System: Hostinger SMTP configured
✅ All APIs Working: Orders, Products, Track Order, Razorpay

## What to Expect After Deployment:

### Performance:
- ⚡ Fast loading (no AWS latency)
- ⚡ Quick order placement
- ⚡ Smooth dashboard updates

### Features Working:
- ✅ Product browsing and search
- ✅ Add to cart and checkout
- ✅ COD and Razorpay payments
- ✅ Order tracking (Order ID + Email)
- ✅ Email confirmations
- ✅ Admin dashboard
- ✅ Order management
- ✅ Automatic invoice emails

## Troubleshooting:

### If site shows 404:
- Check .htaccess file exists
- Verify all files extracted to correct location

### If images don't load:
- Check image files uploaded
- Verify file permissions (644 for files, 755 for folders)

### If API calls fail:
- Check AWS backend is running: http://3.110.160.80:5000
- Verify CORS settings allow your domain

### If emails don't send:
- Check AWS backend .env has email credentials
- Verify Hostinger SMTP settings

## Need Help?

The local development issues (slow loading, network errors) will NOT exist in production. Everything is configured correctly and ready to go!

**Just upload and test!** 🎉
