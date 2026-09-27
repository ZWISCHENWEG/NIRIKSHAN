
# `01_PRD.md`

```md
# NIRIKSHAN
## Product Requirements Document

### 3D Ocean Analysis & Response Workspace

> SEE → VERIFY → UNDERSTAND → RESPOND

**SIH Problem Statement:** SIH26067  
**Organization:** Ministry of Earth Sciences (MoES)  
**Department:** Indian National Centre for Ocean Information Services (INCOIS)  
**Theme:** Disaster Management  
**Team:** ZWP

---

# 1. Document Purpose

This document defines the product requirements for NIRIKSHAN.

It describes:

- the users
- the problems being solved
- product goals
- functional requirements
- scientific requirements
- interaction requirements
- performance requirements
- extensibility requirements
- differentiating capabilities
- MVP scope
- future scope
- acceptance criteria
- explicit non-goals

This document is the product contract for implementation.

AI coding agents, developers and designers must use this document together with:

```text
00_PROJECT_VISION.md
02_ARCHITECTURE.md
03_SCIENTIFIC_ENGINE.md
04_OBSERVATION_EVIDENCE.md
05_RESPONSE_ENGINE.md
06_DESIGN_SYSTEM.md
```

When implementation decisions conflict with this PRD, the PRD and project vision take precedence unless intentionally revised.

---

# 2. Product Summary

NIRIKSHAN is a browser-native 3D scientific workspace that integrates:

- numerical ocean model outputs
- in-situ observations
- depth-resolved ocean fields
- temporal model states
- scientific derived quantities
- model-observation comparisons
- current analysis
- operational response scenarios

into one synchronized environment.

The platform is designed to help a user move from:

```text
SEE
 ↓
VERIFY
 ↓
UNDERSTAND
 ↓
