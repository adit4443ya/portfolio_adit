// Professional Portfolio - Realistic Space Background
class SpaceBackground {
  constructor () {
    this.scene = null
    this.camera = null
    this.renderer = null
    this.stars = null
    this.mouseX = 0
    this.mouseY = 0

    this.init()
  }

  init () {
    this.setupScene()
    this.createStarField()
    this.setupEventListeners()
    this.animate()
  }

  setupScene () {
    // Scene setup
    this.scene = new THREE.Scene()

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.camera.position.z = 1

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('space-canvas'),
      antialias: true,
      alpha: true
    })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor(0x000000, 0)
  }

  createStarField () {
    const starGeometry = new THREE.BufferGeometry()
    const starCount = 1500
    const positions = new Float32Array(starCount * 3)
    const colors = new Float32Array(starCount * 3)
    const sizes = new Float32Array(starCount)

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3

      // Positions - spread across a large area
      positions[i3] = (Math.random() - 0.5) * 2000
      positions[i3 + 1] = (Math.random() - 0.5) * 2000
      positions[i3 + 2] = (Math.random() - 0.5) * 1000

      // Colors - realistic star colors
      const temp = Math.random()
      if (temp < 0.7) {
        // White/blue-white stars (most common)
        colors[i3] = 0.9 + Math.random() * 0.1
        colors[i3 + 1] = 0.9 + Math.random() * 0.1
        colors[i3 + 2] = 1.0
      } else if (temp < 0.9) {
        // Yellow/orange stars
        colors[i3] = 1.0
        colors[i3 + 1] = 0.8 + Math.random() * 0.2
        colors[i3 + 2] = 0.6 + Math.random() * 0.2
      } else {
        // Red stars
        colors[i3] = 1.0
        colors[i3 + 1] = 0.3 + Math.random() * 0.3
        colors[i3 + 2] = 0.2 + Math.random() * 0.2
      }

      // Sizes - varied star sizes
      sizes[i] = Math.random() * 2 + 0.5
    }

    starGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    )
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const starMaterial = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    })

    this.stars = new THREE.Points(starGeometry, starMaterial)
    this.scene.add(this.stars)
  }

  setupEventListeners () {
    document.addEventListener('mousemove', event => {
      this.mouseX = (event.clientX / window.innerWidth) * 2 - 1
      this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1
    })

    window.addEventListener('resize', () => this.onWindowResize())
  }

  animate () {
    requestAnimationFrame(() => this.animate())

    // Subtle rotation
    if (this.stars) {
      this.stars.rotation.x += 0.0001
      this.stars.rotation.y += 0.0002
    }

    // Subtle camera movement based on mouse
    this.camera.position.x +=
      (this.mouseX * 0.05 - this.camera.position.x) * 0.02
    this.camera.position.y +=
      (this.mouseY * 0.05 - this.camera.position.y) * 0.02
    this.camera.lookAt(this.scene.position)

    this.renderer.render(this.scene, this.camera)
  }

  onWindowResize () {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}
// Navigation System
class Navigation {
  constructor () {
    this.currentPage = 'home'
    this.pages = document.querySelectorAll('.page')
    this.navLinks = document.querySelectorAll('.nav-link')
    this.projectCards = document.querySelectorAll('.project-card')
    this.publicationCards = document.querySelectorAll('.publication-card')

    this.init()
  }

