# `06_API_CONTRACTS.md`

```md
# NIRIKSHAN — API Contracts

## Document Status

- Product: NIRIKSHAN
- Document: API Contracts
- Version: 1.0
- Status: Implementation Specification
- Audience: AI coding agents, backend developers, frontend developers
- Depends on:
  - `01_PRD.md`
  - `02_ARCHITECTURE.md`
  - `03_SCIENTIFIC_ENGINE.md`
  - `04_OBSERVATION_EVIDENCE.md`
  - `05_UI_UX_SYSTEM.md`

---

# 1. Purpose

This document defines the contract between the NIRIKSHAN frontend and backend.

The purpose is to prevent:

- random endpoint creation,
- inconsistent response shapes,
- duplicated scientific calculations,
- frontend assumptions about NetCDF,
- breaking changes between components,
- mock data being silently reintroduced,
- scientific metadata being lost between layers.

The API is a scientific data interface.

The frontend should consume normalized domain objects.

The frontend must never need to understand raw NetCDF implementation details.

---

# 2. API Architecture

The intended flow is:

```text
React Frontend
      ↓
API Client
      ↓
FastAPI
      ↓
Scientific Engine
      ↓
Data Adapter
      ↓
NetCDF / Scientific Data
```

The frontend must not directly access:

- NetCDF files,
- xarray datasets,
- local scientific files,
- Copernicus credentials,
- server-side filesystem paths.

---

# 3. API Design Principles

## 3.1 Backend Owns Scientific Truth

Scientific calculations happen on the backend.

Examples:

- model matching,
- residual calculation,
- profile alignment,
- RMSE,
- MAE,
- thermocline detection,
- MLD,
- current speed,
- current direction,
- current shear,
- SAR integration.

The frontend only renders results.

---

## 3.2 Stable Domain Contracts

API responses should represent domain concepts rather than implementation details.

Bad:

```json
{
  "xarray_values": [],
  "numpy_dtype": "float64"
}
```

Good:

```json
{
  "depth": 150,
  "temperature": 27.41,
  "unit": "degC"
}
```

---

## 3.3 Explicit Units

Every scientific quantity must have an explicit unit when ambiguity is possible.

Examples:

```text
temperature → °C
salinity → PSU
depth → m
current speed → m/s
latitude → degrees
longitude → degrees
distance → km
time → ISO 8601
```

---

# 4. Base URL

Development:

```text
/api
```

The frontend should use a centralized API client.

Example:

```ts
const API_BASE = "/api";
```

Do not hard-code API URLs throughout components.

---

# 5. HTTP Methods

Use:

```text
GET
```

for data retrieval.

Use:

```text
POST
```

only when a request represents a computational operation that cannot reasonably be represented as a simple query.

Current MVP should remain primarily read-oriented.

---

# 6. Response Envelope

Simple successful endpoints may return domain objects directly.

For computationally important endpoints, a consistent envelope may be used.

Recommended:

```json
{
  "data": {},
  "meta": {}
}
```

Example:

```json
{
  "data": {
    "temperature": []
  },
  "meta": {
    "dataset": "GLORYS12V1"
  }
}
```

Do not introduce envelopes inconsistently across existing working endpoints.

If the current application already has a stable response convention, preserve it.

---

# 7. Error Contract

All API errors should follow a predictable structure.

Recommended:

```json
{
  "error": {
    "code": "MODEL_DATA_UNAVAILABLE",
    "message": "The requested model state could not be loaded.",
    "details": {}
  }
}
```

---

# 8. Error Codes

Recommended codes:

```text
INVALID_REQUEST
OBSERVATION_NOT_FOUND
MODEL_DATA_UNAVAILABLE
MODEL_MATCH_FAILED
PROFILE_UNAVAILABLE
INSUFFICIENT_DATA
VARIABLE_UNAVAILABLE
TIME_OUT_OF_RANGE
DEPTH_OUT_OF_RANGE
LOCATION_OUT_OF_RANGE
SCENARIO_UNAVAILABLE
INTERNAL_ERROR
```

---

# 9. Error Semantics

Errors should distinguish between:

### User input error

```text
400
```

### Resource not found

```text
404
```

### Scientifically unavailable calculation

```text
422
```

### Server failure

```text
500
```

Do not return `500` for normal scientific data limitations.

---

# 10. Dataset Metadata

## Endpoint

```http
GET /api/datasets
```

Purpose:

Return available scientific datasets.

Example response:

```json
{
  "datasets": [
    {
      "id": "glorys12v1",
      "name": "GLORYS12V1",
      "type": "ocean_model",
      "source": "Copernicus Marine",
      "variables": [
        "temperature",
        "eastward_current",
        "northward_current"
      ],
      "timeRange": {
        "start": "2024-01-01T00:00:00Z",
        "end": "2024-01-10T00:00:00Z"
      }
    }
  ]
}
```

---

# 11. Dataset Detail

## Endpoint

```http
GET /api/datasets/{dataset_id}
```

Purpose:

Return technical metadata.

Example:

```json
{
  "id": "glorys12v1",
  "name": "GLORYS12V1",
  "dimensions": {
    "time": 10,
    "depth": 50,
    "latitude": 241,
    "longitude": 301
  },
  "variables": [
    "thetao",
    "uo",
    "vo"
  ],
  "depthRange": {
    "min": 0.494,
    "max": 5727.9,
    "unit": "m"
  }
}
```

The exact values must come from the loaded dataset.

Do not hard-code metadata in the frontend.

---

# 12. Observations

## Endpoint

```http
GET /api/observations
```

Purpose:

Return observation markers and lightweight metadata.

The endpoint should not return full profiles by default.

---

# 13. Observation Query Parameters

Supported parameters may include:

```text
dataset
platform_type
start_time
end_time
min_lat
max_lat
min_lon
max_lon
```

Example:

```http
GET /api/observations?
    platform_type=ARGO&
    start_time=2024-01-01T00:00:00Z&
    end_time=2024-01-10T23:59:59Z
