# `02_ARCHITECTURE.md`

This is the **technical source of truth** for the implementation. Put it in `docs/02_ARCHITECTURE.md`.

It is intentionally more detailed than the previous architecture outline: it defines the system boundaries, modules, data flow, state model, APIs, scientific engine boundaries, rendering strategy, caching, failure handling, and future extensibility.

```md
# NIRIKSHAN
## System Architecture Specification

### 3D Ocean Analysis & Response Workspace

> SEE → VERIFY → UNDERSTAND → RESPOND

**SIH Problem Statement:** SIH26067  
**Organization:** Ministry of Earth Sciences (MoES)  
**Department:** Indian National Centre for Ocean Information Services (INCOIS)  
**Theme:** Disaster Management  
**Team:** ZWP

---

# 1. Purpose

This document defines the technical architecture of NIRIKSHAN.

It is the implementation-level companion to:

```text
00_PROJECT_VISION.md
01_PRD.md
```

This document defines:

- system boundaries
- frontend architecture
- backend architecture
- scientific computation architecture
- data architecture
- API boundaries
- state management
- rendering architecture
- caching
- performance strategy
- error handling
- extensibility
- deployment
- testing boundaries
- architectural constraints

The objective is to create a system that is:

- scientifically credible
- modular
- performant
- extensible
- browser-native
- easy for an AI coding agent to modify safely
- suitable for SIH demonstration
- capable of future INCOIS-oriented expansion

---

# 2. Architectural Principle

The architecture must separate:

```text
DATA
 ↓
SCIENCE
 ↓
API
 ↓
APPLICATION STATE
 ↓
VISUALIZATION
 ↓
USER INTERACTION
```

A visualization component must not directly understand NetCDF internals.

A scientific calculation must not depend on React.

The backend must not depend on Cesium.

The frontend must not contain scientific source-data parsing logic.

---

# 3. High-Level Architecture

```text
┌──────────────────────────────────────────────────────────────┐
│                         NIRIKSHAN                            │
├──────────────────────────────────────────────────────────────┤
│                        BROWSER CLIENT                        │
│                                                              │
│  ┌────────────┐   ┌──────────────┐   ┌──────────────────┐   │
│  │ React App  │   │ Application  │   │ Scientific       │   │
│  │            │   │ State        │   │ Visualization    │   │
│  │            │   │              │   │                  │   │
│  │            │   │ Zustand      │   │ Cesium           │   │
│  │            │   │              │   │ Three.js/WebGL   │   │
│  └─────┬──────┘   └──────┬───────┘   │ Plotly           │   │
│        │                  │            └────────┬─────────┘   │
│        └──────────┬───────┘                     │             │
│                   ↓                             │             │
│             API Client                          │             │
└───────────────────┬─────────────────────────────┼─────────────┘
                    │                             │
                    │ HTTP/JSON                  │
                    ↓                             │
┌──────────────────────────────────────────────────────────────┐
│                         FASTAPI                              │
│                                                              │
│  ┌─────────────┐   ┌─────────────────────────────────────┐  │
│  │ API Routes  │ → │ Application Services                │  │
│  └─────────────┘   └──────────────────┬──────────────────┘  │
│                                       │                      │
│                                       ↓                      │
│                           ┌───────────────────────┐          │
│                           │ Scientific Engine     │          │
│                           │                       │          │
│                           │ Sampling              │          │
│                           │ Matching              │          │
│                           │ Residuals             │          │
│                           │ Derived Features      │          │
│                           │ Current Analysis      │          │
│                           │ Scenario Simulation   │          │
│                           └───────────┬───────────┘          │
│                                       │                      │
│                                       ↓                      │
│                           ┌───────────────────────┐          │
│                           │ Data Adapter Layer    │          │
│                           └───────────┬───────────┘          │
│                                       │                      │
└───────────────────────────────────────┼──────────────────────┘
                                        │
                         ┌──────────────┴──────────────┐
                         ↓                             ↓
                ┌─────────────────┐          ┌─────────────────┐
                │ GLORYS NetCDF   │          │ Argo NetCDF    │
                │ xarray          │          │ xarray         │
                └─────────────────┘          └─────────────────┘
