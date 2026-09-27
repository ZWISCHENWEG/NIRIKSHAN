# `04_OBSERVATION_EVIDENCE.md`

```md
# NIRIKSHAN — Observation & Evidence System

## Document Status

- Product: NIRIKSHAN
- Document: Observation & Evidence System
- Version: 1.0
- Status: Implementation Specification
- Audience: AI coding agents, frontend/backend developers, scientific reviewers
- Depends on:
  - `01_PRD.md`
  - `02_ARCHITECTURE.md`
  - `03_SCIENTIFIC_ENGINE.md`

---

# 1. Purpose

The Observation & Evidence System is the core workflow that transforms a raw observation marker into a scientifically traceable comparison between:

1. what was observed,
2. where and when it was observed,
3. what the numerical model represented at the corresponding location and time,
4. how the observation and model differ,
5. what scientifically derived features can be identified,
6. and what response scenario can be constructed from the same underlying model state.

The system must make the user feel that every analytical conclusion has a visible chain of evidence.

The central workflow is:

OBSERVATION
↓
LOCATION + TIME
↓
MODEL MATCH
↓
PROFILE
↓
COMPARISON
↓
RESIDUAL
↓
DERIVED FEATURES
↓
CURRENT FIELD
↓
SCENARIO

The system must never hide this chain.

---

# 2. Core Principle

## Evidence Before Interpretation

NIRIKSHAN should not tell the user:

> "This area is anomalous."

Instead it should allow the user to see:

> Observation → Model state → Difference → Derived feature → Evidence

The interface should make the scientific relationship understandable without requiring the user to trust an opaque algorithm.

Every evidence panel should answer:

- What is this?
- Where is it?
- When is it from?
- What model state was compared?
- How was the model point selected?
- What was actually measured?
- What does the model show?
- What is the difference?
- What derived feature was calculated?
- What are the limitations?

---

# 3. Evidence Modes

The evidence system operates through three levels.

## Level 1 — Observation

Shows the raw observational context.

Examples:

- Argo float
- Glider
- CTD
- BGC float
- future sensor types

Information:

- platform identifier
- observation time
- position
- measured variables
- depth coverage
- QC information
- source dataset

---

## Level 2 — Comparison

Connects the observation to the numerical model.

Shows:

- nearest model time
- nearest model coordinate
- vertical model levels
- observation profile
- model profile
- residual profile
- comparison statistics

---

## Level 3 — Interpretation

Shows scientifically derived information.

Examples:

- thermocline
- mixed-layer depth
- temperature gradient
- current shear
- current speed
- current direction
- spatial separation
- temporal separation
- observation coverage

Interpretation must always remain traceable to Level 1 and Level 2.

---

# 4. Observation Discovery

## 4.1 Observation Markers

Observations appear on the 3D globe as geographic markers.

Marker position:

```text
longitude → X
latitude  → Y
depth     → observation/profile context
```

The globe should not render every observation as a visually dominant object.

Markers should communicate:

- existence
- approximate location
- observation type
- selection state

They should not become decorative UI elements.

---

# 5. Observation Marker Semantics

Each marker has four possible visual states.

## 5.1 Default

Observation exists but is not selected.

Visual treatment:

- small
- low visual weight
- neutral scientific color

---

## 5.2 Hovered

The pointer is over the marker.

Show a compact tooltip:

```text
ARGO
Float: 2901234
15 Jan 2024
12.42°N
87.31°E
```

Do not display excessive metadata.

---

## 5.3 Selected

The observation becomes the active analytical subject.

Selection should trigger:

1. observation detail panel,
2. profile retrieval,
3. model matching,
4. comparison state,
5. water-column visualization,
6. synchronized analytical cursor.

---

## 5.4 Context

Nearby observations may remain visible while another observation is selected.

Context markers should never visually compete with the active observation.

---

# 6. Observation Selection Workflow

When a user selects an observation:

```text
USER SELECTS OBSERVATION
        ↓
READ OBSERVATION METADATA
        ↓
VALIDATE OBSERVATION
        ↓
MATCH MODEL STATE
        ↓
LOAD PROFILE
        ↓
LOAD MODEL PROFILE
        ↓
CALCULATE RESIDUAL
        ↓
CALCULATE DERIVED FEATURES
        ↓
CREATE EVIDENCE OBJECT
        ↓
UPDATE ALL LINKED VIEWS
```

This operation should feel like one continuous interaction.

The user should not need to manually open multiple unrelated panels.

---

# 7. Observation Detail Panel

The selected observation should expose a compact evidence header.

Example:

```text
ARGO FLOAT
2901234

15 JAN 2024 · 06:42 UTC
12.42°N · 87.31°E

DEPTH
0–1980 m

VARIABLES
Temperature
Salinity
Pressure
```

Below this, show data provenance and matching status.

Example:

```text
MODEL MATCH

GLORYS12V1
15 JAN 2024 · 00:00 UTC
12.42°N · 87.33°E

ΔT: 6 h
ΔSpace: 3.2 km
```

Do not call this a "confidence score".

Use measurable matching information instead.

---

# 8. Platform Identity

Every observation should have a stable platform identity.

Minimum fields:

```text
platform_id
platform_type
source
observation_time
latitude
longitude
```

Optional:

```text
cycle_number
profile_number
trajectory_id
deployment_id
```

The system must not assume all observation types have the same metadata structure.

---

# 9. Observation Types

The evidence system should use a common interface.

```ts
type ObservationType =
  | "ARGO"
  | "GLIDER"
  | "CTD"
  | "BGC"
  | "UNKNOWN";
```

The current implementation may primarily support Argo.

The architecture must not hard-code Argo-specific assumptions into the evidence UI.

Future sources should plug into the same observation contract.

---

# 10. Observation Data Contract

Example domain object:

```ts
interface Observation {
  id: string;
  platformId: string;
  platformType: ObservationType;

  latitude: number;
  longitude: number;

  time: string;

  depth: number[];

  variables: {
    temperature?: number[];
    salinity?: number[];
    pressure?: number[];
  };

  quality?: {
    temperature?: number[];
    salinity?: number[];
    pressure?: number[];
  };

  source: {
    dataset: string;
    provider?: string;
  };
}
```

Do not require optional variables to exist.

A profile containing temperature but no salinity must still be usable.

---

# 11. Model Matching

The selected observation must be matched against the numerical model.

Current matching strategy:

```text
observation time
      ↓
nearest model time

observation latitude
      ↓
nearest model latitude

observation longitude
      ↓
nearest model longitude
```

The exact scientific rules are defined in:

`03_SCIENTIFIC_ENGINE.md`

The evidence UI must expose the result of this matching.

---

# 12. Match Metadata

Every comparison must retain:

```ts
interface ModelMatch {
  requestedTime: string;
  selectedTime: string;

  requestedLatitude: number;
  selectedLatitude: number;

  requestedLongitude: number;
  selectedLongitude: number;

  timeDifferenceSeconds: number;
  spatialDistanceKm: number;

  method: "nearest";
}
```

This metadata is critical.

Never silently hide coordinate/time differences.

---

# 13. Match Quality

Do not display arbitrary percentages such as:

```text
87% confidence
92% match
```

unless a scientifically documented confidence model exists.

Instead display measurable quantities:

```text
MODEL TIME OFFSET
6 h

SPATIAL OFFSET
3.2 km

MATCH METHOD
Nearest model point
```

This keeps the system transparent.

---

# 14. Water-Column Lens

The Water-Column Lens is one of the main differentiating interactions of NIRIKSHAN.

When an observation is selected, the user should see a vertical representation of the ocean column.

Conceptually:

```text
SURFACE
────────────────────

temperature
current vectors
observation

│
│
│
│       thermocline
│       ───────────
│
│
│
│       mixed layer
│
│
│
DEPTH
────────────────────
```

The exact rendering can be implemented using Three.js or another existing scientific visualization layer.

---

# 15. Water-Column Requirements

The lens should communicate:

- depth
- temperature structure
- observation points
- model values
- current vectors
- derived features
- selected depth

It must not become a generic 3D decorative visualization.

Every visual element should correspond to data.

---

# 16. Depth Cursor

The Water-Column Lens must have a synchronized depth cursor.

When the user changes depth:

```text
Depth Slider
     ↓
Global Scientific State
     ↓
Model Field
     ↓
Water Column
     ↓
Current Vector
     ↓
Profile Cursor
     ↓
