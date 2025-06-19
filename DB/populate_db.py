import psycopg2
from psycopg2.extras import RealDictCursor

# --- Database Configuration ---
# These are the credentials for your TimescaleDB Cloud service
DB_NAME = "tsdb"
DB_USER = "tsdbadmin"
DB_PASSWORD = "fsc6uhepg8u8wgda"
DB_HOST = "oz7m02mu5o.hm5tdfibxb.tsdb.cloud.timescale.com"
DB_PORT = "32416"

def read_and_print_table(table_name):
    """
    Connects to the database, reads all rows from a table, and prints them.
    """
    conn = None
    print(f"--- Attempting to read from table: '{table_name}' ---")

    try:
        # Step 1: Establish a connection to the database
        print("Connecting to the database...")
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT,
            sslmode='require'
        )
        print("Connection successful.")

        # Step 2: Create a cursor that returns rows as dictionaries
        # This makes the output much more readable.
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Step 3: Execute a SELECT query to get the 10 most recent rows
        query = f"SELECT * FROM {table_name} ORDER BY snapshot_time DESC LIMIT 10;"
        print(f"Executing query: {query}")
        cur.execute(query)

        # Step 4: Fetch all the results
        rows = cur.fetchall()

        # Step 5: Print the results
        if not rows:
            print(f"No rows found in table '{table_name}'.")
        else:
            print(f"Found {len(rows)} rows. Displaying most recent entries:")
            for row in rows:
                print(dict(row)) # Print each row as a dictionary

    except (Exception, psycopg2.Error) as error:
        print(f"Error while connecting to or reading from PostgreSQL: {error}")

    finally:
        # Step 6: Always close the connection
        if conn:
            conn.close()
            print("Database connection closed.\n")


# --- Main execution block ---
if __name__ == "__main__":
    # Call the function to read from the 'dashboard_stats' table
    read_and_print_table("dashboard_stats")
    
    # You can uncomment the line below to also read from the 'chain_metrics' table
    # read_and_print_table("chain_metrics")