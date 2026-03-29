#!/bin/bash

echo "🚀 Creating FINAL COMPLETE Deployment Package..."

# Clean up
rm -rf FINAL_COMPLETE_DEPLOYMENT
mkdir FINAL_COMPLETE_DEPLOYMENT

# Copy FRESH admin panel build
echo "📦 Packaging FRESH Admin Panel Build..."
cp -r boult-react-admin/build FINAL_COMPLETE_DEPLOYMENT/admin-panel

# Copy FRESH ecommerce build  
echo "📦 Packaging FRESH E-commerce Build..."
cp -r boult-react-ecommerce/build FINAL_COMPLETE_DEPLOYMENT/ecommerce

# Create proper .htaccess for both
echo "🔧 Adding .htaccess files..."

# Admin .htaccess
cat > FINAL_COMPLETE_DEPLOYMENT/admin-panel/.htaccess << 'EOF'
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# CORS headers
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
EOF

# Ecommerce .htaccess
cat > FINAL_COMPLETE_DEPLOYMENT/ecommerce/.htaccess << 'EOF'
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# CORS headers
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
EOF

# Create ZIP files
echo "📁 Creating ZIP files..."
cd FINAL_COMPLETE_DEPLOYMENT
zip -r admin-panel-FINAL.zip admin-panel/ > /dev/null 2>&1
zip -r ecommerce-FINAL.zip ecommerce/ > /dev/null 2>&1
cd ..

echo ""
echo "✅ FINAL DEPLOYMENT READY!"
echo ""
echo "📂 Files created in FINAL_COMPLETE_DEPLOYMENT/:"
echo "   • admin-panel-FINAL.zip (Upload to admin subdomain)"
echo "   • ecommerce-FINAL.zip (Upload to main domain)"
echo ""
echo "🚀 Upload Instructions:"
echo "1. Go to Hostinger File Manager"
echo "2. Upload admin-panel-FINAL.zip to admin subdomain public_html"
echo "3. Upload ecommerce-FINAL.zip to main domain public_html"  
echo "4. Extract both ZIP files"
echo "5. Test: admin.boultindia.com (Login: admin/admin123)"
echo ""
echo "✅ FIXES INCLUDED:"
echo "   • No more loading screens"
echo "   • CORS fixed for login.boultindia.com"
echo "   • Image URLs fixed for uploaded products"
echo "   • Orders will show properly"
echo "   • Fresh builds with all fixes"
echo ""
echo "🎉 READY FOR PRODUCTION!"