# `03_SCIENTIFIC_ENGINE.md`

This is the document where we lock down the **actual science** behind NIRIKSHAN.

The most important rule for the AI agent is:

> **Never implement a scientifically meaningful number just because it looks good in the UI. Every derived result must have a defined input, method, validity rule, and provenance.**

Copy this into:

```text
docs/03_SCIENTIFIC_ENGINE.md
```

```md
# NIRIKSHAN
## Scientific Engine Specification

### 3D Ocean Analysis & Response Workspace

> SEE → VERIFY → UNDERSTAND → RESPOND

**SIH Problem Statement:** SIH26067  
**Organization:** Ministry of Earth Sciences (MoES)  
**Department:** Indian National Centre for Ocean Information Services (INCOIS)  
**Theme:** Disaster Management  
**Team:** ZWP

---

# 1. Purpose

This document defines the scientific computation layer of NIRIKSHAN.

The Scientific Engine is responsible for converting ocean model and observation data into scientifically meaningful, traceable analytical results.

It defines:

- coordinate handling
- temporal matching
- vertical handling
- model sampling
- observation sampling
- model-observation comparison
- residual calculations
- statistical metrics
- current calculations
- vertical gradients
- thermocline estimation
- mixed-layer depth estimation
- current shear
- anomaly handling
- data-quality rules
- missing-value handling
- SAR drift integration
- uncertainty principles
- validation
- provenance

The Scientific Engine must remain independent from:

- React
- Cesium
- Three.js
- Plotly
- UI components
- CSS
- browser rendering

---

# 2. Scientific Philosophy

NIRIKSHAN must treat scientific computation as a first-class subsystem.

The system should follow:

```text
SOURCE DATA
     ↓
VALIDATION
     ↓
NORMALIZATION
     ↓
SAMPLING / MATCHING
     ↓
CALCULATION
     ↓
VALIDATION
     ↓
PROVENANCE
     ↓
VISUALIZATION
```

Never:

```text
UI
 ↓
invent calculation
 ↓
display number
```

---

# 3. Scientific Source Types

The Scientific Engine must distinguish between three fundamental classes of information.

## 3.1 Observation

A measurement originating from an instrument or observational dataset.

Examples:

- Argo
- Glider
- CTD
- BGC

Observation values must never be silently replaced with model values.

---

## 3.2 Model

A value produced by a numerical ocean model or reanalysis.

Current development model:

```text
GLORYS12V1
```

Current variables:

```text
thetao
uo
vo
```

---

## 3.3 Derived

A value calculated by NIRIKSHAN.

Examples:

```text
current speed
current direction
temperature gradient
thermocline depth
mixed-layer depth
RMSE
bias
residual
drift trajectory
```

Derived values must identify their inputs and method.

---

# 4. Scientific Data Currently Available

The current prototype contains:

```text
GLORYS12V1
```

with:

```text
time      = 10
depth     = 50
latitude  = 241
longitude = 301
```

Spatial domain:

```text
5°N → 25°N
75°E → 100°E
```

Temporal domain:

```text
2024-01-01T00:00:00
→
2024-01-10T00:00:00
```

Variables:

```text
thetao
uo
vo
```

---

# 5. Vertical Coordinates

The GLORYS dataset contains 50 vertical levels.

The model depth values are not assumed to be evenly spaced.

The Scientific Engine must use the actual dataset depth coordinate.

Example:

```text
0.494 m
...
...
5727.9 m
```

The exact depth values must always be obtained from the dataset rather than hardcoded.

---

# 6. Depth Rule

Never assume:

```text
depth = array index
```

Instead:

```text
depth coordinate
    ↓
actual physical depth
```

For example:

```text
level 0
≠
0 meters by assumption
```

The system must use the actual model coordinate.

---

# 7. Depth Selection

For a requested depth:

```text
z_requested
```

the engine may initially select the nearest available model depth:

```text
z_model = argmin(|z_i - z_requested|)
```

The result must include:

```text
requested depth
actual selected depth
selection method
```

Example:

```text
Requested:
80 m

Selected model level:
81.5 m

Method:
nearest neighbour
```

This prevents users from believing that the model contains an exact 80 m level when it does not.

---

# 8. Future Vertical Interpolation

The architecture should support vertical interpolation.

Possible methods:

```text
nearest neighbour
linear interpolation
```

Interpolation must only occur when:

- surrounding valid data exists
- the method is explicitly selected
- the resulting value remains within scientifically valid bounds

The method must be recorded.

---

# 9. Horizontal Coordinates

Model coordinates must be treated as geographic coordinates.

The engine must preserve:

```text
latitude
longitude
```

and correctly handle the relationship between:

```text
longitude
latitude
```

and geographic distance.

---

# 10. Spatial Selection

For an observation:

```text
lat_o
lon_o
```

the initial implementation uses nearest-neighbour model selection.

Conceptually:

```text
lat_model = nearest(lat_o)
lon_model = nearest(lon_o)
```

The selected coordinates must remain available for provenance.

---

# 11. Spatial Matching Metadata

A matched model result should record:

```text
observation latitude
observation longitude

