# 🚀 Quick Start: GitHub Pages

Deploy frontend lên GitHub Pages trong 3 bước.

## ✅ Bước 1: Enable GitHub Pages

1. Vào repository trên GitHub
2. **Settings** → **Pages**
3. **Source**: Chọn **GitHub Actions**
4. Click **Save**

## ✅ Bước 2: Set Secrets

1. **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Thêm các secrets:

```
Name: VITE_API_URL
Value: https://your-backend.railway.app
```

```
Name: VITE_WS_URL  
Value: wss://your-backend.railway.app
```

**Nếu repository name không phải `username.github.io`:**
```
Name: VITE_BASE_PATH
Value: /repository-name/
```

## ✅ Bước 3: Push Code

```bash
git add .
git commit -m "Setup GitHub Pages"
git push origin main
```

GitHub Actions sẽ tự động build và deploy!

## 🔗 Get Your URL

Sau khi deploy thành công:
- **Root repo** (`username.github.io`): `https://username.github.io`
- **Project repo**: `https://username.github.io/repository-name`

## ⚙️ Update Backend CORS

Trong Railway/Backend, set environment variable:
```
CORS_ORIGINS=https://username.github.io,https://username.github.io/repository-name
```

## 🔄 Auto Deploy

Mỗi lần push code lên `main` branch, GitHub sẽ tự động:
1. ✅ Build frontend
2. ✅ Deploy lên GitHub Pages
3. ✅ Update website

## 🆘 Troubleshooting

**404 Errors?**
- Check `VITE_BASE_PATH` secret (phải match với repository name)
- Check GitHub Pages source = GitHub Actions

**API không connect?**
- Check `VITE_API_URL` secret
- Check backend CORS settings

**Build fails?**
- Xem logs trong Actions tab
- Test build locally: `npm run build`
