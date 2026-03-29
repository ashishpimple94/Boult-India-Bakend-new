#!/bin/bash

echo "🐳 Testing Docker Setup for Boult India Backend"
echo "================================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://www.docker.com/products/docker-desktop"
    exit 1
fi

echo "✅ Docker is installed"

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed"
    exit 1
fi

echo "✅ docker-compose is installed"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found"
    echo "   Please create .env file with required variables"
    exit 1
fi

echo "✅ .env file found"

# Build Docker image
echo ""
echo "📦 Building Docker image..."
docker build -t boult-backend:test .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully"
else
    echo "❌ Failed to build Docker image"
    exit 1
fi

# Run container
echo ""
echo "🚀 Starting container..."
docker run -d \
  --name boult-backend-test \
  -p 5001:5000 \
  --env-file .env \
  boult-backend:test

if [ $? -eq 0 ]; then
    echo "✅ Container started successfully"
else
    echo "❌ Failed to start container"
    exit 1
fi

# Wait for container to be ready
echo ""
echo "⏳ Waiting for backend to be ready..."
sleep 5

# Test health endpoint
echo ""
echo "🔍 Testing health endpoint..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5001/health)

if [ "$response" = "200" ]; then
    echo "✅ Health check passed (HTTP $response)"
else
    echo "❌ Health check failed (HTTP $response)"
    echo ""
    echo "📋 Container logs:"
    docker logs boult-backend-test
fi

# Show container info
echo ""
echo "📊 Container Info:"
docker ps -a | grep boult-backend-test

# Cleanup
echo ""
read -p "Do you want to stop and remove the test container? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker stop boult-backend-test
    docker rm boult-backend-test
    echo "✅ Test container removed"
else
    echo "ℹ️  Container is still running on http://localhost:5001"
    echo "   To stop: docker stop boult-backend-test"
    echo "   To remove: docker rm boult-backend-test"
fi

echo ""
echo "🎉 Docker test complete!"
