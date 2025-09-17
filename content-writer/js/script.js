// ==========================================================================
// Main Application Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPreloader();
    initSmoothScrolling();
    initAnimations();
    initMobileMenu();
    initScrollAnimations();
    initContactForm();
    initProjectLightbox();
    initThemeToggler();
    initCounterAnimation();
    initHeaderScrollBehavior();
     initProjectModal()
});

// ==========================================================================
// Smooth Scrolling for Navigation Links
// ==========================================================================
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip empty or invalid hash links
            if (targetId === '#' || targetId === '#!') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================================================
// General Animations for Elements
// ==========================================================================
function initAnimations() {
    // Animate elements on scroll
    const animatedElements = document.querySelectorAll(
        '.service-card, .timeline__item, .project-card, .contact__item'
    );
    
    // Set initial state
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Animation function
    function animateOnScroll() {
        animatedElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Event listeners
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
}


// ==========================================================================
// Mobile Menu Functionality
// ==========================================================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav__links');
    const navOverlay = document.querySelector('.nav__overlay');
    
    if (!menuToggle || !navLinks) return;
    
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('nav__links--active');
        navOverlay.classList.toggle('nav__overlay--active');
        menuToggle.classList.toggle('mobile-menu-toggle--active');
        
        // Toggle aria-expanded for accessibility
        const isExpanded = menuToggle.classList.contains('mobile-menu-toggle--active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
        
        // Prevent body scrolling when menu is open
        document.body.style.overflow = navLinks.classList.contains('nav__links--active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on overlay
    if (navOverlay) {
        navOverlay.addEventListener('click', () => {
            navLinks.classList.remove('nav__links--active');
            navOverlay.classList.remove('nav__overlay--active');
            menuToggle.classList.remove('mobile-menu-toggle--active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    }
    
    // Close menu when clicking on a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('nav__links--active');
            if (navOverlay) navOverlay.classList.remove('nav__overlay--active');
            menuToggle.classList.remove('mobile-menu-toggle--active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('nav__links--active')) {
            navLinks.classList.remove('nav__links--active');
            if (navOverlay) navOverlay.classList.remove('nav__overlay--active');
            menuToggle.classList.remove('mobile-menu-toggle--active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

// ==========================================================================
// Scroll Animations for Elements with Data Attributes
// ==========================================================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Set initial state for all animated elements
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        
        // Set initial state based on animation type
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
    
    // Animation function
    function animateOnScroll() {
        animatedElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                // Get delay from data attribute or default to 0
                const delay = element.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = '';
                    element.classList.add('animated');
                }, delay * 1000);
            }
        });
    }
    
    // Event listeners
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Initial check
    animateOnScroll();
}

// ==========================================================================
// Contact Form Handling with Formspree
// ==========================================================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    // Handle form submission
    async function handleSubmit(event) {
        event.preventDefault();
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.btn--submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Collect form data
        const data = new FormData(event.target);
        
        try {
            const response = await fetch(event.target.action, {
                method: contactForm.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const status = document.getElementById('formStatus');
            
            if (response.ok) {
                // Show success message
                status.textContent = 'Thank you! Your message has been sent successfully.';
                status.className = 'form__status success';
                status.style.display = 'block';
                
                // Clear form
                contactForm.reset();
            } else {
                // Show error message
                const errorData = await response.json();
                if (errorData.errors) {
                    status.textContent = errorData.errors.map(error => error.message).join(', ');
                } else {
                    status.textContent = 'Oops! There was a problem submitting your form. Please try again.';
                }
                status.className = 'form__status error';
                status.style.display = 'block';
            }
        } catch (error) {
            // Show error message
            const status = document.getElementById('formStatus');
            status.textContent = 'Oops! There was a problem submitting your form. Please try again.';
            status.className = 'form__status error';
            status.style.display = 'block';
        } finally {
            // Reset button state
            const submitBtn = contactForm.querySelector('.btn--submit');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Hide message after 5 seconds
            setTimeout(() => {
                const status = document.getElementById('formStatus');
                if (status) {
                    status.style.display = 'none';
                }
            }, 5000);
        }
    }
    
    // Add event listener
    contactForm.addEventListener("submit", handleSubmit);
}

// ==========================================================================
// Project Lightbox Functionality
// ==========================================================================
function initProjectLightbox() {
    const lightbox = document.getElementById('projectLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (!lightbox) return;
    
    // Open lightbox when clicking on project card
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            const imageSrc = this.querySelector('img').src;
            const imageAlt = this.querySelector('img').alt;
            
            lightboxImage.src = imageSrc;
            lightboxImage.alt = imageAlt;
            
            // Show lightbox with animation
            lightbox.classList.add('lightbox--active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox when clicking on the background or the image
    function closeLightbox() {
        lightbox.classList.remove('lightbox--active');
        setTimeout(() => {
            document.body.style.overflow = 'auto';
        }, 300);
    }
    
    // Close when clicking outside content (on the overlay)
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('lightbox--active')) {
            closeLightbox();
        }
    });
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
        
        const aboutSection = document.querySelector('.about');
        if (!aboutSection) return;
        
        const sectionPosition = aboutSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (sectionPosition < screenPosition) {
            hasCounted = true;
            
            counterElements.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 3000; // 3 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        clearInterval(timer);
                        current = target;
                    }
                    counter.textContent = Math.floor(current);
                }, 16);
            });
        }
    }
    
    // Run on scroll and on load
    window.addEventListener('scroll', animateCounters);
    window.addEventListener('load', animateCounters);
}

