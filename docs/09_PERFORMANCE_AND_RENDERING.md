Absolutely. We’ll continue **one implementation-ready document at a time**.

# `09_PERFORMANCE_AND_RENDERING.md`

```md
# 09 — Performance & Rendering Architecture

## 1. Purpose

This document defines the performance and rendering strategy for NIRIKSHAN.

NIRIKSHAN combines:

- Cesium globe rendering
- Three.js/WebGL scientific visualization
- Plotly analytical charts
- GLORYS12V1 4D model data
- Argo observations
- current-vector visualization
- depth/time interaction
- model-observation comparison
- SAR trajectory simulation

The application must remain responsive while working with scientifically meaningful data.

The objective is not to maximize graphical complexity.

The objective is:

> Render the right scientific information at the right level of detail, only when needed.

Performance decisions must preserve scientific correctness.

---

# 2. Performance Principles

NIRIKSHAN follows these principles:

1. Never load the complete dataset into the browser unless explicitly required.
2. Never render more visual primitives than the current view requires.
3. Prefer server-side scientific subsetting.
4. Keep the globe lightweight.
5. Use Three.js only for specialized scientific rendering.
6. Reuse fetched scientific data whenever possible.
7. Cancel stale requests.
8. Avoid unnecessary React re-renders.
9. Keep analytical calculations separate from rendering.
10. Never sacrifice scientific accuracy merely to improve FPS.
11. Degrade visual density before degrading scientific information.
12. Show meaningful loading states instead of freezing the interface.

---

# 3. Current Data Scale

The current GLORYS12V1 subset is:

- Time: 10 daily timestamps
- Latitude: 241 points
- Longitude: 301 points
- Depth: 50 levels
- Variables:
  - thetao
  - uo
  - vo

Approximate scalar values per variable:

241 × 301 × 50 × 10

The browser must NOT assume that the complete scientific dataset should be transferred and rendered simultaneously.

The backend remains responsible for selecting the smallest useful scientific subset.

---

# 4. Rendering Architecture

The rendering stack has three primary layers.

```text
                    NIRIKSHAN UI
                         │
             ┌───────────┴───────────┐
             │                       │
        CesiumJS                 Analytical UI
             │                       │
       Globe / Context       Plotly / DOM / SVG
             │
             │
        Three.js/WebGL
             │
    Scientific 3D Overlays
```

Responsibilities:

### CesiumJS

Use Cesium for:

- Earth/globe
- geographic context
- camera navigation
- basemap
- observation locations
- large-scale geographic overlays
- lightweight point/marker layers
- response trajectory at geographic scale

Cesium should remain the primary geographic context.

---

### Three.js

Use Three.js for:

- scientific depth slices
- volumetric-like field representations
- isosurfaces
- current vectors
- specialized 3D analytical overlays
- water-column visualization

Three.js must not duplicate Cesium's geographic responsibilities.

---

### Plotly

Use Plotly for:

- vertical profiles
- residual profiles
- temperature/current charts
- time-series views
- analytical plots

Charts should consume already-processed scientific data.

Plotly should not perform heavy NetCDF processing.

---

# 5. Globe Rendering Strategy

The globe is the primary visual canvas.

It must remain visually calm and computationally lightweight.

## 5.1 Base Globe

Cesium should initially render:

- globe
- basemap
- coastlines/geographic context
- selected region
- observation markers

Do not immediately render every scientific layer.

Initial state should prioritize:

```text
Globe
+
Observation context
+
Current selected state
```

Scientific overlays activate progressively.

---

# 6. Layer Activation

Scientific layers should be independently toggleable.

Recommended layer model:

```ts
interface LayerState {
  observations: boolean;
  temperature: boolean;
  salinity: boolean;
  currents: boolean;
  residuals: boolean;
  isosurface: boolean;
  trajectory: boolean;
}
```

Only active layers should consume rendering resources.

Example:

```text
OBSERVATIONS       ON
TEMPERATURE        ON
CURRENTS           OFF
RESIDUALS          OFF
ISOSURFACE         OFF
TRAJECTORY         OFF
```

This should be a valid lightweight state.

---

# 7. Level of Detail

NIRIKSHAN should use explicit Levels of Detail.

## LOD 0 — Geographic Context

Render:

- globe
- coastlines
- selected region
- sparse observations

Used during:

- initial load
- camera movement
- zoomed-out view

---

## LOD 1 — Regional Scientific View

Render:

- selected scientific field
- moderate observation density
- reduced current vectors

Used during:

- normal exploration

---

## LOD 2 — Analytical View

Render:

- depth slice
- higher-resolution field
- selected observation
- current vectors
- analytical overlays

Used when:

- user pauses interaction
- user selects an observation
- user enters Evidence mode

---

## LOD 3 — Detailed Scientific Inspection

Render:

- Water-Column Lens
- profile comparison
- residual profile
- derived features
- detailed vectors
- selected local field

Used only for:

- focused scientific analysis

---

# 8. Camera-Movement Optimization

During camera movement:

```text
Camera moving
     ↓