RESPOND
```

The product is not simply a visualization layer.

It is an analytical environment built around the relationship between:

```text
MODEL
+
OBSERVATION
+
PHYSICAL STRUCTURE
+
OPERATIONAL CONSEQUENCE
```

---

# 3. Product Vision

## Vision Statement

> Make complex ocean model and observation data understandable, verifiable and operationally useful through a single interactive 3D scientific workspace.

---

# 4. Product Mission

NIRIKSHAN should reduce the cognitive and technical gap between raw oceanographic datasets and scientific interpretation.

A user should be able to:

1. locate an ocean region
2. inspect its modeled state
3. inspect observations
4. compare model against observations
5. identify important water-column structures
6. understand current behaviour
7. investigate a response scenario
8. trace results back to their data sources

without switching between unrelated tools.

---

# 5. Target Users

The product is designed primarily for technically literate ocean-data users.

---

## 5.1 Primary User — Operational Oceanographer

Typical needs:

- understand current ocean state
- inspect model fields
- inspect observations
- compare model with measurements
- identify unusual structures
- investigate currents
- rapidly investigate a region

Primary value:

> Faster spatial and depth-aware analysis.

---

## 5.2 Primary User — Ocean Forecaster

Typical needs:

- inspect model output
- validate against available observations
- understand current structure
- investigate changes over time
- assess possible operational implications

Primary value:

> A unified context for model and observation interpretation.

---

## 5.3 Secondary User — Search & Rescue Analyst

Typical needs:

- identify current conditions
- understand drift direction
- investigate probable trajectory
- inspect the underlying ocean field

Primary value:

> Connect physical current conditions to a visual drift scenario.

NIRIKSHAN must not present prototype SAR calculations as official operational SAR forecasts.

---

## 5.4 Secondary User — Researcher

Typical needs:

- inspect profiles
- compare datasets
- investigate anomalies
- understand water-column structure
- inspect provenance
- reproduce calculations

Primary value:

> Transparent exploratory analysis.

---

## 5.5 Secondary User — Student / Educator

Typical needs:

- visually understand ocean structure
- explore temperature/current/depth relationships
- inspect real observations

Primary value:

> Making complex oceanographic information accessible.

This is secondary to the operational/scientific use case.

---

# 6. Core User Problems

NIRIKSHAN must solve the following problems.

---

## Problem 1 — Fragmented visualization

Model data and observational data are often examined through different tools.

NIRIKSHAN must bring them into one environment.

---

## Problem 2 — Lack of 3D depth context

A 2D map cannot adequately communicate vertical ocean structure.

NIRIKSHAN must make depth a first-class dimension.

---

## Problem 3 — Difficult model-observation comparison

Users need to know whether modeled values correspond with real measurements.

NIRIKSHAN must support direct comparison.

---

## Problem 4 — Difficult interpretation of raw fields

Users should not need to manually calculate every basic derived structure.

NIRIKSHAN should provide transparent derived analysis such as:

- temperature gradient
- thermocline
- mixed-layer depth
- current speed
- current direction
- current shear
- anomalies

where scientifically justified by available data.

---

## Problem 5 — Disconnected operational interpretation

A current field should not exist independently from a scenario such as drift.

NIRIKSHAN should allow the same underlying physical field to drive scenario exploration.

---

## Problem 6 — Poor data transparency

Scientific results are less trustworthy when users cannot determine:

- where the value came from
- which dataset was used
- which timestamp was used
- which matching method was used
- which processing occurred

NIRIKSHAN must make provenance accessible.

---

# 7. Product Principles

The following principles are mandatory.

---

## Principle 1 — Scientific data before visual effects

Real data is more valuable than visual decoration.

---

## Principle 2 — One source of truth

The same scientific state should drive:

- visualization
- analysis
- comparison
- simulation

where applicable.

---

## Principle 3 — Depth is a first-class dimension

Depth must never be treated as merely a chart axis.

It must participate in the 3D interaction model.

---

## Principle 4 — Time is a first-class dimension

Users should be able to understand how an ocean state changes through time.

---

## Principle 5 — Observation and model remain distinct

Never visually imply that an observation is a model value or vice versa.

---

## Principle 6 — Every derived result is explainable

If NIRIKSHAN says:

> Thermocline: 76 m

the user should be able to inspect how that value was derived.

---

## Principle 7 — Missing data is better than fake data

Never silently generate scientific values.

---

## Principle 8 — Operational context must remain honest

Prototype scenarios must not be represented as official operational products.

---

## Principle 9 — Progressive disclosure

The interface should expose complexity only when useful.

A beginner can explore.

An expert can inspect details.

---

## Principle 10 — Performance is a product feature

A scientifically sophisticated visualization that becomes unusable in a browser is not successful.

---

# 8. Product Modes

NIRIKSHAN has three major modes.

```text
EXPLORE
EVIDENCE
RESPONSE
```

---

# 9. EXPLORE Mode

## Objective

Understand the spatial, temporal and vertical ocean state.

---

## Functional Requirements

### EXP-001 — 3D geographic context

The user must be able to navigate an interactive 3D globe.

---

### EXP-002 — Model field visualization

The system must visualize model fields including available:

- temperature
- salinity
- currents
- chlorophyll
- other supported variables

The MVP prioritizes:

```text
temperature
currents
```

Additional variables must be data-driven.

---

### EXP-003 — Depth control

The user must be able to move through model depth levels.

The system should:

- expose actual available depths
- avoid inventing unsupported levels
- indicate current depth
- synchronize depth with analytical views

---

### EXP-004 — Time control

The user must be able to navigate available model timestamps.

Supported interactions may include:

- timeline
- play/pause
- previous timestep
- next timestep
- direct timestamp selection

---

### EXP-005 — Variable switching

The user must be able to switch between available variables.

The UI must only expose variables supported by the current dataset.

---

### EXP-006 — Current visualization

The system must visualize:

- current direction
- current speed

using actual:

```text
uo
vo
```

where available.

---

### EXP-007 — Scientific color scales

Color scales must be appropriate for scientific data.

The system should support:

- min/max
- linear scale
- logarithmic scale where scientifically appropriate
- scientific colormaps
- diverging scales for anomalies/residuals

---

### EXP-008 — Observation overlay

Observation locations should appear in spatial context.

The user should be able to distinguish observation types.

---

### EXP-009 — Vertical exaggeration

The system may support vertical exaggeration.

It must clearly distinguish:

```text
visual exaggeration
```

from:

```text
actual geographic scale
```

---

### EXP-010 — Depth slice

The user should be able to inspect a horizontal slice at a selected depth.

---

### EXP-011 — Vertical section

The platform should eventually support a vertical transect.

The user can define:

```text
point A
   ↓
transect
   ↓
