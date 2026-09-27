# API REFERENCE

This document outlines the JSON REST APIs exposed by the FastAPI backend.

## `GET /health`
- **Purpose:** Fast liveness check.
- **Parameters:** None.
- **Response Structure:** `{"status": "ok"}`
- **Scientific Meaning:** None.
- **Error Behavior:** 500 if the process is dead.

## `GET /ready`
- **Purpose:** Readiness check for deployment orchestrators.
- **Parameters:** None.
- **Response Structure:** `{"status": "ready", "mode": "netcdf", "datasets": [...]}`
- **Scientific Meaning:** Verifies that the NetCDF data adapter has successfully loaded the required GLORYS and Argo files into memory.
- **Error Behavior:** 503 if datasets are unavailable or corrupted.

## `GET /api/observations`
- **Purpose:** Fetches Argo float locations.
- **Parameters:** `min_lat`, `max_lat`, `min_lon`, `max_lon`, `start_time` (optional), `end_time` (optional).
- **Response Structure:** Array of observation points (id, lat, lon, time).
- **Scientific Meaning:** Identifies all available in-situ observations within a bounding box.
- **Error Behavior:** 400 for invalid coordinates.

## `GET /api/model-field`
- **Purpose:** Retrieves surface-level model data for heatmap visualization.
- **Parameters:** `lat`, `lon`, `variable` (e.g., 'temperature').
- **Response Structure:** 2D grid/array of values.
- **Scientific Meaning:** The synoptic view of the GLORYS model output.
- **Error Behavior:** 404 if coordinates are outside the dataset boundary.

## `GET /api/profile`
- **Purpose:** Extracts a vertical profile at a specific coordinate.
- **Parameters:** `lat`, `lon`, `time` (optional).
- **Response Structure:** Arrays of `depths`, `temperature`, `salinity`, `u`, `v`.
- **Scientific Meaning:** Represents the water column at a single vertical slice in the model.
- **Error Behavior:** 400 for out-of-bounds.
- **Important Limitations:** Nearest-neighbour extraction.

## `GET /api/evidence/{observation_id}`
- **Purpose:** Generates a matched evidence comparison between an Argo float and the model.
- **Parameters:** Path parameter `observation_id`.
- **Response Structure:** Includes the observation profile, the matched model profile, residual calculations, derived metrics (thermocline, MLD), and provenance metadata.
- **Scientific Meaning:** The core validation payload. Computes the mathematical difference (residual) between reality and the model.
- **Error Behavior:** 404 if observation ID is invalid.

## `GET /api/sar/drift`
- **Purpose:** Simulates a Search and Rescue drift trajectory.
- **Parameters:** `start_lat`, `start_lon`, `duration_hours`.
- **Response Structure:** Array of trajectory points.
- **Scientific Meaning:** Performs a passive Euler integration of the computational current field over time.
- **Error Behavior:** 400 for invalid duration.
- **Important Limitations:** No windage, leeway, or Stokes drift. Not operational for real SAR.
