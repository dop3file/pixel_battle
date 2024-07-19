from typing import Any
from typing_extensions import Self

from pydantic import BaseModel, model_validator

from app.config import config
from app.exceptions import CustomError
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

    @model_validator(mode='after')
    def check_passwords_match(self) -> Self:
        if self.x < 0 or self.x > config.WIDTH:
            raise CustomError
        if self.y < 0 or self.y > config.HEIGHT:
            raise CustomError
        return self