point B
```

and inspect a depth-resolved section.

This is a high-value scientific feature but may be deferred if time is limited.

---

### EXP-012 — Isosurface

The platform should eventually support isosurface extraction for suitable variables.

Example:

```text
temperature = 28°C
```

This is a Phase 2/advanced visualization capability.

---

# 10. EVIDENCE Mode

## Objective

Connect a real observation to the corresponding model state.

This is the primary differentiator.

---

# 11. Observation Selection

### EVD-001

The user can select an observation marker.

---

### EVD-002

The system focuses the camera on the selected observation.

---

### EVD-003

The system identifies:

- platform ID
- observation type
- latitude
- longitude
- time
- available depth
- quality metadata where available

---

# 12. Observation Profile

### EVD-004

The system must display the actual observed profile.

Depending on the dataset:

- temperature vs depth
- salinity vs depth
- chlorophyll vs depth
- other variables

---

### EVD-005

The system must not interpolate missing observations unless explicitly configured.

Missing sections should remain visually identifiable.

---

# 13. Model Profile

### EVD-006

For a selected observation, the system should retrieve the corresponding model column.

The model profile must be based on:

- observation location
- observation timestamp
- selected model variable
- selected matching/interpolation method

---

# 14. Model-Observation Comparison

### EVD-007

The user must be able to compare:

```text
OBSERVATION
vs
MODEL
```

---

### EVD-008

The comparison must support:

- overlaid profiles
- difference profile
- summary statistics

---

## Difference

For a variable X:

```text
residual = observation - model
```

---

# 15. Comparison Metrics

Where enough valid data exists, the platform may calculate:

- mean error
- mean absolute error
- RMSE
- bias
- correlation

These must never be calculated on invalid/missing values.

The UI must disclose the number of valid matched points used.

Example:

```text
RMSE
0.38 °C

Valid depth points
42 / 50
```

This prevents misleading statistics.

---

# 16. Residual Visualization

The residual should be visualized as a first-class scientific object.

Example:

```text
Observation
──────────────

Model
──────────────

Residual
──────────────
```

Residual color scales should be centered appropriately around zero when meaningful.

---

# 17. Horizontal Residual Map

Future capability:

At a selected depth:

```text
Observation
      +
Model field
      ↓
Residual field
```

This can identify spatial regions where model and observations disagree.

Only regions with adequate observations should be represented.

No artificial interpolation should be presented as observation evidence without explicit labeling.

---

# 18. Temporal Comparison

Future capability:

For a selected observation location, compare model and observation through time where the data supports it.

Example:

```text
Time →
Model
──────────────

Observed
──────────────
```

This can reveal temporal model drift or event mismatch.

---

# 19. Water-Column Lens

### EVD-009

Selecting an observation should be able to open a local water-column analytical view.

The lens must synchronize:

- location
- time
- depth
- model field
- observation
- current
- derived features

---

# 20. Synchronized Analytical Cursor

This is a key planned interaction.

A single analytical cursor should be able to synchronize:

```text
3D Globe
     ↕
Water Column
     ↕
Profile
     ↕
Residual
     ↕
Current
```

For example:

When the user moves the cursor to 80 m:

- globe depth changes
- water-column marker moves
- observation value updates
- model value updates
- residual updates
- current context updates

This creates one coherent analytical state.

---

# 21. Derived Ocean Features

NIRIKSHAN should provide scientifically meaningful derived quantities.

---

## 21.1 Current speed

```text
speed = sqrt(u² + v²)
```

---

## 21.2 Current direction

Calculated from:

```text
u
v
```

and clearly documented as direction of current vector.

---

## 21.3 Temperature gradient

```text
dT/dz
```

---

## 21.4 Thermocline

The platform may estimate thermocline depth using a documented temperature-gradient method.

The exact method must be defined in:

```text
03_SCIENTIFIC_ENGINE.md
```

The UI must show the method.

---

## 21.5 Mixed Layer Depth

The platform may calculate MLD using a documented threshold/criterion.

The selected criterion must be visible.

---

## 21.6 Vertical current shear

Calculate:

```text
du/dz
dv/dz
```

and optionally:

```text
shear magnitude
```

---

## 21.7 Anomaly

Anomaly calculations may be supported when an appropriate reference/climatology exists.

NIRIKSHAN must not call a value an "anomaly" without defining the reference.

---

# 22. Scientific Evidence Graph

A planned high-value internal concept is the:

> **Evidence Graph**

Every analytical result can be represented as:

```text
OBSERVATION
     │
     ├───────────────┐
     ↓               ↓
