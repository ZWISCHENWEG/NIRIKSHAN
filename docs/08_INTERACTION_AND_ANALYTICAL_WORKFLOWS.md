# `08_INTERACTION_AND_ANALYTICAL_WORKFLOWS.md`

```md
# NIRIKSHAN — Interaction & Analytical Workflows

## Document Status

- Product: NIRIKSHAN
- Document: Interaction & Analytical Workflows
- Version: 1.0
- Status: Implementation Specification
- Audience:
  - AI coding agents
  - Frontend developers
  - Backend developers
  - UX engineers
  - Scientific reviewers
- Depends on:
  - `01_PRD.md`
  - `02_ARCHITECTURE.md`
  - `03_SCIENTIFIC_ENGINE.md`
  - `04_OBSERVATION_EVIDENCE.md`
  - `05_UI_UX_SYSTEM.md`
  - `06_API_CONTRACTS.md`
  - `07_DATA_PIPELINE_AND_INGESTION.md`

---

# 1. Purpose

This document defines exactly how a user moves through NIRIKSHAN.

The goal is to transform the product from a collection of features into a coherent analytical workflow.

The primary product loop is:

```text
SEE
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
SNAPSHOT
```

The user should never feel that they are jumping between unrelated screens.

Every interaction should preserve scientific context.

---

# 2. Core Workflow

The complete NIRIKSHAN workflow is:

```text
EXPLORE
   ↓
SELECT OBSERVATION
   ↓
EVIDENCE
   ↓
MODEL MATCH
   ↓
PROFILE COMPARISON
   ↓
RESIDUAL ANALYSIS
   ↓
DERIVED FEATURES
   ↓
CURRENT ANALYSIS
   ↓
RESPONSE
   ↓
DRIFT SCENARIO
   ↓
SCENARIO REPLAY
   ↓
SCIENTIFIC SNAPSHOT
```

---

# 3. Interaction Philosophy

NIRIKSHAN should behave like an analytical instrument.

The user should manipulate scientific state rather than navigate through a sequence of unrelated pages.

For example:

```text
Change depth
```

should not simply move a slider.

It should change the scientific state and update:

- model field,
- current vectors,
- profile cursor,
- water-column lens,
- selected value,
- derived context where relevant.

---

# 4. Global Scientific State

The application must maintain one authoritative scientific state.

Recommended:

```ts
interface ScientificState {
  mode: "explore" | "evidence" | "response";

  datasetId: string | null;

  time: string | null;

  depth: number | null;

  variable: string | null;

  latitude: number | null;

  longitude: number | null;

  selectedObservationId: string | null;

  evidenceCaseId: string | null;

  selectedFeatureId: string | null;

  scenarioTime: number | null;
}
```

Components should read from this state.

They should not create independent scientific copies.

---

# 5. State Ownership

One value must have one owner.

For example:

```text
DEPTH
↓
Scientific State
```

Not:

```text
DepthSlider → depth
Globe → depth
ProfileChart → depth
WaterColumn → depth
```

The UI components communicate changes to the global state.

---

# 6. Mode State

The application has three major modes:

```text
EXPLORE
EVIDENCE
RESPONSE
```

Mode transitions:

```text
EXPLORE
   ↓
EVIDENCE
   ↓
RESPONSE
```

The user may return:

```text
RESPONSE
   ↓
EVIDENCE
   ↓
EXPLORE
```

State should be preserved.

---

# 7. Initial Application State

When NIRIKSHAN opens:

```text
mode = explore

dataset = available default dataset

time = dataset initial/appropriate time

depth = surface or configured default

variable = temperature

selectedObservation = null

evidence = null

