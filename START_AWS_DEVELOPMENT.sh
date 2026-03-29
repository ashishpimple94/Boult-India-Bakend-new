#!/bin/bash

# Quick Start Script for AWS Backend Development
# Run this on your LOCAL machine

echo "🚀 Starting Boult India Development with AWS Backend"
echo ""
echo "Backend: http://3.110.160.80:5000"
echo "Ecommerce: http://localhost:3000"
echo "Admin: http://localhost:3001"
echo ""

# Function to start a service in a new terminal
start_service() {
    local name=$1
    local dir=$2
    local port=$3
    
    echo "Starting $name on port $port..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        osascript -e "tell application \"Terminal\" to do script \"cd $(pwd)/$dir && npm start\""
    else
        # Linux
        gnome-terminal -- bash -c "cd $(pwd)/$dir && npm start; exec bash"
    fi
}

# Check if user wants to start ecommerce or admin
echo "Which app do you want to start?"
echo "1) Ecommerce (Port 3000)"
echo "2) Admin Panel (Port 3001)"
echo "3) Both"
read -p "Enter choice (1/2/3): " choice

case $choice in
    1)
        echo "Starting Ecommerce..."
        cd boult-react-ecommerce
        npm start
        ;;
    2)
        echo "Starting Admin Panel..."
        cd boult-react-admin
        npm start
        ;;
    3)
        echo "Starting both apps..."
        start_service "Ecommerce" "boult-react-ecommerce" "3000"
        sleep 2
        start_service "Admin Panel" "boult-react-admin" "3001"
        echo ""
        echo "✅ Both apps starting in separate terminals"
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Development environment ready!"
echo ""
echo "📌 URLs:"
echo "   Backend API: http://3.110.160.80:5000"
echo "   Ecommerce: http://localhost:3000"
echo "   Admin Panel: http://localhost:3001"
