/**
 * KALPESH INTERIOR DESIGN - MAIN APPLICATION
 * Navigation, interactions, and scroll effects
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Navigation.init();
    ScrollEffects.init();
    ProjectGallery.init();
    ContactForm.init();

    // Initialize 3D scenes after a short delay to ensure DOM is ready
    setTimeout(() => {
        SceneManager3D.init();
    }, 100);
});

/**
 * Navigation Module
 */
const Navigation = {
    navbar: null,
    navToggle: null,
    navLinks: null,
    links: null,

    init() {
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.links = document.querySelectorAll('.nav-link');

        this.bindEvents();
        this.updateActiveLink();
    },

    bindEvents() {
        // Mobile toggle
        this.navToggle?.addEventListener('click', () => {
            this.navToggle.classList.toggle('active');
            this.navLinks?.classList.toggle('active');
        });

        // Close mobile menu on link click
        this.links.forEach(link => {
            link.addEventListener('click', () => {
                this.navToggle?.classList.remove('active');
                this.navLinks?.classList.remove('active');
            });
        });

        // Navbar background on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar?.classList.add('scrolled');
            } else {
                this.navbar?.classList.remove('scrolled');
            }
        });

        // Update active link on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveLink();
        });
    },

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                this.links.forEach(link => link.classList.remove('active'));
                correspondingLink?.classList.add('active');
            }
        });
    }
};

/**
 * Scroll Effects Module
 */
const ScrollEffects = {
    observer: null,

    init() {
        // Smooth scroll for anchor links
        this.bindSmoothScroll();

        // Fade-in animations on scroll
        this.initScrollAnimations();
    },

    bindSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);

                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    },

    initScrollAnimations() {
        // Add fade-in class to animatable elements
        const animatableElements = document.querySelectorAll(
            '.section-title, .section-subtitle, .project-card, .about-text, .stat, .contact-item, .form-group'
        );

        animatableElements.forEach(el => {
            el.classList.add('fade-in');
        });

        // Intersection Observer for fade-in animations
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.fade-in').forEach(el => {
            this.observer.observe(el);
        });

        // Parallax effect for hero
        this.initParallax();
    },

    initParallax() {
        const hero3D = document.querySelector('.hero-3d-container');

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = document.querySelector('.hero')?.offsetHeight || 0;

            if (scrolled < heroHeight && hero3D) {
                const parallax = scrolled * 0.3;
                hero3D.style.transform = `translateY(${parallax}px)`;
            }
        });
    }
};

/**
 * Project Gallery Module
 */
const ProjectGallery = {
    cards: null,

    init() {
        this.cards = document.querySelectorAll('.project-card');
        this.bindEvents();
    },

    bindEvents() {
        this.cards.forEach(card => {
            // Hover effect handled by CSS
            // Could add click-to-expand functionality here
            card.addEventListener('click', () => {
                // Future: Open project modal/lightbox
                console.log('Project clicked:', card.dataset.project);
            });
        });
    }
};

/**
 * Contact Form Module
 */
const ContactForm = {
    form: null,

    init() {
        this.form = document.getElementById('contact-form');
        this.bindEvents();
    },

    bindEvents() {
        this.form?.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);

            // Here you would typically send to a backend
            // For now, just show success message
            this.showSuccess();

            // Reset form
            this.form.reset();
        });
    },

    showSuccess() {
        // Create success message
        const successMsg = document.createElement('div');
        successMsg.className = 'form-success';
        successMsg.innerHTML = `
            <div style="
                background: rgba(0, 181, 184, 0.1);
                border: 1px solid #00b5b8;
                border-radius: 8px;
                padding: 1rem;
                text-align: center;
                color: #00b5b8;
                margin-top: 1rem;
            ">
                <strong>Thank you!</strong> Your message has been sent. I'll get back to you soon.
            </div>
        `;

        this.form.appendChild(successMsg);

        // Remove after 5 seconds
        setTimeout(() => {
            successMsg.remove();
        }, 5000);
    }
};

/**
 * 3D Scene Manager Wrapper
 */
const SceneManager3D = {
    manager: null,

    init() {
        if (typeof SceneManager === 'undefined') {
            console.warn('SceneManager not loaded. 3D features disabled.');
            return;
        }

        this.manager = new SceneManager();
        this.manager.initializeAllScenes();
    }
};
