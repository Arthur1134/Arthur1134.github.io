# Vendor

Three.js **0.160.1** (release r160), MIT license. See `LICENSE`.

- File: `three.min.js`
- Official build: `https://unpkg.com/three@0.160.1/build/three.min.js`
- Source: `https://github.com/mrdoob/three.js/releases/tag/r160`

This is the official browser build. It exposes the global `THREE`, so `index.html` runs from disk without a dev server or a package install. The file logs one deprecation warning because Three.js later dropped this build style. The game still loads it on purpose: a single script tag stays static-file friendly for the itch zip.
