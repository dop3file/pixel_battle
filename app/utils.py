import time
from enum import StrEnum
from typing import Callable, Any

from starlette.websockets import WebSocket

from app.config import config


class Color(StrEnum):
    orange = "0"
    red = "1"
    purple = "2"
    green = "3"
    yellow = "4"
    white = "5"
    black = "6"
    null = "5"


def singleton(class_: type) -> Callable:
    instances = {}

    def getinstance(*args: tuple[Any], **kwargs: dict[str, Any]) -> object:
        if class_ not in instances:
            instances[class_] = class_(*args, **kwargs)
        return instances[class_]
    return getinstance


@singleton
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[WebSocket, float] = {}

    def is_active(self, websocket: WebSocket):
        return time.time() - self.active_connections[websocket] > config.DRAW_DELAY

    def update(self, websocket: WebSocket):
        self.active_connections[websocket] = time.time()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[websocket] = time.time()

    def disconnect(self, websocket: WebSocket):
        del self.active_connections[websocket]

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections.keys():
            await connection.send_text(message)