// ==========================================================================
// Preloader Functionality
// ==========================================================================
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    if (!preloader) return;
    
    // Hide preloader when page is fully loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            
            // Remove preloader from DOM after animation completes
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 1000); // Minimum show time
    });
    
    // Fallback - hide preloader after 3 seconds even if page isn't fully loaded
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
    
    // Check for saved theme preference or respect OS preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');
    
    // Set initial theme
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
    
    // Toggle theme on button click
    themeToggler.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (currentTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });
    
    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }
    });
}

// ==========================================================================
// Header Hide/Show on Scroll Functionality
// ==========================================================================
function initHeaderScrollBehavior() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    const scrollThreshold = 100; // Minimum scroll before hiding header
    
    function handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Add scrolled class for background change
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header based on scroll direction
        if (currentScrollY > scrollThreshold) {
            if (currentScrollY > lastScrollY) {
                // Scrolling down - hide header
                header.classList.add('hidden');
            } else {
                // Scrolling up - show header
                header.classList.remove('hidden');
            }
        } else {
            // At top of page - always show header
            header.classList.remove('hidden');
        }
        
        lastScrollY = currentScrollY;
    }
    
    // Throttle the scroll event for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial check
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
    
    // Project data
    const projects = {
        1: {
            title: "Tech Blog Series",
            category: "Blog Writing • SEO",
            image: "images/project1.jpg",
            description: "Developed a comprehensive blog series for a leading tech company, focusing on emerging technologies and industry trends. The content was optimized for SEO and designed to position the company as a thought leader in their niche.",
            features: [
                "15+ in-depth articles on emerging technologies",
                "SEO optimization with targeted keywords",
                "Engaging visuals and infographics",
                "Social media promotion strategy"
            ],
            results: [
                "45% increase in organic traffic",
                "28% higher engagement rate compared to previous content",
                "Generated 120+ qualified leads",
                "Improved domain authority by 15 points"
            ]
        },
        2: {
            title: "E-commerce Website Content",
            category: "Web Content • Product Descriptions",
            image: "images/project2.jpg",
            description: "Created compelling product descriptions and website copy for an e-commerce platform specializing in sustainable products. Focused on conveying brand values while driving conversions.",
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
            image: "images/project3.jpg",
            description: "Developed a comprehensive brand storytelling campaign for a startup, creating narratives that connected with their target audience and differentiated them from competitors.",
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
            image: "images/project4.jpg",
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
            image: "images/project5.jpg",
            description: "Researched and wrote a comprehensive technical whitepaper on AI implementation in healthcare, making complex technical concepts accessible to non-technical stakeholders.",
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
            image: "images/project6.jpg",
            description: "Developed a multi-email nurture sequence for a SaaS company, guiding prospects through the customer journey from awareness to conversion.",
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

    // Open modal when clicking on project card
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            const project = projects[projectId];
            
            if (project) {
                // Populate modal with project data
                document.getElementById('modalImage').src = project.image;
                document.getElementById('modalImage').alt = project.title;
                document.getElementById('modalTitle').textContent = project.title;
                document.getElementById('modalCategory').textContent = project.category;
                document.getElementById('modalDescription').textContent = project.description;
                
                // Populate features
                const featuresList = document.getElementById('modalFeatures');
                featuresList.innerHTML = '';
                project.features.forEach(feature => {
                    const li = document.createElement('li');
                    li.textContent = feature;
                    featuresList.appendChild(li);
                });
                
                // Populate results
                const resultsList = document.getElementById('modalResults');
                resultsList.innerHTML = '';
                project.results.forEach(result => {
                    const li = document.createElement('li');
                    li.textContent = result;
                    resultsList.appendChild(li);
                });
                
                // Show modal
                modal.classList.add('project-modal--active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modal functions
    function closeModal() {
        modal.classList.remove('project-modal--active');
        setTimeout(() => {
            document.body.style.overflow = 'auto';
        }, 300);
    }

    // Close when clicking close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close when clicking outside content (on the overlay)
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('project-modal__overlay')) {
            closeModal();
        }
    });

    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('project-modal--active')) {
            closeModal();
        }
    });
}