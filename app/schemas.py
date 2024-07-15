from enum import StrEnum

from pydantic import BaseModel

from app.utils import Color


class Pixel(BaseModel):
    x: int
    y: int
    color: Color

    def to_str(self) -> str:
        return f"{self.x}_{self.y}"

    @classmethod
    def from_str(cls, coords: bytes, color: bytes):
        coords = coords.decode("utf-8")
        coords = coords.split("_")
        color = color.decode("utf-8")
        return Pixel(x=coords[0], y=coords[1], color=Color[color])