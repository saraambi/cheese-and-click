#!/bin/bash

echo "🖥️  Cheese & Click - VPS Setup Script"
echo "======================================"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  Please run as root or with sudo"
    exit 1
fi

# Update system
echo "📦 Updating system..."
apt-get update && apt-get upgrade -y

# Install Node.js
echo "📦 Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

# Install Python
echo "📦 Installing Python..."
apt-get install -y python3 python3-pip python3-venv

# Install Nginx
echo "📦 Installing Nginx..."
apt-get install -y nginx

# Install PM2
echo "📦 Installing PM2..."
npm install -g pm2

# Setup application
echo "📦 Setting up application..."
cd /opt || exit
if [ ! -d "cheese-and-click" ]; then
    echo "⚠️  Please clone repository to /opt/cheese-and-click"
    exit 1
fi

cd cheese-and-click

# Setup frontend
echo "📦 Building frontend..."
npm install
npm run build

# Setup backend
echo "📦 Setting up backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate
cd ..

# Create systemd service for backend
echo "📦 Creating systemd service..."
cat > /etc/systemd/system/photobooth-backend.service << EOF
[Unit]
Description=Cheese & Click Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/cheese-and-click/backend
Environment="PATH=/opt/cheese-and-click/backend/venv/bin"
ExecStart=/opt/cheese-and-click/backend/venv/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
systemctl daemon-reload
systemctl enable photobooth-backend
systemctl start photobooth-backend

# Setup Nginx
echo "📦 Configuring Nginx..."
cat > /etc/nginx/sites-available/photobooth << EOF
server {
    listen 80;
    server_name _;

    root /opt/cheese-and-click/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_cache_bypass \$http_upgrade;
    }

    location /ws {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
    }
}
EOF

ln -sf /etc/nginx/sites-available/photobooth /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
nginx -t
systemctl restart nginx

# Setup firewall
echo "📦 Configuring firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo ""
echo "✅ Setup complete!"
echo ""
echo "🌐 Application should be accessible at: http://YOUR_VPS_IP"
echo ""
echo "📝 Next steps:"
echo "   1. Setup domain name (optional)"
echo "   2. Setup SSL: sudo certbot --nginx -d yourdomain.com"
echo "   3. Update CORS_ORIGINS in backend environment"
