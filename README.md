# NIRIKSHAN

**A Browser-based 3D Oceanographic Visualization and Analytical Evidence Engine**

**SIH Problem Statement:** SIH26067

## Problem Being Solved
Ocean models often diverge from reality. NIRIKSHAN solves the problem of validating numerical ocean models (like GLORYS12V1) against real in-situ observations (like Argo floats) by providing a visually intuitive, mathematically rigorous, and fully traceable 3D platform.

## Product Workflow
SEE → SELECT → VERIFY → COMPARE → UNDERSTAND → SIMULATE → REPLAY → TRACE

## Key Capabilities
**IMPLEMENTED:**
- 3D Globe Visualization (CesiumJS)
- Real Model-Observation Matching (Nearest-Neighbour)
- Interactive Profile Comparison (Temperature/Salinity)
- Derived Scientific Features (Thermocline, MLD, Current Shear)
- SAR (Search and Rescue) Passive Particle Drift Simulation
- Scientific Evidence Provenance Tracking
- Configurable Data Environments (Demo vs NetCDF)

**FUTURE / ROADMAP:**
- Sub-grid interpolation
- Windage and Leeway for SAR
- Wave/Stokes drift integration
- Multi-model comparison
- Live operational forecasting links
- AI-based anomalous profile explanation

## Scientific Datasets
- **Model:** GLORYS12V1 (Subset: Bay of Bengal)
- **Observations:** Argo Floats (Subset: Bay of Bengal)

## Architecture Overview
NIRIKSHAN is composed of a Vite/React frontend and a FastAPI/Python backend. The frontend handles 3D rendering (Cesium) and analytical interactions, while the backend processes heavy NetCDF arrays using `xarray` and provides clean JSON REST APIs.

## Technology Stack
- **Frontend:** TypeScript, React, Vite, CesiumJS, Carto
- **Backend:** Python 3.11+ (Docker: 3.11, Dev: 3.14), FastAPI, Xarray, Numpy, Pytest
- **Infrastructure:** Docker, GitHub Actions CI

## Repository Structure
- `backend/`: Python backend, scientific data pipelines, and API
- `docs/`: Product requirements, scientific engine specs, and manuals
- `src/`: Frontend React components and Cesium wrappers
- `.github/`: CI workflows

## Local Development

### Environment Configuration
1. Copy the example environment file:
   `cp .env.example .env`
2. Populate `.env` with your `VITE_CESIUM_ION_ACCESS_TOKEN` and `VITE_CARTO_API_KEY`.

### Dataset Setup
For the real scientific engine to work, place the downloaded NetCDF files here:
- `backend/data/scientific/glorys12v1_bob_202401.nc`
- `backend/data/scientific/argo_bob.nc`

### Backend Startup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Startup
```bash
npm install
npm run dev
```

## Testing, Build, and Lint
- **Backend Tests:** `PYTHONPATH=backend pytest backend/tests`
- **Frontend Build:** `npm run build`
- **Frontend Lint:** `npm run lint`

## Docker
The backend includes a production `Dockerfile`. It must be run by mounting the datasets directory externally.

## Health and Readiness
- `GET /health`: Verifies backend process liveness.
- `GET /ready`: Verifies datasets are loaded and available.

## Scientific Limitations
This prototype utilizes nearest-neighbour matching without sub-grid interpolation. SAR models are passive Euler integrations without windage/Stokes drift. It is not an operational search-and-rescue tool.

## Demo Workflow
For the SIH pitch, follow the instructions in `docs/DEMO_RUNBOOK.md`.

## Team Information
Created for Smart India Hackathon 2026.