```

---

# 14. Observation Response

Example:

```json
{
  "observations": [
    {
      "id": "argo-2901234-20240105",
      "platformId": "2901234",
      "platformType": "ARGO",
      "latitude": 12.438,
      "longitude": 87.312,
      "time": "2024-01-05T06:42:00Z",
      "variables": [
        "temperature",
        "salinity",
        "pressure"
      ]
    }
  ]
}
```

The observation list should remain lightweight.

---

# 15. Single Observation

## Endpoint

```http
GET /api/observations/{observation_id}
```

Purpose:

Return the selected observation metadata and available profile information.

Example:

```json
{
  "id": "argo-2901234-20240105",
  "platformId": "2901234",
  "platformType": "ARGO",
  "latitude": 12.438,
  "longitude": 87.312,
  "time": "2024-01-05T06:42:00Z",
  "variables": [
    "temperature",
    "salinity",
    "pressure"
  ],
  "source": {
    "dataset": "argo"
  }
}
```

---

# 16. Model Field

## Existing Endpoint

The current implementation uses:

```http
GET /api/model-field
```

Preserve this endpoint unless a deliberate API migration is performed.

---

# 17. Model Field Query

Conceptually:

```text
time
depth
variable
latitude
longitude
dataset
```

Example:

```http
GET /api/model-field?
    time=2024-01-05T00:00:00Z&
    depth=100&
    variable=temperature
```

---

# 18. Model Field Response

Example:

```json
{
  "dataset": "GLORYS12V1",
  "variable": "temperature",
  "unit": "degC",
  "time": "2024-01-05T00:00:00Z",
  "depth": 100,
  "latitude": [],
  "longitude": [],
  "values": []
}
```

The exact grid representation must match the existing renderer.

---

# 19. Model Variables

Internal NetCDF names:

```text
thetao
uo
vo
```

Public API names should use domain terminology.

Recommended:

```text
temperature
eastward_current
northward_current
```

The backend handles the mapping.

---

# 20. Variable Mapping

```text
thetao
→ temperature

uo
→ eastward_current

