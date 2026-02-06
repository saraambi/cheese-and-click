# 🧀 Cheese & Click - Virtual Photobooth

Webapp virtual photobooth với theme dễ thương, được xây dựng bằng React + Tailwind CSS (frontend) và Python FastAPI (backend).

## ✨ Tính năng

- 🎯 Start page với giao diện dễ thương
- 🖼️ Chọn khung ảnh (3, 4, hoặc 6 ảnh)
- 📸 Chụp ảnh từng tấm với camera
- 🎨 Chọn template và filter cho ảnh
- 💾 Tải xuống ảnh đã xử lý

## 🚀 Cài đặt và chạy

**📝 Xem hướng dẫn chi tiết tại [INSTALL.md](./INSTALL.md)**

### Yêu cầu
- Node.js (v18+) và npm
- Python 3.8+

### Cách nhanh nhất

```bash
# Cài đặt Node.js nếu chưa có (Ubuntu/Debian)
sudo apt-get install nodejs npm

# Chạy script tự động
./start.sh
```

Script sẽ tự động:
- Kiểm tra và cài đặt dependencies
- Tạo Python virtual environment
- Khởi động cả frontend và backend

### Chạy thủ công

**Frontend:**
```bash
npm install
npm run dev
```
→ `http://localhost:3000`

**Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```
→ `http://localhost:8000`

## 📁 Cấu trúc dự án

```
cheese-and-click/
├── src/
│   ├── pages/
│   │   ├── StartPage.jsx          # Trang bắt đầu
│   │   ├── FrameSelectionPage.jsx # Chọn khung ảnh
│   │   ├── CameraPage.jsx         # Chụp ảnh
│   │   └── TemplateFilterPage.jsx # Chọn template & filter
│   ├── App.jsx                    # Routing
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Tailwind styles
├── backend/
│   ├── main.py                    # FastAPI app
│   └── requirements.txt           # Python dependencies
├── package.json                   # Frontend dependencies
└── vite.config.js                 # Vite config
```

## 🎨 Theme

App sử dụng theme dễ thương với:
- Màu sắc: Pink, Purple, Blue gradient
- Font: Comic Sans MS
- Animation: Bounce, pulse effects
- Icons: Emoji để tăng tính dễ thương

## 🔄 Flow

1. **Start Page** → Bấm "Bắt đầu thôi!"
2. **Frame Selection** → Chọn số lượng ảnh (3, 4, hoặc 6)
3. **Camera Page** → Chụp từng ảnh theo số lượng đã chọn
4. **Template & Filter** → Chọn template và filter
5. **Result** → Xem và tải xuống ảnh cuối cùng

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 18, React Router, Tailwind CSS, Vite
- **Backend**: FastAPI, WebSocket, Python
- **Camera**: MediaDevices API

## 📝 Lưu ý

- Cần quyền truy cập camera để chụp ảnh
- Backend API đang ở dạng cơ bản, cần implement thêm logic xử lý ảnh thực tế
- Template và filter hiện tại là placeholder, cần implement image processing

## 🎯 TODO

- [ ] Implement image processing với Pillow
- [ ] Thêm các template thực tế
- [ ] Thêm các filter thực tế
- [ ] Lưu trữ ảnh (local storage hoặc cloud)
- [ ] Thêm countdown timer khi chụp ảnh
- [ ] Thêm preview real-time với filter
- [ ] Responsive design cho mobile
