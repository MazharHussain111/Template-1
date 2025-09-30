// ==========================================================================
// Main Application Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Initialize all components
    initThemeToggler();
    initPreloader();
    initScrollAnimations();
    initMobileMenu();
    initContactForm();
    initCounterAnimation();
    initHeaderScrollBehavior();
    initProjectModal();
    initTestimonialsScroll();
    initResumeTabs();
    initResumeSection(); 

});

// ==========================================================================
// Theme Toggler Functionality - UPDATED with URL parameter support
// ==========================================================================
function initThemeToggler() {
    'use strict';
    
    const themeToggler = document.getElementById('themeToggler');
    if (!themeToggler) return;
    
    const themeIcon = themeToggler.querySelector('i');
    
    // Function to get theme from URL parameters
    function getThemeFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('theme');
    }
    
    // Function to update URL with theme parameter
    function updateURLWithTheme(theme) {
        const url = new URL(window.location);
        url.searchParams.set('theme', theme);
        window.history.replaceState({}, '', url);
    }
    
    function setTheme(theme) {
        // Add class to prevent transitions during theme change
        document.documentElement.classList.add('theme-changing');
        
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update URL parameter
        updateURLWithTheme(theme);
        
        // Update icon
        if (theme === 'dark') {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
        
        // Remove the transition prevention after a short delay
        setTimeout(() => {
            document.documentElement.classList.remove('theme-changing');
        }, 50);
    }
    
    // Check for theme in URL parameters first, then localStorage, then default to light
    const urlTheme = getThemeFromURL();
    const savedTheme = localStorage.getItem('theme');
    
    let initialTheme = 'light'; // Default theme
    
    if (urlTheme && (urlTheme === 'light' || urlTheme === 'dark')) {
        initialTheme = urlTheme;
    } else if (savedTheme === 'dark') {
        initialTheme = 'dark';
    }
    
    // Set initial theme
    setTheme(initialTheme);
    
    // Set initial icon based on current theme
    if (initialTheme === 'dark') {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        // Ensure moon icon is shown for light theme
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
    
    themeToggler.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        setTheme(currentTheme === 'light' ? 'dark' : 'light');
    });
    
    // Listen for URL changes (for back/forward navigation)
    window.addEventListener('popstate', function() {
        const urlTheme = getThemeFromURL();
        if (urlTheme && (urlTheme === 'light' || urlTheme === 'dark')) {
            setTheme(urlTheme);
        }
    });
}

// ==========================================================================
// Scroll Animations for Elements with Data Attributes
// ==========================================================================
function initScrollAnimations() {
    'use strict';
    
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (!animatedElements.length) return;
    
    // Set initial styles for animation
    animatedElements.forEach(element => {
        const animationType = element.getAttribute('data-animation') || 'fadeInUp';
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
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
        }
    });
    
    function animateOnScroll() {
        animatedElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                const delay = parseFloat(element.getAttribute('data-delay')) || 0;
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = '';
                    element.classList.add('animated');
                    
                    // Trigger counter animation when about section stats become visible
                    if (element.closest('.about__stats')) {
                        initCounterAnimation();
                    }
                }, delay * 1000);
            }
        });
    }
    
    // Use requestAnimationFrame for better performance
    let ticking = false;
    function updateAnimations() {
        animateOnScroll();
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateAnimations);
            ticking = true;
        }
    }
    
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', requestTick);
    window.addEventListener('resize', requestTick);
    
    // Initial check
    animateOnScroll();
}

// ==========================================================================
// Mobile Menu Functionality
// ==========================================================================
function initMobileMenu() {
    'use strict';
    
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav__links');
    
    if (!menuToggle || !navLinks) return;
    
    const navOverlay = document.createElement('div');
    navOverlay.className = 'nav__overlay';
    document.body.appendChild(navOverlay);
    
    function toggleMenu() {
        const isExpanding = !navLinks.classList.contains('nav__links--active');
        
        navLinks.classList.toggle('nav__links--active');
        navOverlay.classList.toggle('nav__overlay--active');
        menuToggle.classList.toggle('mobile-menu-toggle--active');
        
        menuToggle.setAttribute('aria-expanded', isExpanding.toString());
        document.body.style.overflow = isExpanding ? 'hidden' : '';
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
    
    // Close menu when clicking on links
    const navLinksList = navLinks.querySelectorAll('a');
    navLinksList.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close menu on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('nav__links--active')) {
            closeMenu();
        }
    });
    
    // Close menu on resize if screen is large enough
    function handleResize() {
        if (window.innerWidth > 1024) {
            closeMenu();
        }
    }
    
    window.addEventListener('resize', handleResize);
}


