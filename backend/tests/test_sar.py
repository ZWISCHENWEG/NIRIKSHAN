import math
import pytest
from datetime import datetime, timedelta
from unittest.mock import MagicMock, patch

from services.netcdf_adapter import NetCDFAdapter
from models.data_models import SarResponse, SarTrajectoryPoint, State

@pytest.fixture
def adapter():
    with patch("xarray.open_dataset"):
        # We don't actually want to read the real files, just test the method.
        # However, to be deterministic and test logic properly, maybe we can mock glorys_ds.
        adapter = NetCDFAdapter()
        
        # Create a mock xarray dataset
        mock_ds = MagicMock()
        import numpy as np
        mock_ds.time.values = np.array([
            np.datetime64("2023-01-01T00:00:00"),
            np.datetime64("2023-01-01T01:00:00"),
            np.datetime64("2023-01-01T02:00:00")
        ])
        
        def mock_sel(*args, **kwargs):
            mock_point = MagicMock()
            mock_point.uo.values = 1.0 # 1 m/s east
            mock_point.vo.values = 0.0 # 0 m/s north
            return mock_point
            
        mock_ds.sel.side_effect = mock_sel
        
        adapter.glorys_ds = mock_ds
        return adapter

def test_sar_drift_scenario_creation(adapter):
    resp = adapter.get_sar_drift(lat=0.0, lon=0.0, time="2023-01-01T00:00:00Z", hours=2)
    
    assert isinstance(resp, SarResponse)
    assert len(resp.trajectory) == 2
    
def test_sar_drift_starting_position(adapter):
    resp = adapter.get_sar_drift(lat=10.0, lon=20.0, time="2023-01-01T00:00:00Z", hours=1)
    
    # 1 m/s east for 1 hour = 3600 meters. 
    # At 10 degrees lat, dlon = 3600 / (111000 * cos(10)) ~ 0.0329
    # dlat = 0
    assert resp.metadata.starting_position.lat == 10.0
    assert resp.metadata.starting_position.lon == 20.0
    
def test_sar_drift_timestep_and_duration(adapter):
    resp = adapter.get_sar_drift(lat=0.0, lon=0.0, time="2023-01-01T00:00:00Z", hours=5)
    
    assert resp.metadata.timestep == "1h"
    assert resp.metadata.duration == "5h"
    assert len(resp.trajectory) == 5

def test_sar_drift_reproducibility(adapter):
    # Same inputs should produce exactly the same trajectory
    resp1 = adapter.get_sar_drift(lat=0.0, lon=0.0, time="2023-01-01T00:00:00Z", hours=2)
    resp2 = adapter.get_sar_drift(lat=0.0, lon=0.0, time="2023-01-01T00:00:00Z", hours=2)
    
    assert resp1.trajectory == resp2.trajectory
    
def test_sar_drift_geographic_displacement(adapter):
    resp = adapter.get_sar_drift(lat=0.0, lon=0.0, time="2023-01-01T00:00:00Z", hours=1)
    
    # 1 m/s east for 1 hr = 3600 m
    # at equator, 1 degree = 111000 m. dlon = 3600 / 111000 = 0.0324324
    
    pt = resp.trajectory[0]
    assert math.isclose(pt.lat, 0.0)
    assert math.isclose(pt.lon, 3600 / 111000.0)
    assert pt.velocity == 1.0
    assert pt.direction == 0.0

def test_sar_drift_dataset_provenance(adapter):
    resp = adapter.get_sar_drift(lat=0.0, lon=0.0, time="2023-01-01T00:00:00Z", hours=1)
    
    assert resp.metadata.dataset_id == "glorys12v1"
    assert resp.metadata.u_variable == "uo"
    assert resp.metadata.v_variable == "vo"

def test_sar_drift_limitation_propagation(adapter):
    resp = adapter.get_sar_drift(lat=0.0, lon=0.0, time="2023-01-01T00:00:00Z", hours=1)
    
    assert "no windage" in resp.metadata.known_limitations.lower()
