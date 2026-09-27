# `14_REPOSITORY_AND_CODE_STRUCTURE.md`

```md
# NIRIKSHAN — Repository & Code Structure Specification

**Document:** 14_REPOSITORY_AND_CODE_STRUCTURE.md  
**Product:** NIRIKSHAN — 3D Ocean Analysis & Response Workspace  
**Hackathon:** Smart India Hackathon 2026  
**Problem Statement:** SIH26067  
**Team:** ZWP  
**Status:** Implementation Specification  
**Audience:** Developers, AI coding agents, reviewers, maintainers

---

## 1. Purpose

This document defines the repository structure, module boundaries, dependency rules, ownership boundaries, migration strategy, and coding-agent rules for implementing NIRIKSHAN.

The purpose is to ensure that the implementation grows from the existing working prototype into a maintainable scientific application without requiring a destructive rewrite.

The repository already contains a functioning foundation:

- React + TypeScript frontend
- Vite
- Cesium
- Three.js
- Plotly
- FastAPI backend
- xarray
- NetCDF
- real GLORYS12V1 model data
- real Argo observation data
- model-field API
- observation API
- profile API
- SAR drift API
- CARTO/Cesium basemap integration

The implementation must preserve these capabilities while progressively introducing the NIRIKSHAN architecture.

---

# 2. Core Repository Principle

The repository must follow this implementation order:

> **Existing Working System → Structured Modules → Scientific Engine → Evidence System → Analytical UX → Response → Validation → Polish**

Do not perform a large rewrite merely to make the repository look architecturally perfect.

The application must remain runnable after every meaningful implementation phase.

### Primary rule

> **Never sacrifice working scientific functionality for structural refactoring.**

A refactor is successful only if:

1. the application still builds,
2. the backend still starts,
3. real GLORYS data still loads,
4. real Argo observations still load,
5. model-field requests still work,
6. profile requests still work,
7. SAR requests still work,
8. existing visualization remains functional.

---

# 3. Target Repository Structure

The target repository should evolve toward the following structure:

```text
ocean-viewer/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.tsx
│   │   │   ├── routes.ts
│   │   │   ├── providers/
│   │   │   └── appConfig.ts
│   │   │
│   │   ├── components/
│   │   │   ├── shell/
│   │   │   ├── globe/
│   │   │   ├── observations/
│   │   │   ├── evidence/
│   │   │   ├── profile/
│   │   │   ├── waterColumn/
│   │   │   ├── response/
│   │   │   ├── controls/
│   │   │   ├── provenance/
│   │   │   └── common/
│   │   │
│   │   ├── features/
│   │   │   ├── explore/
│   │   │   ├── evidence/
│   │   │   ├── response/
│   │   │   ├── observations/
│   │   │   ├── model/
│   │   │   └── provenance/
│   │   │
│   │   ├── state/
│   │   │   ├── scientificStore.ts
│   │   │   ├── evidenceStore.ts
│   │   │   ├── responseStore.ts
│   │   │   └── uiStore.ts
│   │   │
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── datasets.ts
│   │   │   ├── observations.ts
│   │   │   ├── model.ts
│   │   │   ├── profiles.ts
│   │   │   ├── evidence.ts
│   │   │   ├── derivedFeatures.ts
│   │   │   └── sar.ts
│   │   │
│   │   ├── domain/
│   │   │   ├── observations.ts
│   │   │   ├── model.ts
│   │   │   ├── profiles.ts
│   │   │   ├── evidence.ts
│   │   │   ├── derivedFeatures.ts
│   │   │   ├── scenario.ts
│   │   │   └── provenance.ts
│   │   │
│   │   ├── visualization/
│   │   │   ├── cesium/
│   │   │   ├── three/
│   │   │   ├── plotly/
│   │   │   ├── colorScales.ts
│   │   │   └── visualizationUtils.ts
│   │   │
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── styles/
│   │   │   ├── tokens.css
│   │   │   ├── globals.css
│   │   │   └── scientific.css
│   │   │
│   │   └── main.tsx
│   │
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── dependencies.py
│   │   │
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── health.py
│   │   │   │   ├── datasets.py
│   │   │   │   ├── observations.py
│   │   │   │   ├── model.py
│   │   │   │   ├── profiles.py
│   │   │   │   ├── evidence.py
│   │   │   │   ├── features.py
│   │   │   │   └── sar.py
│   │   │   └── errors.py
│   │   │
│   │   ├── models/
│   │   │   ├── observation.py
│   │   │   ├── model_field.py
│   │   │   ├── profile.py
│   │   │   ├── evidence.py
│   │   │   ├── derived_feature.py
│   │   │   ├── scenario.py
│   │   │   └── provenance.py
│   │   │
│   │   ├── services/
│   │   │   ├── dataset_service.py
│   │   │   ├── observation_service.py
│   │   │   ├── model_service.py
│   │   │   ├── profile_service.py
│   │   │   ├── evidence_service.py
│   │   │   ├── feature_service.py
│   │   │   ├── current_service.py
│   │   │   ├── sar_service.py
│   │   │   └── provenance_service.py
│   │   │
│   │   ├── scientific/
│   │   │   ├── matching.py
│   │   │   ├── residuals.py
│   │   │   ├── currents.py
│   │   │   ├── gradients.py
│   │   │   ├── thermocline.py
│   │   │   ├── mixed_layer.py
│   │   │   ├── shear.py
│   │   │   ├── distance.py
│   │   │   ├── sar.py
│   │   │   └── validation.py
│   │   │
│   │   ├── adapters/
│   │   │   ├── base.py
│   │   │   ├── netcdf_adapter.py
│   │   │   ├── argo_adapter.py
│   │   │   └── demo_adapter.py
│   │   │
│   │   ├── data/
│   │   │   ├── registry/
│   │   │   └── manifests/
│   │   │
│   │   └── utils/
│   │
│   ├── tests/
│   │   ├── scientific/
│   │   ├── services/
│   │   ├── api/
│   │   ├── adapters/
│   │   └── fixtures/
│   │
│   ├── data/
│   │   └── scientific/
│   │       ├── glorys12v1_bob_202401.nc
│   │       └── argo_bob.nc
│   │
│   ├── scripts/
│   │   ├── inspect_dataset.py
│   │   ├── validate_dataset.py
│   │   └── seed_demo.py
│   │
│   ├── requirements.txt
│   └── Dockerfile
│
├── docs/
│   ├── 00_PROJECT_VISION.md
│   ├── 01_PRD.md
│   ├── 02_ARCHITECTURE.md
│   ├── 03_SCIENTIFIC_ENGINE.md
│   ├── 04_OBSERVATION_EVIDENCE.md
│   ├── 05_UI_UX_SYSTEM.md
│   ├── 06_API_CONTRACTS.md
│   ├── 07_DATA_PIPELINE_AND_INGESTION.md
│   ├── 08_INTERACTION_AND_ANALYTICAL_WORKFLOWS.md
│   ├── 09_PERFORMANCE_AND_RENDERING.md
│   ├── 10_TESTING_AND_VALIDATION.md
│   ├── 11_SECURITY_AND_DEPLOYMENT.md
│   ├── 12_DEMO_AND_PITCH_SPECIFICATION.md
│   ├── 13_IMPLEMENTATION_ROADMAP.md
│   └── 14_REPOSITORY_AND_CODE_STRUCTURE.md
│
├── .env.example
├── .gitignore
├── README.md
└── docker-compose.yml
```

The structure above is the **target architecture**, not a requirement to recreate the entire repository immediately.

---

# 4. Current Repository → Target Repository

The current repository may not exactly match the target tree.

Therefore implementation must be incremental.

## Current architectural reality

The working prototype already has approximately these responsibilities:

```text
frontend
   ↓
