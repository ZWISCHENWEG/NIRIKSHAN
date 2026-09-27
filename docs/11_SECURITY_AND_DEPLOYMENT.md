# `11_SECURITY_AND_DEPLOYMENT.md`

```md
# 11 — Security & Deployment Architecture

## 1. Purpose

This document defines the security, environment configuration, deployment, and operational strategy for NIRIKSHAN.

NIRIKSHAN consists of:

- React frontend
- CesiumJS
- Three.js/WebGL
- Plotly
- FastAPI backend
- xarray
- NetCDF scientific datasets
- GLORYS12V1 data
- Argo observations
- scientific processing services
- optional external basemap services

The deployment architecture must remain:

- simple
- secure
- reproducible
- inexpensive
- suitable for a hackathon
- scalable enough for the prototype
- easy for the team to maintain

The project should avoid unnecessary infrastructure.

---

# 2. Deployment Principle

The MVP follows:

```text
                    NIRIKSHAN
                        │
             ┌──────────┴──────────┐
             │                     │
        Frontend                Backend
             │                     │
      React/Vite              FastAPI
             │                     │
        Static build          Scientific Engine
                                   │
                              xarray/NetCDF
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
              GLORYS12V1                      Argo
```

The frontend should be deployable as a static application.

The backend should run as a separate Python service.

---

# 3. Security Boundaries

There are three security boundaries.

## Boundary 1 — Browser

The browser contains:

- frontend code
- public configuration
- Cesium configuration
- CARTO configuration
- scientific visualization state

Anything shipped to the browser must be considered public.

---

## Boundary 2 — Backend

The backend contains:

- scientific processing
- NetCDF access
- dataset configuration
- server-side credentials if required
- API logic

Sensitive credentials must remain here.

---

## Boundary 3 — External Services

Examples:

- basemap providers
- Copernicus Marine services
- future remote OGC services

Credentials should be transmitted only from the component that actually requires them.

---

# 4. Secret Classification

Every configuration value must be classified as either:

### Public

Safe to expose to browser:

```text
VITE_CESIUM_ION_ACCESS_TOKEN
VITE_CARTO_API_KEY
```

These are client-side values.

They should still be restricted by provider-side controls where available.

---

### Private

Never expose to browser:

```text
Copernicus username
Copernicus password
server API credentials
database passwords
private signing keys
deployment secrets
```

Private values belong in backend/server environment variables or deployment secret stores.

---

# 5. Vite Environment Variables

Because Vite exposes variables beginning with:

```text
VITE_
```

to the frontend bundle:

```text
VITE_* ≠ secret
```

The team must never put sensitive credentials in:

```text
VITE_COPERNICUS_PASSWORD
VITE_DATABASE_PASSWORD
VITE_PRIVATE_API_KEY
```

This is prohibited.

---

# 6. Frontend Environment

Recommended:

```env
VITE_CESIUM_ION_ACCESS_TOKEN=...
VITE_CARTO_API_KEY=...
VITE_API_BASE_URL=...
```

These values are public/client-side configuration.

Provider dashboards should be configured with appropriate restrictions where supported.

---

# 7. Backend Environment

Recommended structure:

```env
APP_ENV=production

HOST=0.0.0.0
PORT=8000

ALLOWED_ORIGINS=https://your-frontend.example

DATA_ROOT=/app/backend/data/scientific

COPERNICUS_USERNAME=...
COPERNICUS_PASSWORD=...
```

Only variables actually required by the application should exist.

Do not create placeholder secrets merely because an environment file contains a section for them.

---

# 8. `.env` Policy

Local `.env` files must never be committed.

Required `.gitignore` entries:

```gitignore
.env
.env.*
!.env.example
```

If the project uses additional environment naming conventions, update the ignore rules accordingly.

---

# 9. `.env.example`

The repository should contain:

```text
.env.example
```

containing names but not real values.

Example:

```env
APP_ENV=development

ALLOWED_ORIGINS=http://localhost:5173

DATA_ROOT=backend/data/scientific

COPERNICUS_USERNAME=
COPERNICUS_PASSWORD=

VITE_CESIUM_ION_ACCESS_TOKEN=
VITE_CARTO_API_KEY=
VITE_API_BASE_URL=http://localhost:8000
```

This documents required configuration without exposing credentials.

---

# 10. Credential Handling

Never:

- paste credentials into source code
- commit credentials
- place credentials in frontend code
- put credentials in JSON fixtures
- put credentials in documentation
- print credentials in logs
- include credentials in screenshots
- put credentials in Git history

If a credential is accidentally committed:

1. revoke/rotate it
2. remove it from the repository
3. remove it from history where necessary
4. replace it with a new credential

Deleting a line from the latest commit is not sufficient if the secret remains in Git history.

---

# 11. Copernicus Credentials

Copernicus Marine credentials are server-side credentials.

They must only be used by:

- data acquisition tooling
- backend ingestion tooling
- controlled server-side workflows

The frontend must never receive:

```text
COPERNICUS_USERNAME
COPERNICUS_PASSWORD
```

The deployed MVP does not need to contact Copernicus on every visualization request if the required scientific subset has already been acquired locally.

---

# 12. Scientific Data Packaging

The current scientific files include:

```text
glorys12v1_bob_202401.nc
argo_bob.nc
```

These files should not automatically be committed to Git.

Repository policy:

```gitignore
*.nc
*.nc4
*.cdf
```

Scientific datasets should be provisioned separately.

---

# 13. Data Deployment Options

There are three practical deployment options.

## Option A — Server-local datasets

```text
Backend
  ↓
/data/scientific/
  ↓
NetCDF
```

Best for:

- SIH prototype
- deterministic demo
- simple deployment

This should be the default MVP approach.

---

## Option B — Object Storage

Future:

```text
Object Storage
      ↓
Backend
      ↓
Scientific subset
```

Useful when datasets become larger.

Possible storage systems:

- S3-compatible storage
- cloud object storage
- institutional storage

Not required for the initial MVP.

---

## Option C — Remote Scientific Services

Future:

```text
Copernicus / OPeNDAP / WCS / WMS
          ↓
Backend adapter
          ↓
NIRIKSHAN API
```

This supports live/remote scientific data.

It should not be required for the hackathon demo.

---

# 14. Backend Data Root

The backend should not hardcode absolute developer-machine paths.

Bad:

```python
DATA_ROOT = "/Users/prince/Downloads/..."
```

Correct:

```python
DATA_ROOT = os.getenv(
    "DATA_ROOT",
    "backend/data/scientific"
)
```

Deployment should configure the actual path.

---

# 15. Dataset Registry

Datasets should be registered through configuration/metadata.

Example:

```json
{
  "id": "glorys12v1_bob_202401",
  "name": "GLORYS12V1 Bay of Bengal",
  "source": "Copernicus Marine",
  "path": "...",
  "variables": ["thetao", "uo", "vo"],
  "timeStart": "2024-01-01T00:00:00",
  "timeEnd": "2024-01-10T00:00:00"
}
```

The application should not scatter dataset paths across multiple services.

---

# 16. Dataset Activation

A dataset should be considered active only after validation.

Recommended lifecycle:

```text
Dataset received
      ↓
Validate
      ↓
Inspect dimensions
      ↓
Validate variables
      ↓
Validate coordinates
      ↓
Validate time
      ↓
Validate readability
      ↓
Activate
```

Do not activate partially downloaded scientific files.

---

# 17. Atomic Dataset Updates

Future dataset updates should follow:

```text
new file
   ↓
temporary location
   ↓
validation
   ↓
atomic activation
```

Never replace the active dataset with an unvalidated file.

---

# 18. Backend Server

FastAPI should run behind a production ASGI server.

Recommended:

```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

For production environments, an appropriate process manager/container runtime may be used.

The exact deployment command should remain environment-specific.

---

# 19. Frontend Build

