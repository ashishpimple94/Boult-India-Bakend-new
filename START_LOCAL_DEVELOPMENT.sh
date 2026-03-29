#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting Boult India React Development Environment${NC}\n"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo -e "${GREEN}✓ Node.js is installed${NC}"
echo "Node version: $(node --version)"
echo "npm version: $(npm --version)"
echo ""

# Start Backend
echo -e "${BLUE}Starting Backend Server...${NC}"
cd boult-backend
npm install > /dev/null 2>&1
npm start &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
echo "  URL: http://localhost:5000"
echo "  Health: http://localhost:5000/health"
sleep 2
echo ""

# Start React Admin
echo -e "${BLUE}Starting React Admin Dashboard...${NC}"
cd ../boult-react-admin
npm install > /dev/null 2>&1
npm start &
ADMIN_PID=$!
echo -e "${GREEN}✓ Admin Dashboard started (PID: $ADMIN_PID)${NC}"
echo "  URL: http://localhost:3000"
sleep 2
echo ""

# Start React E-commerce
echo -e "${BLUE}Starting React E-commerce App...${NC}"
cd ../boult-react-ecommerce
npm install > /dev/null 2>&1
npm start &
ECOMMERCE_PID=$!
echo -e "${GREEN}✓ E-commerce App started (PID: $ECOMMERCE_PID)${NC}"
echo "  URL: http://localhost:3001"
echo ""

echo -e "${GREEN}All services are running!${NC}"
echo ""
echo "Services:"
echo "  Backend:     http://localhost:5000"
echo "  Admin:       http://localhost:3000"
echo "  E-commerce:  http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for all processes
wait