React components
   ↓
API client
   ↓
FastAPI
   ↓
services / adapters
   ↓
xarray
   ↓
NetCDF
```

The goal is to make those responsibilities explicit.

Do not duplicate the existing scientific pipeline simply because the target folder names are different.

---

# 5. Frontend Architecture

The frontend is responsible for:

- interaction,
- visualization,
- application state,
- API communication,
- presentation,
- evidence navigation,
- scenario controls.

The frontend must **not** become the source of truth for scientific calculations.

---

# 6. Frontend Application Layer

```text
frontend/src/app/
```

Responsibilities:

- application bootstrap
- routing
- global providers
- application configuration
- top-level mode selection

Example:

```text
App.tsx
main.tsx
routes.ts
appConfig.ts
```

The application layer should remain thin.

It should compose features rather than contain scientific logic.

---

# 7. Frontend Components

Components are visual/interaction units.

They should not contain large scientific algorithms.

## Shell

```text
components/shell/
```

Contains:

- TopNav
- ModeNavigation
- StatusBar
- DatasetIndicator
- ApplicationShell

---

## Globe

```text
components/globe/
```

Contains:

- Scene3D
- Globe
- ObservationLayer
- CurrentVectorLayer
- ModelFieldLayer
- CameraController
- GlobeControls

Cesium-specific logic should remain isolated here whenever possible.

---

## Evidence

```text
components/evidence/
```

Contains:

- EvidencePanel
- ObservationDetail
- ModelMatch
- ResidualSummary
- DerivedFeatureSummary
- EvidenceGraph
- ProvenancePanel

---

## Profile

```text
components/profile/
```

Contains:

- ProfileChart
- ModelObservationComparison
- ResidualProfile
- ProfileCursor
- DepthAxis

Plotly integration belongs here.

---

## Water Column

```text
components/waterColumn/
```

Contains:

- WaterColumnLens
- DepthSlice
- Isosurface
- VerticalProfile
- AnalyticalCursor

Three.js/WebGL-specific rendering belongs here.

---

## Response

```text
components/response/
```

Contains:

- ResponseWorkspace
- ScenarioControls
- ScenarioTimeline
- TrajectoryLayer
- ScenarioSummary
- LimitationPanel

---

# 8. Frontend Feature Architecture

Feature modules should represent product behavior rather than visual widgets.

Example:

```text
features/
├── explore/
├── evidence/
├── response/
├── observations/
├── model/
└── provenance/
```

A feature can coordinate:

```text
UI
↓
state
↓
API
↓
domain
```

but must not bypass the backend scientific engine.

---

# 9. Frontend Domain Models

```text
frontend/src/domain/
```

Contains TypeScript interfaces representing scientific concepts.

Examples:

```ts
Observation
ModelField
ModelMatch
ProfileData
ResidualProfile
DerivedFeature
CurrentVector
Scenario
Provenance
EvidenceCase
```

Domain objects must correspond to backend API contracts.

Do not create multiple incompatible versions of the same scientific object.

---

# 10. Frontend State

The global state must be divided according to responsibility.

Recommended:

```text
state/
├── scientificStore.ts
├── evidenceStore.ts
├── responseStore.ts
└── uiStore.ts
```

---

## Scientific Store

Responsible for:

```text
dataset
time
depth
variable
latitude
longitude
selected observation
active layers
```

It represents the current scientific context.

---

## Evidence Store

Responsible for:

```text
selected observation
model match
profile
residual
derived features
evidence case
provenance
```

---

## Response Store

Responsible for:

```text
scenario
trajectory
scenario time
simulation settings
scenario playback
```

---

## UI Store

Responsible for:

```text
panels
drawers
hover states
layout
temporary selections
loading states
```

UI state must not be mixed with scientific state unnecessarily.

---

# 11. API Client Architecture

All backend communication must pass through:

```text
frontend/src/api/
```

Example:

```text
api/
├── client.ts
├── datasets.ts
├── observations.ts
├── model.ts
├── profiles.ts
├── evidence.ts
├── derivedFeatures.ts
└── sar.ts
```

Do not place raw `fetch()` calls throughout components.

Bad:

```ts
useEffect(() => {
  fetch("/api/model-field?...") 
}, []);
```

Preferred:

```ts
const field = await modelApi.getField(params);
```

This keeps API contracts centralized.

---

# 12. Backend Architecture

The backend must maintain a strict separation:

```text
API
 ↓
