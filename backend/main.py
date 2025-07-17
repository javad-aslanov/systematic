# app.py
import os
import signal
from threading import Thread

from fastapi import FastAPI, HTTPException

# Hummingbot backend imports
from hummingbot.client.hummingbot_application import HummingbotApplication
from hummingbot.client.config.global_config_map import global_config_map

app = FastAPI(title="Hummingbot PMM API")

hb_thread: Thread | None = None

def run_hummingbot():
    """Blockingly start Hummingbot’s application loop."""
    HummingbotApplication().start()

@app.on_event("startup")
async def configure_timescale():
    """
    On startup, inject TimescaleDB/Postgres settings into Hummingbot’s global_config_map
    (mirroring conf_client.yml for external DB) :contentReference[oaicite:2]{index=2}.
    """
    # Read DB credentials from env
    db_engine   = os.getenv("DB_ENGINE",   "postgresql+psycopg2")
    db_host     = os.getenv("DB_HOST",     "localhost")
    db_port     = os.getenv("DB_PORT",     "5432")
    db_username = os.getenv("DB_USER",     "hbot")
    db_password = os.getenv("DB_PASSWORD", "hbotpass")
    db_name     = os.getenv("DB_NAME",     "hummingbot")

    # Inject into Hummingbot’s config map
    global_config_map.get("db_engine").value   = db_engine
    global_config_map.get("db_host").value     = db_host
    global_config_map.get("db_port").value     = db_port
    global_config_map.get("db_username").value = db_username
    global_config_map.get("db_password").value = db_password
    global_config_map.get("db_name").value     = db_name

@app.post("/hummingbot/start")
async def start_hummingbot():
    """
    Configure and launch the pure_market_making strategy with default spreads
    (all via code—no separate YAML) :contentReference[oaicite:3]{index=3}.
    """
    global hb_thread
    if hb_thread and hb_thread.is_alive():
        raise HTTPException(status_code=409, detail="Hummingbot already running")
    # Strategy and its parameters from env (defaults fallback to Binance ETH-USDT, 0.5% spread)
    global_config_map.get("strategy").value                         = "pure_market_making"
    global_config_map.get("pure_market_making_exchange").value      = os.getenv("EXCHANGE",   "binance")
    global_config_map.get("pure_market_making_market").value        = os.getenv("MARKET",     "ETH-USDT")
    global_config_map.get("pure_market_making_bid_spread").value    = os.getenv("BID_SPREAD", "0.5")
    global_config_map.get("pure_market_making_ask_spread").value    = os.getenv("ASK_SPREAD", "0.5")
    global_config_map.get("pure_market_making_minimum_spread").value = os.getenv("MIN_SPREAD", "-100")

    hb_thread = Thread(target=run_hummingbot, daemon=True)
    hb_thread.start()
    return {"status": "started"}

@app.post("/hummingbot/stop")
async def stop_hummingbot():
    """Gracefully shut down Hummingbot via SIGINT."""
    global hb_thread
    if not hb_thread or not hb_thread.is_alive():
        raise HTTPException(status_code=404, detail="Hummingbot not running")
    # Send Ctrl+C to the whole process group
    os.kill(os.getpid(), signal.SIGINT)
    hb_thread.join(timeout=30)
    return {"status": "stopped"}

@app.get("/hummingbot/status")
async def hummingbot_status():
    """Return whether the Hummingbot thread is alive."""
    running = hb_thread is not None and hb_thread.is_alive()
    return {"running": running}
