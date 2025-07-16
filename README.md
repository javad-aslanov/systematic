# Crypto Trading Platform - README

This project is a full-stack crypto trading platform designed to deploy trading strategies, execute arbitrage, and trade exclusively Bitcoin (BTC) and Ethereum (ETH). It combines a modern **Next.js** frontend with a powerful **Python** backend using **Hummingbot** and **Backtrader**.

---

## Features

- Deploy and manage strategies (Momentum, Moving Average, Arbitrage, etc.)
- Arbitrage trading across supported exchanges
- Real-time dashboard with equity curve, blockchain activity, and coin metrics
- Backtesting and live trading using Backtrader and Hummingbot
- Supports only **Bitcoin (BTC)** and **Ethereum (ETH)**
- Monitoring tools with **Grafana**
- Paper trading functionality (live simulation without real funds)

---

## Tech Stack

- **Frontend**: Next.js (React, TypeScript, Tailwind)
- **Backend**: Python (FastAPI)
- **Trading Engine**: Hummingbot (live), Backtrader (backtesting)
- **Data Sources**: Exchange APIs (Binance, Coinbase, etc.), Blockchain explorers
- **Database**: TimescaleDB (PostgreSQL)
- **Monitoring**: Grafana

---

## Prerequisites

- Node.js ≥ 18 (v22 recommended)
- Yarn
- Python ≥ 3.9
- PostgreSQL with TimescaleDB extension
- Docker (optional for Hummingbot/db deployments)

---

## Installation

### 1. Install Yarn

```bash
npm install --global yarn

2. Clone the Repository

git clone https://github.com/javad-aslanov/systematic
cd systematic

3. Setup Environment Variables

Copy .env.example to .env in both /frontend and /backend folders.
Fill in API keys and PostgreSQL/TimescaleDB configs.

⸻

Installing Dependencies

Frontend (Next.js)

cd frontend
yarn install

Backend (Python)

cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt


⸻

Running the Project Locally

Start Frontend

yarn run dev

Project will run at http://localhost:3000

Start Backend

cd backend
python main.py


⸻

Usage
	•	Log in via the web UI.
	•	Monitor blockchain and market data in real time via Grafana.
	•	Deploy or backtest strategies.
	•	Track equity curves and performance.
	•	Use paper trading for risk-free strategy testing.

⸻

Project Structure

/frontend    # Next.js frontend
/backend     # FastAPI backend + trading logic
/strategies  # Backtrader/Hummingbot strategies
/config      # API keys & settings
/db          # TimescaleDB schemas/migrations
/grafana     # Dashboard configurations


⸻

Notes
	•	Only BTC & ETH supported.
	•	Arbitrage via Hummingbot’s connectors/templates.
	•	Backtesting via Backtrader.
	•	Real-time data logging via TimescaleDB.
	•	Paper trading available for all strategies.

⸻

Contributing
	1.	Fork the repo
	2.	Create a feature branch

git checkout -b feature/fooBar


	3.	Commit your changes

git commit -am 'Add some fooBar'


	4.	Push your branch

git push origin feature/fooBar


	5.	Open a pull request

⸻

License

MIT

⸻

Credits
	•	Hummingbot
	•	Backtrader
	•	Next.js
	•	TimescaleDB
	•	Grafana

For more information, see the /docs directory or open an issue.

