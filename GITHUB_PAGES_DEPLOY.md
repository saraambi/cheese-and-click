# 📄 GitHub Pages Deployment Guide

Hướng dẫn deploy frontend lên GitHub Pages (github.io).

## 🚀 Quick Deploy

### Bước 1: Enable GitHub Pages

1. Vào repository trên GitHub
2. Settings → Pages
3. Source: **GitHub Actions**
4. Save

### Bước 2: Set Repository Secret

1. Settings → Secrets and variables → Actions
2. New repository secret
3. Name: `VITE_API_URL`
4. Value: Backend URL (ví dụ: `https://your-backend.railway.app`)
5. Add secret

### Bước 3: Push Code

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

GitHub Actions sẽ tự động build và deploy!

## ⚙️ Configuration

### Base Path

Nếu repository name không phải `username.github.io`:

**Option 1: Root repository** (`username.github.io`)
- Base path: `/`
- URL: `https://username.github.io`

**Option 2: Project repository** (`username.github.io/repository-name`)
- Base path: `/repository-name/`
- URL: `https://username.github.io/repository-name`

Update trong `.github/workflows/deploy.yml`:
```yaml
env:
  VITE_BASE_PATH: '/repository-name/'  # Thay repository-name
```

Hoặc set trong GitHub Secrets:
- Name: `VITE_BASE_PATH`
- Value: `/repository-name/`

### Environment Variables

Set trong GitHub Secrets (Settings → Secrets → Actions):

```
VITE_API_URL=https://your-backend.railway.app
VITE_WS_URL=wss://your-backend.railway.app
VITE_BASE_PATH=/repository-name/  # Nếu không phải root repo
```

## 🔧 Manual Deploy

Nếu không dùng GitHub Actions:

```bash
# Build
npm run build

# Deploy với gh-pages
npm install -g gh-pages
gh-pages -d dist
```

Hoặc dùng script:
```bash
npm run deploy
```

## 📝 Update package.json

Thêm script deploy:

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

## 🔗 URLs

Sau khi deploy:
- **Root repo**: `https://username.github.io`
- **Project repo**: `https://username.github.io/repository-name`

## ⚠️ Important Notes

1. **Base Path**: Đảm bảo base path đúng với repository structure
2. **API URL**: Frontend cần biết backend URL (set trong Secrets)
3. **CORS**: Update CORS_ORIGINS trong backend với GitHub Pages URL
4. **HTTPS**: GitHub Pages tự động có HTTPS
5. **Camera**: Camera sẽ hoạt động vì có HTTPS

## 🔄 Update Deployment

Mỗi lần push code lên `main` branch, GitHub Actions sẽ tự động:
1. Build frontend
2. Deploy lên GitHub Pages
3. Update website

## 🆘 Troubleshooting

### 404 Errors
- Check base path trong vite.config.js
- Check basename trong Router
- Check GitHub Pages source (phải là GitHub Actions)

### API không kết nối được
- Check VITE_API_URL trong Secrets
- Check CORS_ORIGINS trong backend
- Check backend đang chạy

### Build fails
- Check GitHub Actions logs
- Test build locally: `npm run build`
- Check Node.js version (cần v18+)

## 📚 Resources

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#github-pages)
