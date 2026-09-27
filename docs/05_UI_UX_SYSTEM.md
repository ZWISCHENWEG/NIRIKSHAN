Absolutely. The next file should be the **UI/UX system**, because now we have the product requirements, architecture, scientific engine, and evidence workflow defined.

# `05_UI_UX_SYSTEM.md`

```md
# NIRIKSHAN — UI/UX System

## Document Status

- Product: NIRIKSHAN
- Document: UI/UX System
- Version: 1.0
- Status: Implementation Specification
- Audience: AI coding agents, frontend developers, UI/UX designers
- Depends on:
  - `01_PRD.md`
  - `02_ARCHITECTURE.md`
  - `03_SCIENTIFIC_ENGINE.md`
  - `04_OBSERVATION_EVIDENCE.md`

---

# 1. Purpose

This document defines the visual language, interaction model, layout system, component behavior, typography, color semantics, motion principles, responsive behavior, and interface quality standards for NIRIKSHAN.

The objective is not simply to make the application attractive.

The objective is to make a complex scientific system:

- understandable,
- trustworthy,
- efficient,
- visually calm,
- operationally credible,
- scientifically legible,
- and memorable during a short demonstration.

NIRIKSHAN must look like a serious scientific analysis instrument rather than:

- a generic SaaS dashboard,
- an AI-generated interface,
- a gaming HUD,
- a cyberpunk application,
- a crypto dashboard,
- or a decorative 3D visualization.

---

# 2. Design Philosophy

## 2.1 Scientific Instrument, Not Dashboard

The interface should feel closer to:

- an advanced scientific workstation,
- an oceanographic analysis console,
- a professional geospatial tool,
- a mission-analysis environment,

than a collection of dashboard cards.

The primary visual object is the ocean.

The interface should frame the data rather than compete with it.

---

# 3. Core Visual Principles

NIRIKSHAN follows seven principles.

## 3.1 Evidence Over Decoration

Every visible element should have a functional purpose.

Avoid decorative UI that does not communicate:

- data,
- state,
- navigation,
- analysis,
- or interaction.

---

## 3.2 Hierarchy Over Density

The interface can contain substantial information.

However, information must have hierarchy.

The user should immediately understand:

```text
WHERE AM I?
WHAT AM I LOOKING AT?
WHAT IS SELECTED?
WHAT CAN I DO NEXT?
```

---

## 3.3 Flat Over Glossy

Use:

- flat surfaces,
- subtle borders,
- restrained shadows,
- precise spacing.

Avoid:

- glassmorphism,
- glowing cards,
- excessive blur,
- glossy surfaces,
- neon gradients.

---

## 3.4 Data Creates Visual Interest

The interface should become visually impressive because:

- the globe moves,
- the field changes,
- vectors respond,
- observations appear,
- profiles synchronize,
- residuals reveal structure,
- scenarios evolve.

Do not create visual excitement through decorative effects.

---

## 3.5 Calm Color

The palette should feel:

- oceanographic,
- institutional,
- technical,
- premium.

The interface should not resemble an AI startup landing page.

---

## 3.6 Typography Is Structural

Typography must communicate hierarchy.

Do not use oversized marketing typography inside the scientific workspace.

---

## 3.7 Motion Must Explain

Animation should communicate:

- change,
- transition,
- selection,
- loading,
- causality.

Never animate merely because animation is possible.

---

# 4. Visual Personality

NIRIKSHAN should communicate:

```text
PRECISE
CALM
SCIENTIFIC
OPERATIONAL
PREMIUM
SERIOUS
EXPLORATORY
```

It should not communicate:

```text
FLASHY
GAMING
CYBERPUNK
CRYPTO
GENERIC AI
CONSUMER SaaS
```

---

# 5. Application Shell

The application should use a persistent workspace.

Recommended structure:

```text
┌──────────────────────────────────────────────────────────────┐
│ TOP BAR                                                       │
├───────────────┬──────────────────────────────────────────────┤
│               │                                              │
│ LEFT          │                                              │
│ NAVIGATION    │              3D OCEAN VIEW                  │
│               │                                              │
│               │                                              │
│               │                                              │
├───────────────┴──────────────────────────────────────────────┤
│ CONTEXT / TIME / DEPTH / ANALYTICAL CONTROLS                 │
└──────────────────────────────────────────────────────────────┘
```

When evidence is active:

```text
┌───────────────┬─────────────────────────────┬────────────────┐
│               │                             │                │
│ NAVIGATION    │          GLOBE              │   EVIDENCE     │
│               │                             │   WORKSPACE    │
│               │                             │                │
└───────────────┴─────────────────────────────┴────────────────┘
```

The globe remains the spatial anchor.

The evidence workspace becomes the analytical anchor.

---

# 6. Primary Navigation

Navigation should remain minimal.

Recommended primary modes:

```text
EXPLORE
EVIDENCE
RESPONSE
```

Optional secondary controls:

```text
DATA
LAYERS
TIME
DEPTH
SETTINGS
```

Do not create ten or fifteen primary navigation destinations.

---

# 7. Mode Semantics

## EXPLORE

Purpose:

Understand the ocean state.

Primary actions:

- change time,
- change depth,
- select variable,
- toggle layers,
- inspect observations,
- inspect current vectors.

---

## EVIDENCE

Purpose:

Understand a specific observation/model relationship.

Primary actions:

- compare profiles,
- inspect residuals,
- inspect derived features,
- inspect provenance,
- synchronize analytical cursor.

---

## RESPONSE

Purpose:

Explore a scenario using the scientific state.

Primary actions:

- configure scenario,
- run drift,
- inspect trajectory,
- inspect current field,
- replay.

---

# 8. Top Bar

The top bar should be restrained.

Suggested contents:

```text
NIRIKSHAN

