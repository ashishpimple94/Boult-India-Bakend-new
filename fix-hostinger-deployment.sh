#!/bin/bash

echo "🔧 Fixing Hostinger Deployment Issues..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Rebuild admin panel with production environment
print_status "Rebuilding admin panel with production settings..."
cd boult-react-admin

# Ensure production environment variables are set
cat > .env.production << 'EOF'
REACT_APP_BACKEND_URL=https://boult-india-bakend-new.onrender.com
REACT_APP_API_URL=https://boult-india-bakend-new.onrender.com/api
REACT_APP_ENVIRONMENT=production
GENERATE_SOURCEMAP=false
EOF

# Build with production environment
REACT_APP_BACKEND_URL=https://boult-india-bakend-new.onrender.com npm run build

if [ $? -eq 0 ]; then
    print_success "Admin panel build completed"
else
    print_error "Admin panel build failed"
    exit 1
fi

cd ..

# Step 2: Rebuild e-commerce with production environment
print_status "Rebuilding e-commerce with production settings..."
cd boult-react-ecommerce

# Ensure production environment variables are set
cat > .env.production << 'EOF'
REACT_APP_BACKEND_URL=https://boult-india-bakend-new.onrender.com
REACT_APP_API_URL=https://boult-india-bakend-new.onrender.com/api
REACT_APP_ENVIRONMENT=production
GENERATE_SOURCEMAP=false
EOF

# Build with production environment
REACT_APP_BACKEND_URL=https://boult-india-bakend-new.onrender.com npm run build

if [ $? -eq 0 ]; then
    print_success "E-commerce build completed"
else
    print_error "E-commerce build failed"
    exit 1
fi

cd ..

# Step 3: Create Hostinger deployment packages
print_status "Creating Hostinger deployment packages..."

# Clean up previous deployment
rm -rf hostinger-deployment
mkdir -p hostinger-deployment

# Package Admin Panel
print_status "Packaging Admin Panel for Hostinger..."
mkdir -p hostinger-deployment/admin-panel
cp -r boult-react-admin/build/* hostinger-deployment/admin-panel/

# Create proper .htaccess for admin panel
cat > hostinger-deployment/admin-panel/.htaccess << 'EOF'
# Enable rewrite engine
RewriteEngine On

# Handle Angular and React Router
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>

# Set cache headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>

# CORS headers for API calls
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
</IfModule>
EOF

# Package E-commerce
print_status "Packaging E-commerce for Hostinger..."
mkdir -p hostinger-deployment/ecommerce
cp -r boult-react-ecommerce/build/* hostinger-deployment/ecommerce/

# Create proper .htaccess for e-commerce
cat > hostinger-deployment/ecommerce/.htaccess << 'EOF'
# Enable rewrite engine
RewriteEngine On

# Handle Angular and React Router
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>

# Set cache headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>

# CORS headers for API calls
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
</IfModule>
EOF

# Step 4: Create ZIP files for upload
print_status "Creating ZIP files for Hostinger upload..."
cd hostinger-deployment

zip -r admin-panel-hostinger-fixed.zip admin-panel/ > /dev/null 2>&1
zip -r ecommerce-hostinger-fixed.zip ecommerce/ > /dev/null 2>&1

cd ..

# Step 5: Test backend connection
print_status "Testing backend connection..."
if curl -s https://boult-india-bakend-new.onrender.com/health > /dev/null; then
    print_success "Backend is responding correctly!"
else
    print_warning "Backend might be sleeping. It will wake up on first request."
fi

print_success "Hostinger deployment packages ready!"

echo ""
echo "📦 Fixed Deployment Packages:"
echo "   • hostinger-deployment/admin-panel-hostinger-fixed.zip"
echo "   • hostinger-deployment/ecommerce-hostinger-fixed.zip"
echo ""
echo "🚀 Hostinger Upload Instructions:"
echo ""
echo "1. Admin Panel:"
echo "   - Go to your Hostinger admin subdomain (admin.boultindia.com)"
echo "   - Upload admin-panel-hostinger-fixed.zip to public_html"
echo "   - Extract the ZIP file"
echo "   - Delete the ZIP file after extraction"
echo ""
echo "2. E-commerce:"
echo "   - Go to your main domain (boultindia.com)"
echo "   - Upload ecommerce-hostinger-fixed.zip to public_html"
echo "   - Extract the ZIP file"
echo "   - Delete the ZIP file after extraction"
echo ""
echo "3. Verify deployment:"
echo "   - Check admin panel: admin.boultindia.com"
echo "   - Check e-commerce: boultindia.com"
echo "   - Test login with: admin/admin123"
echo ""
echo "🔧 Key Fixes Applied:"
echo "   ✅ Production environment variables embedded"
echo "   ✅ Proper .htaccess files for SPA routing"
echo "   ✅ CORS headers for API calls"
echo "   ✅ Compression and caching enabled"
echo "   ✅ Security headers added"
echo ""

print_success "All fixes applied! Ready for Hostinger deployment."