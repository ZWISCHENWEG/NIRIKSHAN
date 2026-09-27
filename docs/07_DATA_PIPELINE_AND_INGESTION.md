# `07_DATA_PIPELINE_AND_INGESTION.md`

```md id="3w5k2p"
# NIRIKSHAN — Data Pipeline & Ingestion

## Document Status

- Product: NIRIKSHAN
- Document: Data Pipeline & Ingestion
- Version: 1.0
- Status: Implementation Specification
- Audience:
  - AI coding agents
  - Backend developers
  - Scientific-data engineers
  - Frontend developers
- Depends on:
  - `01_PRD.md`
  - `02_ARCHITECTURE.md`
  - `03_SCIENTIFIC_ENGINE.md`
  - `04_OBSERVATION_EVIDENCE.md`
  - `05_UI_UX_SYSTEM.md`
  - `06_API_CONTRACTS.md`

---

# 1. Purpose

This document defines how NIRIKSHAN obtains, validates, normalizes, subsets, caches, and serves scientific ocean data.

The pipeline is responsible for transforming external scientific datasets into reliable domain objects that can be consumed by the Scientific Engine and API.

The core pipeline is:

```text
SOURCE DATA
    ↓
INGESTION
    ↓
FILE / DATASET VALIDATION
    ↓
COORDINATE NORMALIZATION
    ↓
VARIABLE NORMALIZATION
    ↓
TIME NORMALIZATION
    ↓
QUALITY CONTROL
    ↓
DATASET INDEX / METADATA
    ↓
SCIENTIFIC ADAPTER
    ↓
SCIENTIFIC ENGINE
    ↓
API
    ↓
BROWSER
```

The pipeline must preserve scientific meaning at every stage.

---

# 2. Current Scientific Data

The current prototype uses two real scientific sources.

## 2.1 Ocean Model

GLORYS12V1 ocean reanalysis.

Current local file:

```text
backend/data/scientific/glorys12v1_bob_202401.nc
```

Current dataset characteristics:

```text
Time:
2024-01-01 → 2024-01-10

Latitude:
5°N → 25°N

Longitude:
75°E → 100°E

Depth:
50 model levels

Variables:
thetao
uo
vo
```

The file is a spatial/temporal subset intended for the current Bay of Bengal prototype.

---

# 3. Current Observation Data

The current prototype uses Argo observations.

Current local file:

```text
backend/data/scientific/argo_bob.nc
```

The current prototype contains:

```text
2,740 individual profile measurements
19 unique floats
```

The data includes profile measurements such as:

```text
temperature
pressure
salinity where available
quality-control information where available
```

The exact available variables must always be discovered from the actual file.

Do not assume that every observation contains every variable.

---

# 4. Source-of-Truth Principle

The scientific files are the source of truth.

Do not create a second manually maintained representation of:

- temperatures,
- currents,
- coordinates,
- timestamps,
- depths,
- observation values.

Derived representations may be cached for performance.

They must remain reproducible from the original scientific source.

---

# 5. Data Directory

Recommended structure:

```text id="z0o7m6"
backend/
└── data/
    └── scientific/
        ├── glorys12v1_bob_202401.nc
        └── argo_bob.nc
```

Future:

```text id="w7z8f3"
backend/
└── data/
    ├── scientific/
    │   ├── model/
    │   ├── observations/
    │   └── derived/
    └── metadata/
```

Do not create unnecessary directory complexity for the MVP.

---

# 6. Git Rules

Large scientific files must not be committed to Git unless explicitly required.

The repository should ignore:

```text
*.nc
*.nc4
*.cdf
```

as already established in the current project.

Python cache directories must also remain ignored:

```text
__pycache__/
*.pyc
```

---

# 7. Why Scientific Files Should Not Be Git-Tracked

NetCDF datasets can become large.

The Git repository should contain:

- code,
- configuration templates,
- schemas,
- documentation,
- tests,
- metadata,
- reproducible ingestion instructions.

It should not become a scientific data archive.

---

# 8. Data Acquisition

External datasets should be acquired separately from application startup.

Recommended workflow:

```text
Download
    ↓
