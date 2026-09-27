# NIRIKSHAN: PITCH FACT SHEET

**Problem:** SIH26067
Ocean numerical models provide critical forecasts, but they inevitably diverge from physical reality. Validating these complex 3D models against sparse in-situ observations requires tedious, disconnected manual scripting, delaying critical operational decisions.

**Solution:**
NIRIKSHAN is a browser-based 3D oceanographic visualization and analytical evidence engine. It unifies complex numerical models with real-world observations into a single, interactive, mathematically rigorous workflow.

**How it works:**
1. Loads 3D numerical models (GLORYS12V1) and in-situ observations (Argo).
2. Users visually explore the ocean and select an observation.
3. The engine instantly computes the mathematical difference (residual) between the model and reality.
4. Users simulate scenarios (like SAR) using the validated current fields.

**Scientific Foundation:**
Powered by Python (`xarray`, `numpy`), the backend performs deterministic calculations (Nearest-Neighbour extraction, Euler integration) on raw NetCDF arrays. 

**Key Differentiators:**
- **Zero-Installation:** Runs entirely in a standard web browser (WebGL/Cesium).
- **Traceable Evidence:** Every residual calculation is tied to provenance metadata.
- **Visual Analytics:** The "Water-Column Lens" turns complex 3D data into intuitive visual profiles.

**Technology Stack:**
- Vite, React, CesiumJS, Carto
- FastAPI, Python 3.11, Xarray

**Implemented Capabilities:**
- 3D Globe Visualization
- Real Model-Observation Matching
- Thermocline and Mixed Layer Depth derivations
- Passive Particle SAR Simulation
- Configurable Data Environments

**Disaster-Management Relevance:**
Provides immediate confidence metrics for ocean models. If the model is wrong about the current profile, a SAR simulation based on that model will send rescue teams to the wrong location. NIRIKSHAN highlights these discrepancies instantly.

**Limitations:**
- No windage/Stokes drift in SAR.
- No sub-grid interpolation.
- Currently restricted to a local dataset subset for performance.

**Team:**
Created for Smart India Hackathon 2026.
