# `10_TESTING_AND_VALIDATION.md`

```md
# 10 — Testing & Scientific Validation

## 1. Purpose

This document defines how NIRIKSHAN is tested and scientifically validated.

NIRIKSHAN is not only a visualization application.

It performs scientific operations involving:

- GLORYS12V1 model data
- Argo observations
- spatial matching
- temporal matching
- vertical profiles
- model-observation residuals
- current calculations
- thermocline detection
- mixed-layer-depth estimation
- current shear
- SAR drift integration
- provenance

Therefore:

> A feature is not complete merely because it renders correctly.

The underlying scientific result must also be traceable, reproducible, and validated.

---

# 2. Testing Philosophy

NIRIKSHAN uses five complementary testing layers:

```text
                 NIRIKSHAN TESTING
                       │
       ┌───────────────┼────────────────┐
       │               │                │
     Unit         Integration       Scientific
       │               │             Validation
       │               │                │
       └───────────────┼────────────────┘
                       │
                End-to-End Tests
                       │
                Demo Acceptance
```

The five layers are:

1. Unit testing
2. Integration testing
3. Scientific validation
4. End-to-end testing
5. Demo/acceptance testing

---

# 3. Core Principle

Every scientific output should have a chain:

```text
Source Data
    ↓
Input Validation
    ↓
Normalization
    ↓
Scientific Calculation
    ↓
Output Validation
    ↓
API
    ↓
Visualization
```

Tests should be capable of identifying where an incorrect result originated.

---

# 4. Test Categories

## 4.1 Unit Tests

Test isolated functions.

Examples:

- current speed
- current direction
- temperature gradient
- residual calculation
- RMSE
- MAE
- coordinate normalization
- longitude normalization
- depth handling
- distance calculation

---

## 4.2 Integration Tests

Test multiple components together.

Examples:

```text
NetCDF
 ↓
Data Adapter
 ↓
Scientific Engine
 ↓
API
```

or:

```text
Argo Observation
 ↓
Model Matching
 ↓
Profile Extraction
 ↓
Residual
```

---

## 4.3 Scientific Validation

Compare calculations against known expected values or independently calculated reference values.

Examples:

- nearest model coordinate
- current speed
- profile residual
- thermocline depth
- SAR displacement

---

## 4.4 End-to-End Tests

Test the user workflow.

Example:

```text
Open application
 ↓
Select observation
 ↓
Load evidence
 ↓
Compare model
 ↓
Inspect profile
 ↓
Inspect current
 ↓
Launch SAR
```

---

## 4.5 Demo Acceptance Tests

These verify that the SIH demonstration works reliably from a clean application state.

The demo must not depend on hidden manual actions.

---

# 5. Test Data Policy

Tests must use deterministic data.

Preferred sources:

### Scientific integration tests

Use the actual bundled/subset scientific files where practical:

```text
backend/data/scientific/
```

Current datasets:

```text
glorys12v1_bob_202401.nc
argo_bob.nc
```

### Unit tests

Use small synthetic arrays with explicitly known values.

Do not use random data unless the random seed is fixed.

---

# 6. Real Data vs Synthetic Data

Synthetic data is acceptable for testing algorithms.

It must not replace real scientific data in integration tests.

Example:

```text
Unit test:
synthetic temperature profile
        ↓
verify thermocline calculation
```

Then:

```text
Integration test:
real GLORYS + real Argo
        ↓
verify complete pipeline
```

Both are required.

---

# 7. Scientific Test Fixtures

Create small reusable fixtures.

Example:

```python
@pytest.fixture
def simple_temperature_profile():
    return {
        "depth": [0, 10, 20, 30, 40],
        "temperature": [29.0, 28.9, 28.7, 26.0, 24.0]
    }
