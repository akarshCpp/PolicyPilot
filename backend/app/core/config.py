import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    supabase_url: str
    supabase_service_role_key: str
    groq_api_key: str

    class Config:
        env_file = os.path.join(os.path.dirname(__file__), "../../../.env")

settings = Settings()
