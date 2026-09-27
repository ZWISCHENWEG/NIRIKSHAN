# QUICKSTART GUIDE

This guide explains the minimum steps required to run NIRIKSHAN locally.

## 1. Environment Setup

Copy the example environment file and configure your API keys.

```bash
cp .env.example .env
```
Open `.env` and fill in `VITE_CESIUM_ION_ACCESS_TOKEN` and `VITE_CARTO_API_KEY`.

## 2. Dataset Setup

Ensure the real GLORYS and Argo datasets exist in the backend data directory:
- `backend/data/scientific/glorys12v1_bob_202401.nc`
- `backend/data/scientific/argo_bob.nc`

*(If these are missing, the backend will gracefully fallback to DEMO mode using mock data, provided `OCEAN_DATA_MODE` is not strictly enforced).*

## 3. Backend Startup

Use a Python virtual environment to install dependencies and run the server.

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
The backend will run at `http://localhost:8000`.

## 4. Frontend Startup

In a new terminal window at the repository root:

```bash
npm install
npm run dev
```
The frontend will run at `http://localhost:5173`.

## 5. Verification

Verify the system is running correctly:

**Backend Endpoints:**
- Health: `curl http://localhost:8000/health`
- Readiness: `curl http://localhost:8000/ready`

**Tests:**
```bash
PYTHONPATH=backend pytest backend/tests -v
```

**Frontend Build:**
```bash
npm run build
```
