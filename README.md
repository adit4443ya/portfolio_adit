# Aditya Trivedi - Professional Portfolio

A modern, interactive portfolio website showcasing my work in High-Performance Computing, Machine Learning, Systems Engineering, and Research.

## 🚀 Live Demo

Visit the live portfolio: [Your Vercel URL will be here]

## 🛠 Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **3D Graphics**: Three.js — ray-marched gravitational-lensing black hole (Supernova world) + a modern photoreal object layer
- **Photoreal layer**: modern Three.js (bundled by Vite) with RoomEnvironment image-based lighting, ACES tone-mapping, PBR metals, real transmission glass, and UnrealBloom post-processing
- **Motion**: GSAP + ScrollTrigger and Lenis smooth-scroll
- **Styling**: Custom CSS with CSS Grid and Flexbox
- **Fonts**: Instrument Serif, Space Grotesk & JetBrains Mono from Google Fonts

## 🌗 Dual worlds (theme toggle)

- **✦ Supernova** — a blazing stellar core with orbiting chrome + molten debris that ignite into view as you scroll.
- **❄ Cryo** — an absolute-zero scene of faceted, refractive glass-ice crystals with bloom.

## 💻 Develop & build

```bash
npm install        # install three + vite
npm run dev        # local dev server with the photoreal layer
npm run build      # production build → dist/
npm run preview    # preview the production build
```

> The base experience (black hole + procedural object layer) works from the raw
> `index.html` with no build. The **photoreal layer** requires the Vite build —
> deploy the contents of `dist/`. If served unbuilt, the site gracefully falls
> back to the procedural layer.

### Optional real assets
Drop files into `public/assets/` to upgrade to real models / HDRI (auto-loaded
with a procedural fallback): `env.hdr`, `supernova.glb`, `cryo.glb`. See
`public/assets/README.md`.

## 📋 Features

- **Interactive Space Background**: Dynamic 3D star field with mouse interaction
- **Smooth Page Transitions**: Seamless navigation between sections
- **Responsive Design**: Optimized for all device sizes
- **Loading Animation**: Professional loading screen with progress indicators
- **Project Showcases**: Detailed project cards with metrics and achievements
- **Research Publications**: Academic papers with abstracts and metrics
- **Professional Timeline**: Career progression and achievements

## 🎯 Sections

1. **Home**: Introduction and domain navigation
2. **HPC & Parallel Computing**: Compiler development, OpenMP, GPU computing
3. **Machine Learning**: Distributed learning, federated systems, AI applications
4. **Systems & Infrastructure**: Enterprise platforms, web crawlers, system programming
5. **Research & Publications**: Academic research in graph algorithms and parallel computing
6. **About**: Professional background, education, and technical expertise

## 🔬 Research Highlights

- **ParMIS Framework**: 47.27× speedup for batch MIS updates on billion-scale graphs
- **Dynamic Graph Algorithms**: Novel data structures (TVB/TVBL) for MIS maintenance
- **GPU Acceleration**: 4.63× speedup on GPU implementations
- **Publications**: IEEE HiPC, under review in top-tier venues

## 🏆 Key Achievements

- Google Summer of Code 2025 Contributor
- JEE Advanced Rank: 2989
- IEEE HiPC'24 ₹15k Grant Receiver
- Multiple research publications in parallel computing

## 📱 Contact

- **Email**: adit4443ya@gmail.com
- **Phone**: +91 9510676850
- **GitHub**: [adit4443ya](https://github.com/adit4443ya)

## 🚀 Deployment

Build first, then deploy the `dist/` output:

1. `npm install && npm run build`
2. Deploy the `dist/` folder (Vercel: set build command `npm run build`, output dir `dist`; GitHub Pages: publish `dist/`).
3. `base: './'` in `vite.config.js` keeps asset paths relative, so it works on any host/subpath.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ by Aditya Trivedi