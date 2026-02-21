from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import Settings

app = FastAPI(
    title="Meander API",
    description="Backend API for London itinerary planner",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Meander API is running"}