Validate
    ↓
Place in data directory
    ↓
Run ingestion validation
    ↓
Start application
```

Do not make application startup depend on downloading hundreds of MB/GB of data.

---

# 9. Copernicus Marine Data

The GLORYS12V1 data originates from Copernicus Marine.

Credentials must never be:

- committed,
- placed in frontend code,
- written into `.env` files that are committed,
- returned through an API,
- printed in logs.

Use environment/configuration mechanisms outside the repository.

---

# 10. Argo Data

Argo observation data should be treated as scientific source data.

The ingestion system must preserve:

- platform identity,
- observation time,
- latitude,
- longitude,
- pressure/depth,
- measured variables,
- QC information where available.

Do not reduce an Argo profile to only a list of temperature values.

---

# 11. Ingestion Modes

NIRIKSHAN should support three conceptual modes.

## 11.1 Local Dataset

Current MVP.

```text
Existing .nc file
↓
Data Adapter
```

---

## 11.2 Prepared Dataset

Future.

```text
Downloaded source
↓
Validation
↓
Preprocessing
↓
Application dataset
```

---

## 11.3 Remote Dataset

Future.

Potential sources:

- OPeNDAP,
- WMS/WCS,
- remote NetCDF,
- Copernicus APIs.

The Scientific Engine should not care which ingestion mode produced the data.

---

# 12. Dataset Registration

Every dataset should have a metadata record.

Recommended:

```json id="p0mxkg"
{
  "id": "glorys12v1_bob_202401",
  "name": "GLORYS12V1",
  "type": "ocean_model",
  "provider": "Copernicus Marine",
  "file": "glorys12v1_bob_202401.nc"
}
```

Observation:

```json id="6xy6hp"
{
  "id": "argo_bob",
  "name": "Argo Bay of Bengal",
  "type": "observation",
  "provider": "Argo",
  "file": "argo_bob.nc"
}
```

---

# 13. Dataset Manifest

A manifest can describe available local datasets.

Example:

```json id="q7i2dg"
{
  "datasets": [
    {
      "id": "glorys12v1_bob_202401",
      "kind": "model",
      "path": "scientific/glorys12v1_bob_202401.nc"
    },
    {
      "id": "argo_bob",
      "kind": "observation",
      "path": "scientific/argo_bob.nc"
    }
  ]
}
```

The manifest is metadata.

It is not a replacement for the NetCDF files.

---

# 14. File Discovery

The backend should resolve scientific files from configuration/manifest rather than scattering hard-coded paths throughout the codebase.

Bad:

```python
dataset = xr.open_dataset(
    "/Users/sutharprince/Downloads/..."
)
```

Good:

```python
dataset_path = dataset_registry.resolve("glorys12v1_bob_202401")
```

---

# 15. Data Adapter Boundary

All scientific files must be accessed through the Data Adapter layer.

Preferred:

```text
API
 ↓
Scientific Service
 ↓
Data Adapter
 ↓
xarray
 ↓
NetCDF
```

The API must never directly call:

```python
xr.open_dataset(...)
```

---

# 16. Model Adapter

The model adapter should expose domain-level operations.

Example:

```python
get_field(...)
get_profile(...)
get_current(...)
get_metadata(...)
get_coordinates(...)
```

It should hide:

```text
thetao
uo
vo
xarray Dataset
NetCDF dimensions
```

from higher layers where possible.

---

# 17. Observation Adapter

The observation adapter should expose:

```python
list_observations(...)
get_observation(...)
get_profile(...)
get_metadata(...)
```

It should hide raw Argo file structure.

---

# 18. Coordinate Discovery

Never assume coordinate names.

The adapter should inspect the dataset.

Possible names:

```text
latitude
lat

longitude
lon

depth
deptht
pres

