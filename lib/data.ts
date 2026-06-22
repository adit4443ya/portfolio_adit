// ─────────────────────────────────────────────────────────────────────────
// Portfolio content — ported verbatim from the original site so the explorable
// world is populated with real work, not placeholders.
// ─────────────────────────────────────────────────────────────────────────

export type Accent = "amber" | "rose" | "cyan" | "violet";

export type Link = { label: string; href: string };
export type Metric = { value: string; label: string };

export type StationKind =
  | "profile"
  | "trajectory"
  | "work"
  | "research"
  | "projects"
  | "stack"
  | "contact";

export interface Paper {
  year: string;
  tag: string;
  stage: string;
  title: string;
  authors: string;
  href?: string;
}

export interface Project {
  code: string;
  name: string;
  tech: string;
  desc: string;
  metric?: string;
  metricLabel?: string;
  href: string;
}

export interface StackBand {
  n: string;
  group: string;
  items: string[];
}

export interface TrajectoryArc {
  title: string;
  detail: string;
}

export interface Station {
  id: string;
  code: string; // e.g. "SECTOR 01"
  label: string; // short tag for the world label, e.g. "IDENTITY"
  accent: Accent;
  kind: StationKind;
  position: [number, number, number];
  title: string;
  tech?: string;
  lede?: string;
  paragraphs?: string[];
  metrics?: Metric[];
  links?: Link[];
  trajectory?: TrajectoryArc[];
  papers?: Paper[];
  projects?: Project[];
  stack?: StackBand[];
  channels?: Link[];
}

export const profile = {
  name: "Aditya Trivedi",
  role: "Compiler Engineer",
  stamp: "Compiler Engineer · Low-level systems · IIT Jodhpur ’26",
  tagline:
    "I build the layer between language and silicon — compiler IR, parallel runtimes, and GPU offloading.",
};

