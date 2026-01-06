// ============================================
// ADITYA TRIVEDI - PORTFOLIO
// Advanced Cyberpunk/Web3 Interface
// ============================================

// ============================================
// CUSTOM CURSOR
// ============================================
class CustomCursor {
    constructor() {
        this.dot = document.querySelector('.cursor-dot');
        this.ring = document.querySelector('.cursor-ring');
        this.mouseX = 0;
        this.mouseY = 0;
        this.ringX = 0;
        this.ringY = 0;

        this.init();
    }

    init() {
        if (!this.dot || !this.ring) return;

        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            this.dot.style.left = this.mouseX + 'px';
            this.dot.style.top = this.mouseY + 'px';
        });

        this.animate();
        this.setupHoverEffects();
    }

    animate() {
        this.ringX += (this.mouseX - this.ringX) * 0.15;
        this.ringY += (this.mouseY - this.ringY) * 0.15;

        this.ring.style.left = this.ringX + 'px';
        this.ring.style.top = this.ringY + 'px';

        requestAnimationFrame(() => this.animate());
    }

    setupHoverEffects() {
        const hoverElements = document.querySelectorAll('a, button, .domain-card, .project-card, .publication-card, .ongoing-card, .card-link, .project-link, .resume-download-btn');

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.ring.classList.add('hover');
            });

            el.addEventListener('mouseleave', () => {
                this.ring.classList.remove('hover');
            });
        });
    }
}

// ============================================
// MATRIX RAIN EFFECT
// ============================================
class MatrixRain {
    constructor() {
        this.canvas = document.getElementById('matrix-rain');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = new Array(this.columns).fill(1);
    }

    animate() {
        this.ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#00f5ff';
        this.ctx.font = this.fontSize + 'px monospace';

        for (let i = 0; i < this.drops.length; i++) {
            const text = this.characters[Math.floor(Math.random() * this.characters.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;

            this.ctx.fillText(text, x, y);

            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }

            this.drops[i]++;
        }

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// 3D SPACE BACKGROUND (Three.js)
// ============================================
class SpaceBackground {
    constructor() {
        this.canvas = document.getElementById('space-canvas');
        if (!this.canvas || typeof THREE === 'undefined') return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.stars = null;
        this.nebulae = [];
        this.wormhole = null;
        this.mouseX = 0;
        this.mouseY = 0;

        this.init();
    }

    init() {
        this.setupScene();
        this.createStarField();
        this.createNebulae();
        this.createWormhole();
        this.setupEventListeners();
        this.animate();
    }

    setupScene() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            2000
        );
        this.camera.position.z = 5;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
    }

    createStarField() {
        const geometry = new THREE.BufferGeometry();
        const starCount = 3000;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;

            // Spherical distribution
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 300 + Math.random() * 700;

            positions[i3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = r * Math.cos(phi);

            // Star colors (blue, cyan, white, yellow)
            const colorChoice = Math.random();
            if (colorChoice < 0.3) {
                colors[i3] = 0;
                colors[i3 + 1] = 0.96;
                colors[i3 + 2] = 1;
            } else if (colorChoice < 0.6) {
                colors[i3] = 1;
                colors[i3 + 1] = 1;
                colors[i3 + 2] = 1;
            } else if (colorChoice < 0.8) {
                colors[i3] = 0.75;
                colors[i3 + 1] = 0;
                colors[i3 + 2] = 1;
            } else {
                colors[i3] = 1;
                colors[i3 + 1] = 0.8;
                colors[i3 + 2] = 0.4;
            }

            sizes[i] = Math.random() * 2 + 0.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            sizeAttenuation: true
        });

        this.stars = new THREE.Points(geometry, material);
        this.scene.add(this.stars);
    }

