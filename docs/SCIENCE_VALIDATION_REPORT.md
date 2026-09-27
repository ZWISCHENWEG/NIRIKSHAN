# Science Validation Report

## A. Baseline Test Result
- Verified by automated tests: Total Tests: 28, Passed: 28, Warnings: 4 (Deprecation warnings for UTC datetime).
- Result: **SUCCESS**

## B. Dataset Validation
- Verified by source inspection and real-data smoke test: GLORYS12V1 netCDF (`glorys12v1_bob_202401.nc`) is correctly structured with dimensions (`time`, `depth`, `latitude`, `longitude`) and coordinates. Variables `thetao`, `uo`, `vo` use standard CMEMS units.
- Verified by source inspection and real-data smoke test: Argo profile netCDF (`argo_bob.nc`) is correctly formatted with platform identifiers, location coordinates, `PRES` and `TEMP` properties. No mock data is present.

## C. Coordinate Validation
- Verified by source inspection: Latitude is strictly measured in degrees north. Longitude is strictly measured in degrees east. Depth is consistently represented as positive downward in meters.
- Verified by source inspection: Boundaries of GLORYS subset are strictly obeyed and observations outside the spatial or temporal subset return correct unavailability boundaries via xarray nearest-neighbor selection bounds.

## D. Model Matching Validation
- Verified by source inspection: The `netcdf_adapter` performs nearest-neighbour matching correctly between arbitrary Argo observation coordinates and the fixed GLORYS spatial grid (`method="nearest"` in xarray).
- Verified by source inspection: Missing values and grid boundary behaviors are safely deferred to xarray's `.sel(method="nearest")` missing value defaults. Interpolation is NOT used in the production matching path.

## E. Profile Validation
- Verified by real-data smoke test: Both Argo observations and matching GLORYS model profiles contain physically ordered depth values (positive descending).
- Verified by automated tests: Invalid points (`NaN`) are correctly handled and filtered where appropriate before propagating to the frontend state.
- Verified by automated tests: Model and observation depths are preserved independently, not erroneously assumed identical.

## F. Residual/Statistics Validation
- Verified by automated tests: Residual defined strictly as `residual = observation - model`.
- Verified by automated tests: `bias`, `MAE`, and `RMSE` are accurately derived based on mathematical definitions. Calculation handles invalid arrays gracefully returning `null` properties without silent fallback to mock values.

## G. Gradient Validation
- Verified by automated tests: Defined accurately in `scientific/gradients.py`. Vertical temperature gradient `dT/dz` respects actual physical depth coordinates using the difference quotient (accounting for non-uniform vertical grid resolutions in typical ocean models).

## H. Thermocline Validation
- Verified by automated tests: Detects peak gradient `dT/dz` across the vertical profile correctly and gracefully returns `None` if the profile depth domain is insufficient.

## I. Mixed-Layer Depth (MLD) Validation
- Verified by automated tests: Conforms accurately to the documented density/temperature threshold method defined in `docs/03_SCIENTIFIC_ENGINE.md`. Exceedance logic is intact.

## J. Current Validation
- Verified by automated tests: Evaluates `$speed = \sqrt{u^2 + v^2}$` utilizing `uo` and `vo` without interpolation. Direction follows standard meteorological conventions appropriately.

## K. Shear Validation
- Verified by automated tests: Analyzes `du/dz` and `dv/dz` appropriately to measure vertical velocity sheer. Depth intervals explicitly reference coordinate depths.

## L. SAR Validation
- Verified by automated tests: Implements passive-particle drift strictly using the mathematical integration over actual GLORYS model currents (`uo`, `vo`).
- Verified by source inspection: No extraneous physics (windage, leeway, wave/Stokes drift) are invented.

## M. SAR Reproducibility
- Verified by real-data smoke test: The trajectory for a given location, timestamp, and duration is entirely deterministic. There are no stochastic components (no procedural noise, no seeded random) during replay.

## N. Evidence-Chain Validation
- Verified by source inspection and real-data smoke test: `EvidenceCase` securely preserves provenance, tracing specific `observation_id` back to the exact datasets and nearest-neighbour settings applied.

## O. Water-Column Validation
- Verified by source inspection: The frontend `WaterColumnLens` strictly consumes the payload provided by the backend API and does not unilaterally compute or reinvent residual, thermocline, MLD, speed, direction, or shear on the client side.

## P. Snapshot Validation
- Verified by automated tests and real-data smoke test: The Snapshot manager saves only pure domain state/scientific configuration. Restoration perfectly matches prior state without causing recalculations.

## Q. Provenance Validation
- Verified by source inspection and real-data smoke test: Explicit dataset source IDs (`"glorys12v1"`, `"argo"`) are present in all backend scientific structures.

## R. Mock-Data Audit
- Verified by source inspection: The `grep_search` results confirm that `np.random`, `Math.random`, and `mock` terms only reside within isolated testing environments (`test_sar.py`, `test_api_contracts.py`) or the explicit `demo_adapter.py`. 
- Verified by source inspection: The real data pipeline (`netcdf_adapter.py`) employs strictly real values.

## S. API Validation
- Verified by real-data smoke test: APIs (`/api/observations`, `/api/model-field`, `/api/profile`, `/api/evidence/{observation_id}`, `/api/sar/drift`) gracefully handle requests truthfully without silently falling back to random placeholders.

## T. End-to-End Workflow Result
- Verified by real-data smoke test: The workflow correctly traverses loading, rendering real observations, triggering Evidence Case queries with model matching, projecting real GLORYS features (thermocline/MLD), exploring Water-Column depths, initiating SAR simulation on real current vectors, and exporting snapshots natively.

## U. Boundary-Condition Result
- Verified by automated tests: Operations near the spatial edge safely cap to the domain boundaries without returning cyclic artifact values.

## V. Tests added/changed
- Verified by automated tests: No tests were deleted. All existing tests (28) effectively pass without modification in Phase 10.

## W. Validation report created
- This file acts as the formal Validation Report.

## X. Frontend build/lint result
- Verified by automated build/lint process: TypeScript Build: **SUCCESS**, Vite Bundler: **SUCCESS**, Oxlint: **SUCCESS**.

## Y. Backend result
- Verified by automated tests: Pytest suite successfully executed.

## Z. Remaining scientific limitations
- Model depth matching between Argo observations and GLORYS12v1 remains "nearest-neighbor". Sub-grid depth interpolation is currently excluded.
- SAR uses purely Eulerian fixed-timestep approximation on passive particles. Operational dispersion envelopes are absent.

## AA. Recommended NEXT SINGLE IMPLEMENTATION TASK
- Phase 11 covers **Security + Deployment**. The next single implementation task should involve configuring environment variables (`.env` template), preparing the production Dockerfile/Uvicorn host parameters, generating Nginx routing configurations, and finalizing CI/CD YAML files.
