// ==========================================================================
// Main Application Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPreloader();
    initScrollAnimations();
    initMobileMenu();
    initContactForm();
    initThemeToggler();
    initCounterAnimation();
    initHeaderScrollBehavior();
    initProjectModal();
    initTestimonialsScroll();
    checkUrlTheme();
});

// ==========================================================================
// URL Theme Parameter Handling
// ==========================================================================
function checkUrlTheme() {
    const urlParams = new URLSearchParams(window.location.search);
    const themeParam = urlParams.get('theme');
    
    if (themeParam === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        const themeToggler = document.getElementById('themeToggler');
        if (themeToggler) {
            const themeIcon = themeToggler.querySelector('i');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
        localStorage.setItem('theme', 'dark');
    }
}



// ==========================================================================
// Scroll Animations for Elements with Data Attributes
// ==========================================================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        
        const animationType = element.getAttribute('data-animation') || 'fadeInUp';
        switch(animationType) {
            case 'fadeInUp':
                element.style.transform = 'translateY(50px)';
                break;
            case 'fadeInLeft':
                element.style.transform = 'translateX(-50px)';
                break;
            case 'fadeInRight':
                element.style.transform = 'translateX(50px)';
                break;
            case 'zoomIn':
                element.style.transform = 'scale(0.8)';
                break;
            case 'bounceIn':
                element.style.transform = 'scale(0.3)';
                break;
            default:
                element.style.transform = 'translateY(50px)';
        }
        
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    function animateOnScroll() {
        animatedElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                const delay = element.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = '';
                    element.classList.add('animated');
                }, delay * 1000);
            }
        });
    }
    
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
}

// ==========================================================================
// Mobile Menu Functionality
// ==========================================================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav__links');
    
    if (!menuToggle || !navLinks) return;
    
    const navOverlay = document.createElement('div');
    navOverlay.className = 'nav__overlay';
    document.body.appendChild(navOverlay);
    
    function toggleMenu() {
        navLinks.classList.toggle('nav__links--active');
        navOverlay.classList.toggle('nav__overlay--active');
        menuToggle.classList.toggle('mobile-menu-toggle--active');
        
        const isExpanded = menuToggle.classList.contains('mobile-menu-toggle--active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
        document.body.style.overflow = isExpanded ? 'hidden' : '';
    }
    
    function closeMenu() {
        navLinks.classList.remove('nav__links--active');
        navOverlay.classList.remove('nav__overlay--active');
        menuToggle.classList.remove('mobile-menu-toggle--active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
    
    menuToggle.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', closeMenu);
    
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('nav__links--active')) {
            closeMenu();
        }
    });
    
    function checkScreenSize() {
        if (window.innerWidth > 1024) {
            closeMenu();
        }
    }
    
    window.addEventListener('resize', checkScreenSize);
    window.addEventListener('load', checkScreenSize);
}

// ==========================================================================
// Contact Form Handling with Formspree
// ==========================================================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    async function handleSubmit(event) {
        event.preventDefault();
        
        const submitBtn = contactForm.querySelector('.btn--submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        const data = new FormData(event.target);
        
        try {
            const response = await fetch(event.target.action, {
                method: contactForm.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            });
            
            const status = document.getElementById('formStatus');
            
            if (response.ok) {
                status.textContent = 'Thank you! Your message has been sent successfully.';
                status.className = 'form__status success';
                status.style.display = 'block';
                contactForm.reset();
            } else {
                const errorData = await response.json();
                status.textContent = errorData.errors ? 
                    errorData.errors.map(error => error.message).join(', ') : 
                    'Oops! There was a problem submitting your form. Please try again.';
                status.className = 'form__status error';
                status.style.display = 'block';
            }
        } catch (error) {
            const status = document.getElementById('formStatus');
            status.textContent = 'Oops! There was a problem submitting your form. Please try again.';
            status.className = 'form__status error';
            status.style.display = 'block';
        } finally {
            const submitBtn = contactForm.querySelector('.btn--submit');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            setTimeout(() => {
                const status = document.getElementById('formStatus');
                if (status) status.style.display = 'none';
            }, 5000);
        }
    }
    
    contactForm.addEventListener("submit", handleSubmit);
}