    createNebulae() {
        const nebulaConfigs = [
            { x: -200, y: 100, z: -400, color: 0x00f5ff, size: 150 },
            { x: 250, y: -80, z: -350, color: 0xbf00ff, size: 120 },
            { x: -100, y: -150, z: -500, color: 0xff00a8, size: 100 }
        ];

        nebulaConfigs.forEach(config => {
            const geometry = new THREE.PlaneGeometry(config.size, config.size);
            const material = new THREE.MeshBasicMaterial({
                color: config.color,
                transparent: true,
                opacity: 0.08,
                side: THREE.DoubleSide
            });

            for (let i = 0; i < 5; i++) {
                const plane = new THREE.Mesh(geometry, material.clone());
                plane.material.opacity = 0.08 - i * 0.015;
                plane.position.set(
                    config.x + (Math.random() - 0.5) * 50,
                    config.y + (Math.random() - 0.5) * 50,
                    config.z + (Math.random() - 0.5) * 50
                );
                plane.rotation.set(
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI
                );
                plane.scale.setScalar(1 + i * 0.3);
                this.nebulae.push(plane);
                this.scene.add(plane);
            }
        });
    }

    createWormhole() {
        const geometry = new THREE.TorusGeometry(80, 30, 16, 100);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00f5ff,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });

        this.wormhole = new THREE.Mesh(geometry, material);
        this.wormhole.position.z = -500;
        this.scene.add(this.wormhole);

        // Inner rings
        for (let i = 1; i <= 3; i++) {
            const innerGeometry = new THREE.TorusGeometry(80 - i * 15, 10, 8, 50);
            const innerMaterial = new THREE.MeshBasicMaterial({
                color: i === 1 ? 0xbf00ff : (i === 2 ? 0xff00a8 : 0x00ff88),
                wireframe: true,
                transparent: true,
                opacity: 0.05 + i * 0.02
            });
            const innerRing = new THREE.Mesh(innerGeometry, innerMaterial);
            innerRing.position.z = -500 + i * 30;
            innerRing.userData = { speed: 0.005 * i };
            this.scene.add(innerRing);
            this.nebulae.push(innerRing);
        }
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener('resize', () => this.onResize());
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.001;

        // Rotate stars
        if (this.stars) {
            this.stars.rotation.x += 0.0002;
            this.stars.rotation.y += 0.0003;
        }

        // Animate nebulae
        this.nebulae.forEach((nebula, i) => {
            if (nebula.userData && nebula.userData.speed) {
                nebula.rotation.z += nebula.userData.speed;
            } else {
                nebula.rotation.z += 0.001 * (i % 2 === 0 ? 1 : -1);
            }
        });

        // Animate wormhole
        if (this.wormhole) {
            this.wormhole.rotation.x += 0.003;
            this.wormhole.rotation.y += 0.002;
        }

        // Camera movement based on mouse
        this.camera.position.x += (this.mouseX * 2 - this.camera.position.x) * 0.02;
        this.camera.position.y += (this.mouseY * 2 - this.camera.position.y) * 0.02;
        this.camera.lookAt(0, 0, -300);

        this.renderer.render(this.scene, this.camera);
    }
}

// ============================================
// BOOT SEQUENCE
// ============================================
class BootSequence {
    constructor() {
        this.container = document.getElementById('boot-sequence');
        if (!this.container) return;

        this.lines = document.querySelectorAll('.boot-line');
        this.progressFill = document.querySelector('.progress-fill');
        this.progressText = document.querySelector('.progress-text');
        this.currentStep = 0;

        this.init();
    }

    init() {
        this.animateBootSequence();
    }

    animateBootSequence() {
        const totalSteps = this.lines.length;
        const stepDuration = 500;

        const animateStep = () => {
            if (this.currentStep < totalSteps) {
                const line = this.lines[this.currentStep];
                line.classList.add('active');

                const progress = ((this.currentStep + 1) / totalSteps) * 100;
                this.progressFill.style.width = progress + '%';
                this.progressText.textContent = Math.round(progress) + '%';

                this.currentStep++;
                setTimeout(animateStep, stepDuration);
            } else {
                setTimeout(() => this.hideBootSequence(), 800);
            }
        };

        setTimeout(animateStep, 500);
    }

    hideBootSequence() {
        this.container.classList.add('hidden');
        setTimeout(() => {
            this.container.style.display = 'none';
        }, 1000);
    }
}

