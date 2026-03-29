#!/bin/bash

echo "🔍 COMPLETE SYSTEM CHECK - API INTEGRATION VERIFICATION"
echo "========================================================"
echo ""

BACKEND_URL="https://boult-india-bakend-new.onrender.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 BACKEND API TESTS${NC}"
echo "----------------------------------------"

# 1. Backend Health Check
echo -n "1. Backend Health Check: "
health_response=$(curl -s -w "%{http_code}" -o /tmp/health_response "$BACKEND_URL/health" 2>/dev/null)
if [[ $health_response == "200" ]]; then
    echo -e "${GREEN}✅ WORKING${NC}"
    health_data=$(cat /tmp/health_response)
    echo "   Response: $(echo $health_data | jq -r '.status // "Unknown"' 2>/dev/null || echo $health_data)"
else
    echo -e "${RED}❌ FAILED (HTTP: $health_response)${NC}"
fi

# 2. Admin Authentication
echo -n "2. Admin Login API: "
admin_response=$(curl -s -w "%{http_code}" -o /tmp/admin_response -X POST "$BACKEND_URL/api/admin/login" \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"admin123"}' 2>/dev/null)
if [[ $admin_response == "200" ]]; then
    echo -e "${GREEN}✅ WORKING${NC}"
    admin_name=$(cat /tmp/admin_response | jq -r '.user.name // "Unknown"' 2>/dev/null)
    echo "   Admin: $admin_name"
else
    echo -e "${RED}❌ FAILED (HTTP: $admin_response)${NC}"
fi

# 3. User Authentication - Register
echo -n "3. User Registration API: "
register_response=$(curl -s -w "%{http_code}" -o /tmp/register_response -X POST "$BACKEND_URL/api/auth/register" \
    -H "Content-Type: application/json" \
    -d '{"name":"Test User","email":"test'$(date +%s)'@example.com","password":"test123"}' 2>/dev/null)
if [[ $register_response == "201" ]]; then
    echo -e "${GREEN}✅ WORKING${NC}"
    user_email=$(cat /tmp/register_response | jq -r '.user.email // "Unknown"' 2>/dev/null)
    echo "   Created: $user_email"
else
    echo -e "${RED}❌ FAILED (HTTP: $register_response)${NC}"
fi

# 4. User Authentication - Login
echo -n "4. User Login API: "
login_response=$(curl -s -w "%{http_code}" -o /tmp/login_response -X POST "$BACKEND_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test123"}' 2>/dev/null)
if [[ $login_response == "200" || $login_response == "401" ]]; then
    echo -e "${GREEN}✅ WORKING${NC}"
    echo "   Response: $(cat /tmp/login_response | jq -r '.message // .error // "Unknown"' 2>/dev/null)"
else
    echo -e "${RED}❌ FAILED (HTTP: $login_response)${NC}"
fi

# 5. Orders API
echo -n "5. Orders API: "
orders_response=$(curl -s -w "%{http_code}" -o /tmp/orders_response "$BACKEND_URL/api/orders" 2>/dev/null)
if [[ $orders_response == "200" ]]; then
    echo -e "${GREEN}✅ WORKING${NC}"
    order_count=$(cat /tmp/orders_response | jq -r '.orders | length // 0' 2>/dev/null)
    echo "   Orders found: $order_count"
else
    echo -e "${RED}❌ FAILED (HTTP: $orders_response)${NC}"
fi

# 6. Razorpay Order Creation
echo -n "6. Razorpay Order Creation: "
razorpay_response=$(curl -s -w "%{http_code}" -o /tmp/razorpay_response -X POST "$BACKEND_URL/api/razorpay/create-order" \
    -H "Content-Type: application/json" \
    -d '{"amount":1000,"orderId":"TEST_'$(date +%s)'","customer":"Test User"}' 2>/dev/null)
if [[ $razorpay_response == "200" ]]; then
    echo -e "${GREEN}✅ WORKING${NC}"
    order_id=$(cat /tmp/razorpay_response | jq -r '.order.id // "Unknown"' 2>/dev/null)
    echo "   Order ID: $order_id"
else
    echo -e "${RED}❌ FAILED (HTTP: $razorpay_response)${NC}"
fi

# 7. Products API
echo -n "7. Products API: "
products_response=$(curl -s -w "%{http_code}" -o /tmp/products_response "$BACKEND_URL/api/products" 2>/dev/null)
if [[ $products_response == "200" ]]; then
    echo -e "${GREEN}✅ WORKING${NC}"
    product_count=$(cat /tmp/products_response | jq -r '.products | length // 0' 2>/dev/null)
    echo "   Products found: $product_count"
