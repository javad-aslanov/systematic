````markdown
# Systematic — FastAPI (Backend) + Next.js (Frontend)

> Minimal steps to get the app running locally.

![Node >= 20](https://img.shields.io/badge/Node-%E2%89%A520-339933)
![Python >= 3.10](https://img.shields.io/badge/Python-%E2%89%A53.10-3776AB)
![FastAPI](https://img.shields.io/badge/FastAPI-🚀-009688)
![Next.js](https://img.shields.io/badge/Next.js-⚡-000000)

---

## Prerequisites
- **Node.js** ≥ 20 (use LTS)
- **Python** ≥ 3.10
- **pip** (bundled with Python)
- **Yarn** (one package manager only)

---

## Repo Layout
```txt
backend/        # FastAPI app (main.py)
frontend/       # Next.js app
env.example.txt # sample envs (copy to your .env files)
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
# Windows (PowerShell)
# .\venv\Scripts\Activate.ps1

# Install deps
pip install --upgrade pip
pip install -r requirements.txt

# (Optional) copy envs
# cp ../env.example.txt .env

# Run the server (auto-reload)
fastapi dev main.py
```

* Default API: [http://127.0.0.1:8000](http://127.0.0.1:8000)
* OpenAPI docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

> **Note:** If `fastapi` CLI isn’t available, run with Uvicorn instead:
>
> ```bash
> uvicorn main:app --reload --port 8000
> ```

---

## 2) Frontend (Next.js)

From the repo root:

```bash
cd frontend

# Install deps (creates node_modules/.bin/next)
yarn install

# If it still fails, ensure Next + React are actually deps
yarn i -D next@latest
yarn i react@latest react-dom@latest

# Run
yarn run dev

```

* Default app: [http://localhost:3000](http://localhost:3000)

---

## Hummingbot (Optional)

Prefer **Docker**. See the official guide:
[https://docs.hummingbot.org/installation/](https://docs.hummingbot.org/installation/)

---

## Tips & Troubleshooting

* **Port in use**: change ports (`--port 8001` or `NEXT_PUBLIC_PORT=3001 yarn dev`).
* **venv not activating (Windows)**: run PowerShell as Admin and `Set-ExecutionPolicy RemoteSigned` (then retry).
* **ENV files**: if both apps need envs, create `backend/.env` and `frontend/.env.local` from `env.example.txt`.

```
```