time
```

The normalized domain model should expose:

```text
latitude
longitude
depth
time
```

---

# 19. Coordinate Normalization

All internal scientific calculations should operate on normalized coordinate concepts:

```text
latitude
longitude
depth
time
```

The original source names may be retained in metadata.

---

# 20. Latitude

Normalize latitude to:

```text
degrees_north
```

Expected range:

```text
-90 → +90
```

Reject invalid values.

---

# 21. Longitude

Normalize longitude consistently.

The application should use one convention throughout the Scientific Engine.

Recommended:

```text
-180 → +180
```

or:

```text
0 → 360
```

The important requirement is consistency.

Do not allow different conventions in different modules.

If the source uses a different convention, normalize at the adapter boundary.

---

# 22. Depth

Internal depth should represent:

```text
positive downward
```

Example:

```text
surface = 0m
100m = 100
500m = 500
```

If source data uses another convention, normalize before scientific calculations.

---

# 23. Pressure vs Depth

Argo data may naturally contain pressure.

The system must distinguish:

```text
pressure
```

from:

```text
depth
```

Do not silently treat pressure as exact depth.

If a scientific conversion is needed, it must be explicit and implemented in the Scientific Engine.

---

# 24. Time Normalization

All internal timestamps should use timezone-aware UTC.

Recommended:

```text
2024-01-05T06:42:00Z
```

Do not compare naive and timezone-aware timestamps.

---

# 25. Time Coordinate Discovery

The adapter should inspect:

- coordinate values,
- units,
- calendar metadata,
- timezone assumptions.

Do not manually parse NetCDF time values using string manipulation if xarray can correctly decode them.

---

# 26. Variable Discovery

Model adapter should inspect available variables.

Current expected variables:

```text
thetao
uo
vo
```

Normalize them to:

```text
temperature
eastward_current
northward_current
```

---

# 27. Variable Metadata

Every variable should retain:

```text
source_name
normalized_name
unit
long_name
dimensions
missing_value
```

Example:

```json id="j0n1cy"
{
  "source_name": "thetao",
  "normalized_name": "temperature",
  "unit": "degC",
  "dimensions": [
    "time",
    "depth",
    "latitude",
    "longitude"
  ]
}
```

---

# 28. Dimension Validation

Before a dataset is accepted, validate that required dimensions exist.

For the current model:

```text
time
depth
latitude
longitude
```

Required scientific variables:

```text
thetao
uo
vo
```

If a required variable is missing, fail validation clearly.

---

# 29. Model Dataset Validation

On ingestion, validate:

```text
✓ file exists
✓ file opens
✓ time dimension exists
✓ depth dimension exists
✓ latitude dimension exists
✓ longitude dimension exists
✓ thetao exists
✓ uo exists
✓ vo exists
✓ coordinate ranges are valid
✓ values are numerically usable
```

---

# 30. Observation Dataset Validation

Validate:

```text
✓ file exists
✓ file opens
✓ platform identity exists
✓ observation time exists
✓ latitude exists
✓ longitude exists
✓ profile dimension exists
✓ pressure/depth exists
✓ required measurement variable exists
```

---

# 31. Missing Values

Scientific datasets may encode missing data as:

```text
NaN
_fill_value
missing_value
```

The adapter should normalize missing values to:

```python
NaN
```

internally where appropriate.

API serialization should convert unavailable numeric values to:

```json
null
```

---

# 32. Missing-Value Rule

Never convert missing scientific values to zero.

Incorrect:

```python
value = np.nan_to_num(value)
```

if it causes scientific missing values to become zero.

Correct behavior:

```text
missing → missing
```

unless an explicit scientific method requires otherwise.

---

# 33. NaN Filtering

Before JSON serialization:

```text
NaN
Infinity
-Infinity
```

must not be emitted as invalid JSON.

Convert them to:

```json
null
```

where appropriate.

---

# 34. Observation QC

Quality-control information must be preserved when available.

Possible representations include:

```text
good
bad
probably_good
unknown
```

The exact values depend on the source dataset.

Do not invent a new QC meaning without documenting the mapping.

---

# 35. QC Processing

The Scientific Engine determines whether a particular QC state is included in a calculation.

The Data Adapter should primarily:

1. read QC,
2. normalize its representation,
3. preserve it.

Do not permanently delete raw observations during ingestion unless explicitly required.

---

# 36. Profile Preservation

A profile should retain its vertical structure.

Example:

```text
depth
temperature
salinity
pressure
qc
```

must remain aligned.

Do not independently sort variables.

---

# 37. Model Vertical Coordinates

The current GLORYS12V1 subset contains:

```text
50 vertical levels
```

The application should read actual depth coordinates from the dataset.

Never assume:

```text
0
10
20
30
...
```

or any fixed depth list.

---

# 38. Model Spatial Grid

The current model subset covers:

```text
Latitude:
5–25°N