// ============================================
// NAVIGATION SYSTEM
// ============================================
class Navigation {
    constructor() {
        this.currentSection = 'home';
        this.navLinks = document.querySelectorAll('.nav-link');
        this.mobileLinks = document.querySelectorAll('.mobile-link');
        this.sections = document.querySelectorAll('.section');
        this.navToggle = document.querySelector('.nav-toggle');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.domainCards = document.querySelectorAll('.domain-card');
        this.ctaLinks = document.querySelectorAll('.cta-primary, .cta-secondary');

        this.init();
    }

    init() {
        // Desktop nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('href').substring(1);
                this.navigateTo(section);
            });
        });

        // Mobile nav links
        this.mobileLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('href').substring(1);
                this.navigateTo(section);
                this.closeMobileMenu();
            });
        });

        // Mobile toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Domain cards
        this.domainCards.forEach(card => {
            card.addEventListener('click', () => {
                const domain = card.getAttribute('data-domain');
                this.navigateTo(domain);
            });
        });

        // CTA links
        this.ctaLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    this.navigateTo(href.substring(1));
                }
            });
        });
    }

    navigateTo(sectionId) {
        if (sectionId === this.currentSection) return;

        // Hide current section
        this.sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show new section
        setTimeout(() => {
            const newSection = document.getElementById(sectionId);
            if (newSection) {
                newSection.classList.add('active');
                this.currentSection = sectionId;
                this.updateActiveLinks(sectionId);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 150);
    }

    updateActiveLinks(sectionId) {
        // Update desktop links
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + sectionId) {
                link.classList.add('active');
            }
        });

        // Update mobile links
        this.mobileLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + sectionId) {
                link.classList.add('active');
            }
        });
    }

    toggleMobileMenu() {
        this.mobileMenu.classList.toggle('active');
    }

    closeMobileMenu() {
        this.mobileMenu.classList.remove('active');
    }
}

// ============================================
// PROJECT MODAL SYSTEM
// ============================================
class ProjectModal {
    constructor() {
        this.modal = document.getElementById('project-modal');
        if (!this.modal) return;

        this.modalTitle = this.modal.querySelector('.modal-title');
        this.modalBody = this.modal.querySelector('.modal-body');
        this.modalClose = this.modal.querySelector('.modal-close');
        this.modalBackdrop = this.modal.querySelector('.modal-backdrop');

        this.projectCards = document.querySelectorAll('.project-card, .project-featured, .publication-card, .ongoing-card');

        this.projectData = this.getProjectData();

        this.init();
    }