EXPLORE   EVIDENCE   RESPONSE

DATASET
GLORYS12V1

TIME
15 JAN 2024

STATUS
READY
```

Optional:

```text
Scientific Snapshot
Settings
```

Do not fill the top bar with unnecessary icons.

---

# 9. Branding

NIRIKSHAN branding should be understated.

The product name should feel like the name of a scientific system.

Avoid:

- huge logos,
- gradients,
- animated logos,
- futuristic typography,
- excessive branding.

Suggested treatment:

```text
NIRIKSHAN
3D OCEAN ANALYSIS & RESPONSE
```

---

# 10. Typography

Primary UI font:

```text
Inter
```

Fallback:

```text
system-ui
-apple-system
BlinkMacSystemFont
Segoe UI
sans-serif
```

Monospace:

```text
IBM Plex Mono
```

Use monospace for:

- coordinates,
- timestamps,
- dataset IDs,
- numerical values,
- technical metadata,
- model variables.

Example:

```text
12.438° N
87.312° E

2024-01-15 06:42 UTC
```

---

# 11. Typography Scale

Recommended:

```text
Display
28–36px

Section
16–20px

Panel title
13–15px

Body
12–14px

Metadata
10–12px

Technical values
11–14px monospace
```

Do not make every label large.

Scientific interfaces benefit from compact hierarchy.

---

# 12. Font Weight

Use restrained weight differences.

Recommended:

```text
Regular
400

Medium
500

Semibold
600
```

Avoid excessive use of 700/800/900.

---

# 13. Color System

The palette should be based on:

- graphite,
- off-white,
- muted gray,
- restrained teal,
- warning/rust,
- scientific diverging scales.

Example foundation:

```css
--bg: #101214;
--surface: #17191B;
--surface-2: #1D2023;

--border: #303438;
--border-soft: #25282B;

--text: #E8E7E2;
--text-secondary: #A7AAA8;
--text-muted: #707572;

--accent: #6F9C98;
--accent-strong: #86B1AC;

--warning: #B66B4D;
--danger: #A94B42;
```

These values are starting points.

Do not blindly copy them if the existing implementation already has a coherent palette.

---

# 14. Color Usage Rules

Accent colors should indicate:

- selection,
- active state,
- interaction,
- scientific focus.

They should not be used to color every element.

The interface should remain mostly neutral.

---

# 15. Scientific Color Scales

Scientific data fields require separate scales.

Examples:

```text
Temperature
Sequential/diverging scientific scale

Residual
Diverging scale centered at zero

Current speed
Sequential scale

Observation density
Sequential scale
```

Color scales must be:

- interpretable,
- continuous where appropriate,
- labeled,
- consistent.

---

# 16. Zero-Centered Residual Scale

Residual visualizations must use a zero-centered scale.

Conceptually:

```text
negative
←───────── 0 ─────────→
               positive
```

The zero point must remain visually identifiable.

Never use a sequential color scale for signed residuals.

---

# 17. Surface System

Use three primary surface levels.

```text
LEVEL 0
Application background