Longitude:
75–100°E
```

The adapter should derive the actual coordinate arrays from the file.

Do not hard-code grid spacing into the scientific engine.

---

# 39. Model Time Range

The current local subset contains:

```text
2024-01-01
through
2024-01-10
```

The API should derive this dynamically from the dataset.

If the dataset changes, the UI should automatically receive the new valid range.

---

# 40. Dataset Metadata Extraction

At startup or validation time, extract:

```text
dataset ID
time range
depth range
latitude range
longitude range
variables
dimensions
units
source metadata
```

This information can be cached.

---

# 41. Startup Validation

The backend should validate required datasets during startup or readiness checks.

Recommended:

```text
Application starts
      ↓
Dataset registry initialized
      ↓
Required files checked
      ↓
Datasets opened/validated
      ↓
Metadata indexed
      ↓
Application READY
```

If scientific data is unavailable, the API should report degraded readiness clearly.

---

# 42. Do Not Crash Blindly

A missing optional dataset should not necessarily crash the entire application.

Example:

```text
Model:
READY

Argo:
READY

Glider:
NOT CONFIGURED
```

The application can still operate.

---

# 43. Required vs Optional Data

Current MVP:

```text
Required:
GLORYS12V1
Argo
```

Future:

```text
Optional:
Glider
CTD
BGC
additional models
```

---

# 44. Lazy Dataset Loading

Large datasets should not necessarily remain fully materialized in memory.

Use lazy xarray access where practical.

Potential tools:

```text
xarray
Dask
chunking
```

However, do not introduce Dask complexity unless the dataset size requires it.

---

# 45. Current MVP Memory Strategy

For the current relatively constrained subset:

- use xarray,
- open dataset once where appropriate,
- subset aggressively,
- avoid copying entire arrays,
- cache frequently requested metadata,
- close resources correctly.

Optimize based on actual profiling.

---

# 46. Dataset Lifecycle

A dataset should follow:

```text
DISCOVERED
   ↓
VALIDATING
   ↓
READY
```

Possible failure:

```text
INVALID
```

Possible operational state:

```text
UNAVAILABLE
```

---

# 47. Dataset Status Contract

Example:

```json id="3wpx7g"
{
  "id": "glorys12v1_bob_202401",
  "status": "ready",
  "timeRange": {
    "start": "...",
    "end": "..."
  }
}
```

---

# 48. Scientific Data Cache

Caching should happen at the right level.

Useful cache candidates:

```text
dataset metadata
observation index
profile requests
model point requests
model slices
derived feature results
```

Avoid caching entire datasets in serialized JSON.

---

# 49. Cache Key Requirements

A cache key must contain every parameter that changes the result.

Example:

```text
model-profile:
dataset
time
latitude
longitude
variable
depth-range
```

If a parameter changes the result, it belongs in the key.

---

# 50. Cache Invalidation

If a dataset file changes:

```text
dataset fingerprint changes
        ↓