scenario = null
```

The exact default time should come from the dataset rather than being hard-coded.

---

# 8. Initial User Experience

The first screen should immediately show:

```text
3D globe
+
real model field
+
observation markers
+
time control
+
depth control
```

Do not show:

- splash screen,
- marketing landing page,
- onboarding carousel,
- generic welcome modal.

The user should be able to interact immediately.

---

# 9. Workflow 01 — Explore

## Goal

Allow the user to understand the current ocean state.

---

# 10. Explore Screen

Primary elements:

```text
┌───────────────────────────────────────────┐
│ TOP BAR                                   │
├───────────────────────────────────────────┤
│                                           │
│               3D OCEAN                    │
│                                           │
│       model field + observations          │
│                                           │
├───────────────────────────────────────────┤
│ TIME              DEPTH          VARIABLE │
└───────────────────────────────────────────┘
```

---

# 11. Explore Actions

The user can:

1. rotate globe,
2. zoom,
3. change depth,
4. change time,
5. change variable,
6. toggle current,
7. toggle observations,
8. select observation.

These actions should not destroy existing context.

---

# 12. Globe Rotation

Globe rotation is purely navigational.

It should not modify:

- time,
- depth,
- variable,
- observation selection.

---

# 13. Globe Zoom

Zoom changes geographic scale.

It should optionally trigger:

```text
LOD update
```

but should not change scientific state.

---

# 14. Depth Change

When depth changes:

```text
User moves depth control
        ↓
setDepth()
        ↓
scientific state changes
        ↓
model field request
        ↓
current field request
        ↓
globe updates
        ↓
water column updates
        ↓
profile cursor updates
```

---

# 15. Depth Request Optimization

Do not request a new field for every tiny slider movement if that causes excessive network requests.

Use:

- throttling,
- debouncing,
- request cancellation,
- model-level snapping where appropriate.

However, the displayed depth should remain responsive.

---

# 16. Model Depth Snapping

If the model only contains discrete depth levels:

```text
Requested depth
      ↓
nearest model depth
```

The UI should show both when useful:

```text
REQUESTED
150 m

MODEL LEVEL
149.8 m
```

Do not silently imply that the model contains an exact 150m level if it does not.

---

# 17. Time Change

When time changes:

```text
User moves timeline
        ↓
setTime()
        ↓
model field reload
        ↓
current field reload
        ↓
observation context updates
```

Selected observation should not automatically disappear unless it becomes scientifically invalid for the new state.

---

# 18. Time Playback

When playback starts:

```text
PLAY
 ↓
advance dataset time
 ↓
request/update field
 ↓
render
 ↓
advance
```

Playback should use available dataset timestamps.

Do not fabricate intermediate model states.

---

# 19. Playback Performance

During playback:

- reuse cached fields,
- preload nearby states where practical,
- cancel obsolete requests,
- avoid blocking the main thread.

If a frame cannot load in time:

```text
keep previous frame
```

rather than displaying incorrect data.

---

# 20. Variable Change

Changing variable should update the model field.

Example:

```text
Temperature
    ↓
Current
```

For current:

```text
uo + vo
↓
vector field
```

The user should not need to manually select `uo` and `vo` to understand current.

---

# 21. Layer Changes

Layer visibility is presentation state.

Example:

```text
Temperature
Current vectors
Observations
```

Changing visibility should not alter scientific data.

---

# 22. Observation Selection

When the user clicks an observation:

```text
marker click
 ↓
selectedObservationId
 ↓
mode remains Explore initially
 ↓
evidence request
 ↓
Evidence becomes available
```

Recommended UX:

The evidence workspace opens as an analytical side panel rather than forcing a full page transition.

---

# 23. Selected Observation State

Selected observation should have a clear visual distinction.

It should remain identifiable on the globe even when:

- evidence panel opens,
- depth changes,
- time changes,
- profile is inspected.

---

# 24. Observation Selection Priority

When an observation is selected:

Priority becomes:

```text
selected observation
>
nearby observations
>
general model field
```

The selected observation should remain visually dominant.

---

# 25. Workflow 02 — Evidence

Evidence begins when a user selects an observation.

Flow:

```text
OBSERVATION
 ↓
LOAD EVIDENCE
 ↓
MODEL MATCH
 ↓
PROFILE
 ↓
RESIDUAL
 ↓
FEATURES
 ↓
PROVENANCE
```

---

# 26. Evidence Loading

Show a progressive status:

```text
OBSERVATION SELECTED

