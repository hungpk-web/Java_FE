#!/bin/bash

# Script deploy Vue.js app với Docker và Nginx trên Ubuntu
# Author: Assistant
# Version: 1.0

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="vue-app"
DOCKER_IMAGE="vue-app-nginx"
CONTAINER_NAME="vue-app-nginx"
PORT="80"

echo -e "${BLUE}🚀 Bắt đầu deploy Vue.js app với Docker và Nginx...${NC}"

# Function để check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}📋 Kiểm tra prerequisites...${NC}"

if ! command_exists docker; then
    echo -e "${RED}❌ Docker chưa được cài đặt. Vui lòng cài đặt Docker trước.${NC}"
    echo "Hướng dẫn cài đặt: https://docs.docker.com/engine/install/ubuntu/"
    exit 1
fi

if ! command_exists docker-compose; then
    echo -e "${RED}❌ Docker Compose chưa được cài đặt. Vui lòng cài đặt Docker Compose trước.${NC}"
    echo "Hướng dẫn cài đặt: https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}✅ Tất cả prerequisites đã sẵn sàng!${NC}"

# Tạo thư mục logs nếu chưa có
echo -e "${YELLOW}📁 Tạo thư mục logs...${NC}"
mkdir -p logs/nginx

# Stop và remove container cũ nếu có
echo -e "${YELLOW}🛑 Dừng container cũ (nếu có)...${NC}"
docker-compose down --remove-orphans || true

# Remove old images để tiết kiệm space
echo -e "${YELLOW}🧹 Dọn dẹp Docker images cũ...${NC}"
docker image prune -f || true

# Build và start container
echo -e "${YELLOW}🔨 Build Docker image...${NC}"
docker-compose build --no-cache

echo -e "${YELLOW}🚀 Start container...${NC}"
docker-compose up -d

# Wait for container to be ready
echo -e "${YELLOW}⏳ Đợi container khởi động...${NC}"
sleep 10

# Check if container is running
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Container đã khởi động thành công!${NC}"
    
    # Show container status
    echo -e "${BLUE}📊 Container Status:${NC}"
    docker-compose ps
    
    # Show logs
    echo -e "${BLUE}📝 Recent logs:${NC}"
    docker-compose logs --tail=20
    
    # Test health check
    echo -e "${YELLOW}🏥 Kiểm tra health check...${NC}"
    if curl -f http://localhost/health >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Health check passed!${NC}"
    else
        echo -e "${YELLOW}⚠️  Health check failed, nhưng container vẫn đang chạy${NC}"
    fi
    
    echo -e "${GREEN}🎉 Deploy thành công!${NC}"
    echo -e "${BLUE}🌐 Ứng dụng có thể truy cập tại: http://localhost${NC}"
    echo -e "${BLUE}📊 Xem logs: docker-compose logs -f${NC}"
    echo -e "${BLUE}🛑 Dừng ứng dụng: docker-compose down${NC}"
    
else
    echo -e "${RED}❌ Container không thể khởi động!${NC}"
    echo -e "${BLUE}📝 Xem logs để debug:${NC}"
    docker-compose logs
    exit 1
fi



