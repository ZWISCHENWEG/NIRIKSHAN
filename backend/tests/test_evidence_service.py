import pytest
from services.netcdf_adapter import NetCDFAdapter
from services.evidence_service import EvidenceService
from models.data_models import EvidenceCase

@pytest.fixture
def evidence_service():
    adapter = NetCDFAdapter()
    return EvidenceService(adapter)

def test_evidence_case_creation(evidence_service):
    # Only run if real datasets are loaded
    adapter = evidence_service.data_adapter
    if not adapter.argo_ds or not adapter.glorys_ds:
        pytest.skip("Real datasets not available for integration test.")
        
    obs_list = adapter.get_observations()
    assert len(obs_list) > 0
    obs_id = obs_list[0].id
    
    evidence = evidence_service.get_evidence_case(obs_id)
    
    assert evidence is not None
    assert isinstance(evidence, EvidenceCase)
    
    # Check observation lookup
    assert evidence.observation.id == obs_id
    
    # Check model matching integration
    assert evidence.model_match.method == "nearest-neighbor"
    assert evidence.model_match.selected_lat is not None
    
    # Check profile retrieval
    assert len(evidence.observation_profile.depths) > 0
    assert len(evidence.model_profile.depths) > 0
    
    # Check residual generation
    assert len(evidence.residual.depths) > 0
    assert len(evidence.residual.values) == len(evidence.residual.depths)
    
    # Check statistics propagation
    assert evidence.statistics.valid_count == len(evidence.residual.values)
    assert isinstance(evidence.statistics.bias, float)
    
    # Check provenance generation
    assert evidence.provenance.observation_dataset == "Argo floats"
    assert evidence.provenance.matching_method == "nearest_neighbor"
    assert "observation - model" in evidence.provenance.residual_definition

def test_evidence_invalid_id(evidence_service):
    evidence = evidence_service.get_evidence_case("invalid_id")
    assert evidence is None
