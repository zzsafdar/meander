from typing import Optional

from pydantic import ConfigDict
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    tfl_app_id: Optional[str] = None
    tfl_app_key: Optional[str] = None
    database_url: str = "sqlite:///./dev.db"
    redis_url: str = "redis://localhost:6379"
    environment: str = "development"
    log_level: str = "info"

    model_config = ConfigDict(
        env_file=".env",
        case_sensitive=False,
    )
