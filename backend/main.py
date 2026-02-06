"""
Cheese & Click - Virtual Photobooth API
FastAPI backend for image processing and photobooth functionality
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional
from pydantic import BaseModel
import uvicorn
import base64
import json
import os
from datetime import datetime

app = FastAPI(
    title="Cheese & Click API",
    description="Virtual Photobooth API for photo capture, processing, and sharing",
    version="1.0.0"
)

# CORS middleware - configure for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response Models
class PhotoProcessRequest(BaseModel):
    photos: List[str]  # Base64 encoded images
    template_id: int
    filter_id: Optional[int] = None

class PhotoProcessResponse(BaseModel):
    success: bool
    processed_image: Optional[str] = None
    error: Optional[str] = None

# WebSocket Connection Manager
class ConnectionManager:
    """Manages WebSocket connections for real-time updates"""
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        """Broadcast message to all connected clients"""
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                # Remove broken connections
                self.disconnect(connection)

manager = ConnectionManager()

# API Endpoints
@app.get("/")
async def root():
    """Root endpoint - API information"""
    return {
        "message": "Cheese & Click API",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/photos/upload", response_model=dict)
async def upload_photo(file: UploadFile = File(...)):
    """
    Upload a photo file
    
    Args:
        file: Image file to upload
        
    Returns:
        dict: Photo ID and base64 encoded data
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        contents = await file.read()
        
        # In production, save to cloud storage (S3, Azure Blob, etc.)
        # For now, return base64 encoded
        base64_data = base64.b64encode(contents).decode('utf-8')
        
        return {
            "success": True,
            "photo_id": f"photo_{int(datetime.now().timestamp())}",
            "data": base64_data,
            "content_type": file.content_type,
            "size": len(contents)
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )

@app.post("/api/photos/process", response_model=PhotoProcessResponse)
async def process_photos(request: PhotoProcessRequest):
    """
    Process photos with template and filter
    
    Args:
        request: PhotoProcessRequest with photos, template_id, and filter_id
        
    Returns:
        PhotoProcessResponse: Processed image data
    """
    try:
        if not request.photos:
            raise HTTPException(status_code=400, detail="No photos provided")
        
        if request.template_id < 1 or request.template_id > 4:
            raise HTTPException(status_code=400, detail="Invalid template_id")
        
        # Process photos here (apply template, filter, etc.)
        # This is a placeholder - implement actual image processing with Pillow
        # For now, return the first photo as processed result
        
        return PhotoProcessResponse(
            success=True,
            processed_image=request.photos[0] if request.photos else None
        )
    except HTTPException:
        raise
    except Exception as e:
        return PhotoProcessResponse(
            success=False,
            error=str(e)
        )

@app.get("/api/templates")
async def get_templates():
    """
    Get available photo templates
    
    Returns:
        dict: List of available templates
    """
    templates = [
        {
            "id": 1,
            "name": "Heart Frame",
            "emoji": "💖",
            "description": "Romantic heart layout perfect for couples",
            "photo_count": [3]
        },
        {
            "id": 2,
            "name": "Star Frame",
            "emoji": "⭐",
            "description": "Classic grid layout for any occasion",
            "photo_count": [4]
        },
        {
            "id": 3,
            "name": "Flower Frame",
            "emoji": "🌸",
            "description": "Beautiful flower grid for groups",
            "photo_count": [6]
        },
        {
            "id": 4,
            "name": "Simple Frame",
            "emoji": "📋",
            "description": "Clean and minimal design",
            "photo_count": [3, 4, 6]
        },
    ]
    return {"templates": templates}

@app.get("/api/filters")
async def get_filters():
    """
    Get available photo filters
    
    Returns:
        dict: List of available filters
    """
    filters = [
        {
            "id": 1,
            "name": "Cute Pink",
            "emoji": "💗",
            "description": "Warm pink tones for a cute look"
        },
        {
            "id": 2,
            "name": "Sunset",
            "emoji": "🌅",
            "description": "Golden hour vibes with warm tones"
        },
        {
            "id": 3,
            "name": "Vintage",
            "emoji": "📷",
            "description": "Classic sepia tones for retro feel"
        },
        {
            "id": 4,
            "name": "Bright",
            "emoji": "✨",
            "description": "Vibrant and clear enhancement"
        },
    ]
    return {"filters": filters}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time updates
    
    Handles:
    - Countdown timer synchronization
    - Photo capture events
    - Session management
    """
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            if message.get("type") == "countdown":
                # Broadcast countdown to all clients
                await manager.broadcast(json.dumps({
                    "type": "countdown",
                    "value": message.get("value")
                }))
            elif message.get("type") == "capture":
                # Handle photo capture event
                await manager.send_personal_message(
                    json.dumps({"type": "capture", "status": "success"}),
                    websocket
                )
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket)

if __name__ == "__main__":
    # Use import string for reload to work properly
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True  # Auto-reload on code changes
    )