invalidate related cache
```

Do not serve old scientific results from a previous dataset.

---

# 51. Dataset Fingerprinting

A lightweight dataset fingerprint may use:

```text
filename
file size
modified timestamp
```

A stronger fingerprint may use:

```text
SHA-256
```

Use the simplest reliable method appropriate for the deployment.

---

# 52. Model Subsetting

Never send the entire 4D model field to the browser.

For a surface/depth field:

```text
time
depth
latitude range
longitude range
variable
```

should be selected server-side.

---

# 53. Observation Subsetting

Similarly, observation queries should filter by:

```text
time
geographic bounds
platform type
```

before returning markers.

---

# 54. Profile Extraction

For a selected observation:

```text
observation
   ↓
read profile
   ↓
extract valid levels
   ↓
preserve QC
   ↓
match model coordinate/time
   ↓
extract model vertical column
```

---

# 55. Model Matching

Initial method:

```text
nearest time
+
nearest latitude
+
nearest longitude
```

The exact method is defined in:

`03_SCIENTIFIC_ENGINE.md`

The Data Pipeline must not silently replace this with interpolation.

---

# 56. Interpolation

Interpolation is a future capability.

Potential future:

```text
spatial interpolation
temporal interpolation
vertical interpolation
```

Any interpolation method must be:

- explicit,
- documented,
- tested,
- traceable in provenance.

---

# 57. No Silent Scientific Transformation

The pipeline must not silently:

- smooth profiles,
- interpolate gaps,
- extrapolate outside model bounds,
- resample values,
- normalize measurements,
- alter signs,
- alter units.

Any transformation must have a documented reason.

---

# 58. Data Lineage

Every result should be traceable:

```text
Source file
    ↓
Dataset ID
    ↓
Variable
    ↓
Subset
    ↓
Scientific calculation
    ↓
API result
    ↓
UI
```

This is particularly important for Evidence and Provenance.

---

# 59. Provenance Metadata

At minimum retain:

```text
dataset
source
file
variable
time
coordinates
matching method
processing method
```

Do not expose internal absolute filesystem paths to users.

---

# 60. Public Provenance

User-facing provenance should say:

```text
GLORYS12V1
Copernicus Marine
thetao / uo / vo
Nearest model state
Observation − Model
```

rather than:

```text
/Users/sutharprince/Downloads/PVS/...
```

---

# 61. Ingestion CLI

Create a reproducible validation command.

Example:

```bash
python -m backend.scripts.validate_datasets
```

Expected output:

```text
NIRIKSHAN DATA VALIDATION

[OK] GLORYS12V1
[OK] Argo

Model:
  time: 2024-01-01 → 2024-01-10
  lat: 5 → 25
  lon: 75 → 100
  depth levels: 50
  variables: thetao, uo, vo

Argo:
  profiles: available
  observations: available

DATASET VALIDATION PASSED
```

---

# 62. Dataset Inspection Command

Useful development command:

```bash
python -m backend.scripts.inspect_dataset <dataset_id>
```

It should report:

- dimensions,
- variables,
- coordinate ranges,
- units,
- time range,
- missing-value information.

---

# 63. Ingestion Test

Automated tests should verify that the current files remain compatible.

Example:

```python
def test_glorys_dataset_contract():
    dataset = load_model_dataset()

    assert "time" in dataset.dims
    assert "depth" in dataset.dims
    assert "latitude" in dataset.dims
    assert "longitude" in dataset.dims

    assert "thetao" in dataset.data_vars
    assert "uo" in dataset.data_vars
    assert "vo" in dataset.data_vars
```

---

# 64. Observation Contract Test

```python
def test_argo_dataset_contract():
    dataset = load_observation_dataset()

    assert has_coordinate(dataset, "latitude")
    assert has_coordinate(dataset, "longitude")
    assert has_time(dataset)

    assert has_profile_measurement(dataset)