Production frontend:

```bash
npm install
npm run build
```

The resulting static assets should be served by:

- Vercel
- Netlify
- Cloudflare Pages
- Nginx
- another static hosting platform

The exact provider is not part of the scientific architecture.

---

# 20. Recommended MVP Deployment

For SIH:

```text
Frontend
Vercel/static host
        │
        │ HTTPS
        ▼
FastAPI Backend
        │
        ▼
Scientific Dataset
        │
        ├── GLORYS12V1
        └── Argo
```

This keeps deployment understandable for judges and team members.

---

# 21. HTTPS

Production deployment should use HTTPS.

Required for:

- frontend
- backend API
- external API requests

Do not deploy the production demo over plain HTTP unless the environment is strictly local.

---

# 22. CORS

Backend CORS must not default to unrestricted production access.

Development:

```text
http://localhost:5173
```

Production:

```text
https://your-frontend-domain
```

Recommended:

```env
ALLOWED_ORIGINS=https://your-frontend-domain
```

The backend should parse multiple origins if required.

---

# 23. Development CORS

Local development may use:

```text
http://localhost:5173
http://127.0.0.1:5173
```

This should be explicitly configured.

Do not assume production should use:

```text
*
```

---

# 24. API Exposure

Only required API routes should be publicly exposed.

Current core routes:

```text
GET /api/observations
GET /api/model-field
GET /api/profile
GET /api/sar/drift
```

Future administrative/data-ingestion endpoints should not automatically become public.

---

# 25. Data Ingestion Endpoints

If future ingestion APIs are created, they should be separated from public read APIs.

Example:

```text
Public:
GET /api/...

Internal:
POST /internal/ingestion/...
```

Do not expose dataset replacement operations without authentication and authorization.

For the MVP, ingestion can remain a controlled CLI/server process.

---

# 26. API Validation

Every API parameter should be validated.

Examples:

```text
latitude
longitude
depth
timestamp
variable
observation_id
duration
timestep
```

Reject malformed inputs early.

Do not allow arbitrary filesystem paths through API parameters.

---

# 27. Path Traversal Protection

Never allow a client to specify:

```text
../../some/file
```

as a dataset path.

Dataset IDs should map to known registry entries.

Bad:

```text
GET /api/model-field?file=/some/path
```

Preferred:

```text
GET /api/model-field?dataset=glorys12v1_bob_202401
```

The server resolves the dataset internally.

---

# 28. Input Limits

Apply reasonable bounds.

Examples:

```text
depth:
within dataset depth range

duration:
reasonable maximum

timestep:
positive and bounded

spatial bbox:
maximum area

profile:
bounded size
```

This prevents accidental requests that consume excessive resources.

---

# 29. SAR Abuse Protection

SAR is computationally inexpensive at current scale, but future configurations may become more expensive.

Apply limits such as:

```text
maximum duration
maximum timestep resolution
maximum trajectory length
```

Do not allow arbitrary simulation parameters to create unlimited workloads.

---

# 30. Request Timeout

Scientific API requests should have reasonable timeouts.

A request that hangs indefinitely is worse than a clear failure.

Frontend:

```text
request
 ↓
timeout/cancellation
 ↓
clear error
```

Backend should also avoid unbounded operations.

---

# 31. Rate Limiting

For the SIH prototype, sophisticated distributed rate limiting is not required.

If the application becomes publicly accessible, consider:

- reverse-proxy rate limits
- API gateway limits
- per-IP limits
- authenticated quotas

Do not add Redis/Kafka/etc solely for the hackathon.

---

# 32. Security Headers

Production HTTP responses should consider:

```text
Content-Security-Policy
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
Strict-Transport-Security
```

Exact CSP configuration must account for:

- Cesium assets
- CARTO
- API domain
- WebGL
- required external resources

Do not copy a restrictive CSP without testing the application.

---

# 33. Content Security Policy

CSP should be introduced carefully.

Potential required sources may include:

```text
self
frontend assets
backend API
Cesium services
CARTO services
```

The final policy must be tested against:

- globe loading
- basemap loading
- WebGL
- API requests
- profile rendering

Avoid using:

```text
script-src *
```

as a permanent solution.

---

# 34. Dependency Security

Dependencies should be kept reasonably current.

Before deployment:

```text
npm audit
```

and Python dependency checks should be considered.

Do not blindly upgrade all packages immediately before a demo.

Dependency upgrades can introduce regressions.

---

# 35. Lockfiles

Commit dependency lockfiles.

Frontend:

```text
package-lock.json
```

or the project's chosen package manager lockfile.

Python:

```text
poetry.lock
```

or equivalent.

This ensures reproducible installation.

---

# 36. Docker Strategy

Docker may be used for the backend.

Example architecture:

```text
Docker
 └── FastAPI
      ├── Python
      ├── xarray
      ├── NetCDF libraries
      └── scientific engine
```

The dataset may be mounted separately:

```text
/app/data/scientific
```

Do not necessarily bake large NetCDF files into the Docker image.

---

# 37. Backend Dockerfile Principles

The Docker image should:

- use a maintained Python base image
- install only required dependencies
- avoid development tools in production
- run as a non-root user where practical
- define a clear working directory
- expose the application port
- use deterministic dependency installation

---

# 38. Container User

Where practical:

```text
root
 ↓
create application user
 ↓
run FastAPI
```

The application should not require root privileges to read scientific data.

---

# 39. Read-Only Scientific Data

If the application only reads scientific datasets during runtime:

```text
dataset mount = read-only
```

This reduces accidental modification risk.

---

# 40. File Permissions

Scientific datasets should be readable by the backend process.

They should not require:

```text
chmod 777
```

Avoid world-writable dataset directories.

---

# 41. Health Endpoint

Provide:

```text
GET /health
```

Expected:

```json
{
  "status": "ok"
}
```

This checks that the service is alive.

---

# 42. Readiness Endpoint

Provide a more meaningful readiness check:

```text
GET /ready
```

It should verify:

- application initialized
- dataset registry loaded
- active scientific dataset available
- required files readable

Example:

```json
{
  "status": "ready",
  "datasets": {
    "glorys12v1_bob_202401": "available",
    "argo_bob": "available"
  }
}
```

---

# 43. Health vs Readiness

Do not confuse:

```text
/health
```

with:

```text
/ready
```

Health:

> Is the process alive?

Readiness:

> Can the application currently serve scientific requests?

---

# 44. Startup Validation

On backend startup:

```text
Start
 ↓
Load configuration
 ↓
Validate data root
 ↓
Load dataset registry
 ↓
Validate active datasets
 ↓
Initialize services
 ↓
Ready
```

If a required dataset is missing:

```text
application should report NOT READY
```

rather than silently pretending the dataset exists.

---

# 45. Logging

Logs should include:

```text
timestamp
level
request
route
dataset
operation
duration
result
```

Example:

```text
INFO model-field dataset=glorys12v1_bob_202401
variable=thetao
time=2024-01-05
depth=100
duration_ms=72
```

---

# 46. Logging Restrictions

Never log:

- passwords
- access tokens
- session secrets
- private credentials

Avoid logging unnecessary personal information.

---

# 47. Scientific Error Logging

When a scientific operation fails, log enough information to reproduce it.

Example:

```text
ERROR model-match
observation_id=argo_123
lat=12.4
lon=88.2
time=2024-01-05T00:00:00
reason=no valid model state within tolerance
```

This is preferable to:

```text
ERROR something failed
```

---

# 48. Frontend Error Reporting

The UI should present useful errors without exposing internal stack traces.

Bad:

```text
Traceback...
File "/app/backend/..."
```

Good:

```text
Model field unavailable for the selected time and depth.
```

Detailed information belongs in developer logs.

---

# 49. Deployment Configuration

Separate:

```text
development
staging
production
```

At minimum:

```text
development
production
```