vo
→ northward_current
```

Do not expose internal names unnecessarily to normal users.

Technical metadata may show them.

---

# 21. Profile Endpoint

## Existing Endpoint

The current implementation uses:

```http
GET /api/profile
```

Preserve the working endpoint.

---

# 22. Profile Query

Minimum:

```text
lat
lon
time
```

Optional:

```text
variable
dataset
```

Example:

```http
GET /api/profile?
    lat=12.438&
    lon=87.312&
    time=2024-01-05T06:42:00Z
```

---

# 23. Profile Response

Recommended conceptual response:

```json
{
  "location": {
    "latitude": 12.438,
    "longitude": 87.312
  },
  "time": "2024-01-05T06:42:00Z",
  "depth": [],
  "observation": {
    "temperature": [],
    "salinity": [],
    "pressure": []
  },
  "model": {
    "temperature": [],
    "eastward_current": [],
    "northward_current": []
  }
}
```

---

# 24. Profile Match Metadata

Profile responses should expose model matching.

Example:

```json
{
  "match": {
    "requestedTime": "2024-01-05T06:42:00Z",
    "selectedTime": "2024-01-05T00:00:00Z",
    "requestedLatitude": 12.438,
    "selectedLatitude": 12.417,
    "requestedLongitude": 87.312,
    "selectedLongitude": 87.333,
    "timeDifferenceSeconds": 24120,
    "spatialDistanceKm": 3.2,
    "method": "nearest"
  }
}
```

---

# 25. Residual Endpoint

A dedicated residual endpoint may be used:

```http
GET /api/residual
```

However, if residuals are already returned from the profile/evidence endpoint, do not create redundant requests.

The architectural rule is:

```text
ONE SCIENTIFIC CALCULATION
ONE SOURCE OF TRUTH
```

---

# 26. Residual Response

Example:

```json
{
  "variable": "temperature",
  "unit": "degC",
  "convention": "observation_minus_model",
  "depth": [],
  "values": [],
  "statistics": {
    "bias": 0.18,
    "mae": 0.42,
    "rmse": 0.57,
    "correlation": 0.81,
    "validSamples": 84
  }
}
```

---

# 27. Residual Contract

The API must explicitly state:

```text
observation − model
```

This prevents frontend ambiguity.

Never rely on the frontend developer remembering the sign convention.

---

# 28. Derived Features

## Endpoint

```http
GET /api/derived-features
```

Or include derived features inside `/api/evidence`.

Prefer embedding them inside evidence when they are calculated specifically for the selected observation.

---

# 29. Derived Feature Response

Example:

```json
{
  "features": [
    {
      "type": "thermocline",
      "value": 82,
      "unit": "m",
      "depth": 82,
      "method": "maximum_temperature_gradient"
    },
    {
      "type": "mixed_layer_depth",
      "value": 41,
      "unit": "m",
      "method": "temperature_threshold"
    }
  ]
}
```

---

# 30. Feature Registry

The API should use stable feature identifiers.

Recommended:

```text
thermocline
mixed_layer_depth
temperature_gradient
current_speed
current_direction
current_shear
```

Do not use UI-specific names.

---

# 31. Current Vector

Current response:

```json
{
  "eastward": 0.32,
  "northward": 0.27,
  "speed": 0.42,
  "direction": 137,
  "unit": {
    "component": "m/s",
    "speed": "m/s",
    "direction": "degrees"
  }
}
```

The exact direction convention must match `03_SCIENTIFIC_ENGINE.md`.

---

# 32. Current Field

The current field endpoint may return:

```json
{
  "time": "2024-01-05T00:00:00Z",
  "depth": 10,
  "latitude": [],
  "longitude": [],
  "u": [],
  "v": [],
  "speed": []
}
```

The frontend may calculate display-only quantities if required for rendering, but authoritative scientific values should originate from the backend.

---

# 33. Evidence Endpoint

The preferred high-level endpoint is:

```http
GET /api/evidence
```

This endpoint should combine the scientific objects needed by the Evidence Workspace.

---

# 34. Evidence Query

Example:

```http
GET /api/evidence?
    observation_id=argo-2901234-20240105
