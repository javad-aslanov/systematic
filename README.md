```markdown
# Systematic — Frontend (Next.js) & Backend (FastAPI)

Minimal steps to get the app running locally.

## Prerequisites
- **Node.js** ≥ 20 (LTS recommended)
- **Python** ≥ 3.10
- **pip** (comes with Python)
- **Yarn**

## Repo Layout
```

backend/        # FastAPI app (main.py)
frontend/       # Next.js app
env.example.txt # sample envs (copy to your own .env files)

````

---

## 1) Backend (FastAPI)

From the repo root:

```bash
cd backend

# Create & activate a virtual environment
python -m venv venv
# macOS/Linux
source venv/bin/activate

# Install deps
pip install --upgrade pip
pip install -r requirements.txt

# (Optional) copy envs
# cp ../env.example.txt .env

# Run the server (auto-reload)
fastapi dev main.py
````

* Default URL: [http://127.0.0.1:8000](http://127.0.0.1:8000)
* Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 2) Frontend (Next.js)

From the repo root:

```bash
cd frontend

# Use one package manager – here we use Yarn
yarn
# Development
yarn dev
```

* Default URL: [http://localhost:3000](http://localhost:3000)

## Hummingbot

See the official [Hummingbot installation and setup guide](https://docs.hummingbot.org/installation/) and install via Docker preferrably.
