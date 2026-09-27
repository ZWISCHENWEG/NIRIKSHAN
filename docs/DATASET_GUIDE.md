# SCIENTIFIC DATASET GUIDE

NIRIKSHAN operates using real-world oceanographic datasets for the SIH prototype.

## 1. GLORYS12V1 (Global Ocean Physics Reanalysis)

- **Role:** Provides the 3D computational model field.
- **Source Identity:** Copernicus Marine Service (CMEMS).
- **File:** `backend/data/scientific/glorys12v1_bob_202401.nc`
- **Variables:** Temperature (T), Salinity (S), Zonal Velocity (U), Meridional Velocity (V).
- **Spatial Extent:** Bay of Bengal (Subset).
- **Temporal Extent:** January 2024 (Snapshot).
- **Depth Representation:** Multi-level depth coordinate system.
- **Format:** NetCDF4.
- **How NIRIKSHAN uses it:** Interpolates 3D current fields for SAR drift, and serves as the baseline model for profile comparisons.
- **Provenance Identifier:** Hardcoded internally to trace data origins in evidence snapshots.
- **Limitations:** Currently limited to a spatial/temporal subset for performance and storage limits.

## 2. Argo Float Observations

- **Role:** Provides real in-situ ground-truth observations.
- **Source Identity:** Argo Data Management Team (ADMT).
- **File:** `backend/data/scientific/argo_bob.nc`
- **Variables:** Temperature (T), Salinity (S), Pressure/Depth, Coordinates.
- **Spatial Extent:** Bay of Bengal.
- **Temporal Extent:** Concurrent with GLORYS data.
- **Depth Representation:** Vertical pressure profiles.
- **Format:** NetCDF4.
- **How NIRIKSHAN uses it:** Displayed as discrete points in 3D space. Selected floats generate a comparative profile against the GLORYS model.
- **Provenance Identifier:** Linked to specific Float IDs.
- **Limitations:** Data is highly sparse spatially. Profiles do not have corresponding velocity measurements.
