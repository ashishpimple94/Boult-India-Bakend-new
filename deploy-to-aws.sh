#!/bin/bash

# Deploy Backend to AWS EC2
# Run this script from your local machine

AWS_IP="3.110.160.80"
AWS_USER="ubuntu"
KEY_FILE="node-server-key.pem"

echo "🚀 Deploying Boult India Backend to AWS..."
echo ""

# Step 1: Upload backend
echo "📦 Uploading backend to AWS..."
scp -i $KEY_FILE boult-backend-aws.tar.gz $AWS_USER@$AWS_IP:/home/ubuntu/

if [ $? -ne 0 ]; then
    echo "❌ Failed to upload backend"
    exit 1
fi

echo "✅ Backend uploaded successfully"
echo ""

# Step 2: SSH and setup
echo "🔧 Setting up backend on AWS..."
ssh -i $KEY_FILE $AWS_USER@$AWS_IP << 'ENDSSH'

# Navigate to home
cd /home/ubuntu

# Extract backend
echo "📦 Extracting backend..."
rm -rf boult-backend
mkdir -p boult-backend
tar -xzf boult-backend-aws.tar.gz -C boult-backend

# Navigate to backend
cd boult-backend

# Install Node.js if not installed
if ! command -v node &> /dev/null; then
    echo "📥 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 if not installed
if ! command -v pm2 &> /dev/null; then
    echo "📥 Installing PM2..."
    sudo npm install -g pm2
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Create uploads directory
mkdir -p uploads

# Stop existing backend
echo "🛑 Stopping existing backend..."
pm2 delete boult-backend 2>/dev/null || true

# Start backend with PM2
echo "🚀 Starting backend..."
PORT=5000 pm2 start server.js --name boult-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu 2>/dev/null || true
pm2 save

# Show status
echo ""
echo "📊 Backend Status:"
pm2 status

echo ""
echo "📝 Recent Logs:"
pm2 logs boult-backend --lines 20 --nostream

echo ""
echo "🔍 Testing backend..."
sleep 3
curl -s http://localhost:5000/ | head -5

ENDSSH

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment Complete!"
    echo ""
    echo "🌐 Backend URL: http://$AWS_IP:5000"
    echo ""
    echo "📌 Next Steps:"
    echo "   1. Open AWS Console → EC2 → Security Groups"
    echo "   2. Add Inbound Rule: Port 5000, Source: 0.0.0.0/0"
    echo "   3. Test: http://$AWS_IP:5000/api/products"
    echo ""
    echo "🔧 Useful Commands:"
    echo "   ssh -i $KEY_FILE $AWS_USER@$AWS_IP"
    echo "   pm2 status"
    echo "   pm2 logs boult-backend"
    echo "   pm2 restart boult-backend"
else
    echo ""
    echo "❌ Deployment failed!"
    exit 1
fi
