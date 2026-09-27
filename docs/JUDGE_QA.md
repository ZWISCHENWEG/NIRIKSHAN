# JUDGE Q&A

**1. What problem are you solving?**
We are solving the difficulty of validating numerical ocean models against real observations. Currently, this requires complex Python/MATLAB scripting. NIRIKSHAN makes it visual, immediate, and fully traceable in the browser.

**2. Why 3D?**
The ocean is a 3D environment. Depth determines currents, temperature structures (like the thermocline), and acoustics. 2D maps fail to capture the water column effectively.

**3. Why Cesium?**
Cesium is the industry standard for high-performance, precision 3D geospatial visualization in the browser. It handles globe projections and massive coordinate datasets seamlessly.

**4. Why Three.js?**
We don't use Three.js directly; we rely on Cesium for our WebGL rendering because Cesium is strictly geospatial, whereas Three.js is a general-purpose 3D library.

**5. Why xarray?**
`xarray` is the Python standard for working with labeled multi-dimensional arrays (NetCDF files). It allows us to slice terabytes of ocean data rapidly using coordinate labels (lat/lon/depth/time).

**6. What is GLORYS12V1?**
It is a global ocean physical reanalysis product by Copernicus Marine Service. It represents the computational "model" of the ocean.

**7. What is Argo?**
Argo is a global array of autonomous profiling floats that measure temperature and salinity as they sink and rise. It represents the "ground truth" observations.

**8. How do you match observations to model data?**
We use a nearest-neighbour algorithm in 4D (lat, lon, depth, time) to extract the closest model grid point to the observation.

**9. How do you calculate residual?**
Residual is strictly: `Observation Value - Model Value`.

**10. How do you calculate thermocline?**
We calculate the vertical temperature gradient (dT/dz) and identify the depth of the maximum negative gradient.

**11. How is MLD calculated?**
We use a temperature threshold method: the depth at which the temperature is exactly 0.2°C lower than the surface temperature (10m reference depth).

**12. How does SAR work?**
We use the 3D U/V (zonal/meridional) current velocities from the model. We perform a step-by-step Euler integration to calculate a particle's trajectory over time.

**13. Is SAR operational?**
No. It is a passive particle simulation demonstrating the application of model data. It lacks windage (leeway) and Stokes drift required for real-life rescue operations.

**14. What is actually real data?**
Both the GLORYS12V1 model subset and the Argo float NetCDF files are real data downloaded from Copernicus and ADMT, covering January 2024 in the Bay of Bengal.

**15. Where is AI?**
We intentionally excluded AI from the core scientific engine. Ocean validation requires strict mathematical determinism and provenance. AI hallucination is unacceptable when measuring model errors.

**16. Why not use a chatbot?**
A chatbot cannot effectively convey 3D geospatial relationships or complex depth profiles. Visual analytics are vastly superior for exploring volumetric ocean data.

**17. How do you handle missing data?**
`xarray` handles missing data as `NaN`. Our APIs sanitize `NaN` to `null` for JSON compatibility, and the frontend charts safely ignore `null` values.

**18. How do you handle uncertainty?**
Currently, we do not visualize probabilistic ensembles or uncertainty bands. We present deterministic values based on the specific dataset subset provided.

**19. How does the system scale?**
The frontend is stateless and scales infinitely. The backend relies on memory-mapped NetCDF files. For global scale, we would migrate from local NetCDF files to cloud-optimized Zarr stores (OPeNDAP/S3) accessed via Dask.

**20. What happens if the dataset changes?**
The backend API dynamically reads the variables and coordinates from whatever NetCDF file is provided at startup.

**21. Why browser-based?**
It requires zero installation, ensuring stakeholders (scientists, rescue coordinators) can access the tool immediately during time-critical events.

**22. How is provenance maintained?**
Every "Evidence" calculation attaches the source dataset identifiers (e.g., specific Argo float ID, GLORYS dataset name) to the JSON response.

**23. What is implemented vs future?**
Implemented: 3D Visualization, Model matching, Profile extraction, Derived metrics, Basic SAR. Future: Sub-grid interpolation, Leeway models, Multi-model comparison, Global cloud-optimized scaling.

**24. What are the current limitations?**
Nearest-neighbour extraction, Euler integration, bounded temporal/spatial subset, and no windage.