```

Fixtures should be:

- small
- deterministic
- readable
- physically interpretable

---

# 8. Coordinate Validation Tests

Test:

- latitude bounds
- longitude bounds
- depth sign
- coordinate ordering
- duplicate coordinates
- missing coordinates
- timestamp validity

Expected latitude range:

```text
-90 ≤ latitude ≤ 90
```

Expected longitude representation must be explicitly defined by the application.

Depth convention:

```text
positive downward
```

Example:

```text
0 m
10 m
50 m
100 m
```

must not become:

```text
0
-10
-50
-100
```

without an explicit transformation.

---

# 9. Time Validation

Test:

- ISO timestamps
- timezone handling
- date ordering
- nearest-time selection
- exact-time selection
- missing timestamps

Example:

```text
Requested:
2024-01-05T12:00:00

Available:
2024-01-05T00:00:00
2024-01-06T00:00:00
```

The selected timestamp must be deterministic and reported.

The API should expose:

```text
requestedTime
selectedTime
timeDifference
```

---

# 10. Spatial Matching Tests

The current matching strategy uses nearest-neighbour selection.

Test:

```text
Observation:
lat = 12.34
lon = 88.21

Model grid:
lat = 12.33
lon = 88.20
```

Expected selected coordinates:

```text
12.33
88.20
```

The test must verify both:

1. selected coordinate
2. matching distance/separation

---

# 11. Matching Boundary Tests

Test observations:

- exactly on a model coordinate
- between two coordinates
- near domain boundary
- outside domain
- missing coordinate

Example:

```text
Observation outside:
lat = 40

Model:
lat = 5–25
```

Expected behavior:

```text
No valid model match
```

The system must not silently select an unrelated boundary point unless that behavior is explicitly configured.

---

# 12. Matching Tolerance

If matching tolerance is configured:

```text
maximumSpatialSeparation
maximumTemporalSeparation
```

test both:

```text
within tolerance
```

and:

```text
outside tolerance
```

Outside tolerance must produce a clear unavailable/invalid match state.

Do not convert failed matching into an arbitrary confidence score.

---

# 13. Variable Mapping Tests

Public API names and internal NetCDF variables must remain consistent.

Example:

```text
temperature → thetao
eastwardCurrent → uo
northwardCurrent → vo
```

Tests must verify:

```text
public variable
      ↓
internal variable
      ↓
correct NetCDF variable
```

An incorrect mapping is a scientific failure even if the visualization renders successfully.

---

# 14. Unit Validation

Every scientific variable should have explicit units.

Examples:

```text
temperature → °C
current → m/s
depth → m
latitude → degrees
longitude → degrees
```

Tests should verify that units are present in scientific API responses.

Do not rely solely on frontend labels.

---

# 15. Current Speed Tests

Current speed:

```text
speed = sqrt(u² + v²)
```

Example:

```text
u = 3 m/s
v = 4 m/s
```

Expected:

```text
speed = 5 m/s
```

Test:

```python
assert speed == pytest.approx(5.0)
```

Also test:

```text
u = 0
v = 0
```

Expected:

```text
speed = 0
```

---

# 16. Current Direction Tests

The direction convention must be explicitly documented.

For example:

```text
direction = atan2(v, u)
```

converted to the application's declared convention.

Test all quadrants:

```text
(+,+)
(-,+)
(-,-)
(+,-)
```

Also test:

```text
u = 0
v = 0
```

The result must have a defined behavior.

---

# 17. Temperature Gradient Tests

Temperature gradient:

```text
dT/dz
```

must use physical depth spacing.

Example:

```text
depth:
0, 10, 20 m

temperature:
30, 29, 28 °C
```

Expected gradient:

```text
-0.1 °C/m
```

Do not assume equal spacing.

Test irregular depth intervals.

---

# 18. Thermocline Tests

Thermocline detection must be deterministic.

The configured criterion must be part of the test.

For example:

```text
maximum absolute temperature gradient
within configured depth window
```

Test:

1. clear thermocline
2. weak gradient
3. multiple gradient maxima
4. missing values
5. insufficient profile depth

Expected behavior must be documented.

---

# 19. Mixed Layer Depth Tests

If MLD is estimated using a temperature-threshold criterion:

```text
ΔT threshold
```

the threshold must be configurable and included in test metadata.

Test:

- obvious mixed layer
- gradual transition
- missing surface value
- no valid threshold crossing
- shallow profile

Do not silently switch between temperature-based and density-based MLD methods.

---

# 20. Residual Tests

NIRIKSHAN defines:

```text
residual = observation - model
```

Example:

```text
Observation = 28.5 °C
Model = 28.0 °C

