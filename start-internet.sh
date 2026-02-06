#!/bin/bash

echo "🌍 Cheese & Click - Internet Access Mode"
echo "========================================"
echo ""
echo "This script helps you expose your photobooth to the internet"
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok is not installed"
    echo ""
    echo "📥 Installing ngrok..."
    echo ""
    echo "Option 1: Install via snap (Linux)"
    echo "  sudo snap install ngrok"
    echo ""
    echo "Option 2: Download from https://ngrok.com/download"
    echo ""
    echo "Option 3: Install via package manager"
    echo "  # Ubuntu/Debian"
    echo "  curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null"
    echo "  echo 'deb https://ngrok-agent.s3.amazonaws.com buster main' | sudo tee /etc/apt/sources.list.d/ngrok.list"
    echo "  sudo apt update && sudo apt install ngrok"
    echo ""
    read -p "Press Enter after installing ngrok, or Ctrl+C to exit..."
fi

# Check if ngrok is configured
if [ ! -f ~/.config/ngrok/ngrok.yml ] && [ -z "$NGROK_AUTHTOKEN" ]; then
    echo "⚠️  ngrok is not configured"
    echo ""
    echo "1. Sign up at https://ngrok.com (free)"
    echo "2. Get your authtoken from https://dashboard.ngrok.com/get-started/your-authtoken"
    echo "3. Run: ngrok config add-authtoken YOUR_TOKEN"
    echo ""
    read -p "Enter your ngrok authtoken (or press Enter to skip): " authtoken
    if [ ! -z "$authtoken" ]; then
        ngrok config add-authtoken "$authtoken"
        echo "✅ ngrok configured!"
    else
        echo "⚠️  Continuing without authtoken (limited functionality)"
    fi
fi

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

echo ""
echo "🚀 Starting servers..."
echo ""

# Start backend
echo "📡 Starting backend server..."
cd backend
source venv/bin/activate
python3 main.py > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

sleep 2

# Start frontend
echo "🎨 Starting frontend server..."
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

sleep 3

echo ""
echo "✅ Servers started!"
echo ""
echo "🌐 Starting ngrok tunnels..."
echo ""

# Start ngrok for backend (on port 4040)
echo "📡 Backend tunnel (port 8000)..."
ngrok http 8000 --log=stdout > ngrok-backend.log 2>&1 &
NGROK_BACKEND_PID=$!

sleep 5

# Start ngrok for frontend
# Note: ngrok v3 uses different ports for web interface
# We'll use separate config files or check if web-addr is supported
echo "🎨 Frontend tunnel (port 3000)..."
# Try with web-addr first, fallback to default if not supported
ngrok http 3000 --log=stdout --web-addr=localhost:4041 > ngrok-frontend.log 2>&1 &
NGROK_FRONTEND_PID=$!

# If web-addr failed, try alternative method
sleep 2
if ! kill -0 $NGROK_FRONTEND_PID 2>/dev/null || grep -q "unknown flag" ngrok-frontend.log 2>/dev/null; then
    echo "   ⚠️  Retrying frontend tunnel with default port..."
    pkill -f "ngrok http 3000" 2>/dev/null
    # Use ngrok config file approach or run sequentially
    # For now, we'll check both 4040 and 4041, or use log parsing
    ngrok http 3000 --log=stdout > ngrok-frontend.log 2>&1 &
    NGROK_FRONTEND_PID=$!
fi

sleep 8

# Get ngrok URLs from API with retries
echo ""
echo "🔍 Fetching ngrok URLs..."
BACKEND_URL=""
FRONTEND_URL=""

