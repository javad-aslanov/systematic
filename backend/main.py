from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time
import threading
import psycopg2

# Import your API routers
from api import market, equity, coins, dashboard

# --- Database Configuration ---
# Use the same credentials as your other files
DB_NAME = "tsdb"
DB_USER = "tsdbadmin"
DB_PASSWORD = "fsc6uhepg8u8wgda"
DB_HOST = "oz7m02mu5o.hm5tdfibxb.tsdb.cloud.timescale.com"
DB_PORT = "32416"

# --- Data Generation Logic ---
def update_database_data():
    """
    This function contains the logic to clear and repopulate the database.
    It will be run in a background thread.
    """
    # This is the data generation logic from your SQL script, translated to Python/SQL
    sql_script = """
        -- Clear old data
        TRUNCATE TABLE dashboard_stats, chain_metrics CASCADE;
        TRUNCATE TABLE market_metrics;

        -- Populate dashboard_stats and chain_metrics
        DO $$
        DECLARE
            stats_id integer;
            snapshot_time timestamp;
        BEGIN
            FOR snapshot_time IN (SELECT * FROM generate_series(NOW() - INTERVAL '6 hours', NOW(), INTERVAL '5 minutes'))
            LOOP
                INSERT INTO dashboard_stats (snapshot_time, total_value, total_value_change, active_traders, active_traders_change, transactions, transactions_change, volatility_index, volatility_change)
                VALUES (snapshot_time, floor(random() * 7001 + 10000), 12.5, floor(random() * 1001 + 1000), floor(random() * 61 - 30), floor(random() * 20001 + 40000), (floor(random() * 101 + 100) / 10.0), (floor(random() * 41 + 30) / 10.0), (floor(random() * 41 + 30) / 10.0))
                RETURNING id INTO stats_id;

                INSERT INTO chain_metrics (stats_snapshot_id, name, height, hash, block_time, peer_count, unconfirmed_count)
                VALUES
                    (stats_id, 'Ethereum', floor(random() * 100 + 22612500), 'e2952ae90b08abcd1234…', snapshot_time - INTERVAL '2 minute', 25, 0),
                    (stats_id, 'Bitcoin', floor(random() * 100 + 899400), '00000000000000000001df37abcd5678…', snapshot_time - INTERVAL '10 minute', 243, floor(random() * 1000 + 4000)),
                    (stats_id, 'Litecoin', floor(random() * 100 + 3621400), 'abcd1234abcd1234abcd1234abcd1234…', snapshot_time - INTERVAL '3 minute', 150, floor(random() * 50 + 100)),
                    (stats_id, 'Dogecoin', floor(random() * 100 + 4657800), '1234abcd1234abcd1234abcd1234abcd…', snapshot_time - INTERVAL '1 minute', 85, floor(random() * 100 + 300));
            END LOOP;
        END $$;

        -- Populate market_metrics
        INSERT INTO market_metrics (timestamp, volatility, hype_index)
        SELECT
            generated_minute,
            floor(random() * (500 - 50 + 1) + 50),
            floor(random() * (550 - 100 + 1) + 100)
        FROM
            generate_series(
                NOW() - INTERVAL '59 minutes',
                NOW(),
                INTERVAL '1 minute'
            ) AS generated_minute;
    """
    conn = None
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD,
            host=DB_HOST, port=DB_PORT, sslmode='require'
        )
        cur = conn.cursor()
        cur.execute(sql_script)
        conn.commit()
        cur.close()
        print("Database updated successfully.")
    except Exception as e:
        print(f"Error updating database: {e}")
    finally:
        if conn:
            conn.close()


def background_update_loop():
    """A simple loop that calls the update function every 60 seconds."""
    while True:
        update_database_data()
        time.sleep(60) # Wait for 60 seconds

# --- FastAPI App Setup ---
app = FastAPI()

# Run the update loop in a separate thread when the app starts up
@app.on_event("startup")
def startup_event():
    # Note: For production apps, consider more robust solutions like Celery or APScheduler
    thread = threading.Thread(target=background_update_loop, daemon=True)
    thread.start()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register your API routers
app.include_router(market.router, prefix="/api")
app.include_router(equity.router, prefix="/api")
app.include_router(coins.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")