Residual = +0.5 °C
```

Test positive, negative, and zero residuals.

This convention must remain consistent throughout:

- backend
- API
- frontend
- legend
- profile chart
- evidence panel

---

# 21. Residual Statistics

Test:

### Bias

```text
mean(observation - model)
```

### MAE

```text
mean(abs(observation - model))
```

### RMSE

```text
sqrt(mean((observation - model)^2))
```

Use hand-calculated fixtures to verify implementation.

---

# 22. Missing-Value Tests

Scientific missing values must remain missing.

Test:

```text
observation = NaN
model = 28.0
```

Expected:

```text
residual = NaN / unavailable
```

Not:

```text
0
```

Similarly:

```text
model = NaN
```

must not produce a valid residual.

---

# 23. QC Tests

Argo quality-control information must be preserved.

Tests should verify that:

- QC fields remain attached to measurements
- invalid observations are not silently treated as valid
- filtering behavior is explicit

Example:

```text
raw observation
+
QC metadata
```

must remain traceable.

---

# 24. Profile Alignment Tests

When comparing profiles:

```text
Observation depths
Model depths
```

may differ.

Test the selected alignment method.

Current initial method:

```text
nearest available model depth
```

Future interpolation must be separately tested.

Do not silently switch algorithms.

---

# 25. Profile Length Tests

A profile comparison must not assume equal lengths.

Example:

```text
Observation:
20 levels

Model:
50 levels
```

Expected:

```text
valid matched subset
```

The API must report which depths were actually compared.

---

# 26. Current Shear Tests

If:

```text
du/dz
dv/dz
```

are calculated, test:

- uniform current
- linearly changing current
- irregular depth spacing
- missing levels

Uniform current should produce approximately:

```text
du/dz = 0
dv/dz = 0
```

---

# 27. Distance Tests

Geographic distance calculations should be tested with known coordinates.

Test:

```text
same coordinate → 0 distance
```

and known approximate separations.

Distance units must be explicit.

---

# 28. SAR Numerical Tests

SAR currently uses deterministic Euler integration.

The integration must be independently testable.

For a constant eastward current:

```text
u = constant
v = 0
```

the trajectory should move eastward monotonically.

For:

```text
u = 0
v = constant
```

the trajectory should move northward monotonically.

---

# 29. SAR Physical Conversion Tests

The model current is in:

```text
m/s
```

The trajectory uses:

```text
Earth radius
+
latitude-dependent longitude conversion
```

Tests should verify:

- latitude displacement
- longitude displacement
- spherical geometry behavior
- units

Do not validate only the final visual position.

---

# 30. SAR Time-Step Tests

For:

```text
duration = 72 h
dt = 1 h
```

expected trajectory points:

```text
73
```

because both the starting point and final point are included.

Test other durations and timesteps.

---

# 31. SAR Boundary Tests

Test what happens when a simulated trajectory exits the model domain.

The behavior must be explicit.

Possible policy:

```text
stop simulation
```

or:

```text
mark trajectory unavailable
```

or:

```text
continue only when valid field data exists
```

Do not silently clamp the trajectory to the boundary.

---

# 32. SAR Reproducibility

Same inputs must produce the same output.

Inputs include:

```text
starting location
starting time
duration
timestep
dataset
current field
```

Running the simulation twice should produce identical results.

---

# 33. Provenance Tests

Every evidence case should be traceable to its source.

Verify that provenance includes appropriate information such as:

```text
dataset
dataset version/source
requested location
selected location
requested time
selected time
variable
scientific method
calculation version
```

A result without enough provenance should not be presented as fully verified evidence.

---

# 34. Data Adapter Tests

The adapter boundary must be tested independently.

Example:

```text
NetCDFAdapter
      ↓
