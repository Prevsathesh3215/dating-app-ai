# main.py
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio
from datetime import datetime

# Create a Socket.IO server
sio = socketio.AsyncServer(cors_allowed_origins="*")
app = FastAPI()

# Attach Socket.IO server to FastAPI
sio_app = socketio.ASGIApp(sio, other_asgi_app=app)

# CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory map: userId -> socketId
users = {}

@app.get("/")
async def health_check():
    return {"message": "Dating app chat backend is running (FastAPI)"}

@sio.event
async def connect(sid, environ):
    print(f"User connected: {sid}")

@sio.event
async def register(sid, userId):
    users[userId] = sid
    print(f"Registered user {userId} with sid {sid}")

@sio.event
async def send_message(sid, data):
    from_user = data.get("from")
    to_user = data.get("to")
    message = data.get("message")
    print(f"Message from {from_user} to {to_user}: {message}")

    recipient_sid = users.get(to_user)
    if recipient_sid:
        await sio.emit("receive_message", {
            "from": from_user,
            "message": message,
            "timestamp": datetime.utcnow().isoformat()
        }, to=recipient_sid)

@sio.event
async def disconnect(sid):
    print(f"User disconnected: {sid}")
    # Remove user from map
    disconnected_user = None
    for user_id, socket_id in list(users.items()):
        if socket_id == sid:
            disconnected_user = user_id
            del users[user_id]
            break
    if disconnected_user:
        print(f"Removed user: {disconnected_user}")

# Run the ASGI app
if __name__ == "__main__":
    uvicorn.run(sio_app, host="0.0.0.0", port=3000)