Reduce expensive overlays
     ↓
Render lightweight context
     ↓
Camera stops
     ↓
Restore requested scientific layers
```

Do not continuously regenerate expensive scientific geometry while the camera is moving.

Camera movement events should be throttled/debounced.

Example concept:

```ts
onCameraMoveStart()
onCameraMoveEnd()
```

During movement:

- reduce vector density
- pause expensive geometry regeneration
- avoid unnecessary data requests

After movement settles:

- restore requested LOD
- update spatial subset if necessary

---

# 9. Current Vector Rendering

Current vectors can become one of the largest rendering costs.

Do not render every model grid point as a vector.

Instead:

```text
Scientific grid
      ↓
Vector sampling
      ↓
Density reduction
      ↓
Screen/world visibility check
      ↓
Render
```

Example:

```text
Raw grid:

301 × 241 vectors

             ↓

Sample every Nth point

             ↓

Visible regional vectors

             ↓

Three.js instanced rendering
```

The sampling interval must be configurable.

Example:

```ts
vectorDensity = 4;
```

means approximately every fourth grid point is displayed.

---

# 10. Vector Density Rules

Vector density should adapt to the viewport.

Example conceptual rules:

```text
Zoomed out
→ sparse vectors

Regional view
→ moderate vectors

Focused area
→ dense vectors
```

Never allow vector density to increase without a defined upper bound.

Recommended starting budget:

```text
Normal view:
≤ 2,500 visible vectors

Focused analytical view:
≤ 5,000 visible vectors
```

These are rendering budgets, not scientific limits.

The underlying scientific field remains unchanged.

---

# 11. Instanced Rendering

Current vectors should use GPU instancing where possible.

Avoid:

```text
5,000 individual Three.js Mesh objects
```

Prefer:

```text
1 InstancedMesh
+
5,000 transforms
```

Benefits:

- fewer draw calls
- lower CPU overhead
- better GPU utilization
- easier visibility management

---

# 12. Scientific Field Rendering

Temperature and other scalar fields should not automatically become full 3D volumes.

Default representation:

```text
Selected depth
        ↓
2D horizontal scientific slice
        ↓
GPU-rendered surface/texture
```

This is the primary rendering strategy.

A full volumetric representation should only be activated for focused analysis.

---

# 13. Depth Slice Strategy

When the user changes depth:

```text
User depth change
       ↓
Check local cache
       ↓
If cached → render immediately
       ↓
If missing → request backend subset
       ↓
Receive field
       ↓
Validate
       ↓
Render
```

Do not download the entire 50-level volume for every depth change.

---

# 14. Depth Prefetching

When useful, the frontend may prefetch nearby depth levels.

Example:

```text
Current depth:
100 m

