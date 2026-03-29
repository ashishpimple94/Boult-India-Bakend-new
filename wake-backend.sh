#!/bin/bash

echo "🔍 Checking Backend Status..."
echo ""

BACKEND_URL="https://boult-india-backend-new.onrender.com"

echo "📡 Pinging backend: $BACKEND_URL"
echo ""

response=$(curl -s -o /dev/null -w "%{http_code}" --max-time 60 "$BACKEND_URL/")

if [ "$response" = "200" ]; then
    echo "✅ Backend is RUNNING!"
    echo ""
    echo "Response:"
    curl -s "$BACKEND_URL/" | jq '.' 2>/dev/null || curl -s "$BACKEND_URL/"
else
    echo "❌ Backend is NOT responding (HTTP $response)"
    echo ""
    echo "Possible reasons:"
    echo "1. Backend is sleeping (Render free tier)"
    echo "2. Deployment failed"
    echo "3. MongoDB connection issue"
    echo ""
    echo "💡 Solution:"
    echo "1. Check Render dashboard: https://dashboard.render.com"
    echo "2. Check deploy logs for errors"
    echo "3. Wait 30-60 seconds for backend to wake up"
fi

echo ""
echo "🔗 Render Dashboard: https://dashboard.render.com"
