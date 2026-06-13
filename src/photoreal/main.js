/* ════════════════════════════════════════════════════════════════════════
   PHOTOREAL LAYER  ·  modern Three.js (ES module, bundled by Vite)
   ------------------------------------------------------------------------
   Real graphics pipeline used by product-viewer / game sites:
     • RoomEnvironment image-based lighting (HDRI-quality, zero assets)
     • ACES filmic tone-mapping + sRGB output
     • PBR metals (Supernova) and real transmission glass (Cryo)
     • UnrealBloom post-processing (Cryo, opaque pass)
     • Optional GLTF model + .hdr environment drop-ins with auto-fallback
     • Scroll-driven reveal + cinematic orbiting/descending camera
   Renders on its own #bg-photoreal canvas and retires the legacy r128
   object layer once ready, so failure here never breaks the base site.
   ════════════════════════════════════════════════════════════════════════ */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

const BASE = import.meta.env.BASE_URL || './';
const ASSETS = {
  hdr: BASE + 'assets/env.hdr',
  supernova: BASE + 'assets/supernova.glb',
  cryo: BASE + 'assets/cryo.glb',
};

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = innerWidth < 760;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const themeNow = () => (document.documentElement.getAttribute('data-theme') === 'gpu' ? 'cryo' : 'super');