LEVEL 1
Workspace panels

LEVEL 2
Active/raised controls
```

Avoid excessive nested containers.

Bad:

```text
Panel
 └── Card
     └── Card
         └── Card
```

Preferred:

```text
Workspace
 ├── Section
 ├── Section
 └── Section
```

---

# 18. Borders

Borders should be subtle.

Use borders to establish:

- panel boundaries,
- selected state,
- control separation.

Do not use bright borders around everything.

---

# 19. Border Radius

Use restrained corner radii.

Recommended:

```text
Small controls
4–6px

Panels
6–8px

Large containers
8–10px
```

Avoid:

```text
24px
32px
pill-everything
```

The application should feel technical rather than playful.

---

# 20. Shadows

Use minimal shadows.

Prefer:

```text
border
+
surface contrast
```

instead of:

```text
large blur shadow
```

The 3D globe should provide most of the visual depth.

---

# 21. Globe as Primary Canvas

The globe is the visual center of the application.

It should occupy the majority of available workspace.

Do not cover the globe with panels unless necessary.

The globe should remain visible while:

- changing depth,
- changing time,
- selecting observations,
- opening evidence,
- running scenarios.

---

# 22. Globe Composition

The globe should communicate:

```text
GEOGRAPHY
+
MODEL FIELD
+
OBSERVATIONS
+
CURRENT
```

The base map should remain subtle.

Scientific data should remain the primary visual layer.

---

# 23. Base Map

The base map must provide geographic orientation without overwhelming the model.

Avoid:

- bright satellite imagery,
- high-contrast political boundaries,
- excessive labels,
- decorative terrain.

Recommended:

- muted coastlines,
- restrained land color,
- low-contrast boundaries,
- subtle geographic labels.

---

# 24. Data Layers

Layer order should follow scientific importance.

Recommended:

```text
1. Base geography
2. Model field
3. Derived overlays
4. Current vectors
5. Observation markers
6. Selection / analytical cursor
7. Interaction feedback
```

The selection state must always remain visible.

---

# 25. Observation Markers

Markers should be:

- small,
- precise,
- consistent,
- visually subordinate to selected data.

Selected observations may become larger.

Do not use cartoon-like markers.

Avoid:

- glowing pins,
- animated pulses everywhere,
- oversized 3D objects.

---

# 26. Current Vectors

Current vectors should communicate:

```text
direction
+
relative magnitude
```

Vector density must be controlled.

Too many vectors create visual noise.

Use sampling/LOD where necessary.

---

# 27. Depth Control

Depth is a primary scientific control.

Recommended:

```text
DEPTH
────────────────────●────
0m                  150m

SURFACE
50m
100m
150m
250m
500m
1000m
```

The current depth should always have a numeric value.

Example:

```text
DEPTH
150 m
```

---

# 28. Time Control

Time should be represented as a scientific timeline rather than a generic date picker.

Example:

```text
15 JAN
00:00 ───────●──────── 10 JAN
```

Better:

```text
MODEL TIME

01 JAN   03 JAN   05 JAN   07 JAN   10 JAN
                     ●
                 05 JAN
```

Controls:

- play,
- pause,
- step backward,
- step forward,
- jump to start/end.

---

# 29. Time Animation

Time animation should update:

- model field,
- current vectors,
- observation context where appropriate,
- analytical state.

Do not animate UI panels unnecessarily.

The data should move.

---

# 30. Animation Principles

Use motion for:

### State transition

Panel opens/closes.

### Data transition

Depth/time changes.

### Selection

Observation becomes active.

### Scenario

Trajectory evolves.

Do not animate:

- static labels,
- every icon,
- every border,
- every panel.

---

# 31. Motion Timing

Suggested:

```text
Micro interaction
100–160ms

Panel transition
180–250ms

Major workspace transition
250–400ms

Scientific playback
Controlled by dataset timestep
```

Use easing that feels precise rather than bouncy.

Avoid spring-heavy consumer-app motion.

---

# 32. Loading

Loading should communicate scientific work.

Avoid:

```text
LOADING...
```

Prefer:

```text
LOADING MODEL FIELD
```

or:

```text
MATCHING OBSERVATION
```

or:

```text
CALCULATING PROFILE RESIDUAL
```

This makes system state understandable.

---

# 33. Empty States

Empty states should explain what the user can do.

Example:

```text
NO OBSERVATION SELECTED

