# 🚀 Hướng dẫn Deploy Vue.js với Docker và Nginx trên Ubuntu

## 📋 Yêu cầu hệ thống

- Ubuntu 18.04+ (khuyến nghị Ubuntu 20.04+)
- Docker Engine 20.10+
- Docker Compose 2.0+
- ít nhất 2GB RAM
- ít nhất 10GB disk space

## 🔧 Cài đặt Prerequisites

### 1. Cài đặt Docker

```bash
# Update package index
sudo apt update

# Install required packages
sudo apt install apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io

# Add user to docker group (để chạy docker không cần sudo)
sudo usermod -aG docker $USER

# Logout và login lại để áp dụng thay đổi
```

### 2. Cài đặt Docker Compose

```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

## 🚀 Deploy Ứng dụng

### 1. Chuẩn bị môi trường

```bash
# Clone hoặc copy project vào server
cd /path/to/your/vue-project

# Tạo thư mục logs
mkdir -p logs/nginx

# Cấp quyền thực thi cho scripts
chmod +x deploy.sh manage.sh
```

### 2. Deploy tự động

```bash
# Chạy script deploy tự động
./deploy.sh
```

Script này sẽ:
- Kiểm tra prerequisites
- Build Docker image
- Start container với Nginx
- Kiểm tra health check
- Hiển thị thông tin truy cập

### 3. Deploy thủ công

```bash
# Build và start container
docker-compose up -d --build

# Kiểm tra trạng thái
docker-compose ps

# Xem logs
docker-compose logs -f
```

## 🛠️ Quản lý Ứng dụng

Sử dụng script `manage.sh` để quản lý ứng dụng:

```bash
# Khởi động ứng dụng
./manage.sh start

# Dừng ứng dụng
./manage.sh stop

# Khởi động lại
./manage.sh restart

# Xem logs
./manage.sh logs

# Kiểm tra trạng thái
./manage.sh status

# Kiểm tra health check
./manage.sh health

# Truy cập shell container
./manage.sh shell

# Dọn dẹp resources
./manage.sh clean
```

## 🌐 Truy cập Ứng dụng

- **URL chính**: http://your-server-ip hoặc http://localhost
- **Health check**: http://your-server-ip/health
- **Port**: 80 (có thể thay đổi trong docker-compose.yml)

## 📊 Monitoring và Logs

### Xem logs realtime
```bash
docker-compose logs -f
```

### Xem logs của Nginx
```bash
docker-compose exec vue-app tail -f /var/log/nginx/access.log
docker-compose exec vue-app tail -f /var/log/nginx/error.log
```

### Kiểm tra tài nguyên
```bash
docker stats
```

## 🔧 Cấu hình Nginx

File `nginx.conf` đã được tối ưu với:
- Gzip compression
- Static file caching
- Security headers
- SPA routing support
- Health check endpoint

## 🐳 Docker Commands Hữu ích

```bash
# Xem tất cả containers
docker ps -a

# Xem images
docker images

# Xem networks
docker network ls

# Xem volumes
docker volume ls

# Dọn dẹp toàn bộ
docker system prune -a
```

## 🚨 Troubleshooting

### Container không start
```bash
# Xem logs chi tiết
docker-compose logs

# Kiểm tra cấu hình
docker-compose config

# Restart container
docker-compose restart
```

### Port đã được sử dụng
```bash
# Kiểm tra port đang sử dụng
sudo netstat -tulpn | grep :80

# Thay đổi port trong docker-compose.yml
# ports:
#   - "8080:80"  # Sử dụng port 8080 thay vì 80
```

### Không thể truy cập từ bên ngoài
```bash
# Kiểm tra firewall
sudo ufw status

# Mở port 80
sudo ufw allow 80

# Kiểm tra iptables
sudo iptables -L
```

## 🔒 Security Best Practices

1. **Cập nhật hệ thống thường xuyên**
```bash
sudo apt update && sudo apt upgrade
```

2. **Cấu hình firewall**
```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
```

3. **Sử dụng HTTPS** (cần SSL certificate)
4. **Backup thường xuyên**
5. **Monitor logs để phát hiện bất thường**

## 📈 Performance Optimization

1. **Tăng worker processes** trong nginx.conf
2. **Cấu hình caching** cho static files
3. **Sử dụng CDN** cho assets
4. **Monitor resource usage**

## 🆘 Support

Nếu gặp vấn đề:
1. Kiểm tra logs: `./manage.sh logs`
2. Kiểm tra status: `./manage.sh status`
3. Restart ứng dụng: `./manage.sh restart`
4. Kiểm tra health: `./manage.sh health`

## 📝 Notes

- Ứng dụng sẽ tự động restart khi server reboot (restart: unless-stopped)
- Logs được lưu trong thư mục `logs/nginx/`
- Container sử dụng multi-stage build để tối ưu kích thước
- Nginx được cấu hình tối ưu cho SPA (Single Page Application)
