# NIRIKSHAN — FINAL PRODUCT HARDENING
# TASK 13.2 — FINAL DEMO EXPERIENCE + TYPOGRAPHY POLISH

Phase 13.1 is complete.

Read:

docs/FINAL_PRODUCT_AUDIT.md
docs/12_DEMO_AND_PITCH_SPECIFICATION.md
docs/DEMO_RUNBOOK.md
docs/05_UI_UX_SYSTEM.md
docs/FEATURE_STATUS.md
docs/SCIENTIFIC_LIMITATIONS.md

This is the FINAL VISUAL/DEMO POLISH TASK.

==================================================
CORE RULE
==================================================

DO NOT ADD NEW SCIENTIFIC CAPABILITIES.

DO NOT CHANGE:

- backend algorithms
- NetCDF processing
- GLORYS12V1 data
- Argo data
- model matching
- residual calculation
- thermocline calculation
- MLD calculation
- current calculations
- SAR physics
- snapshot serialization
- provenance semantics
- API contracts

This task is purely about presentation,
hierarchy, discoverability and demo flow.

The existing product architecture remains:

3D OCEAN
+
RIGHT EVIDENCE / RESPONSE PANEL
+
BOTTOM SCIENTIFIC NAVIGATION

==================================================
1. FIRST-60-SECONDS EXPERIENCE
==================================================

Audit the application from a completely fresh user perspective.

Within approximately 60 seconds the user should understand:

1. This is an ocean analysis platform.
2. The map contains real observations.
3. An observation can be selected.
4. The observation can be compared with a model.
5. The comparison produces measurable scientific evidence.
6. Derived ocean features can be inspected.
7. The same scientific context can lead into SAR response.

Do NOT add onboarding modals.

Do NOT add tutorials.

Do NOT add tooltips everywhere.

Use subtle hierarchy and microcopy only where necessary.

==================================================
2. HEADER POLISH
==================================================

Inspect the top header.

Preserve the current institutional identity.

Ensure these hierarchy levels are obvious:

OCEAN VIEWER
SIH26067

GLOBAL OCEAN PHYSICS
GLORYS12V1 · REANALYSIS · JAN 2024

TIME
DATA STATUS
SAR WORKSPACE

Typography should clearly distinguish:

product identity
dataset identity
current state

Avoid excessive letter spacing.

Avoid oversized branding.

==================================================
3. ACTIVE FIELD
==================================================

Inspect the ACTIVE FIELD indicator.

It should communicate:

what variable is being visualized
+
its unit

Example:

ACTIVE FIELD
● POTENTIAL TEMPERATURE (°C)

Do not turn this into a dashboard card.

Keep it visually integrated with the map.

==================================================
4. INSPECTION PANEL HIERARCHY
==================================================

The right-side InspectionPanel contains a lot of scientific information.

Improve hierarchy without removing information.

Desired reading order:

OBSERVATION
↓
POSITION / TIME / DEPTH
↓
TEMPERATURE PROFILE
↓
MODEL vs OBSERVATION
↓
RESIDUAL
↓
DERIVED FEATURES
↓
PROVENANCE

The panel should feel like a scientific investigation record.

Avoid making every section look like an independent card.

Use:

spacing
rules
typographic hierarchy
small labels
data alignment

rather than decorative containers.

==================================================
5. PROFILE CHART
==================================================

The profile comparison is one of the most important
judge-facing elements.

Make the following immediately understandable:

MODEL
OBSERVATION

and:

temperature
depth
units

Keep the existing Plotly visualization.

Do NOT replace Plotly.

Do NOT redesign the chart into a custom visualization.

The existing:

"Click to inspect depth"

affordance should remain subtle.

Ensure the analytical cursor is visually clear once activated.

==================================================
6. RESIDUAL COMMUNICATION
==================================================

The user must understand:

RESIDUAL = OBSERVATION − MODEL

Do not add a giant equation.

Use a small scientific caption or metadata label near
the residual chart if needed.

Make zero visually understandable.

Positive and negative residuals should remain visually
distinct.

Do not change scientific color semantics.

==================================================
7. DERIVED FEATURES
==================================================

Inspect:

THERMOCLINE
MLD
CURRENT SPEED
CURRENT DIRECTION
CURRENT SHEAR

The goal is not to make them larger.

The goal is to make them easier to scan.

Use a consistent structure:

FEATURE NAME
value + unit
one-line scientific description

