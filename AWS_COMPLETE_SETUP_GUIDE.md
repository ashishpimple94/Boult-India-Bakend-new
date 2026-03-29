# 🚀 AWS Backend Complete Setup Guide

## Current Status
- **AWS IP**: 3.110.160.80
- **Backend Port**: 5000
- **Frontend Apps**: Already configured to use AWS backend

---

## Step 1: AWS Terminal Setup

### Connect to AWS (if not connected)
```bash
ssh -i node-server-key.pem ubuntu@3.110.160.80
```

### Upload Backend to AWS
```bash
# On your local machine, from project root:
scp -i node-server-key.pem boult-backend.tar.gz ubuntu@3.110.160.80:/home/ubuntu/
```

---

## Step 2: Run Setup Script on AWS

### Option A: Automated Setup (Recommended)
```bash
# On AWS terminal:
cd /home/ubuntu
chmod +x AWS_BACKEND_SETUP.sh
./AWS_BACKEND_SETUP.sh
```

### Option B: Manual Setup
```bash
# 1. Extract backend
cd /home/ubuntu
tar -xzf boult-backend.tar.gz -C boult-backend 2>/dev/null || mkdir -p boult-backend && tar -xzf boult-backend.tar.gz -C boult-backend
cd boult-backend

# 2. Install dependencies
npm install

# 3. Install PM2 (if not installed)
sudo npm install -g pm2

# 4. Start backend
pm2 delete boult-backend 2>/dev/null || true
pm2 start server.js --name boult-backend
pm2 save

# 5. Setup auto-start on reboot
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 save

# 6. Check status
pm2 status
pm2 logs boult-backend --lines 20
```

---

## Step 3: Verify Backend

### Test from AWS terminal
```bash
curl http://localhost:5000/
curl http://localhost:5000/api/products
```

### Test from your browser
```
http://3.110.160.80:5000/
http://3.110.160.80:5000/api/products
```

---

## Step 4: Configure AWS Security Group

### ⚠️ IMPORTANT: Open Port 5000

1. Go to AWS Console → EC2 → Security Groups
2. Find your instance's security group
3. Add Inbound Rule:
   - **Type**: Custom TCP
   - **Port**: 5000
   - **Source**: 0.0.0.0/0 (or your IP for security)
   - **Description**: Backend API

---

## Step 5: Start Frontend Apps

### Ecommerce (Port 3000)
```bash
cd boult-react-ecommerce
npm install
npm start
```

### Admin Panel (Port 3001)
```bash
cd boult-react-admin
npm install
npm start
```

---

## PM2 Useful Commands

```bash
# View status
pm2 status

# View logs
pm2 logs boult-backend

# Restart backend
pm2 restart boult-backend

# Stop backend
pm2 stop boult-backend

# Delete process
pm2 delete boult-backend

# Monitor in real-time
pm2 monit
```

---

## Troubleshooting

### Backend not starting?
```bash
cd /home/ubuntu/boult-backend
pm2 logs boult-backend --lines 50
```

### Port 5000 already in use?
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
```

### MongoDB connection issues?
Check .env file has correct MongoDB URI:
```bash
cat /home/ubuntu/boult-backend/.env | grep MONGODB
```

### Can't access from browser?
1. Check AWS Security Group has port 5000 open
2. Check backend is running: `pm2 status`
3. Check firewall: `sudo ufw status`

---

## Environment Variables

Backend `.env` is already configured with:
- ✅ MongoDB Atlas connection
- ✅ Razorpay keys
- ✅ Email configuration
- ✅ JWT secrets

---

## API Endpoints

Once backend is running, these endpoints will be available:

### Products
- GET `http://3.110.160.80:5000/api/products`
- GET `http://3.110.160.80:5000/api/products/:id`
- POST `http://3.110.160.80:5000/api/products` (Admin)
- PUT `http://3.110.160.80:5000/api/products/:id` (Admin)
- DELETE `http://3.110.160.80:5000/api/products/:id` (Admin)

### Orders
- GET `http://3.110.160.80:5000/api/orders`
- POST `http://3.110.160.80:5000/api/orders`
- GET `http://3.110.160.80:5000/api/orders/:id`
- PUT `http://3.110.160.80:5000/api/orders/:id/status`

### Banners
- GET `http://3.110.160.80:5000/api/banners`
- POST `http://3.110.160.80:5000/api/banners` (Admin)

### Contact
- POST `http://3.110.160.80:5000/api/contact`

---

## Next Steps

1. ✅ Setup backend on AWS
2. ✅ Configure Security Group
3. ✅ Test API endpoints
4. ✅ Start frontend apps locally
5. 🎯 Test complete flow (browse → add to cart → checkout → payment)

---

## Support

If you face any issues:
1. Check PM2 logs: `pm2 logs boult-backend`
2. Check MongoDB connection
3. Verify Security Group settings
4. Test with curl from AWS terminal first