LOCATION           TIME
     │               │
     └───────┬───────┘
             ↓
        MODEL STATE
             │
      ┌──────┼──────┐
      ↓      ↓      ↓
    FIELD  CURRENT  DEPTH
      │
      ↓
   COMPARISON
      │
      ↓
   RESIDUAL
      │
      ↓
  DERIVED FEATURE
      │
      ↓
   SCENARIO
```

This graph does not need to be visible as a literal graph in the MVP.

It is a conceptual data model that ensures analytical outputs remain traceable.

---

# 23. Provenance

Every major analytical result should expose provenance.

Example:

```text
SOURCE
GLORYS12V1

VARIABLE
thetao

TIME
2024-01-06 00:00 UTC

DEPTH
75 m

LATITUDE
15.0°N

LONGITUDE
85.0°E

MATCH METHOD
Nearest neighbour

PROCESSING
No interpolation
```

For observations:

```text
SOURCE
Argo GDAC

PLATFORM
7901126

OBSERVATION TIME
...

QC
...

VARIABLE
...
```

---

# 24. Data Health

NIRIKSHAN should expose a compact data-health/context view.

Example:

```text
DATA STATUS

MODEL
GLORYS12V1
10 time steps
50 depths

OBSERVATIONS
ARGO
19 platforms

COVERAGE
5–25°N
75–100°E

TIME
01–10 Jan 2024
```

This allows the user to immediately understand the context of the current analysis.

---

# 25. RESPONSE Mode

## Objective

Use the same underlying physical ocean state to investigate an operational scenario.

---

# 26. Search & Rescue Scenario

### RSP-001

The user selects a starting location.

---

### RSP-002

The system displays the selected start position.

---

### RSP-003

The simulation samples the actual model current field.

---

### RSP-004

The simulation integrates the drift trajectory.

Initial method:

```text
Euler integration
```

Potential future method:

```text
RK2 / RK4
```

Only upgrade if scientifically justified and useful.

---

# 27. SAR Inputs

Potential inputs:

- starting latitude
- starting longitude
- start time
- simulation duration
- particle/object type
- drift parameters

The MVP may use a simplified passive-drift scenario.

---

# 28. SAR Output

The system should display:

- trajectory
- timestamps
- position
- current velocity
- direction
- elapsed time

Future:

- ensemble particles
- uncertainty corridor
- confidence region

---

# 29. Scenario Replay

A high-value feature is:

> **Replay the exact ocean state used by the scenario.**

If the simulation uses:

```text
2024-01-05 12:00 UTC
surface current
```

the user should be able to return to that exact:

- time
- depth
- region
- current field

from the scenario interface.

This ensures scenario outputs remain connected to the scientific state.

---

# 30. Scenario Evidence

A response scenario should show:

```text
SCENARIO
SAR DRIFT

START
15.0°N
85.0°E

START TIME
...

DURATION
72 h

CURRENT SOURCE
GLORYS12V1

DEPTH
Surface

METHOD
Euler integration
```

The purpose is transparency.

---

# 31. Decision Snapshot

A planned high-value output is:

> **Scientific Decision Snapshot**

The user can capture the current analytical state.

A snapshot may include:

- map/globe view
- selected observation
- model variable
- depth
- timestamp
- profile
- residual
- derived metrics
- scenario state
- provenance

The snapshot should be exportable as:

- image/PDF in future
- structured JSON
- shareable internal state

The MVP can begin with a local/browser snapshot.

---

# 32. Scientific Bookmarks

Users should eventually be able to save:

```text
Location
Time
Depth
Variable
Selected observation
Analysis state
```

Example:

```text
"Bay of Bengal thermocline case"
```

Bookmarks are local/session-level initially.

No authentication is required for MVP.

---

# 33. Data Ingestion

The architecture must support modular ingestion.

Initial formats:

- NetCDF
- delimited text where required

Potential future sources:

- Argo
- Glider
- CTD
- BGC
- moorings
- HF radar
- ADCP
- additional models

The ingestion layer must normalize source-specific structures.

---

# 34. Observation Quality Control

Where quality flags are available, they must be preserved.

Possible states:

```text
GOOD
CAUTION
BAD
UNKNOWN
```

The exact mapping must respect the source dataset.

The system must not invent QC information.

---

# 35. Graceful Degradation

If a dataset lacks a variable:

```text
temperature ✓
salinity    ✓
chlorophyll —
```

the system should:

- keep temperature functional
- keep salinity functional
- disable chlorophyll-specific analysis
- explain why

It must not crash the entire application.

---

# 36. Multi-Dataset Architecture

Future NIRIKSHAN versions should allow:

```text
Dataset A
     vs