Residual
```

All views should update from the same scientific state.

There must be one authoritative depth value.

Do not maintain independent depth states inside separate components.

---

# 17. Synchronized Analytical Cursor

The analytical cursor is a major interaction pattern.

A single cursor position should be represented across:

1. globe
2. water-column lens
3. observation profile
4. model profile
5. residual profile
6. current field
7. derived-feature indicators

Example:

```text
Depth = 74 m
```

The same depth should be visible everywhere.

This creates a direct relationship between spatial and vertical information.

---

# 18. Profile Comparison

The Evidence view should provide a scientific profile comparison.

Minimum:

```text
Observation
Model
Residual
```

Example:

```text
Temperature (°C)

Depth
 0m      ● Observation
         — Model

50m

100m

200m

500m
```

The exact chart design is flexible.

The scientific semantics are not.

---

# 19. Profile Rules

The profile must:

- preserve physical depth ordering,
- preserve units,
- distinguish observation from model,
- identify missing values,
- show selected depth,
- support hover inspection,
- allow synchronized cursor movement,
- display residual when available.

Do not connect missing values across gaps.

---

# 20. Residual Definition

The system uses:

```text
Residual = Observation − Model
```

Therefore:

```text
positive residual
→ observation is higher than model

negative residual
→ observation is lower than model
```

This convention must remain consistent throughout the application.

Never invert the sign in one visualization.

---

# 21. Residual Profile

The residual chart should make model-observation disagreement immediately visible.

Example:

```text
Temperature Residual

Depth

 0m      +0.8
         |
100m     +0.3
         |
200m     -0.2
         |
500m     -1.1
```

Use a zero reference line.

The user should be able to distinguish:

- positive deviation
- near-zero agreement
- negative deviation

without relying only on color.

---

# 22. Residual Statistics

For valid paired values, calculate:

```text
Bias
MAE
RMSE
Correlation
```

Only calculate statistics from valid paired samples.

Example:

```text
MODEL vs OBSERVATION

Bias       +0.18 °C
MAE         0.42 °C
RMSE        0.57 °C
Samples       84
```

The UI must identify the variable and units.

Do not show statistics without the valid sample count.

---

# 23. Missing Data

Missing data must remain visible as missing.

Do not:

- replace missing values with zero,
- silently interpolate,
- fabricate a continuous line,
- hide invalid observations.

If a metric cannot be calculated:

```text
RMSE
Unavailable — insufficient valid samples
```

---

# 24. Observation QC

Quality-control information should be preserved.

The system should be able to distinguish:

```text
GOOD
BAD
UNKNOWN
```

or equivalent source-defined QC states.

Do not silently delete observations solely because QC metadata is unavailable.

The scientific engine should determine inclusion rules.

The UI should communicate them.

---

# 25. Derived Features

The evidence system consumes derived features from the Scientific Engine.

Potential features:

```text
Thermocline
Mixed Layer Depth
Temperature Gradient
Current Speed
Current Direction
Current Shear
```

Each feature should have:

```ts
interface DerivedFeature {
  id: string;
  type: string;
  value: number | null;
  unit: string;
  depth?: number;
  method: string;
  parameters?: Record<string, number | string>;
}
```

---

# 26. Thermocline Evidence

If a thermocline is identified:

```text
THERMOCLINE

Depth
82 m

Criterion
Maximum temperature gradient

Gradient
0.081 °C/m
```

The interface should allow the user to locate that depth in the profile.

Selecting the thermocline should move the synchronized analytical cursor.

---

# 27. Mixed-Layer Depth Evidence

Example:

```text
MIXED LAYER

Depth
41 m

Criterion
Temperature threshold

Reference
Surface temperature
```

The actual criterion must come from the Scientific Engine.

Never imply that one MLD definition is universally correct.

---

# 28. Current Evidence

Current information should be connected to the same model state.

Example:

```text
CURRENT

Depth
10 m

Speed
0.42 m/s

Direction
137°
```

If the user moves the depth cursor, current information should update accordingly.

---

# 29. Current Vector Consistency

The current displayed in:

- globe vectors,
- water-column lens,
- observation evidence,
- SAR scenario

must come from the same underlying `uo` and `vo` model data for the selected scientific state.

Do not generate a visually plausible current field separately for the SAR simulation.

This is a critical scientific integrity rule.

---

# 30. Spatial Context

The selected observation should not be analyzed in isolation.

The evidence system should communicate nearby observations when useful.

Example:

```text
LOCAL OBSERVATION COVERAGE