```

Optional:

```text
variable
depth_min
depth_max
dataset
```

---

# 35. Evidence Response

Recommended structure:

```json
{
  "observation": {},
  "modelMatch": {},
  "profile": {},
  "residual": {},
  "derivedFeatures": [],
  "current": {},
  "coverage": {},
  "provenance": {}
}
```

This response should be sufficient for the Evidence Workspace to render without making many dependent requests.

---

# 36. Evidence Loading Strategy

Preferred:

```text
SELECT OBSERVATION
      ↓
GET /api/evidence
      ↓
ONE SCIENTIFIC RESPONSE
      ↓
RENDER EVIDENCE WORKSPACE
```

Avoid:

```text
GET observation
GET profile
GET model
GET residual
GET thermocline
GET MLD
GET current
GET provenance
```

unless lazy loading is required for performance.

---

# 37. Evidence Response Example

```json
{
  "observation": {
    "id": "argo-2901234-20240105",
    "platformId": "2901234",
    "platformType": "ARGO",
    "latitude": 12.438,
    "longitude": 87.312,
    "time": "2024-01-05T06:42:00Z"
  },

  "modelMatch": {
    "dataset": "GLORYS12V1",
    "selectedTime": "2024-01-05T00:00:00Z",
    "selectedLatitude": 12.417,
    "selectedLongitude": 87.333,
    "timeDifferenceSeconds": 24120,
    "spatialDistanceKm": 3.2,
    "method": "nearest"
  },

  "profile": {
    "depth": [],
    "observation": {
      "temperature": []
    },
    "model": {
      "temperature": []
    }
  },

  "residual": {
    "variable": "temperature",
    "convention": "observation_minus_model",
    "values": [],
    "statistics": {}
  },

  "derivedFeatures": [],

  "current": {},

  "coverage": {},

  "provenance": {}
}
```

---

# 38. Coverage Contract

Example:

```json
{
  "selectedObservationCount": 1,
  "within50km": 3,
  "within100km": 7,
  "classification": "MODERATE"
}
```

The classification must be derived from documented rules.

If no classification system exists yet, return counts without inventing a label.

---

# 39. Provenance Contract

Example:

```json
{
  "observationSource": "Argo GDAC",
  "modelSource": "Copernicus Marine",
  "dataset": "GLORYS12V1",
  "variables": [
    "thetao",
    "uo",
    "vo"
  ],
  "matchingMethod": "nearest",
  "residualConvention": "observation_minus_model"
}
```

---

# 40. Scenario Endpoint

## Existing Endpoint

The current implementation uses:

```http
GET /api/sar/drift
```

Preserve the existing working endpoint.

---

# 41. SAR Query

Minimum:

```text
lat
lon
time
```

Potential parameters:

```text
duration_hours
depth
dataset
timestep
```

Example:

```http
GET /api/sar/drift?
    lat=12.438&
    lon=87.312&
    time=2024-01-05T06:42:00Z&
    duration_hours=72
