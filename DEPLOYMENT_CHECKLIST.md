# Deployment Checklist

## Phase 1: Fix Razorpay (URGENT - Do This First)

### Get Complete Keys
- [ ] Go to https://dashboard.razorpay.com
- [ ] Login to your account
- [ ] Navigate to Settings → API Keys
- [ ] Copy complete Key ID (should be 40+ characters)
- [ ] Copy complete Key Secret (should be 40+ characters)
- [ ] Verify keys are NOT truncated

### Update Environment
- [ ] Open `boult-india-ecommerce/.env.local`
- [ ] Replace RAZORPAY_KEY_ID with complete key
- [ ] Replace RAZORPAY_KEY_SECRET with complete key
- [ ] Replace NEXT_PUBLIC_RAZORPAY_KEY_ID with complete key
- [ ] Save file
- [ ] Restart dev server (Ctrl+C, then `npm run dev`)

### Test Razorpay
- [ ] Visit http://localhost:3002/test-razorpay
- [ ] Click "Load Razorpay Script"
- [ ] Verify "✓ Script loaded successfully" appears
- [ ] Enter test amount (e.g., 100)
- [ ] Click "Create Test Order"
- [ ] Verify order is created successfully
- [ ] Check browser console (F12) for any errors

### Test Payment Flow
- [ ] Add product to cart
- [ ] Go to checkout
- [ ] Fill in all shipping details
- [ ] Select payment method (Card/UPI/Net Banking)
- [ ] Click "Place Order & Pay"
- [ ] Verify Razorpay modal opens
- [ ] Test payment (use test card if using test keys)
- [ ] Verify order confirmation page appears

**Status**: ⏳ Waiting for you to get complete keys

---

## Phase 2: Deploy Backend to Render

### Prepare GitHub
- [ ] Navigate to `boult-backend` folder
- [ ] Initialize git: `git init`
- [ ] Add all files: `git add .`
- [ ] Commit: `git commit -m "Initial backend setup"`
- [ ] Create GitHub repository
- [ ] Add remote: `git remote add origin https://github.com/YOUR_USERNAME/REPO.git`
- [ ] Push: `git push -u origin main`

### Create Render Service
- [ ] Go to https://dashboard.render.com
- [ ] Sign up or login
- [ ] Click "New +" → "Web Service"
- [ ] Select "Deploy an existing repository"
- [ ] Connect GitHub account
- [ ] Select your repository
- [ ] Name: `boult-backend`
- [ ] Environment: `Node`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`

### Set Environment Variables
- [ ] Click "Environment" section
- [ ] Add `RAZORPAY_KEY_ID` = your complete key
- [ ] Add `RAZORPAY_KEY_SECRET` = your complete key
- [ ] Add `PORT` = 5000
- [ ] Add `NODE_ENV` = production
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (2-5 minutes)
- [ ] Copy backend URL (e.g., https://boult-backend.onrender.com)

### Test Backend
- [ ] Visit https://boult-backend.onrender.com/health
- [ ] Verify response: `{ "status": "Backend is running" }`
- [ ] Visit https://boult-backend.onrender.com/api/products
- [ ] Verify products list returns

**Status**: ⏳ Waiting for backend deployment

---

## Phase 3: Update Frontend API URLs

### Update E-commerce App
- [ ] Open `boult-india-ecommerce/src/app/checkout/page.tsx`
- [ ] Find all `/api/` calls
- [ ] Replace with `https://boult-backend.onrender.com/api/`
- [ ] Save file

### Update Admin Panel
- [ ] Open `boult-admin/app/orders/page.tsx`
- [ ] Find all `/api/` calls
- [ ] Replace with `https://boult-backend.onrender.com/api/`
- [ ] Save file

### Update Products Page
- [ ] Open `boult-india-ecommerce/src/app/products/page.tsx`
- [ ] Find `/api/products` call
- [ ] Replace with `https://boult-backend.onrender.com/api/products`
- [ ] Save file

### Update Admin Products
- [ ] Open `boult-admin/app/products/page.tsx`
- [ ] Find `/api/products` calls
- [ ] Replace with `https://boult-backend.onrender.com/api/products`
- [ ] Save file

### Test Updated URLs
- [ ] Restart dev servers
- [ ] Test products page loads
- [ ] Test checkout flow
- [ ] Test admin dashboard
- [ ] Verify data syncs between apps

**Status**: ⏳ Waiting for backend deployment

---

## Phase 4: Deploy Frontend to Vercel

