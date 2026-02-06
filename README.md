# 🧀 Cheese & Click - Virtual Photobooth

A professional, commercial-ready virtual photobooth web application built with React + Tailwind CSS (frontend) and Python FastAPI (backend). Perfect for events, parties, weddings, and commercial use.

## ✨ Features

- 🎯 **Beautiful Start Page** - Animated welcome screen with feature highlights
- 🖼️ **Frame Selection** - Choose from 3, 4, or 6 photo layouts with live previews
- 📸 **Camera Capture** - Professional photo capture with countdown timer
- 🎨 **Templates & Filters** - Multiple templates and filters with live preview
- 💾 **Download & Share** - Download, share, and print your final photos
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ⚡ **Real-time Updates** - WebSocket support for synchronized experiences

## 🚀 Quick Start

**📝 See detailed installation guide at [INSTALL.md](./INSTALL.md)**

### Requirements
- Node.js (v18+) and npm
- Python 3.8+

### Local Development (localhost only)

```bash
# Install Node.js if needed (Ubuntu/Debian)
sudo apt-get install nodejs npm

# Run automated setup and start
./start.sh
```

Access at `http://localhost:3000`

### Network Mode (Local Network Access)

```bash
# Run network mode script
./start-network.sh
```

Access from other devices on same network: `http://YOUR_IP:3000`

### Internet Access (Public Access)

**Quick method with ngrok:**
```bash
# Install ngrok first: https://ngrok.com/download
./start-internet.sh
```

This will create public URLs that anyone can access from anywhere!

**📖 See [QUICK_START_NETWORK.md](./QUICK_START_NETWORK.md) for local network**
**📖 See [INTERNET_ACCESS.md](./INTERNET_ACCESS.md) for internet/public access**
**📖 See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment (VPS, Cloud)**

### Manual Setup

**Frontend:**
```bash
npm install
npm run dev
```
→ Available at `http://localhost:3000`

**Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# or venv\Scripts\activate  # Windows
pip install -r requirements.txt
python main.py
```
→ Available at `http://localhost:8000`
→ API Docs at `http://localhost:8000/docs`

## 📁 Project Structure

```
cheese-and-click/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.jsx       # Button component
│   │   ├── Card.jsx         # Card component
│   │   └── Countdown.jsx    # Countdown timer
│   ├── pages/               # Page components
│   │   ├── StartPage.jsx           # Welcome page
│   │   ├── FrameSelectionPage.jsx  # Frame selection
│   │   ├── CameraPage.jsx          # Photo capture
│   │   ├── TemplateFilterPage.jsx  # Customization
│   │   └── ResultPage.jsx          # Final result
│   ├── utils/               # Utilities
│   │   └── imageProcessing.js      # Image processing
│   ├── App.jsx              # Routing
│   └── index.css            # Global styles
├── backend/
│   ├── main.py              # FastAPI application
│   └── requirements.txt     # Python dependencies
├── package.json             # Frontend dependencies
└── vite.config.js           # Vite configuration
```

## 🎨 Design & Theme

The application features a cute, commercial-friendly design with:
- **Color Palette**: Pink, Purple, Blue gradients
- **Typography**: Comic Sans MS with fallbacks
- **Animations**: Smooth transitions, float effects, glow animations
- **Components**: Reusable, customizable UI components
- **Responsive**: Mobile-first responsive design

## 🔄 User Flow

1. **Start Page** → Click "Start Your Photobooth Experience"
2. **Frame Selection** → Choose 3, 4, or 6 photo layout
3. **Camera Page** → Capture photos with countdown timer
4. **Template & Filter** → Select template and filter with live preview
5. **Result Page** → Download, share, or print final photo

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server

### Backend
- **FastAPI** - Modern Python web framework
- **WebSocket** - Real-time communication
- **Uvicorn** - ASGI server
- **Pillow** - Image processing (ready for implementation)

## 📝 API Documentation

### Endpoints

- `GET /` - API information
- `GET /api/health` - Health check
- `GET /api/templates` - Get available templates
- `GET /api/filters` - Get available filters
- `POST /api/photos/upload` - Upload photo
- `POST /api/photos/process` - Process photos with template/filter
- `WS /ws` - WebSocket for real-time updates

Full API documentation available at `/docs` when backend is running.

## 🎯 Commercial Features

- ✅ Professional UI/UX design
- ✅ Smooth animations and transitions
- ✅ Error handling and user feedback
- ✅ Camera permission handling
- ✅ Download and share functionality
- ✅ Print-ready output
- ✅ Responsive design
- ✅ WebSocket support for multi-device sync
- ✅ Extensible architecture

## 🔮 Future Enhancements

- [ ] Advanced image processing with Pillow
- [ ] Cloud storage integration (S3, Azure)
- [ ] User authentication and sessions
- [ ] Photo gallery and history
- [ ] Social media integration
- [ ] QR code generation for sharing
- [ ] Custom branding options
- [ ] Analytics and usage tracking
- [ ] Multi-language support
- [ ] Admin dashboard

## 📄 License

See [LICENSE](./LICENSE) file for details.

## 🤝 Contributing

This is a commercial product. For licensing and commercial inquiries, please contact the project owner.

## 📞 Support

For issues, questions, or commercial inquiries, please open an issue in the repository.

---

**Made with ❤️ for creating memorable moments**
