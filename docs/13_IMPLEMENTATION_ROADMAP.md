# `13_IMPLEMENTATION_ROADMAP.md`

```md id="c1x7qp"
# 13 — Implementation Roadmap

## 1. Purpose

This document converts the NIRIKSHAN product, scientific, architecture, UI, API, performance, testing, deployment, and demo specifications into an executable development plan.

The purpose is to answer:

> What should the coding agent build, in what order, and how do we know each phase is actually complete?

The roadmap is designed for the current NIRIKSHAN prototype rather than a greenfield rewrite.

The existing working system must be preserved and upgraded incrementally.

---

# 2. Current Starting Point

The current prototype already contains:

- React frontend
- TypeScript
- Cesium globe
- Three.js/WebGL components
- Plotly profile visualization
- FastAPI backend
- xarray/NetCDF processing
- real GLORYS12V1 model subset
- real Argo subset
- model-field API
- observation API
- profile API
- SAR drift API
- frontend/backend integration
- CARTO basemap configuration
- Cesium configuration
- initial dark scientific UI
- Git repository
- basic `.gitignore`
- successful frontend build

Current scientific model:

```text
GLORYS12V1
Bay of Bengal
2024-01-01 → 2024-01-10
lat: 5 → 25
lon: 75 → 100
variables:
  thetao
  uo
  vo
```

Current Argo subset:

```text
19 floats
2740 measurements
Bay of Bengal subset
```

Therefore:

> The implementation strategy is refinement and expansion, not rebuilding the project from scratch.

---

# 3. Implementation Philosophy

Follow these rules throughout the project.

## Rule 1 — Preserve Working Science

Do not replace the real GLORYS12V1/Argo integration with mock data.

---

## Rule 2 — Build Vertical Slices

Each major feature should travel through:

```text
Data
 ↓
Scientific Engine
 ↓
API
 ↓
Application State
 ↓
Visualization
 ↓
User Interaction
 ↓
Test
```

Do not build large frontend features disconnected from the backend.

---

## Rule 3 — Scientific Before Decorative

Priority:

```text
Scientific correctness
>
Interaction
>
Performance
>
Visual polish
>
Decorative effects
```

---

## Rule 4 — No Big-Bang Rewrite

Before modifying a major subsystem:

1. inspect existing implementation
2. identify reusable code
3. preserve working paths
4. change one subsystem at a time
5. build/test
6. continue

---

## Rule 5 — No Fake Capability

Do not implement placeholder interfaces that appear to perform scientific analysis when the backend does not actually calculate the result.

---

# 4. Product Priority Model

Use four priorities.

```text
P0 = essential for SIH demo
P1 = major differentiator
P2 = useful enhancement
P3 = future platform capability
```

---

# 5. P0 — Core Scientific Product

P0 must be completed first.

```text
P0.1
Real GLORYS field exploration

P0.2
Real Argo observations

P0.3
Observation selection

P0.4
Model-observation matching

P0.5
Profile comparison

P0.6
Residual analysis

P0.7
Current visualization

P0.8
SAR response simulation

P0.9
Provenance

P0.10
Stable demo workflow
```

---

# 6. P1 — Differentiating Analytical Layer

After P0 is stable:

```text
P1.1
Water-Column Lens

P1.2
Synchronized analytical cursor

P1.3
Thermocline

P1.4
Mixed-layer depth

P1.5
Current shear

P1.6
Evidence Case

P1.7
Scenario replay

P1.8
Scientific snapshot

P1.9
Data health/coverage

P1.10
Advanced residual visualization
```

---

# 7. P2 — Advanced Scientific Capability

Only after P0/P1:

```text
P2.1
Vertical transects

P2.2
Horizontal residual maps

P2.3
Temporal comparison

P2.4
Observation coverage analysis

P2.5
Current shear visualization

P2.6
Improved uncertainty representation

P2.7
More advanced isosurfaces
```

---

# 8. P3 — Future Platform

Do not prioritize before the SIH MVP is strong.

```text
P3.1
Glider support

P3.2
CTD support

P3.3
BGC support

P3.4
Multi-model comparison

P3.5
OGC WMS/WCS

P3.6
OPeNDAP

P3.7
Remote/live ingestion

P3.8
Global scaling

P3.9
Collaboration

