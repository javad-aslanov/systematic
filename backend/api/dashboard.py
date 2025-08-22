from fastapi import APIRouter, HTTPException
import psycopg2
from psycopg2.extras import RealDictCursor
from decimal import Decimal

router = APIRouter()

# --- Database Configuration ---
# Credentials for your TimescaleDB Cloud service
# --- Timescale Cloud (db-98696) ---
DB_NAME = "tsdb"
DB_USER = "tsdbadmin"
DB_PASSWORD = "cm6dubfn1elnkx41"
DB_HOST = "gut9p6dyhy.hgllnyakjj.tsdb.cloud.timescale.com"
DB_PORT = 39036 


@router.get("/dashboard")
def get_dashboard():
    """
    Connects to the database, fetches the latest dashboard and chain data,
    and returns it in the required JSON format.
    """
    conn = None
    try:
        # Step 1: Connect to the database
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT,
            sslmode='require'
        )
        # Use RealDictCursor to get rows as dictionaries, which are easier to work with
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Step 2: Get the most recent snapshot from the main stats table
        cur.execute("SELECT * FROM dashboard_stats ORDER BY snapshot_time DESC LIMIT 1;")
        latest_stats = cur.fetchone()

        # If the database is empty, return a helpful error
        if not latest_stats:
            raise HTTPException(
                status_code=404,
                detail="No data found in database. Please run the data population script."
            )

        # Step 3: Get all the chain data linked to that snapshot
        cur.execute(
            "SELECT * FROM chain_metrics WHERE stats_snapshot_id = %s;",
            (latest_stats['id'],)  # Use the ID from the first query
        )
        chains_data = cur.fetchall()
        
        cur.close()

        # Step 4: Format the database results into the final JSON response
        stats_json = {
            "totalValue": latest_stats['total_value'],
            "totalValueChange": float(latest_stats['total_value_change']),
            "activeTraders": latest_stats['active_traders'],
            "activeTradersChange": latest_stats['active_traders_change'],
            "transactions": latest_stats['transactions'],
            "transactionsChange": float(latest_stats['transactions_change']),
            "volatilityIndex": float(latest_stats['volatility_index']),
            "volatilityChange": float(latest_stats['volatility_change'])
        }

        chains_json = [
            {
                "name": row['name'],
                "height": row['height'],
                "hash": row['hash'],
                "time": row['block_time'].isoformat() if row['block_time'] else None,
                "peer_count": row['peer_count'],
                "unconfirmed_count": row['unconfirmed_count']
            } for row in chains_data
        ]

        return {
            "stats": stats_json,
            "chains": chains_json
        }

    except psycopg2.OperationalError as e:
        # Handle specific connection errors
        raise HTTPException(status_code=503, detail=f"Database connection error: {e}")
    except Exception as e:
        # Handle all other possible errors
        raise HTTPException(status_code=500, detail=f"An internal error occurred: {type(e).__name__} - {e}")

    finally:
        # Step 5: Always make sure the database connection is closed
        if conn:
            conn.close()