Observation[]
```

and:

```text
NetCDFAdapter
      ↓
ModelField
```

Verify that adapter output matches the domain contract.

The scientific engine should not depend on raw NetCDF implementation details.

---

# 35. Demo Adapter Tests

The demo adapter may exist for development fallback.

However:

```text
DemoDataAdapter ≠ production scientific source
```

Tests must prevent accidental production usage.

The production configuration must use the real scientific dataset.

---

# 36. API Contract Tests

Test every important endpoint.

Current endpoints include:

```text
GET /api/observations
GET /api/model-field
GET /api/profile
GET /api/sar/drift
```

For each endpoint verify:

- HTTP status
- response schema
- required fields
- units
- null behavior
- error behavior
- timestamp format
- coordinate format

---

# 37. API Error Tests

Test:

```text
missing parameter
invalid parameter
invalid variable
out-of-domain coordinate
unavailable timestamp
invalid observation ID
invalid depth
```

The API should return structured errors.

Example:

```json
{
  "error": {
    "code": "MODEL_MATCH_UNAVAILABLE",
    "message": "No valid model state exists within the configured tolerance."
  }
}
```

Do not expose Python stack traces to users.

---

# 38. Frontend API Contract Tests

Frontend types must match backend responses.

Test:

```text
API response
 ↓
Type validation
 ↓
Application state
 ↓
Visualization
```

A backend change should not silently break scientific visualization.

---

# 39. Request Race Tests

Explicitly test:

```text
request A
request B
request C
```

where A finishes after C.

Expected:

```text
Only C updates current state.
```

This is particularly important for:

- depth
- time
- variable
- observation selection

---

# 40. Cache Tests

Test:

### Cache miss

```text
request
→ backend
→ cache
```

### Cache hit

```text
request
→ cache
→ no unnecessary backend call
```

### Cache invalidation

Changing:

```text
dataset
```

must not reuse incompatible scientific data.

---

# 41. Visualization Tests

Visualization tests should verify:

- layer activation
- layer deactivation
- selected observation state
- depth state
- time state
- current vector visibility
- residual visibility
- trajectory visibility

They should not attempt to numerically verify WebGL pixels for every test.

---

# 42. Three.js Resource Tests

When a field is replaced:

```text
old geometry
old material
old texture
```

must be released.

Repeated:

```text
depth change
→ depth change
→ depth change
→ depth change
```

should not continuously increase GPU resource usage.

---

# 43. Cesium Layer Tests

Verify:

- globe initializes
- basemap initializes
- observations appear
- trajectory appears
- selected marker updates
- scientific overlays can be enabled/disabled

A Cesium failure must not prevent analytical UI from rendering where possible.

---

# 44. Plotly Tests

Verify:

- profile loads
- observation profile appears
- model profile appears
- residual profile appears
- axes use correct units
- depth orientation is correct

Depth should conventionally increase downward in profile views.

---

# 45. UI State Tests

Test:

```text
Explore
 ↓
Evidence
 ↓
Response
```

and invalid transitions.

Example:

A Response scenario should not appear before a valid starting condition exists.

---

# 46. Evidence Workflow Test

Complete workflow:

```text
1. Open application
2. Select observation
3. Load observation metadata
4. Match model
5. Load profile
6. Calculate residual
7. Calculate derived features
8. Inspect current
9. Build evidence case
```

Expected:

Every stage produces a valid state or a clear scientific error.

---

# 47. Scenario Workflow Test

Complete workflow:

```text
Observation
 ↓
Evidence
 ↓
Current field
 ↓
SAR initialization
 ↓
Simulation
 ↓
Trajectory
 ↓
Replay
```

The scenario must inherit:

- correct location
- correct time
- correct dataset
- correct current source

from the evidence state.

---

# 48. Snapshot Tests

A scientific snapshot should be reproducible.

Snapshot should preserve enough information to reconstruct:

```text
location
time
depth
variable
dataset
observation
comparison
derived feature
scenario
```

A snapshot must not depend solely on transient UI state.

---

# 49. Regression Testing

Every scientific bug should result in a regression test.

Example:

```text
Bug:
longitude conversion incorrect at high latitude

