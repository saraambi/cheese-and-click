#!/bin/bash

echo "🧀 Cheese & Click - Setup Script"
echo "================================"
echo ""

# Check for Node.js and npm
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
    echo "❌ Node.js và npm chưa được cài đặt!"
    echo ""
    echo "📝 Vui lòng cài đặt Node.js:"
    echo "   Ubuntu/Debian: sudo apt-get install nodejs npm"
    echo "   Hoặc truy cập: https://nodejs.org/"
    echo ""
    exit 1
fi

echo "✅ Node.js: $(node --version)"
echo "✅ npm: $(npm --version)"

# Check for Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 chưa được cài đặt!"
    echo "   Ubuntu/Debian: sudo apt-get install python3 python3-pip python3-venv"
    exit 1
fi

echo "✅ Python: $(python3 --version)"
echo ""

# Setup frontend
echo "📦 Setting up frontend..."
if [ ! -d "node_modules" ]; then
    echo "   Installing npm packages..."
    npm install
    echo "   ✅ Frontend dependencies installed"
else
    echo "   ✅ Frontend dependencies already installed"
fi
echo ""

# Setup backend
echo "🐍 Setting up backend..."
if [ ! -d "backend/venv" ]; then
    echo "   Creating virtual environment..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    echo "   Upgrading pip..."
    pip install --upgrade pip --quiet
    echo "   Installing Python packages..."
    pip install -r requirements.txt --quiet
    deactivate
    cd ..
    echo "   ✅ Backend virtual environment created"
else
    echo "   ✅ Backend virtual environment already exists"
fi
echo ""

echo "🎉 Setup completed successfully!"
echo ""
echo "🚀 To start the servers, run:"
echo "   ./start.sh"
echo ""
echo "Or start manually:"
echo "   Frontend: npm run dev"
echo "   Backend:  cd backend && source venv/bin/activate && python main.py"
