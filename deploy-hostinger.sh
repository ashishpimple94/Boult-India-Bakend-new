#!/bin/bash

echo "🚀 Hostinger Deployment Script"
echo "================================"

# Build e-commerce
echo "📦 Building e-commerce app..."
cd boult-react-ecommerce
npm run build
if [ $? -eq 0 ]; then
    echo "✅ E-commerce build successful"
else
    echo "❌ E-commerce build failed"
    exit 1
fi

# Build admin panel
echo "📦 Building admin panel..."
cd ../boult-react-admin
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Admin panel build successful"
else
    echo "❌ Admin panel build failed"
    exit 1
fi

cd ..

echo ""
echo "🎉 Build Complete!"
echo "==================="
echo ""
echo "📁 Files to upload to Hostinger:"
echo "  E-commerce: boult-react-ecommerce/build/* → public_html/"
echo "  Admin Panel: boult-react-admin/build/* → public_html/admin/"
echo ""
echo "🔧 Next Steps:"
echo "  1. Upload build files to Hostinger"
echo "  2. Ensure HTTPS is active"
echo "  3. Add domain to Razorpay dashboard"
echo "  4. Test Razorpay payment"
echo ""
echo "📋 Checklist:"
echo "  □ HTTPS domain ready"
echo "  □ Domain added to Razorpay"
echo "  □ Files uploaded to Hostinger"
echo "  □ Test payment works"
echo ""
echo "🎯 Ready for production!"