```

---

# 4. Architectural Layers

NIRIKSHAN is divided into seven logical layers.

```text
1. Data Layer
2. Adapter Layer
3. Scientific Engine
4. API Layer
5. Application State Layer
6. Visualization Layer
7. Interaction Layer
```

Each layer has a strict responsibility.

---

# 5. Layer 1 — Data Layer

The data layer contains source datasets.

Current sources:

```text
GLORYS12V1
Argo
```

Potential future sources:

```text
INCOIS model outputs
Glider
CTD
BGC
HYCOM
WMS
WCS
OPeNDAP
```

The data layer must not contain application-specific UI logic.

---

# 6. Current Data Layout

Expected structure:

```text
backend/
└── data/
    └── scientific/
        ├── glorys12v1_bob_202401.nc
        ├── argo_bob.nc
        ├── provenance.json
        └── download_model.sh
```

Large scientific datasets must not be committed to Git.

---

# 7. Data Versioning Principle

Scientific datasets must be treated as versioned inputs.

The application should be able to determine:

```text
dataset
dataset version
source
time coverage
spatial coverage
variables
processing version
```

A provenance manifest should describe the local development dataset.

---

# 8. Layer 2 — Adapter Layer

The adapter layer translates source-specific datasets into normalized application concepts.

Core abstraction:

```text
DataAdapter
```

Current implementations:

```text
DemoDataAdapter
NetCDFAdapter
```

The demo adapter exists only for development/testing.

The production/demo scientific workflow should use:

```text
NetCDFAdapter
```

when real data is available.

---

# 9. DataAdapter Responsibilities

The adapter is responsible for:

- opening datasets
- discovering dimensions
- discovering variables
- coordinate normalization
- spatial selection
- temporal selection
- depth selection
- observation retrieval
- profile retrieval
- model field retrieval
- current retrieval
- handling missing values
- exposing source metadata

The adapter must NOT:

- render data
- know about React
- know about Cesium
- know about Plotly
- generate UI components

---

# 10. Adapter Contract

Conceptually:

```python
class DataAdapter(Protocol):

    def get_observations(...):
        ...

    def get_model_field(...):
        ...

    def get_profile(...):
        ...

    def get_current(...):
        ...

    def get_sar_drift(...):
        ...

    def get_provenance(...):
        ...
```

Exact method signatures should follow the existing implementation where possible.

Do not rewrite working interfaces without a demonstrated reason.

---

# 11. Layer 3 — Scientific Engine

The Scientific Engine is the computational core.

It sits above raw data adapters.

Architecture:

```text
DataAdapter
     ↓
Scientific Engine
     ├── Sampling
     ├── Matching
     ├── Profiles
     ├── Residuals
     ├── Statistics
     ├── Feature Detection
     ├── Current Analysis
     ├── Scenario Simulation
     └── Provenance
```

The Science Engine must be independent of the frontend.

---

# 12. Scientific Engine Responsibilities

The Science Engine may perform:

- nearest-neighbour selection
- interpolation
- model-observation matching
- profile extraction
- residual calculation
- RMSE
- MAE
- bias
- correlation
- temperature gradients
- thermocline estimation
- mixed-layer estimation
- current speed
- current direction
- vertical current shear
- anomaly calculations
- drift integration
- coverage analysis

Each calculation must be independently testable.

---

# 13. Scientific Engine Rule

Scientific calculations should be pure or close to pure whenever possible.

For example:

```text
input:
profile

