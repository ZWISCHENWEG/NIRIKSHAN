# TEAM DELIVERY CHECKLIST

## CODE
- [x] Frontend React/Vite implementation complete
- [x] Backend FastAPI implementation complete
- [x] Scientific engine (`xarray`/`numpy`) implemented
- [x] Nearest-neighbour matching implemented
- [x] Thermocline/MLD derivations implemented
- [x] SAR passive particle drift implemented
- [x] No fake AI integrated
- [x] No mock data forced in production paths

## DATA
- [x] GLORYS12V1 NetCDF dataset validated and tested
- [x] Argo float NetCDF dataset validated and tested
- [x] Large GLORYS12V1 NetCDF (~208 MB) excluded from Git via `*.nc` rule
- [x] Small Argo subset (`argo_bob.nc`, ~188 KB) intentionally tracked for demo reproducibility

## SECURITY
- [x] Secrets removed from source code
- [x] `.env.example` separates public/private keys
- [x] CORS origins configurable
- [x] API exception handler suppresses Python stack traces

## TESTING
- [x] Backend tests created (30 tests)
- [x] All backend tests passing
- [x] Frontend linting rules passing
- [x] Frontend build completes successfully
- [x] Health and Readiness endpoints implemented and tested

## BUILD & DEPLOYMENT
- [x] `backend/requirements.txt` generated
- [x] `backend/Dockerfile` created (non-root)
- [x] `.github/workflows/ci.yml` CI pipeline created
- [x] `npm run build` produces static artifact

## DEMO & PITCH
- [x] `docs/DEMO_RUNBOOK.md` created
- [x] `docs/PITCH_FACT_SHEET.md` created
- [x] `docs/FEATURE_STATUS.md` created
- [x] `docs/JUDGE_QA.md` created
- [x] `docs/SCIENTIFIC_LIMITATIONS.md` created

## DOCUMENTATION
- [x] `README.md` finalized
- [x] `docs/QUICKSTART.md` created
- [x] `docs/DEPLOYMENT_GUIDE.md` created
- [x] `docs/API_REFERENCE.md` created
- [x] `docs/DATASET_GUIDE.md` created