selected model latitude
selected model longitude

latitude difference
longitude difference

matching method
```

Example:

```text
Observation:
15.00°N
85.00°E

Model:
15.00°N
85.00°E

Method:
nearest neighbour
```

---

# 12. Temporal Coordinates

Model and observation timestamps must be handled explicitly.

The engine must normalize timestamps to a common representation.

Recommended internal representation:

```text
UTC
```

The system must not silently compare:

```text
local time
```

against:

```text
UTC
```

---

# 13. Temporal Matching

For an observation timestamp:

```text
t_o
```

the initial implementation uses nearest model timestep:

```text
t_model = argmin(|t_i - t_o|)
```

The result must include:

```text
requested timestamp
selected timestamp
time difference
matching method
```

---

# 14. Temporal Tolerance

The engine should define a maximum acceptable temporal difference.

If the nearest model timestep is too far from the observation time, the comparison should be marked:

```text
INSUFFICIENT TEMPORAL MATCH
```

rather than silently treating the data as equivalent.

The exact tolerance should be configurable.

---

# 15. Spatial Tolerance

Likewise, the engine should support a maximum spatial separation.

Example:

```text
observation
     ↓
nearest model cell
     ↓
distance
     ↓
within acceptable tolerance?
```

If not:

```text
LOW MATCH CONFIDENCE
```

or equivalent transparent status.

This is not a probabilistic confidence score.

It is a documented matching-quality indicator.

---

# 16. Matching Quality

Matching quality should consider:

```text
spatial separation
temporal separation
depth separation
data validity
```

The UI may summarize this as:

```text
GOOD MATCH
LIMITED MATCH
INSUFFICIENT MATCH
```

but the underlying distances and thresholds must remain available.

Do not create an arbitrary numerical "confidence percentage."

---

# 17. Model Variable Mapping

The engine must maintain a source-to-domain mapping.

Example:

```text
thetao
    ↓
temperature

uo
    ↓
eastward current

vo
    ↓
northward current
```

Units must come from dataset metadata whenever available.

Do not hardcode units if the source provides them.

---

# 18. Temperature

The model temperature variable is:

```text
thetao
```

The engine must preserve the source variable identity.

Domain representation:

```text
temperature
```

with source:

```text
thetao
```

The UI may display:

```text
Temperature
```

while provenance retains:

```text
GLORYS12V1 / thetao
```

---

# 19. Current Components

Current velocity consists of:

```text
u = eastward component
v = northward component
```

For the current model:

```text
uo → u
vo → v
```

---

# 20. Current Speed

Current speed is:

```text
speed = sqrt(u² + v²)
```

Units must be preserved from the source.

If:

```text
u = m/s
v = m/s
```

then:

```text
speed = m/s
```

---

# 21. Current Direction

Direction should be calculated from the vector components.

The system must clearly define its directional convention.

Recommended convention:

```text
direction of motion
```

rather than meteorological "coming-from" direction.

The UI must label the convention appropriately.

---

# 22. Current Vector Validation

Before calculating speed:

```text
if u is invalid
or v is invalid
```

then:

```text
speed = invalid
direction = invalid
```

Do not convert missing current components to zero.

---

# 23. Temperature Gradient

Vertical temperature gradient:

```text
dT/dz
```

must be calculated using actual physical depth differences.

Do not calculate using array indices.

For adjacent valid points:

```text
dT/dz =
(T₂ - T₁) / (z₂ - z₁)
```

The depth units must be consistent.

---

# 24. Gradient Interpretation

A strong temperature gradient can indicate a transition in water-column structure.

However:

> A temperature gradient alone must not automatically be described as a thermocline without applying the selected thermocline criterion.

This distinction is important.

---

# 25. Thermocline

The Scientific Engine may calculate thermocline depth.

The exact algorithm must be explicit and configurable.

Possible methods include:

```text
maximum temperature gradient
threshold temperature gradient
```

The selected method must be recorded.

Example output:

```text
Thermocline depth:
76 m

Method:
maximum |dT/dz|

