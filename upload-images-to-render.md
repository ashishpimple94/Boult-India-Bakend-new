# Upload Product Images to Render Backend

## Problem
Product images (11MB) are too large to push via Git. Need to upload directly to Render.

## Solution: Manual Upload via Render Shell

### Step 1: Wait for Deployment
1. Go to https://dashboard.render.com
2. Wait for backend deployment to complete (2-3 minutes)
3. Check deployment logs for "Build successful"

### Step 2: Access Render Shell
1. Go to your backend service on Render dashboard
2. Click on "Shell" tab in the top menu
3. This opens a terminal connected to your deployed backend

### Step 3: Create Public Folder
```bash
mkdir -p /opt/render/project/src/public
cd /opt/render/project/src/public
```

### Step 4: Upload Images
You have 2 options:

#### Option A: Upload via SCP/SFTP (Recommended)
Render doesn't support direct SCP, so use Option B

#### Option B: Download from URL (Easiest)
If you have images hosted somewhere (like GitHub release, Dropbox, etc.):

```bash
# Example: Download from a zip file
curl -L "YOUR_IMAGE_ZIP_URL" -o images.zip
unzip images.zip
rm images.zip
```

#### Option C: Use Render Disk (Best for Production)
1. Go to Render Dashboard → Your Service → Settings
2. Add a "Disk" under "Disks" section
3. Mount path: `/opt/render/project/src/public`
4. Size: 1GB (free tier allows up to 1GB)
5. Save changes and redeploy

Then upload images via:
- Render Shell (wget/curl)
- Or use a deployment script

### Step 5: Verify Images
```bash
ls -la /opt/render/project/src/public/
```

Should show all your product images.

### Step 6: Test API
```bash
curl https://boult-india-bakend-new.onrender.com/api/products | head -c 500
```

Should return products with full image URLs.

## Alternative: Use External Image Hosting

Instead of uploading to Render, use:

### Option 1: Cloudinary (Free Tier)
- 25GB storage, 25GB bandwidth/month
- Upload all images to Cloudinary
- Update products.json with Cloudinary URLs

### Option 2: ImgBB (Free)
- Unlimited storage
- Upload images and get direct URLs
- Update products.json

### Option 3: GitHub Releases
- Upload images as release assets
- Use raw.githubusercontent.com URLs
- Free and reliable

## Quick Fix: Use Frontend Public Folder (Current Setup)

Since images are already in frontend public folders, we can:

1. Keep images in frontend (already done ✅)
2. Backend just returns relative paths
3. Frontend serves images from its own public folder

This is actually the BEST solution for static images!

### Update Backend to Return Relative Paths

Change products API to return:
```javascript
// Just return the relative path as-is
return product; // No URL modification needed
```

Frontend will automatically resolve `/Anti-Rust-Spray-500ml-Website-2.png` from its own public folder.

## Recommended Approach

**Use Frontend Public Folder** (Current Setup)
- ✅ No backend storage needed
- ✅ Images already in frontend
- ✅ Fast loading (served by Hostinger/Vercel CDN)
- ✅ No extra upload step

Just update backend to return relative paths instead of full URLs!

---

**Status**: Backend pushed ✅
**Next**: Update backend to return relative paths OR upload images to Render
