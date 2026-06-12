/* ==========================================================================
   VIGNESH VIJJAPU PORTFOLIO - CYBER ENGINE INTERACTIVE SCRIPT (ES6)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SYSTEM AUDIO SYNTHESIS ENGINE (WEB AUDIO API) ---
    let isMuted = true; // Default to muted to comply with browser policies
    let audioCtx = null;

    const initAudio = () => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    };

    const playBeep = (freq, duration, type = 'sine', volume = 0.05) => {
        if (isMuted) return;
        try {
            initAudio();
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            
            gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
            
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            console.warn('Audio play failed: ', e);
        }
    };

    // Chirp presets
    const playHoverSound = () => playBeep(980, 0.04, 'sine', 0.015);
    const playClickSound = () => {
        playBeep(880, 0.06, 'triangle', 0.03);
        setTimeout(() => playBeep(1760, 0.08, 'sine', 0.02), 30);
    };
    const playTerminalKeystroke = () => playBeep(600 + Math.random() * 200, 0.02, 'triangle', 0.015);
    const playBootSound = () => {
        if (isMuted) return;
        const notes = [261.63, 329.63, 392.00, 523.25]; // C major chord
        notes.forEach((freq, index) => {
            setTimeout(() => playBeep(freq, 0.4, 'sawtooth', 0.02), index * 100);
        });
    };

    // Attach haptics to standard interactive selectors
    const attachHapticListeners = () => {
        const hoverables = document.querySelectorAll('a, button, .skill-badge, .project-hud-card, .timeline-node, .filter-btn, .theme-toggle');
        hoverables.forEach(elem => {
            elem.addEventListener('mouseenter', playHoverSound);
            elem.addEventListener('click', playClickSound);
        });
    };

    // Audio Toggle Handler
    const audioBtn = document.getElementById('audio-btn');
    if (audioBtn) {
        audioBtn.addEventListener('click', () => {
            isMuted = !isMuted;
            if (isMuted) {
                audioBtn.classList.add('muted');
            } else {
                audioBtn.classList.remove('muted');
                initAudio();
                playClickSound();
            }
            localStorage.setItem('sys_audio_muted', isMuted);
        });
    }

    // Load audio preference
    const cachedAudioMute = localStorage.getItem('sys_audio_muted');
    if (cachedAudioMute !== null) {
        isMuted = cachedAudioMute === 'true';
        if (audioBtn) {
            if (isMuted) audioBtn.classList.add('muted');
            else audioBtn.classList.remove('muted');
        }
    }


    // --- 2. THEME ENGINE SYSTEM ---
    const themes = ['theme-cyan', 'theme-purple', 'theme-green'];
    let currentThemeIndex = 0;

    // Load initial theme
    const savedTheme = localStorage.getItem('sys_theme') || 'theme-cyan';
    document.body.className = savedTheme;
    currentThemeIndex = themes.indexOf(savedTheme);
    if (currentThemeIndex === -1) currentThemeIndex = 0;

    const cycleTheme = () => {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        const newTheme = themes[currentThemeIndex];
        document.body.className = newTheme;
        localStorage.setItem('sys_theme', newTheme);
        
        // Sync terminal output if it exists
        printTerminalLine(`> SYSTEM COLOR MATRIX ROTATION REGISTERED: [${newTheme.toUpperCase()}]`);
        
        // Trigger particle repaint with updated theme colors
        initParticles();
    };

    const setThemeDirectly = (themeName) => {
        const fullTheme = `theme-${themeName}`;
        if (themes.includes(fullTheme)) {
            document.body.className = fullTheme;
            currentThemeIndex = themes.indexOf(fullTheme);
            localStorage.setItem('sys_theme', fullTheme);
            initParticles();
            return true;
        }
        return false;
    };

    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', cycleTheme);
    }


    // --- 3. SYSTEM PRELOADER BOOT SEQUENCE ---
    const preloader = document.getElementById('preloader');
    const loaderConsole = document.getElementById('loader-console');
    
    const preloaderBootMessages = [
        "> COMPILING TECHNICAL KNOWLEDGE BASES...",
        "> PARSING EXPERIENCE WORK GRID MODULES...",
        "> VERIFYING CERTIFICATES [CSA, CAD, GENAI]...",
        "> SYSTEM ONLINE. WELCOME GUEST IDENTIFIED...",
    ];

    if (preloader && loaderConsole) {
        // Output incremental boot diagnostics
        preloaderBootMessages.forEach((msg, idx) => {
            setTimeout(() => {
                const p = document.createElement('p');
                p.className = 'console-line';
                p.textContent = msg;
                p.style.animationDelay = `${idx * 0.1}s`;
                loaderConsole.appendChild(p);
                loaderConsole.scrollTop = loaderConsole.scrollHeight;
            }, 300 + idx * 400);
        });

        // Terminate preloader
        setTimeout(() => {
            preloader.style.opacity = 0;
            if (!isMuted) playBootSound();
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 2200);
    }


    // --- 4. DYNAMIC LIVE CLOCK ---
    const updateClock = () => {
        const systemTimeEl = document.getElementById('system-time');
        if (systemTimeEl) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour12: false }) + ' LCL';
            systemTimeEl.textContent = timeStr;
        }
    };
    setInterval(updateClock, 1000);
    updateClock();


    // --- 5. HIGH-PERFORMANCE INTERACTIVE CANVAS PARTICLES ---
    const particleCanvas = document.getElementById('particle-canvas');
    let pCtx = null;
    let particles = [];
    let animationFrameId = null;
    let mouse = { x: null, y: null, radius: 120 };

    if (particleCanvas) {
        pCtx = particleCanvas.getContext('2d');
        
        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });
    }

    const resizeCanvas = () => {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    };

    class Particle {
        constructor(x, y, dx, dy, size, color) {
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.size = size;
            this.color = color;
        }

        draw() {
            pCtx.beginPath();
            pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            pCtx.fillStyle = this.color;
            pCtx.fill();
        }

        update() {
            // Boundary checks
            if (this.x + this.size > particleCanvas.width || this.x - this.size < 0) {
                this.dx = -this.dx;
            }
            if (this.y + this.size > particleCanvas.height || this.y - this.size < 0) {
                this.dy = -this.dy;
            }

            // Mouse repulsion physics
            if (mouse.x !== null && mouse.y !== null) {
                let diffX = this.x - mouse.x;
                let diffY = this.y - mouse.y;
                let distance = Math.sqrt(diffX * diffX + diffY * diffY);
                
                if (distance < mouse.radius) {
                    let force = (mouse.radius - distance) / mouse.radius;
                    let angle = Math.atan2(diffY, diffX);
                    this.x += Math.cos(angle) * force * 3;
                    this.y += Math.sin(angle) * force * 3;
                }
            }

            this.x += this.dx;
            this.y += this.dy;
            this.draw();
        }
    }

    const getPrimaryHSLColor = () => {
        const bodyClass = document.body.className;
        if (bodyClass.includes('purple')) return 'rgba(224, 0, 254, 0.45)';
        if (bodyClass.includes('green')) return 'rgba(0, 255, 65, 0.45)';
        return 'rgba(0, 242, 254, 0.45)'; // default cyan
    };

    const getSecondaryHSLColor = () => {
        const bodyClass = document.body.className;
        if (bodyClass.includes('purple')) return 'rgba(224, 0, 254, 0.05)';
        if (bodyClass.includes('green')) return 'rgba(0, 255, 65, 0.04)';
        return 'rgba(0, 242, 254, 0.05)'; // default cyan
    };

    const initParticles = () => {
        if (!particleCanvas) return;
        resizeCanvas();
        particles = [];
        
        // Dynamic density based on canvas area
        const numberOfParticles = Math.min(60, Math.floor((particleCanvas.width * particleCanvas.height) / 22000));
        const color = getPrimaryHSLColor();

        for (let i = 0; i < numberOfParticles; i++) {
            let size = Math.random() * 1.5 + 1;
            let x = Math.random() * (particleCanvas.width - size * 2) + size;
            let y = Math.random() * (particleCanvas.height - size * 2) + size;
            let dx = (Math.random() - 0.5) * 0.4;
            let dy = (Math.random() - 0.5) * 0.4;

            particles.push(new Particle(x, y, dx, dy, size, color));
        }
        
        if (!animationFrameId) {
            animateParticles();
        }
    };

    const animateParticles = () => {
        pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }

        // Draw connections inside proximity threshold
        const connColor = getSecondaryHSLColor();
        const activeColor = getPrimaryHSLColor();
        
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dist = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) +
                           ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                
                let limit = 160 * 160;
                if (dist < limit) {
                    pCtx.strokeStyle = connColor;
                    pCtx.lineWidth = 0.5;
                    pCtx.beginPath();
                    pCtx.moveTo(particles[a].x, particles[a].y);
                    pCtx.lineTo(particles[b].x, particles[b].y);
                    pCtx.stroke();
                }
            }

            // Proximity connection to mouse
            if (mouse.x !== null && mouse.y !== null) {
                let mDist = ((particles[a].x - mouse.x) * (particles[a].x - mouse.x)) +
                            ((particles[a].y - mouse.y) * (particles[a].y - mouse.y));
                if (mDist < 120 * 120) {
                    pCtx.strokeStyle = activeColor;
                    pCtx.lineWidth = 0.55;
                    pCtx.beginPath();
                    pCtx.moveTo(particles[a].x, particles[a].y);
                    pCtx.lineTo(mouse.x, mouse.y);
                    pCtx.stroke();
                }
            }
        }
        
        animationFrameId = requestAnimationFrame(animateParticles);
    };

    initParticles();


    // --- 6. SCROLL INTERSECTION OBSERVER FOR ACTIVE NAVS ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // focused view center
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));


    // --- 7. BLUEPRINT PROJECT MODAL CONTROLLER ---
    const modal = document.getElementById('blueprint-modal');
    const modalClose = document.getElementById('modal-close');
    const modalBody = document.getElementById('modal-body-content');
    const modalTitle = document.getElementById('modal-project-title');
    const modalTag = document.getElementById('modal-project-tag');

    const projectData = {
        mediverse: {
            title: "MEDIVERSE – HOSPITAL MANAGEMENT SYSTEM",
            tag: "// BLUEPRINT_DATA: SN-MED-2025.DAT",
            html: `
                <div class="modal-blueprint-layout">
                    <div class="modal-blueprint-info">
                        <h4>SYSTEM UTILITY OVERVIEW</h4>
                        <p>A full-scale hospital ecosystem application configured entirely on the ServiceNow architecture. Seamlessly coordinates critical healthcare telemetry, including doctor scheduling queues, dynamic room occupancy charts, meal delivery systems, and automated patient diagnostics channels.</p>
                        
                        <h4>KEY ARCHITECTURAL FEATURES</h4>
                        <ul class="bp-list-bullets">
                            <li><strong>Dynamic ITSM Automations:</strong> Created script-level rules that convert inbound patient booking submissions into automated ServiceNow ITSM workflow requests, reducing desk routing times by over 40%.</li>
                            <li><strong>Integrative REST Hub:</strong> Configured clean internal REST interfaces enabling zero-latency medical inventory updates between distinct workspace modules.</li>
                            <li><strong>HUD Dashboards:</strong> Developed modular workspace forms and portals customized with specialized client-side validation scripts.</li>
                        </ul>
                    </div>
                    <div class="blueprint-meta-sidebar">
                        <div class="blueprint-meta-item">
                            <span class="bp-meta-label">DEPLOYED ON</span>
                            <span class="bp-meta-val">ServiceNow Platform</span>
                        </div>
                        <div class="blueprint-meta-item">
                            <span class="bp-meta-label">ROLES INVOLVED</span>
                            <span class="bp-meta-val">Intern Architect</span>
                        </div>
                        <div class="blueprint-meta-item">
                            <span class="bp-meta-label">TECHNOLOGY MATRIX</span>
                            <span class="bp-meta-val">ServiceNow ITSM, REST APIs, Business Rules, Client Scripting, Studio IDE</span>
                        </div>
                        <div class="blueprint-meta-item">
                            <span class="bp-meta-label">AGILE COMPLIANCE</span>
                            <span class="bp-meta-val">Sprint-verified (ServiceNow SDLC)</span>
                        </div>
                    </div>
                </div>
            `
        },
        exam: {
            title: "EXAM PORTAL WITH DYNAMIC GRID SEATING ARRANGEMENT",
            tag: "// BLUEPRINT_DATA: JS-EXM-2026.DAT",
            html: `
                <div class="modal-blueprint-layout">
                    <div class="modal-blueprint-info">
                        <h4>SYSTEM UTILITY OVERVIEW</h4>
                        <p>A highly secure, role-based exam administration portal. Admins manage student database vectors and trigger real-time seating allocation matrices. Features a customized heuristic arrangement algorithm designed to avoid adjacent grid seating for co-branch candidates.</p>
                        
                        <h4>KEY ARCHITECTURAL FEATURES</h4>
                        <ul class="bp-list-bullets">
                            <li><strong>Non-Adjacent Seating Generator:</strong> Implemented a graph-coloring styled seating arrangement algorithm that constructs a 2D physical seat arrangement matrix where immediate horizontal, vertical, and diagonal peers are mathematically verified to belong to separate academic divisions.</li>
                            <li><strong>DevOps Deployment:</strong> Fully containerized utilizing multi-stage Dockerfiles. Configured an automated CI/CD pipeline inside Jenkins that pulls commits, executes test routines, and deploys directly onto AWS EC2 instances.</li>
                            <li><strong>Secure Role Access:</strong> Express JWT authorization gates defining administrator control panels and student portal forms.</li>
                        </ul>
                    </div>
                    <div class="blueprint-meta-sidebar">
                        <div class="blueprint-meta-item">
                            <span class="bp-meta-label">PLATFORM HOST</span>
                            <span class="bp-meta-val">AWS EC2 / Virtual Server</span>
                        </div>
                        <div class="blueprint-meta-item">
                            <span class="bp-meta-label">PIPELINE CI/CD</span>
                            <span class="bp-meta-val">Jenkins Pipeline (Auto)</span>
                        </div>
                        <div class="blueprint-meta-item">
                            <span class="bp-meta-label">TECHNOLOGY MATRIX</span>
                            <span class="bp-meta-val">Node.js, Express, JavaScript, MongoDB, Docker, Jenkins, AWS EC2, HTML5/CSS3</span>
                        </div>
                        <div class="blueprint-meta-item">
                            <span class="bp-meta-label">COMPILATION VERIFIED</span>
                            <span class="bp-meta-val">Yes (Production Active)</span>
                        </div>
                    </div>
                </div>
            `
        }
    };

    const openModal = (projKey) => {
        const data = projectData[projKey];
        if (data && modal && modalBody && modalTitle && modalTag) {
            modalTitle.textContent = data.title;
            modalTag.textContent = data.tag;
            modalBody.innerHTML = data.html;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            attachHapticListeners(); // Re-attach sounds for elements inside modal
        }
    };

    const closeModal = () => {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // Click hooks
    document.querySelectorAll('.open-project-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const key = e.target.getAttribute('data-proj');
            openModal(key);
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });


    // --- 8. PROJECT CATEGORY FILTERS ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-hud-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const filter = e.target.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const cat = card.getAttribute('data-category');
                if (filter === 'all' || cat === filter) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });


    // --- 9. INTERACTIVE CLI TERMINAL ENGINE ---
    const termInput = document.getElementById('terminal-input');
    const termOutput = document.getElementById('terminal-output');
    const termBody = document.getElementById('terminal-body');
    const matrixCanvas = document.getElementById('matrix-canvas');

    // Matrix Screen Easter Egg State
    let matrixInterval = null;
    let mCtx = null;

    const stopMatrixRain = () => {
        if (matrixInterval) {
            clearInterval(matrixInterval);
            matrixInterval = null;
        }
        if (matrixCanvas) {
            matrixCanvas.style.display = 'none';
        }
    };

    const startMatrixRain = () => {
        if (!matrixCanvas) return;
        stopMatrixRain();
        
        matrixCanvas.style.display = 'block';
        mCtx = matrixCanvas.getContext('2d');
        
        const resizeMatrixCanvas = () => {
            matrixCanvas.width = termBody.clientWidth;
            matrixCanvas.height = termBody.clientHeight;
        };
        resizeMatrixCanvas();

        const katakana = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const alphabet = katakana.split("");
        
        const fontSize = 12;
        const columns = matrixCanvas.width / fontSize;
        const rainDrops = Array.from({ length: columns }, () => 1);

        const drawMatrix = () => {
            mCtx.fillStyle = 'rgba(2, 6, 10, 0.05)';
            mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
            
            mCtx.fillStyle = '#0F0';
            mCtx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < rainDrops.length; i++) {
                const text = alphabet[Math.floor(Math.random() * alphabet.length)];
                mCtx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
                
                if (rainDrops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                    rainDrops[i] = 0;
                }
                rainDrops[i]++;
            }
        };

        matrixInterval = setInterval(drawMatrix, 30);
    };

    const printTerminalLine = (text, isHtml = false, delay = 0) => {
        if (!termOutput) return;
        
        const appendLine = () => {
            const line = document.createElement('div');
            line.className = 'term-line';
            if (isHtml) {
                line.innerHTML = text;
            } else {
                line.textContent = text;
            }
            termOutput.appendChild(line);
            termBody.scrollTop = termBody.scrollHeight;
        };

        if (delay > 0) {
            setTimeout(appendLine, delay);
        } else {
            appendLine();
        }
    };

    const clearTerminal = () => {
        if (termOutput) {
            termOutput.innerHTML = '';
        }
        stopMatrixRain();
    };

    const commandInterpreter = (cmdStr) => {
        const parts = cmdStr.trim().split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const arg = parts.slice(1).join(' ').toLowerCase();

        // Echo command
        printTerminalLine(`guest@vijjapu-systems:~$ ${cmdStr}`);

        // If matrix rain was active, stop it unless they type hack again
        if (cmd !== 'hack') {
            stopMatrixRain();
        }

        switch (cmd) {
            case '':
                // empty line
                break;
            case 'help':
                printTerminalLine('AVAILABLE COMMAND DIRECTIVES:');
                printTerminalLine('  about      - Display system host summary profile');
                printTerminalLine('  skills     - Print technical expertise capabilities matrix');
                printTerminalLine('  projects   - Retrieve dynamic engineering blueprint logs');
                printTerminalLine('  experience - Extract professional registry and timelines');
                printTerminalLine('  contact    - Retrieve transmitter link protocols');
                printTerminalLine('  theme      - Rotate system colors (Usage: theme [cyan/purple/green])');
                printTerminalLine('  hack       - [RESTRICTED] Trigger matrix core systems code sweep');
                printTerminalLine('  clear      - Empty active console screen');
                break;
            case 'about':
                printTerminalLine('================ SYSTEM HOST DIAGNOSTIC ================');
                printTerminalLine('NAME: Vignesh Vijjapu');
                printTerminalLine('ROLE: Software Engineer | ServiceNow Developer');
                printTerminalLine('IDENT: Results-driven developer with active ServiceNow CAD & CSA credentials.');
                printTerminalLine('SUMMARY: Specialized in Java, Python, REST interfaces, ServiceNow Studio,');
                printTerminalLine('         and automated DevOps integrations (AWS, Docker, Jenkins).');
                printTerminalLine('========================================================');
                break;
            case 'skills':
                printTerminalLine('================ TECHNICAL EXPERTISE MATRIX ================');
                printTerminalLine('SERVICENOW: CSA, CAD, Studio components, Business Rules, Client Scripting');
                printTerminalLine('LANGUAGES : Java, Python, C Language, SQL, JavaScript (ES6+), HTML5/CSS3');
                printTerminalLine('CLOUD/DEV : AWS EC2, Docker Containerization, Jenkins Pipelines, Git VCS');
                printTerminalLine('WEB TECH  : Node.js, Express.js, RESTful Web APIs, MongoDB, MySQL');
                printTerminalLine('CS CORES  : DSA, Database Management (DBMS), Networks, OOP structures');
                printTerminalLine('============================================================');
                break;
            case 'projects':
                printTerminalLine('================ ACTIVE PROJECT BLUEPRINTS ================');
                printTerminalLine('1. MEDIVERSE – HOSPITAL MANAGEMENT SYSTEM');
                printTerminalLine('   Platform: ServiceNow [CSA/CAD]');
                printTerminalLine('   Specs: Integrates doctor/patient HUDs, meal schedules, and ITSM flows.');
                printTerminalLine('   Action: Use interface cards below for visual detail models.');
                printTerminalLine('------------------------------------------------------------');
                printTerminalLine('2. EXAM PORTAL WITH GRAPH安排 (GRID SEATING ARRANGEMENT)');
                printTerminalLine('   Platform: Web Node.js / Express / Docker / Jenkins CI/CD / AWS EC2');
                printTerminalLine('   Specs: Seating arranged via a branch graph coloring adjacent solver.');
                printTerminalLine('   Action: Multi-stage Dockerized cluster deployed on AWS hosts.');
                printTerminalLine('============================================================');
                break;
            case 'experience':
                printTerminalLine('================ PROFESSIONAL REGISTRY TIMELINE ================');
                printTerminalLine('[MAY 2025 - PRESENT] ServiceNow Intern - Technical Hub');
                printTerminalLine('   - Automated ticket generation nodes using ServiceNow ITSM modules.');
                printTerminalLine('   - Scripted custom validation triggers on tables and REST interfaces.');
                printTerminalLine('----------------------------------------------------------------');
                printTerminalLine('[DEC 2023 - MAR 2024] Software Intern - Tecnics');
                printTerminalLine('   - Developed modular libraries in Java and Python environments.');
                printTerminalLine('   - Conducted code debug, refactors, and Git conflict fixes.');
                printTerminalLine('================================================================');
                break;
            case 'contact':
                printTerminalLine('================ TRANSMITTER LINK PROTOCOLS ================');
                printTerminalLine('Direct transmission channels available:');
                printTerminalLine('  EMAIL : vijjapuvignesh@gmail.com');
                printTerminalLine('  VOICE : +91 6300194981');
                printTerminalLine('  NET   : Use the transmitter portal at the bottom of the interface');
                printTerminalLine('          to submit a packet directly into Vignesh\'s inbox.');
                printTerminalLine('============================================================');
                break;
            case 'theme':
                if (arg === 'cyan' || arg === 'purple' || arg === 'green') {
                    const success = setThemeDirectly(arg);
                    if (success) {
                        printTerminalLine(`> Active theme altered directly to [${arg.toUpperCase()}].`);
                    } else {
                        printTerminalLine('> Rotation failure: Invalid config parameters.');
                    }
                } else {
                    printTerminalLine('Invalid theme request. Available choices: theme cyan, theme purple, theme green');
                }
                break;
            case 'hack':
                printTerminalLine('>> BYPASSING CORRESPONDING PROTOCOLS...', false, 100);
                printTerminalLine('>> ESTABLISHING ROOT ACCESS TUNNEL...', false, 300);
                printTerminalLine('>> ROOT CRACK COMPLETED. INITIATING CORE RAIN DECK...', false, 500);
                setTimeout(startMatrixRain, 600);
                break;
            case 'clear':
                clearTerminal();
                break;
            default:
                printTerminalLine(`Command not recognized: '${cmd}'. Type 'help' for valid directives.`);
        }
        
        termBody.scrollTop = termBody.scrollHeight;
    };

    if (termInput) {
        termInput.addEventListener('keydown', (e) => {
            playTerminalKeystroke();
            if (e.key === 'Enter') {
                const cmd = termInput.value;
                commandInterpreter(cmd);
                termInput.value = '';
            }
        });

        // Focus keyboard onto input when terminal background is clicked
        if (termBody) {
            termBody.addEventListener('click', () => {
                termInput.focus();
            });
        }
    }


    // --- 11. INITIATING HUD STATS ANCHOR HOVER LINES ---
    attachHapticListeners();
});