Service
 ↓
Scientific Engine
 ↓
Adapter
 ↓
Dataset
```

A route should not directly perform xarray calculations.

Bad:

```text
FastAPI route
    ↓
xarray
    ↓
scientific calculation
```

Preferred:

```text
FastAPI route
    ↓
ModelService
    ↓
Scientific Engine
    ↓
NetCDFAdapter
    ↓
xarray
```

---

# 13. Backend API Routes

```text
backend/app/api/routes/
```

Routes should be thin.

Their responsibilities are:

1. validate input,
2. call service,
3. serialize response,
4. return errors using standard format.

Routes must not:

- calculate thermoclines,
- calculate residuals,
- integrate SAR,
- manipulate raw NetCDF,
- contain large business logic.

---

# 14. Backend Services

Services orchestrate scientific operations.

Example:

```text
model_service.py
```

may perform:

```text
request
→ validate dataset
→ request adapter subset
→ scientific normalization
→ build response
```

But actual calculations belong in scientific modules.

---

# 15. Scientific Engine

The scientific engine is one of the most important boundaries in NIRIKSHAN.

```text
backend/app/scientific/
```

Contains deterministic scientific calculations.

Examples:

```text
matching.py
residuals.py
currents.py
gradients.py
thermocline.py
mixed_layer.py
shear.py
distance.py
sar.py
validation.py
```

Each module should ideally expose small, testable functions.

Example:

```python
calculate_current_speed(u, v)
```

rather than embedding the calculation inside a FastAPI endpoint.

---

# 16. Scientific Engine Rule

Scientific calculations must be:

- deterministic,
- documented,
- unit-aware,
- independently testable,
- traceable,
- reproducible.

No scientific calculation should depend on:

- React state,
- browser rendering,
- component lifecycle,
- CSS,
- UI timing.

---

# 17. Data Adapter Layer

```text
backend/app/adapters/
```

The adapter isolates external data representation from the scientific engine.

Conceptually:

```text
Scientific Engine
       ↓
