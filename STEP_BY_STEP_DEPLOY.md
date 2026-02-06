# 📝 Hướng dẫn từng bước: Deploy Frontend lên GitHub Pages

Hướng dẫn chi tiết, từng bước một để deploy frontend.

## ✅ Bước 1: Chuẩn bị Code trên GitHub

### 1.1. Kiểm tra code đã push chưa

```bash
# Kiểm tra git status
git status

# Nếu chưa có git repo
git init
git add .
git commit -m "Initial commit"
```

### 1.2. Tạo Repository trên GitHub

1. Vào https://github.com
2. Click **+** (góc trên phải) → **New repository**
3. Repository name: `cheese-and-click` (hoặc tên bạn muốn)
4. Chọn **Public** hoặc **Private**
5. **KHÔNG** check "Initialize with README"
6. Click **Create repository**

### 1.3. Push Code lên GitHub

```bash
# Thêm remote (thay username và repo-name)
git remote add origin https://github.com/username/cheese-and-click.git

# Push code
git branch -M main
git push -u origin main
```

✅ **Kiểm tra**: Vào GitHub, bạn sẽ thấy code đã được push.

---

## ✅ Bước 2: Enable GitHub Pages

### 2.1. Vào Settings

1. Trong repository trên GitHub
2. Click tab **Settings** (ở menu trên cùng)

### 2.2. Enable Pages

1. Scroll xuống, tìm phần **Pages** (sidebar bên trái)
2. **Source**: Chọn **GitHub Actions**
3. Click **Save**

✅ **Kiểm tra**: Bạn sẽ thấy message "Your site is ready to be published..."

---

## ✅ Bước 3: Set Environment Variables (Secrets)

### 3.1. Vào Secrets Settings

1. Trong repository, click **Settings**
2. **Secrets and variables** → **Actions**
3. Click **New repository secret**

### 3.2. Add Secret: VITE_API_URL

1. **Name**: `VITE_API_URL`
2. **Secret**: `http://localhost:8000` (tạm thời, sẽ update sau)
3. Click **Add secret**

### 3.3. Add Secret: VITE_BASE_PATH (Nếu cần)

**Chỉ cần nếu repository name KHÔNG phải `username.github.io`**

1. **Name**: `VITE_BASE_PATH`
2. **Secret**: `/cheese-and-click/` (thay bằng repository name của bạn)
3. Click **Add secret**

**Làm sao biết có cần không?**
- Nếu repository name là `username.github.io` → **KHÔNG cần**
- Nếu repository name là `cheese-and-click` → **CẦN**, set `/cheese-and-click/`

---

## ✅ Bước 4: Trigger Deployment

### 4.1. Push Code (Nếu chưa push workflow file)

```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push origin main
```

### 4.2. Hoặc Trigger Manual

1. Vào tab **Actions** trên GitHub
2. Click workflow **Deploy Frontend to GitHub Pages**
3. Click **Run workflow** → **Run workflow**

---

## ✅ Bước 5: Kiểm tra Deployment

### 5.1. Xem Workflow

1. Vào tab **Actions**
2. Bạn sẽ thấy workflow đang chạy
3. Click vào workflow run để xem chi tiết
4. Đợi khoảng 2-3 phút

### 5.2. Get URL

Sau khi workflow thành công (dấu ✅ xanh):

1. Vào **Settings** → **Pages**
2. Bạn sẽ thấy URL: 
   - `https://username.github.io` (nếu root repo)
   - `https://username.github.io/cheese-and-click` (nếu project repo)

### 5.3. Test Frontend

1. Mở URL trong browser
2. Frontend sẽ load
3. UI sẽ hiển thị đúng
4. Một số tính năng có thể không hoạt động vì chưa có backend (bình thường)

---

## ✅ Bước 6: Update Backend URL (Sau khi có Backend)

Khi bạn đã deploy backend và có URL (ví dụ: `https://your-backend.railway.app`):

### 6.1. Update Secret

1. **Settings** → **Secrets** → **Actions**
2. Click vào secret `VITE_API_URL`
3. Click **Update**
4. Thay value thành backend URL: `https://your-backend.railway.app`
5. Click **Update secret**

### 6.2. Redeploy

**Cách 1: Push code**
```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

**Cách 2: Manual trigger**
1. **Actions** → **Deploy Frontend to GitHub Pages**
2. **Run workflow** → **Run workflow**

---

## 📋 Checklist

- [ ] Code đã push lên GitHub
- [ ] GitHub Pages đã enable (Source = GitHub Actions)
- [ ] Secret `VITE_API_URL` đã được set
- [ ] Secret `VITE_BASE_PATH` đã được set (nếu cần)
- [ ] Workflow đã chạy và thành công
- [ ] Frontend URL đã hoạt động

## 🆘 Troubleshooting

### Workflow fails?

**Xem logs:**
1. **Actions** → Click vào failed workflow
2. Xem logs để biết lỗi gì

**Common issues:**
- Node.js version: Cần v18+
- Build fails: Test local `npm run build`
- Secrets không được set: Check Settings → Secrets

### 404 Errors?

- Check `VITE_BASE_PATH` secret (phải match repository name)
- Check GitHub Pages source = GitHub Actions
- Clear browser cache

### Frontend không load?

- Check URL đúng chưa
- Check browser console (F12) để xem errors
- Verify workflow đã deploy thành công

## 📚 Files quan trọng

- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `vite.config.js` - Vite configuration với base path
- `src/App.jsx` - React Router với basename

## 🎯 Next Steps

Sau khi frontend deploy thành công:
1. ✅ Test UI và routing
2. ⏳ Deploy backend (sẽ làm sau)
3. ⏳ Update `VITE_API_URL` secret
4. ⏳ Redeploy frontend

---

**Cần help?** Xem [DEPLOY_FRONTEND.md](./DEPLOY_FRONTEND.md) để biết thêm chi tiết.