Selected
1

Nearby
4

Within 100 km
7
```

The exact radius should be configurable.

The system must not imply that sparse observations represent complete ocean coverage.

---

# 31. Coverage Awareness

Evidence should include coverage context.

Possible states:

```text
DENSE
MODERATE
SPARSE
NONE
```

These should be derived from actual observation availability.

Avoid arbitrary confidence percentages.

Example:

```text
OBSERVATION COVERAGE

7 profiles within 100 km
3 profiles within 50 km
```

This is more informative than:

```text
Confidence: 82%
```

---

# 32. Evidence Graph

NIRIKSHAN should internally represent evidence as a graph.

Example:

```text
[ARGO FLOAT]
      |
      | observed at
      ↓
[LOCATION + TIME]
      |
      | matched to
      ↓
[GLORYS MODEL STATE]
      |
      ├──────────────→ [TEMPERATURE]
      |
      ├──────────────→ [CURRENT]
      |
      └──────────────→ [DEPTH]
                         |
                         ↓
                    [DERIVED FEATURES]
                         |
                         ↓
                  [SCENARIO / RESPONSE]
```

This graph does not necessarily need to be exposed as a literal graph visualization.

It is primarily an internal product model.

---

# 33. Evidence Object

Create a unified evidence object.

Example:

```ts
interface EvidenceCase {
  id: string;

  observation: Observation;

  modelMatch: ModelMatch;

  profile: {
    observation: ProfileData;
    model: ProfileData;
    residual?: ResidualProfile;
  };

  derivedFeatures: DerivedFeature[];

  coverage?: CoverageSummary;

  current?: CurrentVector;

  provenance: Provenance;

  createdAt: string;
}
```

This object becomes the source for the Evidence UI.

---

# 34. Evidence Case Lifecycle

An evidence case has the following states:

```text
IDLE
 ↓
SELECTED
 ↓
LOADING
 ↓
MATCHED
 ↓
ANALYZING
 ↓
READY
```

Failure states:

```text
LOAD_ERROR
MATCH_ERROR
INSUFFICIENT_DATA
```

The UI must represent these states clearly.

---

# 35. Loading State

Do not show a generic spinner across the entire application.

Instead communicate what is happening.

Example:

```text
OBSERVATION SELECTED

Loading model match…
```

Then:

```text
Loading profile comparison…
```

Then:

```text
Calculating derived features…
```

This helps users understand the scientific pipeline.

---

# 36. Evidence Panel Layout

Recommended hierarchy:

```text
┌───────────────────────────────────────┐
│ OBSERVATION                           │
│ ARGO 2901234                          │
│ 15 JAN 2024 · 06:42 UTC               │
├───────────────────────────────────────┤
│ MODEL MATCH                           │
│ GLORYS12V1                            │
│ +6h · 3.2 km                          │
├───────────────────────────────────────┤
│ PROFILE                               │
│ Observation / Model / Residual        │
├───────────────────────────────────────┤
│ DERIVED FEATURES                      │
│ Thermocline · MLD · Current           │
├───────────────────────────────────────┤
│ DATA QUALITY                          │
│ Samples · Coverage · QC               │
├───────────────────────────────────────┤
│ PROVENANCE                            │
│ Dataset · Variables · Method          │
└───────────────────────────────────────┘
```

The panel should remain information-dense without becoming a card grid.

---

# 37. Avoid Dashboard Fragmentation

Do not split every scientific concept into a separate floating card.

Bad:

```text
[Temperature Card]
[Current Card]
[Depth Card]
[MLD Card]
[Thermocline Card]
[RMSE Card]
[Coverage Card]
```

Preferred:

```text
ONE EVIDENCE WORKSPACE

Observation
     ↓
Model Match
     ↓
Profile
     ↓
Derived Features
     ↓
Data Quality
     ↓
Provenance
```

The evidence hierarchy should be obvious.

---

# 38. Chart Interaction

Charts should support:

### Hover

Show:

```text
Depth
Observation
Model
Residual
```

### Click

Move the global analytical cursor.

### Drag

Move through the profile.

### Scroll

Zoom only if scientifically appropriate.

### Reset

Return to full profile extent.

---

# 39. Globe ↔ Profile Linking

Clicking a profile depth should update the globe.

Example:

```text
Profile:
Depth = 150m

