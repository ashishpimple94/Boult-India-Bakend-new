#!/bin/bash

# AWS Backend Setup Script
# Run this on your AWS EC2 instance

echo "🚀 Starting Boult India Backend Setup on AWS..."

# 1. Navigate to home directory
cd /home/ubuntu

# 2. Extract backend (if tar.gz exists)
if [ -f "boult-backend.tar.gz" ]; then
    echo "📦 Extracting backend..."
    rm -rf boult-backend
    mkdir -p boult-backend
    tar -xzf boult-backend.tar.gz -C boult-backend
else
    echo "⚠️  boult-backend.tar.gz not found. Please upload it first."
    exit 1
fi

# 3. Navigate to backend directory
cd boult-backend

# 4. Install Node.js if not installed
if ! command -v node &> /dev/null; then
    echo "📥 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# 5. Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
    echo "📥 Installing PM2..."
    sudo npm install -g pm2
fi

# 6. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 7. Stop existing PM2 process if running
echo "🛑 Stopping existing backend..."
pm2 delete boult-backend 2>/dev/null || true

# 8. Start backend with PM2
echo "🚀 Starting backend with PM2..."
pm2 start server.js --name boult-backend

# 9. Save PM2 configuration
pm2 save

# 10. Setup PM2 to start on system boot
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 save

# 11. Check status
echo ""
echo "✅ Backend setup complete!"
echo ""
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "📝 Recent logs:"
pm2 logs boult-backend --lines 20 --nostream

echo ""
echo "🔍 Testing backend..."
sleep 2
curl http://localhost:5000/ || echo "⚠️  Backend not responding on port 5000"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📌 Useful commands:"
echo "   pm2 status              - Check backend status"
echo "   pm2 logs boult-backend  - View logs"
echo "   pm2 restart boult-backend - Restart backend"
echo "   pm2 stop boult-backend  - Stop backend"
echo ""
echo "🌐 Backend should be accessible at: http://3.110.160.80:5000"
