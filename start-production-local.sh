#!/bin/bash

echo "🚀 Starting Production Builds Locally..."
echo ""

# Check if serve is installed
if ! command -v serve &> /dev/null; then
    echo "Installing serve..."
    npm install -g serve
fi

echo "🎯 Starting Admin Panel on port 3001..."
cd boult-react-admin
serve -s build -p 3001 &
ADMIN_PID=$!

echo "🛒 Starting E-commerce on port 3002..."
cd ../boult-react-ecommerce
serve -s build -p 3002 &
ECOMMERCE_PID=$!

cd ..

echo ""
echo "✅ Production builds are now running:"
echo ""
echo "🔧 Admin Panel:  http://localhost:3001"
echo "🛒 E-commerce:   http://localhost:3002"
echo "🌐 Backend API:  https://boult-india-bakend-new.onrender.com"
echo ""
echo "🔑 Admin Credentials: admin/admin123 or boultadmin/boult2026"
echo ""
echo "Press Ctrl+C to stop all servers..."

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $ADMIN_PID 2>/dev/null
    kill $ECOMMERCE_PID 2>/dev/null
    echo "✅ All servers stopped."
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait