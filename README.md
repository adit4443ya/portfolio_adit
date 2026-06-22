# Aditya Trivedi — Explorable 3D Portfolio

An award-style, **drivable 3D portfolio world** (Bruno Simon–inspired). Steer a
rover across a dark "observatory sector," roll up to glowing monoliths, and
inspect each area of work — compilers, HPC, research, and projects.

Built with **Next.js + React Three Fiber + Rapier physics + GSAP**.

## 🛠 Tech stack

| Layer | Tech |
|---|---|
| Framework | **Next.js 16** (App Router) + React 19 + TypeScript |
| 3D engine | **Three.js** + **@react-three/fiber** + **@react-three/drei** |
| Physics | **@react-three/rapier** (arcade rover + collisions) |
| Post-processing | **@react-three/postprocessing** (Bloom + Vignette) |
| Animation | **GSAP** (UI transitions) + **maath** (camera damping) |
| State | **Zustand** |
| Smooth scroll | **Lenis** (available for future scroll UI) |

## 🚀 Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also type-checks)
npm start          # serve the production build
```

## 🎮 Controls

- **W A S D** / arrow keys — drive
- **Shift** — boost
- **E** / Enter — inspect the nearest sector (or click the on-screen prompt)
- **Esc** — close a panel
- On touch devices, on-screen drive buttons appear automatically.

## ✨ Interactions & polish

- **Radar minimap** (bottom-right) showing all sectors + your live heading
- **Distinct animated emblem per sector** (graph for research, equalizer for the
  stack, stacked cubes for projects, signal rings for contact, …)
- **Rover feel**: body lean into turns, brake lights, a glowing motion trail,
  and a boost FOV kick
- **Procedural engine sound** (Web Audio, no files) with a mute toggle (top-right)
- **Central landmark + boundary ring** for orientation

## 🧭 How it works

You spawn in the world and drive between **stations** (the glowing monoliths).
A proximity check highlights the nearest one and shows an "inspect" prompt;
opening it slides in a panel with the full content for that sector.

```
app/
  layout.tsx          # fonts + metadata
  page.tsx            # mounts the canvas (client-only) + UI overlays
  globals.css         # the cosmic-observatory visual theme
components/
  Experience.tsx      # <Canvas>, physics world, post-processing
  three/              # Rover, FollowCamera, Ground, Lights, Station(s),
                      # ProximityManager, Decor, Effects
  ui/                 # LoadingScreen, Intro, Hud, StationPanel, MobileControls
lib/
  data.ts             # ALL portfolio content (edit this to update the site)
  store.ts            # Zustand game/UI state
  carState.ts         # shared rover transform (rover → camera/proximity)
  palette.ts          # accent colours
hooks/
  useIsTouch.ts
legacy/               # the previous static HTML/CSS/JS portfolio (preserved)
```

## ✏️ Editing content

All copy lives in [`lib/data.ts`](lib/data.ts). Each entry in the `stations`
array becomes a monolith in the world:

- `position: [x, y, z]` — where it sits in the world
- `accent` — `amber | rose | cyan | violet`
- `kind` — controls how its panel renders (`profile`, `work`, `research`,
  `projects`, `stack`, `contact`, `trajectory`)

Add a station to the array and a new monolith appears automatically.

## 🧱 Adding real 3D assets later

The world is currently built from code primitives. To drop in downloaded or
AI-generated models (e.g. low-poly packs from Quaternius / Kenney, or Meshy),
add a `.glb` to `public/`, load it with drei's `useGLTF`, and place it in the
scene (Draco/Meshopt-compressed models are supported). No Blender/Spline
required to start.

## ☁️ Deployment

Zero-config on **Vercel** — import the repo and deploy. It's a standard Next.js
app.

---

Built by Aditya Trivedi · the previous static portfolio is preserved in `legacy/`.