P3.10
Scientific intelligence layer
```

---

# 9. Phase 0 — Baseline Audit

## Objective

Understand the exact current implementation before making changes.

## Tasks

Inspect:

```text
frontend/
backend/
components/
services/
API routes
scientific adapters
state management
NetCDF handling
Cesium initialization
Three.js initialization
Plotly components
SAR implementation
```

Check:

```text
npm run build
```

Run backend tests/smoke tests if available.

Verify:

```text
GET /api/observations
GET /api/model-field
GET /api/profile
GET /api/sar/drift
```

---

## Acceptance Criteria

- [ ] Current app runs.
- [ ] Frontend builds.
- [ ] Backend starts.
- [ ] GLORYS dataset loads.
- [ ] Argo dataset loads.
- [ ] Existing APIs work.
- [ ] Existing SAR works.
- [ ] No unnecessary rewrite is proposed.

---

# 10. Phase 1 — Scientific Data Foundation

## Objective

Make the scientific data layer robust enough for all higher-level features.

### Tasks

Implement/verify:

```text
Dataset registry
Dataset metadata
Coordinate normalization
Time normalization
Variable mapping
Missing-value handling
QC preservation
Dataset validation
Provenance metadata
```

---

## Required scientific variables

```text
thetao
uo
vo
```

Public naming:

```text
temperature
eastwardCurrent
northwardCurrent
```

---

## Acceptance Criteria

- [ ] Dataset metadata is centralized.
- [ ] No hardcoded developer paths.
- [ ] Dataset validation succeeds.
- [ ] Coordinates are validated.
- [ ] Time range is validated.
- [ ] Variables are validated.
- [ ] Missing values remain missing.
- [ ] Provenance is available.

---

# 11. Phase 2 — API Stabilization

## Objective

Create one consistent API contract before expanding the frontend.

Required endpoints:

```text
GET /api/observations
GET /api/model-field
GET /api/profile
GET /api/sar/drift
```

Potential new endpoints:

```text
GET /api/datasets
GET /api/evidence
GET /api/derived-features
GET /api/current
GET /api/provenance
```

---

## API rules

Every scientific response must expose:

```text
data
metadata
units
source
requested state
selected state where applicable
```

---

## Acceptance Criteria

- [ ] API schemas are documented.
- [ ] Errors use structured responses.
- [ ] Units are explicit.
- [ ] timestamps use ISO format.
- [ ] coordinates are consistent.
- [ ] missing values serialize correctly.
- [ ] invalid parameters are rejected.
- [ ] API tests pass.

---

# 12. Phase 3 — Scientific Matching Engine

## Objective

Build the observation → model relationship.

Workflow:

```text
Argo observation
      ↓
location
      ↓
time
      ↓
nearest model coordinate/time
      ↓
matching metadata
```

Return:

```text
requestedLatitude
requestedLongitude
selectedLatitude
selectedLongitude

requestedTime
selectedTime

spatialSeparation
temporalSeparation

matchingMethod
```

---

## Acceptance Criteria

- [ ] Known observation matches expected model grid point.
- [ ] Time matching is deterministic.
- [ ] Out-of-domain observations fail clearly.
- [ ] Matching tolerance is respected.
- [ ] Selected state is exposed through API.
- [ ] Matching tests pass.

---

# 13. Phase 4 — Profile & Evidence Engine

## Objective

Build the scientific evidence workflow.

Workflow:

```text
Observation
 ↓
Model Match
 ↓
Model Profile
 ↓
Observation Profile
 ↓
Alignment
 ↓
Residual
 ↓
Statistics
```

Calculate:

```text
residual
bias
MAE
RMSE
```

---

## Acceptance Criteria

- [ ] Real Argo profile loads.
- [ ] Corresponding model profile loads.
- [ ] Profiles can be aligned.
- [ ] Residual uses observation − model.
- [ ] Missing values are handled correctly.
- [ ] Statistics are validated.
- [ ] Provenance is retained.

---

# 14. Phase 5 — Derived Scientific Features

## Objective

Turn raw profiles into meaningful scientific features.

Initial features:

```text
temperature gradient
thermocline
mixed-layer depth
current speed
current direction
current shear
```

Each feature must have:

```text
name
value
unit
method
input data
depth/location/time
```

---

## Example

```json id="v3w9j4"
{
  "name": "thermoclineDepth",
  "value": 72.4,
  "unit": "m",
  "method": "maximum_temperature_gradient",
  "depthRange": [20, 200]
}
```

---

## Acceptance Criteria

- [ ] Each feature has a documented method.
- [ ] Unit tests exist.
- [ ] Real-data validation exists.
- [ ] Missing-input behavior is defined.
- [ ] UI does not display unsupported claims.

---

# 15. Phase 6 — Evidence Case

## Objective

Create one object representing the complete scientific investigation.

Concept:

```text
EvidenceCase
```

Contains:

```text
Observation
ModelMatch
Profile
Residual
DerivedFeatures
Current
Coverage
Provenance
```

---

## Example flow

```text
SELECT OBSERVATION
       ↓
