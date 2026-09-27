# FEATURE STATUS MATRIX

| Feature | Status | Notes |
| :--- | :--- | :--- |
| **3D globe** | IMPLEMENTED | CesiumJS integrated successfully. |
| **GLORYS model field** | IMPLEMENTED | Local NetCDF loaded via xarray. |
| **Argo observations** | IMPLEMENTED | Local NetCDF loaded. |
| **Model-observation matching** | IMPLEMENTED | Nearest-neighbour extraction implemented. |
| **Profile comparison** | IMPLEMENTED | Dual-axis charts for T/S. |
| **Residuals** | IMPLEMENTED | Calculated dynamically (Obs - Model). |
| **Thermocline calculation** | IMPLEMENTED | Max gradient detection implemented. |
| **MLD calculation** | IMPLEMENTED | Temperature threshold method implemented. |
| **Current vectors** | IMPLEMENTED | Calculated from U/V components. |
| **Current shear** | IMPLEMENTED | Depth-relative velocity changes calculated. |
| **Water-Column Lens** | IMPLEMENTED | Interactive depth probing. |
| **Analytical cursor** | IMPLEMENTED | Linked UI updates. |
| **SAR simulation** | IMPLEMENTED | Euler integration passive drift. |
| **Response replay** | IMPLEMENTED | Animation of SAR drift over time. |
| **Provenance** | IMPLEMENTED | Dataset identifiers attached to responses. |
| **Snapshots** | IMPLEMENTED | API supports creating static evidence records. |
| **Performance optimizations** | PARTIALLY IMPLEMENTED | Basic caching; large arrays still heavy. |
| **Multi-model support** | FUTURE | Extensible API, but currently only GLORYS. |
| **Glider/CTD data** | FUTURE | Pluggable, but not currently in demo. |
| **BGC (Biogeochemical)** | FUTURE | Extensible. |
| **WMS/WCS/OPeNDAP** | FUTURE | Currently requires local NetCDF files. |
| **Global scaling** | FUTURE | Currently bounded to Bay of Bengal subset. |
| **AI explanation** | FUTURE | Not implemented; preserves strict determinism. |
| **Sub-grid interpolation** | FUTURE | Currently nearest-neighbour only. |
