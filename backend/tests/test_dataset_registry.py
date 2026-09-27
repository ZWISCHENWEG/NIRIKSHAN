import pytest
import os
import numpy as np

from services.dataset_registry import DATASETS, validate_glorys, validate_argo, VARIABLE_MAPPING
from services.netcdf_adapter import NetCDFAdapter
from models.data_models import ProfileData

def test_registry_contents():
    # Test that datasets are registered
    assert "glorys12v1" in DATASETS
    assert "argo" in DATASETS
    
    # Test variables mappings
    assert VARIABLE_MAPPING["temperature"]["glorys"] == "thetao"
    assert VARIABLE_MAPPING["temperature"]["argo"] == "temp"
    
def test_validation_logic():
    # Test GLORYS validation against the actual dataset if it exists
    path = DATASETS["glorys12v1"]["path"]
    if os.path.exists(path):
        errors = validate_glorys(path)
        assert len(errors) == 0, f"GLORYS validation failed: {errors}"
        
    # Test Argo validation against the actual dataset if it exists
    argo_path = DATASETS["argo"]["path"]
    if os.path.exists(argo_path):
        errors = validate_argo(argo_path)
        assert len(errors) == 0, f"Argo validation failed: {errors}"

def test_missing_value_handling_in_profile():
    # Test that NetCDFAdapter explicit missing-value handling works
    adapter = NetCDFAdapter()
    
    # If the real datasets exist, try pulling a profile and check for NaNs
    if adapter.glorys_ds is not None and adapter.argo_ds is not None:
        # Use a coordinate known to be inside the Bay of Bengal
        profile = adapter.get_profile(lat=15.0, lon=85.0)
        
        # Verify it returns our new ProfileData schema successfully
        assert isinstance(profile, ProfileData)
        
        # Ensure no NaNs in output
        assert not any(v is not None and np.isnan(v) for v in profile.modelValues)
        assert not any(np.isnan(v) for v in profile.modelDepths)
        assert not any(np.isnan(v) for v in profile.observationValues)
        assert not any(np.isnan(v) for v in profile.observationDepths)
        
        # Ensure they are lists of floats
        if len(profile.observationValues) > 0:
            assert isinstance(profile.observationValues[0], float)
