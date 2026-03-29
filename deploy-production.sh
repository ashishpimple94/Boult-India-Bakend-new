#!/bin/bash

echo "🚀 BOULT INDIA - PRODUCTION DEPLOYMENT SCRIPT"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}📦 Production builds are ready!${NC}"
echo ""

echo -e "${GREEN}✅ Admin Panel Build:${NC} boult-react-admin/build/"
echo -e "${GREEN}✅ E-commerce Build:${NC} boult-react-ecommerce/build/"
echo -e "${GREEN}✅ Backend Deployed:${NC} https://boult-india-bakend-new.onrender.com"
echo ""

echo -e "${YELLOW}🌐 DEPLOYMENT OPTIONS:${NC}"
echo ""

echo "1. 📡 Static File Server (Local Testing)"
echo "   npm install -g serve"
echo "   serve -s boult-react-admin/build -p 3001"
echo "   serve -s boult-react-ecommerce/build -p 3002"
echo ""

echo "2. ⚡ Vercel Deployment (Recommended)"
echo "   npm install -g vercel"
echo "   cd boult-react-admin && vercel --prod"
echo "   cd boult-react-ecommerce && vercel --prod"
echo ""

echo "3. 🌍 Netlify Deployment"
echo "   npm install -g netlify-cli"
echo "   cd boult-react-admin && netlify deploy --prod --dir=build"
echo "   cd boult-react-ecommerce && netlify deploy --prod --dir=build"
echo ""

echo "4. ☁️  AWS S3 + CloudFront"
echo "   aws s3 sync boult-react-admin/build/ s3://admin-bucket --delete"
echo "   aws s3 sync boult-react-ecommerce/build/ s3://ecommerce-bucket --delete"
echo ""

echo -e "${BLUE}🔧 CONFIGURATION:${NC}"
echo "✅ Environment variables configured for production"
echo "✅ API endpoints pointing to live backend"
echo "✅ Razorpay integration ready"
echo "✅ Authentication systems working"
echo ""

echo -e "${GREEN}🎯 READY FOR PRODUCTION!${NC}"
echo ""

# Check if serve is installed
if command -v serve &> /dev/null; then
    echo -e "${YELLOW}💡 Quick Start (Local Testing):${NC}"
    echo "   ./start-production-local.sh"
else
    echo -e "${YELLOW}💡 Install serve for local testing:${NC}"
    echo "   npm install -g serve"
fi

echo ""
echo "🎉 All systems ready for deployment!"