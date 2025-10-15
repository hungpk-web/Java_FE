#!/bin/bash

# Script chạy Vue.js app trong development mode với Docker
# Author: Assistant
# Version: 1.0

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

APP_NAME="vue-app-dev"

show_usage() {
    echo -e "${BLUE}Usage: $0 [command]${NC}"
    echo ""
    echo "Commands:"
    echo "  start     - Khởi động development server"
    echo "  stop      - Dừng development server"
    echo "  restart   - Khởi động lại development server"
    echo "  logs      - Xem logs"
    echo "  status    - Kiểm tra trạng thái"
    echo "  clean     - Dọn dẹp Docker resources"
    echo "  shell     - Truy cập shell của container"
}

start_dev() {
    echo -e "${YELLOW}🚀 Khởi động Vue.js development server...${NC}"
    
    # Tạo thư mục logs nếu chưa có
    mkdir -p logs/nginx
    
    # Build và start container
    docker-compose -f docker-compose.dev.yml up -d --build
    
    echo -e "${GREEN}✅ Development server đã khởi động!${NC}"
    echo -e "${BLUE}🌐 Truy cập ứng dụng tại: http://localhost:3000${NC}"
    echo -e "${BLUE}📝 Xem logs: $0 logs${NC}"
    echo -e "${BLUE}🛑 Dừng server: $0 stop${NC}"
}

stop_dev() {
    echo -e "${YELLOW}🛑 Dừng development server...${NC}"
    docker-compose -f docker-compose.dev.yml down
    echo -e "${GREEN}✅ Development server đã dừng!${NC}"
}

restart_dev() {
    echo -e "${YELLOW}🔄 Khởi động lại development server...${NC}"
    docker-compose -f docker-compose.dev.yml restart
    echo -e "${GREEN}✅ Development server đã khởi động lại!${NC}"
}

show_logs() {
    echo -e "${BLUE}📝 Logs của development server:${NC}"
    docker-compose -f docker-compose.dev.yml logs -f
}

show_status() {
    echo -e "${BLUE}📊 Trạng thái container:${NC}"
    docker-compose -f docker-compose.dev.yml ps
    
    echo -e "\n${BLUE}💾 Sử dụng tài nguyên:${NC}"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
}

clean_resources() {
    echo -e "${YELLOW}🧹 Dọn dẹp Docker resources...${NC}"
    
    # Stop containers
    docker-compose -f docker-compose.dev.yml down --remove-orphans
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes
    docker volume prune -f
    
    echo -e "${GREEN}✅ Dọn dẹp hoàn tất!${NC}"
}

access_shell() {
    echo -e "${BLUE}🐚 Truy cập shell của container...${NC}"
    docker-compose -f docker-compose.dev.yml exec vue-app-dev sh
}

# Main script logic
case "${1:-}" in
    start)
        start_dev
        ;;
    stop)
        stop_dev
        ;;
    restart)
        restart_dev
        ;;
    logs)
        show_logs
        ;;
    status)
        show_status
        ;;
    clean)
        clean_resources
        ;;
    shell)
        access_shell
        ;;
    *)
        show_usage
        exit 1
        ;;
esac
