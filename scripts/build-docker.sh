#!/bin/bash
# Docker Deployment Script
# ========================
# Builds and tags Docker images for frontend and backend

set -e

# Configuration
REGISTRY=${REGISTRY:-"docker.io/asadullah48"}
FRONTEND_IMAGE="portfolio-frontend"
BACKEND_IMAGE="portfolio-backend"
VERSION=${VERSION:-"latest"}

echo "🐳 Building Docker images..."
echo "Registry: $REGISTRY"
echo "Version: $VERSION"

# Build Backend
echo ""
echo "📦 Building backend image..."
docker build -t "${REGISTRY}/${BACKEND_IMAGE}:${VERSION}" \
  -t "${REGISTRY}/${BACKEND_IMAGE}:latest" \
  -f backend/Dockerfile \
  ./backend

# Build Frontend
echo ""
echo "📦 Building frontend image..."
docker build -t "${REGISTRY}/${FRONTEND_IMAGE}:${VERSION}" \
  -t "${REGISTRY}/${FRONTEND_IMAGE}:latest" \
  -f Dockerfile.frontend \
  .

echo ""
echo "✅ Build complete!"
echo ""
echo "Images created:"
docker images | grep portfolio

echo ""
echo "To push to registry:"
echo "  docker push ${REGISTRY}/${FRONTEND_IMAGE}:${VERSION}"
echo "  docker push ${REGISTRY}/${BACKEND_IMAGE}:${VERSION}"
