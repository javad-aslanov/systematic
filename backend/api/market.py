from fastapi import APIRouter, HTTPException
import psycopg2
from psycopg2.extras import RealDictCursor

router = APIRouter()

# --- Database Configuration ---
# Credentials for your TimescaleDB Cloud service
DB_NAME = "tsdb"
DB_USER = "tsdbadmin"
DB_PASSWORD = "fsc6uhepg8u8wgda"
DB_HOST = "oz7m02mu5o.hm5tdfibxb.tsdb.cloud.timescale.com"
DB_PORT = "32416"

@router.get("/market-metrics")
def get_market_metrics():
    """
    Connects to the database and fetches the market metrics for the last hour.
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
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Step 2: Fetch all records from the last hour
        cur.execute("""
            SELECT timestamp, volatility, hype_index
            FROM market_metrics
            WHERE timestamp >= NOW() - INTERVAL '1 hour'
            ORDER BY timestamp ASC;
        """)
        rows = cur.fetchall()
        cur.close()

        if not rows:
             raise HTTPException(
                status_code=404,
                detail="No market metrics found for the last hour. Please run the population script."
            )

        # Step 3: Format the database rows into the required list of dictionaries
        data = [
            {
                "timestamp": row['timestamp'].isoformat().replace('+00:00', 'Z'),
                "volatility": row['volatility'],
                "hypeIndex": row['hype_index'] # Map the 'hype_index' column to the 'hypeIndex' key
            } for row in rows
        ]

        return data

    except psycopg2.OperationalError as e:
        raise HTTPException(status_code=503, detail=f"Database connection error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An internal error occurred: {type(e).__name__} - {e}")

    finally:
        # Step 4: Always make sure the database connection is closed
        if conn:
            conn.close()