↓

Globe:
Field slice = 150m
```

Clicking the globe depth/field should update the profile cursor.

This creates bidirectional analytical navigation.

---

# 40. Observation ↔ Scenario Linking

After evidence is established, the user may launch a response scenario.

The scenario must inherit:

```text
location
time
model dataset
current field
selected depth
```

The system should explicitly communicate:

```text
SCENARIO INITIALIZED FROM CURRENT EVIDENCE
```

This prevents the response workflow from feeling disconnected from the analysis.

---

# 41. Scenario Entry

Recommended action:

```text
SIMULATE DRIFT →
```

The button should only become active when the required current field is available.

Do not show a scenario based on unrelated or synthetic data.

---

# 42. Evidence Snapshot

The user should eventually be able to create a scientific snapshot.

Snapshot contents:

```text
Observation
Location
Time
Model
Depth
Variable
Model Match
Residual Statistics
Derived Features
Current
Scenario
Provenance
```

This is not a screenshot.

It is a structured scientific state.

---

# 43. Provenance

Every evidence case must retain provenance.

Minimum:

```text
Observation source
Model source
Dataset
Variables
Requested time
Selected model time
Requested coordinates
Selected model coordinates
Matching method
Derived feature methods
Scenario assumptions
```

The user should be able to inspect provenance without leaving the workflow.

---

# 44. Provenance Display

Use concise language.

Example:

```text
DATA SOURCE

Observation
Argo profile

Model
GLORYS12V1

Variables
thetao · uo · vo

Match
Nearest time / latitude / longitude

Residual
Observation − Model
```

A deeper "Details" section can expose technical metadata.

---

# 45. API Requirements

The evidence system should consume stable domain endpoints.

Recommended structure:

```http
GET /api/observations
GET /api/observations/{id}
GET /api/profile
GET /api/model-field
GET /api/evidence
GET /api/evidence/{id}
GET /api/derived-features
GET /api/sar/drift
```

Existing working endpoints should be preserved unless there is a strong reason to change them.

Do not break the current scientific data path merely to rename an endpoint.

---

# 46. Evidence Endpoint

Recommended conceptual request:

```http
GET /api/evidence?
    observation_id=2901234&
    time=2024-01-15T06:42:00Z&
    variables=temperature,current
```

Response:

```json
{
  "observation": {},
  "model_match": {},
  "profile": {},
  "residual": {},
  "derived_features": [],
  "coverage": {},
  "current": {},
  "provenance": {}
}
```

The exact API schema should follow the actual backend implementation.

Do not create duplicate scientific calculations in the frontend.

---

# 47. Frontend State

The evidence system should consume global scientific state.

Relevant state:

```ts
interface EvidenceState {
  selectedObservationId: string | null;

  evidenceStatus:
    | "idle"
    | "loading"
    | "ready"
    | "error";

  evidenceCase: EvidenceCase | null;

  cursorDepth: number | null;

  selectedFeature: string | null;
}
```

Do not maintain duplicate scientific state inside individual chart components.

---

# 48. Component Structure

Recommended:

```text
EvidenceWorkspace/
├── EvidenceHeader
├── ObservationSummary
├── ModelMatchSummary
├── ProfileComparison
├── ResidualProfile
├── WaterColumnLens
├── DerivedFeatures
├── CoverageSummary
├── ProvenancePanel
└── ScenarioLauncher
```

Each component should remain presentation-focused.

Scientific calculations belong in the Scientific Engine/backend.

---

# 49. Water Column Rendering Architecture

Recommended separation:

```text
Scientific Engine
      ↓
WaterColumnData
      ↓
WaterColumnRenderer
      ↓