// ==========================================================================
// Counter Animation for Statistics
// ==========================================================================
function initCounterAnimation() {
    const counterElements = document.querySelectorAll('.stat__number');
    if (!counterElements.length) return;
    
    let hasCounted = false;
    
    function animateCounters() {
        if (hasCounted) return;
        
        const aboutSection = document.querySelector('.about__stats');
        if (!aboutSection) return;
        
        const sectionPosition = aboutSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.5;
        
        if (sectionPosition < screenPosition) {
            hasCounted = true;
            
            counterElements.forEach((counter, index) => {
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                counter.classList.add('animate');
                const label = counter.nextElementSibling;
                if (label && label.classList.contains('stat__label')) {
                    label.classList.add('animate');
                }
                
                setTimeout(() => {
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            clearInterval(timer);
                            current = target;
                        }
                        counter.textContent = Math.floor(current);
                    }, 16);
                }, index * 300);
            });
        }
    }
    
    window.addEventListener('scroll', animateCounters);
    window.addEventListener('load', animateCounters);
}

// ==========================================================================
// Preloader Functionality
// ==========================================================================
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    if (!preloader) return;
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 1000);
    });
    
    setTimeout(() => {
        if (!preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }
    }, 3000);
}

// ==========================================================================
// Theme Toggler Functionality
// ==========================================================================
function initThemeToggler() {
    const themeToggler = document.getElementById('themeToggler');
    if (!themeToggler) return;
    
    const themeIcon = themeToggler.querySelector('i');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');
    
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        
        updateUrlWithTheme(theme);
    }
    
    if (savedTheme === 'dark') {
        setTheme('dark');
    } else {
        setTheme('light');
    }
    
    themeToggler.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        setTheme(currentTheme === 'light' ? 'dark' : 'light');
    });
    
    prefersDarkScheme.addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

function updateUrlWithTheme(theme) {
    const url = new URL(window.location);
    url.searchParams.set('theme', theme);
    window.history.replaceState({}, '', url);
}

// ==========================================================================
// Header Hide/Show on Scroll Functionality
// ==========================================================================
function initHeaderScrollBehavior() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    const scrollThreshold = 100;
    let ticking = false;
    
    function handleScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        if (currentScrollY > scrollThreshold) {
            if (currentScrollY > lastScrollY) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
        } else {
            header.classList.remove('hidden');
        }
        
        lastScrollY = currentScrollY;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    handleScroll();
}