Matching model state…
```

Then:

```text
Loading profile…
```

Then:

```text
Calculating comparison…
```

Then:

```text
Evidence ready
```

Do not use one generic spinner for all stages.

---

# 27. Evidence Failure

If observation exists but model comparison fails:

```text
OBSERVATION AVAILABLE

Model comparison unavailable.

The observation remains available for inspection.
```

Do not erase the observation.

---

# 28. Evidence Panel Open

The panel should expose:

```text
Observation
Model Match
Profile
Residual
Derived Features
Coverage
Provenance
```

The globe remains visible.

---

# 29. Model Match Interaction

The user should be able to inspect:

```text
Observation time
Model time
Observation coordinates
Model coordinates
Temporal offset
Spatial offset
Matching method
```

Example:

```text
OBSERVATION
05 JAN · 06:42

MODEL
05 JAN · 00:00

TIME OFFSET
6 h

SPATIAL OFFSET
3.2 km
```

---

# 30. Profile Comparison

The profile chart displays:

```text
Observation
Model
```

and optionally:

```text
Residual
```

The user can hover or move the analytical cursor.

---

# 31. Profile Hover

Hovering a profile level should show:

```text
Depth
Observation
Model
Residual
```

Example:

```text
DEPTH
150 m

OBS
27.41 °C

MODEL
26.99 °C

RESIDUAL
+0.42 °C
```

---

# 32. Profile Click

Clicking a depth:

```text
profile click
 ↓
setDepth()
 ↓
globe updates
 ↓
water column updates
 ↓
current updates
```

This is a critical cross-view interaction.

---

# 33. Profile Drag

Dragging through a profile should continuously move the analytical cursor.

The cursor becomes the shared scientific pointer.

---

# 34. Analytical Cursor

The analytical cursor represents:

```text
Current scientific depth
```

It must remain synchronized across:

- profile,
- water column,
- globe,
- current readout.

---

# 35. Analytical Cursor Example

```text
DEPTH
150 m
```

At that point:

```text
Temperature
27.41 °C

Current
0.42 m/s

Residual
+0.42 °C
```

All values refer to the same scientific state.

---

# 36. Residual Inspection

The user can enable:

```text
RESIDUAL
```

The system displays:

```text
Observation − Model
```

with a zero reference.

---

# 37. Residual Interaction

Clicking a residual point:

```text
residual point
 ↓
setDepth()
 ↓
profile cursor
 ↓
water-column cursor
 ↓
globe depth
```

---

# 38. Residual Statistics

The user should see:

```text
BIAS
MAE
RMSE
CORRELATION
VALID SAMPLES
```

These statistics should be contextual to:

```text
selected observation
selected variable
selected comparison
```

---

# 39. Insufficient Samples

If there are too few valid paired values:

```text
RMSE
Unavailable

Reason:
Insufficient valid paired samples.
```

Do not show:

```text
RMSE = 0
```

---

# 40. Workflow 03 — Derived Features

Derived features appear after comparison.

Examples:

```text
Thermocline
Mixed Layer Depth
Temperature Gradient
Current Speed
Current Direction
Current Shear
```

---

# 41. Feature Selection

Clicking a feature should focus the relevant depth.

Example:

```text
THERMOCLINE
82 m
```

Click:

```text
82m
 ↓
setDepth(82)
 ↓
all analytical views move to 82m
```

---

# 42. Feature Evidence

When a feature is selected, show:

```text
FEATURE
Thermocline

DEPTH
82 m

VALUE
0.081 °C/m

METHOD
Maximum temperature gradient
```

The method must be visible.

---

# 43. Feature Unavailable

If a feature cannot be calculated:

```text
THERMOCLINE

Not identified.

The available profile does not satisfy
the configured detection criterion.
```

Do not invent a result.

---

# 44. Workflow 04 — Water-Column Lens

The Water-Column Lens is synchronized with the selected observation.

It should communicate:

```text
surface
↓
profile structure
↓
derived features
↓
current
↓
selected depth
```

---

# 45. Water-Column Interaction

User can:

- hover a depth,
- click a depth,
- drag cursor,
- select a derived feature.

Every action updates global depth.

---

# 46. Water-Column → Globe

If user selects:

```text
150m
```

from the Water-Column Lens:

```text
setDepth(150)
 ↓
