# Backend API

## Setup

1. Tạo virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# hoặc
venv\Scripts\activate  # Windows
```

2. Cài đặt dependencies:
```bash
pip install -r requirements.txt
```

3. Chạy server:
```bash
python main.py
# hoặc
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

- `GET /` - Root endpoint
- `GET /api/health` - Health check
- `GET /api/templates` - Lấy danh sách templates
- `GET /api/filters` - Lấy danh sách filters
- `POST /api/photos/upload` - Upload ảnh
- `POST /api/photos/process` - Xử lý ảnh với template và filter
- `WS /ws` - WebSocket endpoint cho real-time updates