// ==========================================================================
// Contact Form Handling with Formspree - UPDATED
// ==========================================================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    // Handle form submission
    async function handleSubmit(event) {
        event.preventDefault();
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.btn--primary');
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
            const submitBtn = contactForm.querySelector('.btn--primary');
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
// Counter Animation for Statistics - 
// ==========================================================================
function initCounterAnimation() {
    'use strict';
    
    // Target hero stat numbers specifically
    const counterElements = document.querySelectorAll('.hero__stat-number');
    if (!counterElements.length) return;
    
    // Check if counters have already been animated
    if (counterElements[0].textContent !== '0') return;
    
    let hasCounted = false;
    
    function animateCounters() {
        if (hasCounted) return;
        
        const heroSection = document.querySelector('.hero__stats');
        if (!heroSection) return;
        
        const sectionPosition = heroSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (sectionPosition < screenPosition) {
            hasCounted = true;
            
            counterElements.forEach((counter, index) => {
                const target = parseInt(counter.getAttribute('data-count'), 10);
                const duration = 3000;
                const increment = target / (duration / 16);
                let current = 0;
                
                // Clear any existing content
                counter.textContent = '0';
                
                setTimeout(() => {
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            clearInterval(timer);
                            current = target;
                            counter.textContent = target;
                        } else {
                            counter.textContent = Math.floor(current);
                        }
                    }, 16);
                }, index * 300);
            });
        }
    }
    
    // Use intersection observer for better performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    });
    
    const heroStats = document.querySelector('.hero__stats');
    if (heroStats) {
        observer.observe(heroStats);
    }
    
    // Also trigger on scroll as backup
    window.addEventListener('scroll', animateCounters);
    
    // Initial check
    setTimeout(animateCounters, 100);
}

// ==========================================================================
// Header Hide/Show on Scroll Functionality
// ==========================================================================
function initHeaderScrollBehavior() {
    'use strict';
    
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    const scrollThreshold = 100;
    let ticking = false;
    
    function updateHeader() {
        const currentScrollY = window.scrollY;
        
        // Add scrolled class when not at top
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header based on scroll direction
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
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    updateHeader(); // Initial call
}


// ==========================================================================
// Project Modal Functionality - ENHANCED
// ==========================================================================
function initProjectModal() {
    'use strict';
    
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

    function openModal(projectId) {
        const project = projects[projectId];
        if (!project) return;
        
        document.getElementById('modalTitle').textContent = project.title;
        document.getElementById('modalCategory').textContent = project.category;
        document.getElementById('modalDescription').textContent = project.description;
        
        populateList('modalFeatures', project.features);
        populateList('modalResults', project.results);
        
        modal.classList.add('project-modal--active');
        document.body.style.overflow = 'hidden';
        
        // Focus trap for accessibility
        trapFocus(modal);
    }
    
    function populateList(elementId, items) {
        const listElement = document.getElementById(elementId);
        if (!listElement) return;
        
        listElement.innerHTML = '';
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            listElement.appendChild(li);
        });
    }
    
    function closeModal() {
        modal.classList.remove('project-modal--active');
        document.body.style.overflow = 'auto';
    }
    
    // Add click events to project cards
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            openModal(projectId);
        });
        
        // Add keyboard support
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const projectId = this.getAttribute('data-project');
                openModal(projectId);
            }
        });
    });
    
    // Close modal events
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
    
    // Focus trap function for accessibility
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
        
        firstElement.focus();
    }
}


// Enhanced Testimonials Auto Scroll Functionality
function initTestimonialsScroll() {
    const testimonialsTracks = document.querySelectorAll('.testimonials__track');
    if (!testimonialsTracks.length) return;
    
    testimonialsTracks.forEach((track, index) => {
        // Clone testimonials for infinite scroll effect
        const testimonials = track.querySelectorAll('.testimonial__card');
        testimonials.forEach(card => {
            const clone = card.cloneNode(true);
            track.appendChild(clone);
        });
        
        // Pause animation on hover
        track.addEventListener('mouseenter', () => {
            track.style.animationPlayState = 'paused';
        });
        
        track.addEventListener('mouseleave', () => {
            track.style.animationPlayState = 'running';
        });
        
        // Handle touch events for mobile
        let touchStartX = 0;
        let isPausedByTouch = false;
        
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            track.style.animationPlayState = 'paused';
            isPausedByTouch = true;
        });
        
        track.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const swipeThreshold = 50;
            
            if (Math.abs(touchEndX - touchStartX) > swipeThreshold) {
                // User swiped, keep animation paused
                isPausedByTouch = true;
            } else {
                // Just a tap, resume animation after a delay
                isPausedByTouch = false;
                setTimeout(() => {
                    if (!isPausedByTouch) {
                        track.style.animationPlayState = 'running';
                    }
                }, 3000);
            }
        });
        
        // Reset animation when it completes to create seamless loop
        track.addEventListener('animationiteration', () => {
            // This creates the infinite loop effect
        });
    });
}

// ==========================================================================
// Preloader Functionality
// ==========================================================================
function initPreloader() {
    'use strict';
    
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    
    function hidePreloader() {
        preloader.classList.add('hidden');
        
        // Remove preloader from DOM after animation completes
        setTimeout(() => {
            if (preloader.parentNode) {
                preloader.remove();
            }
        }, 500);
    }
    
    // Hide when page is fully loaded
    window.addEventListener('load', () => {
        setTimeout(hidePreloader, 1000); // Minimum show time
    });
    
    // Fallback - hide after 3 seconds
    setTimeout(() => {
        if (document.readyState === 'loading') {
            hidePreloader();
        }
    }, 3000);
}
// ==========================================================================
// Resume Tabs Functionality
// ==========================================================================
function initResumeTabs() {
    const tabs = document.querySelectorAll('.resume__tab');
    const tabContents = document.querySelectorAll('.resume__tab-content');
    
    if (!tabs.length || !tabContents.length) return;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('resume__tab--active'));
            tabContents.forEach(c => c.classList.remove('resume__tab-content--active'));
            
            // Add active class to current tab and content
            this.classList.add('resume__tab--active');
            document.getElementById(`${targetTab}-tab`).classList.add('resume__tab-content--active');
            
            // Animate skill bars when skills tab is activated
            if (targetTab === 'skills') {
                setTimeout(() => {
                    animateSkillBars();
                }, 300);
            }
        });
    });
    
    // Animate skill bars on initial load if skills tab is active
    if (document.querySelector('.resume__tab--active[data-tab="skills"]')) {
        setTimeout(() => {
            animateSkillBars();
        }, 500);
    }
}

// ==========================================================================
// Animate Skill Progress Bars
// ==========================================================================
function animateSkillBars() {
    const skillProgressBars = document.querySelectorAll('.skill__progress');
    
    skillProgressBars.forEach(bar => {
        const level = bar.getAttribute('data-level');
        if (level) {
            // Reset width to 0 first
            bar.style.width = '0%';
            
            // Animate to target level after a short delay
            setTimeout(() => {
                bar.style.transition = 'width 1.5s ease-in-out';
                bar.style.width = `${level}%`;
                
                // Animate percentage numbers
                const percentageElement = bar.closest('.skill').querySelector('.skill__percentage');
                if (percentageElement) {
                    animateCounter(percentageElement, 0, parseInt(level), 1500);
                }
            }, 100);
        }
    });
}

// ==========================================================================
// Animate Counter for Percentage Numbers
// ==========================================================================
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + '%';
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// ==========================================================================
// Initialize Resume Section with Intersection Observer
// ==========================================================================
function initResumeSection() {
    const resumeSection = document.getElementById('resume');
    if (!resumeSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If skills tab is active when section comes into view, animate the bars
                const activeSkillsTab = document.querySelector('.resume__tab--active[data-tab="skills"]');
                if (activeSkillsTab) {
                    setTimeout(() => {
                        animateSkillBars();
                    }, 500);
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });

    observer.observe(resumeSection);
}