Select an observation from the globe
to begin model comparison.
```

Avoid decorative illustrations.

---

# 34. Error States

Errors should be:

- specific,
- calm,
- actionable.

Example:

```text
MODEL FIELD UNAVAILABLE

The selected time/depth combination
could not be loaded.

Try another time or depth.
```

Avoid:

```text
Something went wrong!!!
```

---

# 35. Evidence Workspace

Evidence should appear as an integrated analytical workspace.

Recommended:

```text
┌───────────────────────────────┬──────────────────────┐
│                               │ OBSERVATION           │
│                               │                      │
│           GLOBE               │ MODEL MATCH          │
│                               │                      │
│                               │ PROFILE              │
│                               │                      │
│                               │ RESIDUAL             │
│                               │                      │
│                               │ FEATURES             │
└───────────────────────────────┴──────────────────────┘
```

The evidence panel should not feel like a modal.

It is part of the workspace.

---

# 36. Evidence Panel Width

Desktop recommendation:

```text
280–420px
```

The panel should be wide enough for scientific labels but narrow enough to preserve the globe.

For detailed profile analysis, it may expand.

---

# 37. Expandable Evidence Mode

Provide two levels:

### Compact

Shows:

- observation identity,
- match,
- key feature,
- current.

### Expanded

Shows:

- full profile,
- residual,
- statistics,
- provenance,
- derived features.

This allows the user to control information density.

---

# 38. Scientific Cursor

The analytical cursor should be visually consistent across components.

Example:

```text
DEPTH
──────●────────

150 m
```

The cursor should be:

- visible,
- precise,
- easy to drag,
- keyboard accessible where practical.

---

# 39. Data Readouts

Use compact technical formatting.

Example:

```text
TEMP
27.41 °C

CURRENT
0.42 m/s

DEPTH
150 m

LAT
12.438° N

LON
87.312° E
```

Units must always be visible where ambiguity exists.

---

# 40. Coordinates

Coordinates should use monospace.

Example:

```text
12.438° N
87.312° E
```

Do not display excessive decimal precision.

Use precision appropriate to the actual dataset and interaction.

---

# 41. Dataset Badge

The active dataset should remain visible.

Example:

```text
GLORYS12V1
```

Clicking it may open metadata.

Do not make the dataset badge visually dominant.

---

# 42. Variable Selector

Example:

```text
FIELD

Temperature
Salinity
Current
```

Current may internally represent:

```text
U
V
Speed
Direction
```

The user should not have to understand internal NetCDF variable names unless viewing technical metadata.

---

# 43. Layer Control

Recommended:

```text
LAYERS

☑ Temperature
☑ Current vectors
☑ Observations
☐ Thermocline
☐ Residual
```

Avoid huge checkbox dashboards.

Keep the layer list concise.

---

# 44. Opacity

Layer opacity should be available where scientifically useful.

Example:

```text
TEMPERATURE
Opacity ─────●── 78%
```

Do not hide critical data by default.

---

# 45. Vertical Exaggeration

Vertical exaggeration may be useful because ocean depth is much greater than visible horizontal structures.

However:

```text
VERTICAL EXAGGERATION
2.0×
```

must always be explicit.

The user must know that visual geometry is exaggerated.

Never imply that the displayed geometry represents true physical proportions when it does not.

---

# 46. Legend System

Every scientific visual must have a legend or scale where necessary.

Temperature:

```text
°C
┌──────────────────────┐
low                high
```

Residual:

```text
°C
negative   0   positive
```

Current:

```text
m/s
```

Legends should remain compact.

---

# 47. Tooltip System

Tooltips should reveal precise values.

Example:

```text
TEMPERATURE
Depth: 150 m
Value: 27.41 °C
```

For current:

```text
CURRENT
Speed: 0.42 m/s
Direction: 137°
```

Tooltips should not contain paragraphs.

---

# 48. Interaction Priority

The interface should make the following actions easy:

```text
1. Change time
2. Change depth
3. Select observation
4. Inspect evidence
5. Compare profile
6. Inspect current
7. Start scenario
```

These actions form the primary demo and analysis workflow.

---

# 49. Keyboard Behavior

Where practical:

```text
Space
Play / pause time

← →
Step through time

↑ ↓
Change depth

Esc
Close temporary panel