Data Adapter
       ↓
GLORYS / Argo / future datasets
```

The scientific engine should not know:

```text
filename
directory structure
Copernicus CLI
download credentials
raw NetCDF storage details
```

---

# 18. NetCDF Adapter

The NetCDF adapter is responsible for:

- opening datasets,
- discovering coordinates,
- variable mapping,
- selecting time,
- selecting spatial region,
- selecting depth,
- handling missing values,
- exposing normalized data.

It must not silently change scientific meaning.

---

# 19. Argo Adapter

The Argo adapter is responsible for:

- loading profiles,
- preserving platform identity,
- preserving observation coordinates,
- preserving observation time,
- reading temperature,
- reading pressure/depth,
- reading salinity when available,
- preserving QC information,
- filtering invalid measurements according to documented rules.

---

# 20. Demo Adapter

The demo adapter may exist for:

- deterministic development fixtures,
- UI development,
- automated tests,
- fallback demonstration.

It must never silently replace real scientific data in the production/demo path.

If demo data is being used, the application must make that state explicit.

---

# 21. Dataset Registry

Dataset metadata should eventually live separately from implementation code.

Example:

```text
backend/app/data/registry/
```

A dataset entry should contain concepts such as:

```yaml
id:
name:
source:
variables:
time_range:
spatial_extent:
vertical_levels:
format:
version:
```

The registry should become the foundation for future:

- multiple models,
- multiple regions,
- multiple observation types,
- new time ranges.

---

# 22. Scientific Dataset Files

Current scientific files:

```text
backend/data/scientific/
```

Example:

```text
glorys12v1_bob_202401.nc
argo_bob.nc
```

These are runtime scientific assets.

They must:

- not be committed unnecessarily,
- remain ignored by Git,
- be validated before activation,
- have provenance metadata,
- have predictable dataset identifiers.

---

# 23. Git Rules

The repository must ignore:

```text
*.nc
*.nc4
*.cdf
__pycache__/
*.pyc
.env
.env.*
.DS_Store
node_modules/
dist/
```

Exceptions may be added only when explicitly justified.

Scientific datasets should not be committed merely because they are convenient during development.

---

# 24. Important Git Security Rule

If a credential, token, or private secret has ever entered Git history:

1. remove it from the working tree,
2. rotate the credential if necessary,
3. inspect repository history,
4. remove history only when justified,
5. never assume `.gitignore` alone removes an already committed secret.

Frontend `VITE_*` values must be treated as public/client-visible configuration.

---

# 25. Dependency Direction

The architecture must follow:

```text
UI
 ↓