Dataset B
     vs
Observation
```

Potential use cases:

- model comparison
- reanalysis vs forecast
- multiple model products

This is not required for the initial MVP.

---

# 37. Model Comparison

Future capability:

```text
GLORYS
   vs
HYCOM
   vs
INCOIS model
```

Comparison should be based on standardized variables and coordinates.

This should only be implemented after the core model-observation comparison is stable.

---

# 38. Uncertainty

NIRIKSHAN should distinguish between:

### Data quality

How trustworthy is the source measurement?

### Model-observation mismatch

How different are the values?

### Simulation uncertainty

How sensitive is the scenario outcome?

These are different concepts.

They must not be collapsed into one arbitrary "confidence score."

---

# 39. Optional Intelligence Layer

An intelligence layer may be added later.

It must NOT become a generic chatbot.

Potential capabilities:

- automatically identify notable structures
- summarize a selected region
- explain a residual
- highlight unusual gradients
- surface nearby observations
- generate evidence-based textual summaries

Any generated statement must be traceable to actual computed values.

Example:

```text
The strongest temperature gradient occurs
between 68–82 m.

The model is 0.42°C warmer than the selected
Argo observation at approximately 80 m.

Source:
GLORYS12V1 + Argo
```

The system must never invent explanations unsupported by the data.

---

# 40. "What Stands Out?" Feature

A potential advanced interaction:

> **What stands out here?**

The science engine examines available derived metrics and reports notable features.

Possible outputs:

```text
Strong temperature gradient
Model-observation mismatch
High current speed
Strong vertical shear
Unusual depth structure
Sparse observation coverage
```

This should be deterministic and evidence-based.

It should not pretend to be an autonomous ocean scientist.

---

# 41. Search and Discovery

Future users should be able to search for:

- coordinates
- region
- float ID
- observation time
- dataset
- variable

Example:

```text
Search:
7901126
```

returns the relevant Argo platform.

---

# 42. Coverage Awareness

The platform should communicate when an analysis is poorly supported by observations.

Example:

```text
OBSERVATION COVERAGE

Nearest Argo:
184 km

Available observations:
3

Model-observation comparison:
LOW SUPPORT
```

This is preferable to presenting sparse observations as if they represent the entire region.

---

# 43. Spatial Context

The system should preserve awareness of:

- coastline
- EEZ where appropriate and legally sourced
- bathymetry where available
- regional boundaries
- observation locations

Additional geographic layers must be added only when they support analysis.

---

# 44. Bathymetry

Future capability.

Bathymetry could improve:

- water-column understanding
- coastal context
- depth interpretation

It is not required for the initial MVP.

---

# 45. Performance Requirements

The browser must not download the complete scientific dataset unnecessarily.

The backend should:

- subset server-side
- avoid repeated full dataset reads
- reuse open datasets where safe
- cache repeated requests
- minimize payload size

---

# 46. Target Interaction Performance

For normal regional interactions:

### Goal

```text
UI response:
< 100 ms where locally cached

API scientific subset:
< 1–2 seconds target

