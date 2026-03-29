#!/bin/bash

echo "🚀 Setting up Boult Backend on AWS EC2..."

# Extract backend
cd /home/ubuntu
mkdir -p boult-backend
tar -xzf boult-backend.tar.gz -C boult-backend
cd boult-backend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Start with PM2
echo "🔥 Starting backend with PM2..."
pm2 delete boult-backend 2>/dev/null || true
pm2 start server.js --name boult-backend
pm2 save

echo "✅ Backend setup complete!"
echo "📊 Status:"
pm2 status
