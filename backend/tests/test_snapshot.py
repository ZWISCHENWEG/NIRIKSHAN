import pytest
import datetime
from models.data_models import (
    ScientificSnapshot, 
    Observation, 
    EvidenceCase, 
    Profile1D, 
    ProfileStatistics, 
    MatchingMetadata, 
    Provenance,
    SarResponse,
    SarTrajectoryPoint,
    SarMetadata,
    State
)

def test_snapshot_creation_partial_state():
    """Test creating a ScientificSnapshot in Survey Mode with minimal data."""
    snapshot = ScientificSnapshot(
        id="snap-123",
        created_at=datetime.datetime.utcnow().isoformat() + "Z",
        application_mode="SURVEY_MODE"
    )
    
    assert snapshot.id == "snap-123"
    assert snapshot.application_mode == "SURVEY_MODE"
    assert snapshot.observation is None
    assert snapshot.evidence_case is None
    assert snapshot.response_scenario is None
    
    serialized = snapshot.model_dump()
    assert serialized["id"] == "snap-123"
    assert "observation" in serialized
    assert serialized["observation"] is None

def test_snapshot_creation_full_state():
    """Test creating a ScientificSnapshot with an EvidenceCase and ResponseScenario."""
    obs = Observation(
        id="float-456",
        type="argo",
        lat=15.0,
        lon=85.0,
        time="2024-01-01T12:00:00Z"
    )
    
    provenance = Provenance(
        observation_dataset="Argo",
        model_dataset="GLORYS",
        model_variables=["thetao"],
        observation_variables=["temp"],
        observation_dataset_id="argo_core",
        model_dataset_id="glorys12v1",
        matching_method="nearest_neighbor",
        residual_definition="obs-model",
        profile_alignment_method="nearest_depth",
        dataset_source="Copernicus",
        calculation_method="Euler forward"
    )
    
    evidence = EvidenceCase(
        id="ev-789",
        observation=obs,
        model_match=MatchingMetadata(method="nearest"),
        observation_profile=Profile1D(depths=[10, 20], values=[28.5, 28.0]),
        model_profile=Profile1D(depths=[10, 20], values=[28.4, 28.1]),
        residual=Profile1D(depths=[10, 20], values=[0.1, -0.1]),
        statistics=ProfileStatistics(valid_count=2),
        provenance=provenance,
        created_at="2024-01-01T12:00:00Z",
        status="Complete"
    )
    
    response = SarResponse(
        trajectory=[
            SarTrajectoryPoint(timestamp="2024-01-01T12:00:00Z", lat=15.0, lon=85.0, velocity=0.5, direction=90.0)
        ],
        metadata=SarMetadata(
            dataset_id="glorys12v1",
            u_variable="uo",
            v_variable="vo",
            integration_method="euler",
            timestep="1h",
            duration="24h",
            starting_position=State(lat=15.0, lon=85.0),
            known_limitations="Surface drift only",
            evidence_case_id="ev-789"
        )
    )
    
    snapshot = ScientificSnapshot(
        id="snap-full",
        created_at="2024-01-01T12:00:00Z",
        application_mode="SAR_MODE",
        observation=obs,
        evidence_case=evidence,
        response_scenario=response,
        provenance=provenance
    )
    
    assert snapshot.application_mode == "SAR_MODE"
    assert snapshot.evidence_case is not None
    assert snapshot.response_scenario is not None
    
    # Test JSON serialization covers the full provenance tree
    serialized = snapshot.model_dump(mode='json')
    assert serialized["evidence_case"]["provenance"]["dataset_source"] == "Copernicus"
    assert serialized["response_scenario"]["metadata"]["evidence_case_id"] == "ev-789"
    assert serialized["provenance"]["calculation_method"] == "Euler forward"