output:
thermocline depth
```

The calculation should not know whether the result will be:

- displayed in Plotly
- shown in a table
- exported
- used in a scenario

This makes scientific logic reusable.

---

# 14. Layer 4 — API Layer

FastAPI exposes normalized operations to the browser.

The API must not expose raw NetCDF internals unnecessarily.

Instead of:

```text
GET raw-netcdf-variable
```

prefer:

```text
GET /api/model-field
```

with meaningful query parameters.

---

# 15. API Boundary

The browser communicates with:

```text
FastAPI
```

The browser must not directly access:

```text
GLORYS NetCDF
Argo NetCDF
filesystem
Copernicus credentials
```

unless a future architecture explicitly introduces a public data service.

---

# 16. Core API

Current/target core endpoints:

```text
GET /api/observations
GET /api/model-field
GET /api/profile
GET /api/sar/drift
```

Additional endpoints may be introduced for:

```text
GET /api/analysis/residual
GET /api/analysis/features
GET /api/analysis/current
GET /api/provenance
GET /api/evidence/{id}
```

Avoid creating endpoints without a concrete frontend or scientific requirement.

---

# 17. API Request Model

A model-field request should conceptually contain:

```json
{
  "variable": "thetao",
  "time": "2024-01-06T00:00:00",
  "depth": 50,
  "bbox": {
    "min_lat": 5,
    "max_lat": 25,
    "min_lon": 75,
    "max_lon": 100
  }
}
```

The exact transport may use query parameters or another established format.

The principle is:

> Request only the scientific subset needed by the current view.

---

# 18. API Response Model

The API should return normalized domain data.

Example:

```json
{
  "variable": "thetao",
  "units": "degC",
  "time": "2024-01-06T00:00:00",
  "depth": 50,
  "latitude": [],
  "longitude": [],
  "values": [],
  "provenance": {}
}
```

The exact shape should follow the current TypeScript/Python contracts.

Do not create separate incompatible response structures for every visualization.

---

# 19. Domain Models

Core domain concepts:

```text
Observation
ModelField
ProfileData
CurrentVector
ResidualProfile
DerivedFeature
Scenario
Provenance
```

---

# 20. Observation Model

Conceptual structure:

```text
Observation
├── id
├── platform_id
├── type
├── latitude
├── longitude
├── timestamp
├── available_depth
├── variables
└── quality
```

Observation data must remain distinguishable from model data.

---

# 21. ModelField Model

Conceptual:

```text
ModelField
├── variable
├── units
├── timestamp
├── depth
├── latitude
├── longitude
├── values
└── provenance
```

---

# 22. Profile Model

Conceptual:

```text
ProfileData
├── location
├── timestamp
├── depth
├── observed
├── modeled
├── residual
├── units
└── provenance
```

The model and observation arrays must remain aligned only where valid.

---

# 23. Current Model

Conceptual:

```text
CurrentVector
├── latitude
├── longitude
├── depth
├── timestamp
├── u
├── v
├── speed
├── direction
└── provenance
```

---

# 24. Residual Model

Conceptual:

```text
ResidualProfile
├── depth
├── observation
├── model
├── residual
├── valid
├── statistics
└── provenance
```

---

# 25. Derived Feature Model

Conceptual:

```text
DerivedFeature
├── type
├── value
├── units
├── location
├── depth
├── timestamp
├── method
├── inputs
└── provenance
```

Example:

```text
type:
thermocline

value:
76 m

method:
documented temperature-gradient criterion
```

---

# 26. Scenario Model

Conceptual:

```text
Scenario
├── type
├── start
├── start_time
├── duration
├── depth
├── parameters
├── trajectory
├── source_model
├── method
└── provenance
```

---

# 27. Layer 5 — Application State

The frontend requires a centralized scientific interaction state.

Zustand is currently used.

The application state should represent:

```text
current location
current time
current depth
current variable
selected observation
active mode
active layers
visualization settings
analysis state
scenario state
```

---

# 28. Global Scientific State

Conceptual:

```text
ScientificState
├── location
├── time
├── depth
├── variable
├── dataset
├── observation
├── model
├── comparison
├── derived_features
└── scenario
```

The goal is synchronization.

Changing one fundamental dimension should update dependent views.

---

# 29. State Dependency Graph

```text
TIME
 │
 ├──────────────┐
 ↓              ↓
MODEL FIELD   OBSERVATION MATCH
 │              │
 ↓              ↓
CURRENT       PROFILE
 │              │
 └──────┬───────┘
        ↓
   COMPARISON
        ↓
 DERIVED FEATURES
        ↓
   SCENARIO