```

The exact implementation should reflect the actual file schema.

---

# 65. Scientific Range Tests

Validate reasonable coordinate ranges.

Example:

```python
assert latitude.min() >= -90
assert latitude.max() <= 90
```

Similarly:

```text
longitude
depth
```

Do not impose arbitrary ocean-temperature limits unless scientifically justified.

---

# 66. Time Monotonicity

Where expected, validate that time coordinates are ordered.

If the source contains non-monotonic observations, normalize or sort only where scientifically safe and documented.

Do not assume all observation data are perfectly ordered.

---

# 67. Depth Monotonicity

Profiles should have a coherent vertical ordering.

If raw source levels are unordered:

1. detect it,
2. sort by physical depth/pressure,
3. preserve variable alignment,
4. document the transformation.

---

# 68. Duplicate Observations

The ingestion pipeline should not blindly remove duplicate observations.

First determine whether duplicates represent:

- repeated measurements,
- multiple records,
- source duplication,
- legitimate repeated observations.

If deduplication is necessary, define the identity key explicitly.

---

# 69. Observation Identity

Potential identity:

```text
platform_id
+
profile/cycle identifier
+
observation time
```

The exact identity must follow source metadata.

Do not use only latitude/longitude as an observation ID.

---

# 70. Dataset Versioning

Scientific datasets may change.

A dataset identity should be distinguishable by:

```text
dataset name
version/product
subset period
```

Example:

```text
glorys12v1_bob_202401
```

This makes evidence reproducible.

---

# 71. Current Prototype Data Contract

The current MVP should assume:

```text
MODEL
GLORYS12V1

OBSERVATIONS
Argo

REGION
Bay of Bengal subset

MODEL VARIABLES
thetao
uo
vo
```

The implementation should remain configurable.

Do not hard-code "Bay of Bengal" into generic scientific classes.

---

# 72. Future Multi-Region Support

Future dataset configuration should support:

```text
region_id
latitude_bounds
longitude_bounds
time_range
```

Example:

```json id="d8e3n7"
{
  "regionId": "bay_of_bengal",
  "bounds": {
    "minLat": 5,
    "maxLat": 25,
    "minLon": 75,
    "maxLon": 100
  }
}
```

This should be configuration, not business logic.

---

# 73. Future Multi-Model Support

The adapter architecture should allow:

```text
GLORYS12V1
HYCOM
CMEMS operational model
other model
```

without changing:

- Evidence UI,
- profile chart,
- residual logic,
- scenario UI.

The model adapter normalizes them into the same domain interface.

---

# 74. Future Observation Sources

The same normalized observation pipeline should support:

```text
Argo
Glider
CTD
BGC
```

Each adapter maps source-specific structures to:

```text
Observation
Profile
QC
Provenance
```

---

# 75. Future Remote Data

Potential architecture:

```text
Remote source
     ↓
Remote adapter
     ↓
Normalized DataAdapter
     ↓
Scientific Engine
```

The rest of NIRIKSHAN should not know whether the data came from a local `.nc` file or a remote service.

---

# 76. OGC / OPeNDAP Compatibility

Future integration may use:

```text
OGC WMS
OGC WCS
OPeNDAP
```

These should be treated as additional access mechanisms.

They do not replace the normalized internal scientific model.

---

# 77. Data Refresh

The MVP uses a fixed local dataset.

Future refresh workflow:

```text
Scheduled acquisition
        ↓
Download
        ↓
Validate
        ↓
Register
        ↓
Index
        ↓
Activate
```

Never activate a newly downloaded dataset before validation succeeds.

---

# 78. Atomic Dataset Activation

Future production ingestion should use:

```text
new dataset
   ↓
validate
   ↓
READY
   ↓
activate
```

not:

```text
download directly over active dataset
```

This prevents partially downloaded files from being served.

---

# 79. Failed Ingestion

If validation fails:

```text
FAILED
```

Keep the previously active dataset available if possible.

Do not destroy a working dataset because a new ingestion failed.

---

# 80. Data Health UI

The frontend may expose:

```text
MODEL
READY

