# Aditya Trivedi - Professional Portfolio

A modern, interactive portfolio website showcasing my work in High-Performance Computing, Machine Learning, Systems Engineering, and Research.

## 🚀 Live Demo

Visit the live portfolio: [Your Vercel URL will be here]

## 🛠 Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **3D Graphics**: Three.js — the **Silicon Cathedral**, a procedural megastructure generated entirely at runtime (no external assets)
- **Motion**: GSAP + ScrollTrigger and Lenis smooth-scroll
- **Styling**: Custom CSS with CSS Grid and Flexbox, blueprint-HUD overlay
- **Fonts**: Instrument Serif, Space Grotesk & JetBrains Mono from Google Fonts

## ◷ The Silicon Cathedral

A single, cohesive theme inspired by high-end gaming worlds. You enter a vast
nave of towering **circuit-pillars** marching toward a glowing **core spire** —
neon edge-lighting, climbing data-bands, drifting wireframe data-cubes, and
ascending sparks. The camera flies deeper down the aisle and rises as you
scroll, while a corner HUD tracks your descent depth. ACES filmic tone-mapping,
additive neon glow, and volumetric fog give it a monumental, technical feel.

Palette: silicon-cyan `#37c8ff` · violet `#8a7bff` · warm gold `#ffcf7a` on a
near-black `#04070e` void.

## 💻 Run

No build step required — the entire experience runs from the raw `index.html`
(Three.js, GSAP and Lenis load from CDNs). Just open `index.html` or serve the
folder statically.

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