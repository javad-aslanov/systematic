from fastapi import APIRouter
from datetime import datetime, timedelta
import random

router = APIRouter()

@router.get("/market-metrics")
def get_market_metrics():
    now = datetime.utcnow().replace(second=0, microsecond=0)
    data = []
    for i in range(60):
        ts = now - timedelta(minutes=59 - i)
        data.append({
            "timestamp": ts.isoformat() + "Z",
            "volatility": random.randint(50, 500),
            "hypeIndex": random.randint(100, 550)
        })
    return data