# Retry up to 5 times
for i in {1..5}; do
    sleep 2
    
    # Try to get backend URL
    if [ -z "$BACKEND_URL" ]; then
        BACKEND_RESPONSE=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null)
        if [ ! -z "$BACKEND_RESPONSE" ]; then
            BACKEND_URL=$(echo "$BACKEND_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data.get('tunnels'):
        for tunnel in data['tunnels']:
            if tunnel.get('public_url'):
                print(tunnel['public_url'])
                break
except:
    pass
" 2>/dev/null)
            
            # Fallback grep method
            if [ -z "$BACKEND_URL" ]; then
                BACKEND_URL=$(echo "$BACKEND_RESPONSE" | grep -oP '"public_url":"\K[^"]*' | head -1 || echo "")
            fi
        fi
    fi
    
    # Try to get frontend URL (check both 4040 and 4041, or parse from log)
    if [ -z "$FRONTEND_URL" ]; then
        # Try port 4041 first
        FRONTEND_RESPONSE=$(curl -s http://localhost:4041/api/tunnels 2>/dev/null)
        if [ ! -z "$FRONTEND_RESPONSE" ]; then
            FRONTEND_URL=$(echo "$FRONTEND_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data.get('tunnels'):
        for tunnel in data['tunnels']:
            if tunnel.get('public_url'):
                print(tunnel['public_url'])
                break
except:
    pass
" 2>/dev/null)
        fi
        
        # If not found, check port 4040 (might be second tunnel)
        if [ -z "$FRONTEND_URL" ]; then
            FRONTEND_RESPONSE=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null)
            if [ ! -z "$FRONTEND_RESPONSE" ]; then
                # Get second tunnel (frontend)
                FRONTEND_URL=$(echo "$FRONTEND_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data.get('tunnels') and len(data['tunnels']) > 1:
        # Get tunnel that's not the backend
        for tunnel in data['tunnels']:
            url = tunnel.get('public_url', '')
            if url and '3000' in str(tunnel.get('config', {}).get('addr', '')):
                print(url)
                break
except:
    pass
" 2>/dev/null)
            fi
        fi
        
        # Fallback: parse from log file
        if [ -z "$FRONTEND_URL" ] && [ -f "ngrok-frontend.log" ]; then
            FRONTEND_URL=$(grep -oP 'url=https://\K[^\s]*' ngrok-frontend.log | head -1)
            if [ ! -z "$FRONTEND_URL" ]; then
                FRONTEND_URL="https://$FRONTEND_URL"
            fi
        fi
    fi
    
    # If both URLs found, break
    if [ ! -z "$BACKEND_URL" ] && [ ! -z "$FRONTEND_URL" ]; then
        break
    fi
done

# Display results
echo ""
if [ ! -z "$BACKEND_URL" ] && [ ! -z "$FRONTEND_URL" ]; then
    echo "✅ ngrok tunnels active!"
    echo ""
    echo "🌍 Public URLs:"
    echo "   Backend API: $BACKEND_URL"
    echo "   Frontend: $FRONTEND_URL"
    echo ""
    
    # Update vite.config.js automatically
    if [ -f "vite.config.js" ]; then
        echo "📝 Updating vite.config.js with backend URL..."
        # Create backup
        cp vite.config.js vite.config.js.backup
        
        # Update the target URL
        sed -i "s|target: 'http://localhost:8000'|target: '$BACKEND_URL'|g" vite.config.js
        sed -i "s|target: 'http://.*:8000'|target: '$BACKEND_URL'|g" vite.config.js
        
        echo "✅ vite.config.js updated!"
        echo ""
    fi
    
    echo "🔗 Share this URL with anyone on the internet:"
    echo "   $FRONTEND_URL"
    echo ""
    echo "💡 Tip: Restart frontend (Ctrl+C and run 'npm run dev') for changes to take effect"
else
    echo "⚠️  Could not automatically fetch URLs"
    echo ""
    echo "📋 Please check ngrok web interface for URLs:"
    echo "   Backend: http://localhost:4040"
    echo "   Frontend: http://localhost:4041"
    echo ""
    echo "Or check the logs:"
    echo "   tail -f ngrok-backend.log | grep 'started tunnel'"
    echo "   tail -f ngrok-frontend.log | grep 'started tunnel'"
    echo ""
    echo "Once you have the URLs:"
    echo "1. Update vite.config.js: target: 'BACKEND_URL'"
    echo "2. Restart frontend: npm run dev"
fi

echo ""
echo "⚠️  Note: ngrok free tier has limitations:"
echo "   - URLs change on restart"
echo "   - Limited bandwidth"
echo "   - For production, consider VPS or cloud hosting"
echo ""
echo "Press Ctrl+C to stop all servers and tunnels"

# Cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $BACKEND_PID $FRONTEND_PID $NGROK_BACKEND_PID $NGROK_FRONTEND_PID 2>/dev/null
    pkill -f ngrok 2>/dev/null
    echo "✅ All stopped"
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# Keep script running
wait
