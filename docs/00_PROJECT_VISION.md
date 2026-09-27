# NIRIKSHAN

## 3D Ocean Analysis & Response Workspace

### SEE → VERIFY → UNDERSTAND → RESPOND

**SIH Problem Statement:** SIH26067  
**Organization:** Ministry of Earth Sciences (MoES)  
**Department:** Indian National Centre for Ocean Information Services (INCOIS)  
**Theme:** Disaster Management  
**Team:** ZWP

---

# 1. Executive Vision

NIRIKSHAN is a browser-native 3D Ocean Analysis & Response Workspace designed to bring numerical ocean model outputs, in-situ observations, scientific analysis and operational scenario exploration into one synchronized environment.

The platform is not intended to be merely a 3D ocean visualization website.

Its purpose is to help a user move from:

> **What is happening?**

to:

> **Is the model supported by observations?**

to:

> **What physical structure explains it?**

to:

> **What could happen if this ocean state drives an operational scenario?**

The fundamental product loop is:

```text
SEE
 ↓
VERIFY
 ↓
UNDERSTAND
 ↓
RESPOND
```

---

# 2. Product Name

## NIRIKSHAN

"Nirikshan" means observation, inspection or examination.

The name reflects the central purpose of the platform:

- observe the ocean
- inspect its structure
- compare model and observation
- investigate physical behaviour
- examine operational scenarios

The official product name should be:

> **NIRIKSHAN — 3D Ocean Analysis & Response Workspace**

The repository may continue to use:

> `ocean-viewer`

until a later repository rename is intentionally performed.

---

# 3. Product Tagline

## Primary

> **SEE. VERIFY. UNDERSTAND. RESPOND.**

## Secondary description

> **A 3D scientific workspace connecting ocean models, observations and operational response scenarios.**

---

# 4. The Core Problem

Oceanographic information is distributed across multiple datasets, formats, systems and analytical tools.

Numerical ocean models provide spatially and temporally continuous representations of the ocean.

In-situ instruments provide real measurements from locations and depths.

These two forms of information are scientifically complementary.

However, users often need to switch between different tools to answer questions such as:

- What does the model predict at this location?
- Is there an observation nearby?
- Does the model agree with the observation?
- At which depth does it disagree?
- What ocean structure exists at that location?
- What currents are present?
- How might those currents affect a drifting object?
- Where did the data and derived result come from?

NIRIKSHAN addresses this fragmentation through a unified browser-based analytical environment.

---

# 5. The Fundamental Product Insight

The project must NOT compete simply by building:

> "another 3D ocean viewer."

A browser-based 3D visualization layer is only the foundation.

The stronger product concept is:

```text
MODEL
  +
OBSERVATION
  +
3D CONTEXT
  +
SCIENTIFIC ANALYSIS
  +
OPERATIONAL SCENARIO
```

This creates a continuous workflow:

```text
Ocean State
    ↓
Observation
    ↓
Comparison
    ↓
Physical Interpretation
    ↓
Operational Response
```

---

# 6. The Four Pillars

## 6.1 SEE

Help users visually understand the ocean state.

Examples:

- temperature
- salinity
- currents
- depth
- time
- spatial distribution
- 3D structures
- observation locations

---

## 6.2 VERIFY

Help users compare model output against real observations.

Examples:

- Argo profiles
- Glider profiles
- CTD data
- BGC data
- model profiles
- model-observation residuals
- quality-control information
- provenance

---

## 6.3 UNDERSTAND

Help users interpret ocean structures.

Potential derived products include:

- thermocline depth
- mixed-layer depth
- temperature gradients
- current speed
- current direction
- vertical current shear
- anomalies
- water-column structure

These should be calculated transparently using documented scientific methods.

---

## 6.4 RESPOND

Allow users to investigate operational scenarios using the same physical ocean state.

Initial scenario:

> Search-and-rescue drift.

Potential future scenarios:

- oil-spill transport
- marine heat event investigation
- current-driven transport
- other operational scenarios

These are prototype analytical scenarios unless explicitly backed by an official operational product.

NIRIKSHAN must never imply that a prototype simulation is an official INCOIS forecast or advisory.

---

# 7. Primary Product Modes

NIRIKSHAN consists of three primary modes.

```text
EXPLORE
   ↓
EVIDENCE
   ↓
RESPONSE
```

---

## EXPLORE

The user investigates the ocean state.

Core interactions:

