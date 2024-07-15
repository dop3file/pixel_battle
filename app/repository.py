from redis import Redis

from app.schemas import Pixel
from app.utils import singleton


@singleton
class HotRepository:
    def __init__(self, redis: Redis):
        self.redis = redis

    def set(self, pixel: Pixel) -> None:
        self.redis.set(pixel.to_str(), pixel.color.name)

    def get_all(self) -> list[Pixel]:
        all_keys = self.redis.keys('*')
        all_values = [Pixel.from_str(coords=key, color=self.redis.get(key)).dict() for key in all_keys]
        return all_values