CREATE EVIDENCE CASE
       ↓
LOAD MODEL MATCH
       ↓
LOAD PROFILE
       ↓
CALCULATE RESIDUAL
       ↓
CALCULATE FEATURES
       ↓
LOAD CURRENT
       ↓
READY FOR RESPONSE
```

---

## Acceptance Criteria

- [ ] Evidence case can be created from a selected observation.
- [ ] All components reference the same scientific state.
- [ ] Evidence case is reproducible.
- [ ] Missing components are represented explicitly.
- [ ] Response mode can consume the evidence case.

---

# 16. Phase 7 — Application State Architecture

## Objective

Ensure all views are synchronized.

Core state:

```ts id="w1b6r0"
interface ScientificState {
  mode: "explore" | "evidence" | "response";

  datasetId: string;

  time: string;

  depth: number;

  variable: string;

  latitude: number;

  longitude: number;

  selectedObservationId?: string;

  evidenceCaseId?: string;

  selectedFeatureId?: string;

  scenarioTime?: string;
}
```

---

## State rules

One scientific state should drive:

```text
Globe
Profile
Water Column
Current vectors
Evidence
SAR
Provenance
```

Do not maintain independent copies of scientific state in each component.

---

## Acceptance Criteria

- [ ] Depth updates all relevant views.
- [ ] Time updates all relevant views.
- [ ] Observation selection updates evidence.
- [ ] Evidence updates response mode.
- [ ] SAR inherits scientific state.
- [ ] No stale component state overrides global scientific state.

---

# 17. Phase 8 — Explore Mode

## Objective

Create the primary scientific exploration experience.

Main interface:

```text
                 TOP BAR

     ┌─────────────────────────────┐
     │                             │
     │                             │
     │       3D OCEAN GLOBE        │
     │                             │
     │                             │
     └─────────────────────────────┘

     Time ─────────────── Depth

     Layers / Context / Legend
```

---

## Required interactions

- rotate globe
- zoom
- select observation
- change time
- change depth
- change variable
- toggle currents
- inspect legend

---

## Acceptance Criteria

- [ ] Globe loads quickly.
- [ ] Model field is visible.
- [ ] Time control works.
- [ ] Depth control works.
- [ ] Observation markers work.
- [ ] Current layer works.
- [ ] Interface remains calm and readable.

---

# 18. Phase 9 — Evidence Mode

## Objective

Create the strongest analytical part of the product.

Layout concept:

```text
┌────────────────────────────────────────────┐
│ Observation / Evidence Header              │
├──────────────────────┬─────────────────────┤
│                      │                     │
│     Globe            │   Water Column      │
│                      │                     │
├──────────────────────┼─────────────────────┤
│                      │                     │
│   Profile            │   Residual / Stats  │
│                      │                     │
└──────────────────────┴─────────────────────┘
```

---

## Required

- observation metadata
- model match
- profile comparison
- residual
- derived features
- current context
- provenance

---

## Acceptance Criteria

- [ ] Selecting an observation creates evidence.
- [ ] Model match is visible.
- [ ] Profile comparison is visible.
- [ ] Residual is visible.
- [ ] Derived feature is visible.
- [ ] Provenance is accessible.
- [ ] All views represent the same scientific state.

---

# 19. Phase 10 — Water-Column Lens

## Objective

Create the signature analytical interaction.

The user should be able to inspect:

```text
surface
 ↓
mixed layer
 ↓
thermocline
 ↓
deeper water
```

while seeing corresponding:

```text
model
observation
residual
current
```

---

## Required interaction

Analytical cursor:

```text
Depth cursor
     ↓
Profile point
     ↓
Globe depth
     ↓
Water-column marker
```

---

## Acceptance Criteria

- [ ] Cursor is synchronized.
- [ ] Depth remains consistent across views.
- [ ] Values update correctly.
- [ ] Missing values remain visible as unavailable.
- [ ] Interaction remains performant.

---

# 20. Phase 11 — Response Mode

## Objective

Connect analysis to a deterministic response scenario.

Workflow:

```text
Evidence
 ↓
Use current field
 ↓
Initialize SAR
 ↓
Simulate
 ↓
Trajectory
 ↓