```

---

# 42. SAR Response

Recommended:

```json
{
  "method": "Euler",
  "durationHours": 72,
  "timestepHours": 1,
  "start": {
    "latitude": 12.438,
    "longitude": 87.312,
    "time": "2024-01-05T06:42:00Z"
  },
  "trajectory": [
    {
      "time": "2024-01-05T06:42:00Z",
      "latitude": 12.438,
      "longitude": 87.312
    }
  ],
  "field": {
    "dataset": "GLORYS12V1"
  },
  "limitations": [
    "windage_not_included",
    "wave_drift_not_included",
    "leeway_not_included"
  ]
}
```

---

# 43. Scenario Scientific Integrity

The SAR endpoint must use the same underlying:

```text
uo
vo
time
location
dataset
```

as the analytical current field.

Do not use a separate demo velocity field.

---

# 44. Scenario Provenance

Every scenario response should include:

```text
dataset
starting location
starting time
depth
integration method
timestep
duration
field variables
limitations
```

This makes the trajectory reproducible.

---

# 45. Time Format

Use ISO 8601.

Example:

```text
2024-01-05T06:42:00Z
```

Do not use ambiguous strings such as:

```text
05/01/24
```

---

# 46. Coordinate Format

Use decimal degrees.

Example:

```json
{
  "latitude": 12.438,
  "longitude": 87.312
}
```

Do not return formatted strings as the primary machine-readable values.

---

# 47. Depth Format

Depth should be represented as a positive value measured downward from the surface.

Example:

```json
{
  "depth": 150,
  "unit": "m"
}
```

Do not mix:

```text
-150m
```

and:

```text
150m
```

through different endpoints.

---

# 48. Numeric Precision

Backend responses should preserve enough precision for scientific calculations.

Frontend display precision may be lower.

Example:

Backend:

```json
{
  "latitude": 12.4379183
}
```

Frontend:

```text
12.438° N
```

Do not round scientific values before calculations.

---

# 49. Null Handling

Missing values should be:

```json
null
```

not:

```json
0
```

and not:

```json
-9999
```

unless the raw data representation specifically needs to be exposed in technical metadata.

---

# 50. Arrays

Scientific arrays must have consistent lengths where paired.

Example:

```json
{
  "depth": [0, 10, 20],
  "temperature": [28.1, 27.9, 27.4]
}
```

If a value is unavailable:

```json
{
  "depth": [0, 10, 20],
  "temperature": [28.1, null, 27.4]
}
```

---

# 51. Array Alignment

For profile arrays:

```text
depth[i]
temperature[i]
salinity[i]
```

must refer to the same profile level.

Do not independently sort individual variable arrays.

---

# 52. Units

Every response containing scientific values must either:

1. include explicit units, or
2. use a domain contract where the unit is permanently defined and documented.

For high-risk ambiguity, include the unit directly in the response.

---

# 53. Metadata

Useful metadata may include:

```json
{
  "meta": {
    "requestTime": "...",
    "processingTimeMs": 124,
    "dataset": "GLORYS12V1"
  }
}
```

Do not expose internal server implementation details.

---

# 54. Request Validation

FastAPI/Pydantic should validate:

- latitude,
- longitude,
- time,
- depth,
- variable,
- dataset,
- duration.

Examples:

```text
latitude: -90 → 90
longitude: -180 → 180
depth: >= 0
duration: > 0
```

Dataset-specific limits should be validated separately.

---

# 55. Dataset Boundary Validation

If a request falls outside the dataset:

Return a scientific error.

Example:

```json
{
  "error": {
    "code": "TIME_OUT_OF_RANGE",
    "message": "Requested time is outside the available model range."
  }
}
```

Do not silently clamp requests.

---

# 56. Spatial Boundary Validation

Similarly:

```json
{
  "error": {
    "code": "LOCATION_OUT_OF_RANGE",
    "message": "Requested location is outside the available dataset region."
  }
}
```

---

# 57. Query Normalization

Backend should normalize:

- longitude wrapping,
- timestamp precision,
- depth precision,
- variable aliases.

Example:

```text
temperature
thetao
```

may map internally to the same scientific variable.

The frontend should use public domain names.

---

# 58. API Client

Create one frontend API client.

Example:

```ts
export const api = {
  getDatasets,
  getObservations,
  getObservation,
  getModelField,
  getProfile,
  getEvidence,
  getDerivedFeatures,
  getSarDrift,
};
```

Do not scatter:

```ts
fetch("/api/...")
```

through UI components.

---

# 59. API Types

Create shared frontend types.

Example:

```ts
export interface Observation {
  id: string;
  platformId: string;
  platformType: string;
  latitude: number;
  longitude: number;
  time: string;
}
```

Types should reflect backend contracts.

Do not duplicate slightly different interfaces for the same domain object.

---

# 60. API Loading State

Every asynchronous request should support:

```ts
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: ApiError };
```

This prevents inconsistent loading behavior across components.

---

# 61. Abort / Cancellation

Long-running requests should support cancellation where practical.

Example:

```text
User changes depth
      ↓
request A starts
      ↓
User changes depth again
      ↓
request A cancelled
      ↓
