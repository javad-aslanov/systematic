import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from databases import Database
from dotenv import load_dotenv

from api import market, equity, coins, dashboard

# Load environment variables from .env file
load_dotenv()

# Database configuration
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME")

DATABASE_URL = f"postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
database = Database(DATABASE_URL)

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(market.router, prefix="/api")
app.include_router(equity.router, prefix="/api")
app.include_router(coins.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")


# Connect to DB at startup
@app.on_event("startup")
async def connect_to_db():
    await database.connect()


# Disconnect from DB at shutdown
@app.on_event("shutdown")
async def disconnect_from_db():
    await database.disconnect()


# Dependency getter (optional, if using inside routes)
def get_db():
    return database