- 3D globe
- model fields
- depth navigation
- time navigation
- variable selection
- observation overlays
- current vectors
- depth slices
- isosurfaces
- vertical sections

---

## EVIDENCE

The user investigates a specific observation and its relationship with the model.

Core interaction:

```text
Select observation
       ↓
Focus location
       ↓
Load profile
       ↓
Load model state
       ↓
Compare
       ↓
Calculate residual
       ↓
Inspect water column
       ↓
Understand structure
```

This is the primary differentiating mode.

---

## RESPONSE

The user investigates an operational scenario.

Core interaction:

```text
Select location
       ↓
Select scenario
       ↓
Use model current field
       ↓
Run deterministic simulation
       ↓
Visualize trajectory
       ↓
Inspect result
```

---

# 8. Signature Feature

## Ocean Evidence

The signature NIRIKSHAN interaction is:

> **Ocean Evidence**

A user selects an Argo or other observation.

NIRIKSHAN automatically assembles the relevant evidence around that location and time.

The system should be able to show:

```text
OBSERVATION
     │
     ├── Position
     ├── Time
     ├── Depth
     ├── Temperature
     ├── Salinity
     └── Quality information
     
MODEL
     │
     ├── Matching position
     ├── Matching time
     ├── Temperature
     ├── Salinity
     └── Current
     
COMPARISON
     │
     ├── Model
     ├── Observation
     └── Residual
     
INTERPRETATION
     │
     ├── Thermocline
     ├── Mixed Layer
     ├── Current
     └── Vertical structure
     
PROVENANCE
     │
     ├── Dataset
     ├── Variable
     ├── Timestamp
     └── Matching method
```

The objective is to answer:

> **What does the model say, what did the ocean actually show, and where do they differ?**

---

# 9. Water-Column Lens

The second signature interaction is the:

> **Water-Column Lens**

When a user selects an observation or location, NIRIKSHAN should be able to provide a localized depth-resolved analytical view.

Conceptually:

```text
                 SURFACE
─────────────────────────────────

      MODEL FIELD

           ● OBSERVATION

─────────────────────────────────
           THERMOCLINE
─────────────────────────────────

      MODEL / OBSERVATION

─────────────────────────────────

          DEEP WATER

─────────────────────────────────
                 DEPTH
```

The Water-Column Lens must synchronize:

- geographic location
- time
- depth
- model
- observation
- current field
- derived scientific features

It is an analytical interface, not a decorative 3D object.

---

# 10. Scientific Integrity

Scientific trust is a core product principle.

NIRIKSHAN must follow these rules.

## Rule 1 — No fabricated scientific values

If real data is unavailable, the system must not silently generate values.

---

## Rule 2 — Separate observations from models

The interface must clearly distinguish:

- measured observations
- numerical model output
- derived calculations
- prototype simulations

---

## Rule 3 — Preserve provenance

Important scientific values must be traceable to:

- source dataset
- variable
- timestamp
- coordinates
- depth
- processing method

---

## Rule 4 — Make assumptions visible

If a model-observation comparison uses nearest-neighbour matching, the system must say so.

If interpolation is introduced later, the method must be documented.

---

## Rule 5 — Do not hide missing data

Missing values remain missing.

They must not silently become zero or synthetic values.

---

## Rule 6 — Do not overclaim operational capability

Prototype simulations must not be presented as official operational forecasts or advisories.

---

# 11. Current Real Data Foundation

The current development implementation already uses real scientific data.

## GLORYS12V1

Current subset:

```text
Time:
2024-01-01 → 2024-01-10

Latitude:
5°N → 25°N

Longitude:
75°E → 100°E

Vertical levels:
50

Variables:
thetao
uo
vo
```

Dimensions:

```text
time      = 10
depth     = 50
latitude  = 241
longitude = 301
```

---

## Argo

Current development observation dataset:

```text
backend/data/scientific/argo_bob.nc
```

Current development dataset contains approximately:

```text
2,740 measurements
19 unique floats
```

The implementation must distinguish between:

- measurements
- profiles
- floats/platforms

---

# 12. Current Technology Direction

The current implementation uses:

### Frontend

- React
- TypeScript
- Vite
- Cesium
- Three.js/WebGL
- Plotly
- Zustand

### Backend

- Python
- FastAPI
- xarray
- NumPy
- NetCDF

### Scientific data

- GLORYS12V1
- Argo

### Visualization

- Cesium
- Three.js
- WebGL
- Plotly

The technology stack is not itself the product differentiator.