### Prepare for Deployment
- [ ] Push all changes to GitHub
- [ ] Verify `.env.local` is in `.gitignore`
- [ ] Build locally: `npm run build`
- [ ] Verify build succeeds

### Deploy to Vercel
- [ ] Go to https://vercel.com
- [ ] Sign up or login
- [ ] Click "Add New..." → "Project"
- [ ] Import your GitHub repository
- [ ] Select `boult-india-ecommerce` folder
- [ ] Framework: Next.js
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`

### Set Environment Variables
- [ ] Add `NEXT_PUBLIC_RAZORPAY_KEY_ID` = your complete key
- [ ] Click "Deploy"
- [ ] Wait for deployment (2-5 minutes)
- [ ] Copy Vercel URL

### Test Live Site
- [ ] Visit your Vercel URL
- [ ] Test product listing
- [ ] Test product details
- [ ] Test add to cart
- [ ] Test checkout
- [ ] Test payment flow
- [ ] Test order confirmation

**Status**: ⏳ Waiting for Vercel deployment

---

## Phase 5: Deploy Admin Panel to Vercel

### Deploy to Vercel
- [ ] Go to https://vercel.com
- [ ] Click "Add New..." → "Project"
- [ ] Import your GitHub repository
- [ ] Select `boult-admin` folder
- [ ] Framework: Next.js
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`
- [ ] Click "Deploy"
- [ ] Wait for deployment

### Test Admin Panel
- [ ] Visit Vercel URL for admin
- [ ] Test dashboard loads
- [ ] Test orders page
- [ ] Test products page
- [ ] Verify data syncs with e-commerce

**Status**: ⏳ Waiting for admin deployment

---

## Phase 6: Final Testing

### E-commerce Testing
- [ ] Product listing works
- [ ] Product details load
- [ ] Add to cart works
- [ ] Cart updates correctly
- [ ] Checkout form validates
- [ ] Payment methods display
- [ ] Razorpay modal opens
- [ ] Payment processes
- [ ] Order confirmation shows
- [ ] Invoice downloads
- [ ] User can login/signup
- [ ] Order history displays

### Admin Testing
- [ ] Dashboard loads
- [ ] Statistics update
- [ ] Orders display
- [ ] Can update order status
- [ ] Can delete orders
- [ ] Products page loads
- [ ] Can add products
- [ ] Can edit products
- [ ] Can delete products
- [ ] Invoice downloads

### Integration Testing
- [ ] Orders sync between apps
- [ ] Products sync between apps
- [ ] Payment data persists
- [ ] User data persists
- [ ] No console errors
- [ ] No network errors

**Status**: ⏳ Waiting for all deployments

---

## Phase 7: Post-Deployment

### Monitor
- [ ] Check Render logs for errors
- [ ] Check Vercel logs for errors
- [ ] Monitor payment transactions
- [ ] Monitor user signups

### Optimize
- [ ] Enable caching
- [ ] Optimize images
- [ ] Minify CSS/JS
- [ ] Add analytics

### Security
- [ ] Enable HTTPS (automatic on Vercel/Render)
- [ ] Add rate limiting
- [ ] Validate all inputs
- [ ] Secure API keys
- [ ] Add CORS restrictions

### Backup
- [ ] Backup database
- [ ] Backup JSON files
- [ ] Document deployment process
- [ ] Create runbook

**Status**: ⏳ Post-deployment tasks

---

## Quick Status Summary

| Phase | Task | Status | Timeline |
|-------|------|--------|----------|
| 1 | Fix Razorpay Keys | ⏳ TODO | TODAY |
| 2 | Deploy Backend | ⏳ TODO | THIS WEEK |
| 3 | Update API URLs | ⏳ TODO | THIS WEEK |
| 4 | Deploy E-commerce | ⏳ TODO | THIS WEEK |
| 5 | Deploy Admin | ⏳ TODO | THIS WEEK |
| 6 | Final Testing | ⏳ TODO | THIS WEEK |
| 7 | Post-Deployment | ⏳ TODO | ONGOING |

---

## Important Notes

- **Never commit `.env` files** to GitHub
- **Always use environment variables** for secrets
- **Test locally first** before deploying
- **Keep backups** of all data
- **Monitor logs** after deployment
- **Have a rollback plan** ready

---

## Support Resources

- Razorpay Docs: https://razorpay.com/docs/
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Express Docs: https://expressjs.com/

---

**Last Updated**: January 29, 2026
**Next Action**: Get complete Razorpay keys and start Phase 1
