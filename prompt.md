I want to make a FINAL BRANDING + VISUAL IDENTITY PASS on the existing NIRIKSHAN ocean visualization prototype.

IMPORTANT:
This is NOT a feature-development task.
This is NOT a redesign of the scientific application.
Do NOT change scientific logic, calculations, data, APIs, workflows, routes, SAR methodology, model/observation matching, persistence, or existing functionality.

The goal is to transform the current product identity from:

NIRIKSHAN

to:

NIRIKSHAN

while making the interface feel like a serious, premium, institutional scientific product suitable for a Smart India Hackathon final demonstration.

==================================================
1. PRODUCT NAME
==================================================

Replace the USER-FACING product name:

NIRIKSHAN

with:

NIRIKSHAN

Use:

NIRIKSHAN

as the primary brand name.

Do a careful repository-wide audit for user-facing occurrences of NIRIKSHAN.

Update occurrences in:
- application header
- logo/wordmark
- browser title
- visible metadata
- landing/opening state
- empty states
- demo-facing copy
- visible documentation references
- user-facing accessibility labels where appropriate
- any other visible product branding

DO NOT blindly rename internal identifiers, API fields, scientific IDs, filenames, variables, routes, database keys, or code identifiers if doing so could break functionality.

The scientific engine and implementation should remain untouched.

==================================================
2. BRAND POSITIONING
==================================================

NIRIKSHAN should feel like:

A professional ocean intelligence / scientific analysis workspace.

The visual identity should communicate:

- observation
- analysis
- evidence
- decision support
- scientific precision
- institutional trust
- ocean/environmental intelligence

Avoid making it look like:
- an AI startup
- a gaming application
- a futuristic cyber interface
- a generic SaaS dashboard
- a crypto/Web3 product
- a sci-fi HUD

The product should look like something that could realistically be used by:
- oceanographers
- INCOIS scientists
- disaster-management teams
- researchers
- operational analysts

==================================================
3. LOGO / WORDMARK
==================================================

Create a proper NIRIKSHAN logo.

This should NOT simply be text saying "NIRIKSHAN".

Design a minimal geometric symbol/mark that can work independently from the wordmark.

Preferred conceptual direction:

A geometric "N" / observation mark inspired subtly by:
- ocean current flow
- scientific observation
- depth layers
- navigation
- analytical convergence
- a point being transformed into a decision

The concept should remain abstract and sophisticated.

DO NOT literally draw:
- a cartoon wave
- a globe icon
- a satellite
- a compass
- an AI brain
- a robot
- a generic analytics graph

The logo should be:

- minimal
- geometric
- intelligent
- institutional
- memorable
- scalable
- recognizable at small sizes

Think closer to the identity system of a serious scientific/engineering organization than a startup logo.

Create:
1. primary logo
2. compact icon/mark
3. wordmark treatment
4. monochrome version if useful

The logo must work on both dark and light backgrounds.

Do not use:
- gradients
- glow
- glass effects
- 3D effects
- excessive rounded shapes
- neon colors
- decorative particles

Keep the geometry extremely clean.

==================================================
4. TYPOGRAPHY
==================================================

I have uploaded the font file:

cbs_font-sans-variable.woff2

Use this exact uploaded font as the primary NIRIKSHAN interface typeface.

Add it to the project's public asset structure.

For example:

public/
  fonts/
    cbs-font-sans-variable.woff2

Create a proper @font-face declaration.

Use a clear family name such as:

"NIRIKSHAN Sans"

or another appropriate internal family name.

Make sure the variable font is used correctly.

Use this font for:
- product branding
- headings
- navigation
- buttons
- interface labels
- descriptive UI text
- important numbers where appropriate

If the existing monospace typeface is being used for:
- coordinates
- scientific values
- timestamps
- dataset identifiers
- technical metadata

you may KEEP the monospace font there.

The goal is not to remove the scientific/data typography hierarchy.

Typography should feel:
- precise
- modern
- restrained
- highly legible
- institutional

Do NOT introduce another display font.

==================================================
5. COLOR SYSTEM
==================================================

I have also provided a palette reference image.

Use these exact supplied colors as the NIRIKSHAN design system:

#212A31
#FFFFFF
#124E66
#748D92
#E8EEF1
#F8FAFB
#0A0F14
#17191B
#8AC6D0
#000000
#F5F4F0

Create centralized design tokens / CSS variables.

Do NOT scatter these hex values throughout the codebase.

Create a clear source of truth, for example:

--NIRIKSHAN-graphite: #212A31;
--NIRIKSHAN-white: #FFFFFF;
--NIRIKSHAN-deep-teal: #124E66;
--NIRIKSHAN-slate: #748D92;
--NIRIKSHAN-mist: #E8EEF1;
--NIRIKSHAN-cloud: #F8FAFB;
--NIRIKSHAN-ink: #0A0F14;
--NIRIKSHAN-surface: #17191B;
--NIRIKSHAN-aqua: #8AC6D0;
--NIRIKSHAN-black: #000000;
--NIRIKSHAN-warm: #F5F4F0;

You may create semantic aliases such as:

--color-background
--color-surface
--color-border
--color-text
--color-muted
--color-primary
--color-accent

but they must reference the NIRIKSHAN palette tokens.

Example:

--color-primary: var(--NIRIKSHAN-deep-teal);

Do NOT randomly introduce additional brand colors.

Existing semantic warning/error colors may remain if required for usability and scientific clarity, but keep them restrained and visually compatible with the new system.

==================================================
6. VISUAL DIRECTION
==================================================