Prefetch:
75 m
125 m
```

However, prefetching must remain bounded.

Do not prefetch the complete water column.

Recommended initial policy:

```text
Current level
+
1 nearby shallower level
+
1 nearby deeper level
```

This can be disabled on low-memory devices.

---

# 15. Time Navigation

Time navigation follows the same principle.

Current selected time:

```text
2024-01-05
```

Load:

```text
2024-01-05
```

Optionally prefetch:

```text
2024-01-04
2024-01-06
```

Avoid downloading all timestamps solely because they exist in the dataset.

---

# 16. Scientific Data Cache

The frontend should maintain a bounded cache.

Recommended cache keys:

```text
dataset
+
variable
+
time
+
depth
+
spatial region
```

Example:

```ts
model:thetao:2024-01-05:100:bob
```

Cache values should contain already-normalized API responses.

Do not cache arbitrary UI component state as scientific data.

---

# 17. Cache Policy

Use a small LRU-style cache.

Example conceptual limits:

```text
Field slices:
8–20 entries

Profiles:
10–30 entries

Observation metadata:
100–500 entries

Derived feature results:
small bounded cache
```

Exact limits should be configurable.

The cache must never grow indefinitely.

---

# 18. Request Deduplication

If multiple components request the same scientific data:

```text
Globe
Water Column
Profile
```

they should reuse the same request.

Avoid:

```text
Component A → GET /model-field
Component B → GET /model-field
Component C → GET /model-field
```

Instead:

```text
                 ┌→ Globe
One request ─────┼→ Water Column
                 └→ Profile
```

Use a shared data-fetching layer.

---

# 19. Stale Request Cancellation

This is mandatory for time/depth interaction.

Example:

```text
User selects:
100m
 ↓
request A

Immediately selects:
200m
 ↓
request B

Immediately selects:
500m
 ↓
request C
```

If request A finishes last, it must NOT overwrite the current 500m state.

Use:

- AbortController
- request IDs
- sequence numbers
- state validation

Concept:

```ts
if (requestId !== latestRequestId) {
  ignoreResult();
}
```

---

# 20. React Rendering Rules

React should control application state.

React should NOT continuously manage thousands of visualization objects.

Avoid:

```tsx
{vectors.map(v => <Vector ... />)}
```

for large scientific vector fields.

Prefer:

```text
React
  ↓
scientific state
  ↓
Three.js renderer
  ↓
GPU objects
```

The Three.js scene should update imperatively when necessary.

---

# 21. State Partitioning

Separate:

### UI State

Examples:

```text
activePanel
showLegend
sidebarOpen
selectedTab
```

### Scientific State

Examples:

```text
time
depth
variable
latitude
longitude
dataset
```

### Visualization State

Examples:

```text
vectorDensity
layerVisibility
cameraState
renderQuality
```

### Evidence State

Examples:

```text
selectedObservation
modelMatch
residual
derivedFeatures
```

Avoid putting all of these into a single React component state object.

---

# 22. Plotly Performance

Plotly charts should receive only the data needed for the active chart.

For example, a selected profile should not cause the complete model cube to enter Plotly.

Profile data should be approximately:

```text
depth
temperature
observation
model
residual
```

Plotly should not calculate expensive scientific transformations.

Those belong in the backend scientific engine.

---

# 23. Water-Column Lens

The Water-Column Lens should be optimized as a focused visualization.

It may display:

```text
Depth
│
│ Temperature
│
│ Observation
│
│ Model
│
│ Residual
│
└────────────
```

Only the selected location should be rendered.

Do not create Water-Column visualizations for every observation simultaneously.

---

# 24. Observation Rendering

Argo observations are relatively sparse compared with the model grid.

However, selection and interaction should remain efficient.

Observation states:

```text
Context
Hovered
Selected
```

Only the selected observation receives:

- larger marker
- detail label
- analytical relationship
- model match
- profile
- residual
- derived features

This avoids visual clutter.

---

# 25. Observation Clustering

If future datasets contain thousands of observations:

```text
Zoomed out
→ cluster

Zoomed in
→ individual observations
```

Do not introduce clustering unnecessarily for the current 19-float dataset.

The current dataset is small enough for direct rendering.

---

# 26. Isosurface Performance

Isosurfaces are expensive.

They should be considered an advanced analytical layer.

Rules:

1. Never generate them on initial application load.
2. Generate only after explicit user activation.
3. Operate on a bounded spatial/depth subset.
4. Use marching cubes or equivalent implementation only when necessary.
5. Cache the generated geometry where useful.
6. Dispose old geometry before replacing it.

Example:

```text
User:
"Show thermocline surface"

        ↓