Fix:
correct formula

Required:
regression test added
```

Never fix a scientific bug without adding a test where practical.

---

# 50. Property-Based Testing

Property-based testing may be used for mathematical functions.

Examples:

### Current speed

For all finite u/v:

```text
speed >= 0
```

### RMSE

```text
RMSE >= 0
```

### Distance

```text
distance >= 0
```

### Zero residual

If:

```text
observation == model
```

then:

```text
residual == 0
```

---

# 51. Numerical Tolerance

Floating-point scientific calculations should use tolerances.

Avoid:

```python
assert actual == expected
```

Prefer:

```python
assert actual == pytest.approx(expected, rel=1e-6)
```

Tolerance must be appropriate to the calculation.

Do not use excessively loose tolerances simply to make tests pass.

---

# 52. Scientific Invariants

Tests should enforce invariants.

Examples:

```text
Current speed >= 0
Distance >= 0
RMSE >= 0
MAE >= 0
Depth >= 0
Latitude within valid range
Longitude within declared range
```

These tests are inexpensive and catch unexpected failures.

---

# 53. Data Integrity Checks

At startup or validation time verify:

### GLORYS

- expected dimensions
- expected coordinates
- expected variables
- valid timestamps
- valid depth levels
- readable NetCDF structure

### Argo

- valid profile identifiers
- coordinates
- timestamps
- pressure/depth
- temperature
- salinity where available
- QC fields

A corrupted or incomplete dataset should fail clearly.

---

# 54. Dataset Validation Command

Provide a repeatable validation command.

Example:

```bash
python -m backend.validation.validate_datasets
```

Expected output:

```text
GLORYS12V1
✓ File readable
✓ Variables present
✓ Coordinates valid
✓ Time range valid
✓ Depth axis valid

Argo
✓ File readable
✓ Profiles present
✓ Coordinates valid
✓ Temperature present
✓ Pressure present
✓ QC metadata present

DATASET VALIDATION PASSED
```

---

# 55. Scientific Smoke Test

Provide a fast smoke test.

Example:

```bash
python -m backend.validation.smoke_test
```

It should perform:

```text
Load dataset
 ↓
Select known location/time
 ↓
Extract model field
 ↓
Load known observation
 ↓
Match observation
 ↓
Calculate residual
 ↓
Calculate derived feature
 ↓
Run short SAR simulation
```

This should finish quickly enough for development use.

---

# 56. Full Validation Suite

Example:

```bash
pytest
```

Recommended structure:

```text
tests/
├── unit/
│   ├── test_coordinates.py
│   ├── test_currents.py
│   ├── test_profiles.py
│   ├── test_residuals.py
│   ├── test_thermocline.py
│   ├── test_mld.py
│   └── test_sar.py
│
├── integration/
│   ├── test_netcdf_adapter.py
│   ├── test_model_pipeline.py
│   ├── test_observation_pipeline.py
│   └── test_evidence_pipeline.py
│
├── api/
│   ├── test_observations.py
│   ├── test_model_field.py
│   ├── test_profile.py
│   └── test_sar.py
│
└── e2e/
    ├── test_explore.py
    ├── test_evidence.py
    └── test_response.py
```

---

# 57. CI Testing

Every code change should ideally run:

```text
1. lint
2. type checks
3. unit tests
4. integration tests
5. frontend build
```

Example:

```text
Pull Request
     ↓
Lint
     ↓
Tests
     ↓
Build
     ↓