  init () {
    // Navigation link clicks
    this.navLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault()
        const pageId = link.getAttribute('href').substring(1)
        this.navigateToPage(pageId)
      })
    })

    // Project card clicks
    this.projectCards.forEach(card => {
      card.addEventListener('click', () => {
        const projectId = card.getAttribute('data-project')
        this.showProjectModal(projectId)
      })
    })

    // Publication card clicks
    this.publicationCards.forEach(card => {
      card.addEventListener('click', () => {
        const projectId = card.getAttribute('data-project')
        this.showProjectModal(projectId)
      })
    })

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle')
    const navMenu = document.querySelector('.nav-menu')

    if (navToggle) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active')
      })
    }

    // Close mobile menu on link click
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active')
      })
    })

    // Domain card clicks (new)
    const domainCards = document.querySelectorAll('.domain-card')
    console.log('Found domain cards:', domainCards.length)
    domainCards.forEach(card => {
      card.addEventListener('click', () => {
        const domain = card.getAttribute('data-domain')
        console.log('Domain card clicked:', domain)
        this.navigateToPage(domain)
      })
    })
  }

  navigateToPage (pageId) {
    if (pageId === this.currentPage) return

    // Hide current page
    const currentPageEl = document.getElementById(this.currentPage)
    if (currentPageEl) {
      currentPageEl.classList.remove('active')
    }

    // Show new page
    setTimeout(() => {
      const newPageEl = document.getElementById(pageId)
      if (newPageEl) {
        newPageEl.classList.add('active')
        this.currentPage = pageId

        // Update active nav link
        this.updateActiveNavLink(pageId)

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 150)
  }

  updateActiveNavLink (pageId) {
    this.navLinks.forEach(link => {
      link.classList.remove('active')
      if (link.getAttribute('href') === `#${pageId}`) {
        link.classList.add('active')
      }
    })
  }

  showProjectModal (projectId) {
    const modal = document.getElementById('project-modal')
    const modalTitle = modal.querySelector('.modal-title')
    const modalBody = modal.querySelector('.modal-body')

    const projectData = this.getProjectData(projectId)

    modalTitle.textContent = projectData.title
    modalBody.innerHTML = projectData.content

    modal.style.display = 'flex'

    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close')
    closeBtn.onclick = () => {
      modal.style.display = 'none'
    }

    // Close on outside click
    modal.onclick = e => {
      if (e.target === modal) {
        modal.style.display = 'none'
      }
    }

    // Close on escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        modal.style.display = 'none'
      }
    })
  }

  getProjectData (projectId) {
    const projects = {
      lfortran: {
        title: 'LFortran Compiler Development',
        content: `
                    <h4>🚀 Compiler Development Engineer | Sept 2024 - Present</h4>
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
                        <li>Contributed to compiler architecture improvements and code generation optimization</li>
                    </ul>
                    
                    <h5>Technical Contributions</h5>
                    <ul>
                        <li>Advanced compiler optimization techniques for scientific computing workloads</li>
                        <li>MPI integration and parallel computing support enhancement</li>
                        <li>Performance profiling and bottleneck identification</li>
                        <li>Cross-platform compatibility improvements</li>
                    </ul>
                    
                    <h5>Links & Resources</h5>
                    <p>🔗 <a href="https://github.com/lfortran/lfortran/issues?q=commenter%3Aadit4443ya%20sort%3Aupdated-desc%20OR%20author%3Aadit4443ya" target="_blank">GitHub Contributions</a></p>
                    <p>📝 <a href="https://lfortran.org/blog/2025/03/lfortran-compiles-pot3d/" target="_blank">POT3D Compilation Blog</a></p>
                    <p>🧬 <a href="https://github.com/lfortran/fortran_mpi/" target="_blank">Fortran MPI Implementation</a></p>
                `
      },
      riscv: {
        title: 'RISC-V Llama Inference Optimization',
        content: `
                    <h4>🔥 Parallel Computing Research | May 2025 - Aug 2025</h4>
                    <p><strong>Focus:</strong> Edge Computing & Parallel LLM Inference</p>
                    <p><strong>Tech Stack:</strong> C++, OpenMP, MPI, RISC-V Assembly, Edge Computing</p>
                    
                    <h5>Research Objective</h5>
                    <p>Evaluated and optimized parallel inference strategies for transformer models (15M-1B parameters) on resource-constrained RISC-V architecture, focusing on edge computing scenarios.</p>
                    
                    <h5>Key Results</h5>
                    <ul>
                        <li>Achieved <strong>3.42x speedup</strong> using intra-layer MPI parallelization techniques</li>
                        <li>Outperformed traditional OpenMP implementations by <strong>19.6%</strong> for 110M parameter models</li>
                        <li>Optimized memory usage and computational efficiency for edge devices</li>
                        <li>Developed novel parallelization strategies for transformer attention mechanisms</li>
                    </ul>
                    
                    <h5>Technical Innovations</h5>
                    <ul>
                        <li>Intra-layer parallelization for transformer models</li>
                        <li>Memory-efficient attention computation on RISC-V</li>
                        <li>Load balancing algorithms for heterogeneous edge computing</li>
                        <li>Performance profiling and optimization for resource-constrained environments</li>
                    </ul>
                    
                    <h5>Impact & Applications</h5>
                    <ul>
                        <li>Enables efficient LLM inference on edge devices</li>
                        <li>Reduces computational requirements for AI applications</li>
                        <li>Contributes to sustainable AI computing practices</li>
                    </ul>
                    
                    <h5>Links & Resources</h5>
                    <p>💻 <a href="https://github.com/adit4443ya/llama2.c" target="_blank">Source Code Repository</a></p>
                    <p>📊 <a href="https://llama-parallel-inference-presentati.vercel.app/" target="_blank">Research Presentation</a></p>
                `
      },
      gsoc: {
        title: 'Google Summer of Code 2025 - OpenMP 6.0',
        content: `
                    <h4>🌟 Open Source Contributor | May 2025 - Present</h4>
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
                    
                    <h5>Technical Achievements</h5>
                    <ul>
                        <li>Scalable OpenMP 6.0 features support in compiler infrastructure</li>
                        <li>GPU-targeted Fortran code generation and optimization</li>
                        <li>Host-device dual-mode code generation capabilities</li>
                        <li>Integration of OpenMP-CUDA code generation pipeline</li>
                    </ul>
                    
                    <h5>Impact on Open Source Community</h5>
                    <ul>
                        <li>Advancing Fortran compiler technology for modern HPC</li>
                        <li>Enabling GPU computing for scientific applications</li>
                        <li>Contributing to open-source parallel computing ecosystem</li>
                    </ul>
                    
                    <h5>Links & Resources</h5>
                    <p>📝 <a href="https://gsoc-blogs-5vgw.vercel.app/" target="_blank">GSoC Development Blogs</a></p>
                    <p>📋 <a href="https://gist.github.com/adit4443ya/9364dfff705d880cd64a77ea98f8cb9c" target="_blank">Final Project Evaluation</a></p>
                    <p>🔗 <a href="https://github.com/lfortran/lfortran" target="_blank">LFortran Repository</a></p>
                `
      }
    }

    return (
      projects[projectId] || {
        title: 'Project Information',
        content: '<p>Detailed project information will be available soon.</p>'
      }
    )
  }
}

