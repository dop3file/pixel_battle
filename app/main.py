import json
from typing import Annotated

from fastapi import WebSocket, Depends
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import ValidationError
from starlette.websockets import WebSocketDisconnect

from app.injectors import get_hot_repository, get_connection_manager
from app.repository import HotRepository
from app.schemas import Pixel
from app.utils import ConnectionManager

app = FastAPI()
app.mount('/static', StaticFiles(directory='app/static', html=True), name='static')
templates = Jinja2Templates(directory="app/templates")


@app.get("/")
async def index(request: Request):
    return templates.TemplateResponse(
        request=request, name="index.html"
    )


@app.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    hot_repository: Annotated[HotRepository, Depends(get_hot_repository)],
    manager: Annotated[ConnectionManager, Depends(get_connection_manager)]
):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            if data == "open":
                ...
            else:
                if manager.is_active(websocket):
                    try:
                        pixel = Pixel.parse_obj(json.loads(data))
                        hot_repository.set(pixel)
                        manager.update(websocket)
                    except ValidationError:
                        ...
            await manager.broadcast(json.dumps(hot_repository.get_all()))
    except WebSocketDisconnect:
        manager.disconnect(websocket)