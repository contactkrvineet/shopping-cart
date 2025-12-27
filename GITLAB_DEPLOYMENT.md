# GitLab Deployment Guide

This guide explains how to deploy the Crafty Girls e-commerce platform using GitLab CI/CD.

## 📋 Prerequisites

1. GitLab account and repository
2. GitLab Runner configured (or use shared runners)
3. Docker installed (for containerized deployment)
4. MongoDB instance (local, Atlas, or Docker)

## 🚀 Quick Start

### 1. Push to GitLab

```bash
# If you haven't added GitLab remote yet
git remote add gitlab https://gitlab.com/your-username/crafty-girls.git

# Push your code
git push gitlab main
```

### 2. Configure GitLab CI/CD Variables

Go to your GitLab project: **Settings → CI/CD → Variables**

Add the following variables:

| Variable | Value | Protected | Masked |
|----------|-------|-----------|--------|
| `MONGODB_URI` | Your MongoDB connection string | ✅ | ✅ |
| `JWT_SECRET` | Your JWT secret key | ✅ | ✅ |
| `CI_REGISTRY_USER` | GitLab username | ❌ | ❌ |
| `CI_REGISTRY_PASSWORD` | GitLab access token | ✅ | ✅ |

### 3. Enable GitLab Container Registry

1. Go to **Settings → General → Visibility**
2. Enable **Container Registry**

## 🔧 GitLab CI/CD Pipeline

The `.gitlab-ci.yml` file defines four stages:

### 1. **Install Stage**
- Installs dependencies for both client and server
- Caches node_modules for faster builds

### 2. **Build Stage**
- Builds the React client application
- Creates production-ready assets

### 3. **Test Stage**
- Runs tests (add your tests here)
- Currently configured to skip if no tests exist

### 4. **Deploy Stage**
- Builds Docker image
- Pushes to GitLab Container Registry
- Manual deployment trigger for safety

## 🐳 Docker Deployment

### Option 1: Using Docker Compose (Recommended for Development)

```bash
# Clone the repository
git clone https://gitlab.com/your-username/crafty-girls.git
cd crafty-girls

# Create .env file
cp server/.env.example server/.env
# Edit server/.env with your configuration

# Start all services
docker-compose up -d

# Seed the database
docker exec -it crafty-girls-server node seed.js

# Access the application
# Client: http://localhost:3000
# Server: http://localhost:5000
```

### Option 2: Using Docker Manually

```bash
# Build the image
docker build -t crafty-girls:latest .

# Run MongoDB
docker run -d --name mongo -p 27017:27017 mongo:latest

# Run the application
docker run -d \
  --name crafty-girls \
  -p 5000:5000 \
  -e MONGODB_URI=mongodb://mongo:27017/crafty-girls \
  -e JWT_SECRET=your_secret_here \
  --link mongo:mongo \
  crafty-girls:latest
```

## 🌐 Deployment to Production Server

### Using GitLab CI/CD Auto-Deploy

1. Set up a server with Docker
2. Configure SSH access in GitLab CI/CD variables
3. Add deployment script to `.gitlab-ci.yml`:

```yaml
deploy_production:
  stage: deploy
  script:
    - ssh user@your-server "docker pull $CI_REGISTRY_IMAGE:latest"
    - ssh user@your-server "docker-compose up -d"
  only:
    - main
  when: manual
```

### Manual Deployment

```bash
# On your server
docker pull registry.gitlab.com/your-username/crafty-girls:latest
docker-compose up -d
```

## 🔐 Environment Variables for Production

Create `.env.production` file:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/crafty-girls
JWT_SECRET=your_super_secure_secret_key_32_chars_minimum
NODE_ENV=production
PORT=5000
```

## 📊 Monitoring Pipeline

1. Go to **CI/CD → Pipelines**
2. View pipeline status and logs
3. Manual trigger for deployment jobs

## 🛠️ Troubleshooting

### Pipeline Fails at Install Stage
- Check Node.js version compatibility
- Verify package.json is committed
- Clear cache: **CI/CD → Pipelines → Clear Runner Caches**

### Build Fails
- Check build logs for specific errors
- Verify all environment variables are set
- Ensure dependencies are correctly installed

### Deployment Fails
- Verify Docker is installed and running
- Check MongoDB connection string
- Ensure ports 3000 and 5000 are available
- Verify environment variables are set

## 📝 Additional Configuration

### Enable Auto DevOps
1. Go to **Settings → CI/CD**
2. Expand **Auto DevOps**
3. Enable **Default to Auto DevOps pipeline**

### Setup Kubernetes Deployment
If using GitLab Kubernetes integration:
1. Go to **Infrastructure → Kubernetes clusters**
2. Add your cluster
3. Install GitLab Runner and Ingress
4. Update `.gitlab-ci.yml` for Kubernetes deployment

## 🔄 Continuous Deployment

For automatic deployment on every push to main:

```yaml
deploy_production:
  stage: deploy
  # Remove 'when: manual' to enable auto-deploy
  only:
    - main
```

## 📚 Additional Resources

- [GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/)
- [Docker Documentation](https://docs.docker.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 🆘 Support

For issues:
1. Check pipeline logs in GitLab
2. Review Docker container logs: `docker logs crafty-girls-server`
3. Check MongoDB connection
4. Verify environment variables