// This section removed - using enhanced initialization below

// Enhanced Space Background with Nebulae and Constellations
class EnhancedSpaceBackground {
  constructor () {
    this.scene = null
    this.camera = null
    this.renderer = null
    this.stars = null
    this.nebulae = []
    this.constellations = []
    this.mouseX = 0
    this.mouseY = 0

    this.init()
  }

  init () {
    this.setupScene()
    this.createStarField()
    this.createNebulae()
    this.createConstellations()
    this.setupEventListeners()
    this.animate()
  }

  setupScene () {
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    )
    this.camera.position.z = 1

    this.renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('space-canvas'),
      antialias: true,
      alpha: true
    })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor(0x000000, 0)
  }

  createStarField () {
    const starGeometry = new THREE.BufferGeometry()
    const starCount = 2000
    const positions = new Float32Array(starCount * 3)
    const colors = new Float32Array(starCount * 3)
    const sizes = new Float32Array(starCount)

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3

      positions[i3] = (Math.random() - 0.5) * 3000
      positions[i3 + 1] = (Math.random() - 0.5) * 3000
      positions[i3 + 2] = (Math.random() - 0.5) * 1500

      const temp = Math.random()
      if (temp < 0.6) {
        colors[i3] = 0.9 + Math.random() * 0.1
        colors[i3 + 1] = 0.9 + Math.random() * 0.1
        colors[i3 + 2] = 1.0
      } else if (temp < 0.8) {
        colors[i3] = 1.0
        colors[i3 + 1] = 0.8 + Math.random() * 0.2
        colors[i3 + 2] = 0.6 + Math.random() * 0.2
      } else {
        colors[i3] = 1.0
        colors[i3 + 1] = 0.3 + Math.random() * 0.3
        colors[i3 + 2] = 0.2 + Math.random() * 0.2
      }

      sizes[i] = Math.random() * 3 + 0.5
    }

    starGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    )
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const starMaterial = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    })

    this.stars = new THREE.Points(starGeometry, starMaterial)
    this.scene.add(this.stars)
  }

  createNebulae () {
    const nebulaConfigs = [
      { position: [-800, 400, -1000], color: 0x4a90e2, size: 300 },
      { position: [600, -300, -800], color: 0x9d4edd, size: 250 },
      { position: [-400, -500, -600], color: 0x06b6d4, size: 200 }
    ]

    nebulaConfigs.forEach(config => {
      const nebula = this.createNebula(config)
      this.nebulae.push(nebula)
      this.scene.add(nebula)
    })
  }

  createNebula (config) {
    const nebulaGroup = new THREE.Group()

    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.PlaneGeometry(
        config.size + i * 50,
        config.size + i * 30
      )
      const material = new THREE.MeshBasicMaterial({
        color: config.color,
        transparent: true,
        opacity: 0.05 - i * 0.01,
        side: THREE.DoubleSide
      })

      const plane = new THREE.Mesh(geometry, material)
      plane.position.set(
        config.position[0] + (Math.random() - 0.5) * 100,
        config.position[1] + (Math.random() - 0.5) * 100,
        config.position[2] + (Math.random() - 0.5) * 100
      )
      plane.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )

      plane.userData = { rotationSpeed: 0.0005 + Math.random() * 0.001 }
      nebulaGroup.add(plane)
    }

    return nebulaGroup
  }

  createConstellations () {
    const constellationData = [
      // Orion-like constellation
      {
        stars: [
          [-200, 300, -500],
          [-150, 250, -500],
          [-100, 200, -500],
          [-180, 180, -500],
          [-120, 150, -500],
          [-160, 120, -500],
          [-140, 100, -500]
        ],
        connections: [
          [0, 1],
          [1, 2],
          [3, 4],
          [4, 5],
          [5, 6],
          [0, 3],
          [2, 4]
        ]
      },
      // Big Dipper-like constellation
      {
        stars: [
          [400, -200, -700],
          [450, -180, -700],
          [500, -160, -700],
          [550, -140, -700],
          [520, -100, -700],
          [480, -80, -700],
          [440, -60, -700]
        ],
        connections: [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
          [4, 5],
          [5, 6]
        ]
      }
    ]

    constellationData.forEach(constellation => {
      const group = new THREE.Group()

      // Create constellation stars
      constellation.stars.forEach(starPos => {
        const starGeometry = new THREE.SphereGeometry(2, 8, 8)
        const starMaterial = new THREE.MeshBasicMaterial({
          color: 0x4a90e2,
          transparent: true,
          opacity: 0.8
        })
        const star = new THREE.Mesh(starGeometry, starMaterial)
        star.position.set(...starPos)
        group.add(star)
      })

      // Create constellation lines
      constellation.connections.forEach(connection => {
        const points = [
          new THREE.Vector3(...constellation.stars[connection[0]]),
          new THREE.Vector3(...constellation.stars[connection[1]])
        ]
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
        const lineMaterial = new THREE.LineBasicMaterial({
          color: 0x4a90e2,
          transparent: true,
          opacity: 0.3
        })
        const line = new THREE.Line(lineGeometry, lineMaterial)
        group.add(line)
      })

      this.constellations.push(group)
      this.scene.add(group)
    })
  }

  setupEventListeners () {
    document.addEventListener('mousemove', event => {
      this.mouseX = (event.clientX / window.innerWidth) * 2 - 1
      this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1
    })

    window.addEventListener('resize', () => this.onWindowResize())
  }

  animate () {
    requestAnimationFrame(() => this.animate())

    const time = Date.now() * 0.001

    // Rotate stars
    if (this.stars) {
      this.stars.rotation.x += 0.0001
      this.stars.rotation.y += 0.0002
    }

    // Animate nebulae
    this.nebulae.forEach(nebula => {
      nebula.children.forEach(plane => {
        plane.rotation.z += plane.userData.rotationSpeed
      })
    })

    // Subtle constellation movement
    this.constellations.forEach((constellation, index) => {
      constellation.rotation.z += 0.0001 * (index + 1)
    })

    // Camera movement
    this.camera.position.x +=
      (this.mouseX * 0.1 - this.camera.position.x) * 0.02
    this.camera.position.y +=
      (this.mouseY * 0.1 - this.camera.position.y) * 0.02
    this.camera.lookAt(this.scene.position)

    this.renderer.render(this.scene, this.camera)
  }

  onWindowResize () {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}

