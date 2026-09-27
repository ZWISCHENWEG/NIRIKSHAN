import xarray as xr
import os

glorys_path = "backend/data/scientific/glorys12v1_bob_202401.nc"
argo_path = "backend/data/scientific/argo_bob.nc"

if os.path.exists(glorys_path):
    print("=== GLORYS ===")
    ds = xr.open_dataset(glorys_path)
    print(ds)
    print("Min/Max thetao:", ds.thetao.min().values, ds.thetao.max().values)
    print("Min/Max uo:", ds.uo.min().values, ds.uo.max().values)
    print("Min/Max vo:", ds.vo.min().values, ds.vo.max().values)
    print("NaN count thetao:", ds.thetao.isnull().sum().values)
    print("==============\n")
else:
    print(f"File not found: {glorys_path}")

if os.path.exists(argo_path):
    print("=== ARGO ===")
    ds_argo = xr.open_dataset(argo_path)
    print(ds_argo)
    print("==============")