Development may use:

```text
localhost
debug logging
relaxed CORS
```

Production should use:

```text
HTTPS
restricted CORS
production logging
validated datasets
```

---

# 50. Staging Environment

If time permits, use a staging deployment before the final SIH demo.

Flow:

```text
Local
 ↓
Staging
 ↓
Validation
 ↓
Production demo
```

This prevents discovering deployment problems immediately before judging.

---

# 51. Production Build Checklist

Before deploying:

```text
[ ] npm run build
[ ] backend tests pass
[ ] dataset validation passes
[ ] scientific smoke test passes
[ ] environment variables configured
[ ] CORS configured
[ ] HTTPS active
[ ] health endpoint works
[ ] readiness endpoint works
[ ] real datasets available
[ ] no secrets committed
[ ] frontend API URL correct
[ ] Cesium works
[ ] CARTO works
[ ] WebGL works
```

---

# 52. Demo Deployment Checklist

Immediately before the SIH demo:

```text
[ ] Open production URL
[ ] Globe loads
[ ] Basemap loads
[ ] GLORYS field loads
[ ] Argo observations load
[ ] Observation selection works
[ ] Profile loads
[ ] Residual loads
[ ] Derived features load
[ ] Current vectors load
[ ] SAR simulation works
[ ] Replay works
[ ] Provenance is visible
```

---

# 53. Demo Dataset Strategy

The production demo should use a known validated scientific subset.

Current intended dataset:

```text
GLORYS12V1
Bay of Bengal
2024-01-01 → 2024-01-10
```

and:

```text
Argo
Bay of Bengal subset
```

Do not make the demo dependent on downloading data live during judging.

---

# 54. Offline Resilience

The core scientific demonstration should continue working if the data acquisition service is unavailable.

The deployed backend should already contain the validated demo datasets.

External services may still be required for:

- basemap
- external tiles

But scientific analysis should not require a live Copernicus download during the demo.

---

# 55. Basemap Dependency

The application should treat basemap as contextual infrastructure.

If the basemap fails:

```text
scientific data
+
observation
+
analytical panels
```

should remain recoverable where possible.

Do not make the entire scientific engine dependent on a decorative/contextual map layer.

---

# 56. CARTO API Key

The CARTO key currently used by the frontend is client-side.

Therefore:

```text
VITE_CARTO_API_KEY
```

must be considered public.

The CARTO account should apply restrictions/limits appropriate to a browser-exposed key where supported.

Do not describe it internally as a secret credential.

---

# 57. Cesium Token

Similarly:

```text
VITE_CESIUM_ION_ACCESS_TOKEN
```

is delivered to the browser.

Use provider-side restrictions where supported.

If the token has usage limits, configure them appropriately for the SIH demo.

---

# 58. Repository Security

Before final submission:

```bash
git status
git ls-files
```

Check for:

```text
.env
credentials
private keys
password files
large accidental datasets
__pycache__
```

Also inspect recent commits if credentials may have been committed historically.

---

# 59. Git History Security

If a credential was ever committed:

```text
Remove from current files
+
Rotate credential
+
Rewrite history if necessary
```

Do not assume:

```text
git rm file
```

removes the credential from Git history.

---

# 60. Backup Strategy

Keep at least:

```text
Source code
Scientific dataset
Environment configuration template
Dataset manifest
Deployment configuration
```

in controlled locations.

Do not rely exclusively on a developer's laptop.

---

# 61. Recovery Strategy

If production deployment fails:

```text
Deployment failure
 ↓
Check health endpoint
 ↓
Check readiness endpoint
 ↓
Check logs
 ↓
Check environment
 ↓
Check dataset path
 ↓
Check CORS
 ↓
Check frontend API URL
```

If the latest deployment is unstable:

```text
rollback
```

to the last validated deployment.

---

# 62. Resource Limits

Production backend should have explicit resource expectations.

Monitor:

- RAM
- CPU
- disk
- request duration
- dataset size

The application should not assume unlimited memory.

