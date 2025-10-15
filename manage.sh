#!/bin/bash

# Script quản lý Vue.js app với Docker
# Usage: ./manage.sh [start|stop|restart|logs|status|clean]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

APP_NAME="vue-app"

show_usage() {
    echo -e "${BLUE}Usage: $0 [command]${NC}"
    echo ""
    echo "Commands:"
    echo "  start     - Khởi động ứng dụng"
    echo "  stop      - Dừng ứng dụng"
    echo "  restart   - Khởi động lại ứng dụng"
    echo "  logs      - Xem logs"
    echo "  status    - Kiểm tra trạng thái"
    echo "  clean     - Dọn dẹp Docker resources"
    echo "  shell     - Truy cập shell của container"
    echo "  health    - Kiểm tra health check"
}

start_app() {
    echo -e "${YELLOW}🚀 Khởi động ứng dụng...${NC}"
    docker-compose up -d
    echo -e "${GREEN}✅ Ứng dụng đã khởi động!${NC}"
}

stop_app() {
    echo -e "${YELLOW}🛑 Dừng ứng dụng...${NC}"
    docker-compose down
    echo -e "${GREEN}✅ Ứng dụng đã dừng!${NC}"
}

restart_app() {
    echo -e "${YELLOW}🔄 Khởi động lại ứng dụng...${NC}"
    docker-compose restart
    echo -e "${GREEN}✅ Ứng dụng đã khởi động lại!${NC}"
}

show_logs() {
    echo -e "${BLUE}📝 Logs của ứng dụng:${NC}"
    docker-compose logs -f
}

show_status() {
    echo -e "${BLUE}📊 Trạng thái container:${NC}"
    docker-compose ps
    
    echo -e "\n${BLUE}💾 Sử dụng tài nguyên:${NC}"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
}

clean_resources() {
    echo -e "${YELLOW}🧹 Dọn dẹp Docker resources...${NC}"
    
    # Stop containers
    docker-compose down --remove-orphans
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes
    docker volume prune -f
    
    # Remove unused networks
    docker network prune -f
    
    echo -e "${GREEN}✅ Dọn dẹp hoàn tất!${NC}"
}

access_shell() {
    echo -e "${BLUE}🐚 Truy cập shell của container...${NC}"
    docker-compose exec vue-app sh
}

check_health() {
    echo -e "${YELLOW}🏥 Kiểm tra health check...${NC}"
    
    if curl -f http://localhost/health >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Health check passed!${NC}"
        echo -e "${GREEN}🌐 Ứng dụng có thể truy cập tại: http://localhost${NC}"
    else
        echo -e "${RED}❌ Health check failed!${NC}"
        echo -e "${YELLOW}📝 Xem logs để debug:${NC}"
        docker-compose logs --tail=20
    fi
}

# Main script logic
case "${1:-}" in
    start)
        start_app
        ;;
    stop)
        stop_app
        ;;
    restart)
        restart_app
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
    health)
        check_health
        ;;
    *)
        show_usage
        exit 1
        ;;
esac