```

---

# 30. Single Analytical Context

The following values form the core analytical context:

```text
Location
Time
Depth
Variable
Dataset
Observation
```

The system should avoid independent controls that create conflicting states.

For example:

A profile should not silently refer to a different time than the globe.

---

# 31. Synchronized Cursor

The application should eventually maintain a synchronized analytical cursor.

Conceptually:

```text
Cursor
├── latitude
├── longitude
├── depth
└── time
```

This cursor drives:

```text
Globe
Water Column
Profile
Residual
Current
```

This is a major interaction principle.

---

# 32. Mode State

The application should maintain:

```text
mode:
  explore
  evidence
  response
```

Modes should not create separate applications.

They are different views over the same scientific state.

---

# 33. Layer 6 — Visualization

Visualization consists of:

```text
Cesium
Three.js/WebGL
Plotly
HTML/CSS
```

Each tool has a specific role.

---

# 34. Cesium Responsibilities

Cesium is responsible primarily for:

- globe
- geographic context
- camera
- terrain/basemap
- geographic markers
- regional navigation
- large-scale spatial context

Cesium should not be forced to perform every scientific visualization task.

---

# 35. Three.js/WebGL Responsibilities

Three.js/WebGL should handle specialized scientific rendering such as:

- water-column geometry
- depth slices
- isosurfaces
- current particles
- dense field visualization
- vertical sections

Use WebGL where browser-side GPU rendering creates meaningful performance advantages.

---

# 36. Plotly Responsibilities

Plotly is appropriate for:

- profiles
- residual plots
- time series
- comparison charts
- scientific inspection graphs

Charts should remain visually integrated with the main scientific state.

---

# 37. Visualization Rule

Every visualization must answer a scientific question.

Bad:

```text
3D particle effect
```

Good:

```text
current particles showing flow direction
```

Bad:

```text
glowing animated globe
```

Good:

```text
3D field showing depth-resolved temperature structure
```

---

# 38. Rendering Pipeline

Conceptually:

```text
Scientific API
      ↓
Normalized response
      ↓
Frontend state
      ↓
Transform
      ↓
GPU-friendly representation
      ↓
Cesium / Three.js
```

Scientific source data must not be rendered directly without normalization.

---

# 39. Field Visualization Pipeline

```text
GLORYS thetao
      ↓
xarray subset
      ↓
API
      ↓
normalized field
      ↓
frontend field representation
      ↓
color mapping
      ↓
WebGL
```

---

# 40. Current Visualization Pipeline

```text
GLORYS uo + vo
      ↓
subset
      ↓
speed/direction
      ↓
vector representation
      ↓
WebGL particles/vectors
```

---

# 41. Observation Visualization Pipeline

```text
Argo
 ↓
Observation normalization
 ↓
API
 ↓
Observation state
 ↓
Geographic marker
 ↓
Selection
 ↓
Evidence workflow
```

---

# 42. Evidence Pipeline

```text
Observation selection
       ↓
Observation metadata
       ↓
Model matching
       ↓
Model profile
       ↓
Residual
       ↓
Derived features
       ↓
Evidence workspace
```

---

# 43. Response Pipeline

```text
Scenario input
      ↓
Scientific state
      ↓
Current sampler
      ↓
Numerical integration
      ↓
Trajectory
      ↓
Scenario visualization
      ↓
Replayable state
```

---

# 44. Data Matching Architecture

The initial matching strategy is nearest-neighbour.

For observation:

```text
(lat_o, lon_o, time_o)
```

select:

```text
nearest model latitude
nearest model longitude
nearest model time
```

Depth matching is performed according to the model vertical coordinate.

---

# 45. Future Matching

The architecture should allow:

```text
nearest neighbour
linear interpolation
bilinear interpolation
trilinear interpolation
temporal interpolation
```

without changing the frontend.

The matching method must be explicit.

---

# 46. Scientific Calculation Boundaries

The frontend should NOT calculate scientific quantities such as:

```text
thermocline
MLD
RMSE
model-observation matching
drift integration
```

unless a specific visualization-only calculation is intentionally required.

These calculations belong to the scientific backend.

This ensures:

- consistency
- testability
- reproducibility
- easier scientific validation

---

# 47. Client-Side Calculations

The frontend may perform lightweight rendering calculations such as:

- color normalization
- screen coordinates
- particle interpolation for display
- visual scaling

It must not become a second scientific engine.

---

# 48. Caching Strategy

Scientific datasets can be expensive to open and subset.

The backend should avoid repeatedly opening the same dataset for every request.

Preferred approach:

```text
Application startup
      ↓