    init() {
        this.projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking on external link or card-link
                if (e.target.closest('.pub-link') || e.target.closest('.card-link') || e.target.closest('.project-link')) return;

                const projectId = card.getAttribute('data-project');
                if (projectId && this.projectData[projectId]) {
                    this.openModal(projectId);
                }
            });
        });

        this.modalClose.addEventListener('click', () => this.closeModal());
        this.modalBackdrop.addEventListener('click', () => this.closeModal());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    openModal(projectId) {
        const project = this.projectData[projectId];
        this.modalTitle.textContent = project.title;
        this.modalBody.innerHTML = project.content;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    getProjectData() {
        return {
            gsoc: {
                title: 'Google Summer of Code 2025 - OpenMP 6.0',
                content: `
                    <h4>Open Source Contributor | May 2025 - Present</h4>
                    <p><strong>Organization:</strong> LFortran (under NumFOCUS)</p>
                    <p><strong>Tech Stack:</strong> C++, Fortran, OpenMP 6.0, CUDA, GPU Computing</p>

                    <h5>Project Scope</h5>
                    <p>Implementing next-generation OpenMP 6.0 features with GPU target offloading capabilities for the LFortran compiler, enabling advanced parallel computing on heterogeneous systems.</p>

                    <h5>Major Contributions</h5>
                    <ul>
                        <li>Designed and refactored <strong>OMPRegion-based Abstract Semantic Representation (ASR)</strong> architecture</li>
                        <li>Implemented <strong>13+ OpenMP constructs</strong> covering thread, team, and task parallelism</li>
                        <li>Developed <strong>8+ OpenMP clauses</strong> for comprehensive parallel programming support</li>
                        <li>Extended C-backend for <strong>OpenMP Target Offloading on NVIDIA GPUs</strong></li>
                        <li>Built lightweight GPU emulator as runtime library for testing and development</li>
                    </ul>

                    <h5>Links & Resources</h5>
                    <p><a href="https://gsoc-blogs-5vgw.vercel.app/" target="_blank">GSoC Development Blogs</a></p>
                    <p><a href="https://gist.github.com/adit4443ya/9364dfff705d880cd64a77ea98f8cb9c" target="_blank">Final Project Evaluation</a></p>
                `
            },
            lfortran: {
                title: 'LFortran Compiler Development',
                content: `
                    <h4>Compiler Development Engineer | Sept 2024 - Present</h4>
                    <p><strong>Organization:</strong> LFortran Project</p>
                    <p><strong>Tech Stack:</strong> C++, Fortran, OpenMP, Python, MPI</p>

                    <h5>Project Overview</h5>
                    <p>Leading compiler optimization efforts for the LFortran project, focusing on MPI-based scientific computing applications and performance improvements.</p>

                    <h5>Key Achievements</h5>
                    <ul>
                        <li><strong>0.95x compilation speedup</strong> and <strong>0.75x runtime performance</strong> improvement compared to GFortran for POT3D codebase</li>
                        <li>Built pure Fortran-based MPI wrappers using ISO_C_BINDING, eliminating C-wrapper overhead</li>
                        <li>Implemented <strong>30+ MPI subroutine implementations</strong> for enhanced parallel computing support</li>
                        <li>Resolved <strong>50+ compiler issues</strong> across domains including OpenMP, OOPs, Structs, and Strings</li>
                    </ul>

                    <h5>Links & Resources</h5>
                    <p><a href="https://github.com/lfortran/lfortran" target="_blank">GitHub Repository</a></p>
                    <p><a href="https://lfortran.org/blog/2025/03/lfortran-compiles-pot3d/" target="_blank">POT3D Compilation Blog</a></p>
                `
            },
            riscv: {
                title: 'RISC-V Llama Inference Optimization',
                content: `
                    <h4>Parallel Computing Research | May 2025 - Aug 2025</h4>
                    <p><strong>Focus:</strong> Edge Computing & Parallel LLM Inference</p>
                    <p><strong>Tech Stack:</strong> C++, OpenMP, MPI, RISC-V Assembly, Edge Computing</p>

                    <h5>Research Objective</h5>
                    <p>Evaluated and optimized parallel inference strategies for transformer models (15M-1B parameters) on resource-constrained RISC-V architecture.</p>

                    <h5>Key Results</h5>
                    <ul>
                        <li>Achieved <strong>3.42x speedup</strong> using intra-layer MPI parallelization</li>
                        <li>Outperformed traditional OpenMP by <strong>19.6%</strong> for 110M parameter models</li>
                        <li>Optimized memory usage for edge devices</li>
                    </ul>

                    <h5>Links & Resources</h5>
                    <p><a href="https://github.com/adit4443ya/llama2.c" target="_blank">Source Code</a></p>
                    <p><a href="https://llama-parallel-inference-presentati.vercel.app/" target="_blank">Research Presentation</a></p>
                `
            },
            'distributed-ml': {
                title: 'Distributed ML Framework for Fraud Detection',
                content: `
                    <h4>ML Systems Engineer | Feb 2025 - Apr 2025</h4>
                    <p><strong>Focus:</strong> Privacy-Preserving Federated Learning</p>
                    <p><strong>Tech Stack:</strong> Python, Azure ML, TensorFlow, LSTM, Federated Learning</p>

                    <h5>Project Overview</h5>
                    <p>Architected a privacy-preserving federated learning system on Microsoft Azure for credit card fraud detection with differential privacy guarantees.</p>

                    <h5>Key Achievements</h5>
                    <ul>
                        <li><strong>92% accuracy</strong> while maintaining privacy constraints</li>
                        <li>Reduced training time by <strong>73%</strong></li>
                        <li>Differential privacy with <strong>ε ≈ 1.5</strong> budget</li>
                    </ul>

                    <h5>Links & Resources</h5>
                    <p><a href="https://github.com/adit4443ya/Distributed-Learning-on-Cloud" target="_blank">Source Code</a></p>
                `
            },
            musify: {
                title: 'Musify Music Recommendation System',
                content: `
                    <h4>ML Engineer | Ongoing Project</h4>
                    <p><strong>Focus:</strong> AI-Powered Music Classification & Recommendation</p>
                    <p><strong>Tech Stack:</strong> Python, Machine Learning, Audio Processing</p>

                    <h5>Key Features</h5>
                    <ul>
                        <li>Genre classification achieving <strong>92.42% accuracy</strong> using LightGBM</li>
                        <li>Audio feature extraction with Librosa</li>
                        <li>Recommendation using cosine similarity, t-SNE, PCA, and LDA</li>
                    </ul>

                    <h5>Links & Resources</h5>
                    <p><a href="https://github.com/adit4443ya/Musify" target="_blank">Source Code</a></p>
                `
            },
            workhub: {
                title: 'WorkHubPro Enterprise Task Management',
                content: `
                    <h4>Full-Stack Developer | Feb 2024 - Aug 2024</h4>
                    <p><strong>Focus:</strong> Enterprise-Grade Project Management</p>
                    <p><strong>Tech Stack:</strong> Kotlin, Jetpack Compose, Go, PostgreSQL, WebSockets</p>

                    <h5>Key Achievements</h5>
                    <ul>
                        <li><strong>140+ commits</strong> across frontend and backend</li>
                        <li>Real-time WebSocket updates for collaboration</li>
                        <li>Role-based access control (RBAC) security</li>
                        <li>Sub-second response times</li>
                    </ul>

                    <h5>Links & Resources</h5>
                    <p><a href="https://github.com/adit4443ya/WorkHub-Pro" target="_blank">Source Code</a></p>
                `
            },
            crawler: {
                title: 'Multi-Threaded Web Crawler',
                content: `
                    <h4>Systems Programmer | Completed</h4>
                    <p><strong>Focus:</strong> High-Performance Web Scraping</p>
                    <p><strong>Tech Stack:</strong> C++, Curl, Gumbo Parser, Multi-threading</p>

                    <h5>Key Features</h5>
                    <ul>
                        <li>Multi-threaded parallel crawling</li>
                        <li>Configurable crawl depth</li>
                        <li>HTML parsing with Gumbo</li>
                        <li>JSON metadata extraction</li>
                    </ul>

                    <h5>Links & Resources</h5>
                    <p><a href="https://github.com/adit4443ya/Multi-Threaded-Crawling" target="_blank">Source Code</a></p>
                `
            },
            paper4: {
                title: 'Fast MIS on Dynamic Graphs',
                content: `
                    <h4>EuroMicro PDP 2025 | Conference Full Paper</h4>
                    <p><strong>Authors:</strong> P. Nijhara, <strong>Aditya Trivedi</strong>, D.S. Banerjee</p>

                    <h5>Abstract</h5>
                    <p>Novel parallel data structures for computing MIS on dynamic graphs with batched edge insertions and deletions.</p>

                    <h5>Key Contributions</h5>
                    <ul>
                        <li><strong>15.64x speedup</strong> for insertions</li>
                        <li><strong>10.57x speedup</strong> for deletions</li>
                        <li>Evaluated on graphs with <strong>50M to 1.2B edges</strong></li>
                    </ul>

                    <h5>Links</h5>
                    <p><a href="https://ieeexplore.ieee.org/document/10974793/" target="_blank">IEEE Xplore Paper</a></p>
                `
            },
            paper5: {
                title: 'Fast MIS on Incremental Graphs',
                content: `
                    <h4>IEEE HiPC 2024 | Conference SRS Paper</h4>
                    <p><strong>Authors:</strong> <strong>Aditya Trivedi</strong>, P. Nijhara, D.S. Banerjee</p>

                    <h5>Key Innovations</h5>
                    <ul>
                        <li><strong>TVB (Tuple Valued Bitmap)</strong>: Novel data structure</li>
                        <li><strong>TVBL</strong>: Extended TVB for hierarchical graphs</li>
                        <li>Processed graphs with <strong>1.2B edges</strong></li>
                    </ul>

                    <h5>Links</h5>
                    <p><a href="https://ieeexplore.ieee.org/document/10898364/" target="_blank">IEEE Xplore Paper</a></p>
                `
            },
            paper1: {
                title: 'ParMIS: Fast and Unified MIS Maintenance Framework',
                content: `
                    <h4>Elsevier FGCS 2025 | Journal Paper (Under Review)</h4>
                    <p><strong>Authors:</strong> P. Nijhara, <strong>Aditya Trivedi</strong>, A.H. Singh, N. Sharma, A. Pandey, D.S. Banerjee</p>

                    <h5>Framework Innovations</h5>
                    <ul>
                        <li>First unified framework for all dynamic MIS update scenarios</li>
                        <li>GPU streaming pipeline for billion-scale graphs</li>
                        <li><strong>47.27x batch speedup</strong></li>
                        <li><strong>4.63x GPU speedup</strong></li>
                    </ul>
                `
            },
            paper2: {
                title: 'Fast and Accurate MIS on Dynamic Graphs',
                content: `
                    <h4>IEEE HiPC 2025 | Conference Paper (Under Review)</h4>
                    <p><strong>Authors:</strong> A.H. Singh, <strong>Aditya Trivedi</strong>, N. Sharma, A. Pandey, D.S. Banerjee</p>

                    <h5>Key Innovations</h5>
                    <ul>
                        <li>BFS-based conflict resolution</li>
                        <li>Topologically-ordered execution</li>
                        <li><strong>32.4x speedup</strong></li>
                        <li><strong>100% accuracy</strong></li>
                    </ul>
                `
            },
            'ongoing-research': {
                title: 'Semi-External Parallel Maximal Cliques Maintenance',
                content: `
                    <h4>Ongoing Research Project</h4>
                    <p><strong>Authors:</strong> <strong>Aditya Trivedi</strong>, D. Sharma, A. Mundhara, D.S. Banerjee</p>
                    <p><strong>Advisor:</strong> Dr. Dip Sankar Banerjee, IIT Jodhpur</p>

                    <h5>Abstract</h5>
                    <p>Semi-external framework for maximal clique maintenance in billion-scale dynamic graphs, achieving 150-300x memory reduction with GPU parallelism.</p>

                    <h5>Preliminary Results</h5>
                    <ul>
                        <li><strong>150-300x memory reduction</strong></li>
                        <li>Near-linear speedup</li>
                        <li>Processes billion-edge networks</li>
                    </ul>
                `
            }
        };
    }
}

// ============================================
// COUNTER ANIMATION
// ============================================
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-value[data-count]');
        this.hasAnimated = false;

        this.init();
    }

    init() {
        // Animate on load for hero section
        setTimeout(() => this.animateCounters(), 4500);
    }

    animateCounters() {
        if (this.hasAnimated) return;
        this.hasAnimated = true;

        this.counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-count'));
            const isFloat = target % 1 !== 0;
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = isFloat ? target.toFixed(1) : target;
                }
            };

            updateCounter();
        });
    }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize boot sequence first
    new BootSequence();

    // Initialize other components after boot
    setTimeout(() => {
        new MatrixRain();
        new SpaceBackground();
        new CustomCursor();
    }, 500);

    // Initialize navigation and modals after boot completes
    setTimeout(() => {
        new Navigation();
        new ProjectModal();
        new CounterAnimation();
    }, 3500);

    // Add smooth scroll
    document.documentElement.style.scrollBehavior = 'smooth';
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is hidden
        document.body.classList.add('paused');
    } else {
        document.body.classList.remove('paused');
    }
});
