#!/bin/bash

echo "🔄 Waking up Render backend..."
echo ""

BACKEND_URL="https://boult-india-bakend-new.onrender.com"

echo "Sending wake-up requests..."
for i in {1..3}; do
    echo "Request $i..."
    curl -s -m 30 "$BACKEND_URL/health" > /dev/null &
done

echo ""
echo "⏳ Waiting for backend to wake up..."
sleep 10

echo "🧪 Testing backend status..."
response=$(curl -s -m 15 "$BACKEND_URL/health" 2>/dev/null)

if [[ $response == *"Backend is running"* ]]; then
    echo "✅ Backend is awake and ready!"
    echo "Response: $response"
else
    echo "⚠️ Backend might still be starting up..."
    echo "Please wait another 30-60 seconds and try again."
fi

echo ""
echo "🎯 Admin Panel: http://localhost:3001"