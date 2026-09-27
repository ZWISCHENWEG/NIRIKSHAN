# SCIENTIFIC LIMITATIONS

NIRIKSHAN is an analytical prototype. It contains several scientific limitations that must be acknowledged.

## Nearest-Neighbour Model Matching
When comparing an Argo observation to the GLORYS model, NIRIKSHAN selects the closest spatial grid point (nearest-neighbour). It does not currently perform sub-grid spatial interpolation (e.g., bilinear or bicubic interpolation) between the four surrounding grid points. This can introduce artificial step-changes near strong gradients.

## Depth Interpolation
Model depth levels and Argo pressure levels do not align perfectly. NIRIKSHAN performs linear interpolation along the z-axis (depth) to calculate residuals, which assumes linearity between model discrete levels.

## SAR Passive-Particle Assumption
The Search and Rescue (SAR) module treats objects as passive mathematical particles. It **does not** account for:
- **Windage (Leeway):** The effect of wind pushing an object floating above the surface.
- **Wave/Stokes Drift:** The transport of mass by surface waves.

## Euler Integration
The SAR drift uses a simple 1st-order Euler integration scheme. For long-duration drifts in complex eddy fields, higher-order integrators (like Runge-Kutta 4th Order) would be required for operational accuracy.

## Spatial and Temporal Bounding
The prototype is restricted to a small geographic bounding box (Bay of Bengal) and a short temporal window (January 2024) to fit within standard memory limitations (RAM).

## Observation Sparsity
Argo floats only profile periodically (typically every 10 days). Between profiles, there is no real-time ground truth.

## Uncertainty
The system does not currently visualize uncertainty bands or probabilistic ensembles. All values are presented deterministically.

**NIRIKSHAN IS NOT AN OPERATIONAL SEARCH AND RESCUE TOOL. IT IS AN ANALYTICAL PROTOTYPE FOR SCIENTIFIC VALIDATION.**