// Loading Screen Controller
class LoadingController {
  constructor () {
    this.loadingScreen = document.getElementById('loading-screen')
    this.steps = document.querySelectorAll('.step')
    this.progressBar = document.querySelector('.progress-bar')
    this.progressPercentage = document.querySelector('.progress-percentage')
    this.currentStep = 0

    this.init()
  }

  init () {
    this.simulateLoading()
  }

  simulateLoading () {
    const stepDuration = 800
    const totalSteps = this.steps.length

    const updateStep = () => {
      if (this.currentStep < totalSteps) {
        // Update step states
        this.steps.forEach((step, index) => {
          step.classList.remove('active')
          if (index === this.currentStep) {
            step.classList.add('active')
          }
        })

        // Update progress
        const progress = ((this.currentStep + 1) / totalSteps) * 100
        this.progressBar.style.width = progress + '%'
        this.progressPercentage.textContent = Math.round(progress) + '%'

        this.currentStep++
        setTimeout(updateStep, stepDuration)
      } else {
        setTimeout(() => {
          this.hideLoadingScreen()
        }, 1000)
      }
    }

    updateStep()
  }

  hideLoadingScreen () {
    this.loadingScreen.style.opacity = '0'
    setTimeout(() => {
      this.loadingScreen.style.display = 'none'
    }, 1000)
  }
}

