#!/bin/bash

echo "🔄 Testing Backend Connections..."
echo ""

echo "1. Testing Backend Health..."
curl -s http://localhost:5000/health | jq -r '.status // "Failed"'
echo ""

echo "2. Testing Admin Login..."
curl -s -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r '.user.name // .error // "Failed"'
echo ""

echo "3. Testing Razorpay Order Creation..."
curl -s -X POST http://localhost:5000/api/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount":1000,"orderId":"TEST_'$(date +%s)'","customer":"Test User"}' | jq -r '.order.id // .error // "Failed"'
echo ""

echo "4. Testing User Registration..."
curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test'$(date +%s)'@example.com","password":"test123"}' | jq -r '.user.email // .error // "Failed"'
echo ""

echo "🎯 Connection Tests Complete!"
echo ""
echo "📱 Frontend URLs:"
echo "   Admin Panel: http://localhost:3001"
echo "   E-commerce:  http://localhost:3002"
echo "   Backend API: http://localhost:5000"