OBSERVATIONS
READY
```

and optionally:

```text
LAST VALIDATED
...
```

The UI should not expose internal ingestion complexity to normal users.

---

# 81. Logging

Logs should capture:

```text
dataset ID
operation
request parameters
duration
success/failure
error code
```

Avoid logging:

- credentials,
- sensitive environment variables,
- unnecessary raw scientific arrays.

---

# 82. Performance Logging

Useful measurements:

```text
dataset open time
subset time
scientific calculation time
serialization time
API response time
```

These help identify bottlenecks before optimizing blindly.

---

# 83. Memory Safety

Never accidentally materialize an entire huge 4D dataset into memory.

Avoid patterns such as:

```python
dataset.load()
```

unless dataset size is known to be safe.

Prefer targeted selection.

---

# 84. Resource Management

Datasets must be closed appropriately when the architecture requires it.

For persistent server-side datasets, use a managed lifecycle.

Do not repeatedly open the same NetCDF file for every API request if profiling shows that this creates unnecessary overhead.

---

# 85. Thread / Process Safety

If datasets are shared across requests, verify that the chosen xarray/backend usage is safe for the deployment model.

Do not assume that a development server's behavior represents production behavior.

---

# 86. Serialization

Scientific arrays should be converted into API-safe structures.

Before returning:

```text
NumPy
↓
Python scalar/list
↓
JSON
```

Never expose NumPy-specific types directly.

---

# 87. Scientific Precision

Do not aggressively round data during ingestion.

Keep source precision internally.

Round only at:

```text
presentation layer
```

unless storage/performance requirements justify another approach.

---

# 88. Data Processing Separation

Separate:

```text
RAW
NORMALIZED
DERIVED
```

Conceptually.

Raw:

```text
source NetCDF
```

Normalized:

```text
Observation
ModelField
Profile
```

Derived:

```text
Residual
Thermocline
MLD
CurrentSpeed
CurrentShear
```

---

# 89. Derived Data Rule

Derived values should be reproducible from:

```text
source data
+
documented method
+
parameters
```

Do not store unexplained derived numbers.

---

# 90. Example End-to-End Model Request

User changes depth to:

```text
150m
```

Frontend requests:

```http
GET /api/model-field?
time=2024-01-05T00:00:00Z&
depth=150&
variable=temperature
```

Backend:

```text
API
 ↓
Scientific Service
 ↓
Model Adapter
 ↓
xarray selection
 ↓
normalized ModelField
 ↓
JSON response
```

Frontend:

```text
ModelField
 ↓
Cesium / Three.js
```

---

# 91. Example End-to-End Evidence Request

User selects an Argo profile.

```text
SELECT
 ↓
/api/evidence
 ↓
Observation Adapter
 ↓
Model Matcher
 ↓
Profile Extraction
 ↓
Residual Calculation
 ↓
Derived Features
 ↓
Coverage
 ↓
Provenance
 ↓
Response
```

The browser receives one coherent scientific evidence object.

---

# 92. Example End-to-End SAR Request

User launches drift scenario.

```text
Evidence State
 ↓
starting location
starting time
depth
dataset
 ↓
/api/sar/drift
 ↓
Current Field
 ↓
Euler Integration
 ↓
Trajectory
 ↓
Provenance
 ↓
Response Mode
```

The scenario is therefore connected directly to the evidence state.

---

# 93. Data Integrity Principle

The same scientific source must drive every downstream representation.

For example:

```text
GLORYS uo/vo
      ↓
Current vectors
      ↓
Current readout
      ↓
Current evidence
      ↓