Replay
```

---

## Required scenario metadata

```text
start location
start time
dataset
duration
time step
integration method
limitations
```

---

## Acceptance Criteria

- [ ] Scenario starts from selected evidence state.
- [ ] Current field is the same scientific source.
- [ ] Trajectory is deterministic.
- [ ] Timeline works.
- [ ] Replay works.
- [ ] Limitations are visible.
- [ ] Simulation is not presented as a forecast.

---

# 21. Phase 12 — Provenance & Scientific Snapshot

## Objective

Make the product auditable.

Provenance should expose:

```text
Dataset
Source
Time
Location
Selected model state
Matching method
Variables
Derived methods
Simulation method
```

Snapshot should capture:

```text
scientific state
+
evidence state
+
scenario state
```

---

## Acceptance Criteria

- [ ] Provenance can be opened from Evidence.
- [ ] Provenance is human-readable.
- [ ] Scientific state can be reconstructed.
- [ ] Snapshot does not rely solely on UI state.

---

# 22. Phase 13 — Performance Pass

Only after scientific functionality is stable.

Implement:

```text
bounded API responses
request cancellation
request deduplication
frontend cache
vector density
LOD
resource disposal
lazy advanced layers
```

---

## Acceptance Criteria

- [ ] No complete NetCDF is sent to browser.
- [ ] Stale requests cannot overwrite state.
- [ ] Vector density is bounded.
- [ ] Three.js resources are disposed.
- [ ] Depth/time interactions remain responsive.
- [ ] No scientific values are changed for performance.

---

# 23. Phase 14 — Visual Design Pass

The visual design should now be upgraded.

Do not redesign the entire application before the scientific workflow works.

Focus on:

```text
typography
spacing
hierarchy
layer controls
legends
scientific color scales
panel composition
micro-interactions
loading states
error states
```

---

## Design Rules

Do not introduce:

```text
neon gradients
glassmorphism
cyberpunk UI
AI-generated glowing cards
decorative particles
gaming HUD
excessive rounded cards
```

The product should feel like:

> a premium scientific instrument.

---

# 24. Phase 15 — Testing Pass

Run:

```text
unit tests
integration tests
API tests
scientific validation
frontend build
end-to-end workflow
```

Verify:

```text
Explore
 ↓
Evidence
 ↓
Response
```

from a clean application state.

---

# 25. Phase 16 — Deployment Pass

Configure:

```text
frontend environment
backend environment
dataset root
CORS
HTTPS
health
readiness
```

Verify:

```text
/health
/ready
```

---

## Acceptance Criteria

- [ ] Production frontend builds.
- [ ] Backend starts.
- [ ] Datasets are available.
- [ ] Health works.
- [ ] Readiness works.
- [ ] CORS is correct.
- [ ] No secrets are exposed.
- [ ] Real scientific data works in production.

---

# 26. Phase 17 — Demo Hardening

Freeze:

```text
dataset
demo observation
demo time
demo workflow
scientific algorithms
```

Create:

```text
primary deployment
backup deployment/local build
screen recording
demo script
```

---

# 27. Phase 18 — Final SIH Validation

Run the complete workflow:

```text
OPEN
 ↓
EXPLORE
 ↓
SELECT
 ↓
VERIFY
 ↓
COMPARE
 ↓
UNDERSTAND
 ↓
SIMULATE
 ↓
REPLAY
 ↓
TRACE
```

The demo must complete without manual debugging.

---

# 28. Recommended Build Order

The actual coding order should be:

```text
01  Baseline audit
 ↓
02  Data foundation
 ↓
03  API stabilization
 ↓
04  Model matching
 ↓
05  Profile comparison
 ↓
06  Derived features
 ↓
07  Evidence case
 ↓
08  Global scientific state
 ↓
09  Explore mode
 ↓
10  Evidence mode
 ↓
11  Water-Column Lens
 ↓
12  Response mode
 ↓
13  Provenance
 ↓
14  Performance
 ↓
15  Visual refinement
 ↓
16  Testing
 ↓
17  Deployment
 ↓
18  Demo hardening
```

Do not reverse this order merely because a visual feature is easier to implement.

---

# 29. Dependency Graph

```text
DATA
 │
 ├───────────────┐
 │               │
 ▼               ▼
MODEL        OBSERVATIONS
 │               │
 └───────┬───────┘
         ▼
   MODEL MATCHING
         │
         ▼
      PROFILE
         │
         ▼
      RESIDUAL
         │
         ▼
 DERIVED FEATURES
         │
         ▼
   EVIDENCE CASE
         │
     ┌───┴────┐
     ▼        ▼
 EXPLORE   RESPONSE
     │        │
     └───┬────┘
         ▼
     PROVENANCE
         │
         ▼
      SNAPSHOT