Dataset manager
      ↓
Open xarray dataset
      ↓
Reuse safely
```

The implementation must consider:

- concurrency
- memory
- thread/process behavior
- dataset closing
- deployment model

Do not introduce unsafe global state merely for speed.

---

# 49. Request Cache

Frequently repeated queries may be cached.

Potential cache key:

```text
dataset
+
variable
+
time
+
depth
+
bounding box
+
resolution
```

Cache only deterministic scientific responses.

---

# 50. Browser Cache

The frontend may cache:

- observation metadata
- static dataset metadata
- recent model slices
- recent profile responses

Avoid caching huge datasets unnecessarily.

---

# 51. Performance Strategy

Performance optimization should happen in this order:

```text
1. Request only required data
2. Subset server-side
3. Reuse datasets
4. Cache repeated requests
5. Reduce payload size
6. Optimize rendering
7. Add LOD
8. Add more advanced infrastructure only if necessary
```

Do not optimize prematurely through complex infrastructure.

---

# 52. Level of Detail

Large fields should support adaptive resolution.

Example:

```text
Zoomed out
→ coarse grid

Zoomed in
→ medium grid

Focused analysis
→ high-resolution subset
```

The underlying scientific values should remain traceable to the source dataset.

---

# 53. WebGL Performance

Avoid:

- unnecessary geometry duplication
- millions of DOM nodes
- unbounded particle counts
- repeated GPU buffer creation
- unnecessary React rerenders

Prefer:

- instancing
- typed arrays
- GPU-friendly buffers
- controlled particle counts
- memoized transformations

---

# 54. React Performance

Scientific state updates should not rerender the entire application.

Components should subscribe to only the state they need.

Example:

```text
Depth change
 ↓
field visualization updates
 ↓
profile updates
 ↓
current context updates
```

but unrelated controls should not rebuild unnecessarily.

---

# 55. Error Boundaries

The frontend should isolate failures.

For example:

If:

```text
chlorophyll unavailable
```

the user should still be able to use:

```text
temperature
currents
observations
```

Similarly, a failed chart should not destroy the 3D scene.

---

# 56. Backend Error Model

Errors should be normalized.

Example:

```json
{
  "error": {
    "code": "VARIABLE_UNAVAILABLE",
    "message": "chlorophyll is not available in the selected dataset",
    "details": {}
  }
}
```

Potential error codes:

```text
DATASET_NOT_FOUND
VARIABLE_UNAVAILABLE
TIME_OUT_OF_RANGE
DEPTH_OUT_OF_RANGE
COORDINATE_OUT_OF_RANGE
OBSERVATION_NOT_FOUND
INVALID_PARAMETER
SCIENTIFIC_DATA_ERROR
INTERNAL_ERROR
```

---

# 57. Scientific Missing Values

NaN and missing data must be handled deliberately.

Rules:

```text
NaN
 ↓