Enter
Confirm focused control
```

Do not introduce keyboard shortcuts that conflict with browser behavior without necessity.

---

# 50. Hover Behavior

Hover should provide information.

Do not use hover solely for visual decoration.

Examples:

- hover observation → metadata
- hover profile → values
- hover vector → speed/direction
- hover feature → method/value

---

# 51. Click Behavior

Click should generally mean:

```text
SELECT
```

Double-click should not be required for core functionality.

---

# 52. Drag Behavior

Use drag for:

- depth cursor,
- time slider,
- chart navigation,
- scenario timeline.

Drag should update state continuously but efficiently.

Avoid sending excessive API requests.

Use throttling/debouncing where appropriate.

---

# 53. Context Preservation

When switching between modes:

```text
EXPLORE
↓
EVIDENCE
↓
RESPONSE
```

preserve:

- location,
- time,
- depth,
- dataset,
- selected observation,
- selected variable.

The user should never feel that the application reset.

---

# 54. Response Mode

Response mode should visually change the workspace enough to communicate that the user has moved from analysis to scenario exploration.

However, it must remain visually related to Explore and Evidence.

Recommended:

```text
GLOBE
+
TRAJECTORY
+
CURRENT FIELD
+
SCENARIO TIMELINE
```

---

# 55. Scenario Timeline

Example:

```text
DRIFT SCENARIO

0h ──── 12h ──── 24h ──── 48h ──── 72h
●
```

The current scenario time should synchronize with the trajectory.

---

# 56. Scenario Information

Show:

```text
START
12.438°N
87.312°E

START TIME
15 JAN 2024 · 06:42 UTC

DURATION
72 h

METHOD
Euler integration

FIELD
GLORYS12V1 u/v
```

The scientific assumptions should be inspectable.

---

# 57. Scenario Limitations

The interface must communicate that a drift scenario is not a complete operational forecast.

Example:

```text
SCENARIO LIMITATIONS

Passive particle drift using model currents.

Does not include:
windage
waves
Stokes drift
leeway
object-specific behavior
```

This is essential for scientific honesty.

---

# 58. Visual Hierarchy During Scenario

The trajectory should become the primary visual object.

However:

- current field remains visible,
- starting point remains visible,
- time remains visible,
- assumptions remain accessible.

The trajectory should not become a decorative line.

---

# 59. Data Density Management

When many visual layers are active:

Prioritize:

```text
selected observation
current depth
active variable
scenario trajectory
```

Reduce:

```text
secondary observations
dense vectors
non-selected labels
```

Use level-of-detail strategies.

---

# 60. Progressive Disclosure

Do not expose every advanced control immediately.

Primary:

```text
Time
Depth
Variable
Layers
```

Advanced:

```text
Color scale
Vertical exaggeration
Vector density
Matching tolerance
Rendering options
```

Advanced controls should be accessible without cluttering the main workspace.

---

# 61. No Generic AI Patterns

Strictly avoid:

```text
AI Assistant
Ask AI
Copilot
Magic Insights
✨ AI
Generate Analysis
```

unless a scientifically justified intelligence module is explicitly implemented later.

The product should demonstrate scientific computation, not artificial intelligence theater.

---

# 62. No Futuristic HUD

Avoid:

- corner brackets,
- scanning lines,
- glowing borders,
- circular HUD widgets,
- animated radar graphics,
- fake telemetry,
- decorative coordinates floating everywhere.

NIRIKSHAN should look real.

---

# 63. No Glassmorphism

Avoid:

```css
backdrop-filter: blur(...)
```

as a dominant visual treatment.

Do not create translucent floating glass cards around every component.

---

# 64. No Neon

Avoid:

- cyan glow,
- purple glow,
- electric blue outlines,
- neon green vectors.

Scientific color scales are allowed when representing actual data.

---

# 65. No Excessive Rounded Cards

Do not turn every element into:

```text
╭────────────────╮
│     CARD       │
╰────────────────╯
```

Prefer:

```text
SECTION
────────────────────────
content
```

with subtle boundaries.

---

# 66. No Excessive Gradients

Gradients should primarily represent scientific scalar fields.

Do not use gradients as decoration.

---

# 67. Microcopy

Interface language should be concise.

Use:

```text
SELECT OBSERVATION
MATCH MODEL
VIEW PROFILE
COMPARE
INSPECT CURRENT
RUN SCENARIO
VIEW PROVENANCE
```

Avoid:

```text
Let's discover what the ocean is telling us!
```

The application is a scientific tool.

---

# 68. Empty Workspace

Initial state should communicate the next action.

Example:

```text
SELECT AN OBSERVATION

