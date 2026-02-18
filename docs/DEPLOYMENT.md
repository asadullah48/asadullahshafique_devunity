# Deployment Guide

## Comprehensive deployment guide for Asadullah.dev Portfolio

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
3. [Backend Deployment (Hugging Face Spaces)](#backend-deployment-hugging-face-spaces)
4. [Docker Deployment](#docker-deployment)
5. [Kubernetes Deployment](#kubernetes-deployment)
6. [Environment Variables](#environment-variables)
7. [CI/CD Setup](#cicd-setup)
8. [Monitoring & Logging](#monitoring--logging)

---

## Prerequisites

### Required Accounts
- [GitHub](https://github.com) account
- [Vercel](https://vercel.com) account (for frontend)
- [Hugging Face](https://huggingface.co) account (for backend)
- [Docker Hub](https://hub.docker.com) account (optional, for container registry)

### Required Tools
- Node.js 20+ and npm
- Python 3.12+
- Git
- Docker Desktop (optional)
- kubectl (for Kubernetes deployment)

---

## Frontend Deployment (Vercel)

### Option 1: Vercel Dashboard (Recommended)

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository: `asadullahshafique_devunity`

2. **Configure Project**
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

3. **Set Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.hf.space
   NEXT_PUBLIC_PRODUCTION_API_URL=https://your-backend-url.hf.space
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_ENABLE_AI_AGENT=true
   NEXT_PUBLIC_ENABLE_CONTACT_FORM=true
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Post-Deployment

1. **Custom Domain (Optional)**
   - Go to Project Settings > Domains
   - Add your custom domain
   - Configure DNS records as instructed

2. **Environment Variables**
   - Go to Project Settings > Environment Variables
   - Add all required variables
   - Redeploy for changes to take effect

---

## Backend Deployment (Hugging Face Spaces)

### Option 1: Hugging Face Dashboard

1. **Create New Space**
   - Go to [Hugging Face Spaces](https://huggingface.co/spaces)
   - Click "Create new Space"
   - **Space Name:** `asadullah-dev-portfolio-api`
   - **SDK:** Select "Docker"
   - **Visibility:** Public

2. **Configure Space**
   - Go to Space Settings
   - **Hardware:** Choose appropriate tier (CPU Basic for starter)
   - **Environment Variables:**
     ```
     DISCORD_WEBHOOK_URL=your_discord_webhook
     GITHUB_TOKEN=your_github_token
     ANTHROPIC_API_KEY=your_anthropic_key
     GITHUB_USERNAME=asadullah48
     LOG_LEVEL=INFO
     PORT=7860
     ```

3. **Push Code**
   ```bash
   # Clone the Space repository
   git clone https://huggingface.co/spaces/YOUR_USERNAME/asadullah-dev-portfolio-api
   cd asadullah-dev-portfolio-api

   # Copy backend files
   cp -r /path/to/backend/* .

   # Commit and push
   git add .
   git commit -m "Initial deployment"
   git push
   ```

### Option 2: Automated via GitHub Actions

The repository includes a GitHub Actions workflow that automatically deploys to Hugging Face Spaces on push to `main`.

1. **Set GitHub Secrets**
   - `HF_TOKEN`: Hugging Face API token
   - `HF_SPACE_ID`: Your Space ID (e.g., `asadullah48/asadullah-dev-portfolio-api`)

2. **Workflow will:**
   - Build Docker image
   - Push to Hugging Face Spaces
   - Automatically deploy

### Post-Deployment

1. **Verify Deployment**
   - Visit: `https://your-space-id.hf.space`
   - Check health: `https://your-space-id.hf.space/health`
   - API Docs: `https://your-space-id.hf.space/docs`

2. **Monitor Logs**
   - Go to Space > Logs tab
   - Monitor for errors and performance

---

## Docker Deployment

### Local Development

```bash
# Start both services
docker-compose up

# Start specific service
docker-compose up frontend
docker-compose up backend

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Build

```bash
# Build images
docker-compose build

# Or build individually
docker build -t portfolio-frontend -f Dockerfile.frontend .
docker build -t portfolio-backend -f backend/Dockerfile ./backend

# Run containers
docker run -d -p 3000:3000 portfolio-frontend
docker run -d -p 8000:7860 portfolio-backend
```

### Push to Registry

```bash
# Tag images
docker tag portfolio-frontend docker.io/yourusername/portfolio-frontend:latest
docker tag portfolio-backend docker.io/yourusername/portfolio-backend:latest

# Push
docker push docker.io/yourusername/portfolio-frontend:latest
docker push docker.io/yourusername/portfolio-backend:latest
```

---

## Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (GKE, EKS, AKS, or self-hosted)
- kubectl configured
- Docker images pushed to registry
- Ingress controller installed (nginx-ingress recommended)
- cert-manager for SSL (optional)

### Step 1: Create Namespace

```bash
kubectl apply -f k8s/namespace.yaml
```

### Step 2: Configure Secrets

```bash
# Create secrets (DO NOT commit actual values)
kubectl create secret generic portfolio-secrets \
  --namespace=asadullah-dev \
  --from-literal=discord-webhook-url='YOUR_DISCORD_WEBHOOK' \
  --from-literal=github-token='YOUR_GITHUB_TOKEN' \
  --from-literal=anthropic-api-key='YOUR_ANTHROPIC_KEY'
```

### Step 3: Apply ConfigMap

```bash
kubectl apply -f k8s/configmap.yaml
```

### Step 4: Deploy Backend

```bash
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
```

### Step 5: Deploy Frontend

```bash
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
```

### Step 6: Configure Autoscaling

```bash
kubectl apply -f k8s/hpa.yaml
```

### Step 7: Deploy Ingress

```bash
kubectl apply -f k8s/ingress.yaml
```

### Step 8: Verify Deployment

```bash
# Check pods
kubectl get pods -n asadullah-dev

# Check services
kubectl get services -n asadullah-dev

# Check ingress
kubectl get ingress -n asadullah-dev

# View logs
kubectl logs -f deployment/backend -n asadullah-dev
kubectl logs -f deployment/frontend -n asadullah-dev
```

### Step 9: Rollback (if needed)

```bash
# Rollback deployment
kubectl rollout undo deployment/backend -n asadullah-dev
kubectl rollout undo deployment/frontend -n asadullah-dev

# Check rollout history
kubectl rollout history deployment/backend -n asadullah-dev
```

---

## Environment Variables

### Frontend (.env.local / Vercel)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` | Yes |
| `NEXT_PUBLIC_PRODUCTION_API_URL` | Production backend URL | - | Yes |
| `NEXT_PUBLIC_SITE_URL` | Site URL for SEO | `https://asadullah.dev` | No |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | - | No |
| `NEXT_PUBLIC_ENABLE_AI_AGENT` | Enable AI chatbot | `true` | No |
| `NEXT_PUBLIC_ENABLE_CONTACT_FORM` | Enable contact form | `true` | No |

### Backend (.env / Hugging Face)

| Variable | Description | Required |
|----------|-------------|----------|
| `DISCORD_WEBHOOK_URL` | Discord webhook for notifications | No |
| `GITHUB_TOKEN` | GitHub API token | No |
| `ANTHROPIC_API_KEY` | Anthropic API for AI agent | No* |
| `GITHUB_USERNAME` | GitHub username | `asadullah48` |
| `PORT` | Server port | `7860` |
| `LOG_LEVEL` | Logging level | `INFO` |
| `ALLOWED_ORIGINS` | CORS allowed origins | - |

*Required for LangGraph agent features

---

## CI/CD Setup

### GitHub Actions Workflows

The repository includes these workflows:

1. **Frontend CI** (`.github/workflows/frontend-ci.yml`)
   - Lint and type check
   - Build Next.js application
   - Deploy to Vercel

2. **Backend CI** (`.github/workflows/backend-ci.yml`)
   - Lint and test Python code
   - Build Docker image
   - Deploy to Hugging Face Spaces

3. **Docker Build** (`.github/workflows/docker-build.yml`)
   - Build and push Docker images
   - Multi-architecture support

4. **Kubernetes Deploy** (`.github/workflows/k8s-deploy.yml`)
   - Deploy to Kubernetes cluster
   - Rolling updates

### Required GitHub Secrets

```
# Vercel
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID

# Docker Hub
DOCKER_USERNAME
DOCKER_PASSWORD

# Hugging Face
HF_TOKEN
HF_SPACE_ID

# Kubernetes
KUBE_CONFIG_DATA

# Other
GITHUB_TOKEN
```

---

## Monitoring & Logging

### Application Logs

**Vercel (Frontend):**
- Go to Project > Deployments > Click deployment > View logs

**Hugging Face (Backend):**
- Go to Space > Logs tab

**Kubernetes:**
```bash
# View logs
kubectl logs -f deployment/backend -n asadullah-dev
kubectl logs -f deployment/frontend -n asadullah-dev

# Previous instance logs (after crash)
kubectl logs --previous -f deployment/backend -n asadullah-dev
```

### Health Checks

**Endpoints:**
- Frontend: `https://your-domain.com/`
- Backend: `https://your-backend-url/health`

**Kubernetes Probes:**
- Liveness: `/health` every 10s
- Readiness: `/health` every 5s

### Metrics (Kubernetes)

```bash
# Install metrics-server (if not installed)
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# View resource usage
kubectl top pods -n asadullah-dev
kubectl top nodes
```

### Alerting

Set up alerts for:
- Pod restarts > 3 in 5 minutes
- CPU/Memory usage > 80%
- HTTP error rate > 5%
- Response time > 2s

---

## Troubleshooting

### Frontend Issues

**Build fails:**
```bash
# Check Node version
node --version  # Should be 20+

# Clear cache
rm -rf node_modules .next
npm install
npm run build
```

**API connection errors:**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings on backend
- Ensure backend is running

### Backend Issues

**Import errors:**
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

**Port conflicts:**
```bash
# Change PORT environment variable
export PORT=8001
```

**Memory issues:**
- Increase Hugging Face Space hardware tier
- Optimize LangGraph agent configuration
- Add memory limits in Kubernetes

---

## Cost Optimization

### Vercel
- Hobby tier: Free for personal projects
- Pro tier: $20/month for team features

### Hugging Face Spaces
- CPU Basic: Free
- CPU Upgrade: ~$5-10/month
- GPU: ~$0.50-5/hour (only if using AI models)

### Kubernetes
- Use spot instances for cost savings
- Configure HPA for auto-scaling
- Set resource requests/limits appropriately

---

## Security Best Practices

1. **Secrets Management**
   - Never commit `.env` files
   - Use GitHub Secrets for CI/CD
   - Rotate API keys regularly

2. **CORS Configuration**
   - Restrict allowed origins
   - Don't use `*` in production

3. **Rate Limiting**
   - Implement rate limiting for production
   - Use API keys for authentication

4. **HTTPS**
   - Always use HTTPS in production
   - Enable HSTS headers

5. **Container Security**
   - Run as non-root user
   - Scan images for vulnerabilities
   - Keep base images updated

---

**Last Updated:** February 18, 2026  
**Author:** Asadullah Shafique
