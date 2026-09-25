from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from models.data_models import Observation, ModelField, ProfileData
from services.demo_adapter import DemoDataAdapter

app = FastAPI(title="Ocean 3D Visualizer API")

# Allow CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

data_adapter = DemoDataAdapter()

@app.get("/api/observations", response_model=List[Observation])
async def get_observations(bbox: str = None, time: str = None):
    """
    Returns observations (e.g. Argo floats) for a given bounding box and time.
    """
    return data_adapter.get_observations(bbox, time)

@app.get("/api/model-field", response_model=ModelField)
async def get_model_field(variable: str = "temperature", depth: float = 0.0, time: str = None):
    """
    Returns gridded model output (e.g. HYCOM) for a specific slice.
    """
    return data_adapter.get_model_field(variable, depth, time)

@app.get("/api/profile", response_model=ProfileData)
async def get_profile(lat: float, lon: float, time: str = None):
    """
    Returns the depth profile for both the observation and the model at a specific point.
    """
    return data_adapter.get_profile(lat, lon, time)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
