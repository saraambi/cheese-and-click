# 🚀 Quick Deployment Guide

Hướng dẫn nhanh để deploy ứng dụng lên production.

## 📦 Files đã được config

✅ **Environment Variables**: `.env.example`  
✅ **Docker**: `Dockerfile`, `docker-compose.yml`  
✅ **Cloud Platforms**: `railway.json`, `render.yaml`, `Procfile`  
✅ **VPS Setup**: `setup-vps.sh`  
✅ **Deploy Script**: `deploy.sh`  

## 🚀 Các phương án deploy

### 1. Docker (Khuyến nghị cho VPS)

```bash
# Build và chạy
docker-compose up -d

# Hoặc build image riêng
docker build -t cheese-and-click:latest .
docker run -p 8000:8000 cheese-and-click:latest
```

### 2. Railway.app (Dễ nhất - Free tier)

```bash
# Install CLI
npm i -g @railway/cli

# Login và deploy
railway login
railway init
railway up
```

Railway sẽ tự động detect và deploy từ `railway.json` và `Procfile`.

### 3. Render.com (Free tier)

1. Connect GitHub repo
2. Create Web Service
3. Render sẽ tự động detect `render.yaml`
4. Set environment variables trong dashboard

### 4. VPS Manual

```bash
# SSH vào VPS
ssh user@your-vps-ip

# Clone repo và setup
git clone YOUR_REPO_URL
cd cheese-and-click
sudo ./setup-vps.sh
```

## ⚙️ Environment Variables

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Cập nhật các giá trị:
- `VITE_API_URL`: Backend URL (production)
- `CORS_ORIGINS`: Frontend domain (production)
- `ENVIRONMENT`: `production`
- `DEBUG`: `false`

## 🔧 Build và Test

```bash
# Build frontend
npm run build

# Test backend
cd backend
source venv/bin/activate
python main.py
```

## 📝 Checklist

Xem [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) để đảm bảo không thiếu bước nào.

## 🆘 Troubleshooting

### Build fails
- Check Node.js version: `node --version` (cần v18+)
- Check Python version: `python3 --version` (cần 3.8+)

### CORS errors
- Update `CORS_ORIGINS` trong environment variables
- Không dùng `*` trong production

### Port conflicts
- Thay đổi port trong `.env` hoặc environment variables

## 📚 Xem thêm

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Hướng dẫn chi tiết
- [INTERNET_ACCESS.md](./INTERNET_ACCESS.md) - Setup internet access
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Checklist đầy đủ
