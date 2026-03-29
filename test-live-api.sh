#!/bin/bash

echo "🚀 Testing Live API Integration..."
echo ""

LIVE_API="https://boult-india-bakend-new.onrender.com"

echo "1. Testing Live API Health..."
curl -s $LIVE_API/health | jq -r '.status // "Failed"'
echo ""

echo "2. Testing Admin Login..."
curl -s -X POST $LIVE_API/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r '.user.name // .error // "Failed"'
echo ""

echo "3. Testing User Registration..."
curl -s -X POST $LIVE_API/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test'$(date +%s)'@example.com","password":"test123"}' | jq -r '.user.email // .error // "Failed"'
echo ""

echo "4. Testing Razorpay Order Creation..."
curl -s -X POST $LIVE_API/api/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount":1000,"orderId":"TEST_'$(date +%s)'","customer":"Test User"}' | jq -r '.order.id // .error // "Failed"'
echo ""

echo "🎯 Live API Integration Test Complete!"
echo ""
echo "📱 Frontend URLs (now using live API):"
echo "   Admin Panel: http://localhost:3001"
echo "   E-commerce:  http://localhost:3002"
echo "   Live API:    $LIVE_API"