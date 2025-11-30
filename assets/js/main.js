document.addEventListener('DOMContentLoaded', () => {
    // --- LOADER ---
    const loader = document.querySelector('.loader');
    
    // --- NAVIGATION ---
    const navToggle = document.getElementById('nav-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const navLinks = document.querySelectorAll('.nav-link');

    function toggleMenu() {
        sidebar.classList.toggle('active');
        // Simple icon switch
        if (sidebar.classList.contains('active')) {
            navToggle.innerHTML = `<i data-lucide="x"></i>`;
            navToggle.style.color = "var(--gold-300)";
        } else {
            navToggle.innerHTML = `<i data-lucide="menu"></i>`;
            navToggle.style.color = "#fff";
        }
        lucide.createIcons();
    }

    navToggle.addEventListener('click', toggleMenu);
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            sidebar.classList.remove('active');
            navToggle.innerHTML = `<i data-lucide="menu"></i>`;
            navToggle.style.color = "#fff";
            lucide.createIcons();
        });
    });

    // --- CUSTOM CURSOR ---
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Slight delay for outline
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Cursor Hover Effects
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.borderColor = 'var(--gold-300)';
            cursorDot.style.opacity = '0';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.borderColor = 'rgba(224, 170, 62, 0.5)';
            cursorDot.style.opacity = '1';
        });
    });


    // --- ANIMATION ON SCROLL ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => observer.observe(el));


    // --- PARALLAX EFFECT ---
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(el => {
            const speed = el.getAttribute('data-speed');
            // Check if element is roughly in view to save resources
            if (el.getBoundingClientRect().top < window.innerHeight) {
                const yPos = -(scrolled * speed);
                // Apply to background image if it's the hero bg
                if (el.classList.contains('hero-bg')) {
                     el.style.transform = `translateY(${yPos}px)`;
                } else {
                    el.style.backgroundPosition = `center ${yPos}px`;
                }
            }
        });
    });
});