Example structure:

THERMOCLINE
85.09 m
Maximum vertical temperature gradient

MLD
29.44 m
Temperature-threshold mixed-layer estimate

Do not fabricate descriptions.

Use only information already supported by the backend
and documentation.

Keep the existing depth relationship introduced in 13.1.

==================================================
8. PROVENANCE
==================================================

Make PROVENANCE feel like part of the scientific result,
not an afterthought.

Preserve compactness.

Clearly distinguish:

DATASET
TEMPORAL SEPARATION
SPATIAL SEPARATION
MATCH METHOD
POINTS MATCHED

Do not create a giant provenance panel.

Do not duplicate provenance elsewhere.

==================================================
9. SAR RESPONSE TRANSITION
==================================================

Inspect the transition:

ANALYSIS
→
SAR WORKSPACE

The current "SAR WORKSPACE →" treatment should remain.

Ensure the user can understand that this is a transition
from analysis to response.

When SAR mode is active, make the response state obvious
without using dramatic visual effects.

The response workspace should visually feel like the same
application entering a different operational mode.

==================================================
10. BOTTOM NAVIGATION
==================================================

The 13.1 layout correction must remain.

Verify:

TEMPORAL NAVIGATION
and
DEPTH NAVIGATION

have balanced visual weight.

Ensure:

current date
current depth
range endpoints

remain readable.

Do not increase the footer height.

==================================================
11. TYPOGRAPHY PASS
==================================================

Perform a restrained typography pass.

Use the existing typography system.

Prioritize:

- hierarchy
- readable values
- consistent labels
- consistent units
- alignment
- spacing

Do NOT:

- introduce another font
- use giant headings
- use decorative typography
- overuse uppercase
- increase tracking everywhere

Scientific values should be easy to scan.

==================================================
12. SPACING PASS
==================================================

Check:

header
map labels
right panel
profile charts
derived features
provenance
bottom navigation

Look for:

- unnecessary gaps
- cramped labels
- inconsistent vertical rhythm
- misaligned values
- inconsistent section spacing

Make small corrections only.

==================================================
13. WIDE-SCREEN / LAPTOP CHECK
==================================================

Verify at:

A. approximately 1440×900
B. approximately 1920×1080
C. laptop-sized viewport

Ensure:

- map remains dominant
- right panel remains usable
- bottom navigation remains balanced
- no large dead regions
- no panel overlap
- no text clipping

==================================================
14. DEMO FLOW VERIFICATION
==================================================

Run the exact intended judge sequence:

OPEN
↓
EXPLORE
↓
SELECT ARGO
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

Verify that each transition is visually obvious.

Do not add fake transitions.

Do not add automatic animation purely for presentation.

==================================================
15. SCIENTIFIC REGRESSION
==================================================

Confirm this task has not changed:

- GLORYS values
- Argo values
- model matching
- residual = observation - model
- thermocline
- MLD
- current speed
- current direction
- current shear
- SAR trajectory
- SAR integration
- provenance
- snapshot state

==================================================
16. VALIDATION
==================================================

Run:

PYTHONPATH=backend pytest backend/tests/

npm run build

npm run lint

Then manually verify:

1. application launch
2. map rendering
3. observation selection
4. EvidenceCase
5. profile comparison
6. residual
7. analytical cursor
8. derived features
9. SAR WORKSPACE
10. SAR replay
11. return to analysis
12. snapshot capture
13. snapshot restoration

==================================================
17. DO NOT DO
==================================================

Do NOT:

- rewrite App.tsx
- replace Cesium
- replace Plotly
- replace Zustand
- redesign the entire panel
- introduce a dashboard layout
- add AI chatbot functionality
- add fake confidence scores
- add fake alerts
- add fake forecasts
- add new datasets
- add authentication
- add collaboration
- add new backend services

This is the final polish pass.

==================================================
18. REPORT
==================================================

At completion provide:

A. First-60-seconds result
B. Header hierarchy changes
C. Inspection panel changes
D. Profile chart changes
E. Residual presentation changes
F. Derived feature changes
G. Provenance changes
H. SAR transition changes
I. Typography changes
J. Responsive verification
K. Demo workflow verification
L. Scientific regression verification
M. Backend test result
N. Frontend build result
O. Frontend lint result
P. Files changed
Q. Remaining issues
R. Recommended next SINGLE task

Then STOP.

Do not automatically begin another implementation phase.