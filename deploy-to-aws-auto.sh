#!/bin/bash

# AWS Deployment Script for Boult Backend
# This script will SSH into AWS and deploy the latest code

echo "🚀 Starting AWS Deployment..."

# Configuration
AWS_IP="3.110.160.80"
AWS_USER="ubuntu"
KEY_FILE="$HOME/Downloads/node-server-key.pem"
BACKEND_DIR="boult-backend"

# Check if key file exists
if [ ! -f "$KEY_FILE" ]; then
    echo "❌ Error: Key file not found at: $KEY_FILE"
    echo "Please make sure 'node-server-key' is in your Downloads folder"
    exit 1
fi

# Set correct permissions for key file
chmod 400 "$KEY_FILE"

echo "📡 Connecting to AWS server..."

# SSH into AWS and deploy
ssh -i "$KEY_FILE" -o StrictHostKeyChecking=no "$AWS_USER@$AWS_IP" << 'ENDSSH'
    echo "✅ Connected to AWS server"
    
    # Navigate to backend directory
    cd boult-backend || { echo "❌ Backend directory not found"; exit 1; }
    
    echo "📥 Pulling latest code from GitHub..."
    git pull origin main
    
    echo "📦 Installing dependencies..."
    npm install
    
    echo "🔄 Restarting backend service..."
    # Check if PM2 is being used
    if command -v pm2 &> /dev/null; then
        echo "Using PM2 to restart..."
        pm2 restart boult-backend || pm2 start npm --name "boult-backend" -- start
        pm2 save
    else
        echo "PM2 not found. Please restart the backend manually with: npm start"
    fi
    
    echo "✅ Deployment complete!"
    echo "🌐 Backend running at: http://3.110.160.80:5000"
ENDSSH

echo ""
echo "✅ AWS Deployment Completed Successfully!"
echo "🌐 Backend URL: http://3.110.160.80:5000"
echo "📊 Check status: http://3.110.160.80:5000/api/products"
