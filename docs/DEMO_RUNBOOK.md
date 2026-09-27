# DEMO RUNBOOK

This is the exact sequence to demonstrate NIRIKSHAN to the SIH judges.

## PRE-DEMO CHECK
- Ensure backend is running (`uvicorn main:app`).
- Ensure frontend is running (`npm run dev` or statically served).
- Ensure `OCEAN_DATA_MODE=netcdf`.
- Verify `http://localhost:8000/ready` returns `"status": "ready"`.

---

## 00:00 — Opening
**Action:** Open the application in full screen.
**Script:** "Welcome to NIRIKSHAN. We are solving problem SIH26067: providing a way to validate ocean numerical models against real in-situ observations in real-time."
**Science Point:** We use real GLORYS12V1 and Argo data, not mocks.

## 00:20 — 3D exploration
**Action:** Pan and zoom the Cesium globe over the Bay of Bengal.
**Script:** "We use a browser-based 3D globe to provide a synoptic view of the ocean."
**Science Point:** Spatial context matters in oceanography.

## 01:00 — Observation selection
**Action:** Click on an Argo float (yellow dot).
**Script:** "Here we select a real Argo float observation. Notice the metadata panel."
**Science Point:** Ground truth selection.

## 01:30 — Evidence
**Action:** Open the Evidence/Profile comparison view.
**Script:** "NIRIKSHAN instantly queries the GLORYS model at this exact coordinate and generates an evidence case."
**Science Point:** Nearest-neighbour matching.

## 02:00 — Profile comparison
**Action:** Point to the Temperature/Salinity charts.
**Script:** "We compare the model (line) against the observation (dots) throughout the water column. The residual difference is calculated automatically."
**Science Point:** Residual = Observation - Model.

## 02:30 — Derived features
**Action:** Highlight the Thermocline and Mixed Layer Depth markers.
**Script:** "The engine derives scientific features from the profiles, identifying the thermocline and MLD automatically."
**Science Point:** Identifying physical ocean structures algorithmically.

## 03:00 — Current field
**Action:** Toggle on the Water-Column Lens / Current Vector view.
**Script:** "We can visualize the 3D computational current field at different depths."
**Science Point:** Current shear and directional flow.

## 03:20 — SAR response
**Action:** Open the SAR Workspace and run a drift simulation from the float's location for 24 hours.
**Script:** "Using the computational current field, we can perform a passive particle Search and Rescue drift simulation."
**Science Point:** Euler integration of velocity fields.

## 04:00 — Provenance
**Action:** Show the Snapshot / Provenance metadata.
**Script:** "Every calculation is fully traceable to the exact source NetCDF dataset."
**Science Point:** Scientific reproducibility.

## 04:30 — Closing
**Script:** "NIRIKSHAN transforms static data into actionable, validated intelligence."

---

## DEMO FAILURE RECOVERY

- **Backend unavailable:** The UI will show a connection error. Explain that it is a locally hosted service. Restart the backend terminal.
- **Dataset unavailable:** The backend will fallback to `demo` mode. State clearly: "We are now using simulated demo data to demonstrate the UI."
- **Observation unavailable:** The map may be empty. Ensure the time slider is correct for January 2024.
- **SAR unavailable:** If the simulation fails, it is usually due to bounds checking (drifting onto land or off the dataset edge). Explain: "The particle hit the boundary of our limited local dataset."
- **Browser/WebGL issue:** Cesium requires WebGL. If it crashes, reload the page.
