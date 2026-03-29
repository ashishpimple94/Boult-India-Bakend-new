# Quick Commands - Boult India React Setup

## 🚀 Start Everything

### Automated (macOS/Linux)
```bash
chmod +x START_LOCAL_DEVELOPMENT.sh
./START_LOCAL_DEVELOPMENT.sh
```

### Manual - Terminal 1 (Backend)
```bash
cd boult-backend
npm install
npm start
```

### Manual - Terminal 2 (Admin)
```bash
cd boult-react-admin
npm install
npm start
```

### Manual - Terminal 3 (E-commerce)
```bash
cd boult-react-ecommerce
npm install
npm start
```

## 📍 Access Points

| Service | URL | Port |
|---------|-----|------|
| Backend | http://localhost:5000 | 5000 |
| Admin | http://localhost:3000 | 3000 |
| E-commerce | http://localhost:3001 | 3001 |

## 🔍 Health Checks

```bash
# Backend health
curl http://localhost:5000/health

# Get all products
curl http://localhost:5000/api/products

# Get all orders
curl http://localhost:5000/api/orders
```

## 🧹 Clean Up

### Clear npm cache
```bash
npm cache clean --force
```

### Remove node_modules and reinstall
```bash
# Backend
cd boult-backend
rm -rf node_modules package-lock.json
npm install

# Admin
cd boult-react-admin
rm -rf node_modules package-lock.json
npm install

# E-commerce
cd boult-react-ecommerce
rm -rf node_modules package-lock.json
npm install
```

### Kill processes on ports
```bash
# Kill port 5000 (Backend)
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill port 3000 (Admin)
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill port 3001 (E-commerce)
lsof -i :3001 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

## 🏗️ Build for Production

### Backend
```bash
cd boult-backend
npm run build  # If build script exists
```

### React Admin
```bash
cd boult-react-admin
npm run build
# Output: build/ directory
```

### React E-commerce
```bash
cd boult-react-ecommerce
npm run build
# Output: build/ directory
```

## 📦 Install Dependencies

```bash
# All at once
cd boult-backend && npm install && cd ../boult-react-admin && npm install && cd ../boult-react-ecommerce && npm install

# Or individually
cd boult-backend && npm install
cd boult-react-admin && npm install
cd boult-react-ecommerce && npm install
```

## 🔐 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=production
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### React Apps (.env.local)
```
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_API_URL=http://localhost:5000/api
```

## 📝 Git Commands

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "React JS conversion complete"

# Push to GitHub
git push origin main

# Check status
git status

# View logs
git log --oneline
```

## 🚀 Deployment Commands

### Deploy to Render

1. **Create repositories on GitHub**
   ```bash
   # For each folder (boult-backend, boult-react-admin, boult-react-ecommerce)
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/repo-name.git
   git push -u origin main
   ```

2. **Deploy Backend**
   - Go to https://render.com
   - Create Web Service
   - Connect GitHub repo
   - Build: `npm install`
   - Start: `npm start`

3. **Deploy React Admin**
   - Create Static Site
   - Connect GitHub repo
   - Build: `npm install && npm run build`
   - Publish: `build`

4. **Deploy React E-commerce**
   - Create Static Site
   - Connect GitHub repo
   - Build: `npm install && npm run build`
   - Publish: `build`

## 🧪 Testing

### Test Backend API
```bash
# Health check
curl http://localhost:5000/health

# Get products
curl http://localhost:5000/api/products

# Get orders
curl http://localhost:5000/api/orders

# Create order
curl -X POST http://localhost:5000/api/save-order \
  -H "Content-Type: application/json" \
  -d '{"id":"1","customer":"John","amount":1000}'
```

### Test React Apps
- Admin: http://localhost:3000
- E-commerce: http://localhost:3001

## 📊 Check Logs

### Backend logs
```bash
# View in terminal where npm start is running
# Or check Render logs if deployed
```

### React app logs
```bash
# View in terminal where npm start is running
# Or check browser console (F12)
```

## 🔄 Restart Services

```bash
# Kill all Node processes
killall node

# Or kill specific ports
kill -9 $(lsof -t -i:5000)
kill -9 $(lsof -t -i:3000)
kill -9 $(lsof -t -i:3001)

# Then restart
./START_LOCAL_DEVELOPMENT.sh
```

## 📚 Documentation Files

- `README_REACT_SETUP.md` - Complete setup guide
- `REACT_DEPLOYMENT_GUIDE.md` - Deployment instructions
- `REACT_SETUP_CHECKLIST.md` - Detailed checklist
- `QUICK_COMMANDS.md` - This file

## 🆘 Common Issues

### Port already in use
```bash
# Find and kill process
lsof -i :PORT_NUMBER
kill -9 PID
```

### npm install fails
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### React app won't start
```bash
# Check Node version
node --version  # Should be 16+

# Update npm
npm install -g npm@latest

# Try again
npm start
```

### Backend API not responding
```bash
# Check if backend is running
curl http://localhost:5000/health

# Check environment variables
cat .env

# Restart backend
cd boult-backend
npm start
```

## 💡 Tips

1. **Use separate terminals** for each service
2. **Keep .env files secure** - don't commit to GitHub
3. **Test locally first** before deploying
4. **Monitor Render logs** after deployment
5. **Update backend URL** in React apps for production
6. **Clear browser cache** if seeing old content
7. **Check browser console** for frontend errors
8. **Check terminal logs** for backend errors

## 📞 Support

For issues:
1. Check browser console (F12)
2. Check terminal logs
3. Verify environment variables
4. Verify backend is running
5. Check network tab for API calls
6. Review documentation files

---

**Last Updated**: January 29, 2026
