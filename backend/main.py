from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import market, equity, coins, dashboard

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