globe field → 150m
 ↓
current → 150m
 ↓
profile cursor → 150m
```

---

# 47. Globe → Water Column

If user changes depth through the global depth control:

```text
depth control
 ↓
global depth
 ↓
Water-Column Lens
```

The lens follows the same state.

---

# 48. Workflow 05 — Current Analysis

Current is not an independent decorative layer.

It represents the model state at:

```text
location
+
time
+
depth
```

---

# 49. Current Readout

Example:

```text
CURRENT

Speed
0.42 m/s

Direction
137°

Depth
150 m
```

---

# 50. Current Vector Selection

If the user selects a current vector on the globe:

```text
vector selected
 ↓
location changes
```

The selected geographic location should update.

However, the selected observation should not be replaced automatically unless the vector corresponds to an observation.

---

# 51. Current and Evidence

Inside Evidence:

```text
Selected observation
+
matched model current
```

The user can inspect the current at the analytical depth.

---

# 52. Workflow 06 — Response

Response mode begins only after a usable scientific current field is available.

Entry:

```text
INSPECT CURRENT
        ↓
SIMULATE DRIFT
```

---

# 53. Response Initialization

When launching a scenario, inherit:

```text
latitude
longitude
time
depth
dataset
current field
```

Do not ask the user to re-enter information already known.

---

# 54. Scenario Initialization Confirmation

Show:

```text
SCENARIO

START
12.438°N
87.312°E

TIME
05 JAN 2024 · 06:42 UTC

DEPTH
150 m

FIELD
GLORYS12V1

METHOD
Euler
```

Then:

```text
RUN DRIFT →
```

---

# 55. Scenario Run

Flow:

```text
RUN
 ↓
validate inputs
 ↓
retrieve current field
 ↓
integrate trajectory
 ↓
return trajectory
 ↓
render
```

---

# 56. Scenario Loading

Display:

```text
INITIALIZING DRIFT
```

Then:

```text
INTEGRATING CURRENT FIELD
```

Then:

```text
SCENARIO READY
```

---

# 57. Scenario Visualization

The globe displays:

```text
starting point
+
trajectory
+
current field
+
scenario time
```

The trajectory must remain tied to the underlying model state.

---

# 58. Scenario Timeline

Timeline:

```text
0h ─── 12h ─── 24h ─── 48h ─── 72h
●
```

Moving the timeline updates:

```text
trajectory position
scenario time
current context
```

---

# 59. Scenario Replay

Replay should reconstruct the trajectory progressively.

Example:

```text
0h
●

12h
●──────●

24h
●──────●────●

48h
●──────●────●────────●

72h
●──────●────●────────●────────●
```

Do not simply animate the complete line if replay is intended to communicate movement.

---

# 60. Scenario Scrubbing

Dragging scenario time:

```text
48h
```

should immediately show:

- particle position,
- elapsed time,
- trajectory up to that point.

---

# 61. Scenario → Evidence

The user must be able to return to Evidence.

Returning should preserve:

```text
selected observation
selected depth
selected time
evidence case
```

---

# 62. Evidence → Explore

Returning to Explore should preserve:

```text
globe camera
time
depth
variable
selected observation
```

where technically practical.

---

# 63. Browser Back/Forward

Browser navigation should not unexpectedly destroy scientific state.

If routing is implemented:

```text
/explore
/evidence/{id}
/response/{scenarioId}
```

then navigation should restore the corresponding state.

---

# 64. Deep-Linking

Future/optional:

```text
/evidence/argo-2901234-20240105
```

should open the relevant evidence case.

This is useful for:

- demos,
- sharing,
- reproducibility,
- debugging.

---

# 65. Scientific Snapshot

At any meaningful point, the user can create a snapshot.

Snapshot captures:

```text
mode
dataset
time
depth
variable
location
observation
model match
derived features
scenario
```

---

# 66. Snapshot Trigger

Recommended action:

```text
SAVE SNAPSHOT
```

Do not call it:

```text
AI INSIGHT
```

The snapshot is a scientific state record.

---

# 67. Snapshot Preview

Before saving:

```text
SCIENTIFIC SNAPSHOT