---

# 63. Large Dataset Future

When scaling beyond the current subset:

```text
Current MVP
local NetCDF
     ↓
larger datasets
     ↓
chunked storage
     ↓
object storage
     ↓
remote scientific services
```

Do not redesign the MVP around infrastructure that is not currently required.

---

# 64. Database Policy

A database is not required for the current scientific MVP.

The current application can operate from:

```text
NetCDF
+
in-memory/application state
```

A database may be introduced later for:

- user accounts
- saved snapshots
- collaboration
- metadata catalogs
- audit logs

Do not add PostgreSQL merely because it appears in the long-term architecture.

---

# 65. Authentication

Authentication is not required for the SIH MVP unless deployment requirements demand it.

The prototype should prioritize:

- scientific functionality
- reproducibility
- stable demo
- data integrity

If authentication is added later, it must not expose scientific credentials to the browser.

---

# 66. Authorization

If administrative features are added later:

```text
viewer
analyst
administrator
```

may be introduced.

For MVP:

```text
public scientific read access
+
private data administration
```

is sufficient.

---

# 67. Security vs Hackathon Complexity

Do not overengineer security.

Avoid introducing:

- Kubernetes
- service meshes
- complex identity systems
- distributed secret managers
- multiple databases
- Kafka
- Redis clusters

unless a real requirement exists.

The goal is:

> secure enough, reproducible, maintainable, and demonstrable.

---

# 68. Recommended SIH Deployment

Recommended final architecture:

```text
                    INTERNET
                       │
                       ▼
                HTTPS Frontend
                 React/Vite
                       │
                       │ HTTPS
                       ▼
                FastAPI Backend
                       │
             ┌─────────┴─────────┐
             │                   │
        Scientific Engine     Dataset Registry
             │                   │
             └─────────┬─────────┘
                       │
              Local validated data
                 ┌─────┴─────┐
                 │           │
             GLORYS12V1    Argo
```

External contextual service:

```text
Frontend
   │
   ├── Cesium
   └── CARTO
```

External scientific acquisition:

```text
Controlled server/admin process
            ↓
      Copernicus Marine
```

not:

```text
Browser
   ↓
Copernicus credentials
```

---

# 69. Deployment Definition of Done

Security and deployment work is complete when:

- [ ] Frontend and backend are clearly separated.
- [ ] VITE variables are treated as public.
- [ ] Copernicus credentials remain server-side.
- [ ] `.env` is ignored.
- [ ] `.env.example` exists.
- [ ] NetCDF datasets are provisioned separately from Git.
- [ ] Dataset activation requires validation.
- [ ] Backend paths are configurable.
- [ ] CORS is configurable and restricted in production.
- [ ] API parameters are validated.
- [ ] Dataset paths cannot be controlled by users.
- [ ] Health endpoint exists.
- [ ] Readiness endpoint exists.
- [ ] Startup dataset validation exists.
- [ ] Production HTTPS is enabled.
- [ ] Logs do not expose secrets.
- [ ] Frontend production build succeeds.
- [ ] Backend tests pass.
- [ ] Scientific smoke test passes.
- [ ] Real GLORYS and Argo data are available in deployment.
- [ ] Demo does not require live Copernicus downloads.
- [ ] External basemap failure does not invalidate scientific data.
- [ ] Deployment can be reproduced by another team member.
- [ ] A validated rollback/deployment path exists.

---

# 70. Final Deployment Principle

NIRIKSHAN should be deployable by another team member without relying on undocumented knowledge from the original developer.

The deployment chain must therefore be:

```text
Clone
 ↓
Install dependencies
 ↓
Configure environment
 ↓
Provision validated datasets
 ↓
Run validation
 ↓
Start backend
 ↓
Build frontend
 ↓
Connect frontend → backend
 ↓
Run smoke test
 ↓
Deploy
```

The final system should be:

> **scientifically reproducible, operationally simple, secure by default, and reliable enough to survive the SIH demonstration.**
```
