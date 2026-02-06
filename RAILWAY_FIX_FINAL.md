# 🔧 Railway Deployment - Final Fix

Railway đang cố build cả frontend và backend, gây lỗi. Giải pháp: **Chỉ deploy backend**.

## ✅ Solution: Set Root Directory trong Railway

### Cách 1: Railway Dashboard (Khuyến nghị)

1. Vào Railway dashboard
2. Chọn service `cheese-and-click`
3. **Settings** → **Root Directory**
4. Set: `backend`
5. Save

Railway sẽ chỉ build backend folder!

### Cách 2: Railway CLI

```bash
railway variables set RAILWAY_ROOT_DIRECTORY=backend
```

### Cách 3: Update railway.json

Railway không support root directory trong JSON, phải set trong dashboard.

## 🚀 Deploy lại

Sau khi set root directory:

```bash
railway up
```

Hoặc push code:
```bash
git push
```

## 📝 Alternative: Deploy Backend Service riêng

Nếu vẫn không được, tạo service mới chỉ cho backend:

1. **New Service** trong Railway
2. **Deploy from GitHub repo**
3. **Root Directory**: `backend`
4. **Start Command**: `python -m uvicorn main:app --host 0.0.0.0 --port $PORT`

## 🔗 Kết nối với GitHub Pages

Sau khi backend deploy thành công:

1. **Backend URL**: `https://your-app.up.railway.app`
2. **Set GitHub Secret**: `VITE_API_URL=https://your-app.up.railway.app`
3. **Deploy frontend**: Push code → GitHub Actions tự động deploy

## ✅ Checklist

- [ ] Set Root Directory = `backend` trong Railway
- [ ] Backend deploy thành công
- [ ] Set `VITE_API_URL` secret trong GitHub
- [ ] Set `CORS_ORIGINS` trong Railway với GitHub Pages URL
- [ ] Frontend deploy trên GitHub Pages

## 🆘 Nếu vẫn fail

Railway có thể cache config cũ. Thử:

1. **Delete service** và tạo lại
2. Hoặc **Clear build cache** trong Railway settings
3. Hoặc dùng **Railway CLI** để force rebuild:
   ```bash
   railway up --detach
   ```
