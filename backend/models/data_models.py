from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class Observation(BaseModel):
    id: str
    type: str
    lat: float
    lon: float
    time: str
    depth: Optional[float] = None
    variables: Optional[Dict[str, float]] = None
    metadata: Optional[Dict[str, Any]] = None

class Bounds(BaseModel):
    minLat: float
    maxLat: float
    minLon: float
    maxLon: float

class Grid(BaseModel):
    lats: List[float]
    lons: List[float]

class ModelField(BaseModel):
    variable: str
    units: str
    time: str
    depth: float
    bounds: Bounds
    grid: Optional[Grid] = None
    values: Optional[List[List[float]]] = None
    min: float
    max: float
    metadata: Optional[Dict[str, Any]] = None

class ProfileData(BaseModel):
    depths: List[float]
    modelValues: List[float]
    observationValues: List[float]

class CurrentVector(BaseModel):
    lat: float
    lon: float
    depth: float
    time: str
    u: float
    v: float