Observation
ARGO 2901234

Location
12.438°N · 87.312°E

Time
05 JAN 2024 · 06:42 UTC

Depth
150 m

Model
GLORYS12V1

Residual
+0.42 °C

Current
0.42 m/s · 137°
```

---

# 68. Snapshot Reproducibility

A snapshot should contain enough state to reproduce the analysis.

At minimum:

```text
dataset ID
observation ID
time
depth
variable
method metadata
```

---

# 69. Workflow 07 — Provenance

The user should be able to inspect provenance from Evidence or Snapshot.

Example:

```text
PROVENANCE

OBSERVATION
Argo

MODEL
GLORYS12V1

VARIABLES
thetao
uo
vo

MATCH
Nearest time / latitude / longitude

RESIDUAL
Observation − Model
```

---

# 70. Provenance Interaction

Click:

```text
VIEW PROVENANCE
```

opens a technical drawer.

Do not navigate away from the analysis.

---

# 71. Data Health Interaction

The user may open:

```text
DATA STATUS
```

to inspect:

```text
Model
READY

Observations
READY

Dataset period
...

Region
...

Variables
...
```

---

# 72. Workflow 08 — Time + Observation Interaction

Potential ambiguity:

User selects an observation and then changes global time.

The system must not silently create a false relationship.

Recommended behavior:

```text
Observation remains selected
BUT
evidence comparison remains tied to observation time
```

The globe can continue showing the globally selected model time.

The UI should distinguish:

```text
GLOBAL MODEL TIME
```

from:

```text
OBSERVATION TIME
```

when they differ.

---

# 73. Evidence Time Lock

When Evidence is active, the evidence profile comparison should remain tied to the observation's timestamp.

Example:

```text
EVIDENCE TIME
05 JAN · 06:42

GLOBAL VIEW TIME
05 JAN · 12:00
```

If this distinction creates too much complexity in the MVP, the evidence workflow may temporarily lock global time while evidence is active.

If locked:

```text
TIME
LOCKED TO OBSERVATION
```

must be visible.

---

# 74. Evidence Depth vs Global Depth

Evidence analysis uses a shared depth cursor.

Therefore:

```text
Evidence depth
=
Global analytical depth
```

Do not create two independent depth systems.

---

# 75. Observation Deselection

If the user clicks empty globe space:

Possible behavior:

```text
deselect observation
```

but preserve:

- time,
- depth,
- variable.

The evidence panel closes or becomes inactive.

---

# 76. Escape Behavior

Pressing `Esc` should close temporary overlays.

It should not automatically reset:

- time,
- depth,
- dataset,
- scientific state.

---

# 77. Reset View

Provide a deliberate:

```text
RESET VIEW
```

This should reset presentation state:

- camera,
- layer visibility,
- zoom.

It should not necessarily reset scientific state.

---

# 78. Reset Analysis

A separate action may reset:

```text
RESET ANALYSIS
```

This may clear:

- selected observation,
- evidence,
- selected feature,
- scenario.

The action should require deliberate user interaction.

---

# 79. Unsaved Scenario State

If the user has a scenario and tries to reset:

```text
SCENARIO ACTIVE

Reset and clear scenario?
```

Avoid accidental loss of analysis.

---

# 80. Interaction Priority During Demo

The judge-facing flow should require minimal clicking.

Recommended:

```text
OPEN
 ↓
SEE REAL OCEAN
 ↓
CHANGE DEPTH
 ↓
SELECT ARGO
 ↓
EVIDENCE OPENS
 ↓
COMPARE
 ↓
CLICK THERMOCLINE
 ↓
INSPECT CURRENT
 ↓
SIMULATE DRIFT
 ↓
REPLAY
 ↓
PROVENANCE
```

---

# 81. 60-Second Demo Workflow

A concise demo can use:

```text
0–10s
Show real 3D model field.

