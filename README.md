

# Crypto Trading Platform - README

This project is a full-stack crypto trading platform designed to deploy trading strategies, execute arbitrage, and trade exclusively Bitcoin (BTC) and Ethereum (ETH). The application combines a modern Next.js front end with a powerful Python backend using Hummingbot and Backtrader for live and backtested trading.

---

## Features

* **Deploy and manage trading strategies** (Momentum, Moving Average, Arbitrage, etc.)
* **Arbitrage trading** across supported exchanges
* **Real-time dashboard** with equity curve, blockchain activity, and coin metrics
* **Backtesting and live trading** using Backtrader and Hummingbot
* **Supports only Bitcoin and Ethereum**
* **Monitoring tools** for blockchain activity and trading performance

---

## Tech Stack

* **Frontend:** [Next.js](https://nextjs.org/) (React, TypeScript, Tailwind)
* **Backend:** Python (FastAPI)
* **Trading Engine:** [Hummingbot](https://hummingbot.org/) (live trading/arbitrage), [Backtrader](https://www.backtrader.com/) (backtesting/simulation)
* **Data Sources:** Crypto exchange APIs (Binance, Coinbase, etc.), blockchain explorers
* **Database:** PostgreSQL or MongoDB (for logs, user strategies, and results)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

* [Node.js](https://nodejs.org/) (version 22 suggested)
* [Yarn](https://yarnpkg.com/) (package manager)

---

## Installation

1. **Install Yarn** (if you haven't already):

   ```bash
   npm install --global yarn
   ```

2. **Install project dependencies** (run this in root project directory):

   ```bash
   yarn
   ```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/javad-aslanov/systematic
cd systematic
```

### 2. Setup Environment Variables

* Copy `.env.example` to `.env` in both `/frontend` and `/backend` folders
* Add your API keys and config (see respective `.env.example` files)

### 3. Install Dependencies

**Frontend (Next.js):**

```bash
cd frontend
yarn install
```

**Backend (Python):**

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## Running the Project Locally

Start the development server with:

```bash
yarn run dev
```

This will launch the project in development mode. The project should be running on [localhost:3000](http://localhost:3000).

---

## Running Backend

Start your Python backend (example):

```bash
cd backend
uvicorn main:app --reload
```

---

## Usage

* **Log in** via the web UI.
* **Monitor market** data and blockchain activity in real time.
* **Deploy or backtest strategies** through the dashboard.
* **View results** in the equity curve and activity monitors.

---

## Project Structure

```
/frontend   # Next.js application (UI, dashboards, auth)
/backend    # Python (API, strategy engine, trading logic)
/strategies # Custom strategy scripts for Backtrader/Hummingbot
/config     # Config files (API keys, settings)
```

---

## Requirements

* Node.js ≥ 18 (22 suggested)
* Python ≥ 3.9
* Docker (optional, for Hummingbot deployments)
* Exchange API accounts for live trading

---

## Notes

* Only BTC and ETH are supported for trading and strategy execution.
* Arbitrage is implemented using Hummingbot's built-in connectors and strategy templates.
* Backtrader is used for historical data analysis and backtests.

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Open a pull request

---

## License

[MIT](LICENSE)

---

## Credits

* [Hummingbot](https://hummingbot.org/)
* [Backtrader](https://www.backtrader.com/)
* [Next.js](https://nextjs.org/)

---

**For more info, see the `/docs` directory or open an issue!**
