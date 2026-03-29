# 🐳 Docker Setup Guide for Boult India Backend

## What is Docker?

Docker packages your application with all its dependencies into a **container** - a lightweight, standalone package that runs consistently everywhere.

## Benefits

✅ **Consistent Environment** - Same setup on local, staging, and production
✅ **Easy Deployment** - One command to deploy anywhere
✅ **Isolation** - No dependency conflicts
✅ **Scalability** - Run multiple instances easily
✅ **Portability** - Deploy on any cloud (AWS, DigitalOcean, Azure, etc.)

## Prerequisites

Install Docker:
- **Mac**: Download Docker Desktop from https://www.docker.com/products/docker-desktop
- **Windows**: Download Docker Desktop from https://www.docker.com/products/docker-desktop
- **Linux**: `sudo apt-get install docker.io docker-compose`

## Quick Start

### 1. Build Docker Image

```bash
cd boult-backend
docker build -t boult-backend:latest .
```

### 2. Run with Docker Compose (Recommended)

```bash
# Start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

### 3. Run with Docker Command

```bash
docker run -d \
  --name boult-backend \
  -p 5000:5000 \
  --env-file .env \
  -v $(pwd)/uploads:/app/uploads \
  boult-backend:latest
```

## Docker Commands

### Container Management

```bash
# List running containers
docker ps

# List all containers
docker ps -a

# Stop container
docker stop boult-backend

# Start container
docker start boult-backend

# Restart container
docker restart boult-backend

# Remove container
docker rm boult-backend

# View logs
docker logs boult-backend
docker logs -f boult-backend  # Follow logs
```

### Image Management

```bash
# List images
docker images

# Remove image
docker rmi boult-backend:latest

# Build image
docker build -t boult-backend:latest .

# Tag image for registry
docker tag boult-backend:latest your-registry/boult-backend:latest
```

## Deployment Options

### Option 1: Deploy to Render with Docker

1. Create `render.yaml`:
```yaml
services:
  - type: web
    name: boult-backend
    env: docker
    dockerfilePath: ./Dockerfile
    envVars:
      - key: MONGODB_URI
        sync: false
      - key: RAZORPAY_KEY_ID
        sync: false
```

2. Push to GitHub
3. Render will automatically build and deploy

### Option 2: Deploy to DigitalOcean

```bash
# Install doctl CLI
# Create droplet
doctl compute droplet create boult-backend \
  --image docker-20-04 \
  --size s-1vcpu-1gb \
  --region blr1

# SSH into droplet
ssh root@your-droplet-ip

# Clone repo and run
git clone your-repo
cd boult-backend
docker-compose up -d
```

### Option 3: Deploy to AWS ECS

1. Push image to ECR:
```bash
aws ecr create-repository --repository-name boult-backend
docker tag boult-backend:latest your-account.dkr.ecr.region.amazonaws.com/boult-backend:latest
docker push your-account.dkr.ecr.region.amazonaws.com/boult-backend:latest
```

2. Create ECS task definition and service

### Option 4: Deploy to Your Own VPS

```bash
# SSH to your server
ssh user@your-server-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Clone and run
git clone your-repo
cd boult-backend
docker-compose up -d
```

## Environment Variables

Create `.env` file with:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-mongodb-uri
RAZORPAY_KEY_ID=your-key
RAZORPAY_KEY_SECRET=your-secret
HOSTINGER_EMAIL=orders@boultindia.com
HOSTINGER_PASSWORD=your-password
JWT_SECRET=your-jwt-secret
```

## Health Check

Docker automatically checks if your app is healthy:

```bash
# Check health status
docker inspect --format='{{.State.Health.Status}}' boult-backend
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs boult-backend

# Check if port is already in use
lsof -i :5000

# Remove and recreate
docker-compose down
docker-compose up -d
```

### Can't connect to MongoDB

- Ensure MongoDB URI is correct in `.env`
- Check if MongoDB Atlas allows connections from your IP
- Verify network connectivity

### Permission issues with uploads

```bash
# Fix permissions
chmod -R 755 uploads
```

## Production Best Practices

1. ✅ Use `.dockerignore` to exclude unnecessary files
2. ✅ Use multi-stage builds for smaller images
3. ✅ Set resource limits in docker-compose.yml
4. ✅ Use health checks
5. ✅ Mount volumes for persistent data
6. ✅ Use environment variables for secrets
7. ✅ Enable logging and monitoring
8. ✅ Regular security updates

## Monitoring

### View Resource Usage

```bash
# Container stats
docker stats boult-backend

# Disk usage
docker system df
```

### Logs

```bash
# View logs
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

## Backup

```bash
# Backup uploads folder
docker cp boult-backend:/app/uploads ./backup-uploads

# Backup entire container
docker commit boult-backend boult-backend-backup:$(date +%Y%m%d)
```

## Scaling

Run multiple instances:

```bash
# Scale to 3 instances
docker-compose up -d --scale backend=3

# Use nginx for load balancing
```

## Current Setup vs Docker

**Without Docker (Current Render Setup):**
- ❌ Render-specific configuration
- ❌ Limited control over environment
- ❌ Harder to replicate locally
- ❌ Vendor lock-in

**With Docker:**
- ✅ Works on any platform
- ✅ Full control over environment
- ✅ Easy local development
- ✅ No vendor lock-in
- ✅ Better for scaling

## Next Steps

1. Test locally with Docker
2. Push Docker setup to GitHub
3. Choose deployment platform (Render, DigitalOcean, AWS, etc.)
4. Deploy and monitor

## Support

For issues, check:
- Docker logs: `docker logs boult-backend`
- Container status: `docker ps -a`
- Health check: `docker inspect boult-backend`