Technology decisions should serve the scientific workflow.

---

# 13. Product Design Philosophy

NIRIKSHAN should look like a serious scientific instrument.

The visual language should communicate:

- precision
- scientific credibility
- calmness
- operational usefulness
- data density
- trust

Avoid:

- neon gradients
- purple AI gradients
- glowing borders
- glassmorphism
- excessive rounded cards
- futuristic gaming HUDs
- decorative particles
- generic AI dashboards
- excessive animation
- unnecessary 3D decoration

The interface should derive visual character from the data itself.

---

# 14. Design Principle

## Data should create the visual hierarchy.

Not:

```text
DECORATION
    ↓
DATA
```

Instead:

```text
DATA
 ↓
RELATIONSHIPS
 ↓
INTERACTION
 ↓
VISUAL HIERARCHY
```

The strongest visual moments should come from:

- ocean structures
- depth
- movement
- model-observation differences
- current vectors
- spatial relationships
- synchronized transitions

---

# 15. What NIRIKSHAN Is NOT

NIRIKSHAN is not:

- a generic dashboard
- an AI chatbot
- an AI assistant for ocean questions
- a social platform
- a mobile-first application
- a blockchain application
- a collection of unrelated visualizations
- a replacement for official INCOIS operational services
- an unofficial claim of forecast accuracy
- a collection of fake demo data

---

# 16. Feature Decision Filter

Every proposed feature must answer at least one question:

### Does it help the user SEE?

### Does it help the user VERIFY?

### Does it help the user UNDERSTAND?

### Does it help the user RESPOND?

If a feature does none of these, it should not be part of the MVP.

---

# 17. MVP

The minimum judge-ready experience is:

```text
1. Open NIRIKSHAN
2. View real 3D ocean data
3. Change depth
4. Change time
5. View observations
6. Select an observation
7. Inspect the real profile
8. Compare observation against model
9. Show residual
10. Identify important water-column structure
11. View current field
12. Run a current-driven drift scenario
13. Show provenance
```

A complete vertical workflow is more valuable than dozens of disconnected features.

---

# 18. Judge Experience

A judge should understand the product quickly.

The ideal demonstration is:

```text
OPEN
 ↓
SEE OCEAN
 ↓
SELECT ARGO
 ↓
OCEAN EVIDENCE
 ↓
MODEL ≠ OBSERVATION
 ↓
WHY?
 ↓
WATER-COLUMN STRUCTURE
 ↓
CURRENT FIELD
 ↓
RESPONSE SCENARIO
```

The demo should show a coherent scientific story rather than a list of features.

---

# 19. Long-Term Vision

The long-term platform can evolve from:

```text
3D Visualization
```

into:

```text
Ocean Analysis Workspace
```

with future support for:

- additional models
- additional observations
- INCOIS datasets
- gliders
- CTD
- BGC
- WMS
- WCS
- OPeNDAP
- additional derived products
- more operational scenarios
- scalable regional/global datasets

The architecture should permit this growth without making the MVP unnecessarily complex.

---

# 20. Product North Star

NIRIKSHAN should make it possible to move from:

> **"What does the ocean model show?"**

to:

> **"What does the observation show?"**

to:

> **"Where do they disagree?"**

to:

> **"What physical structure explains the difference?"**

to:

> **"What could this ocean state mean operationally?"**

within one continuous scientific workspace.

---

# 21. Final Product Definition

## NIRIKSHAN

### 3D Ocean Analysis & Response Workspace

> **SEE. VERIFY. UNDERSTAND. RESPOND.**

NIRIKSHAN connects:

```text
Numerical Ocean Models
        +
In-Situ Observations
        +
3D Scientific Visualization
        +
Derived Ocean Analysis
        +
Operational Scenario Simulation
```

into one browser-native environment.

The objective is not simply to visualize ocean data.

The objective is to make complex ocean information:

> **observable → verifiable → understandable → actionable**

while maintaining scientific transparency and data provenance.

---

# 22. Non-Negotiable Direction

From this point forward, all implementation decisions must preserve the following:

```text
REAL DATA
+
SCIENTIFIC INTEGRITY
+
3D SPATIAL CONTEXT
+
DEPTH AWARENESS
+
MODEL ↔ OBSERVATION COMPARISON
+
DERIVED SCIENTIFIC INSIGHT
+
OPERATIONAL CONTEXT
```

NIRIKSHAN should become a **scientific analysis instrument**, not merely a more beautiful visualization dashboard.
```