Interaction Layer
```

The renderer should not independently fetch raw NetCDF data.

It receives normalized scientific data.

---

# 50. Performance

Evidence loading should avoid fetching the entire NetCDF dataset.

The backend should subset:

- relevant observation
- relevant time
- relevant spatial point
- required depth range
- required variables

Only send required data to the browser.

---

# 51. Caching

Cache repeated requests where appropriate.

Potential cache keys:

```text
observation_id
+
model_dataset
+
time
+
variable
+
depth_range
```

Do not cache mutable global state incorrectly.

---

# 52. Large Profiles

For large profiles:

- downsample only for rendering,
- retain scientific source values,
- preserve extrema,
- preserve selected cursor values,
- never alter values used for statistics.

Rendering optimization must not change scientific calculations.

---

# 53. Error Handling

## Observation unavailable

```text
Observation unavailable.

The selected platform does not contain a usable profile
for the requested variable.
```

## Model unavailable

```text
Model comparison unavailable.

The observation is available, but no matching model
state could be retrieved.
```

## Insufficient overlap

```text
Comparison incomplete.

There are not enough valid paired samples
to calculate the requested statistic.
```

## Derived feature unavailable

```text
Thermocline not identified.

The available profile does not satisfy the configured
detection criterion.
```

These messages should explain the reason.

---

# 54. Scientific Language Rules

Use:

```text
Model match
Spatial offset
Temporal offset
Residual
Observed
Modelled
Derived
Available
Unavailable
Insufficient data
```

Avoid unsupported claims such as:

```text
AI detected a dangerous zone
High confidence
Perfect prediction
Guaranteed drift
The model is wrong
The observation proves...
```

The interface must distinguish observation from interpretation.

---

# 55. Color Semantics

Color should encode scientific meaning.

Suggested semantic roles:

```text
Observation
neutral/high-contrast

Model
secondary scientific tone

Residual positive
one side of a diverging scale

Residual negative
opposite side

Selected
accent

Warning / limitation
restrained warning tone
```

Do not use neon gradients merely to make the interface look futuristic.

Color scales must remain interpretable.

---

# 56. Accessibility

Do not encode meaning using color alone.

For example:

```text
+0.8 °C
OBS > MODEL
```

should remain understandable even without color.

Charts should provide:

- readable labels,
- keyboard-accessible controls where possible,
- sufficient contrast,
- visible selected state.

---

# 57. Responsive Behavior

Desktop is the primary target because the product is a scientific analysis workspace.

However:

### Tablet

Allow:

```text
Globe
↓
Evidence panel
```

### Small screens

Prioritize:

```text
Observation
↓
Profile
↓
Evidence
```

Do not attempt to force the entire desktop 3D workspace onto a phone.

---

# 58. Demo Flow

The intended judge-facing sequence:

```text
1. Open NIRIKSHAN
        ↓
2. See real ocean model
        ↓
3. Change depth
        ↓
4. Change time
        ↓
5. Select an Argo observation
        ↓
6. Evidence workspace opens
        ↓
7. Show observation profile
        ↓
8. Show model profile
        ↓
9. Reveal residual
        ↓
10. Move analytical cursor
        ↓
11. Reveal thermocline / MLD
        ↓
12. Inspect current
        ↓
13. Launch SAR scenario
        ↓
14. Replay current-driven trajectory
        ↓
15. Open provenance
```

The transition must feel continuous.

---

# 59. Judge-Facing Insight Moment

The strongest moment in the Evidence workflow should be:

```text
OBSERVATION
      +
MODEL
      ↓
DIFFERENCE
      ↓
DERIVED STRUCTURE
```

For example:

```text
ARGO PROFILE
     ↓
MODEL PROFILE
     ↓
RESIDUAL
     ↓
THERMOCLINE
     ↓
CURRENT
     ↓
DRIFT SCENARIO
```

The user should be able to understand why the scenario exists.

---

# 60. What Makes This Different

The system should not compete through:

- more buttons,
- more charts,
- more cards,
- more animations,
- AI-generated explanations,
- decorative 3D effects.

Its differentiation is the scientific chain:

```text
Observe
→ Match
→ Compare
→ Explain
→ Respond
```

This relationship should be visible throughout the product.

---

# 61. Future Observation Sources

The system must be extensible to:

```text
Argo
Glider
CTD
BGC
Other in-situ platforms
```

Each new source should implement the common observation contract.

Do not create a completely separate UI workflow for every platform.

---

# 62. Future Multi-Model Comparison

The architecture should eventually support:

```text
Observation
      ↓
Model A
Model B
Model C
      ↓
