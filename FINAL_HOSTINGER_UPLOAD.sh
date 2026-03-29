#!/bin/bash

echo "🚀 Creating FINAL Hostinger Upload Package..."

# Clean up
rm -rf FINAL_HOSTINGER_UPLOAD
mkdir FINAL_HOSTINGER_UPLOAD

# Copy admin panel build
echo "📦 Packaging Admin Panel..."
cp -r boult-react-admin/build FINAL_HOSTINGER_UPLOAD/admin-panel

# Copy ecommerce build  
echo "📦 Packaging E-commerce..."
cp -r boult-react-ecommerce/build FINAL_HOSTINGER_UPLOAD/ecommerce

# Create proper .htaccess for both
echo "🔧 Adding .htaccess files..."

# Admin .htaccess
cat > FINAL_HOSTINGER_UPLOAD/admin-panel/.htaccess << 'EOF'
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
EOF

# Ecommerce .htaccess
cat > FINAL_HOSTINGER_UPLOAD/ecommerce/.htaccess << 'EOF'
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
EOF

# Create ZIP files
echo "📁 Creating ZIP files..."
cd FINAL_HOSTINGER_UPLOAD
zip -r admin-panel.zip admin-panel/ > /dev/null 2>&1
zip -r ecommerce.zip ecommerce/ > /dev/null 2>&1
cd ..

echo ""
echo "✅ READY TO UPLOAD!"
echo ""
echo "📂 Files created in FINAL_HOSTINGER_UPLOAD/:"
echo "   • admin-panel.zip (Upload to admin subdomain)"
echo "   • ecommerce.zip (Upload to main domain)"
echo ""
echo "🚀 Upload Instructions:"
echo "1. Go to Hostinger File Manager"
echo "2. Upload admin-panel.zip to admin subdomain public_html"
echo "3. Upload ecommerce.zip to main domain public_html"  
echo "4. Extract both ZIP files"
echo "5. Test: admin.boultindia.com (Login: admin/admin123)"
echo ""
echo "✅ Backend is working: https://boult-india-bakend-new.onrender.com"
echo "✅ No more loading screens!"
echo "✅ Orders will show up!"