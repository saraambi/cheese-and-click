# 📦 Hướng dẫn cài đặt

## Yêu cầu hệ thống

- Node.js (v18 trở lên) và npm
- Python 3.8 trở lên
- Camera (cho tính năng chụp ảnh)

## Cài đặt Node.js và npm

### Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install nodejs npm
```

### Hoặc cài đặt từ NodeSource (khuyến nghị):
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Kiểm tra cài đặt:
```bash
node --version
npm --version
```

## Cài đặt Python

### Ubuntu/Debian:
```bash
sudo apt-get install python3 python3-pip python3-venv
```

## Cài đặt dự án

### Cách 1: Dùng script tự động
```bash
./start.sh
```

### Cách 2: Cài đặt thủ công

#### Frontend:
```bash
npm install
```

#### Backend:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# hoặc venv\Scripts\activate  # Windows
pip install --upgrade pip
pip install -r requirements.txt
```

## Chạy dự án

### Dùng script:
```bash
./start.sh
```

### Hoặc chạy riêng biệt:

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
python main.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## Truy cập

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