// Enhanced Navigation with Transitions
class EnhancedNavigation extends Navigation {
  constructor () {
    super()
    this.transitionOverlay = document.getElementById('page-transition')
  }

  navigateToPage (pageId) {
    if (pageId === this.currentPage) return

    // Show transition
    this.showPageTransition()

    setTimeout(() => {
      // Hide current page
      const currentPageEl = document.getElementById(this.currentPage)
      if (currentPageEl) {
        currentPageEl.classList.remove('active')
      }

      // Show new page
      const newPageEl = document.getElementById(pageId)
      if (newPageEl) {
        newPageEl.classList.add('active')
        this.currentPage = pageId
        this.updateActiveNavLink(pageId)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }

      // Hide transition
      setTimeout(() => {
        this.hidePageTransition()
      }, 500)
    }, 1200)
  }

  showPageTransition () {
    this.transitionOverlay.style.display = 'flex'
    this.transitionOverlay.style.opacity = '1'
  }

  hidePageTransition () {
    this.transitionOverlay.style.opacity = '0'
    setTimeout(() => {
      this.transitionOverlay.style.display = 'none'
    }, 500)
  }

  getProjectData (projectId) {
    const projects = {
      lfortran: {
        title: 'LFortran Compiler Development',
        content: `
                    <h4>🚀 Compiler Development Engineer | Sept 2024 - Present</h4>
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
                        <li>Contributed to compiler architecture improvements and code generation optimization</li>
                    </ul>
                    
                    <h5>Technical Contributions</h5>
                    <ul>
                        <li>Advanced compiler optimization techniques for scientific computing workloads</li>
                        <li>MPI integration and parallel computing support enhancement</li>
                        <li>Performance profiling and bottleneck identification</li>
                        <li>Cross-platform compatibility improvements</li>
                    </ul>
                    
                    <h5>Links & Resources</h5>
                    <p>🔗 <a href="https://github.com/lfortran/lfortran/issues?q=commenter%3Aadit4443ya%20sort%3Aupdated-desc%20OR%20author%3Aadit4443ya" target="_blank">GitHub Contributions</a></p>
                    <p>📝 <a href="https://lfortran.org/blog/2025/03/lfortran-compiles-pot3d/" target="_blank">POT3D Compilation Blog</a></p>
                    <p>🧬 <a href="https://github.com/lfortran/fortran_mpi/" target="_blank">Fortran MPI Implementation</a></p>
                `
      },
      'distributed-ml': {
        title: 'Distributed ML Framework for Fraud Detection',
        content: `
                    <h4>🧠 ML Systems Engineer | Feb 2025 - Apr 2025</h4>
                    <p><strong>Focus:</strong> Privacy-Preserving Federated Learning</p>
                    <p><strong>Tech Stack:</strong> Python, Azure ML, TensorFlow, LSTM, Federated Learning</p>
                    
                    <h5>Project Overview</h5>
                    <p>Architected a comprehensive privacy-preserving federated learning system on Microsoft Azure for credit card fraud detection, incorporating differential privacy guarantees and distributed training capabilities.</p>
                    
                    <h5>Key Achievements</h5>
                    <ul>
                        <li>Achieved <strong>92% accuracy</strong> in fraud detection while maintaining privacy constraints</li>
                        <li>Reduced training time by <strong>73%</strong> through optimized distributed learning algorithms</li>
                        <li>Implemented differential privacy with <strong>ε ≈ 1.5</strong> privacy budget</li>
                        <li>Designed scalable federated learning architecture supporting multiple clients</li>
                        <li>Integrated LSTM models for sequential transaction pattern analysis</li>
                    </ul>
                    
                    <h5>Technical Innovations</h5>
                    <ul>
                        <li>Privacy-preserving gradient aggregation mechanisms</li>
                        <li>Adaptive learning rate scheduling for federated environments</li>
                        <li>Secure multi-party computation protocols</li>
                        <li>Real-time fraud detection pipeline with low latency</li>
                    </ul>
                    
                    <h5>Links & Resources</h5>
                    <p>💻 <a href="https://github.com/adit4443ya/Distributed-Learning-on-Cloud" target="_blank">Source Code Repository</a></p>
                `
      },
      musify: {
        title: 'Musify Music Recommendation System',
        content: `
                    <h4>🎵 ML Engineer | Ongoing Project</h4>
                    <p><strong>Focus:</strong> AI-Powered Music Classification & Recommendation</p>
                    <p><strong>Tech Stack:</strong> Python, Machine Learning, Audio Processing, Feature Extraction</p>
                    
                    <h5>Project Overview</h5>
                    <p>Comprehensive music genre classifier and recommendation system that utilizes machine learning to analyze audio features and provide personalized song recommendations based on user preferences and listening patterns.</p>
                    
                    <h5>Key Features</h5>
                    <ul>
                        <li>Developed a genre classification system achieving 92.42% accuracy using LightGBM on GTZAN audio files, leveraging
Librosa for feature extraction.</li>
                        <li>Employed cosine similarity, manhattan, and euclidean distances in the Recommender Model, and utilized t-SNE, PCA,
and LDA for clustering and dimensionality reduction.</li>
                    </ul>
                    
                    
                    <h5>Links & Resources</h5>
                    <p>💻 <a href="https://github.com/adit4443ya/Musify" target="_blank">Source Code Repository</a></p>
                `
      },
      workhub: {
        title: 'WorkHubPro Enterprise Task Management Platform',
        content: `
                    <h4>⚙️ Full-Stack Developer | Feb 2024 - Aug 2024</h4>
                    <p><strong>Focus:</strong> Enterprise-Grade Project Management</p>
                    <p><strong>Tech Stack:</strong> Kotlin, Jetpack Compose, Go, PostgreSQL, WebSockets</p>
                    
                    <h5>Project Overview</h5>
                    <p>Developed a comprehensive enterprise-grade task management platform with real-time collaboration features, advanced PostgreSQL optimizations, and service-oriented architecture designed for large-scale organizational use.</p>
                    
                    <h5>Key Achievements</h5>
                    <ul>
                        <li>Delivered <strong>140+ commits</strong> across frontend and backend development</li>
                        <li>Implemented <strong>real-time WebSocket updates</strong> for instant collaboration</li>
                        <li>Designed <strong>role-based access control (RBAC)</strong> security model</li>
                        <li>Achieved <strong>sub-second response times</strong> through database optimization</li>
                        <li>Built scalable microservices architecture supporting concurrent users</li>
                    </ul>
                    
                    <h5>Technical Architecture</h5>
                    <ul>
                        <li><strong>Frontend:</strong> Modern Android app using Kotlin and Jetpack Compose</li>
                        <li><strong>Backend:</strong> High-performance Go microservices with RESTful APIs</li>
                        <li><strong>Database:</strong> PostgreSQL with advanced indexing and query optimization</li>
                        <li><strong>Real-time:</strong> WebSocket implementation for live updates</li>
                        <li><strong>Security:</strong> JWT authentication with role-based permissions</li>
                    </ul>
                    
                    <h5>Links & Resources</h5>
                    <p>💻 <a href="https://github.com/adit4443ya/WorkHub-Pro" target="_blank">Source Code Repository</a></p>
                `
      },
      crawler: {
        title: 'Multi-Threaded Web Crawler',
        content: `
                    <h4>🕷️ Systems Programmer | Completed Project</h4>
                    <p><strong>Focus:</strong> High-Performance Web Scraping</p>
                    <p><strong>Tech Stack:</strong> C++, Curl, Gumbo Parser, Multi-threading, JSON</p>
                    
                    <h5>Project Overview</h5>
                    <p>High-performance web crawler built in C++ with multi-threaded architecture for parallel website crawling. Features configurable crawl depth, HTML parsing capabilities, and efficient metadata extraction with JSON output.</p>
                    
                    <h5>Key Features</h5>
                    <ul>
                        <li><strong>Multi-threaded architecture</strong> for parallel crawling operations</li>
                        <li><strong>Configurable crawl depth</strong> with intelligent link discovery</li>
                        <li><strong>HTML parsing</strong> using Google's Gumbo library</li>
                        <li><strong>JSON metadata extraction</strong> for structured data output</li>
                        <li><strong>Efficient memory management</strong> for large-scale crawling</li>
                    </ul>
                    
                    <h5>Technical Implementation</h5>
                    <ul>
                        <li>Thread pool management for optimal resource utilization</li>
                        <li>HTTP request handling with libcurl for robust web communication</li>
                        <li>DOM parsing and content extraction using Gumbo HTML parser</li>
                        <li>Concurrent data structures for thread-safe operations</li>
                        <li>URL normalization and duplicate detection algorithms</li>
                    </ul>
                    
                    <h5>Links & Resources</h5>
                    <p>💻 <a href="https://github.com/adit4443ya/Multi-Threaded-Crawling" target="_blank">Source Code Repository</a></p>
                `
      }
    }

    return projects[projectId] || super.getProjectData(projectId)
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize loading screen
  new LoadingController()

  // Initialize enhanced space background
  setTimeout(() => {
    new EnhancedSpaceBackground()
  }, 2000)

  // Initialize enhanced navigation
  setTimeout(() => {
    new EnhancedNavigation()

    // Additional domain card initialization (backup)
    setTimeout(() => {
      const domainCards = document.querySelectorAll('.domain-card')
      console.log('Backup domain card setup, found:', domainCards.length)
      domainCards.forEach(card => {
        card.addEventListener('click', e => {
          e.preventDefault()
          const domain = card.getAttribute('data-domain')
          console.log('Backup domain card clicked:', domain)
          // Navigate to the page
          const nav = new Navigation()
          nav.navigateToPage(domain)
        })
      })
    }, 1000)
  }, 3000)

  // Direct domain card click handlers (ensure they work)
  setTimeout(() => {
    const domainCards = document.querySelectorAll('.domain-card')
    console.log('Direct setup - Found domain cards:', domainCards.length)

    domainCards.forEach((card, index) => {
      console.log(`Card ${index}:`, card.getAttribute('data-domain'))
      card.style.cursor = 'pointer'

      card.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()

        const domain = card.getAttribute('data-domain')
        console.log('Direct click - Domain:', domain)

        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
          page.classList.remove('active')
        })

        // Show target page
        const targetPage = document.getElementById(domain)
        if (targetPage) {
          targetPage.classList.add('active')
          console.log('Navigated to:', domain)

          // Update navigation
          document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active')
            if (link.getAttribute('href') === `#${domain}`) {
              link.classList.add('active')
            }
          })

          window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
          console.error('Target page not found:', domain)
        }
      })
    })
  }, 5000)

  // Add smooth scrolling
  document.documentElement.style.scrollBehavior = 'smooth'

  // Performance optimization for mobile
  if (window.innerWidth < 768) {
    document.body.classList.add('mobile-optimized')
  }

  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
      document.body.classList.add('mobile-optimized')
    } else {
      document.body.classList.remove('mobile-optimized')
    }
  })
})
// Publication Card Click Handler
document.addEventListener('DOMContentLoaded', function () {
  // Handle publication card clicks
  const publicationCards = document.querySelectorAll(
    '.publication-card[data-url]'
  )

  publicationCards.forEach(card => {
    card.addEventListener('click', function (e) {
      // Don't trigger if clicking on the icon specifically
      if (!e.target.closest('.publication-link-icon')) {
        const url = this.getAttribute('data-url')
        if (url) {
          window.open(url, '_blank')
        }
      }
    })

    // Handle icon click specifically
    const icon = card.querySelector('.publication-link-icon')
    if (icon) {
      icon.addEventListener('click', function (e) {
        e.stopPropagation()
        const url = card.getAttribute('data-url')
        if (url) {
          window.open(url, '_blank')
        }
      })
    }
  })
})