Valid depth range:
0–300 m
```

---

# 26. Thermocline Search Window

The system should not automatically search the entire water column for every use case.

A configurable search range may be used.

Example:

```text
0–300 m
```

This can prevent deep unrelated gradients from being incorrectly identified as the main thermocline.

The chosen range must be visible in provenance.

---

# 27. Thermocline Validity

Thermocline detection should require sufficient valid temperature samples.

If insufficient valid data exists:

```text
Thermocline:
NOT AVAILABLE
```

rather than generating a value.

---

# 28. Mixed Layer Depth

Mixed Layer Depth (MLD) should be implemented only using a documented scientific criterion.

Possible approaches include:

```text
temperature threshold
density threshold
```

The selected criterion must be configurable.

---

# 29. Temperature-Threshold MLD

If a temperature-based criterion is used:

```text
T_reference
```

is selected at a reference depth.

Then the MLD is the first depth where:

```text
|T(z) - T_reference| >= threshold
```

The threshold must be documented.

Example:

```text
Reference depth:
10 m

Temperature threshold:
0.2°C

MLD:
42 m
```

The exact threshold should not be hardcoded without documentation.

---

# 30. Density-Based MLD

If salinity is later available:

```text
density
```

may provide a more physically robust MLD calculation.

This is future capability unless density is actually available in the current dataset.

Do not infer density from unavailable variables.

---

# 31. Current Shear

Vertical current shear can be calculated from:

```text
du/dz
dv/dz
```

Magnitude:

```text
shear =
sqrt(
  (du/dz)² +
  (dv/dz)²
)
```

The exact units must be preserved.

---

# 32. Current Shear Validity

Shear requires:

```text
u(z1)
u(z2)
v(z1)
v(z2)
```

to all be valid.

If one component is missing:

```text
shear = invalid
```

for that interval.

---

# 33. Residual

For a measured observation:

```text
O
```

and corresponding model value:

```text
M
```

define:

```text
residual = O - M
```

This convention must remain consistent across the product.

---

# 34. Residual Interpretation

Under the convention:

```text
residual = observation - model
```

then:

```text
positive residual
→ observation > model

negative residual
→ observation < model
```

The UI must communicate this convention.

---

# 35. Absolute Error

Absolute error:

```text
absolute_error = |O - M|
```

This may be used for:

- summaries
- MAE
- visual magnitude

but must not replace the signed residual when direction of error matters.

---

# 36. Bias

For N valid matched observations:

```text
bias =
mean(O - M)
```

The sign convention must remain:

```text
positive → model tends to be lower
negative → model tends to be higher
```

---

# 37. MAE

Mean Absolute Error:

```text
MAE =
mean(|O - M|)
```

Only valid matched points are included.

---

# 38. RMSE

Root Mean Square Error:

```text
RMSE =
sqrt(
  mean((O - M)²)
)
```

Only valid matched points are included.

The number of valid points must be returned.

Example:

```text
RMSE:
0.38°C

Valid points:
42
```

---

# 39. Correlation

Correlation may be calculated when sufficient matched samples exist.

The system must not report correlation when:

- too few samples exist
- one series is constant
- values are invalid

Instead:

```text
Correlation:
NOT AVAILABLE
```

---

# 40. Comparison Validity

A model-observation comparison is valid only where:

```text
observation valid
AND
model valid
AND
spatial match valid
AND
temporal match valid
AND
variable compatible
```

---

# 41. Validity Mask

Every comparison should internally maintain a validity mask.

Conceptually:

```text
depth
value
valid
```

Example:

```text
0m     valid
10m    valid
20m    valid
30m    invalid
40m    valid
```

Invalid values must not contaminate statistics.

---

# 42. Profile Alignment

Observation and model profiles may contain different depth coordinates.

Example:

```text
Observation:
0
10
20
35
50
75
100

Model:
0.5
5
10
20
30
50
75
100
125
```

The engine must not pretend they are naturally aligned.

It must explicitly select or interpolate.

---

# 43. Profile Matching Modes

Supported conceptual modes:

```text
nearest depth
linear interpolation
```

The initial MVP may use:

```text
nearest model level
```

for transparency and simplicity.

---

# 44. Interpolation Safety

Interpolation must not cross large gaps blindly.

Example:

```text
valid
   │
large missing region
   │
