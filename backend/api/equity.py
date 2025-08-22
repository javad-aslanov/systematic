from fastapi import APIRouter, HTTPException
import psycopg2
from psycopg2.extras import RealDictCursor
from collections import defaultdict

router = APIRouter()

# --- Database Configuration ---
# Credentials for your TimescaleDB Cloud service
# --- Timescale Cloud (db-98696) ---
DB_NAME = "tsdb"
DB_USER = "tsdbadmin"
DB_PASSWORD = "cm6dubfn1elnkx41"
DB_HOST = "gut9p6dyhy.hgllnyakjj.tsdb.cloud.timescale.com"
DB_PORT = 39036

@router.get("/equity-curve")
def get_equity_curve():
    """
    Connects to the database, fetches the equity curve data,
    and formats it into the required nested JSON structure.
    """
    conn = None
    try:
        # Connect to the database
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT,
            sslmode='require'
        )
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Fetch all data from the new table
        cur.execute("SELECT strategy_key, strategy_name, strategy_color, month, equity FROM equity_curves;")
        rows = cur.fetchall()
        cur.close()

        if not rows:
            raise HTTPException(status_code=404, detail="Equity curve data not found in database.")

        # Process the flat list of rows into the required nested dictionary
        # using a defaultdict for convenience.
        equity_data = defaultdict(lambda: {"name": "", "color": "", "data": []})

        for row in rows:
            key = row['strategy_key']
            equity_data[key]['name'] = row['strategy_name']
            equity_data[key]['color'] = row['strategy_color']
            equity_data[key]['data'].append({
                "month": row['month'],
                "equity": float(row['equity']) # Cast Decimal to float
            })

        return equity_data

    except psycopg2.OperationalError as e:
        raise HTTPException(status_code=503, detail=f"Database connection error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An internal error occurred: {type(e).__name__} - {e}")

    finally:
        if conn:
            conn.close()