Complex derived analysis:
< 3 seconds target
```

These are engineering targets, not scientific guarantees.

If a calculation is necessarily slower, the UI must communicate processing state.

---

# 47. Browser Performance

The visualization should target:

- smooth camera movement
- stable interaction
- controlled particle counts
- adaptive rendering
- level of detail
- limited DOM complexity

Do not attempt to render millions of points simultaneously if a scientifically equivalent representation is possible.

---

# 48. Level of Detail

Large model fields should support:

```text
LOW
MEDIUM
HIGH
```

or dynamic adaptive resolution.

The system should prioritize the currently visible region.

---

# 49. API Payload Requirements

Never return:

```text
entire 207 MB NetCDF file
```

for a normal visualization request.

Return only:

- requested region
- requested depth
- requested time
- requested variable
- necessary metadata

---

# 50. Error Handling

The system must gracefully handle:

- invalid coordinates
- unsupported time
- unsupported depth
- missing variable
- missing observation
- NaN values
- corrupted data
- backend failure
- unavailable dataset

Errors must be human-readable.

---

# 51. Accessibility

The application should support:

- keyboard-accessible controls where practical
- clear labels
- sufficient contrast
- non-color-only distinctions
- readable numerical values
- meaningful status messages

Scientific color scales should not be the only way to distinguish important states.

---

# 52. Responsive Behaviour

The primary target is desktop/laptop because 3D scientific analysis requires substantial screen space.

Tablet support is desirable.

Mobile is not an MVP priority.

---

# 53. Security

The system must not expose:

- Copernicus credentials
- private API keys
- server secrets

Client-side public API keys must be treated as public and restricted appropriately at the provider level.

---

# 54. No Authentication in MVP

Authentication is explicitly out of scope for the first SIH prototype.

The focus is:

```text
scientific capability
+
interaction
+
performance
```

not account management.

---

# 55. No Database Requirement in MVP

The initial scientific prototype can operate directly on:

- NetCDF
- normalized data
- local/server-side datasets

A database should only be introduced when it solves a demonstrated scaling or metadata problem.

---

# 56. Extensibility

The platform should support future adapters:

```text
GLORYS
INCOIS
HYCOM
Argo
Glider
CTD
BGC
WMS
WCS
OPeNDAP
```

without requiring a complete frontend rewrite.

---

# 57. Open Standards

Where appropriate:

- CF Conventions
- NetCDF
- OGC WMS
- OGC WCS
- OPeNDAP

The system should use standards because they improve interoperability, not merely because they look good in a presentation.

---

# 58. Product Differentiators

NIRIKSHAN should differentiate through the following combination.

---

## Differentiator 1

### 3D + observations in the same analytical state

---

## Differentiator 2

### Model-observation residual analysis

---

## Differentiator 3

### Water-Column Lens

---

## Differentiator 4

### Synchronized depth/time/location cursor

---

## Differentiator 5

### Transparent scientific provenance

---

## Differentiator 6

### Derived ocean structure detection

Examples:

- thermocline
- MLD
- current shear

---

## Differentiator 7

### Same physical field drives visualization and response simulation

---

## Differentiator 8

### Evidence-based scenario replay

---

## Differentiator 9

### Scientific Decision Snapshot

---

## Differentiator 10

### Data coverage awareness

The platform should tell users when observations are sparse.

---

# 59. MVP Scope

The MVP must include:

```text
✓ Real GLORYS data
✓ Real Argo data
✓ 3D geographic visualization
✓ Temperature
✓ Current vectors
✓ Depth control
✓ Time control
✓ Observation markers
✓ Observation profile
✓ Model profile
✓ Model-observation residual
✓ Water-column analytical view
✓ At least one derived feature
✓ Provenance
✓ Current-driven SAR scenario
```

---

# 60. MVP Priority Levels

## P0 — Critical

Must work.

```text
Real model
Real observations
3D visualization
Depth
Time
Observation selection
Model/observation comparison
Current field
Provenance
```

---

## P1 — Differentiating

Strongly recommended.

```text
Water-Column Lens
Residual visualization
Thermocline
MLD
Synchronized cursor
Scenario replay
Scientific snapshot
```

---

## P2 — Advanced

Implement if time permits.

```text
Vertical transects
Isosurfaces
Horizontal residual maps
Temporal comparison
Current shear
Observation coverage analysis
Ensemble drift
Uncertainty corridor
```

---

## P3 — Future

Do not compromise MVP for these.

```text
Multi-model comparison
Glider
CTD
BGC
WMS
WCS
OPeNDAP
Live ingestion
Global scaling
AI explanation layer
Authentication
Collaborative analysis
```

---

# 61. Explicitly Out of Scope

The following should not be built for the MVP:

- generic chatbot
- blockchain
- cryptocurrency
- social features
- user profiles
- complex authentication
- unnecessary microservices
- huge relational database
- mobile application
- fake real-time feeds
- fabricated observations
- fabricated forecasts
- excessive dashboards
- unnecessary machine learning
- decorative 3D effects
- gaming UI

---

# 62. Acceptance Criteria

NIRIKSHAN satisfies the core PRD when the following workflow works:

```text
1. User opens application
2. Real GLORYS field is displayed
3. User changes depth
4. Field changes to actual selected model depth
5. User changes time
6. Field changes to actual model timestep
7. Real Argo observations appear
8. User selects an Argo
9. Camera focuses observation
10. Real observation profile appears
11. Matching GLORYS profile appears
12. Residual is calculated
13. At least one derived feature is calculated
14. Current field is displayed
15. SAR scenario uses the actual current field
16. Scenario trajectory is visible
17. Provenance is accessible
18. No scientific value is silently fabricated
```

---

# 63. Scientific Acceptance Criteria

The system must be able to answer:

### Where did this number come from?

### Which dataset produced it?

### Which variable produced it?

### Which time was used?

### Which depth was used?

### How was model-observation matching performed?

### How was the derived quantity calculated?

### Is the result based on an observation, model, or derived calculation?

If the system cannot answer these questions, the corresponding feature is not considered scientifically complete.

---

# 64. UX Acceptance Criteria

The user should be able to understand the core workflow without a developer explaining every control.

The interface should communicate:

```text
WHAT AM I LOOKING AT?
WHERE IS IT?
WHEN IS IT?
AT WHAT DEPTH?
WHAT DATA IS THIS?
WHAT DOES THE OBSERVATION SAY?
WHAT DOES THE MODEL SAY?
WHAT IS DIFFERENT?
WHY IS IT IMPORTANT?
```

---

# 65. Judge Acceptance Criteria

Within the first minute of a demonstration, the judge should be able to see:

```text
REAL DATA
    ↓