valid
```

The engine should not create a smooth scientific profile across an unsupported gap.

---

# 45. Missing Values

Rules:

```text
NaN remains NaN
missing remains missing
invalid QC remains excluded
```

Never:

```text
NaN → 0
missing → nearest valid value
```

without an explicit scientific reason.

---

# 46. Quality Control

Observation datasets may contain quality-control flags.

The engine should preserve them.

Where a source defines a QC scheme, the source definition takes precedence.

Potential normalized states:

```text
GOOD
CAUTION
BAD
UNKNOWN
```

The mapping must be documented.

---

# 47. QC Filtering

The comparison engine should allow a policy such as:

```text
accepted:
GOOD
```

or:

```text
accepted:
GOOD + source-defined acceptable flags
```

The policy must be explicit.

---

# 48. Observation Provenance

For every observation profile, retain:

```text
source
platform ID
profile/time information
variable
units
QC
location
depth
```

Where available.

---

# 49. Model Provenance

For every model result, retain:

```text
dataset
dataset version
variable
timestamp
selected coordinates
selected depth
matching method
```

---

# 50. Derived Provenance

For a derived value:

```text
derived feature
```

must include:

```text
inputs
algorithm
parameters
validity
source data
```

Example:

```text
Thermocline:
76 m

Input:
thetao

Method:
maximum vertical temperature gradient

Search range:
0–300 m
```

---

# 51. Evidence Provenance

A complete evidence result should be able to answer:

```text
Where did the observation come from?
Where did the model come from?
How were they matched?
How was the residual calculated?
How was the derived feature calculated?
```

---

# 52. Observation-Model Spatial Distance

The engine should calculate physical distance between:

```text
observation position
```

and:

```text
model grid point
```

A geographic distance formula should be used.

For short distances, an appropriate local approximation may be used.

For general geographic distances, use a spherical/geodesic method.

---

# 53. Why Distance Matters

An observation located:

```text
1 km
```

from a model point is different from one located:

```text
180 km
```

away.

The system should expose this distinction.

It should never imply that every observation is a direct measurement of the exact model cell.

---

# 54. Observation Coverage

For a selected location, the engine may calculate:

```text
nearest observation distance
observation count
observation types
time proximity
```

This provides context for evidence strength.

---

# 55. Coverage Categories

Possible normalized categories:

```text
DIRECT
NEARBY
SPARSE
NONE
```

Definitions must be based on explicit thresholds.

Thresholds must be configurable.

---

# 56. Anomaly

An anomaly is only valid relative to a defined reference.

Conceptually:

```text
anomaly =
value - reference
```

The reference may be:

- climatology
- long-term mean
- baseline dataset
- previous period

NIRIKSHAN must not use the term "anomaly" without defining the reference.

---

# 57. Current Field Sampling

The response engine must obtain current vectors from the same model state used by the visualization.

For example:

```text
selected time
selected depth
selected region
```

must correspond to the current data used by SAR.

---

# 58. SAR Scientific Principle

The SAR prototype must use:

```text
actual model uo
+
actual model vo
```

rather than:

```text
synthetic direction
+
random drift
```

This creates consistency between:

```text
visualized ocean
```

and:

```text
simulated response
```

---

# 59. SAR Model

Initial model:

```text
passive particle drift
```

with deterministic integration.

For a particle at:

```text
latitude φ
longitude λ
```

and velocity:

```text
u
v
```

the engine converts physical displacement to geographic displacement.

---

# 60. Earth Radius

A spherical Earth approximation may use:

```text
R ≈ 6,371,000 m
```

unless a more appropriate geodesic implementation is introduced.

The chosen constant/method must be documented.

---

# 61. Geographic Conversion

For small time steps:

```text
dlat ≈ v * dt / R
```

and longitude displacement must account for latitude:

```text
dlon ≈ u * dt / (R * cos(latitude))
```

The implementation must use radians internally where required.

---

# 62. Euler Integration

Initial trajectory integration:

```text
position(t + dt)
=
position(t)
+
velocity(t) * dt
```

This is simple, deterministic and suitable for the initial prototype.

---

# 63. SAR Time Step

Initial implementation:

```text
dt = 1 hour
```

for:

```text
72 hours
```

The timestep should be configurable.

---

# 64. SAR Current Sampling

At every step:

```text
current =
sample(u, v, time, location, depth)
```

Then:

```text
particle
 ↓
current
 ↓