```

---

# 30. Parallel Workstreams

Some tasks can be developed in parallel after their dependencies exist.

### Backend

```text
Scientific Engine
API
Validation
```

### Frontend

```text
Application Shell
State
Cesium
Three.js
Plotly
```

### QA

```text
Unit tests
Scientific validation
E2E
```

### Deployment

```text
Docker
Environment
Health checks
```

However, do not merge parallel work blindly.

Every branch must preserve the current working data flow.

---

# 31. Coding Agent Execution Protocol

Every implementation task given to an AI coding agent should follow:

```text
STEP 1
Read relevant specification documents.

STEP 2
Inspect existing implementation.

STEP 3
Identify files that actually need changes.

STEP 4
Explain implementation plan briefly.

STEP 5
Implement smallest coherent change.

STEP 6
Run relevant tests/build.

STEP 7
Inspect result.

STEP 8
Report:
- files changed
- functionality added
- tests run
- remaining issues
```

The agent must not modify unrelated areas.

---

# 32. Specification Priority

If documents appear to conflict, use this hierarchy:

```text
Scientific correctness
        ↓
API contracts
        ↓
Architecture
        ↓
Interaction workflows
        ↓
Performance
        ↓
Visual design
```

A visual request must not invalidate scientific behavior.

---

# 33. Change Safety Rules

Before changing an existing working subsystem:

```text
Inspect
 ↓
Understand
 ↓
Modify
 ↓
Build
 ↓
Test
```

Do not:

```text
Delete
 ↓
Rewrite
 ↓
Hope
```

---

# 34. Feature Completion Criteria

A feature is not complete when:

```text
UI exists
```

It is complete when:

```text
Scientific calculation
+
API
+
state
+
visualization
+
interaction
+
error state
+
test
```

are all implemented where applicable.

---

# 35. Example: Observation Selection

Incomplete:

```text
Click marker
→
Open fake card
```

Complete:

```text
Click marker
 ↓
Get observation
 ↓
Validate
 ↓
Match model
 ↓
Create evidence state
 ↓
Load profile
 ↓
Calculate residual
 ↓
Display evidence
 ↓
Preserve provenance
```

---

# 36. Example: Temperature Layer

Incomplete:

```text
Show colorful ocean surface
```

Complete:

```text
Select temperature
 ↓
Request selected model slice
 ↓
Validate units/missing values
 ↓
Render scientific field
 ↓
Show legend
 ↓
Synchronize depth/time
 ↓
Expose dataset metadata
```

---

# 37. Example: SAR

Incomplete:

```text
Draw animated line
```

Complete:

```text
Select scientific state
 ↓
Retrieve u/v current
 ↓
Integrate trajectory
 ↓
Validate output
 ↓
Return trajectory + metadata
 ↓
Render
 ↓
Replay
 ↓
Show assumptions
```

---

# 38. Definition of MVP

The SIH MVP is complete when it can reliably perform:

```text
REAL MODEL
+
REAL OBSERVATION
        ↓
3D EXPLORATION
        ↓
OBSERVATION SELECTION
        ↓
MODEL MATCH
        ↓
PROFILE COMPARISON
        ↓
RESIDUAL
        ↓
DERIVED FEATURE
        ↓
CURRENT FIELD
        ↓
SAR SIMULATION
        ↓
PROVENANCE
```

Everything beyond this is enhancement.

---

# 39. Definition of “Winner-Quality” Product

Do not define success by number of features.

The target quality is:

### Scientific

- real data
- transparent methods
- reproducible calculations
- traceable evidence

### Product

- coherent workflow
- fast interaction
- clear purpose
- obvious user value

### Visual

- premium
- restrained
- scientific
- distinctive
- readable

### Technical

- modular
- testable
- deployable
- performant

### Demo

- understandable in seconds
- memorable workflow
- strong visual transitions
- technically defensible

---

# 40. Final Implementation Principle

The project should evolve in this order:

```text
MAKE IT REAL
      ↓
MAKE IT CORRECT
      ↓
MAKE IT CONNECTED
      ↓
MAKE IT FAST
      ↓
MAKE IT BEAUTIFUL
      ↓
MAKE IT DEMONSTRABLE
```

Never reverse this order.

A beautiful visualization of weak scientific functionality is not the target.

The target is:

> **A real, scientifically traceable, interactive ocean analysis workflow presented through a polished browser-native 3D instrument.**
```
