#!/bin/bash

# Quick script to get ngrok URLs from running tunnels

echo "🔍 Fetching ngrok URLs..."
echo ""

# Function to get URL from ngrok API
get_ngrok_url() {
    local port=$1
    local response=$(curl -s http://localhost:$port/api/tunnels 2>/dev/null)
    
    if [ -z "$response" ]; then
        echo ""
        return 1
    fi
    
    # Try Python JSON parsing
    local url=$(echo "$response" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data.get('tunnels'):
        for tunnel in data['tunnels']:
            if tunnel.get('public_url') and 'https' in tunnel.get('public_url', ''):
                print(tunnel['public_url'])
                break
except Exception as e:
    pass
" 2>/dev/null)
    
    # Fallback: grep method
    if [ -z "$url" ]; then
        url=$(echo "$response" | grep -oP '"public_url":"\Khttps://[^"]*' | head -1)
    fi
    
    # Another fallback: check log file
    if [ -z "$url" ] && [ -f "ngrok-backend.log" ] && [ "$port" = "4040" ]; then
        url=$(grep -oP 'url=https://\K[^\s]*' ngrok-backend.log | head -1)
        if [ ! -z "$url" ]; then
            url="https://$url"
        fi
    fi
    
    if [ -z "$url" ] && [ -f "ngrok-frontend.log" ] && [ "$port" = "4041" ]; then
        url=$(grep -oP 'url=https://\K[^\s]*' ngrok-frontend.log | head -1)
        if [ ! -z "$url" ]; then
            url="https://$url"
        fi
    fi
    
    echo "$url"
}

# Get Backend URL
echo "📡 Checking backend tunnel (port 4040)..."
BACKEND_URL=$(get_ngrok_url 4040)
if [ ! -z "$BACKEND_URL" ]; then
    echo "   ✅ Backend: $BACKEND_URL"
else
    echo "   ❌ Backend tunnel not found"
    echo "   💡 Check: http://localhost:4040"
fi

echo ""

# Get Frontend URL
echo "🎨 Checking frontend tunnel (port 4041)..."
FRONTEND_URL=$(get_ngrok_url 4041)
if [ ! -z "$FRONTEND_URL" ]; then
    echo "   ✅ Frontend: $FRONTEND_URL"
else
    echo "   ❌ Frontend tunnel not found"
    echo "   💡 Check: http://localhost:4041"
fi

echo ""
echo "🌐 Web Interfaces:"
echo "   Backend:  http://localhost:4040"
echo "   Frontend: http://localhost:4041"
echo ""

if [ ! -z "$BACKEND_URL" ] && [ ! -z "$FRONTEND_URL" ]; then
    echo "🔗 Share this URL with anyone:"
    echo "   $FRONTEND_URL"
    echo ""
    echo "📝 To update vite.config.js, run:"
    echo "   sed -i \"s|target: 'http://.*:8000'|target: '$BACKEND_URL'|g\" vite.config.js"
fi