PASS / FAIL
```

Do not require extremely expensive scientific tests on every local edit if they significantly slow development.

---

# 58. Frontend Build Test

The production build must succeed:

```bash
npm run build
```

The build test must catch:

- TypeScript errors
- missing imports
- invalid environment references
- bundling failures
- component errors

---

# 59. Environment Tests

Verify required environment configuration.

Examples:

```text
VITE_CESIUM_ION_ACCESS_TOKEN
VITE_CARTO_API_KEY
```

Remember:

Vite `VITE_*` values are client-visible.

They must never be treated as server secrets.

Copernicus credentials must never be exposed to the frontend.

---

# 60. Secret-Safety Test

Repository checks should ensure:

- no Copernicus password
- no Copernicus token
- no private API credentials
- no `.env` committed
- no credentials embedded in source

Example:

```bash
git status
git ls-files .env
```

The expected result is that `.env` is not tracked.

---

# 61. Git Data-Safety Check

Scientific NetCDF files should remain excluded according to repository policy.

Verify:

```text
*.nc
*.nc4
*.cdf
```

are ignored where intended.

Python cache files should also remain ignored:

```text
__pycache__/
*.pyc
```

This prevents accidental repository bloat.

---

# 62. Performance Regression Tests

Performance tests should monitor:

- API response time
- payload size
- model subset extraction time
- profile extraction time
- SAR calculation time

The objective is to detect significant regressions.

Do not enforce arbitrary microsecond-level requirements.

---

# 63. Visual Regression

Visual regression can be used selectively for:

- application shell
- profile charts
- evidence panel
- response timeline
- scientific legends

Avoid brittle pixel-perfect tests for dynamic 3D scenes.

Cesium and WebGL rendering can vary between hardware and browsers.

---

# 64. Accessibility Testing

Verify:

- keyboard navigation
- focus visibility
- semantic buttons
- readable contrast
- chart labels
- non-color-only scientific meaning
- tooltip accessibility
- reduced-motion behavior

Scientific information should not depend solely on color.

Example:

Residual:

```text
color
+
signed numeric value
```

not color alone.

---

# 65. Reduced Motion

If the user prefers reduced motion:

```text
prefers-reduced-motion
```

the application should reduce:

- UI transitions
- camera animations
- marker animation

Scientific functionality must remain available.

---

# 66. Error-State Testing

Every major operation should have:

```text
Loading
Success
Empty
Error
```

states.

Example:

```text
Model field

Loading
↓
Success

or

Loading
↓
No valid data

or

Loading
↓
Error
```

Do not assume every API call succeeds.

---

# 67. Empty-State Testing

Examples:

### No observation

```text
No observations in selected region/time.
```

### No model match

```text
No model state available within the configured matching tolerance.
```

### No residual

```text
Residual unavailable because either observation or model value is missing.
```

These states should be scientifically precise.

---

# 68. Demo Scenario Fixture

Maintain one known demo scenario.

Example:

```text
Region:
Bay of Bengal

Observation:
known Argo float

Time:
January 2024

Model:
GLORYS12V1

Variable:
temperature

Depth:
selected analytical depth
```

The exact fixture should be stored in configuration/test data rather than hardcoded across UI components.

---

# 69. Judge Demo Acceptance

The official demo path must satisfy:

```text
Application opens
        ↓
3D ocean view visible
        ↓
Real model field visible
        ↓
Argo observations visible
        ↓
Observation selected
        ↓
Model match visible
        ↓
Profile comparison visible
        ↓
Residual visible
        ↓
Derived scientific feature visible
        ↓
Current field visible
        ↓
SAR scenario launched
        ↓
Trajectory replayed
        ↓
Provenance shown
```

No fake data should be introduced to make this flow work.

---

# 70. Demo Recovery

The demo should have a recovery strategy if an external dependency fails.

Examples:

### Basemap unavailable

Scientific visualization should remain usable if technically possible.

### API temporarily unavailable

Show a clear error.

### Optional advanced layer unavailable

Keep core analysis functional.

### WebGL unavailable

Provide a clear fallback message rather than a blank screen.

---

# 71. Scientific Claim Validation

Any statement shown by the application should be traceable to a calculation.

For example:

```text
"Strong thermal transition detected"
```

must correspond to a defined derived feature.

Avoid vague AI-generated statements such as:

```text
"This area looks dangerous."
```

unless a documented scientific rule defines the statement.

---

# 72. Intelligence Testing

If a future intelligence layer is introduced, it must be tested against deterministic scientific inputs.

Example:

```text
Input:
thermocline depth
residual
current speed
observation separation