new position
```

This is preferable to using one constant velocity for the entire trajectory.

---

# 65. SAR Temporal Evolution

If model timesteps are available:

```text
t0
t1
t2
...
```

the trajectory should use the appropriate model current at each simulation time.

If the requested simulation exceeds the available dataset:

```text
simulation cannot continue reliably
```

The system must communicate the limitation.

It must not silently repeat the final current indefinitely unless that behaviour is explicitly selected and labeled.

---

# 66. SAR Spatial Boundaries

If the simulated trajectory leaves the model domain:

```text
5–25°N
75–100°E
```

the engine must detect it.

Possible result:

```text
OUTSIDE MODEL DOMAIN
```

The UI should explain that further physical simulation is unavailable from the current dataset.

---

# 67. SAR Trajectory Metadata

Every scenario must retain:

```text
start position
start time
duration
depth
model
current variables
timestep
integration method
model domain
```

---

# 68. SAR Limitations

The initial prototype is not a complete operational SAR prediction system.

It does not necessarily model:

- windage
- object-specific leeway
- waves
- Stokes drift
- uncertainty ensembles
- atmospheric forcing
- bathymetric effects
- coastline interaction
- operational search patterns

These limitations must be stated.

---

# 69. Future SAR Ensemble

A future response engine may simulate:

```text
particle 1
particle 2
particle 3
...
particle N
```

with parameter variation.

The resulting spread can provide an uncertainty corridor.

This should only be implemented after deterministic drift is validated.

---

# 70. Uncertainty Philosophy

NIRIKSHAN must not manufacture an uncertainty value merely to make the interface look advanced.

Uncertainty should come from:

- known data limitations
- model-observation differences
- parameter ranges
- ensemble simulation
- measurement uncertainty

when those inputs are actually available.

---

# 71. Scientific Confidence vs UI Confidence

Avoid arbitrary:

```text
92% confidence
```

unless a scientifically defensible probability model exists.

Prefer transparent statements:

```text
Spatial match:
12 km

Temporal difference:
6 h

Observation support:
2 nearby profiles

Model coverage:
available
```

This allows the user to form an informed assessment.

---

# 72. Numerical Stability

Scientific calculations must validate:

- finite values
- realistic coordinate ranges
- valid depth ordering
- non-zero depth intervals
- valid time ordering

Before numerical operations.

---

# 73. Division Safety

Never divide by:

```text
0
```

Examples:

```text
dz = 0
cos(latitude) ≈ 0
```

must be handled safely.

---

# 74. Latitude Boundary

Longitude displacement calculation contains:

```text
cos(latitude)
```

Near the poles, this approaches zero.

Although the current Indian Ocean domain is far from the poles, the engine must still avoid undefined calculations.

---

# 75. Coordinate Normalization

Internally use a consistent convention:

```text
latitude:
degrees north

longitude:
degrees east

depth:
meters positive downward

time:
UTC
```

If source data uses another convention, normalize it at the adapter boundary.

---

# 76. Longitude Convention

The engine must understand whether a dataset uses:

```text
0–360°
```

or:

```text
-180–180°
```

and normalize appropriately.

This must be handled in the adapter.

---

# 77. Latitude Ordering

Do not assume latitude is ascending.

The adapter must inspect the coordinate.

The same applies to:

```text
longitude
depth
time
```

---

# 78. Depth Ordering

Do not assume:

```text
depth = ascending
```

or:

```text
depth = descending
```

The engine should normalize or correctly handle the actual order.

---

# 79. Time Ordering

The engine must inspect time coordinates.

If time is not monotonic, the dataset should be normalized or rejected with a clear error.

---

# 80. Unit Handling

Units must be taken from dataset metadata when possible.

Examples:

```text
temperature → °C
velocity → m/s
depth → m
```

The engine should normalize units before calculations when source datasets differ.

---

# 81. Unit Conversion

If a future dataset provides:

```text
temperature in Kelvin
```

the adapter/science normalization layer must convert it before comparison.

The original source unit should remain in provenance.

---

# 82. Scientific Domain Validation

Before accepting a value, the engine may perform sanity checks.

Example:

```text
latitude ∈ [-90, 90]
longitude ∈ valid range
depth >= 0
```

Physical-value validation must be conservative.

Do not reject unusual ocean values merely because they appear unexpected unless a scientifically justified bound exists.

---

# 83. Outlier Handling

The engine must not automatically remove outliers simply because they differ strongly from the model.

A model-observation difference may itself be scientifically important.

Outlier removal requires:

- source QC
- documented scientific criterion
- explicit method

---

# 84. Model-Observation Mismatch as Information

A residual is not automatically a failure.

It may indicate:

- model limitations
- observation timing differences
- spatial mismatch
- unresolved physical structure
- observational uncertainty
- genuine ocean variability

The UI should avoid language such as:

```text
MODEL WRONG
```

unless supported by a rigorous validation framework.

Prefer:

```text
MODEL–OBSERVATION DIFFERENCE
```

---

# 85. Evidence Classification

A comparison may be described using:

```text
MATCH
MODERATE DIFFERENCE
LARGE DIFFERENCE
```

only if thresholds are scientifically defined.

Avoid arbitrary labels.

The raw residual should always remain accessible.

---

# 86. Scientific Feature Registry

Derived algorithms should be registered centrally.

Conceptual:

```text
FeatureRegistry
├── current_speed
├── current_direction
├── temperature_gradient
├── thermocline
├── mixed_layer_depth
└── current_shear
```

Each feature should define:

```text
name
inputs
units
algorithm
parameters
validity
provenance
```

This prevents scientific logic from being scattered throughout the codebase.

---

# 87. Feature Contract

Conceptually:

```python
class ScientificFeature:

    name: str

    def compute(
        profile,
        parameters
    ) -> DerivedFeature:
        ...