The existing product already has a serious scientific/operational aesthetic.

Preserve that direction.

NIRIKSHAN should feel:

CALM
PRECISE
SCIENTIFIC
INSTITUTIONAL
PREMIUM
OPERATIONAL

Use:
- flat surfaces
- subtle borders
- restrained contrast
- strong typographic hierarchy
- generous whitespace where appropriate
- precise alignment
- small-radius or restrained geometry
- subtle interaction states
- strong information hierarchy

Avoid:
- neon cyan glow
- purple gradients
- glassmorphism
- glowing borders
- excessive rounded cards
- floating dashboard cards everywhere
- giant hero gradients
- particles
- futuristic HUD elements
- unnecessary shadows
- excessive animations
- "AI-looking" UI

The product should feel expensive because of its restraint and precision.

==================================================
7. HEADER / BRAND APPLICATION
==================================================

Update the primary application header.

Replace the current NIRIKSHAN branding with the new NIRIKSHAN logo + wordmark.

Recommended hierarchy:

[ NIRIKSHAN LOGO ]  NIRIKSHAN

3D OCEAN ANALYSIS / RESPONSE WORKSPACE

or use the existing product descriptor if already present and appropriate.

Do not overcrowd the header.

The logo should be visually recognizable but not oversized.

Make the brand feel like an actual product identity rather than a text label.

==================================================
8. BROWSER / METADATA
==================================================

Update user-facing metadata:

Document title:

NIRIKSHAN — 3D Ocean Analysis & Response Workspace

Use the existing product description/meta structure where applicable.

Do not change backend/API metadata unless it is explicitly user-facing.

==================================================
9. PUBLIC ASSET ORGANIZATION
==================================================

Create a clean branding asset structure.

Prefer something like:

public/
  branding/
    NIRIKSHAN-logo.svg
    NIRIKSHAN-mark.svg
    NIRIKSHAN-logo-light.svg
    NIRIKSHAN-logo-dark.svg
    NIRIKSHAN-palette-reference.png

  fonts/
    cbs-font-sans-variable.woff2

If the existing project structure has a better established asset location, follow that instead.

The uploaded palette reference image should also be copied into the public asset structure for documentation/reference.

Do not add unnecessary assets.

==================================================
10. SVG QUALITY
==================================================

If you create the logo as SVG:

- use clean vector geometry
- no embedded raster image
- no unnecessary metadata
- no excessive path complexity
- ensure it scales cleanly
- ensure it works at approximately 16–24px
- ensure it works at larger presentation sizes
- ensure dark/light variants are readable

The mark should still look good when rendered in a single color.

==================================================
11. RESPONSIVENESS
==================================================

Make sure the new branding works at:

- desktop
- 1440px
- 1920px
- 2560px
- smaller laptop screens

Do not allow the new wordmark to create header overflow.

Do not change the existing responsive architecture unnecessarily.

==================================================
12. ACCESSIBILITY
==================================================

Add appropriate:
- alt text
- aria-labels where required
- sufficient contrast
- focus states

Do not use color alone to communicate important scientific information.

==================================================
13. VERY IMPORTANT — PRESERVE FUNCTIONALITY
==================================================

Do NOT modify:

- GLORYS12V1 data
- Argo data
- model-observation comparison
- nearest-neighbor matching
- residual calculations
- thermocline/MLD calculations
- current vectors
- SAR simulation
- Euler integration
- snapshot persistence
- API endpoints
- backend routes
- data ingestion
- scientific engine
- test data
- demo workflow

This task is ONLY:

BRAND + TYPOGRAPHY + COLOR SYSTEM + LOGO + USER-FACING PRODUCT NAME.

==================================================
14. FINAL VISUAL AUDIT
==================================================

After implementation, inspect the application as a human designer would.

Ask:

Does this look like a real scientific product?

Does NIRIKSHAN feel like a coherent brand?

Does the logo look custom rather than AI-generated?

Does the typography feel intentional?

Does the color palette feel consistent?

Is the interface still restrained?

Does anything look unnecessarily decorative?

Does the product still feel like a serious INCOIS/ocean-science tool?

Remove anything that feels:
- generic
- flashy
- AI-generated
- decorative
- excessive

==================================================
15. VERIFICATION
==================================================

After completing the branding pass:

1. Search the repository for visible "NIRIKSHAN" references.
2. Confirm all user-facing occurrences have become NIRIKSHAN.
3. Confirm the uploaded font is actually loaded by the browser.
4. Confirm the logo renders correctly.
5. Confirm dark/light logo contrast.
6. Confirm no layout overflow.
7. Run frontend lint.
8. Run frontend build.
9. Run the existing backend/scientific test suite to ensure nothing was accidentally affected.
10. Do NOT change tests merely to make them pass.

If anything fails because of the branding changes, fix it properly.

==================================================
16. IMPORTANT DESIGN PRINCIPLE
==================================================

DO NOT make the product look "more futuristic".

Make it look MORE REAL.

The final result should communicate:

"NIRIKSHAN is a serious scientific instrument for understanding ocean conditions and supporting operational decisions."

Not:

"Here is another AI dashboard."

Use restraint as the primary design tool.

==================================================
DELIVERABLE
==================================================

When finished, report:

1. Files changed
2. Logo asset locations
3. Font asset location
4. Where the centralized color tokens live
5. All major user-facing NIRIKSHAN → NIRIKSHAN replacements
6. Build result
7. Lint result
8. Test result
9. Any remaining NIRIKSHAN references and why they were intentionally retained

Do not make any unrelated changes.