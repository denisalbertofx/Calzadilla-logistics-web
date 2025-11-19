document.addEventListener('DOMContentLoaded', () => {
    setupScrollAnimations();
    setupSmoothScrolling();
    setupActiveNav();
});

function setupScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible if you don't want it to replay
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Target elements to animate
    const animatedElements = document.querySelectorAll('.section-title, .section-desc, .feature-card, .tech-item, .safety-card, .hero-content > *');

    animatedElements.forEach(el => {
        el.classList.add('fade-in-up');
        observer.observe(el);
    });
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }

                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function setupActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}

// --- NEW ANIMATIONS ---

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        // Handle float or int
        const isFloat = end % 1 !== 0;
        const currentVal = progress * (end - start) + start;

        obj.innerHTML = isFloat ? currentVal.toFixed(1) : Math.floor(currentVal);

        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end;
        }
    };
    window.requestAnimationFrame(step);
}

function setupTechAnimations() {
    // Animate HUD numbers when Tech section is visible
    const techSection = document.querySelector('#tech');
    const hudValues = document.querySelectorAll('.hud-value');

    // We can use the existing IntersectionObserver if we expose it, 
    // but for simplicity let's make a specific one for the HUD
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate specific HUD elements if they have data attributes
                // Or just add a class to trigger CSS animations
                entry.target.classList.add('active-hud');
            }
        });
    }, { threshold: 0.5 });

    if (techSection) observer.observe(techSection);

    // Modal Animations
    const techModal = document.getElementById('tech-modal');
    if (techModal) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.classList.contains('active')) {
                    // Modal opened, trigger number animations
                    const animatedNumbers = techModal.querySelectorAll('[data-animate-value]');
                    animatedNumbers.forEach(el => {
                        const target = parseFloat(el.getAttribute('data-animate-value'));
                        animateValue(el, 0, target, 1500);
                    });
                }
            });
        });
        observer.observe(techModal, { attributes: true, attributeFilter: ['class'] });
    }
}

// Initialize new animations
document.addEventListener('DOMContentLoaded', () => {
    setupTechAnimations();
});
