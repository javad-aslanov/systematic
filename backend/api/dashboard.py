from fastapi import APIRouter
import random

router = APIRouter()

@router.get("/dashboard")
def get_dashboard():
    return {
        "stats": {
            "totalValue": random.randint(10000, 17000),
            "totalValueChange": 12.5,
            "activeTraders": random.randint(1000, 2000),
            "activeTradersChange": random.randint(-30, 30),
            "transactions": random.randint(40000, 60000),
            "transactionsChange": random.randint(100, 200)/10,
            "volatilityIndex": random.randint(30, 70)/10,
            "volatilityChange":random.randint(30, 70)/10,
        },
        "chains": [
            {
                "name": "Ethereum",
                "height": 22612549,
                "hash": "e2952ae90b08abcd1234…",
                "time": "2025-06-01T21:32:30Z",
                "peer_count": 25,
                "unconfirmed_count": 0,
            },
            {
                "name": "Bitcoin",
                "height": 899414,
                "hash": "00000000000000000001df37abcd5678…",
                "time": "2025-06-01T21:18:00Z",
                "peer_count": 243,
                "unconfirmed_count": 4500,
            },
            {
                "name": "Litecoin",
                "height": 3621456,
                "hash": "abcd1234abcd1234abcd1234abcd1234…",
                "time": "2025-06-01T21:30:00Z",
                "peer_count": 150,
                "unconfirmed_count": 120,
            },
            {
                "name": "Dogecoin",
                "height": 4657896,
                "hash": "1234abcd1234abcd1234abcd1234abcd…",
                "time": "2025-06-01T21:35:45Z",
                "peer_count": 85,
                "unconfirmed_count": 350,
            },
        ]
    }