Choose a profile from the globe
to begin evidence analysis.
```

The globe remains visible behind/alongside this message.

---

# 69. First-Run Experience

The first screen should immediately show real scientific content.

Within seconds, the user should see:

```text
real globe
+
real model field
+
real observations
```

Do not begin with a marketing splash screen.

---

# 70. Demo Readiness

The application must be capable of being demonstrated without manual setup during the demo.

Before presentation:

- dataset loaded,
- model field available,
- observations available,
- API healthy,
- globe renders,
- evidence workflow works,
- scenario works,
- provenance works.

---

# 71. Performance Targets

The UI should aim for:

- smooth globe interaction,
- responsive depth changes,
- responsive time controls,
- minimal blocking operations,
- efficient observation rendering.

Avoid loading entire scientific datasets into browser memory.

---

# 72. Frontend Architecture Rule

Components should not own scientific truth.

Preferred:

```text
Scientific API
      ↓
Application State
      ↓
UI Components
```

Not:

```text
UI Component
      ↓
fetch NetCDF
      ↓
calculate science
      ↓
render
```

---

# 73. Component Design Rule

Components should have clear responsibilities.

Example:

```text
DepthControl
→ controls depth

TimeControl
→ controls time

ObservationMarker
→ represents observation

EvidenceWorkspace
→ presents evidence

ProfileChart
→ renders profile

WaterColumnLens
→ renders vertical structure

ScenarioTimeline
→ controls scenario time
```

Avoid giant components containing the entire application.

---

# 74. State Ownership

Use one authoritative source for:

```text
time
depth
variable
dataset
selectedObservation
mode
scenarioTime
```

Do not duplicate them across components.

---

# 75. Interaction Architecture

Use event/state relationships.

Example:

```text
Observation Selected
        ↓
setSelectedObservation()
        ↓
fetchEvidence()
        ↓
setEvidenceCase()
        ↓
EvidenceWorkspace
        ↓
Profile + Features + Current
```

Avoid direct component-to-component mutation.

---

# 76. Visual Regression

After major UI changes verify:

- globe still visible,
- controls remain readable,
- evidence panel does not cover critical geography,
- charts remain legible,
- no accidental glow/gradient systems introduced,
- desktop layout remains stable.

---

# 77. Mobile Rule

Mobile is secondary.

Do not compromise desktop scientific usability to create a phone-first layout.

If mobile support is needed:

```text
OBSERVATION
↓
PROFILE
↓
EVIDENCE
↓
SCENARIO
```

should remain usable.

---

# 78. Design Tokens

Create centralized design tokens.

Example:

```css
:root {
  --color-bg: ...;
  --color-surface: ...;
  --color-border: ...;
  --color-text: ...;
  --color-muted: ...;
  --color-accent: ...;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;

  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
}
```

Do not scatter arbitrary values throughout the application.

---

# 79. Spacing System

Use a consistent spacing scale.

Primary increments:

```text
4
8
12
16
24
32
48
64
```

Large spacing should be used deliberately.

Scientific interfaces usually benefit from compact but breathable layouts.

---

# 80. Icons

Use a single icon system.

Icons should:

- be simple,
- be recognizable,
- have consistent stroke weight,
- not dominate the interface.

Avoid mixing multiple icon libraries without reason.

---

# 81. Icon Labels

Critical controls should not rely exclusively on icons.

For example:

Bad:

```text
[▶]
```

Better:

```text
[▶ PLAY]
```

or provide an accessible tooltip/label.

---

# 82. Tables

Use tables for technical metadata where appropriate.

Example:

```text
PROPERTY        VALUE
Dataset         GLORYS12V1
Variable        thetao
Time            2024-01-05
Latitude        12.438°
Longitude       87.312°
Depth           150m
```

Do not turn simple metadata into oversized cards.

---

# 83. Scientific Snapshot UI

Snapshot should feel like an analytical record.

Example:

```text
SCIENTIFIC SNAPSHOT

Observation
ARGO 2901234

Model
GLORYS12V1

Time
15 Jan 2024 · 06:42 UTC

Depth
150 m

Residual
+0.42 °C

Thermocline
82 m

Current
0.42 m/s · 137°