Request bounded scientific subset

        ↓

Scientific calculation

        ↓

Isosurface generation

        ↓

Three.js geometry

        ↓

Render
```

---

# 27. Geometry Disposal

Every dynamically generated Three.js object must have a lifecycle.

When replacing geometry:

```ts
geometry.dispose();
material.dispose();
texture.dispose();
```

Remove unused objects from the scene.

Memory leaks are unacceptable.

---

# 28. GPU Memory Management

Avoid retaining:

- old field textures
- obsolete geometries
- duplicate vector buffers
- inactive materials
- unused render targets

When a scientific layer changes:

```text
old resource
    ↓
dispose
    ↓
new resource
```

Do not simply hide old resources indefinitely.

---

# 29. Scientific Field Texture Strategy

For a 2D depth slice:

```text
Scientific values
       ↓
normalized scalar field
       ↓
GPU texture
       ↓
shader/color mapping
```

Prefer GPU-side color mapping where practical.

This avoids generating thousands of DOM/SVG elements.

The original scientific values must remain accessible separately from the rendered color representation.

---

# 30. Color Mapping

Color mapping must remain scientifically consistent.

The renderer should receive:

```ts
{
  values,
  min,
  max,
  palette,
  missingValue
}
```

Do not automatically normalize every frame based on visible values if this makes comparisons misleading.

For comparison workflows, preserve the selected scale.

Example:

```text
Temperature:
10°C → 30°C

Current:
0 → 1.5 m/s
```

For residuals:

```text
negative ← 0 → positive
```

Use a zero-centered diverging scale.

---

# 31. Missing Data Rendering

Missing values must not be converted into zero.

Bad:

```text
NaN → 0
```

Correct:

```text
NaN → masked
```

Rendering should visually distinguish:

```text
valid scientific value
```

from:

```text
missing/unavailable
```

This is a scientific integrity requirement.

---

# 32. SAR Rendering Performance

SAR trajectories are comparatively lightweight.

A trajectory of:

```text
72 hours
×
1-hour timestep
```

is only 73 positions.

The frontend can render this directly.

However, the current field used for the simulation must remain scientifically linked to the scenario.

Do not generate an independent fake trajectory purely for visual effect.

---

# 33. SAR Animation

During trajectory animation:

- reuse existing trajectory points
- move a marker along the path
- do not recompute the scientific simulation every animation frame

Correct architecture:

```text
Scientific simulation
        ↓
73 trajectory positions
        ↓
Animation layer
        ↓
Moving marker
```

Not:

```text
animation frame
↓
new scientific simulation
```

---

# 34. Performance Targets

Initial targets for the MVP:

### Initial application

Target:

```text
Interactive shell visible:
< 2 seconds after JS execution begins
```

Subject to hosting/network conditions.

---

### Normal exploration

Target:

```text
~45–60 FPS
```

on a modern laptop with normal scientific layers.

---

### Focused analytical view

Target:

```text
≥ 30 FPS
```

while detailed overlays are active.

---

### Interaction latency

Depth/time changes should provide visible feedback quickly.

Target:

```text
UI response:
< 100 ms

Cached scientific state:
near-immediate

Uncached scientific request:
progressive loading
```

Network latency must not be confused with rendering latency.

---

# 35. Performance Degradation Strategy

When the browser cannot maintain the desired rendering performance:

Do NOT remove scientific meaning.

Reduce visual complexity in this order:

```text
1. Reduce vector density
2. Reduce decorative rendering
3. Reduce observation marker detail
4. Reduce field rendering resolution
5. Disable optional expensive overlays
6. Disable isosurface
7. Preserve core scientific layer
```

Never silently change:

- units
- scientific values
- observation/model matching
- residual calculations
- trajectory calculations

---

# 36. Render Quality Modes

The application may expose an internal quality setting.

```ts
type RenderQuality =
  | "auto"
  | "high"
  | "balanced"
  | "low";
