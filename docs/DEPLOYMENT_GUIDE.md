# DEPLOYMENT GUIDE

## Frontend Deployment

The Vite frontend compiles into static assets.
1. Run `npm run build`
2. The `dist/` directory contains deployable HTML/JS/CSS files.
3. This can be served by any static host (Nginx, Vercel, S3).
4. No backend secrets are embedded in the frontend. Only `VITE_` prefixed public keys are included in the build.

## Backend Deployment (Docker)

A `Dockerfile` is provided in the `backend/` directory for deploying the FastAPI service.

### Building
```bash
cd backend
docker build -t nirikshan-backend .
```

### Running
The scientific NetCDF datasets (`*.nc`) are excluded from version control and the Docker image by design. They must be mounted as a volume.

```bash
docker run -d \
  -p 8000:8000 \
  -v $(pwd)/data/scientific:/app/data/scientific \
  -e OCEAN_DATA_MODE=netcdf \
  -e CORS_ORIGINS="https://your-frontend-domain.com" \
  nirikshan-backend
```

### Production Startup Command
The Dockerfile automatically executes:
`uvicorn main:app --host ${HOST} --port ${PORT} --workers ${WORKERS}`

## Environment Variables

- `OCEAN_DATA_MODE`: Set to `netcdf` for production.
- `CORS_ORIGINS`: Comma-separated list of allowed frontend origins (e.g., `https://frontend.com`). Defaults to `*`.
- `LOG_LEVEL`: Adjust logging verbosity (`INFO`, `DEBUG`).

## Health and Readiness

Deployment orchestrators should use:
- Liveness Probe: `GET /health` (Verifies the web server is responding).
- Readiness Probe: `GET /ready` (Verifies datasets are loaded and scientific algorithms are ready).

## Secrets Handling

- Copernicus credentials are **NOT** required at runtime for the SIH demo when using the packaged/externally mounted validated datasets.
- Client-side keys (`VITE_CESIUM_ION_ACCESS_TOKEN`, `VITE_CARTO_API_KEY`) must be supplied during `npm run build`.

## CI (Continuous Integration)

The repository includes `.github/workflows/ci.yml` which automatically verifies:
- Frontend linting (`npm run lint`)
- Frontend building (`npm run build`)
- Backend testing (`pytest`)

## Rollback Considerations

Because the backend relies on immutable read-only datasets and stateless APIs, rollbacks are as simple as reverting the Docker image version.

## Dataset Management

Datasets must be distributed manually to the production servers and mounted securely. Do not bake them into the Docker images to avoid massive repository bloat.