3D OCEAN
    ↓
OBSERVATION
    ↓
MODEL COMPARISON
    ↓
SCIENTIFIC INSIGHT
```

Within the following minute:

```text
CURRENT FIELD
    ↓
RESPONSE SCENARIO
    ↓
TRAJECTORY
```

The product should be understandable through interaction rather than slides alone.

---

# 66. Demonstration Story

The preferred demonstration story is:

> "Let's inspect this part of the Bay of Bengal."

Then:

```text
1. Explore the 3D field
2. Change depth
3. Select an Argo
4. Open Ocean Evidence
5. Compare observed vs model temperature
6. Move through depth
7. Reveal thermocline / MLD
8. Inspect current
9. Launch SAR scenario
10. Replay the underlying current state
11. Show provenance
```

The judge sees one continuous scientific story.

---

# 67. Competitive Strategy

NIRIKSHAN should not compete by simply adding more features than other projects.

It should compete through:

```text
COHERENCE
+
SCIENTIFIC TRUST
+
INTERACTION QUALITY
+
ANALYTICAL DEPTH
+
OPERATIONAL RELEVANCE
```

A smaller number of deeply integrated features is preferable to a large number of shallow features.

---

# 68. Feature Quality Standard

A feature is not complete merely because:

```text
button exists
```

It is complete when:

```text
DATA
 ↓
PROCESSING
 ↓
VISUALIZATION
 ↓
INTERACTION
 ↓
PROVENANCE
 ↓
VALIDATION
```

all exist where applicable.

---

# 69. AI Agent Development Rules

AI coding agents must:

1. Read `00_PROJECT_VISION.md`.
2. Read this PRD.
3. Read the relevant subsystem document before modifying it.
4. Inspect existing implementation before rewriting.
5. Preserve working functionality.
6. Never replace real scientific data with mocks.
7. Never invent scientific values.
8. Avoid unnecessary dependencies.
9. Avoid unnecessary architecture complexity.
10. Test every scientific feature.
11. Report assumptions.
12. Report unresolved scientific limitations.
13. Keep frontend/backend contracts synchronized.
14. Avoid visual redesign unless requested.
15. Avoid scope expansion without explicit approval.

---

# 70. Change Control

Before adding a significant feature, determine:

```text
Does it support:
SEE?
VERIFY?
UNDERSTAND?
RESPOND?
```

If not, reject it.

For features that do support the product:

Evaluate:

```text
Scientific value
Judge value
Implementation cost
Performance cost
Maintenance cost
Data requirements
```

Only implement when the expected value justifies the complexity.

---

# 71. Future Expansion Opportunities

Once the MVP is stable, possible extensions include:

### Observation network

- Glider
- CTD
- BGC
- moorings
- HF radar
- ADCP

### Model network

- GLORYS
- INCOIS
- HYCOM
- additional models

### Scientific analysis

- water masses
- stratification
- thermocline
- MLD
- current shear
- eddy detection
- anomaly detection

### Operational analysis

- SAR
- oil spill
- heat events
- transport corridors

### Infrastructure

- OGC services
- OPeNDAP
- tile-based rendering
- caching
- cloud deployment
- distributed processing

---

# 72. Advanced Future Concept — Ocean Evidence Graph

A future version may make the Evidence Graph explicit.

For each analytical conclusion:

```text
CONCLUSION
    ↓
