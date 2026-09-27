from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class State(BaseModel):
    lat: Optional[float] = None
    lon: Optional[float] = None
    time: Optional[str] = None
    depth: Optional[float] = None

class MatchingMetadata(BaseModel):
    method: str
    requested_lat: Optional[float] = None
    selected_lat: Optional[float] = None
    spatial_separation: Optional[float] = None
    requested_time: Optional[str] = None
    selected_time: Optional[str] = None
    temporal_separation: Optional[float] = None
    requested_depth: Optional[float] = None
    selected_depth: Optional[float] = None

class ObservationMetadata(BaseModel):
    dataset_id: str
    source: str
    coordinate_convention: str
    timestamp_convention: str
    platform_id: str
    additional_metadata: Optional[Dict[str, Any]] = None

class Observation(BaseModel):
    id: str
    type: str
    lat: float
    lon: float
    time: str
    depth: Optional[float] = None
    variables: Optional[Dict[str, float]] = None
    metadata: Optional[ObservationMetadata] = None

class Bounds(BaseModel):
    minLat: float
    maxLat: float
    minLon: float
    maxLon: float

class Grid(BaseModel):
    lats: List[float]
    lons: List[float]

class ModelFieldMetadata(BaseModel):
    dataset_id: str
    source: str
    variable: str
    source_variable: str
    units: str
    coordinate_convention: str
    timestamp_convention: str
    requested_state: State
    selected_state: State

class ModelField(BaseModel):
    variable: str
    units: str
    time: str
    depth: float
    bounds: Bounds
    grid: Optional[Grid] = None
    values: Optional[List[List[Optional[float]]]] = None
    min: float
    max: float
    metadata: Optional[ModelFieldMetadata] = None

class ProfileMetadata(BaseModel):
    dataset_id_model: str
    dataset_id_obs: str
    matching: MatchingMetadata

class ProfileStatistics(BaseModel):
    bias: Optional[float] = None
    mae: Optional[float] = None
    rmse: Optional[float] = None
    valid_count: int

class ProfileData(BaseModel):
    modelDepths: List[float]
    modelValues: List[Optional[float]]
    observationDepths: List[float]
    observationValues: List[Optional[float]]
    metadata: Optional[ProfileMetadata] = None
    residualDepths: Optional[List[float]] = None
    residualValues: Optional[List[Optional[float]]] = None
    statistics: Optional[ProfileStatistics] = None
    model_u_values: Optional[List[Optional[float]]] = None
    model_v_values: Optional[List[Optional[float]]] = None

class Provenance(BaseModel):
    observation_dataset: str
    model_dataset: str
    model_variables: List[str]
    observation_variables: List[str]
    observation_dataset_id: str
    model_dataset_id: str
    matching_method: str
    residual_definition: str
    profile_alignment_method: str
    dataset_source: Optional[str] = None
    dataset_version: Optional[str] = None
    requested_state: Optional[State] = None
    selected_state: Optional[State] = None
    calculation_method: Optional[str] = None
    calculation_parameters: Optional[Dict[str, Any]] = None
    units: Optional[str] = None
    limitations: Optional[List[str]] = None

class Profile1D(BaseModel):
    depths: List[float]
    values: List[Optional[float]]

class DerivedFeature(BaseModel):
    feature_id: str
    feature_type: str
    value: Optional[float] = None
    unit: str
    depth: Optional[float] = None
    method: str
    parameters: Optional[Dict[str, Any]] = None
    source_dataset: str
    source_variables: List[str]
    status: str
    limitations: Optional[List[str]] = None

class EvidenceCase(BaseModel):
    id: str
    observation: Observation
    model_match: MatchingMetadata
    observation_profile: Profile1D
    model_profile: Profile1D
    residual: Profile1D
    statistics: ProfileStatistics
    provenance: Provenance
    features: Optional[List[DerivedFeature]] = None
    created_at: str
    status: str

class CurrentVector(BaseModel):
    lat: float
    lon: float
    depth: float
    time: str
    u: float
    v: float

class SarTrajectoryPoint(BaseModel):
    timestamp: str
    lat: float
    lon: float
    velocity: float
    direction: float

class SarMetadata(BaseModel):
    dataset_id: str
    u_variable: str
    v_variable: str
    integration_method: str
    timestep: str
    duration: str
    starting_position: State
    known_limitations: str
    evidence_case_id: Optional[str] = None

class SarResponse(BaseModel):
    trajectory: List[SarTrajectoryPoint]
    metadata: SarMetadata

class ApiError(BaseModel):
    error_code: str
    message: str
    details: Optional[Dict[str, Any]] = None

class ScientificSnapshot(BaseModel):
    id: str
    created_at: str
    application_mode: str
    observation: Optional[Observation] = None
    evidence_case: Optional[EvidenceCase] = None
    analytical_cursor: Optional[Dict[str, Any]] = None
    selected_state: Optional[State] = None
    derived_features: Optional[List[DerivedFeature]] = None
    response_scenario: Optional[SarResponse] = None
    provenance: Optional[Provenance] = None
    version: str = "1.0"
