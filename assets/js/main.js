document.addEventListener('DOMContentLoaded', () => {
    // --- LOADER ---
    const loader = document.querySelector('.loader');
    // Optional: You can hide loader immediately if you want faster perceived load, 
    // but the CSS animation handles it nicely.
    
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

    // --- OPTIMIZED CUSTOM CURSOR (using requestAnimationFrame) ---
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorVisible = true;

    // Update coordinates on mousemove (lightweight)
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorVisible = true;
    });

    // Animation Loop for smoothness
    function animateCursor() {
        if (cursorVisible) {
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
            
            // We can animate the outline with a slight delay/easing via CSS transition 
            // or directly here. The CSS transition is already set in style.css (transition: width 0.2s, height 0.2s)
            // For position, let's use the transform directly for better performance than top/left
            // However, the CSS uses fixed positioning. Let's update left/top but inside rAF.
            
            cursorDot.style.left = `0px`; 
            cursorDot.style.top = `0px`;
            cursorOutline.style.left = `0px`;
            cursorOutline.style.top = `0px`;
            
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
            
            // Adding a simple delay effect via standard animation api was causing lag
            // Let's just map it 1:1 for zero lag feel, or use CSS transition for position
            // For 'lag-free' experience, 1:1 is best.
            cursorOutline.animate({
                transform: `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`
            }, { duration: 500, fill: "forwards" });
        }
        requestAnimationFrame(animateCursor);
    }
    
    // Start the loop
    requestAnimationFrame(animateCursor);

    // Cursor Hover Effects
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
            cursorOutline.style.borderColor = 'var(--gold-300)';
            cursorDot.style.opacity = '0';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.borderColor = 'rgba(224, 170, 62, 0.5)';
            cursorDot.style.opacity = '1';
        });
    });


    // --- ANIMATION ON SCROLL ---
    const observerOptions = {
        threshold: 0.1,
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


    // --- OPTIMIZED PARALLAX EFFECT ---
    // Only run logic if we are scrolling
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    });

    function updateParallax() {
        const scrolled = window.scrollY;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(el => {
            // Simple viewport check
            const rect = el.getBoundingClientRect();
            if (rect.top + rect.height > 0 && rect.top < window.innerHeight) {
                const speed = el.getAttribute('data-speed');
                const yPos = -(scrolled * speed);
                
                if (el.classList.contains('hero-bg')) {
                     el.style.transform = `translate3d(0, ${yPos}px, 0)`; // Use translate3d for GPU acceleration
                } else {
                    // Background position is less performant, but works for the banner
                    el.style.backgroundPosition = `center ${yPos}px`;
                }
            }
        });
    }
});