Feature
 ↓
State / API
 ↓
Domain
 ↓
Backend API
 ↓
Services
 ↓
Scientific Engine
 ↓
Adapters
 ↓
Data
```

The reverse direction is forbidden.

For example:

```text
Scientific engine → React component
```

is not allowed.

---

# 26. Forbidden Coupling

Avoid:

```text
Component → xarray
Component → NetCDF
Component → FastAPI internals
Component → scientific formula
Component → dataset filename
```

Also avoid:

```text
Scientific module → HTTP request
Scientific module → React
Scientific module → browser APIs
```

---

# 27. Cesium Boundary

Cesium should be treated as a visualization subsystem.

```text
Cesium
↓
Visualization layer
↓
Normalized frontend domain data
```

Cesium must not determine scientific truth.

For example:

- camera position does not define model coordinates,
- visual interpolation does not replace scientific interpolation,
- rendered vectors are derived from API data,
- globe rendering does not perform scientific calculations.

---

# 28. Three.js Boundary

Three.js is responsible for specialized 3D scientific visualization.

Examples:

- depth slices,
- vertical sections,
- isosurfaces,
- vector fields,
- water-column visualization.

Three.js should consume prepared data.

Do not perform expensive scientific calculations inside animation loops.

---

# 29. Plotly Boundary

Plotly is responsible for analytical profile visualization.

Examples:

- temperature profile,
- model vs observation,
- residual profile,
- depth cursor,
- feature markers.

The profile data should be generated by the backend scientific layer.

---

# 30. Component Ownership Rules

Each component should have one primary responsibility.

Example:

```text
ObservationMarker
```

should render a marker.

It should not:

- calculate model matching,
- calculate residuals,
- load NetCDF,
- run SAR.

Instead:

```text
ObservationMarker
   ↓
select observation
   ↓
Evidence workflow
   ↓
API
   ↓
Scientific engine
```

---

# 31. File Size Rule

If a file becomes difficult to understand because it contains multiple unrelated responsibilities, split it.

Prefer:

```text
ObservationLayer.tsx
ObservationMarker.tsx
ObservationTooltip.tsx
```

over:

```text
EverythingOcean.tsx
```

Do not split files purely for arbitrary architecture.

---

# 32. Naming Rules

Use scientific/domain terminology consistently.

Preferred:

```text
ModelField
Observation
ResidualProfile
WaterColumnLens
EvidenceCase
Scenario
Provenance
```

Avoid vague names:

```text
DataThing
OceanThing
SmartPanel
MagicEngine
AIManager
```

Naming should communicate scientific purpose.

---

# 33. State Ownership Rules

A value should have one authoritative owner.

Example:

```text
selectedObservationId
```

should not independently exist in:

```text
App.tsx
ObservationPanel.tsx
Globe.tsx
Profile.tsx
```

Instead:

```text
scientific/evidence store
        ↓
components subscribe
```

---

# 34. API Request Lifecycle

Every asynchronous scientific request must support:

```text
idle
loading
success
error
```

For rapidly changing controls such as:

- time,
- depth,
- variable,
- selected observation,

the application should prevent stale responses from overwriting newer state.

Example:

```text
Request A
Request B

B completes first
→ apply B