```

The implementation may use functions/classes as appropriate.

The important requirement is standardized inputs and outputs.

---

# 88. Science Engine API

Potential internal services:

```text
sampling.py
matching.py
residuals.py
statistics.py
currents.py
thermocline.py
mixed_layer.py
shear.py
drift.py
coverage.py
provenance.py
```

Do not create all modules prematurely.

Introduce them when their functionality is implemented.

---

# 89. Scientific Result Object

Every result should ideally contain:

```text
value
units
valid
method
inputs
provenance
warnings
```

Example:

```json
{
  "value": 76.0,
  "units": "m",
  "valid": true,
  "method": "maximum_temperature_gradient",
  "warnings": []
}
```

---

# 90. Scientific Warnings

Results may contain warnings such as:

```text
TEMPORAL_MISMATCH
SPATIAL_MISMATCH
SPARSE_OBSERVATION
MISSING_DEPTHS
INSUFFICIENT_DATA
OUTSIDE_MODEL_DOMAIN
```

Warnings must not be hidden.

---

# 91. Reproducibility

A scientific result should be reproducible from:

```text
dataset
variable
coordinates
time
depth
method
parameters
```

This is a major principle of NIRIKSHAN.

---

# 92. Determinism

For identical:

```text
inputs
dataset
algorithm
parameters
```

the Scientific Engine should return the same result.

Randomness must not be introduced unless explicitly required.

---

# 93. Scientific Cache Safety

Cache keys must include all parameters that affect a result.

For example, thermocline results must include:

```text
dataset
profile
search range
algorithm
threshold
```

Do not reuse a cached result calculated with different parameters.

---

# 94. Validation Strategy

Scientific algorithms should be validated with known synthetic profiles.

Example thermocline test:

```text
0–40 m:
weak temperature gradient

40–80 m:
strong temperature gradient

80–200 m:
weak gradient
```

Expected thermocline should occur in the strong-gradient region.

---

# 95. Synthetic Test Data

Synthetic data is allowed for testing.

It must never be presented as real ocean observations.

Test fixtures should be clearly labeled.

---

# 96. Unit Test Example — Residual

Given:

```text
observation = 28.0
model = 27.5
```

expected:

```text
residual = +0.5
```

---

# 97. Unit Test Example — Current Speed

Given:

```text
u = 3
v = 4
```

expected:

```text
speed = 5
```

---

# 98. Unit Test Example — Drift

Given:

```text
constant eastward current
u > 0
v = 0
```

the trajectory should move eastward monotonically.

It must not move randomly.

---

# 99. Integration Test

A complete scientific test should execute:

```text
Argo observation
      ↓
model matching
      ↓
model profile
      ↓
residual
      ↓
RMSE
      ↓
thermocline
      ↓
provenance
```

and verify that every result is internally consistent.

---

# 100. Scientific Regression Testing

When a scientific algorithm changes, regression tests should detect unexpected changes in:

- residual values
- thermocline depth
- MLD
- current speed
- trajectory

The expected numerical tolerance must be documented.

---

# 101. Dataset Regression Testing

The system should verify that the dataset still contains:

```text
thetao
uo
vo
```

and expected:

```text
time
depth
latitude
longitude
```

before starting the scientific workflow.

---

# 102. Dataset Integrity

At startup or ingestion time, validate:

```text
file exists
file readable
dimensions present
coordinates valid
required variables present
units available
```

If validation fails, the application should explain the problem.

---

# 103. Dataset Capability Discovery

The engine should expose:

```text
available variables
time range
depth range
spatial range
```

rather than assuming all datasets support the same capabilities.

---

# 104. Scientific Feature Availability

For example:

If:

```text
thetao
```

exists:

```text
temperature
thermocline
```

may be available.

If:

```text
uo + vo
```

exist:

```text
current speed
current direction
drift
```

may be available.

If:

```text
salinity
```

does not exist:

```text
salinity analysis
```

must not be exposed as available.

---

# 105. Scientific Capability Matrix

Conceptually:

```text
                  GLORYS
