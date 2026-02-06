from fastapi import FastAPI, WebSocket, WebSocketDisconnect, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List
import uvicorn
import base64
import json

app = FastAPI(title="Cheese & Click API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.get("/")
async def root():
    return {"message": "Cheese & Click API", "status": "running"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/photos/upload")
async def upload_photo(file: UploadFile = File(...)):
    """Upload a photo"""
    try:
        contents = await file.read()
        # In production, save to storage (S3, local storage, etc.)
        # For now, return base64 encoded
        base64_data = base64.b64encode(contents).decode('utf-8')
        return {
            "success": True,
            "photo_id": f"photo_{len(contents)}",
            "data": base64_data
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )

@app.post("/api/photos/process")
async def process_photos(data: dict):
    """Process photos with template and filter"""
    try:
        photos = data.get("photos", [])
        template_id = data.get("template_id")
        filter_id = data.get("filter_id")
        
        # Process photos here (apply template, filter, etc.)
        # This is a placeholder - implement actual image processing
        
        return {
            "success": True,
            "processed_photos": photos,
            "template_id": template_id,
            "filter_id": filter_id
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )

@app.get("/api/templates")
async def get_templates():
    """Get available templates"""
    templates = [
        {"id": 1, "name": "Khung trái tim", "emoji": "💖"},
        {"id": 2, "name": "Khung ngôi sao", "emoji": "⭐"},
        {"id": 3, "name": "Khung hoa", "emoji": "🌸"},
        {"id": 4, "name": "Khung đơn giản", "emoji": "📋"},
    ]
    return {"templates": templates}

@app.get("/api/filters")
async def get_filters():
    """Get available filters"""
    filters = [
        {"id": 1, "name": "Cute Pink", "emoji": "💗"},
        {"id": 2, "name": "Sunset", "emoji": "🌅"},
        {"id": 3, "name": "Vintage", "emoji": "📷"},
        {"id": 4, "name": "Bright", "emoji": "✨"},
    ]
    return {"filters": filters}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle real-time updates (e.g., countdown, photo capture events)
            await manager.send_personal_message(
                f"Message received: {data}", websocket
            )
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