// ==========================================================================
// Project Modal Functionality
// ==========================================================================
function initProjectModal() {
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.project-modal__close');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (!modal) return;
    
    const projects = {
        1: {
            title: "Tech Blog Series",
            category: "Blog Writing • SEO",
            description: "Developed a comprehensive blog series for a leading tech company, focusing on emerging technologies and industry trends.",
            features: [
                "15+ in-depth articles on emerging technologies",
                "SEO optimization with targeted keywords",
                "Engaging visuals and infographics",
                "Social media promotion strategy"
            ],
            results: [
                "45% increase in organic traffic",
                "28% higher engagement rate",
                "Generated 120+ qualified leads",
                "Improved domain authority by 15 points"
            ]
        },
        2: {
            title: "E-commerce Website Content",
            category: "Web Content • Product Descriptions",
            description: "Created compelling product descriptions and website copy for an e-commerce platform specializing in sustainable products.",
            features: [
                "200+ product descriptions optimized for conversions",
                "Brand storytelling throughout the website",
                "SEO-optimized category pages",
                "Consistent brand voice across all content"
            ],
            results: [
                "32% increase in conversion rate",
                "Reduced bounce rate by 25%",
                "Improved average time on site by 40%",
                "25% growth in returning customers"
            ]
        },
        3: {
            title: "Brand Storytelling Campaign",
            category: "Brand Strategy • Content",
            description: "Developed a comprehensive brand storytelling campaign for a startup, creating narratives that connected with their target audience.",
            features: [
                "Company origin story and mission articulation",
                "Customer success case studies",
                "Employee spotlight features",
                "Multi-channel content distribution"
            ],
            results: [
                "68% increase in brand awareness",
                "40% higher engagement on social media",
                "Generated media coverage in 3 industry publications",
                "Improved customer loyalty metrics by 35%"
            ]
        },
        4: {
            title: "Social Media Campaign",
            category: "Social Media • Engagement",
            description: "Designed and executed a social media content strategy that increased engagement and built community around a lifestyle brand.",
            features: [
                "Daily content calendar across 4 platforms",
                "User-generated content campaigns",
                "Interactive stories and polls",
                "Influencer collaboration content"
            ],
            results: [
                "Tripled follower growth in 3 months",
                "Engagement rate increased from 2% to 6.5%",
                "Generated 500+ user-generated content submissions",
                "Drove 25% of total website traffic from social media"
            ]
        },
        5: {
            title: "Technical Whitepaper",
            category: "Technical Writing • Research",
            description: "Researched and wrote a comprehensive technical whitepaper on AI implementation in healthcare.",
            features: [
                "30-page in-depth research document",
                "Case studies and data analysis",
                "Executive summary for quick consumption",
                "Technical appendix for specialists"
            ],
            results: [
                "Downloaded 2,500+ times in first month",
                "Cited in 3 industry publications",
                "Generated 350+ qualified leads",
                "Used as sales enablement material by client's team"
            ]
        },
        6: {
            title: "Email Marketing Campaign",
            category: "Email Marketing • Copywriting",
            description: "Developed a multi-email nurture sequence for a SaaS company, guiding prospects through the customer journey.",
            features: [
                "7-email automated sequence",
                "Personalized content based on user behavior",
                "A/B tested subject lines and CTAs",
                "Mobile-optimized templates"
            ],
            results: [
                "22% open rate (industry average: 18%)",
                "8% click-through rate (industry average: 3%)",
                "15% conversion rate from lead to customer",
                "Generated $125K in revenue in first quarter"
            ]
        }
    };

    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            const project = projects[projectId];
            
            if (project) {
                document.getElementById('modalTitle').textContent = project.title;
                document.getElementById('modalCategory').textContent = project.category;
                document.getElementById('modalDescription').textContent = project.description;
                
                const featuresList = document.getElementById('modalFeatures');
                featuresList.innerHTML = '';
                project.features.forEach(feature => {
                    const li = document.createElement('li');
                    li.textContent = feature;
                    featuresList.appendChild(li);
                });
                
                const resultsList = document.getElementById('modalResults');
                resultsList.innerHTML = '';
                project.results.forEach(result => {
                    const li = document.createElement('li');
                    li.textContent = result;
                    resultsList.appendChild(li);
                });
                
                modal.classList.add('project-modal--active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeModal() {
        modal.classList.remove('project-modal--active');
        setTimeout(() => {
            document.body.style.overflow = 'auto';
        }, 300);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('project-modal__overlay')) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('project-modal--active')) {
            closeModal();
        }
    });
}

// ==========================================================================
// Enhanced Testimonials Auto Scroll Functionality
// ==========================================================================
function initTestimonialsScroll() {
    const testimonialsTrack = document.querySelector('.testimonials__track');
    if (!testimonialsTrack) return;
    
    const testimonials = testimonialsTrack.querySelectorAll('.testimonial__card');
    testimonials.forEach(card => {
        const clone = card.cloneNode(true);
        testimonialsTrack.appendChild(clone);
    });
    
    testimonialsTrack.addEventListener('mouseenter', () => {
        testimonialsTrack.style.animationPlayState = 'paused';
    });
    
    testimonialsTrack.addEventListener('mouseleave', () => {
        testimonialsTrack.style.animationPlayState = 'running';
    });
    
    let touchStartX = 0;
    let isPausedByTouch = false;
    
    testimonialsTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        testimonialsTrack.style.animationPlayState = 'paused';
        isPausedByTouch = true;
    });
    
    testimonialsTrack.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const swipeThreshold = 50;
        
        if (Math.abs(touchEndX - touchStartX) > swipeThreshold) {
            isPausedByTouch = true;
        } else {
            isPausedByTouch = false;
            setTimeout(() => {
                if (!isPausedByTouch) {
                    testimonialsTrack.style.animationPlayState = 'running';
                }
            }, 2000);
        }
    });
}