# 📦 Installation Guide

## System Requirements

- **Node.js** (v18 or higher) and npm
- **Python** 3.8 or higher
- **Camera** (for photo capture feature)
- **Modern Web Browser** with camera support (Chrome, Firefox, Safari, Edge)

## Installing Node.js and npm

### Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install nodejs npm
```

### Install from NodeSource (Recommended - Latest Version):
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### macOS (using Homebrew):
```bash
brew install node
```

### Windows:
Download and install from [nodejs.org](https://nodejs.org/)

### Verify Installation:
```bash
node --version  # Should show v18.x or higher
npm --version   # Should show 9.x or higher
```

## Installing Python

### Ubuntu/Debian:
```bash
sudo apt-get install python3 python3-pip python3-venv
```

### macOS:
Python 3 is usually pre-installed. If not:
```bash
brew install python3
```

### Windows:
Download and install from [python.org](https://www.python.org/downloads/)

### Verify Installation:
```bash
python3 --version  # Should show 3.8 or higher
```

## Project Installation

### Option 1: Automated Setup (Recommended)

```bash
# Make scripts executable (if needed)
chmod +x setup.sh start.sh

# Run setup script
./setup.sh

# Start the application
./start.sh
```

### Option 2: Manual Installation

#### Frontend Setup:
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

#### Backend Setup:
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate      # Windows

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
# or
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Running the Application

### Using Start Script:
```bash
./start.sh
```

This will:
- Check for required dependencies
- Install missing packages
- Start backend server (port 8000)
- Start frontend server (port 3000)

### Manual Start:

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

## Access Points

Once running, access the application at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **API Health Check**: http://localhost:8000/api/health

## Troubleshooting

### npm: command not found
- Install Node.js following the instructions above
- Verify installation with `node --version` and `npm --version`

### Python venv issues
- Ensure Python 3.8+ is installed
- Try recreating venv: `rm -rf backend/venv && python3 -m venv backend/venv`

### Camera not working
- Check browser permissions for camera access
- Ensure you're using HTTPS or localhost (required for camera API)
- Try a different browser

### Port already in use
- Change ports in `vite.config.js` (frontend) and `main.py` (backend)
- Or stop the process using the port:
  ```bash
  # Find process using port 3000
  lsof -ti:3000 | xargs kill -9
  
  # Find process using port 8000
  lsof -ti:8000 | xargs kill -9
  ```

### Module not found errors
- Frontend: Run `npm install` again
- Backend: Activate venv and run `pip install -r requirements.txt`

## Production Deployment

### Frontend Build:
```bash
npm run build
# Output will be in 'dist' directory
```

### Backend Production:
```bash
# Use production ASGI server
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Environment Variables:
Create `.env` files for production configuration:
- Frontend: Configure API endpoint
- Backend: Configure CORS origins, database, storage

## Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Python Documentation](https://docs.python.org/3/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Support

For installation issues or questions, please check:
1. System requirements are met
2. All dependencies are installed correctly
3. Ports 3000 and 8000 are available
4. Camera permissions are granted in browser

If issues persist, please open an issue with:
- Operating system and version
- Node.js and Python versions
- Error messages or logs
- Steps to reproduce
