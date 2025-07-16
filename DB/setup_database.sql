/*********************************************************************
** COMPLETE DATABASE SETUP SCRIPT
**
** This script will:
** 1. Create all necessary tables if they don't exist.
** 2. Clear all old data from the tables.
** 3. Populate all tables with fresh, realistic sample data.
**********************************************************************/

-- =========== PART 1: CREATE ALL TABLES ===========

CREATE TABLE IF NOT EXISTS dashboard_stats (
    id SERIAL PRIMARY KEY,
    snapshot_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total_value INT,
    total_value_change DECIMAL(10, 2),
    active_traders INT,
    active_traders_change INT,
    transactions BIGINT,
    transactions_change DECIMAL(10, 2),
    volatility_index DECIMAL(10, 2),
    volatility_change DECIMAL(10, 2)
);

CREATE TABLE IF NOT EXISTS chain_metrics (
    id SERIAL PRIMARY KEY,
    stats_snapshot_id INT REFERENCES dashboard_stats(id) ON DELETE CASCADE,
    name VARCHAR(50),
    height BIGINT,
    hash VARCHAR(255),
    block_time TIMESTAMP WITH TIME ZONE,
    peer_count INT,
    unconfirmed_count INT
);

CREATE TABLE IF NOT EXISTS equity_curves (
    id SERIAL PRIMARY KEY,
    strategy_key VARCHAR(50) NOT NULL,
    strategy_name VARCHAR(255),
    strategy_color VARCHAR(20),
    month VARCHAR(20),
    equity DECIMAL(15, 2),
    snapshot_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS market_metrics (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE,
    volatility INTEGER,
    hype_index INTEGER
);


-- =========== PART 2: CLEAR ALL OLD DATA ===========

-- Truncate all tables to ensure a fresh start.
-- Using CASCADE for dashboard_stats handles its dependency from chain_metrics.
TRUNCATE TABLE dashboard_stats, chain_metrics CASCADE;
TRUNCATE TABLE equity_curves;
TRUNCATE TABLE market_metrics;


-- =========== PART 3: POPULATE ALL TABLES ===========

-- Populate dashboard_stats and chain_metrics with 6 hours of data
DO $$
DECLARE
    stats_id integer;
    snapshot_time timestamp;
BEGIN
    FOR snapshot_time IN (SELECT * FROM generate_series(NOW() - INTERVAL '13 hours', NOW(), INTERVAL '2 minutes'))
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

-- Populate equity_curves with pre-calculated data
INSERT INTO equity_curves (strategy_key, strategy_name, strategy_color, month, equity, snapshot_time) VALUES
('macrossover', 'Moving Average Crossover', '#1f77b4', 'January', 100000.00, NOW()),
('macrossover', 'Moving Average Crossover', '#1f77b4', 'February', 103400.00, NOW()),
('macrossover', 'Moving Average Crossover', '#1f77b4', 'March', 107536.44, NOW()),
('macrossover', 'Moving Average Crossover', '#1f77b4', 'April', 112200.00, NOW()),
('macrossover', 'Moving Average Crossover', '#1f77b4', 'May', 117289.92, NOW()),
('macrossover', 'Moving Average Crossover', '#1f77b4', 'June', 122744.56, NOW()),
('macrossover', 'Moving Average Crossover', '#1f77b4', 'July', 128529.15, NOW()),
('macrossover', 'Moving Average Crossover', '#1f77b4', 'August', 134621.28, NOW()),
('macrossover', 'Moving Average Crossover', '#1f77b4', 'September', 141000.00, NOW()),
('meanreversion', 'Mean Reversion', '#ff7f0e', 'January', 100000.00, NOW()),
('meanreversion', 'Mean Reversion', '#ff7f0e', 'February', 104100.00, NOW()),
('meanreversion', 'Mean Reversion', '#ff7f0e', 'March', 103400.00, NOW()),
('meanreversion', 'Mean Reversion', '#ff7f0e', 'April', 107500.00, NOW()),
('meanreversion', 'Mean Reversion', '#ff7f0e', 'May', 106800.00, NOW()),
('meanreversion', 'Mean Reversion', '#ff7f0e', 'June', 110900.00, NOW()),
('meanreversion', 'Mean Reversion', '#ff7f0e', 'July', 110200.00, NOW()),
('meanreversion', 'Mean Reversion', '#ff7f0e', 'August', 114300.00, NOW()),
('meanreversion', 'Mean Reversion', '#ff7f0e', 'September', 113600.00, NOW()),
('momentum', 'Momentum Strategy', '#2ca02c', 'January', 100000.00, NOW()),
('momentum', 'Momentum Strategy', '#2ca02c', 'February', 104300.00, NOW()),
('momentum', 'Momentum Strategy', '#2ca02c', 'March', 107400.00, NOW()),
('momentum', 'Momentum Strategy', '#2ca02c', 'April', 109300.00, NOW()),
('momentum', 'Momentum Strategy', '#2ca02c', 'May', 113600.00, NOW()),
('momentum', 'Momentum Strategy', '#2ca02c', 'June', 116700.00, NOW()),
('momentum', 'Momentum Strategy', '#2ca02c', 'July', 118600.00, NOW()),
('momentum', 'Momentum Strategy', '#2ca02c', 'August', 122900.00, NOW()),
('momentum', 'Momentum Strategy', '#2ca02c', 'September', 126000.00, NOW()),
  ('breakout', 'Breakout Strategy', '#d62728', 'January',    100000.00, NOW()),
  ('breakout', 'Breakout Strategy', '#d62728', 'February',    98000.00, NOW()),
  ('breakout', 'Breakout Strategy', '#d62728', 'March',       97000.00, NOW()),
  ('breakout', 'Breakout Strategy', '#d62728', 'April',       94000.00, NOW()),
  ('breakout', 'Breakout Strategy', '#d62728', 'May',         94000.00, NOW()),
  ('breakout', 'Breakout Strategy', '#d62728', 'June',        96000.00, NOW()),
  ('breakout', 'Breakout Strategy', '#d62728', 'July',        88000.00, NOW()),
  ('breakout', 'Breakout Strategy', '#d62728', 'August',      89000.00, NOW()),
  ('breakout', 'Breakout Strategy', '#d62728', 'September',   86000.00, NOW());
('arbitrage', 'Statistical Arbitrage', '#9467bd', 'January', 100000.00, NOW()),
('arbitrage', 'Statistical Arbitrage', '#9467bd', 'February', 102800.00, NOW()),
('arbitrage', 'Statistical Arbitrage', '#9467bd', 'March', 104800.00, NOW()),
('arbitrage', 'Statistical Arbitrage', '#9467bd', 'April', 106800.00, NOW()),
('arbitrage', 'Statistical Arbitrage', '#9467bd', 'May', 108000.00, NOW()),
('arbitrage', 'Statistical Arbitrage', '#9467bd', 'June', 110800.00, NOW()),
('arbitrage', 'Statistical Arbitrage', '#9467bd', 'July', 112800.00, NOW()),
('arbitrage', 'Statistical Arbitrage', '#9467bd', 'August', 114800.00, NOW()),
('arbitrage', 'Statistical Arbitrage', '#9467bd', 'September', 116000.00, NOW());

-- Populate market_metrics with 60 minutes of data
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