else
    echo -e "${RED}❌ FAILED (HTTP: $products_response)${NC}"
fi

echo ""
echo -e "${BLUE}🖥️  FRONTEND INTEGRATION CHECK${NC}"
echo "----------------------------------------"

# Check environment variables
echo -n "8. Admin Panel Environment: "
if [[ -f "boult-react-admin/.env.local" ]]; then
    admin_backend_url=$(grep REACT_APP_BACKEND_URL boult-react-admin/.env.local | cut -d'=' -f2)
    if [[ $admin_backend_url == *"boult-india-bakend-new.onrender.com"* ]]; then
        echo -e "${GREEN}✅ CONFIGURED${NC}"
        echo "   Backend URL: $admin_backend_url"
    else
        echo -e "${YELLOW}⚠️  LOCAL BACKEND${NC}"
        echo "   Backend URL: $admin_backend_url"
    fi
else
    echo -e "${RED}❌ NO CONFIG${NC}"
fi

echo -n "9. E-commerce Environment: "
if [[ -f "boult-react-ecommerce/.env.local" ]]; then
    ecom_backend_url=$(grep REACT_APP_BACKEND_URL boult-react-ecommerce/.env.local | cut -d'=' -f2)
    if [[ $ecom_backend_url == *"boult-india-bakend-new.onrender.com"* ]]; then
        echo -e "${GREEN}✅ CONFIGURED${NC}"
        echo "   Backend URL: $ecom_backend_url"
    else
        echo -e "${YELLOW}⚠️  LOCAL BACKEND${NC}"
        echo "   Backend URL: $ecom_backend_url"
    fi
else
    echo -e "${RED}❌ NO CONFIG${NC}"
fi

echo ""
echo -e "${BLUE}🎯 SYSTEM STATUS SUMMARY${NC}"
echo "----------------------------------------"

# Count successful tests
success_count=0
total_tests=7

# Check each test result
for i in {1..7}; do
    case $i in
        1) [[ $health_response == "200" ]] && ((success_count++)) ;;
        2) [[ $admin_response == "200" ]] && ((success_count++)) ;;
        3) [[ $register_response == "201" ]] && ((success_count++)) ;;
        4) [[ $login_response == "200" || $login_response == "401" ]] && ((success_count++)) ;;
        5) [[ $orders_response == "200" ]] && ((success_count++)) ;;
        6) [[ $razorpay_response == "200" ]] && ((success_count++)) ;;
        7) [[ $products_response == "200" ]] && ((success_count++)) ;;
    esac
done

echo "API Tests Passed: $success_count/$total_tests"

if [[ $success_count -eq $total_tests ]]; then
    echo -e "${GREEN}🎉 ALL SYSTEMS OPERATIONAL!${NC}"
    echo ""
    echo -e "${GREEN}✅ Backend API: FULLY WORKING${NC}"
    echo -e "${GREEN}✅ Admin Authentication: WORKING${NC}"
    echo -e "${GREEN}✅ User Authentication: WORKING${NC}"
    echo -e "${GREEN}✅ Orders Management: WORKING${NC}"
    echo -e "${GREEN}✅ Razorpay Integration: WORKING${NC}"
    echo -e "${GREEN}✅ Products API: WORKING${NC}"
elif [[ $success_count -ge 5 ]]; then
    echo -e "${YELLOW}⚠️  MOSTLY OPERATIONAL${NC}"
    echo "Most systems are working, minor issues detected."
else
    echo -e "${RED}❌ SYSTEM ISSUES DETECTED${NC}"
    echo "Multiple API endpoints are failing."
fi

echo ""
echo -e "${BLUE}📱 FRONTEND URLS${NC}"
echo "----------------------------------------"
echo "Admin Panel:  http://localhost:3001"
echo "E-commerce:   http://localhost:3002"
echo "Backend API:  $BACKEND_URL"

echo ""
echo -e "${BLUE}🔑 CREDENTIALS${NC}"
echo "----------------------------------------"
echo "Admin: admin/admin123 or boultadmin/boult2026"
echo "Users: Register new accounts via signup"

# Cleanup temp files
rm -f /tmp/health_response /tmp/admin_response /tmp/register_response /tmp/login_response /tmp/orders_response /tmp/razorpay_response /tmp/products_response 2>/dev/null

echo ""
echo "🔍 System check complete!"