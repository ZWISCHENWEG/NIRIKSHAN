import xarray as xr
import sys
import os

try:
    ds = xr.open_dataset('../backend/data/scientific/argo_bob.nc')
    print("=== ARGO DATASET INFO ===")
    print(ds.info())
    print("\nDimensions:", ds.dims)
    print("Variables:", list(ds.data_vars))
    print("\nBounds:")
    print("Lat:", ds.latitude.min().item(), "to", ds.latitude.max().item())
    print("Lon:", ds.longitude.min().item(), "to", ds.longitude.max().item())
    print("Time:", ds.time.min().item(), "to", ds.time.max().item())
    print("Platform numbers:", len(set(ds.platform_number.values)))
    print("Total rows:", len(ds.row))
    
    # Check valid values
    print("Valid Temp values:", ds.temp.count().item())
    print("Valid Pres values:", ds.pres.count().item())

except Exception as e:
    print("Error reading Argo netcdf:", e)
