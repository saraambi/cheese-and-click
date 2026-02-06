#!/bin/bash

echo "🧀 Cheese & Click - Starting servers..."

# Check for Node.js and npm
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
    echo "❌ Node.js và npm chưa được cài đặt!"
    echo "📝 Vui lòng cài đặt Node.js:"
    echo "   Ubuntu/Debian: sudo apt-get install nodejs npm"
    echo "   Hoặc truy cập: https://nodejs.org/"
    exit 1
fi

# Check for Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 chưa được cài đặt!"
    exit 1
fi

# Setup frontend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Setup backend
if [ ! -d "backend/venv" ]; then
    echo "🐍 Creating Python virtual environment..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt
    deactivate
    cd ..
fi

# Start backend in background
echo "🚀 Starting backend server..."
cd backend
source venv/bin/activate
python3 main.py > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
echo "⏳ Waiting for backend to start..."
sleep 3

# Check if backend started successfully
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Backend failed to start. Check backend.log for details."
    exit 1
fi

echo "✅ Backend started (PID: $BACKEND_PID)"
echo "📝 Backend logs: tail -f backend.log"

# Start frontend
echo "🎨 Starting frontend server..."
echo "🌐 Frontend will be available at http://localhost:3000"
echo "🔧 Backend API will be available at http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

npm run dev