Temperature          ✓
Currents             ✓
Salinity             —
Thermocline          ✓
MLD                  ✓*
Current shear        ✓
SAR drift            ✓
Density MLD          —
```

`✓*` means only if the selected temperature-based MLD criterion is supported.

The frontend should derive feature availability from backend capability metadata.

---

# 106. No Hidden Scientific Assumptions

Avoid assumptions such as:

```text
all observations are surface observations
all models have hourly data
all depths are evenly spaced
all coordinates are ascending
all models use the same units
```

All of these must be discovered or explicitly configured.

---

# 107. Scientific Performance

The Science Engine should avoid repeatedly scanning the entire dataset.

Preferred:

```text
request
 ↓
subset
 ↓
calculate
```

rather than:

```text
entire dataset
 ↓
calculate everything
 ↓
return tiny result
```

---

# 108. Lazy Data Access

xarray should be used in a way that allows efficient access to subsets.

Avoid unnecessary:

```python
.values
```

on entire multi-dimensional datasets.

Only materialize the required subset.

---

# 109. Memory Rule

Never load the entire large scientific archive into memory solely to answer:

```text
one profile
```

or:

```text
one depth slice
```

---

# 110. Scientific API Latency

The target for normal analytical requests is approximately:

```text
simple subset:
< 1–2 seconds

profile comparison:
< 2 seconds

derived analysis:
< 3 seconds
```

These are engineering targets.

Actual performance depends on:

- hardware
- dataset
- request size
- deployment
- cache state

---

# 111. Backend Dataset Lifecycle

A dataset manager may maintain open xarray datasets.

It must consider:

- application startup
- shutdown
- process model
- thread safety
- file handles
- memory usage

Do not introduce global dataset objects without understanding the deployment model.

---

# 112. Concurrency

Multiple requests may access the same dataset.

The implementation must avoid:

- unsafe mutation
- corrupted state
- unnecessary duplicate dataset loading

If necessary, use read-only dataset access patterns.

---

# 113. Scientific State Consistency

A model profile and model field shown for the same analysis must correspond to:

```text
same dataset
same timestamp
same variable
same spatial state
```

unless the user explicitly changes one of those dimensions.

---

# 114. Cross-Component Consistency

Example:

If the user selects:

```text
06 Jan 2024
80 m
temperature
```

then:

```text
globe
profile
water-column lens
residual
```

should reflect the same state.

---

# 115. Response Consistency

If SAR is launched from:

```text
06 Jan 2024
surface
15°N
85°E
```

the current visualization should be able to reproduce the starting current state.

This is critical for scientific trust.

---

# 116. Evidence Case Identity

Each selected evidence case should have a stable internal identity.

Conceptually:

```text
EvidenceCase
=
observation_id
+
time
+
dataset
```

This allows:

- replay
- caching
- snapshots
- debugging
- testing

---

# 117. Scientific Snapshot Identity

A complete analysis state may be represented by:

```text
dataset
time
depth
variable
location
observation
mode
```

This allows the interface to restore the same state.

---

# 118. Future Multi-Model Support

The Scientific Engine should eventually support:

```text
Model A
Model B
Observation
```

and:

```text
Model A
vs
Model B
vs
Observation
```

The current MVP only requires one primary model.

---

# 119. Future Observation Types

The observation abstraction should eventually support:

```text
Argo
Glider
CTD
BGC
Mooring
ADCP
HF Radar
```

without changing the fundamental Evidence workflow.

---

# 120. Future Derived Features

Potential future scientific algorithms:

```text
eddy detection
water-mass classification
stratification
potential density
spiciness
front detection
upwelling indicators
marine heat events
```

These require appropriate variables and scientifically validated methods.

Do not implement them merely for feature count.

---

# 121. Scientific Intelligence

If an intelligence layer is eventually added, it must consume Scientific Engine outputs.

Architecture:

```text
Scientific Engine
      ↓
Structured evidence
      ↓
Interpretation layer
      ↓
Human-readable explanation
```

Never:

```text
LLM
 ↓
invent scientific interpretation
```

---

# 122. Evidence-Based Explanation

An explanation should be constructed from known values.

Example:

```text
The selected profile shows a strong
temperature gradient between 65 m and 80 m.

The model is approximately 0.42°C warmer
than the observation near 80 m.

