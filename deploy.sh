#!/bin/bash

echo "🚀 Cheese & Click - Deployment Script"
echo "======================================"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ Please edit .env file with your configuration"
    echo ""
fi

# Build frontend
echo "📦 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

echo "✅ Frontend built successfully"
echo ""

# Check deployment method
echo "Select deployment method:"
echo "1) Docker"
echo "2) Railway"
echo "3) Render"
echo "4) Manual (VPS)"
read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        echo "🐳 Building Docker image..."
        docker build -t cheese-and-click:latest .
        echo "✅ Docker image built"
        echo ""
        echo "🚀 To run:"
        echo "   docker-compose up -d"
        ;;
    2)
        echo "🚂 Railway deployment"
        echo ""
        echo "1. Install Railway CLI: npm i -g @railway/cli"
        echo "2. Login: railway login"
        echo "3. Initialize: railway init"
        echo "4. Deploy: railway up"
        ;;
    3)
        echo "🎨 Render deployment"
        echo ""
        echo "1. Connect GitHub repo to Render"
        echo "2. Create new Web Service"
        echo "3. Use render.yaml configuration"
        echo "4. Deploy automatically on push"
        ;;
    4)
        echo "🖥️  Manual VPS deployment"
        echo ""
        echo "1. Copy files to VPS"
        echo "2. Run: ./setup-vps.sh"
        echo "3. Configure Nginx"
        echo "4. Setup SSL"
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment preparation complete!"