SAR trajectory
```

If these diverge, NIRIKSHAN loses scientific credibility.

---

# 94. No Synthetic Substitution

If real data cannot be loaded:

Do not silently substitute:

```text
random currents
fake observations
generated temperature fields
hard-coded trajectories
```

Instead:

```text
DATA UNAVAILABLE
```

or use an explicitly labelled demo mode.

---

# 95. Demo Mode

If demo fallback is retained, it must be explicit.

Example environment:

```text
NIRIKSHAN_DATA_MODE=demo
```

UI:

```text
DEMO DATA
```

Never display demo values as:

```text
GLORYS12V1
```

if they are not actually from GLORYS12V1.

---

# 96. AI Coding Agent Instructions

When implementing or modifying the data pipeline:

1. Inspect the actual NetCDF file before changing schemas.
2. Never guess dimension names.
3. Never guess variable names.
4. Inspect units and metadata.
5. Preserve real data.
6. Preserve existing working adapters.
7. Do not introduce mocks into real-data paths.
8. Do not hard-code coordinates unnecessarily.
9. Do not hard-code time ranges unnecessarily.
10. Keep source-specific logic inside adapters.
11. Keep scientific calculations inside the Scientific Engine.
12. Keep API serialization inside API/service layers.
13. Add tests for every changed contract.
14. Run dataset validation after ingestion changes.
15. Run backend tests.
16. Run frontend production build.
17. Verify actual browser behavior.
18. Do not commit scientific `.nc` files to Git.
19. Never expose credentials.
20. Do not optimize prematurely without profiling.

---

# 97. Implementation Sequence

Implement the pipeline in this order.

## Phase 1 — Existing Data

```text
1. Verify GLORYS file
2. Verify Argo file
3. Validate dimensions
4. Validate variables
5. Validate coordinates
6. Validate time
```

---

## Phase 2 — Adapter

```text
7. Model adapter
8. Observation adapter
9. Dataset registry
10. Metadata extraction
```

---

## Phase 3 — Scientific Engine

```text
11. Model field extraction
12. Profile extraction
13. Observation/model matching
14. Residuals
15. Derived features
```

---

## Phase 4 — API

```text
16. Dataset endpoint
17. Observation endpoint
18. Model field endpoint
19. Profile endpoint
20. Evidence endpoint
21. SAR endpoint
```

---

## Phase 5 — Frontend

```text
22. API client
23. State integration
24. Globe
25. Observation markers
26. Evidence workspace
27. Response mode
```

---

# 98. Definition of Done

The Data Pipeline is complete when:

### Data

- [ ] Real GLORYS12V1 data loads.
- [ ] Real Argo data loads.
- [ ] Dataset metadata is discoverable.
- [ ] Required dimensions are validated.
- [ ] Required variables are validated.
- [ ] Coordinate systems are normalized.
- [ ] Time is normalized.
- [ ] Missing values are handled correctly.

### Scientific

- [ ] Profiles are preserved.
- [ ] Model matching is reproducible.
- [ ] Residuals use the documented convention.
- [ ] Derived features use documented methods.
- [ ] Current data is consistent across visualization and SAR.

### API

- [ ] API receives normalized domain data.
- [ ] Raw NetCDF is hidden behind adapters.
- [ ] Responses are JSON-safe.
- [ ] Errors are structured.
- [ ] Provenance is retained.

### Performance

- [ ] Full datasets are not unnecessarily sent to the browser.
- [ ] Large arrays are subset server-side.
- [ ] Repeated requests can be cached.
- [ ] Dataset resources are managed correctly.

### Security

- [ ] Credentials are not committed.
- [ ] Credentials are not sent to frontend.
- [ ] Scientific files are not accidentally committed.
- [ ] Logs do not expose secrets.

---

# 99. Final Data Principle

NIRIKSHAN must follow this rule:

```text
REAL SOURCE
    ↓
VALIDATED DATA
    ↓
NORMALIZED DATA
    ↓
SCIENTIFIC CALCULATION
    ↓
TRACEABLE RESULT
    ↓
VISUALIZATION
```

Never:

```text
UI
 ↓
fake data
 ↓
pretty visualization
```

The quality of NIRIKSHAN depends more on scientific data integrity than on the number of features.

The data pipeline is therefore part of the product, not merely backend infrastructure.
```