The nearest model grid point is 8.3 km
from the observation location.
```

Every statement should map to a computed result.

---

# 123. No Hallucinated Science

An AI layer must never claim:

```text
"The current is caused by..."
```

unless the scientific engine actually provides evidence supporting that causal interpretation.

Prefer:

```text
"The selected current field shows..."
```

---

# 124. Scientific Language

The interface should use precise language.

Prefer:

```text
MODEL–OBSERVATION DIFFERENCE
```

instead of:

```text
MODEL ERROR
```

unless formal validation supports the latter.

Prefer:

```text
PROTOTYPE DRIFT SIMULATION
```

instead of:

```text
PREDICTED SAR LOCATION
```

unless the system is actually an approved operational product.

---

# 125. Scientific Transparency

The platform should always distinguish:

```text
OBSERVED
MODELED
DERIVED
SIMULATED
```

This classification should be reflected visually and semantically.

---

# 126. Scientific Color Semantics

Recommended conceptual mapping:

```text
OBSERVED
neutral marker

MODELED
field color

RESIDUAL
diverging scale

SIMULATED
distinct trajectory style

WARNING
restrained warning color
```

Do not use color alone where possible.

---

# 127. Scientific Engine Output Contract

Every major computation should provide:

```text
result
units
validity
method
source
warnings
```

Example:

```json
{
  "result": 0.42,
  "units": "degC",
  "valid": true,
  "method": "observation_minus_model",
  "source": {
    "observation": "Argo",
    "model": "GLORYS12V1"
  },
  "warnings": []
}
```

---

# 128. Scientific Engine Definition of Done

The Scientific Engine is considered ready when:

```text
✓ coordinates are normalized
✓ time is normalized
✓ depth is handled physically
✓ model values can be sampled
✓ observations can be sampled
✓ matching is explicit
✓ residuals are correct
✓ statistics ignore invalid values
✓ current speed/direction are correct
✓ derived features are documented
✓ SAR uses real currents
✓ domain boundaries are respected
✓ provenance is returned
✓ warnings are surfaced
✓ calculations are tested
```

---

# 129. Non-Negotiable Scientific Rules

## Rule 1

Never fabricate observations.

## Rule 2

Never fabricate model values.

## Rule 3

Never silently convert missing values to zero.

## Rule 4

Never hide spatial mismatch.

## Rule 5

Never hide temporal mismatch.

## Rule 6

Never calculate statistics from invalid points.

## Rule 7

Never call a value an anomaly without a defined reference.

## Rule 8

Never call a prototype trajectory an official forecast.

## Rule 9

Never create an arbitrary confidence percentage.

## Rule 10

Never add a scientific feature without defining its method.

---

# 130. Scientific Engine North Star

The Scientific Engine exists to answer:

> **What does the data actually support?**

Not:

> **What number would make the interface look impressive?**

The engine should prioritize:

```text
CORRECTNESS
+
TRACEABILITY
+
REPRODUCIBILITY
+
TRANSPARENCY
```

over feature count.

---

# 131. Final Scientific Pipeline

The complete NIRIKSHAN scientific pipeline is:

```text
                    SOURCE DATA
                         │
          ┌──────────────┴──────────────┐
          ↓                             ↓
       GLORYS                         ARGO
          │                             │
          └──────────────┬──────────────┘
                         ↓
                   NORMALIZATION
                         ↓
                    VALIDATION
                         ↓
                 SPATIAL MATCHING
                         ↓
                 TEMPORAL MATCHING
                         ↓
                   DEPTH MATCHING
                         ↓
               MODEL / OBSERVATION
                    COMPARISON
                         ↓
              ┌──────────┴──────────┐
              ↓                     ↓
          RESIDUALS            STATISTICS
              │                     │
              └──────────┬──────────┘
                         ↓
                 DERIVED FEATURES
                         │
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
      THERMOCLINE       MLD        CURRENT SHEAR
          │              │              │
          └──────────────┼──────────────┘
                         ↓
                 SCIENTIFIC EVIDENCE
                         ↓
                 RESPONSE ENGINE
                         ↓
                  DRIFT SIMULATION
                         ↓
                  PROVENANCE + WARNINGS
                         ↓
                  USER VISUALIZATION
```

---

# 132. Final Principle

NIRIKSHAN should never hide the chain:

```text
DATA
 ↓
CALCULATION
 ↓
RESULT
```

The user should always be able to move backward through that chain.

That is the foundation of scientific trust.
```

### The important part

This document deliberately makes **scientific defensibility a feature**.

A judge can click an Argo and ask:

> “Why are you saying the thermocline is here?”

We should be able to show:

**actual profile → gradient → method → depth → source.**

They can ask:

> “Where did this SAR trajectory come from?”

We show:

**GLORYS `uo/vo` → selected timestep → numerical integration → trajectory.**

They can ask:

> “How did you compare the model with the float?”

We show:

**Argo coordinates/time → nearest model grid/time → actual model value → residual.**

That is much stronger than simply having more visualizations.