```

### High

- dense vectors
- higher field resolution
- advanced overlays enabled

### Balanced

Default.

- moderate vectors
- normal field resolution
- advanced overlays on demand

### Low

- sparse vectors
- reduced field resolution
- expensive effects disabled

The scientific calculations remain identical.

Only rendering density/resolution changes.

---

# 37. Automatic Quality Adaptation

Future implementation may monitor:

```text
FPS
GPU load
memory pressure
viewport size
device capability
```

and adapt visual density.

Example:

```text
FPS < 30
    ↓
reduce vector density

FPS still < 30
    ↓
reduce field resolution

FPS still < 30
    ↓
disable optional overlays
```

This must be gradual rather than abrupt.

---

# 38. Network Performance

API responses should be minimized.

Prefer:

```text
GET /api/model-field
?variable=temperature
&time=...
&depth=...
&bbox=...
```

over:

```text
GET entire NetCDF dataset
```

Responses should contain only required values and metadata.

---

# 39. Compression

Production API responses should support standard HTTP compression where appropriate.

JSON payloads should be compressed using:

- Brotli
- gzip

depending on deployment configuration.

Scientific arrays may eventually use binary formats when JSON becomes a bottleneck.

Do not introduce binary protocols prematurely.

---

# 40. Binary Data Future Path

If scientific field transfer becomes too large:

```text
JSON
  ↓
Typed arrays
  ↓
ArrayBuffer
  ↓
binary scientific transport
```

Potential formats/approaches:

- Float32Array
- ArrayBuffer
- typed binary API responses

This should only be introduced after measuring JSON performance.

---

# 41. Backend Scientific Computation

Heavy operations should remain server-side.

Examples:

- NetCDF slicing
- model-observation matching
- profile extraction
- residual calculation
- thermocline calculation
- MLD calculation
- current shear
- SAR integration

The browser should primarily:

```text
request
→ receive
→ visualize
→ interact
```

This keeps the client lightweight.

---

# 42. Backend Memory Management

Do not load multiple complete NetCDF datasets into memory unnecessarily.

Prefer xarray lazy access where practical.

Scientific subset:

```text
dataset
   ↓
select coordinates
   ↓
load only required subset
   ↓
serialize response
```

Avoid:

```text
open dataset
→ .load()
→ hold entire cube
```

unless the dataset is explicitly known to be small enough.

---

# 43. Dataset Handle Reuse

Opening NetCDF files repeatedly can be expensive.

The backend may maintain controlled dataset handles or use an appropriate caching mechanism.

However:

- avoid unbounded open files
- respect deployment memory
- ensure safe lifecycle handling

The implementation must remain compatible with the deployment environment.

---

# 44. Backend Caching

Useful server-side cache candidates:

```text
model field slices
profile extraction
derived feature calculations
```

Cache key should include all scientific inputs.

Example:

```text
dataset
variable
time
depth
bbox
```

Never return cached scientific data if the cache key does not fully represent the calculation.

---

# 45. Cache Invalidation

Scientific cache entries should be invalidated when:

- dataset changes
- dataset version changes
- scientific algorithm version changes
- relevant configuration changes

Example:

```text
algorithmVersion = "v1"
```

can be incorporated into derived-feature cache keys.

This prevents old scientific calculations from surviving algorithm changes.

---

# 46. API Pagination / Large Results

Observation endpoints should support bounded results.

Future:

```text
GET /api/observations
?bbox=...
&time=...
&limit=...
```

If datasets become large, pagination or spatial tiling should be introduced.

The current 19-float dataset does not require complex pagination.

---

# 47. Loading UX

Never leave the user wondering whether the application is frozen.

Loading states should explain what is happening.

Examples:

```text
Loading model field…
Matching observation…
Computing residual…
Building current field…
Running drift simulation…
```

Prefer scientific operation labels over generic:

```text
Loading…
```

---

# 48. Progressive Rendering

For expensive views:

```text
Step 1
Render base context

Step 2
Render observation

Step 3
Render scientific field