Output:
explanation
```

The explanation must reference actual inputs.

No unsupported conclusion should be generated.

---

# 73. No Hallucinated Science

The application must never:

- invent measurements
- invent observations
- invent current vectors
- invent model values
- invent uncertainty
- invent SAR trajectories
- invent provenance

If information is unavailable:

```text
Unavailable
```

is preferable to fabricated completeness.

---

# 74. Scientific Reproducibility

A scientific result should be reproducible from:

```text
Dataset
+
Coordinates
+
Time
+
Depth
+
Variable
+
Method
+
Configuration
```

For derived results, store enough metadata to reconstruct the calculation.

---

# 75. Validation Report

For major milestones, generate a concise validation report.

Example:

```text
NIRIKSHAN Scientific Validation
--------------------------------

Dataset:
GLORYS12V1

Region:
Bay of Bengal

Time:
2024-01-01 → 2024-01-10

Observations:
19 floats
2740 measurements

Model variables:
thetao
uo
vo

Validation:
✓ Dataset readable
✓ Coordinate matching
✓ Time matching
✓ Profile extraction
✓ Residual calculation
✓ Current calculation
✓ SAR integration
✓ API contract
✓ Frontend build
```

---

# 76. Test Naming Convention

Use descriptive names.

Bad:

```python
test_model()
```

Good:

```python
test_nearest_model_coordinate_is_reported_for_argo_observation()
```

Scientific tests should communicate what scientific rule they protect.

---

# 77. Test Failure Messages

Failures should explain scientific context.

Bad:

```text
AssertionError
```

Better:

```text
Expected nearest model depth to be 100m,
selected 150m for observation depth 102m.
```

This makes debugging much faster.

---

# 78. Development Workflow

Every scientific feature should follow:

```text
1. Define scientific rule
2. Write unit test
3. Implement calculation
4. Run unit test
5. Validate against real data
6. Add integration test
7. Expose API
8. Test API
9. Connect visualization
10. Run end-to-end test
```

Do not begin with visual implementation alone.

---

# 79. Bug-Fixing Workflow

When a bug is found:

```text
Bug
 ↓
Reproduce
 ↓
Identify layer
 ↓
Write regression test
 ↓
Fix
 ↓
Run regression test
 ↓
Run related suite
 ↓
Build
```

Do not rely on manually checking the UI after every scientific bug.

---

# 80. Definition of Done

Testing and validation is complete when:

- [ ] Scientific unit tests exist for core calculations.
- [ ] Coordinate matching is tested.
- [ ] Time matching is tested.
- [ ] Variable mapping is tested.
- [ ] Residual convention is tested.
- [ ] Current speed/direction are tested.
- [ ] Thermocline calculation is tested.
- [ ] MLD calculation is tested where implemented.
- [ ] SAR integration is tested.
- [ ] Missing values are tested.
- [ ] QC behavior is tested.
- [ ] Real GLORYS data is covered by integration tests.
- [ ] Real Argo data is covered by integration tests.
- [ ] API contracts are tested.
- [ ] Request race conditions are tested.
- [ ] Cache behavior is tested.
- [ ] Three.js resource cleanup is tested or manually verified.
- [ ] Frontend production build succeeds.
- [ ] Dataset validation command succeeds.
- [ ] Scientific smoke test succeeds.
- [ ] Demo workflow succeeds from a clean state.
- [ ] No scientific result is fabricated when data is unavailable.
- [ ] Provenance is preserved.
- [ ] Major scientific bugs have regression tests.

---

# 81. Final Testing Principle

NIRIKSHAN should be judged by two separate questions:

### Does it work?

The software must:

- load
- render
- respond
- calculate
- simulate
- recover from errors

### Is what it shows trustworthy?

The system must:

- identify its source
- expose matching decisions
- preserve units
- preserve missing values
- explain derived calculations
- maintain provenance
- reproduce results

The final standard is:

> **A beautiful visualization is not enough. Every important scientific result must be testable, traceable, and reproducible.**
```
