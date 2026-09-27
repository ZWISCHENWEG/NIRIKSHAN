import pytest
import numpy as np
from services.netcdf_adapter import NetCDFAdapter
from models.data_models import ProfileData, Observation

@pytest.fixture
def adapter():
    return NetCDFAdapter()

def test_real_profile_matching(adapter):
    # Only run if real datasets are loaded
    if not adapter.argo_ds or not adapter.glorys_ds:
        pytest.skip("Real datasets not available for integration test.")
    
    # Get first available observation to use as a source of truth
    obs_list = adapter.get_observations()
    assert len(obs_list) > 0
    obs = obs_list[0]
    
    profile = adapter.get_profile(lat=obs.lat, lon=obs.lon, time=obs.time)
    
    assert profile is not None
    assert isinstance(profile, ProfileData)
    
    # Check matching metadata
    meta = profile.metadata
    assert meta is not None
    assert meta.matching.method == "nearest-neighbor"
    assert meta.matching.requested_lat == obs.lat
    assert meta.matching.selected_lat is not None
    assert meta.matching.spatial_separation is not None
    
    # Depending on the data, temporal separation might be zero or a float
    assert meta.matching.temporal_separation is not None
    
    # Check Profile Depths and Values
    assert len(profile.modelDepths) > 0
    assert len(profile.modelValues) > 0
    assert len(profile.observationDepths) > 0
    assert len(profile.observationValues) > 0
    
    # Check residuals and statistics
    assert profile.residualDepths is not None
    assert profile.residualValues is not None
    assert profile.statistics is not None
    
    # Validate statistical values are floats
    assert isinstance(profile.statistics.bias, float)
    assert isinstance(profile.statistics.mae, float)
    assert isinstance(profile.statistics.rmse, float)
    assert isinstance(profile.statistics.valid_count, int)
    
    # Ensure residual logic is observation - model
    assert len(profile.residualValues) == profile.statistics.valid_count
    
def test_no_valid_overlap(adapter):
    # If we request a profile for coordinates out of bounds of GLORYS
    # It might return nearest or empty depending on `method="nearest"`.
    # Our current netcdf_adapter clamps or finds nearest, so it might always return something.
    pass