export const stations: Station[] = [
  {
    id: "about",
    code: "SECTOR 01",
    label: "IDENTITY",
    accent: "amber",
    kind: "profile",
    position: [0, 0, -16],
    title: "Aditya Trivedi",
    tech: "Compiler Engineer · Low-level systems · IIT Jodhpur ’26",
    lede: "I build the layer between language and silicon — compiler IR, parallel runtimes, and GPU offloading.",
    paragraphs: [
      "GSoC ’25 at Fortran-Lang, core LFortran contributor, four published papers, with early LLVM upstream contributions.",
      "Joining Qualcomm’s ARM compiler team in July 2026 — chasing MLIR & ML compilers along the way.",
    ],
    metrics: [
      { value: "4", label: "Papers · HiPC, EuroPDP, FGCS" },
      { value: "’25", label: "GSoC · Fortran-Lang" },
      { value: "50+", label: "LFortran issues resolved" },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/adit4443ya" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/adit4443ya/" },
      { label: "GSoC Blog", href: "https://gsoc-blogs-5vgw.vercel.app/" },
    ],
  },
  {
    id: "trajectory",
    code: "SECTOR 02",
    label: "TRAJECTORY",
    accent: "cyan",
    kind: "trajectory",
    position: [-24, 0, -4],
    title: "Trajectory",
    lede: "Where I’ve been pointing — and where I’m headed next.",
    trajectory: [
      {
        title: "Open-source compilers",
        detail:
          "LFortran core contributor · LLVM / ClangIR upstream · GSoC ’25 with Fortran-Lang.",
      },
      {
        title: "Qualcomm — ARM compiler team",
        detail:
          "Joining as a Compiler Engineer in July 2026. Backend codegen & optimization across Qualcomm’s ARM platforms.",
      },
      {
        title: "MLIR & ML compilers",
        detail:
          "Where I’m pointing my curiosity — tensor IR, accelerator codegen, the ML-compiler stack.",
      },
    ],
  },
  {
    id: "gsoc",
    code: "SECTOR 03",
    label: "FLAGSHIP",
    accent: "rose",
    kind: "work",
    position: [24, 0, -6],
    title: "OpenMP 6.0 & GPU Offloading in LFortran",
    tech: "C++ · Fortran · OpenMP · CUDA · LLVM / ASR",
    lede: "GSoC ’25 — building OpenMP deep enough to enable GPU execution of Fortran.",
    paragraphs: [
      "LFortran is a from-scratch Fortran compiler targeting LLVM and C backends. My GSoC project built OpenMP deep enough to eventually enable GPU execution of Fortran — something no open-source Fortran compiler handles cleanly today.",
      "The architectural decision: I proposed and implemented a dedicated OMPRegion ASR node — giving OpenMP first-class representation in the IR tree, unlocking structurally clean nested and hierarchical parallelism.",
      "On that foundation: 13+ constructs and 8+ clauses across thread, team, and task models — then extended the C-backend to emit compilable host-device code for OpenMP Target Offloading on NVIDIA GPUs. A custom GPU emulator under 250 lines handles CI without physical hardware.",
    ],
    metrics: [
      { value: "13+", label: "OpenMP constructs end-to-end" },
      { value: "8+", label: "Clauses · thread/team/task" },
      { value: "12wk", label: "Documented compiler work" },
    ],
    links: [
      { label: "GSoC Blog · 12 weeks", href: "https://gsoc-blogs-5vgw.vercel.app/" },
      {
        label: "Discussion",
        href: "https://github.com/lfortran/lfortran/issues/4497#issuecomment-3089155987",
      },
    ],
  },
  {
    id: "lfortran",
    code: "SECTOR 04",
    label: "OPEN SOURCE",
    accent: "amber",
    kind: "work",
    position: [30, 0, 16],
    title: "LFortran Compiler — Core Contributor",
    tech: "Fortran · MPI · ISO_C_BINDING · LLVM",
    lede: "Production-grade compiler engineering, upstream.",
    paragraphs: [
      "Contributed to compiling POT3D — Predictive Science’s MPI + OpenMP solar magnetic-field solver used in real space-weather research. The 9th production-grade third-party code LFortran ever compiled.",
      "Built a pure-Fortran MPI wrapper library using ISO_C_BINDING with 30+ subroutine implementations — eliminating C-wrapper overhead. It now lives in the fortran_mpi repo under the lfortran org.",
      "Separately: 50+ compiler issues resolved across OpenMP, OOP, structs, and strings — plus a merged ClangIR x86 rdtsc / rdtscp builtins PR (#180714) in the LLVM monorepo.",
    ],
    metrics: [
      { value: "50+", label: "Compiler issues resolved" },
      { value: "30+", label: "MPI subroutines, pure Fortran" },
      { value: "9th", label: "3rd-party code LFortran compiled" },
    ],
    links: [
      {
        label: "Commits",
        href: "https://github.com/lfortran/lfortran/commits?author=adit4443ya",
      },
      { label: "fortran_mpi", href: "https://github.com/lfortran/fortran_mpi/" },
      { label: "ClangIR PR #180714", href: "https://github.com/llvm/llvm-project/pull/180714" },
    ],
  },
  {
    id: "research",
    code: "SECTOR 05",
    label: "RESEARCH",
    accent: "rose",
    kind: "research",
    position: [0, 0, 30],
    title: "Four papers, one problem.",
    lede: "Maintaining a Maximal Independent Set on dynamic graphs as edges are inserted and deleted — at billion-edge scale — with parallel GPU and multi-core compute.",
    metrics: [
      { value: "15.64×", label: "Speedup on insertions" },
      { value: "10.57×", label: "Speedup on deletions" },
    ],
    papers: [
      {
        year: "2024",
        tag: "IEEE HiPC",
        stage: "Origin",
        title: "Fast MIS on Incremental Graphs",
        authors: "Aditya Trivedi, P. Nijhara, D.S. Banerjee",
        href: "https://ieeexplore.ieee.org/document/10898364",
      },
      {
        year: "2025",
        tag: "EuroMicro PDP",
        stage: "Extends",
        title: "Fast Maximal Independent Sets on Dynamic Graphs",
        authors: "P. Nijhara, Aditya Trivedi, D.S. Banerjee",
        href: "https://www.researchgate.net/publication/391309268_Fast_Maximal_Independent_Sets_on_Dynamic_Graphs",
      },
      {
        year: "2025",
        tag: "IEEE HiPC",
        stage: "Refines",
        title: "Fast and Accurate MIS on Dynamic Graphs",
        authors: "A.H. Singh, Aditya Trivedi, N. Sharma, A. Pandey, D.S. Banerjee",
        href: "https://ieeexplore.ieee.org/document/10898364",
      },
      {
        year: "2025",
        tag: "Elsevier FGCS · Under Review",
        stage: "Unifies",
        title: "ParMIS: Fast & Unified MIS Maintenance for Large-Scale Dynamic Graphs",
        authors: "P. Nijhara, Aditya Trivedi, A.H. Singh, N. Sharma, A. Pandey, D.S. Banerjee",
      },
    ],
  },
  {
    id: "projects",
    code: "SECTOR 06",
    label: "CATALOG",
    accent: "cyan",
    kind: "projects",
    position: [-30, 0, 18],
    title: "Systems work, bottom-up.",
    lede: "Six objects in the catalog — architecture, concurrency, HPC, ML, and full-stack.",
    projects: [
      {
        code: "PRJ·001 — ARCHITECTURE",
        name: "MIPS Pipeline Simulator",
        tech: "C++ · Computer Architecture",
        desc: "Cycle-accurate 5-stage MIPS pipeline with hazard detection, forwarding, and branch prediction — modeling stalls and data dependencies at the microarchitecture level.",
        href: "https://github.com/adit4443ya",
      },
      {
        code: "PRJ·002 — CONCURRENCY",
        name: "Multi-Threaded Web Crawler",
        tech: "Go · Concurrency · Channels",
        desc: "Concurrent crawler with a worker pool, bounded queues, and graceful backpressure — tuned for throughput without overwhelming target hosts.",
        href: "https://github.com/adit4443ya",
      },
      {
        code: "PRJ·003 — HPC · LLM",
        name: "Parallel LLM Inference on RISC-V",
        tech: "C · RISC-V · OpenMP · SIMD",
        desc: "Optimized transformer inference on a RISC-V target — vectorized kernels and threading delivering a 3.42× speedup over the baseline.",
        metric: "3.42×",
        metricLabel: "speedup over baseline inference",
        href: "https://github.com/adit4443ya",
      },
      {
        code: "PRJ·004 — ML · PRIVACY",
        name: "Federated Fraud Detection",
        tech: "Python · Federated Learning",
        desc: "Privacy-preserving fraud model trained across distributed nodes without centralizing sensitive transaction data — federated aggregation end-to-end.",
        href: "https://github.com/adit4443ya",
      },
      {
        code: "PRJ·005 — FULL-STACK",
        name: "WorkHubPro",
        tech: "React · Node · PostgreSQL",
        desc: "Full-stack workspace and project-management platform — auth, role-based access, and real-time collaboration features.",
        href: "https://github.com/adit4443ya",
      },
      {
        code: "PRJ·006 — OPEN SOURCE",
        name: "fortran_mpi",
        tech: "Fortran · MPI · ISO_C_BINDING",
        desc: "Pure-Fortran MPI wrapper library, 30+ subroutines, eliminating C-wrapper overhead. Maintained under the LFortran organization.",
        metric: "30+",
        metricLabel: "MPI subroutines, pure Fortran",
        href: "https://github.com/lfortran/fortran_mpi/",
      },
    ],
  },
  {
    id: "stack",
    code: "SECTOR 07",
    label: "INSTRUMENTS",
    accent: "violet",
    kind: "stack",
    position: [-20, 0, -32],
    title: "The tools I reach for.",
    stack: [
      { n: "01", group: "Languages", items: ["C", "C++", "Fortran", "Rust", "Go", "Kotlin", "Python"] },
      { n: "02", group: "Parallel & HPC", items: ["OpenMP", "CUDA", "MPI", "SIMD", "Pthreads"] },
      { n: "03", group: "Compilers & IR", items: ["LLVM", "MLIR", "ClangIR", "ASR / IR design", "Codegen"] },
      { n: "04", group: "Architectures", items: ["AArch64 / ARM", "ARMv9", "RISC-V", "x86"] },
      { n: "05", group: "Exploring", items: ["MLIR", "ML Compilers", "Tensor IR", "Accelerators"] },
    ],
  },
  {
    id: "contact",
    code: "SECTOR 08",
    label: "CHANNELS",
    accent: "amber",
    kind: "contact",
    position: [20, 0, -32],
    title: "Let’s talk compilers.",
    lede: "Not job hunting — joining Qualcomm’s ARM compiler team in July 2026. But always open to community conversations and open-source collaboration. If you work on MLIR, ML compilers, LLVM, or parallel runtimes — or just want to talk IR design — reach out.",
    channels: [
      { label: "Email", href: "mailto:adit4443ya@gmail.com" },
      { label: "GitHub", href: "https://github.com/adit4443ya" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/adit4443ya/" },
      {
        label: "Résumé",
        href: "https://drive.google.com/file/u/0/d/1rebI8SXe8pjzczuKqacmOeyYnYRHAf_g/view",
      },
    ],
  },
];

export const stationById = (id: string | null) =>
  id ? stations.find((s) => s.id === id) ?? null : null;