10–20s
Change depth/time.

20–30s
Select an Argo observation.

30–40s
Show observation vs model profile
and residual.

40–48s
Select thermocline/current.

48–56s
Launch drift scenario.

56–60s
Replay trajectory and show provenance.
```

The actual timing can be adjusted during presentation.

---

# 82. Scientific Causality

Every transition should preserve causality.

Example:

```text
OBSERVATION
     ↓
MODEL COMPARISON
     ↓
DERIVED FEATURE
     ↓
CURRENT
     ↓
SCENARIO
```

Avoid:

```text
OBSERVATION
     ↓
random dashboard
     ↓
unrelated simulation
```

---

# 83. Interaction Feedback

Every important action should have immediate feedback.

Examples:

### Selecting observation

```text
marker highlighted
evidence loading
```

### Changing depth

```text
depth readout changes
field updates
```

### Selecting feature

```text
cursor moves
```

### Starting scenario

```text
scenario status changes
```

---

# 84. No Hidden State

The user should be able to determine:

```text
What time am I viewing?
What depth am I viewing?
What variable am I viewing?
Which observation is selected?
Which model is active?
```

These should never be hidden only in application state.

---

# 85. Interaction with Missing Data

If changing depth leads to missing data:

Do not freeze the application.

Show:

```text
NO DATA AT SELECTED DEPTH

Nearest available model level:
149.8 m
```

if such a value exists.

---

# 86. Interaction with Out-of-Range Time

If user moves outside available model time:

The timeline should prevent invalid values where possible.

If a programmatic request is invalid:

```text
TIME OUT OF RANGE

Available:
01 JAN – 10 JAN 2024
```

---

# 87. Interaction with Out-of-Range Depth

If the requested depth is outside the model:

```text
DEPTH OUT OF RANGE
```

Do not silently clamp unless the control is explicitly snapping to valid model levels.

---

# 88. Interaction with API Failure

If a field request fails:

```text
MODEL FIELD UNAVAILABLE
```

Preserve the previous valid field if possible.

Do not replace it with blank or fake data immediately.

---

# 89. Stale Request Protection

Scenario:

```text
User changes depth:
100m
 ↓
request A

User immediately changes:
150m
 ↓
request B
```

If request A finishes after B:

```text
ignore A
```

The UI must remain at 150m.

---

# 90. Request Cancellation

Where supported:

```text
AbortController
```

or equivalent should cancel obsolete requests.

This is especially important for:

- time playback,
- depth scrubbing,
- profile interaction.

---

# 91. Hover vs Selection

Hover:

```text
temporary information
```

Selection:

```text
persistent analytical state
```

Do not make hover trigger expensive scientific requests.

Only selection should normally initiate Evidence loading.

---

# 92. Double-Click

Double-click should not be required for any core scientific workflow.

Single click should be sufficient.

---

# 93. Touch Interaction

Where supported:

- pinch → zoom,
- drag → globe navigation,
- slider → depth/time,
- tap → select.

Do not rely on hover for essential information on touch devices.

---

# 94. Keyboard Accessibility

Core controls should support:

```text
Tab
focus navigation

Enter
activate

Arrow keys
adjust sliders

Space
play/pause
```

---

# 95. Focus Visibility

Focused controls must have a visible focus state.

Do not rely only on subtle color changes.

---

# 96. Mode Transition Animation

When changing:

```text
EXPLORE → EVIDENCE
```

the evidence panel can slide/fade into place.

The globe should remain spatially stable.

Avoid full-screen transitions.

---

# 97. Preserve Camera Context

Opening Evidence should not unnecessarily reset the globe camera.

The selected observation should remain in view.

---

# 98. Camera Focus

Selecting an observation may gently focus the camera on the observation.

Recommended behavior:

```text
select marker
 ↓
