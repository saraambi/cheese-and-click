# ⚡ Quick Deploy - Frontend Only

Hướng dẫn nhanh deploy frontend lên GitHub Pages.

## 🚀 3 Bước Đơn Giản

### Bước 1: Enable GitHub Pages

1. GitHub repo → **Settings** → **Pages**
2. **Source**: Chọn **GitHub Actions**
3. **Save**

### Bước 2: Set Secret (Tạm thời)

1. **Settings** → **Secrets** → **Actions**
2. **New secret**:
   - Name: `VITE_API_URL`
   - Value: `http://localhost:8000`
   - Add

**Nếu repo name không phải `username.github.io`:**
- Name: `VITE_BASE_PATH`
- Value: `/repository-name/`
- Add

### Bước 3: Push Code

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

✅ Xong! GitHub sẽ tự động deploy.

## 🔗 Get URL

Sau 2-3 phút:
- **Settings** → **Pages** → Copy URL
- Hoặc: `https://username.github.io` hoặc `https://username.github.io/repo-name`

## 📝 Update Backend URL sau

Khi có backend URL:
1. **Settings** → **Secrets** → Update `VITE_API_URL`
2. Push code để redeploy

## 🆘 Help

Xem chi tiết: [DEPLOY_FRONTEND.md](./DEPLOY_FRONTEND.md)