invalid scientific point
```

Do not convert:

```text
NaN → 0
```

unless the scientific variable explicitly defines zero as the missing representation.

---

# 58. API Validation

FastAPI should validate:

- latitude
- longitude
- time
- depth
- variable
- scenario parameters

Invalid values should return meaningful errors.

---

# 59. Dataset Discovery

The backend should expose enough metadata for the frontend to know:

```text
available variables
available times
available depths
spatial bounds
units
dataset identity
```

This avoids hardcoding scientific capabilities in the frontend.

---

# 60. Capability Model

Conceptually:

```json
{
  "dataset": "GLORYS12V1",
  "variables": [
    "thetao",
    "uo",
    "vo"
  ],
  "time_range": {},
  "depth_levels": [],
  "spatial_bounds": {}
}
```

Future datasets can return different capabilities.

The UI adapts accordingly.

---

# 61. Provenance Architecture

Every API response that represents scientific information should be able to identify its provenance.

At minimum:

```text
dataset
source
variable
time
depth
coordinates
processing method
matching method
```

Derived results should additionally identify:

```text
algorithm
inputs
parameters
```

---

# 62. Evidence Object

A future Evidence object may combine:

```text
Observation
+
Model State
+
Comparison
+
Derived Features
+
Provenance
```

Conceptually:

```text
Evidence
├── observation
├── model
├── comparison
├── features
├── coverage
└── provenance
```

This allows the frontend to render a complete analytical case from one normalized response.

---

# 63. Scientific Snapshot Architecture

A snapshot should capture state rather than duplicate data.

Example:

```json
{
  "dataset": "GLORYS12V1",
  "time": "...",
  "depth": 80,
  "variable": "thetao",
  "location": {
    "lat": 15,
    "lon": 85
  },
  "observation_id": "7901126",
  "mode": "evidence"
}
```

The application can reconstruct the analysis from the snapshot.

---

# 64. Scenario Replay Architecture

A scenario replay should reference:

```text
dataset
time
location
depth
parameters
method
```

rather than embedding an entire scientific dataset.

This keeps scenario states compact and reproducible.

---

# 65. Security Architecture

Sensitive credentials must never reach:

```text
Git
frontend source
browser bundle
logs
API responses
```

Examples:

```text
Copernicus credentials
server secrets
private provider keys
```

Public browser keys must be restricted at the provider.

---

# 66. Environment Configuration

Expected configuration:

```text
.env
.env.example
```

Example:

```text
OCEAN_DATA_MODE=netcdf
GLORYS_DATA_PATH=backend/data/scientific/glorys12v1_bob_202401.nc
ARGO_DATA_PATH=backend/data/scientific/argo_bob.nc
```

Environment variables should not contain secrets unless necessary.

---

# 67. Development Modes

The application may support:

```text
DEMO
SCIENTIFIC
```

Demo mode:

```text
synthetic/static test data
```

Scientific mode:

```text
real datasets
```

Scientific mode must be the default when real data is present for the SIH build.

---

# 68. Demo Data Rule

Demo data must be explicitly identifiable in development.

It must never silently replace scientific data.

A development fallback should produce a log such as:

```text
WARNING:
Running with DEMO data.
Scientific datasets were not loaded.
```

---

# 69. Deployment Architecture

Initial deployment:

```text
Browser
   ↓
Frontend
   ↓
FastAPI
   ↓
Scientific datasets
```

Possible deployment:

```text
Frontend:
Vercel / static hosting

Backend:
Cloud VM / container platform

Data:
Persistent volume / object storage
```

The exact deployment provider is not an architectural requirement.

---

# 70. Docker

Docker should be supported for reproducibility.

Potential structure:

```text
Dockerfile
docker-compose.yml
```

Possible services:

```text
frontend
backend
```

A database should not be added to Docker unless actually required.

---

# 71. Repository Structure

Recommended final structure:

```text
ocean-viewer/
│
├── docs/
│   ├── 00_PROJECT_VISION.md
│   ├── 01_PRD.md
│   ├── 02_ARCHITECTURE.md
│   ├── 03_SCIENTIFIC_ENGINE.md
│   ├── 04_OBSERVATION_EVIDENCE.md
│   ├── 05_RESPONSE_ENGINE.md
│   ├── 06_DESIGN_SYSTEM.md
│   ├── 07_DATA_AND_PROVENANCE.md
│   ├── 08_API_SPECIFICATION.md
│   ├── 09_PERFORMANCE_AND_SCALABILITY.md
│   ├── 10_IMPLEMENTATION_ROADMAP.md
│   ├── 11_DEMO_AND_JUDGE_FLOW.md
│   ├── 12_TESTING_AND_VALIDATION.md
│   └── 13_HACKATHON_PITCH.md
│
├── backend/
│   ├── data/
│   │   └── scientific/
│   ├── models/
│   ├── services/
│   │   ├── data_adapter.py
│   │   ├── netcdf_adapter.py
│   │   ├── demo_adapter.py
│   │   └── science/
│   ├── api/
│   ├── tests/
│   └── main.py
│
├── src/
│   ├── components/
│   ├── features/
│   │   ├── explore/
│   │   ├── evidence/
│   │   └── response/
│   ├── services/
│   ├── store/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
│
├── public/
│
├── scripts/
│
├── .env.example
├── .gitignore
├── README.md
├── package.json
└── requirements.txt
```

The exact folder structure may evolve, but responsibilities should remain separated.

---

# 72. Frontend Feature Architecture

Recommended:

```text
src/features/
│
├── explore/
│   ├── components/
│   ├── hooks/
│   ├── state/
│   └── utils/
│
├── evidence/
│   ├── components/
│   ├── hooks/
│   ├── state/
│   └── utils/
│
└── response/
    ├── components/
    ├── hooks/
    ├── state/
    └── utils/