A completes later
→ discard A
```

---

# 35. Caching

Caching should be introduced only where it provides real value.

High-value cache candidates:

```text
dataset metadata
observation list
model field at common depth/time
selected profile
derived feature result
```

Do not create a complicated caching infrastructure before profiling shows the need.

---

# 36. Testing Structure

Backend:

```text
backend/tests/
├── scientific/
├── services/
├── api/
├── adapters/
└── fixtures/
```

Tests should follow the architecture.

Examples:

```text
scientific/test_currents.py
scientific/test_residuals.py
scientific/test_matching.py
scientific/test_sar.py
```

API tests should verify contracts rather than duplicate scientific calculations.

---

# 37. Frontend Testing

Frontend tests should focus on:

- state transitions,
- API integration,
- component behavior,
- loading states,
- error states,
- evidence workflow,
- response workflow.

Scientific formulas should not be duplicated in frontend tests.

---

# 38. Migration Strategy

The repository must be migrated in vertical slices.

Do not perform:

```text
delete everything
→ recreate architecture
→ reconnect science later
```

Preferred:

```text
existing working feature
↓
extract boundary
↓
test
↓
move responsibility
↓
connect new module
↓
test
↓
continue
```

---

# 39. Migration Phase 1 — Protect the Working Baseline

Before structural changes:

```text
npm run build
```

and verify:

```text
backend starts
GET /api/observations
GET /api/model-field
GET /api/profile
GET /api/sar/drift
```

Create a Git checkpoint.

This checkpoint becomes the rollback point.

---

# 40. Migration Phase 2 — Stabilize API Client

Move frontend network calls into:

```text
src/api/
```

Create:

```text
client.ts
model.ts
observations.ts
profiles.ts
sar.ts
```

Do not change endpoint behavior during this phase unless required.

Acceptance:

- existing frontend still works,
- all requests use the centralized API client,
- build succeeds.

---

# 41. Migration Phase 3 — Establish Domain Types

Create shared frontend domain types for:

```text
Observation
ModelField
Profile
Current
Scenario
Provenance
```

Replace duplicate local interfaces gradually.

Do not modify scientific semantics during this phase.

---

# 42. Migration Phase 4 — Scientific Module Extraction

Move calculations out of:

```text
routes
services
components
```

into:

```text
backend/app/scientific/
```

Start with:

```text
currents.py
matching.py
residuals.py
sar.py
```

Then:

```text
gradients.py
thermocline.py
mixed_layer.py
shear.py
distance.py
```

Every extraction should receive tests.

---

# 43. Migration Phase 5 — Evidence Workflow

Implement:

```text
Observation
↓
Model Match
↓
Profile
↓
Residual
↓
Derived Features
↓
EvidenceCase
```

The evidence workflow should become a first-class backend service.

Suggested location:

```text
backend/app/services/evidence_service.py
```

---

# 44. Migration Phase 6 — Global Scientific State

Create:

```text
scientificStore.ts
```

and move global scientific context into it.

The state should represent:

```text
dataset
time
depth
variable
location
observation
mode
```

Components should subscribe to state instead of maintaining duplicated values.

---

# 45. Migration Phase 7 — Evidence UI

Build the evidence workspace around:

```text
Observation
Model Match
Profile
Residual
Derived Features
Provenance
```

The evidence UI should not be a generic dashboard.

It should answer:

> “Why should I trust what I am seeing?”

---

# 46. Migration Phase 8 — Water-Column Lens

Add specialized visualization:

```text
WaterColumnLens
```

It should consume:

```text
ModelField
ProfileData
DerivedFeatures
CurrentField
```

It should not directly access NetCDF.

---

# 47. Migration Phase 9 — Response Mode

Connect:

```text
EvidenceCase
      ↓
CurrentField
      ↓
SAR Engine
      ↓
Trajectory
      ↓