class Photoreal {
  constructor(canvas) {
    this.canvas = canvas;
    this.mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    this.scrollY = 0;
    this.theme = themeNow();

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2));
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setClearAlpha(0);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 500);
    this.camera.position.set(0, 6, 48);
    this.clock = new THREE.Clock();

    // ── Image-based lighting (procedural HDRI) ──
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    // a couple of practical lights for directional shaping / specular streaks
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(5, 8, 6); this.scene.add(key);
    const fill = new THREE.DirectionalLight(0x4466ff, 0.8); fill.position.set(-6, -3, 4); this.scene.add(fill);
    this.key = key;

    // opaque backdrop used only in Cryo (so glass refraction + bloom read well)
    this.cryoBg = this._gradientTexture('#0a1c2e', '#01060c');

    this.groups = { super: new THREE.Group(), cryo: new THREE.Group() };
    this.scene.add(this.groups.super, this.groups.cryo);

    this._buildSupernova();
    this._buildCryo();
    this._tryLoadAssets();

    // ── post-processing (used for the opaque Cryo pass) ──
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.7, 0.5, 0.85);
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());

    this._applyTheme(this.theme);
    this._bindEvents();
    this.renderer.setAnimationLoop(() => this._frame());
  }

  _gradientTexture(top, bottom) {
    const c = document.createElement('canvas'); c.width = 4; c.height = 256;
    const g = c.getContext('2d');
    const grad = g.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, top); grad.addColorStop(1, bottom);
    g.fillStyle = grad; g.fillRect(0, 0, 4, 256);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }

  // irregular faceted chunk from a displaced icosahedron
  _chunk(r, detail, amp) {
    const g = new THREE.IcosahedronGeometry(r, detail);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const n = Math.sin(x * 1.7 + 1.3) * Math.cos(y * 2.1) * Math.sin(z * 1.9 + 0.5);
      const k = 1 + n * amp;
      p.setXYZ(i, x * k, y * k, z * k);
    }
    g.computeVertexNormals();
    return g;
  }

  _buildSupernova() {
    const G = this.groups.super;

    // polished chrome monolith — mirrors the environment
    const mono = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 15, 4.2),
      new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.04, envMapIntensity: 1.3 })
    );
    mono.position.set(-15, 0, -6);
    mono.userData = { reveal: -0.12, spin: 0.05 };
    G.add(mono);

    // reflective shards
    for (let i = 0; i < 6; i++) {
      const s = new THREE.Mesh(
        new THREE.OctahedronGeometry(1.4 + Math.random() * 1.0, 0),
        new THREE.MeshStandardMaterial({ color: 0xfff2e6, metalness: 1, roughness: 0.12, envMapIntensity: 1.1 })
      );
      const a = Math.random() * 6.28, rr = 18 + Math.random() * 16, yy = (Math.random() - 0.5) * 26;
      s.position.set(Math.cos(a) * rr, yy, Math.sin(a) * rr);
      s.userData = { reveal: -0.1 + Math.random() * 0.85, spin: (Math.random() - 0.5) * 0.5, a, rr, orb: (0.03 + Math.random() * 0.05) * (Math.random() < 0.5 ? 1 : -1) };
      G.add(s);
    }

    // molten debris — dark rock with glowing embers, lit by the heat
    const rockN = mobile ? 7 : 13;
    for (let i = 0; i < rockN; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0x1a0d07, metalness: 0.25, roughness: 0.72,
        emissive: new THREE.Color(0xff4a12), emissiveIntensity: 0.5,
        envMapIntensity: 0.6, flatShading: true,
      });
      const m = new THREE.Mesh(this._chunk(1.3 + Math.random() * 2.0, 1, 0.34), mat);
      const a = Math.random() * 6.28, rr = 12 + Math.random() * 22, yy = (Math.random() - 0.5) * 30;
      m.position.set(Math.cos(a) * rr, yy, Math.sin(a) * rr);
      m.userData = { reveal: -0.12 + Math.random() * 0.95, spin: (Math.random() - 0.5) * 0.4, a, rr, orb: (0.02 + Math.random() * 0.04) * (Math.random() < 0.5 ? 1 : -1), phase: Math.random() * 6.28, molten: true };
      G.add(m);
    }
  }

  _buildCryo() {
    const G = this.groups.cryo;

    // chrome-ice core cluster
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(6, 1),
      new THREE.MeshStandardMaterial({ color: 0xdff4ff, metalness: 0.95, roughness: 0.03, envMapIntensity: 1.6, flatShading: true })
    );
    core.userData = { reveal: -0.12, spin: 0.06 };
    G.add(core);

    // faceted glass-ice crystals — REAL transmission/refraction
    const iceN = mobile ? 8 : 16;
    for (let i = 0; i < iceN; i++) {
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0xcdeeff, metalness: 0, roughness: 0.03,
        transmission: 1.0, thickness: 2.2, ior: 1.34, // ice IOR
        clearcoat: 1.0, clearcoatRoughness: 0.04,
        envMapIntensity: 1.4, attenuationColor: new THREE.Color(0x8fd0ff), attenuationDistance: 6,
        flatShading: true, transparent: true,
      });
      const m = new THREE.Mesh(this._chunk(1.1 + Math.random() * 2.2, 0, 0.4), mat);
      const a = Math.random() * 6.28, rr = 12 + Math.random() * 22, yy = (Math.random() - 0.5) * 30;
      m.position.set(Math.cos(a) * rr, yy, Math.sin(a) * rr);
      m.userData = { reveal: -0.1 + Math.random() * 0.9, spin: (Math.random() - 0.5) * 0.3, a, rr, orb: (0.015 + Math.random() * 0.03) * (Math.random() < 0.5 ? 1 : -1) };
      G.add(m);
    }
  }

  // optional real assets — silently no-op if absent or blocked
  _tryLoadAssets() {
    new RGBELoader().load(ASSETS.hdr, (tex) => {
      tex.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.environment = tex;
    }, undefined, () => {});

    const gltf = new GLTFLoader();
    const place = (group, model, scale, reveal) => {
      model.traverse((o) => { if (o.isMesh) o.userData.keep = true; });
      model.scale.setScalar(scale);
      model.userData = { reveal, spin: 0.05, hero: true };
      group.add(model);
    };
    gltf.load(ASSETS.supernova, (g) => place(this.groups.super, g.scene, 6, -0.1), undefined, () => {});
    gltf.load(ASSETS.cryo, (g) => place(this.groups.cryo, g.scene, 6, -0.1), undefined, () => {});
  }

  _applyTheme(theme) {
    this.theme = theme;
    this.groups.super.visible = theme === 'super';
    this.groups.cryo.visible = theme === 'cryo';
    this.scene.background = theme === 'cryo' ? this.cryoBg : null; // opaque only for Cryo
  }

  _bindEvents() {
    addEventListener('resize', () => {
      this.camera.aspect = innerWidth / innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(innerWidth, innerHeight);
      this.composer.setSize(innerWidth, innerHeight);
    });
    if (!reduce) {
      addEventListener('pointermove', (e) => { this.mouse.tx = e.clientX / innerWidth - 0.5; this.mouse.ty = e.clientY / innerHeight - 0.5; });
      addEventListener('scroll', () => { this.scrollY = scrollY; }, { passive: true });
    }
    // react to the site's theme toggle without coupling to its code
    new MutationObserver(() => { const t = themeNow(); if (t !== this.theme) this._applyTheme(t); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  _frame() {
    const t = this.clock.getElapsedTime();
    this.mouse.x += (this.mouse.tx - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.ty - this.mouse.y) * 0.05;
    const docH = Math.max(1, document.body.scrollHeight - innerHeight);
    const prog = clamp(this.scrollY / docH, 0, 1);
    const G = this.theme === 'cryo' ? this.groups.cryo : this.groups.super;

    G.children.forEach((o) => {
      const d = o.userData;
      const r = sm(d.reveal ?? 0, (d.reveal ?? 0) + 0.14, prog);
      o.scale.setScalar(Math.max(0.0001, (d.hero ? 6 : 1) * r));
      o.visible = r > 0.01;
      o.rotation.x += (d.spin || 0) * 0.004;
      o.rotation.y += (d.spin || 0) * 0.006;
      if (d.orb !== undefined) { d.a += d.orb * 0.01; o.position.x = Math.cos(d.a) * d.rr; o.position.z = Math.sin(d.a) * d.rr; }
      if (d.molten) o.material.emissiveIntensity = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(t * 1.3 + d.phase));
    });

    // cinematic orbit + descent driven by scroll, with gentle parallax
    const az = 0.5 + prog * Math.PI * 1.5 + this.mouse.x * 0.4;
    const rad = 50 - prog * 16;
    this.camera.position.set(Math.sin(az) * rad, 8 - prog * 20 + this.mouse.y * 5 + Math.sin(t * 0.2) * 0.6, Math.cos(az) * rad);
    this.camera.lookAt(0, -prog * 5, 0);
    this.key.position.set(Math.cos(t * 0.15) * 6, 8, Math.sin(t * 0.15) * 6);

    // Cryo = opaque + bloom (composer). Supernova = transparent over the black hole (direct).
    if (this.theme === 'cryo') this.composer.render();
    else this.renderer.render(this.scene, this.camera);
  }
}

function boot() {
  if (!window.WebGLRenderingContext) return;
  const canvas = document.getElementById('bg-photoreal');
  if (!canvas) return;
  try {
    new Photoreal(canvas);
    window.__photorealActive = true;                 // signal the legacy r128 layer to stand down
    const legacy = document.getElementById('bg-gpu');
    if (legacy) legacy.style.display = 'none';
  } catch (err) {
    console.warn('[photoreal] disabled, falling back to base layer:', err);
  }
}

if (document.readyState === 'complete') boot();
else addEventListener('load', boot);