```

Shared infrastructure belongs outside feature directories.

---

# 73. Shared Frontend Infrastructure

```text
src/
├── components/
├── services/
├── store/
├── types/
├── utils/
└── hooks/
```

Feature-specific logic should remain in feature folders.

---

# 74. Backend Scientific Architecture

Recommended:

```text
backend/
├── api/
│   ├── observations.py
│   ├── model.py
│   ├── profiles.py
│   ├── analysis.py
│   └── scenarios.py
│
├── services/
│   ├── data_adapter.py
│   ├── netcdf_adapter.py
│   ├── dataset_manager.py
│   ├── science/
│   │   ├── sampling.py
│   │   ├── matching.py
│   │   ├── residuals.py
│   │   ├── statistics.py
│   │   ├── thermocline.py
│   │   ├── mixed_layer.py
│   │   ├── currents.py
│   │   └── drift.py
│   └── provenance.py
│
├── models/
│   ├── data_models.py
│   ├── requests.py
│   └── responses.py
│
└── main.py
```

This structure should be introduced incrementally.

Do not perform a massive rewrite if the existing code already works.

---

# 75. Backend Dependency Direction

Allowed:

```text
API
 ↓
Application Service
 ↓
Science Engine
 ↓
Data Adapter
 ↓
Dataset
```

Not allowed:

```text
Data Adapter
 ↓
API
```

or:

```text
Science Engine
 ↓
React
```

or:

```text
NetCDF adapter
 ↓
Cesium
```

---

# 76. Dependency Inversion

The science engine should depend on normalized interfaces rather than one specific data source.

For example:

```text
Science Engine
      ↓
DataAdapter
      ↓
GLORYS
```

rather than:

```text
Science Engine
      ↓
GLORYS-specific code everywhere
```

---

# 77. Extensibility Example

Adding a new model should ideally require:

```text
New Adapter
+
Dataset Metadata
```

rather than:

```text
Rewrite frontend
+
Rewrite scientific engine
+
Rewrite API
```

---

# 78. Testing Architecture

Tests should exist at multiple levels.

```text
Unit
 ↓
Science
 ↓
API
 ↓
Integration
 ↓
Browser
```

---

# 79. Scientific Unit Tests

Test:

- current speed
- direction
- residual
- RMSE
- thermocline
- MLD
- drift integration
- coordinate conversion

using deterministic known inputs.

---

# 80. Adapter Tests

Test:

- dataset opening
- variable discovery
- coordinate selection
- time selection
- depth selection
- NaN handling
- out-of-domain requests

---

# 81. API Tests

Test:

```text
/api/observations
/api/model-field
/api/profile
/api/sar/drift
```

with:

- valid inputs
- invalid inputs
- boundary inputs
- missing data

---

# 82. Integration Tests

Test the full flow:

```text
Observation
 ↓
Model match
 ↓
Profile
 ↓
Residual
 ↓
Derived feature
```

---

# 83. Browser Tests

Critical browser workflows:

```text
Open application
 ↓
Load model
 ↓
