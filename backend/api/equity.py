from fastapi import APIRouter

router = APIRouter()

@router.get("/equity-curve")
def get_equity_curve():
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September']
    return {
        "macrossover": {
            "name": "Moving Average Crossover",
            "color": "#1f77b4",
            "data": [{"month": m, "equity": 100000 + i*2500 + (i**1.5)*900} for i, m in enumerate(months)]
        },
        "meanreversion": {
            "name": "Mean Reversion",
            "color": "#ff7f0e",
            "data": [{"month": m, "equity": 100000 + i*1700 + (i%2)*2400} for i, m in enumerate(months)]
        },
        "momentum": {
            "name": "Momentum Strategy",
            "color": "#2ca02c",
            "data": [{"month": m, "equity": 100000 + i*3100 + (i%3)*1200} for i, m in enumerate(months)]
        },
        "breakout": {
            "name": "Breakout Strategy",
            "color": "#d62728",
            "data": [{"month": m, "equity": 100000 + i*900 + ((i+2)%5)*1300} for i, m in enumerate(months)]
        },
        "arbitrage": {
            "name": "Statistical Arbitrage",
            "color": "#9467bd",
            "data": [{"month": m, "equity": 100000 + i*2000 + (i%4)*800} for i, m in enumerate(months)]
        }
    }
