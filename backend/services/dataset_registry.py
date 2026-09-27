import os
import xarray as xr
from typing import Dict, Any, List
import numpy as np

DEFAULT_SCIENTIFIC_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "scientific")
SCIENTIFIC_DIR = os.environ.get("OCEAN_DATA_DIR", DEFAULT_SCIENTIFIC_DIR)

# Coordinate Normalization Documented Convention:
# latitude: degrees north
# longitude: degrees east
# depth: positive downward (meters or decibars)
# time: ISO/UTC-compatible datetime representation

# Variable Registry
VARIABLE_MAPPING = {
    "temperature": {
        "glorys": "thetao",
        "argo": "temp"
    },
    "eastward_current": {
        "glorys": "uo"
    },
    "northward_current": {
        "glorys": "vo"
    }
}

DATASETS = {
    "glorys12v1": {
        "id": "glorys12v1",
        "name": "GLORYS12V1 Bay of Bengal January 2024",
        "source": "Copernicus Marine Service",
        "path": os.path.join(SCIENTIFIC_DIR, "glorys12v1_bob_202401.nc"),
        "type": "model",
        "variables": ["thetao", "uo", "vo"],
        "temporal_extent": {"start": "2024-01-01", "end": "2024-01-10"},
        "spatial_extent": {"min_lat": 5.0, "max_lat": 25.0, "min_lon": 75.0, "max_lon": 100.0},
        "vertical_extent": "0.49m to 5727m",
        "units": {"thetao": "degrees_C", "uo": "m/s", "vo": "m/s"},
        "format": "NetCDF",
        "status": "Available"
    },
    "argo": {
        "id": "argo",
        "name": "Argo Bay of Bengal",
        "source": "Argo GDAC",
        "path": os.path.join(SCIENTIFIC_DIR, "argo_bob.nc"),
        "type": "observation",
        "variables": ["temp", "pres"],
        "temporal_extent": {"start": "2024-01-01", "end": "2024-01-10"},
        "spatial_extent": {"min_lat": 5.0, "max_lat": 25.0, "min_lon": 75.0, "max_lon": 100.0},
        "vertical_extent": "Profiles up to ~2000m",
        "units": {"temp": "degree_Celsius", "pres": "decibar"},
        "format": "NetCDF (tabledap)",
        "status": "Available"
    }
}

def validate_glorys(path: str) -> List[str]:
    errors = []
    if not os.path.exists(path):
        return ["File does not exist"]
    try:
        ds = xr.open_dataset(path)
        
        # Check coordinates
        coords = list(ds.coords.keys())
        for req in ['time', 'latitude', 'longitude', 'depth']:
            if req not in coords:
                errors.append(f"Missing coordinate: {req}")
        
        # Check variables
        vars_list = list(ds.data_vars.keys())
        for req in ['thetao', 'uo', 'vo']:
            if req not in vars_list:
                errors.append(f"Missing variable: {req}")
                
        # Basic range checks if coords exist
        if 'latitude' in coords:
            lat = ds['latitude'].values
            if lat.min() < -90 or lat.max() > 90:
                errors.append("Latitude out of valid range")
        if 'longitude' in coords:
            lon = ds['longitude'].values
            if lon.min() < -180 or lon.max() > 180:
                errors.append("Longitude out of valid range")
        if 'depth' in coords:
            depth = ds['depth'].values
            if depth.min() < 0:
                errors.append("Depth must be positive downward")
                
        ds.close()
    except Exception as e:
        errors.append(f"Failed to open/read dataset: {str(e)}")
    return errors

def validate_argo(path: str) -> List[str]:
    errors = []
    if not os.path.exists(path):
        return ["File does not exist"]
    try:
        ds = xr.open_dataset(path)
        
        # Check variables in flat table format
        vars_list = list(ds.data_vars.keys()) + list(ds.coords.keys())
        for req in ['time', 'latitude', 'longitude', 'temp', 'pres']:
            if req not in vars_list:
                errors.append(f"Missing variable/coordinate: {req}")
                
        if 'latitude' in vars_list:
            lat = ds['latitude'].values
            lat = lat[~np.isnan(lat)]
            if len(lat) > 0 and (lat.min() < -90 or lat.max() > 90):
                errors.append("Latitude out of valid range")
                
        if 'longitude' in vars_list:
            lon = ds['longitude'].values
            lon = lon[~np.isnan(lon)]
            if len(lon) > 0 and (lon.min() < -180 or lon.max() > 180):
                errors.append("Longitude out of valid range")
                
        ds.close()
    except Exception as e:
        errors.append(f"Failed to open/read dataset: {str(e)}")
    return errors