request B starts
```

This prevents stale data from overwriting newer state.

---

# 62. Stale Response Protection

Every response should be associated with its request state.

If the user changes:

```text
time
depth
variable
observation
```

while a request is pending, an old response must not overwrite the new state.

---

# 63. Caching

Frontend caching may be used for:

- observation list,
- dataset metadata,
- repeated model fields,
- evidence cases,
- profile data.

However, cache keys must include all scientifically relevant parameters.

---

# 64. Example Cache Key

```text
evidence:
observationId
+
dataset
+
variable
```

Model field:

```text
modelField:
dataset
+
time
+
depth
+
variable
```

---

# 65. Pagination

If observation count grows substantially, `/api/observations` should support pagination or spatial/temporal filtering.

Example:

```text
limit
offset
```

or cursor pagination.

For the current small dataset, simple retrieval may be sufficient.

Do not over-engineer the MVP.

---

# 66. Data Transfer Optimization

Do not send:

- unused variables,
- entire NetCDF files,
- unnecessary depth levels,
- unnecessary geographic regions.

The API should return only what the current view requires.

---

# 67. Grid Encoding

For large model grids, JSON arrays may eventually become expensive.

The architecture should allow future optimization using:

- binary arrays,
- compressed payloads,
- typed arrays,
- tile-based requests.

Do not prematurely introduce complex binary protocols unless profiling shows a need.

---

# 68. Current MVP JSON Strategy

For the hackathon prototype:

Prefer clear JSON contracts.

Optimize for:

```text
correctness
debuggability
implementation speed
```

rather than maximum theoretical throughput.

---

# 69. API Versioning

The current prototype does not require elaborate versioning.

If versioning becomes necessary:

```text
/api/v1/...
```

should be introduced deliberately.

Do not mix:

```text
/api/...
/api/v1/...
/api/v2/...
```

without a migration strategy.

---

# 70. Backward Compatibility

Existing working endpoints must not be broken casually.

Before changing an endpoint:

1. inspect frontend usage,
2. inspect backend callers,
3. update contracts,
4. update tests,
5. run build,
6. verify browser behavior.

---

# 71. Demo Data Rules

Demo fallback data may exist for development.

However:

- it must be clearly separated,
- it must never silently replace real data,
- production/demo mode should be explicit,
- UI should not claim demo data is real.

The current scientific workflow should remain connected to real GLORYS and Argo data.

---

# 72. Backend Adapter Boundary

API routes should not directly manipulate NetCDF internals.

Preferred:

```text
API Route
   ↓
Scientific Service
   ↓
Scientific Engine
   ↓
Data Adapter
```

Not:

```text
API Route
   ↓