Step 4
Render analytical overlays
```

This creates the perception of a responsive scientific instrument without faking data.

---

# 49. Error Recovery

A rendering failure in one layer must not destroy the application.

Example:

```text
Isosurface fails
      ↓
Globe continues working

Plotly fails
      ↓
3D scene continues working

Current vectors fail
      ↓
Temperature field remains visible
```

Each visualization layer should fail independently.

---

# 50. WebGL Context Recovery

The application should gracefully handle WebGL context loss where practical.

Possible response:

```text
WebGL context lost
       ↓
pause renderer
       ↓
show recovery state
       ↓
attempt renderer restoration
       ↓
rebuild active layers
```

Do not assume WebGL is permanently available.

---

# 51. Mobile / Low-Power Devices

The MVP is primarily desktop-oriented because scientific 3D analysis benefits from a larger screen.

However, the application should not completely fail on smaller devices.

Fallback:

```text
Reduced scientific layer complexity
+
2D analytical interface
+
limited 3D rendering
```

Do not prioritize mobile-specific complexity over the desktop judge/demo experience.

---

# 52. Browser Compatibility

Primary target:

- modern Chromium
- modern Firefox
- modern Safari

Required capabilities:

- WebGL
- Web Workers where used
- Fetch API
- AbortController
- modern JavaScript/TypeScript

The application should detect unsupported WebGL capabilities and provide a clear fallback message.

---

# 53. Web Workers

Web Workers may be introduced for CPU-heavy browser operations.

Potential candidates:

- large client-side transformations
- geometry preparation
- expensive local calculations

Do not move ordinary state updates into workers.

Scientific calculations should remain backend-side unless there is a measured reason to move them.

---

# 54. Render Loop Rules

Three.js animation loops should remain minimal.

Bad:

```ts
useFrame(() => {
  calculateEverything();
  fetchData();
  updateReactState();
});
```

Correct:

```ts
renderLoop:
  update visual animation only
```

Scientific calculations happen outside the render loop.

Network calls never belong in the render loop.

React state updates should not occur every animation frame unless absolutely necessary.

---

# 55. Animation Budget

Animation should communicate state.

Avoid:

- perpetual decorative animations
- pulsing every marker
- animated gradients
- constant particle systems
- unnecessary camera motion

Allowed animation:

- SAR trajectory playback
- observation selection transition
- layer appearance/disappearance
- analytical cursor movement
- time playback

Motion must have analytical purpose.

---

# 56. Time Playback

When playing through model time:

```text
time t0
 ↓
t1
 ↓
t2
 ↓
...
```

Do not fetch every frame independently if the required time slices have already been cached.

Playback should use a bounded prefetch window.

Example:

```text
Current:
t5

Prefetch:
t6
t7
```

If data is unavailable, playback should pause gracefully rather than display fabricated interpolation.

---

# 57. Scientific Integrity vs Performance

Performance optimizations must never silently alter scientific meaning.

Allowed:

```text
Render fewer vectors
```

Not allowed:

```text
Change current values to make rendering faster
```

Allowed:

```text
Render a lower-resolution visual texture
```

Not allowed:

```text
Change the underlying model data used for analysis
```

Allowed:

```text
Skip optional isosurface rendering
```

Not allowed:

```text
Invent a replacement surface
```

---

# 58. Measurement Before Optimization

Before implementing major optimization mechanisms, measure:

- API response time
- NetCDF extraction time
- payload size
- frontend parse time
- GPU frame time
- FPS
- memory usage
- Three.js draw calls

Do not introduce infrastructure merely because it sounds performant.

---

# 59. Performance Instrumentation

Development mode may expose:

```text
FPS
Frame time
Draw calls
Triangle count
GPU memory estimate
API request time
Payload size
Cache hit/miss
```

This information should not dominate the production UI.

A developer-only performance panel is sufficient.

---

# 60. Performance Logging

Backend requests should record useful timing information.

Example:

```text
/model-field
dataset=GLORYS12V1
variable=thetao
time=2024-01-05
depth=100

