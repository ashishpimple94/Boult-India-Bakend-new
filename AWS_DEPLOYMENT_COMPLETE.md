# 🚀 AWS Complete Deployment Guide

## Current Setup

**Local Development:**
- Backend: `http://localhost:5001` ✅
- Ecommerce: `http://localhost:3001` ✅
- Admin: `http://localhost:3002` ✅

**AWS Production:**
- Backend: `http://3.110.160.80:5000` (to be deployed)
- Ecommerce: Hostinger
- Admin: Hostinger

---

## Step 1: Deploy Backend to AWS

### Automatic Deployment (Recommended)

```bash
./deploy-to-aws.sh
```

This script will:
1. Upload backend to AWS
2. Install dependencies
3. Start with PM2
4. Configure auto-start on reboot

### Manual Deployment

```bash
# 1. Upload backend
scp -i node-server-key.pem boult-backend-aws.tar.gz ubuntu@3.110.160.80:/home/ubuntu/

# 2. SSH to AWS
ssh -i node-server-key.pem ubuntu@3.110.160.80

# 3. On AWS terminal:
cd /home/ubuntu
tar -xzf boult-backend-aws.tar.gz -C boult-backend
cd boult-backend
npm install --production
pm2 start server.js --name boult-backend
pm2 save
```

---

## Step 2: Configure AWS Security Group

⚠️ **CRITICAL**: Port 5000 must be open!

1. Go to AWS Console → EC2 → Security Groups
2. Select your instance's security group
3. Add Inbound Rule:
   - **Type**: Custom TCP
   - **Port Range**: 5000
   - **Source**: 0.0.0.0/0 (or specific IPs for security)
   - **Description**: Backend API

---

## Step 3: Test AWS Backend

### From AWS Terminal
```bash
curl http://localhost:5000/
curl http://localhost:5000/api/products
```

### From Your Browser
```
http://3.110.160.80:5000/
http://3.110.160.80:5000/api/products
```

### Expected Response
```json
{
  "success": true,
  "products": [...],
  "count": 22
}
```

---

## Step 4: Build Frontend for Production

### Ecommerce
```bash
cd boult-react-ecommerce
npm run build
```

### Admin Panel
```bash
cd boult-react-admin
npm run build
```

Build files will be in `build/` folder, ready for Hostinger upload.

---

## Step 5: Upload to Hostinger

### Ecommerce (boultindia.com)
1. Go to Hostinger File Manager
2. Navigate to `public_html/`
3. Upload all files from `boult-react-ecommerce/build/`

### Admin Panel (boultindia.com/admin)
1. Go to Hostinger File Manager
2. Navigate to `public_html/admin/`
3. Upload all files from `boult-react-admin/build/`

---

## Environment Variables

### Local Development (.env.local)
```
REACT_APP_BACKEND_URL=http://localhost:5001
```

### Production (.env.production)
```
REACT_APP_BACKEND_URL=http://3.110.160.80:5000
```

---

## PM2 Commands (AWS)

```bash
# View status
pm2 status

# View logs
pm2 logs boult-backend

# Restart
pm2 restart boult-backend

# Stop
pm2 stop boult-backend

# Monitor
pm2 monit

# View detailed info
pm2 show boult-backend
```

---

## Troubleshooting

### Backend not accessible from browser?
1. Check Security Group has port 5000 open
2. Check backend is running: `pm2 status`
3. Check logs: `pm2 logs boult-backend`
4. Test locally first: `curl http://localhost:5000/`

### MongoDB connection issues?
```bash
# Check environment variables
cat /home/ubuntu/boult-backend/.env | grep MONGODB

# Test connection
cd /home/ubuntu/boult-backend
node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('✅ Connected')).catch(e => console.log('❌ Error:', e.message))"
```

### Port 5000 already in use?
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
pm2 restart boult-backend
```

### Frontend showing old data?
1. Clear browser cache (Ctrl+Shift+R)
2. Check Network tab in DevTools
3. Verify API URL in .env.production

---

## Complete Architecture

```
┌─────────────────────────────────────────────┐
│           Users (Browser)                    │
└─────────────────┬───────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌──────────────┐    ┌──────────────┐
│  Ecommerce   │    │ Admin Panel  │
│  (Hostinger) │    │ (Hostinger)  │
└──────┬───────┘    └──────┬───────┘
       │                   │
       └─────────┬─────────┘
                 │
                 ▼
        ┌────────────────┐
        │  Backend API   │
        │  (AWS EC2)     │
        │  Port 5000     │
        └────────┬───────┘
                 │
                 ▼
        ┌────────────────┐
        │  MongoDB Atlas │
        │  (Cloud)       │
        └────────────────┘
```

---

## URLs Summary

### Development
- Backend: http://localhost:5001
- Ecommerce: http://localhost:3001
- Admin: http://localhost:3002

### Production
- Backend: http://3.110.160.80:5000
- Ecommerce: https://boultindia.com
- Admin: https://boultindia.com/admin

---

## Next Steps

1. ✅ Deploy backend to AWS: `./deploy-to-aws.sh`
2. ✅ Configure Security Group (Port 5000)
3. ✅ Test backend: `http://3.110.160.80:5000/api/products`
4. ✅ Build frontend: `npm run build`
5. ✅ Upload to Hostinger
6. ✅ Test complete flow

---

## Support

If issues occur:
1. Check PM2 logs: `pm2 logs boult-backend`
2. Check MongoDB connection
3. Verify Security Group settings
4. Test API endpoints with curl
5. Check browser console for errors
