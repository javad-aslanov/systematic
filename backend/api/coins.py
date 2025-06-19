from fastapi import APIRouter
from fastapi.responses import JSONResponse
import requests

router = APIRouter()

@router.get("/coins")
def get_coins():
    url = (
        "https://api.coingecko.com/api/v3/coins/markets"
        "?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
    )
    try:
        resp = requests.get(url, timeout=15)
        resp.raise_for_status()
        data = resp.json()
        print(JSONResponse(content=data))
        return JSONResponse(content=data)
    except requests.exceptions.RequestException as e:
        print(f"CoinGecko API error: {e}")
        return JSONResponse(content={"error": "CoinGecko API error"}, status_code=502)
    except Exception as e:
        print(f"Unknown error: {e}")
        return JSONResponse(content={"error": "Unknown backend error"}, status_code=500)
