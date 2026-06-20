document.addEventListener('DOMContentLoaded', () => {
    const themes = ['theme-slate', 'theme-olive', 'theme-amber'];
    const storedTheme = localStorage.getItem('portfolio_theme');
    const initialTheme = themes.includes(storedTheme) ? storedTheme : themes[0];

    const applyTheme = (theme) => {
        document.body.className = theme;
        localStorage.setItem('portfolio_theme', theme);
    };

    applyTheme(initialTheme);

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentIndex = themes.indexOf(document.body.className);
            const nextTheme = themes[(currentIndex + 1) % themes.length];
            applyTheme(nextTheme);
        });
    }

    const preloader = document.getElementById('preloader');
    window.setTimeout(() => {
        if (preloader) {
            preloader.classList.add('is-hidden');
            window.setTimeout(() => preloader.remove(), 420);
        }
    }, 1100);

    const timeEl = document.getElementById('system-time');
    const updateClock = () => {
        if (!timeEl) {
            return;
        }

        const now = new Date();
        timeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    updateClock();
    window.setInterval(updateClock, 1000);

    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            const activeId = entry.target.id;
            navLinks.forEach((link) => {
                link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
            });
        });
    }, {
        root: null,
        rootMargin: '-35% 0px -50% 0px',
        threshold: 0
    });

    sections.forEach((section) => observer.observe(section));

    const sectionMotionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            const section = entry.target;
            section.classList.add('section-active');

            if (section.id === 'experience') {
                section.classList.add('experience-active');
            }

            sectionMotionObserver.unobserve(section);
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -16% 0px'
    });

    sections.forEach((section) => sectionMotionObserver.observe(section));

    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            filterButtons.forEach((item) => item.classList.toggle('active', item === button));

            projectCards.forEach((card) => {
                const shouldShow = filter === 'all' || card.dataset.category === filter;
                card.classList.toggle('project-hidden', !shouldShow);
            });
        });
    });

    const modal = document.getElementById('blueprint-modal');
    const modalTitle = document.getElementById('modal-project-title');
    const modalTag = document.getElementById('modal-project-tag');
    const modalBody = document.getElementById('modal-body-content');
    const modalClose = document.getElementById('modal-close');

    const projectData = {
        mediverse: {
            title: 'Mediverse - Hospital Management System',
            tag: 'ServiceNow application',
            body: `
                <p>A full-scale hospital ecosystem built on ServiceNow that keeps the interface focused on what matters: appointments, rooms, food requests, and support routing.</p>
                <h4>Highlights</h4>
                <ul>
                    <li>ServiceNow ITSM workflows for intake and routing.</li>
                    <li>Reusable forms, tables, and client-side validation.</li>
                    <li>REST integration to connect modules cleanly.</li>
                </ul>
                <h4>Stack</h4>
                <p>ServiceNow Studio, Business Rules, REST APIs, and application scripting.</p>
            `
        },
        exam: {
            title: 'Exam Portal with Grid Seating',
            tag: 'Full stack and DevOps',
            body: `
                <p>A secure exam management app that calculates seating patterns and supports delivery through Docker, Jenkins, and AWS.</p>
                <h4>Highlights</h4>
                <ul>
                    <li>Grid-based seating arrangement logic.</li>
                    <li>JWT-gated role access for admin and student flows.</li>
                    <li>Containerized deployment pipeline for repeatable releases.</li>
                </ul>
                <h4>Stack</h4>
                <p>Node.js, Express, MongoDB, Docker, Jenkins CI/CD, and AWS EC2.</p>
            `
        }
    };

    const openModal = (key) => {
        const project = projectData[key];
        if (!modal || !project || !modalTitle || !modalTag || !modalBody) {
            return;
        }

        modalTitle.textContent = project.title;
        modalTag.textContent = project.tag;
        modalBody.innerHTML = project.body;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        if (!modal) {
            return;
        }

        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    document.querySelectorAll('.open-project-btn').forEach((button) => {
        button.addEventListener('click', () => openModal(button.dataset.proj));
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });

    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalBody = document.getElementById('terminal-body');

    const appendLine = (text, isHtml = false) => {
        if (!terminalOutput) {
            return;
        }

        const line = document.createElement('div');
        line.className = 'term-line';
        if (isHtml) {
            line.innerHTML = text;
        } else {
            line.textContent = text;
        }
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    };

    const commandMap = {
        help: [
            'Available commands:',
            'about - short profile summary',
            'skills - main technologies',
            'projects - featured work overview',
            'experience - timeline summary',
            'contact - direct contact info',
            'theme [slate|olive|amber] - change the accent',
            'clear - clear the console'
        ],
        about: [
            'Software Engineer fresher focused on ServiceNow and full stack delivery.',
            'Comfortable with Java, Python, REST APIs, and practical deployment workflows.'
        ],
        skills: [
            'ServiceNow: CAD, CSA, Studio, Business Rules, Client Scripts',
            'Languages: Java, Python, JavaScript, SQL, HTML, CSS',
            'DevOps: Docker, Jenkins, AWS EC2, Git, Linux'
        ],
        projects: [
            'Mediverse - ServiceNow hospital management system.',
            'Exam Portal - full stack app with seating logic and DevOps delivery.'
        ],
        experience: [
            'ServiceNow Intern - Technical Hub (May 2025 to Present)',
            'Software Intern - Tecnics (Dec 2023 to Mar 2024)'
        ],
        contact: [
            'Email: vijjapuvignesh@gmail.com',
            'Phone: +91 6300194981'
        ]
    };

    const runCommand = (rawValue) => {
        const value = rawValue.trim();
        if (!value) {
            return;
        }

        appendLine(`guest@vignesh:~$ ${value}`);

        const [command, ...args] = value.toLowerCase().split(/\s+/);

        if (command === 'clear') {
            terminalOutput.innerHTML = '';
            return;
        }

        if (command === 'theme') {
            const requestedTheme = args[0];
            if (requestedTheme && themes.includes(`theme-${requestedTheme}`)) {
                applyTheme(`theme-${requestedTheme}`);
                appendLine(`Theme updated to ${requestedTheme}.`);
            } else {
                appendLine('Use: theme slate, theme olive, or theme amber.');
            }
            return;
        }

        const lines = commandMap[command];
        if (lines) {
            lines.forEach((line) => appendLine(line));
            return;
        }

        appendLine(`Unknown command: ${command}. Type help for options.`);
    };

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                runCommand(terminalInput.value);
                terminalInput.value = '';
            }
        });
    }

    if (terminalBody && terminalInput) {
        terminalBody.addEventListener('click', () => terminalInput.focus());
    }

    const revealTargets = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = '0ms';
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12
    });

    revealTargets.forEach((target) => revealObserver.observe(target));
});