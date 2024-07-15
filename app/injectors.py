from redis import Redis

from app.config import config
from app.repository import HotRepository
from app.utils import ConnectionManager


async def get_hot_repository() -> HotRepository:
    return HotRepository(
        Redis(
            host=config.REDIS_HOST,
            db=config.REDIS_DB,
            port=config.REDIS_PORT
        )
    )


async def get_connection_manager() -> ConnectionManager:
    return ConnectionManager()