xarray.open_dataset(...)
```

---

# 73. API Route Responsibility

Routes should handle:

- validation,
- request parsing,
- service invocation,
- response serialization,
- error mapping.

Routes should not contain scientific algorithms.

---

# 74. Scientific Service Responsibility

Scientific services should handle:

- matching,
- profile extraction,
- comparison,
- derived features,
- scenario calculations.

---

# 75. Data Adapter Responsibility

The adapter handles:

- opening datasets,
- reading variables,
- coordinate discovery,
- subsetting,
- normalization.

The API should not know whether data came from:

```text
NetCDF
database
OPeNDAP
WMS
future source
```

---

# 76. Provenance Requirement

Every scientifically meaningful endpoint should make it possible to trace:

```text
request
→ dataset
→ variables
→ method
→ result
```

At minimum, evidence and scenario responses must expose provenance.

---

# 77. Security

Do not expose:

- Copernicus credentials,
- server filesystem paths,
- database credentials,
- secret API keys.

Frontend environment variables beginning with:

```text
VITE_
```

must be treated as public client-side values.

---

# 78. CORS

CORS should remain controlled through backend configuration.

Do not hard-code production origins.

Use the existing environment-based configuration.

---

# 79. Health Endpoint

Recommended:

```http
GET /health
```

Example:

```json
{
  "status": "ok",
  "service": "niriKshan-api"
}
```

Optionally:

```json
{
  "status": "ok",
  "data": {
    "model": "available",
    "observations": "available"
  }
}
```

---

# 80. Readiness Endpoint

Optional:

```http
GET /ready
```

This can verify that required scientific datasets are available.

Useful for demo deployment.

---

# 81. API Documentation

FastAPI should automatically expose OpenAPI documentation.

Use it during development to verify:

- parameter names,
- response shapes,
- error contracts.

Do not treat autogenerated documentation as a substitute for this API contract.

---

# 82. Testing Contract

Every important endpoint should have tests for:

### Valid request

```text
200
```

### Invalid request

```text
400/422
```

### Missing resource

```text
404
```

### Dataset limitation

```text
appropriate scientific error
```

### Server failure

```text
500
```

---

# 83. Scientific API Test Cases

At minimum test:

### Model field

- valid time
- valid depth
- valid variable
- invalid time
- invalid depth
- invalid variable

### Observation

- list
- known observation
- unknown observation

### Profile

- valid location
- valid time
- outside dataset
- missing variable

### Evidence

- valid observation
- insufficient overlap
- missing model state

### SAR

- valid start point
- valid duration
- out-of-domain location
- unavailable current field

---

# 84. Contract Validation

When modifying backend models:

1. update Pydantic schemas,
2. update frontend TypeScript types,
3. update API client,
4. update tests,
5. run frontend build,
6. test actual endpoint responses.

Never change one side only.

---

# 85. Anti-Patterns

Never:

- return different field names for the same concept,
- return units in inconsistent formats,
- silently clamp coordinates,
- silently change residual sign,
- calculate thermocline in React,
- calculate RMSE in a chart component,
- fetch raw NetCDF from the browser,
- return fake values when real data is unavailable,
- hide model matching offsets,
- expose secrets,
- create duplicate endpoints for the same scientific operation.

---

# 86. Example End-to-End Flow

User selects:

```text
ARGO 2901234
```

Frontend:

```http
GET /api/evidence?observation_id=argo-2901234-20240105
```

Backend:

```text
Observation Repository
        ↓
Model Matcher
        ↓
Profile Extractor
        ↓
Residual Calculator
        ↓
Feature Calculator
        ↓
Coverage Calculator
        ↓
Provenance Builder
```

Response:

```json
{
  "observation": {},
  "modelMatch": {},
  "profile": {},
  "residual": {},
  "derivedFeatures": [],
  "coverage": {},
  "provenance": {}
}
```

Frontend:

```text
Evidence Workspace
      ↓
Profile
Residual
Water Column
Features
Provenance
```

---

# 87. Definition of Done

The API contract system is complete when:

- [ ] Frontend has a centralized API client.
- [ ] Backend exposes stable domain endpoints.
- [ ] Existing working endpoints remain functional.
- [ ] Observation contract is stable.
- [ ] Model field contract is stable.
- [ ] Profile contract is stable.
- [ ] Evidence contract is stable.
- [ ] Residual convention is explicit.
- [ ] Derived feature contract is stable.
- [ ] SAR contract is stable.
- [ ] Provenance is available.
- [ ] Errors are structured.
- [ ] Units are explicit.
- [ ] Null values are handled correctly.
- [ ] Scientific calculations remain server-side.
- [ ] No raw NetCDF access exists in the frontend.
- [ ] API tests cover normal and failure paths.
- [ ] Frontend production build succeeds.

---

# 88. Final API Principle

The API should make the frontend simple.

The frontend should be able to ask:

```text
"What is the scientific state?"
```

rather than:

```text
"How do I open this NetCDF?"
"Which variable is thetao?"
"How do I calculate residual?"
"How do I find the thermocline?"
"How do I match this observation?"
```

The backend owns scientific interpretation.

The frontend owns:

```text
visualization
interaction
navigation
communication
```

The API is the boundary that keeps those responsibilities clean.
```

### Next document

**`07_DATA_PIPELINE_AND_INGESTION.md`**

That one should define exactly how **GLORYS12V1 + Argo → validation → normalization → caching → API → browser** works, including the real `.nc` files already in your prototype, data refresh strategy, QC, NetCDF handling, performance, and how we can later add Glider/CTD/BGC without rewriting the system.