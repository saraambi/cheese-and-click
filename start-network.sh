#!/bin/bash

echo "🌐 Cheese & Click - Network Mode"
echo "================================"
echo ""

# Get local IP address
if command -v hostname &> /dev/null; then
    LOCAL_IP=$(hostname -I | awk '{print $1}')
elif command -v ipconfig &> /dev/null; then
    # Windows (Git Bash)
    LOCAL_IP=$(ipconfig | grep "IPv4" | head -1 | awk '{print $NF}')
else
    LOCAL_IP=$(ip addr show | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | cut -d/ -f1 | head -1)
fi

if [ -z "$LOCAL_IP" ]; then
    echo "❌ Could not detect IP address"
    echo "Please set LOCAL_IP manually:"
    echo "export LOCAL_IP=192.168.1.100"
    exit 1
fi

echo "📍 Detected IP: $LOCAL_IP"
echo ""
echo "🔗 Access URLs:"
echo "   Frontend: http://$LOCAL_IP:3000"
echo "   Backend API: http://$LOCAL_IP:8000"
echo "   API Docs: http://$LOCAL_IP:8000/docs"
echo ""
echo "📱 Share this URL with others on the same network:"
echo "   http://$LOCAL_IP:3000"
echo ""
echo "⚠️  Make sure firewall allows ports 3000 and 8000"
echo ""

# Check for Node.js and npm
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
    echo "❌ Node.js và npm chưa được cài đặt!"
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
if [ ! -d "backend/venv" ] || [ ! -f "backend/venv/bin/activate" ]; then
    echo "🐍 Creating Python virtual environment..."
    cd backend
    if [ -d "venv" ]; then
        rm -rf venv
    fi
    python3 -m venv venv
    source venv/bin/activate
    pip install --upgrade pip --quiet
    pip install -r requirements.txt --quiet
    deactivate
    cd ..
fi

# Create temporary vite config for network mode
cat > vite.config.network.js << EOF
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow access from network
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://$LOCAL_IP:8000',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://$LOCAL_IP:8000',
        ws: true,
      }
    }
  }
})
EOF

# Start backend in background
echo "🚀 Starting backend server..."
cd backend
source venv/bin/activate
python3 main.py > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 3

# Check if backend started successfully
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Backend failed to start. Check backend.log for details."
    exit 1
fi

echo "✅ Backend started (PID: $BACKEND_PID)"
echo ""

# Start frontend with network config
echo "🎨 Starting frontend server..."
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    rm -f vite.config.network.js
    echo "✅ Servers stopped"
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# Use network config
cp vite.config.network.js vite.config.js
npm run dev
