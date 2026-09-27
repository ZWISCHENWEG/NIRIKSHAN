import os
import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from models.data_models import Observation, ModelField, ProfileData, SarTrajectoryPoint, SarResponse, EvidenceCase
from services.demo_adapter import DemoDataAdapter
from services.netcdf_adapter import NetCDFAdapter
from services.evidence_service import EvidenceService

app = FastAPI(title="Ocean 3D Visualizer API")

# Configure logging
log_level_str = os.environ.get("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=getattr(logging, log_level_str, logging.INFO), format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("ocean-viewer")

logger.info("Starting Ocean 3D Visualizer API")

# Allow CORS configurable for production
cors_origins_str = os.environ.get("CORS_ORIGINS", "*")
cors_origins = [origin.strip() for origin in cors_origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Internal Scientific Failure: {str(exc)} on path {request.url.path}")
    # Standardized API Error Contract
    return JSONResponse(
        status_code=500,
        content={
            "error_code": "INTERNAL_SCIENTIFIC_FAILURE",
            "message": str(exc),
            "details": {"path": request.url.path}
        }
    )


data_mode = os.environ.get("OCEAN_DATA_MODE", "netcdf")
if data_mode == "demo":
    logger.info("Initializing in DEMO data mode")
    data_adapter = DemoDataAdapter()
else:
    logger.info("Initializing in NETCDF data mode")
    try:
        data_adapter = NetCDFAdapter()
        logger.info("NetCDFAdapter loaded successfully")
    except Exception as e:
        logger.warning(f"Failed to load NetCDFAdapter ({e}). Falling back to DemoDataAdapter.")
        data_adapter = DemoDataAdapter()

evidence_service = EvidenceService(data_adapter)

@app.get("/health")
async def health_check():
    """Returns 200 if the service process is alive."""
    return {"status": "ok"}

@app.get("/ready")
async def readiness_check():
    """Returns 200 if the scientific datasets are available."""
    if data_mode == "demo":
        return {"status": "ready", "mode": "demo"}
    
    # Check if NetCDFAdapter loaded successfully
    if isinstance(data_adapter, DemoDataAdapter) and os.environ.get("OCEAN_DATA_MODE", "netcdf") == "netcdf":
        raise HTTPException(status_code=503, detail="Service unavailable: Scientific datasets missing or invalid.")
        
    return {"status": "ready", "mode": "netcdf", "datasets": ["glorys12v1", "argo"]}


@app.get("/api/observations", response_model=List[Observation])
async def get_observations(bbox: str = None, time: str = None):
    """
    Returns observations (e.g. Argo floats) for a given bounding box and time.
    """
    return data_adapter.get_observations(bbox, time)

@app.get("/api/model-field", response_model=ModelField)
async def get_model_field(variable: str = "temperature", depth: float = 0.0, time: str = None):
    """
    Returns gridded model output (e.g. HYCOM/GLORYS) for a specific slice.
    """
    return data_adapter.get_model_field(variable, depth, time)

@app.get("/api/profile", response_model=ProfileData)
async def get_profile(lat: float, lon: float, time: str = None):
    """
    Returns the depth profile for both the observation and the model at a specific point.
    """
    return data_adapter.get_profile(lat, lon, time)

@app.get("/api/evidence/{observation_id}", response_model=EvidenceCase)
async def get_evidence(observation_id: str):
    """
    Returns a complete scientific evidence case for a single observation.
    """
    evidence = evidence_service.get_evidence_case(observation_id)
    if not evidence:
        raise HTTPException(status_code=404, detail="Observation not found or evidence could not be compiled.")
    return evidence

@app.get("/api/sar/drift", response_model=SarResponse)
async def get_sar_drift(lat: float, lon: float, time: str = None, hours: int = 72):
    """
    Returns SAR drift simulation based on real ocean currents.
    """
    return data_adapter.get_sar_drift(lat, lon, time, hours)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
