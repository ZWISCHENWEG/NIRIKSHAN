# NIRIKSHAN

**A browser-based 3D ocean analysis platform**

**SIH Problem Statement:** SIH26067

## Problem Being Solved
Ocean models often diverge from reality. NIRIKSHAN solves the problem of validating numerical ocean models (like GLORYS12V1) against real in-situ observations (like Argo floats) by providing a visually intuitive, mathematically rigorous, and fully traceable 3D platform.

## Key Capabilities
- **3D Globe Visualization:** Rendered in CesiumJS.
- **Model-Observation Matching:** Nearest-neighbour matching of model data to observation coordinates.
- **Interactive Profile Comparison:** Vertical comparison of Temperature and Salinity.
- **Derived Scientific Features:** Thermocline, Mixed Layer Depth (MLD), and Current Shear.
- **SAR (Search and Rescue) Simulation:** Passive particle drift simulation based on surface currents.
- **Scientific Evidence Provenance Tracking:** Transparent metadata linking analysis back to raw NetCDF sources.
- **Configurable Data Environments:** Support for both mock demo mode and real NetCDF ingestion.

## Scientific Datasets
- **Model:** GLORYS12V1 (Subset: Bay of Bengal, Jan 2024)
- **Observations:** Argo Floats (Subset: Bay of Bengal)

## Architecture Overview
NIRIKSHAN uses a Vite/React frontend and a FastAPI/Python backend. The frontend handles 3D rendering (Cesium) and analytical interactions, while the backend processes heavy NetCDF arrays using `xarray` and provides clean JSON REST APIs.

## Technology Stack
- **Frontend:** TypeScript, React, Vite, CesiumJS
- **Backend:** Python 3.11+, FastAPI, xarray, NumPy, Pytest
- **Infrastructure:** Docker, GitHub Actions CI

## Repository Structure
- `backend/`: Python backend, scientific data pipelines, and API
- `docs/`: API reference and architectural documentation
- `src/`: Frontend React components and Cesium wrappers
- `public/`: Branding and static assets

## Local Development

### 1. Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env
```
Populate `.env` with your `VITE_CESIUM_ION_ACCESS_TOKEN` and `VITE_CARTO_API_KEY`.

### 2. Dataset Setup
For the real scientific engine to work, place the downloaded NetCDF files here:
- `backend/data/scientific/glorys12v1_bob_202401.nc`
- `backend/data/scientific/argo_bob.nc`

*(If these are missing, the backend will fallback to a mock dataset).*

### 3. Backend Startup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 4. Frontend Startup
In a new terminal at the repository root:
```bash
npm install
npm run dev
```

## Testing, Build, and Lint
- **Backend Tests:** `PYTHONPATH=backend pytest backend/tests`
- **Frontend Build:** `npm run build`
- **Frontend Lint:** `npm run lint`

## Docker Deployment
A `Dockerfile` is provided in the `backend/` directory. The scientific NetCDF datasets (`*.nc`) are excluded from version control and must be mounted as a volume.

```bash
cd backend
docker build -t nirikshan-backend .
docker run -d -p 8000:8000 -v $(pwd)/data/scientific:/app/data/scientific -e OCEAN_DATA_MODE=netcdf nirikshan-backend
```

## Scientific Limitations
This prototype is built for the SIH demonstration and contains several scientific limitations that must be acknowledged:
1. **Nearest-Neighbour Model Matching:** When comparing an Argo observation to the GLORYS model, the closest spatial grid point is used without sub-grid spatial interpolation.
2. **Depth Interpolation:** Model depth levels and Argo pressure levels do not align perfectly; linear interpolation along the z-axis (depth) is used.
3. **SAR Passive-Particle Assumption:** The SAR drift uses a simple 1st-order Euler integration scheme treating objects as passive mathematical particles, without accounting for Windage (Leeway) or Wave/Stokes Drift.
4. **Spatial/Temporal Bounds:** Restricted to a subset of the Bay of Bengal for January 2024 due to memory limitations.

**NIRIKSHAN IS NOT AN OPERATIONAL SEARCH AND RESCUE TOOL. IT IS AN ANALYTICAL PROTOTYPE FOR SCIENTIFIC VALIDATION.**

## Team Information
Created for Smart India Hackathon 2026.
