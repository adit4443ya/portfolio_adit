# Drop-in photoreal assets (optional)

The photoreal layer runs fully procedurally with image-based lighting
(no assets required). To upgrade to *real* GLTF models + HDRI, drop files
here and they auto-load (with a silent procedural fallback if missing):

- `env.hdr`               — equirectangular HDRI for image-based lighting
                            (e.g. from polyhaven.com, 1k–2k is plenty)
- `supernova.glb`         — hero model shown in the Supernova world
- `cryo.glb`              — hero model shown in the Cryo world

Filenames are configured in `src/photoreal/main.js` (ASSETS constant).
