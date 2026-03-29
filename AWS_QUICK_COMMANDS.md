# ⚡ AWS Quick Commands Reference

## 🔌 Connect to AWS
```bash
ssh -i node-server-key.pem ubuntu@3.110.160.80
```

## 📦 Upload Backend
```bash
scp -i node-server-key.pem boult-backend.tar.gz ubuntu@3.110.160.80:/home/ubuntu/
```

## 🚀 Setup Backend (One Command)
```bash
cd /home/ubuntu && tar -xzf boult-backend.tar.gz && cd boult-backend && npm install && pm2 delete boult-backend 2>/dev/null; pm2 start server.js --name boult-backend && pm2 save
```

## 📊 Check Status
```bash
pm2 status
pm2 logs boult-backend --lines 20
curl http://localhost:5000/
```

## 🔄 Restart Backend
```bash
pm2 restart boult-backend
```

## 🛑 Stop Backend
```bash
pm2 stop boult-backend
```

## 🗑️ Delete Process
```bash
pm2 delete boult-backend
```

## 📝 View Full Logs
```bash
pm2 logs boult-backend
```

## 🔍 Test API
```bash
# Health check
curl http://localhost:5000/

# Get products
curl http://localhost:5000/api/products

# Get specific product
curl http://localhost:5000/api/products/1

# Test from browser
http://3.110.160.80:5000/api/products
```

## 🔧 Troubleshooting

### Port already in use?
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
```

### Check environment variables
```bash
cat /home/ubuntu/boult-backend/.env
```

### Check MongoDB connection
```bash
cd /home/ubuntu/boult-backend
node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('✅ Connected')).catch(e => console.log('❌ Error:', e.message))"
```

### Fresh restart
```bash
pm2 delete boult-backend
cd /home/ubuntu/boult-backend
pm2 start server.js --name boult-backend
pm2 save
```

## 💻 Local Development

### Start Ecommerce
```bash
cd boult-react-ecommerce
npm start
```

### Start Admin
```bash
cd boult-react-admin
npm start
```

### Quick Start (Both)
```bash
chmod +x START_AWS_DEVELOPMENT.sh
./START_AWS_DEVELOPMENT.sh
```

## 🌐 URLs

- **Backend API**: http://3.110.160.80:5000
- **Ecommerce**: http://localhost:3000
- **Admin Panel**: http://localhost:3001

## ⚠️ Important

1. **Security Group**: Port 5000 must be open in AWS Console
2. **MongoDB**: Already configured in .env
3. **PM2**: Auto-starts on server reboot
4. **Logs**: Always check `pm2 logs` if issues occur
