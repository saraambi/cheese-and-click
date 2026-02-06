# 🚀 Hướng dẫn Deploy Frontend lên GitHub Pages

Hướng dẫn từng bước để deploy frontend lên GitHub Pages.

## 📋 Bước 1: Chuẩn bị Repository

### 1.1. Push code lên GitHub

```bash
# Nếu chưa có git repo
git init
git add .
git commit -m "Initial commit"

# Tạo repo trên GitHub, rồi:
git remote add origin https://github.com/username/cheese-and-click.git
git branch -M main
git push -u origin main
```

### 1.2. Kiểm tra Repository Name

**Option A: Root repository** (`username.github.io`)
- URL sẽ là: `https://username.github.io`
- Base path: `/`

**Option B: Project repository** (`cheese-and-click`)
- URL sẽ là: `https://username.github.io/cheese-and-click`
- Base path: `/cheese-and-click/`

## 📋 Bước 2: Enable GitHub Pages

1. Vào repository trên GitHub
2. Click **Settings** (ở menu trên)
3. Scroll xuống phần **Pages** (sidebar bên trái)
4. **Source**: Chọn **GitHub Actions**
5. Click **Save**

## 📋 Bước 3: Set Environment Variables (Secrets)

### 3.1. Vào Secrets Settings

1. Trong repository, click **Settings**
2. **Secrets and variables** → **Actions**
3. Click **New repository secret**

### 3.2. Add Secrets

**Secret 1: VITE_API_URL**
- Name: `VITE_API_URL`
- Value: `http://localhost:8000` (tạm thời, sẽ update sau khi có backend)
- Click **Add secret**

**Secret 2: VITE_WS_URL** (Optional)
- Name: `VITE_WS_URL`
- Value: `ws://localhost:8000`
- Click **Add secret**

**Secret 3: VITE_BASE_PATH** (Chỉ cần nếu repository name không phải `username.github.io`)
- Name: `VITE_BASE_PATH`
- Value: `/cheese-and-click/` (thay bằng repository name của bạn)
- Click **Add secret**

## 📋 Bước 4: Deploy

### 4.1. Push Code

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

### 4.2. Check Deployment

1. Vào repository trên GitHub
2. Click tab **Actions**
3. Bạn sẽ thấy workflow "Deploy Frontend to GitHub Pages" đang chạy
4. Đợi workflow hoàn thành (khoảng 2-3 phút)

### 4.3. Get Your URL

Sau khi deploy thành công:
1. Vào **Settings** → **Pages**
2. Bạn sẽ thấy URL: `https://username.github.io` hoặc `https://username.github.io/cheese-and-click`

## 📋 Bước 5: Test Frontend

1. Mở URL GitHub Pages trong browser
2. Frontend sẽ load
3. Một số tính năng có thể không hoạt động vì chưa có backend (đó là bình thường)

## 🔄 Update sau khi có Backend

Khi bạn đã deploy backend:

1. **Lấy Backend URL** (ví dụ: `https://your-backend.railway.app`)

2. **Update GitHub Secret:**
   - Vào **Settings** → **Secrets** → **Actions**
   - Click vào secret `VITE_API_URL`
   - Update value thành backend URL
   - Save

3. **Redeploy:**
   - Push code mới, hoặc
   - Vào **Actions** → **Deploy Frontend to GitHub Pages** → **Run workflow**

## ✅ Checklist

- [ ] Code đã push lên GitHub
- [ ] GitHub Pages đã enable (Source = GitHub Actions)
- [ ] Secrets đã được set (`VITE_API_URL`, `VITE_BASE_PATH` nếu cần)
- [ ] Workflow đã chạy và thành công
- [ ] Frontend URL đã hoạt động

## 🆘 Troubleshooting

### Workflow fails?
- Xem logs trong **Actions** tab
- Check Node.js version (cần v18+)
- Test build locally: `npm run build`

### 404 Errors?
- Check `VITE_BASE_PATH` secret (phải match với repository name)
- Check GitHub Pages source = GitHub Actions

### Frontend không load?
- Check browser console để xem errors
- Verify URL đúng format

## 📝 Next Steps

Sau khi frontend deploy thành công:
1. Test các tính năng không cần backend (UI, routing)
2. Deploy backend (Railway, Render, hoặc VPS)
3. Update `VITE_API_URL` secret với backend URL
4. Redeploy frontend

## 📚 Tài liệu tham khảo

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#github-pages)