camera transitions toward marker
```

The movement should be:

- short,
- smooth,
- interruptible.

Do not perform a dramatic cinematic camera animation.

---

# 99. Camera Reset

The user must retain control.

Provide:

```text
RESET CAMERA
```

or an equivalent control.

---

# 100. Analytical vs Navigational Camera

Camera movement does not necessarily change scientific state.

The user can rotate the globe freely without changing:

- time,
- depth,
- variable.

This distinction must remain clear.

---

# 101. Response Replay Causality

During replay, the current field should remain visible where possible.

This helps communicate:

```text
current field
      ↓
particle movement
```

The scenario should not look like a disconnected animated line.

---

# 102. Scenario Pause

The user can:

```text
PLAY
PAUSE
STEP
```

Step should advance by the scenario timestep.

---

# 103. Scenario Step

Example:

```text
CURRENT
24h

STEP →
25h
```

The trajectory should update deterministically.

---

# 104. Scenario Restart

Provide:

```text
RESTART
```

which returns to:

```text
0h
```

without deleting the scenario.

---

# 105. Scenario End

At the final timestep:

```text
72h
```

show:

```text
SCENARIO COMPLETE
```

Do not automatically loop unless the user requests it.

---

# 106. Scenario Limitations

Limitations should remain accessible during Response.

Example:

```text
PASSIVE PARTICLE DRIFT

Current-driven simulation.

Excludes:
windage
waves
Stokes drift
leeway
object-specific behavior
```

---

# 107. Snapshot Workflow

Recommended:

```text
Analyze
 ↓
SAVE SNAPSHOT
 ↓
Snapshot preview
 ↓
Confirm
 ↓
Saved
```

The snapshot should not require leaving the current workspace.

---

# 108. Snapshot Naming

Suggested default:

```text
ARGO 2901234 — 05 JAN 2024 — 150m
```

The user may rename it.

Avoid meaningless names such as:

```text
Snapshot 1
```

unless no better metadata is available.

---

# 109. Snapshot Contents

Include:

```text
Dataset
Observation
Location
Time
Depth
Variable
Model match
Residual statistics
Derived features
Current
Scenario
Provenance
```

Only include fields actually available.

---

# 110. Reopening Snapshot

Future implementation should allow:

```text
Snapshot
 ↓
restore state
 ↓
reopen analysis
```

The snapshot should be treated as a reproducible state rather than merely an image.

---

# 111. Undo/Redo

Do not implement generic undo/redo for the entire application unless necessary.

Scientific navigation is better represented through explicit state controls.

Potential future history:

```text
scientific state history
```

but this is not required for MVP.

---

# 112. Interaction History

Future capability:

```text
Observation A
 ↓
Depth 50m
 ↓
Depth 100m
 ↓
Thermocline
 ↓
Scenario
```

This could support reproducibility.

Not required for initial implementation.

---

# 113. Performance Rules

Interactions must not unnecessarily trigger expensive operations.

Examples:

Changing camera:

```text
NO API REQUEST
```

Changing depth:

```text
MODEL FIELD REQUEST
```

Changing observation:

```text
EVIDENCE REQUEST
```

Opening provenance:

```text
NO SCIENTIFIC RECALCULATION
```

---

# 114. Interaction Request Matrix

| User Action | Scientific State Change | API Request | Visual Update |
|---|---|---|---|
| Rotate globe | No | No | Camera |
| Zoom globe | No | Maybe LOD | Camera |
| Change depth | Yes | Yes | Field + profile |
| Change time | Yes | Yes | Field + current |
| Change variable | Yes | Yes | Field |
| Toggle layer | No | No | Visibility |
| Hover observation | No | No | Tooltip |
| Select observation | Yes | Evidence | Evidence + marker |
| Hover profile | No | No | Tooltip |
| Click profile depth | Yes | Maybe | All linked views |
| Select feature | Yes | Usually no | Cursor + views |
| Launch SAR | Yes | Yes | Response |
| Scrub scenario | Scenario state | No | Trajectory |
| Save snapshot | Persistent state | Optional | Snapshot UI |
| Open provenance | No | Optional | Drawer |

---

# 115. State Transition Table

| Current State | Action | Next State |
|---|---|---|
| Explore | Select observation | Evidence |
| Explore | Toggle layer | Explore |
| Explore | Change depth | Explore |
| Explore | Change time | Explore |
| Evidence | Change depth | Evidence |
| Evidence | Select feature | Evidence |
| Evidence | Launch scenario | Response |
| Evidence | Deselect | Explore |
| Response | Scrub timeline | Response |
| Response | Replay | Response |
| Response | Return | Evidence |

---

# 116. Invalid Transition Handling

If the user attempts:

```text
Launch scenario
```

without current data:

Show:

```text
SCENARIO UNAVAILABLE

