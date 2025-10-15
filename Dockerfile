# Multi-stage build cho Vue.js application
FROM node:20-alpine AS builder

# Thiết lập working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (cần dev dependencies để build)
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build ứng dụng cho production
RUN npm run build

# Production stage với Nginx
FROM nginx:alpine AS production

# Copy built files từ builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]