Change depth
 ↓
Change time
 ↓
Select observation
 ↓
Open evidence
 ↓
Compare
 ↓
Run scenario
```

These should be tested before every major demo build.

---

# 84. Architectural Non-Goals

The architecture must not become unnecessarily distributed.

Do not introduce:

- microservices
- Kafka
- Kubernetes
- message queues
- distributed databases
- GraphQL
- complex event buses

unless a demonstrated requirement exists.

For the SIH prototype:

```text
React
+
FastAPI
+
Scientific Engine
+
NetCDF
```

is sufficient.

---

# 85. Architectural Evolution

Architecture should evolve in stages.

```text
Stage 1
Working scientific prototype

Stage 2
Scientific engine separation

Stage 3
Performance optimization

Stage 4
Additional data providers

Stage 5
Scalable deployment

Stage 6
Operational integration
```

Do not build Stage 6 infrastructure during Stage 1.

---

# 86. Architecture Decision Rule

Before introducing a new technology, answer:

1. What problem does it solve?
2. Why can't the current stack solve it?
3. What complexity does it add?
4. Does it improve the judge-facing product?
5. Does it improve scientific correctness?
6. Does it improve scalability?
7. Can the team maintain it?

If the answers are weak, do not introduce it.

---

# 87. AI Coding Agent Rules

An AI coding agent working on NIRIKSHAN must:

1. Read the project vision.
2. Read the PRD.
3. Read this architecture document.
4. Inspect existing code.
5. Reuse working components.
6. Make incremental changes.
7. Avoid large rewrites without approval.
8. Preserve scientific data flow.
9. Never silently reintroduce mock data.
10. Never hardcode scientific results.
11. Keep API contracts synchronized.
12. Run tests after changes.
13. Run frontend build after frontend changes.
14. Report all assumptions.
15. Report all scientific limitations.
16. Never redesign the UI unless explicitly instructed.
17. Never add unrelated features.

---

# 88. Implementation Rule

When implementing a feature, follow:

```text
Requirement
 ↓
Scientific method
 ↓
Backend contract
 ↓
Frontend state
 ↓
Visualization
 ↓
Interaction
 ↓
Validation
```

Do not begin by creating UI components without defining the underlying data contract.

---

# 89. Definition of Architectural Success

The architecture is successful when:

```text
A new dataset
```

can be introduced without rewriting:

```text
the entire frontend
```

and:

```text
A new scientific analysis
```

can be introduced without rewriting:

```text
the visualization engine
```

and:

```text
A new visualization
```

can consume:

```text
existing scientific results
```

without duplicating scientific calculations.

---

# 90. Final Architecture

The final conceptual architecture is:

```text
                         NIRIKSHAN
                              │
              ┌───────────────┼────────────────┐
              │               │                │
              ▼               ▼                ▼
           EXPLORE         EVIDENCE         RESPONSE
              │               │                │
              └───────────────┼────────────────┘
                              ▼
                     APPLICATION STATE
                              │
                              ▼
                         API CLIENT
                              │
                              ▼
                           FASTAPI
                              │
                              ▼
                      SCIENTIFIC ENGINE
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
          SAMPLING        COMPARISON       SCENARIOS
             │                │                │
             └────────────────┼────────────────┘
                              ▼
                         DATA ADAPTER
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
                 GLORYS               ARGO
                 NetCDF               NetCDF
                    │                   │
                    └─────────┬─────────┘
                              ▼
                       SCIENTIFIC STATE
                              │
                              ▼
                    CESIUM / THREE.JS /
                         PLOTLY
                              │
                              ▼
                           USER
```

The architectural goal is simple:

> **One scientific state. Multiple analytical views. One source of truth.**
```

---

### One important implementation note

**Don't give this document to the agent with “rewrite the architecture now.”**

Give it as a **constraint/reference document**.

The agent should first inspect the current repository and map:

```text
CURRENT CODE
    ↓
TARGET ARCHITECTURE
    ↓
GAPS
    ↓
SMALL MIGRATIONS
```

That avoids destroying the working GLORYS + Argo implementation we already have.