Cross-model comparison
```

But this is not required for the initial MVP.

Do not implement multi-model complexity before the single-model evidence workflow is stable.

---

# 63. Future Evidence Search

Possible future capabilities:

```text
Find observations near location
Find profiles during time range
Find largest residuals
Find strongest currents
Find deepest thermocline
Find sparse-observation regions
```

These should operate on real indexed scientific data.

Do not fabricate ranking logic.

---

# 64. Future Evidence Intelligence

An optional future module may answer:

```text
What stands out?
```

But it must only summarize computed evidence.

Example:

```text
WHAT STANDS OUT

The observed temperature is approximately
0.8 °C higher than the matched model value
between 70–110 m.

The strongest gradient occurs near 92 m.
```

Every statement must link back to measurable data.

---

# 65. Non-Goals

Do not implement:

- generic chatbot
- fake AI scientist
- arbitrary confidence scores
- fabricated forecasts
- synthetic observations presented as real
- unexplained anomaly scores
- decorative 3D effects
- disconnected charts
- duplicate scientific calculations in React
- unrelated dashboards
- social features
- unnecessary authentication
- microservices for the MVP

---

# 66. Testing Requirements

## Unit Tests

Test:

- observation normalization,
- model matching,
- spatial distance,
- temporal distance,
- residual sign,
- statistics,
- missing values,
- derived feature availability.

---

## Integration Tests

Test:

```text
Observation
→ Model Match
→ Profile
→ Residual
→ Derived Features
```

---

## UI Tests

Verify:

- selecting an observation updates evidence,
- depth cursor synchronizes,
- profile and globe remain synchronized,
- loading states appear,
- errors are understandable,
- scenario inherits evidence state.

---

# 67. Acceptance Criteria

The Evidence System is complete when:

### Observation

- [ ] Real observation markers appear.
- [ ] Selecting a marker creates an evidence case.
- [ ] Platform identity is visible.
- [ ] Observation time/location are visible.

### Matching

- [ ] Model dataset is visible.
- [ ] Selected model time is visible.
- [ ] Selected model coordinates are visible.
- [ ] Spatial and temporal offsets are visible.
- [ ] Matching method is visible.

### Comparison

- [ ] Observation profile is visible.
- [ ] Model profile is visible.
- [ ] Residual profile is visible.
- [ ] Residual convention is consistent.
- [ ] Statistics use valid paired samples only.

### Derived Features

- [ ] Thermocline can be shown when detectable.
- [ ] MLD can be shown when detectable.
- [ ] Current speed/direction can be shown.
- [ ] Derived feature methods are traceable.

### Interaction

- [ ] Depth cursor synchronizes views.
- [ ] Globe and profile interact bidirectionally.
- [ ] Selected observation remains identifiable.
- [ ] Scenario can inherit evidence state.

### Provenance

- [ ] Source dataset is visible.
- [ ] Model variables are visible.
- [ ] Match metadata is retained.
- [ ] Calculation methods are inspectable.

### Integrity

- [ ] No fake data is introduced.
- [ ] No arbitrary confidence score is presented.
- [ ] Missing values remain missing.
- [ ] Scientific calculations are not duplicated in the UI.
- [ ] SAR uses the same current field as the analytical view.

---

# 68. Implementation Priority

## P0 — Required

Implement first:

```text
Observation selection
Model matching
Observation profile
Model profile
Residual profile
Match metadata
Depth cursor
Provenance
Current inspection
```

---

## P1 — High Value

Then:

```text
Water-Column Lens
Thermocline
MLD
Coverage
Synchronized globe/profile interaction
Evidence snapshot
Scenario handoff
```

---

## P2 — Advanced

Then:

```text
Vertical transects
Spatial residual maps
Current shear
Temporal comparison
Observation density analysis
Multiple observations
```

---

## P3 — Future

Eventually:

```text
Glider
CTD
BGC
Multi-model comparison
OGC services
OPeNDAP
Live data ingestion
Evidence search
Scientific intelligence
Collaboration
```

---

# 69. Final Design Rule

The Evidence System should make the following statement true:

> Every important conclusion in NIRIKSHAN can be traced back to an observation, a model state, a calculation, and a visible piece of evidence.

If the user cannot trace a result back to those elements, the feature is not ready.

The product should never ask the user to simply trust NIRIKSHAN.

It should let the user inspect the evidence.
```