Scenario Replay
```

The scenario must use the same scientific current source shown in the analysis workflow.

This relationship is critical.

---

# 48. Migration Phase 10 — Provenance

Every important scientific result should be traceable to:

```text
dataset
source
time
location
variable
method
parameters
```

The frontend should expose this through a restrained provenance interface.

---

# 49. AI Coding Agent Workflow

Every AI coding agent must follow this sequence.

## Step 1

Read the relevant specification documents.

At minimum:

```text
01_PRD.md
02_ARCHITECTURE.md
03_SCIENTIFIC_ENGINE.md
06_API_CONTRACTS.md
13_IMPLEMENTATION_ROADMAP.md
14_REPOSITORY_AND_CODE_STRUCTURE.md
```

Read additional documents when the task touches them.

---

## Step 2

Inspect the current repository.

Never assume the repository exactly matches this specification.

---

## Step 3

Identify:

```text
existing implementation
existing dependencies
existing API
existing tests
existing behavior
```

---

## Step 4

Make the smallest coherent change.

Avoid unrelated cleanup.

---

## Step 5

Run appropriate validation.

Examples:

```bash
npm run build
```

Backend:

```bash
python -m pytest
```

API smoke tests where relevant.

---

## Step 6

Report:

```text
Files changed
What changed
Tests run
Build result
Remaining issues
```

---

# 50. AI Agent Modification Permissions

## Generally safe to modify

```text
frontend/src/components/
frontend/src/features/
frontend/src/state/
frontend/src/api/
frontend/src/domain/
frontend/src/visualization/
backend/app/services/
backend/app/scientific/
backend/app/api/
backend/tests/
```

provided the change follows the relevant specifications.

---

## Modify carefully

```text
backend/app/adapters/
backend/data/registry/
backend/app/models/
API contracts
dataset loading
SAR implementation
```

These areas affect scientific integrity.

---

## Do not modify casually

```text
scientific datasets
credentials
environment secrets
deployment configuration
Git history
scientific formulas
coordinate conventions
API response semantics
```

Changes require explicit justification.

---

# 51. No Mock Regression Rule

Once a real scientific implementation exists, an AI agent must not replace it with:

```text
Math.random()
procedural noise
fake observations
hardcoded scientific values
placeholder SAR trajectories
fabricated model fields
```

for the actual demo/application path.

Mocks are allowed only in:

```text
tests
isolated development fixtures
explicit demo fallback
```

and must be clearly identified.

---

# 52. No Fake Intelligence Rule

Do not add:

```text
AI Insight
AI Risk Score
AI Confidence
AI Prediction
AI Recommendation
```

unless the underlying calculation is actually implemented and scientifically defensible.

The system may eventually provide deterministic analytical summaries such as:

```text
Largest model-observation temperature difference:
X °C at Y m
```

but it must not manufacture conclusions.

---

# 53. No Scientific Logic in UI

Bad:

```tsx
const thermocline =
  profile.reduce(...)
```

inside a React component.

Preferred:

```text
Backend scientific engine
        ↓
DerivedFeature
        ↓
API
        ↓
React visualization
```

---

# 54. No Visualization-Driven Science

Do not change scientific calculations merely because a different visualization is visually easier.

Scientific truth comes first.

The visualization adapts to the scientific result.

---

# 55. No Big-Bang Rewrite

Never replace the complete frontend/backend simply to achieve this directory structure.

The current application already contains valuable working infrastructure.

The target structure is achieved through extraction and migration.

---

# 56. Definition of Done for a Module

A module is considered complete when:

- responsibility is clear,
- dependencies are one-directional,
- scientific logic is deterministic where applicable,
- API contract is documented,
- tests exist where appropriate,
- existing behavior remains functional,
- build passes,
- errors are handled,
- no mock regression occurred,
- no unrelated UI redesign was introduced.

---

# 57. Definition of Done for a Feature

A NIRIKSHAN feature is complete when:

```text
Data
 ↓
Scientific Logic
 ↓
API
 ↓
Application State
 ↓
Visualization
 ↓
Interaction
 ↓
Validation
```

are connected.

A visually complete component that does not connect to real scientific data is **not complete**.

---

# 58. Priority Mapping

## P0

Repository work required for:

```text
real GLORYS
real Argo
model field
observation selection
model matching
profile comparison
residual
current field
SAR
provenance
```

---

## P1

Then:

```text
EvidenceCase
Water-Column Lens
analytical cursor
thermocline
MLD
current shear
scenario replay
scientific snapshot
```

---

## P2

Then:

```text
transects
residual maps
coverage visualization
temporal comparison
uncertainty representation
advanced rendering
```

---

## P3

Future:

```text
multiple models
Glider
CTD
BGC
OGC services
OPeNDAP
live ingestion
global scaling
collaboration
advanced intelligence
```

---

# 59. Repository Performance Rule

Do not optimize everything prematurely.

First ensure:

```text
correctness
↓
connected workflow
↓
profiling
↓
targeted optimization
```

Potential optimization areas:

```text
API subsetting
xarray selection
frontend request deduplication
Cesium entity count
Three.js draw calls
Plotly rendering
data transfer size
cache reuse
```

---

# 60. Repository Quality Rule

NIRIKSHAN should feel like one coherent scientific product.

Avoid:

- random component naming,
- duplicate APIs,
- duplicate state,
- inconsistent units,
- inconsistent terminology,
- dead mock systems,
- undocumented scientific formulas,
- unrelated UI systems,
- unused dependencies.

---

# 61. Final Dependency Model

The intended final architecture is:

```text
                         ┌──────────────────────┐
                         │      NIRIKSHAN       │
                         └──────────┬───────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  │                                   │
             FRONTEND                              BACKEND
                  │                                   │
        ┌─────────┼─────────┐              ┌──────────┼──────────┐
        │         │         │              │          │          │
      State      API     Visualization    API      Services   Scientific
        │         │         │              │          │          │
        │         │    ┌────┼────┐         │          │          │
        │         │    │    │    │         │          │          │
        │       Client Cesium Three Plotly │          │          │
        │         │                       │          │          │
        └─────────┴───────────────────────┘          │
                                                     │
                                              ┌──────┴──────┐
                                              │   Adapters  │
                                              └──────┬──────┘
                                                     │
                                           ┌─────────┴─────────┐
                                           │                   │
                                        GLORYS               Argo