load=42ms
subset=18ms
serialize=9ms
total=69ms
```

Do not log sensitive credentials.

---

# 61. Performance Acceptance Criteria

The implementation is considered performance-ready when:

### Initial load

- Application shell renders without unnecessary scientific downloads.
- Globe becomes interactive quickly.
- No complete NetCDF dataset is sent to the browser.

### Exploration

- Depth changes do not trigger full-dataset downloads.
- Time changes request bounded slices.
- Cached states return quickly.
- Stale requests cannot overwrite newer state.

### Visualization

- Vector fields use bounded density.
- Three.js does not create thousands of unnecessary individual objects.
- Dynamic geometry is disposed correctly.
- Optional expensive layers are lazy-loaded.

### Analysis

- Profile views remain responsive.
- Scientific calculations are not performed every animation frame.
- SAR playback does not repeatedly recompute the simulation.

### Reliability

- One visualization failure does not crash the application.
- Missing scientific values remain masked.
- WebGL failures provide a usable error state.

---

# 62. Implementation Priority

## P0 — Required

Implement immediately:

- bounded API responses
- depth/time subsetting
- request cancellation
- request deduplication
- frontend scientific cache
- vector density limits
- Three.js resource disposal
- no heavy calculations in render loops
- backend subset extraction
- progressive loading

---

## P1 — Important

Implement after P0:

- adaptive vector density
- depth/time prefetch
- LOD states
- Plotly optimization
- backend response compression
- performance instrumentation
- quality modes

---

## P2 — Advanced

Implement only if needed:

- Web Workers
- binary scientific transport
- advanced GPU field rendering
- automatic FPS-based quality adaptation
- observation clustering
- advanced spatial tiling

---

## P3 — Future

Potential future work:

- GPU volume rendering
- WebGPU
- large-scale tiled ocean fields
- streaming remote datasets
- global-scale multi-resolution rendering

These are outside the MVP unless performance measurements demonstrate a clear need.

---

# 63. AI Coding Agent Rules

Any coding agent modifying NIRIKSHAN must follow these rules.

### Rule 1

Do not download or load the complete NetCDF dataset into the browser.

### Rule 2

Do not replace real scientific data with mock data to improve performance.

### Rule 3

Do not change scientific calculations to optimize rendering.

### Rule 4

Do not introduce a new rendering framework without a concrete performance or capability requirement.

### Rule 5

Do not add arbitrary Web Workers, binary protocols, WebGPU, or complex caching before measurement demonstrates the need.

### Rule 6

Always cancel stale scientific requests.

### Rule 7

Always dispose dynamically created Three.js resources.

### Rule 8

Never perform network requests inside animation/render loops.

### Rule 9

Never create one React component per large scientific vector/grid element.

### Rule 10

Keep scientific computation separate from visualization.

### Rule 11

Preserve existing working GLORYS12V1 and Argo integration.

### Rule 12

If an optimization changes scientific values, interpolation, matching, units, or calculations, stop and document the change before implementing it.

---

# 64. Definition of Done

Performance/rendering work is complete when:

- [ ] Cesium handles geographic context.
- [ ] Three.js handles specialized scientific rendering.
- [ ] Plotly handles analytical profiles/charts.
- [ ] Scientific fields are requested as bounded subsets.
- [ ] Depth changes do not download the complete model cube.
- [ ] Time changes do not download unnecessary data.
- [ ] Requests are cancellable.
- [ ] Duplicate requests are deduplicated.
- [ ] Scientific responses are cached with bounded limits.
- [ ] Current vectors have explicit density limits.
- [ ] Dynamic Three.js geometry is disposed.
- [ ] React is not rendering thousands of scientific primitives.
- [ ] Expensive layers are lazy.
- [ ] Isosurfaces are opt-in.
- [ ] SAR animation reuses precomputed trajectory data.
- [ ] Missing values remain masked.
- [ ] Performance degradation reduces visual complexity rather than scientific meaning.
- [ ] Backend scientific computation remains separate from rendering.
- [ ] No optimization introduces fabricated or altered scientific data.
- [ ] Performance instrumentation can identify bottlenecks.
- [ ] MVP remains usable on a modern laptop.
```