A valid current field is required.
```

Do not navigate into a broken Response screen.

---

# 117. Scientific Integrity Rules for Interaction

The UI must never:

1. invent missing values,
2. silently interpolate,
3. silently change units,
4. silently change residual sign,
5. claim model certainty,
6. present demo data as real,
7. connect unrelated observations to scenarios,
8. use a different current field for SAR.

---

# 118. Interaction Quality Rules

Every core interaction should satisfy:

```text
FAST
CLEAR
REVERSIBLE
TRACEABLE
SCIENTIFICALLY CONSISTENT
```

---

# 119. AI Coding Agent Rules

When implementing interactions:

1. Inspect existing state architecture first.
2. Do not create duplicate state.
3. Preserve working endpoints.
4. Use the centralized API client.
5. Use request cancellation for rapidly changing requests.
6. Prevent stale responses from overwriting current state.
7. Do not add arbitrary animation.
8. Do not introduce fake loading data.
9. Preserve globe camera context.
10. Preserve scientific context between modes.
11. Test every state transition.
12. Test failure states.
13. Run the production build.
14. Verify the actual browser interaction.
15. Never remove scientific provenance to simplify UI.

---

# 120. Acceptance Criteria

## Explore

- [ ] Globe loads.
- [ ] Real model field loads.
- [ ] Observations appear.
- [ ] Depth changes update the field.
- [ ] Time changes update the field.
- [ ] Variable changes work.
- [ ] Layer toggles work.

## Evidence

- [ ] Observation selection works.
- [ ] Evidence panel opens.
- [ ] Model matching is visible.
- [ ] Profile comparison works.
- [ ] Residual works.
- [ ] Analytical cursor synchronizes.
- [ ] Derived features can be inspected.
- [ ] Provenance is accessible.

## Response

- [ ] Scenario inherits evidence state.
- [ ] Current field is real.
- [ ] Drift calculation works.
- [ ] Trajectory renders.
- [ ] Replay works.
- [ ] Timeline scrubbing works.
- [ ] Limitations are visible.

## Navigation

- [ ] Explore → Evidence works.
- [ ] Evidence → Response works.
- [ ] Response → Evidence works.
- [ ] Evidence → Explore works.
- [ ] Scientific state is preserved appropriately.

---

# 121. Judge Demo Acceptance

A judge should be able to observe the complete product story without explanation of internal implementation.

Within a short interaction sequence:

```text
REAL OCEAN DATA
      ↓
3D FIELD
      ↓
OBSERVATION
      ↓
MODEL COMPARISON
      ↓
RESIDUAL
      ↓
SCIENTIFIC FEATURE
      ↓
CURRENT
      ↓
DRIFT SCENARIO
      ↓
PROVENANCE
```

The interface itself should make this sequence understandable.

---

# 122. Final Interaction Principle

NIRIKSHAN is not a collection of screens.

It is a continuous analytical workflow.

The user should always understand:

```text
WHERE
WHEN
AT WHAT DEPTH
WHAT DATA
WHAT OBSERVATION
WHAT MODEL
WHAT DIFFERENCE
WHAT FEATURE
WHAT RESPONSE
```

The ideal interaction is:

```text
SEE
 ↓
SELECT
 ↓
VERIFY
 ↓
COMPARE
 ↓
UNDERSTAND
 ↓
RESPOND
 ↓
REPLAY
 ↓
DOCUMENT
```

Every new feature added to NIRIKSHAN must strengthen this loop.

If a feature does not improve:

- scientific understanding,
- analytical workflow,
- response capability,
- or traceability,

it should not be added merely to increase feature count.
```

