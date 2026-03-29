#!/bin/bash

echo "🚀 Deploying Boult India Applications to Hostinger..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if builds exist
if [ ! -d "boult-react-admin/build" ]; then
    print_error "Admin panel build not found. Please run 'npm run build' in boult-react-admin first."
    exit 1
fi

if [ ! -d "boult-react-ecommerce/build" ]; then
    print_error "E-commerce build not found. Please run 'npm run build' in boult-react-ecommerce first."
    exit 1
fi

print_status "Creating deployment packages..."

# Create deployment directory
mkdir -p deployment-packages
cd deployment-packages

# Package Admin Panel
print_status "Packaging Admin Panel..."
rm -rf admin-panel-hostinger
mkdir admin-panel-hostinger
cp -r ../boult-react-admin/build/* admin-panel-hostinger/

# Ensure .htaccess is in place for admin panel
cat > admin-panel-hostinger/.htaccess << 'EOF'
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QR,L]

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
EOF

# Package E-commerce
print_status "Packaging E-commerce..."
rm -rf ecommerce-hostinger
mkdir ecommerce-hostinger
cp -r ../boult-react-ecommerce/build/* ecommerce-hostinger/

# Ensure .htaccess is in place for e-commerce
cat > ecommerce-hostinger/.htaccess << 'EOF'
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QR,L]

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
EOF

# Create ZIP files for easy upload
print_status "Creating ZIP files for upload..."
zip -r admin-panel-hostinger.zip admin-panel-hostinger/ > /dev/null 2>&1
zip -r ecommerce-hostinger.zip ecommerce-hostinger/ > /dev/null 2>&1

print_success "Deployment packages created successfully!"

echo ""
echo "📦 Deployment Packages Ready:"
echo "   • admin-panel-hostinger.zip (Admin Panel)"
echo "   • ecommerce-hostinger.zip (E-commerce)"
echo ""
echo "📋 Hostinger Deployment Instructions:"
echo ""
echo "1. Admin Panel (admin.boultindia.com or subdomain):"
echo "   - Upload admin-panel-hostinger.zip to your admin subdomain's public_html"
echo "   - Extract the ZIP file"
echo "   - Ensure .htaccess file is present for SPA routing"
echo ""
echo "2. E-commerce (boultindia.com main domain):"
echo "   - Upload ecommerce-hostinger.zip to your main domain's public_html"
echo "   - Extract the ZIP file"
echo "   - Ensure .htaccess file is present for SPA routing"
echo ""
echo "3. Backend Configuration:"
echo "   - Backend is already running at: https://boult-india-bakend-new.onrender.com"
echo "   - Both applications are configured to use this backend"
echo ""
echo "4. Test the deployment:"
echo "   - Admin Panel: Login with admin/admin123 or boultadmin/boult2026"
echo "   - E-commerce: Browse products and test checkout flow"
echo ""
echo "🔧 Troubleshooting:"
echo "   - If pages show 404 on refresh, ensure .htaccess is uploaded"
echo "   - If API calls fail, check browser console for CORS errors"
echo "   - Backend health check: https://boult-india-bakend-new.onrender.com/health"
echo ""

# Test backend connection one more time
print_status "Testing backend connection..."
if curl -s https://boult-india-bakend-new.onrender.com/health > /dev/null; then
    print_success "Backend is responding correctly!"
else
    print_warning "Backend might be sleeping. It will wake up on first request."
fi

print_success "Deployment preparation complete!"
echo ""
echo "📁 Files are ready in: $(pwd)"
echo "   • admin-panel-hostinger/ (extracted files)"
echo "   • ecommerce-hostinger/ (extracted files)"
echo "   • admin-panel-hostinger.zip (upload this)"
echo "   • ecommerce-hostinger.zip (upload this)"