DERIVED METRIC
    ↓
MODEL / OBSERVATION
    ↓
DATASET
    ↓
SOURCE
```

This would allow a user to move from a high-level insight back to the underlying measurements.

This is a long-term differentiator.

---

# 73. Advanced Future Concept — Scientific Replay

NIRIKSHAN may eventually allow a complete analysis state to be replayed.

Example:

```text
CASE
Bay of Bengal
06 Jan 2024
12:00 UTC
80 m

OBSERVATION
ARGO 7901126

VARIABLE
Temperature

MODEL
GLORYS12V1

SCENARIO
SAR

DURATION
72h
```

Another user could load the same case and reproduce the analysis.

This would be valuable for:

- demonstrations
- research
- education
- operational review
- reproducibility

---

# 74. Advanced Future Concept — Evidence-Based Intelligence

Future intelligence capabilities may generate statements only from the scientific engine.

Example:

```text
NOTABLE STRUCTURE

Temperature gradient is strongest
between 70–82 m.

MODEL DIFFERENCE

The model is approximately
0.42°C warmer than the selected
observation near 80 m.

CURRENT

Surface flow is predominantly
northeastward at 0.38 m/s.

DATA SUPPORT

1 Argo platform within
the selected analysis radius.
```

Every statement must be traceable.

---

# 75. Final Product Requirement

NIRIKSHAN must not become:

> a collection of impressive-looking technical features.

It must become:

> **one coherent scientific workflow.**

The strongest experience is:

```text
SEE
 ↓
SELECT
 ↓
EVIDENCE
 ↓
COMPARE
 ↓
UNDERSTAND
 ↓
SIMULATE
 ↓
RESPOND
```

---

# 76. Final Definition of Done

NIRIKSHAN is ready for SIH demonstration when a technical judge can interact with the system and independently understand that:

1. the data is real
2. the model is real
3. observations are real
4. the 3D field is scientifically connected to the dataset
5. depth is genuinely represented
6. time is genuinely represented
7. model and observations can be compared
8. differences can be quantified
9. physical structures can be identified
10. current fields are real
11. the response scenario uses those currents
12. results have provenance
13. limitations are visible
14. the entire workflow works in one browser environment

The goal is not to claim that NIRIKSHAN replaces operational systems.

The goal is to demonstrate a technically credible, scientifically transparent, extensible foundation for a unified 3D ocean analysis environment.
```

---

## One important strategic change I made

I added **P0/P1/P2/P3 prioritization**.

This is extremely important for an AI coding agent.

Without it, if we give Claude/Antigravity all these ideas, it may try to build:

> WMS + WCS + Gliders + BGC + AI + oil spill + MLD + eddies + bathymetry + global data + authentication...

and six hours later we'll have 30% of everything and 0% of a polished product.

Instead:

### 🔴 P0
**Must work.**

### 🟠 P1
**Make us differentiated.**

### 🟡 P2
**Wow factor if time allows.**

### ⚪ P3
**Architecture/future vision, don't let it derail MVP.**

---

## The next document should be `02_ARCHITECTURE.md`

And that one will be **much more technical than the first architecture outline**.

It will specify:

```text
Frontend
   ↓
State management
   ↓
API client
   ↓
FastAPI
   ↓
Science Engine
   ├── Data adapters
   ├── Model sampler
   ├── Observation sampler
   ├── Matching engine
   ├── Residual engine
   ├── Feature detection
   ├── Current engine
   └── Scenario engine
          ↓
      NetCDF/xarray
          ↓
     GLORYS + Argo
```

including **folder structure, module responsibilities, data contracts, caching strategy, scientific state model, event flow, frontend state architecture, WebGL architecture, failure boundaries, and future scalability**.