```

The scientific engine remains the core source of analytical truth.

---

# 62. Final Architectural Principle

NIRIKSHAN is not primarily a collection of React components.

It is a scientific workflow:

```text
REAL DATA
   ↓
NORMALIZE
   ↓
VALIDATE
   ↓
MATCH
   ↓
COMPARE
   ↓
DERIVE
   ↓
EXPLAIN
   ↓
SIMULATE
   ↓
TRACE
```

The repository must make that workflow visible in its architecture.

The strongest implementation is therefore not the one with the most files or the most abstractions.

It is the one where a judge can follow a real observation from:

```text
Ocean
 ↓
Observation
 ↓
Model State
 ↓
Profile
 ↓
Residual
 ↓
Scientific Feature
 ↓
Current
 ↓
SAR Scenario
 ↓
Provenance
```

without encountering fake data, disconnected screens, duplicated logic, or unexplained scientific transformations.

---

# 63. Final Acceptance Checklist

Before considering the repository architecture ready for full implementation:

### Repository

- [ ] Frontend/backend responsibilities are separated.
- [ ] Scientific engine is isolated.
- [ ] Data adapters are isolated.
- [ ] API routes are thin.
- [ ] Domain models are explicit.
- [ ] State ownership is clear.
- [ ] Visualization boundaries are clear.

### Scientific

- [ ] Real GLORYS data remains connected.
- [ ] Real Argo data remains connected.
- [ ] Model matching remains functional.
- [ ] Residual calculation remains deterministic.
- [ ] Current calculation remains deterministic.
- [ ] SAR uses scientific current data.
- [ ] Scientific provenance is preserved.

### Frontend

- [ ] API calls are centralized.
- [ ] Scientific state is centralized.
- [ ] Cesium remains a visualization layer.
- [ ] Three.js remains a visualization layer.
- [ ] Plotly remains a visualization layer.
- [ ] No scientific calculation is hidden inside UI components.

### Engineering

- [ ] Build passes.
- [ ] Backend starts.
- [ ] API smoke tests pass.
- [ ] Scientific tests exist for core calculations.
- [ ] No real dataset is accidentally committed.
- [ ] No credentials are committed.
- [ ] No mock regression exists.
- [ ] No large rewrite is required.

### Product

- [ ] Explore workflow works.
- [ ] Evidence workflow works.
- [ ] Response workflow works.
- [ ] Provenance is accessible.
- [ ] The repository supports the NIRIKSHAN demo story.
- [ ] The implementation remains consistent with Documents 01–13.

---

# 64. Next Implementation Rule

After this document, stop expanding architecture documentation unless a real implementation blocker requires it.

The next phase is execution.

The implementation sequence is:

```text
14 Repository Structure
        ↓
Baseline Audit
        ↓
Scientific Core
        ↓
Evidence System
        ↓
Water-Column Lens
        ↓
Synchronized State
        ↓
Response / SAR
        ↓
Provenance
        ↓
Performance
        ↓
Visual Polish
        ↓
Testing
        ↓
Demo Hardening
```

> **Do not build the architecture for its own sake. Build the smallest architecture that makes the scientific product real, correct, connected, fast, beautiful, and demonstrable.**
```