PROVENANCE
View details →
```

---

# 84. Trust Signals

The interface should continuously communicate trust through:

- source names,
- units,
- timestamps,
- model names,
- matching offsets,
- methodology,
- provenance,
- limitations.

Not through:

- badges like "AI Verified",
- arbitrary confidence scores,
- glowing status indicators.

---

# 85. Status System

Use concise status states.

```text
READY
LOADING
MATCHING
ANALYZING
LIMITED
UNAVAILABLE
```

Avoid excessive status colors.

---

# 86. Data Health

Data health can appear as a compact system indicator.

Example:

```text
DATA
READY
```

Clicking it can reveal:

```text
MODEL
AVAILABLE

OBSERVATIONS
19 FLOATS

TIME RANGE
01–10 JAN 2024

REGION
5–25°N
75–100°E
```

Only display values actually known from the loaded dataset.

---

# 87. Scientific Metadata Drawer

Advanced users should be able to inspect:

- variable names,
- dataset IDs,
- coordinate ranges,
- time range,
- depth levels,
- source information.

Keep this behind a technical details control.

---

# 88. Design Quality Test

Before accepting a UI change, ask:

### Question 1

Does it improve scientific understanding?

### Question 2

Does it improve interaction?

### Question 3

Does it improve hierarchy?

If the answer is "no" to all three:

Do not add the element.

---

# 89. Anti-Pattern Checklist

Reject UI changes that introduce:

- [ ] neon glow
- [ ] purple/blue AI gradients
- [ ] excessive glassmorphism
- [ ] huge rounded cards
- [ ] decorative particles
- [ ] fake telemetry
- [ ] unnecessary animations
- [ ] oversized typography
- [ ] excessive icons
- [ ] dashboard-card explosion
- [ ] generic AI assistant UI
- [ ] fake confidence scores
- [ ] decorative 3D geometry

---

# 90. Premium Quality Checklist

A premium result should come from:

- precise spacing,
- strong hierarchy,
- excellent typography,
- consistent interaction,
- subtle borders,
- coherent color,
- meaningful animation,
- high-quality charts,
- smooth globe interaction,
- reliable state transitions,
- scientifically correct data.

Premium does not mean flashy.

---

# 91. AI Coding Agent Rules

When modifying the frontend:

1. Inspect the existing component before editing.
2. Preserve working scientific functionality.
3. Do not replace real data with mocks.
4. Do not redesign unrelated components.
5. Follow the design tokens.
6. Reuse existing components where possible.
7. Do not introduce a new design system without necessity.
8. Keep scientific calculations outside presentation components.
9. Preserve responsive behavior.
10. Run the production build after significant changes.
11. Check browser console errors.
12. Verify the globe after rendering changes.
13. Verify evidence selection after state changes.
14. Verify scenario handoff after evidence changes.

---

# 92. Definition of Done

The UI/UX system is considered implemented when:

### Visual

- [ ] Interface feels scientific and institutional.
- [ ] No generic AI aesthetic.
- [ ] No excessive glow.
- [ ] No excessive glassmorphism.
- [ ] Typography is consistent.
- [ ] Colors have semantic meaning.
- [ ] Spacing is consistent.

### Interaction

- [ ] Explore/Evidence/Response modes are clear.
- [ ] Depth is easy to manipulate.
- [ ] Time is easy to manipulate.
- [ ] Observations are easy to select.
- [ ] Evidence is easy to inspect.
- [ ] Scenario is easy to launch.
- [ ] Context is preserved between modes.

### Scientific

- [ ] Units are visible.
- [ ] Data source is visible.
- [ ] Model state is visible.
- [ ] Residual sign is consistent.
- [ ] Provenance is accessible.
- [ ] Limitations are communicated.

### Performance

- [ ] Globe remains responsive.
- [ ] Large datasets are not loaded unnecessarily.
- [ ] UI state updates efficiently.
- [ ] Charts do not cause noticeable blocking.

---

# 93. Final Design Principle

NIRIKSHAN should look impressive because the underlying system is impressive.

The visual design must never compensate for weak scientific functionality.

The ideal experience is:

```text
CALM INTERFACE
      ↓
REAL DATA
      ↓
CLEAR INTERACTION
      ↓
VISIBLE SCIENCE
      ↓
TRACEABLE EVIDENCE
      ↓
MEANINGFUL RESPONSE
```

The user should finish the experience thinking:

> "I can see exactly how the system got from the ocean data to this result."

That is the visual identity of NIRIKSHAN.
```