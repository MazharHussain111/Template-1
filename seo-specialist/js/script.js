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
    initTestimonials(); 
    initServicesModal();



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
// Contact Form Handling with Formspree
// ==========================================================================
function initContactForm() {
    'use strict';
    
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    async function handleSubmit(event) {
        event.preventDefault();
        
        const submitBtn = contactForm.querySelector('.btn--submit');
        const originalText = submitBtn.innerHTML;
        const statusElement = document.getElementById('formStatus');
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(event.target);
            const response = await fetch(event.target.action, {
                method: contactForm.method,
                body: formData,
                headers: { 
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            if (response.ok) {
                showStatus('Thank you! Your message has been sent successfully.', 'success');
                contactForm.reset();
            } else {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.errors ? 
                    errorData.errors.map(error => error.message).join(', ') : 
                    'Oops! There was a problem submitting your form. Please try again.';
                showStatus(errorMessage, 'error');
            }
        } catch (error) {
            showStatus('Oops! There was a problem submitting your form. Please check your connection and try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    function showStatus(message, type) {
        const statusElement = document.getElementById('formStatus');
        if (!statusElement) return;
        
        statusElement.textContent = message;
        statusElement.className = `form__status ${type}`;
        statusElement.style.display = 'block';
        
        // Hide status after 5 seconds
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 5000);
    }
    
    contactForm.addEventListener('submit', handleSubmit);
}

// ==========================================================================
// Counter Animation for Statistics - FIXED
// ==========================================================================
function initCounterAnimation() {
    'use strict';
    
    const counterElements = document.querySelectorAll('.stat__number');
    if (!counterElements.length) return;
    
    // Check if counters have already been animated
    if (counterElements[0].textContent !== '0') return;
    
    let hasCounted = false;
    
    function animateCounters() {
        if (hasCounted) return;
        
        const aboutSection = document.querySelector('.about__stats');
        if (!aboutSection) return;
        
        const sectionPosition = aboutSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (sectionPosition < screenPosition) {
            hasCounted = true;
            
            counterElements.forEach((counter, index) => {
                const target = parseInt(counter.getAttribute('data-count'), 10);
                const duration = 2000;
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
                        }
                        counter.textContent = Math.floor(current);
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
    
    const aboutSection = document.querySelector('.about__stats');
    if (aboutSection) {
        observer.observe(aboutSection);
    }
    
    // Also trigger on scroll as backup
    window.addEventListener('scroll', animateCounters);
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
// Project Modal Functionality
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
// Testimonials Functionality - UPDATED with animated counters
// ==========================================================================
function initTestimonials() {
    'use strict';
    
    // Counter animation for testimonial stats
    const statNumbers = document.querySelectorAll('.trust-item__number');
    if (!statNumbers.length) return;
    
    let statsAnimated = false;
    
    function animateStats() {
        if (statsAnimated) return;
        
        const testimonialsSection = document.getElementById('testimonials');
        if (!testimonialsSection) return;
        
        const sectionPosition = testimonialsSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (sectionPosition < screenPosition) {
            statsAnimated = true;
            
            statNumbers.forEach((stat, index) => {
                const target = parseInt(stat.getAttribute('data-count'), 10);
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                // Clear any existing content
                stat.textContent = '0';
                
                setTimeout(() => {
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            clearInterval(timer);
                            current = target;
                        }
                        
                        // Format number based on whether it's integer or decimal
                        if (Number.isInteger(target)) {
                            stat.textContent = Math.floor(current);
                        } else {
                            stat.textContent = current.toFixed(1);
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
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    });
    
    const testimonialsSection = document.getElementById('testimonials');
    if (testimonialsSection) {
        observer.observe(testimonialsSection);
    }
    
    // Also trigger on scroll as backup
    window.addEventListener('scroll', animateStats);
}



// ==========================================================================
// Services Modal Functionality - UPDATED
// ==========================================================================
function initServicesModal() {
    'use strict';
    
    const modal = document.getElementById('serviceModal');
    const closeBtn = document.querySelector('.service-modal__close');
    const closeBtnFooter = document.querySelector('.service-modal__close-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    
    if (!modal) return;
    
    const services = {
        1: {
            title: "Technical SEO",
            price: "From $499",
            icon: "fas fa-code",
            description: "Comprehensive website audits and technical optimizations to improve search engine crawling and indexing. I ensure your website meets all technical requirements for optimal search engine performance.",
            features: [
                "Complete website technical audit",
                "Crawlability and indexability optimization",
                "Site architecture and internal linking",
                "Page speed and performance optimization",
                "Mobile-friendliness assessment",
                "Structured data and schema markup",
                "XML sitemap optimization",
                "Robots.txt configuration"
            ],
            benefits: [
                {title: "Better Crawling", desc: "Improved search engine crawling efficiency"},
                {title: "Faster Indexing", desc: "Quick content discovery and indexing"},
                {title: "Enhanced UX", desc: "Better user experience and engagement"},
                {title: "Higher Rankings", desc: "Improved technical foundation for rankings"}
            ],
            process: [
                "Initial comprehensive website audit",
                "Technical issue identification and prioritization",
                "Implementation of optimization recommendations",
                "Continuous monitoring and adjustment"
            ],
            results: [
                {value: "150%", label: "Crawl Efficiency"},
                {value: "2.5x", label: "Indexing Speed"},
                {value: "60%", label: "Page Speed"},
                {value: "40%", label: "Organic Growth"}
            ]
        },
        2: {
            title: "Content SEO",
            price: "From $399",
            icon: "fas fa-edit",
            description: "Strategic content optimization to improve rankings and drive targeted organic traffic. I create and optimize content that both users and search engines love.",
            features: [
                "Comprehensive keyword research and analysis",
                "Content gap identification and strategy",
                "On-page optimization and meta tags",
                "Content creation and optimization",
                "SEO-friendly content structure",
                "Content performance tracking",
                "Regular content updates",
                "Competitor content analysis"
            ],
            benefits: [
                {title: "Higher Rankings", desc: "Improved positions for target keywords"},
                {title: "More Traffic", desc: "Increased qualified organic traffic"},
                {title: "Better Engagement", desc: "Higher user engagement metrics"},
                {title: "Increased Conversions", desc: "More leads and sales from content"}
            ],
            process: [
                "Keyword research and content planning",
                "Content creation and optimization",
                "Implementation and publishing",
                "Performance tracking and optimization"
            ],
            results: [
                {value: "200%", label: "Organic Traffic"},
                {value: "15+", label: "Top Rankings"},
                {value: "50%", label: "Engagement Rate"},
                {value: "35%", label: "Conversion Lift"}
            ]
        },
        3: {
            title: "Link Building",
            price: "From $599",
            icon: "fas fa-link",
            description: "Strategic link acquisition to build domain authority and improve search rankings through quality backlinks from authoritative websites.",
            features: [
                "Competitor backlink analysis and research",
                "Strategic outreach campaign development",
                "Guest posting opportunities and placement",
                "Content promotion and link acquisition",
                "Link quality assessment and monitoring",
                "Relationship building with publishers",
                "Broken link building strategy",
                "Link reclamation and recovery"
            ],
            benefits: [
                {title: "Higher Authority", desc: "Increased domain authority and trust"},
                {title: "Better Rankings", desc: "Improved search engine rankings"},
                {title: "More Referrals", desc: "Increased referral traffic from quality sites"},
                {title: "Brand Exposure", desc: "Enhanced online visibility and reputation"}
            ],
            process: [
                "Competitor analysis and opportunity identification",
                "Outreach strategy and relationship building",
                "Content creation and placement",
                "Link monitoring and performance tracking"
            ],
            results: [
                {value: "45%", label: "Domain Authority"},
                {value: "80+", label: "Quality Links"},
                {value: "120%", label: "Referral Traffic"},
                {value: "25%", label: "Ranking Improvement"}
            ]
        },
        4: {
            title: "Local SEO",
            price: "From $349",
            icon: "fas fa-map-marker-alt",
            description: "Optimize your local presence to attract customers in your geographic area and dominate local search results.",
            features: [
                "Google My Business optimization and management",
                "Local citation building and consistency audit",
                "NAP (Name, Address, Phone) consistency",
                "Local review management and generation",
                "Local keyword research and optimization",
                "Map pack optimization strategy",
                "Local directory submissions",
                "Local content creation and optimization"
            ],
            benefits: [
                {title: "Local Visibility", desc: "Higher visibility in local search results"},
                {title: "More Customers", desc: "Increased foot traffic and local customers"},
                {title: "Phone Calls", desc: "More business inquiries and calls"},
                {title: "Trust Building", desc: "Enhanced local reputation and trust"}
            ],
            process: [
                "Local audit and citation cleanup",
                "Google My Business optimization",
                "Local content and review strategy",
                "Ongoing local presence management"
            ],
            results: [
                {value: "300%", label: "Map Views"},
                {value: "95%", label: "Citation Accuracy"},
                {value: "4.8★", label: "Average Rating"},
                {value: "65%", label: "Local Traffic"}
            ]
        },
        5: {
            title: "E-commerce SEO",
            price: "From $699",
            icon: "fas fa-shopping-cart",
            description: "Specialized SEO strategies for online stores to increase product visibility, drive sales, and maximize revenue from organic search.",
            features: [
                "E-commerce site architecture optimization",
                "Product page SEO and optimization",
                "Category page strategy and optimization",
                "Product schema markup implementation",
                "E-commerce analytics and tracking setup",
                "Shopping feed optimization",
                "Conversion rate optimization for SEO",
                "Seasonal SEO strategy development"
            ],
            benefits: [
                {title: "Product Visibility", desc: "Higher visibility for products in search"},
                {title: "Increased Sales", desc: "More organic sales and revenue"},
                {title: "Better UX", desc: "Improved shopping experience"},
                {title: "Competitive Edge", desc: "Advantage over competitors in search"}
            ],
            process: [
                "E-commerce site audit and analysis",
                "Product and category optimization",
                "Technical implementation and testing",
                "Performance monitoring and optimization"
            ],
            results: [
                {value: "250%", label: "Product Views"},
                {value: "40%", label: "Organic Sales"},
                {value: "3.2x", label: "ROI"},
                {value: "50%", label: "Conversion Rate"}
            ]
        },
        6: {
            title: "SEO Analytics",
            price: "From $299",
            icon: "fas fa-chart-bar",
            description: "Comprehensive tracking, reporting, and analysis to measure SEO performance, ROI, and identify optimization opportunities.",
            features: [
                "Google Analytics and Search Console setup",
                "Custom dashboard creation and configuration",
                "ROI tracking and performance measurement",
                "Regular performance reporting and analysis",
                "Competitor analysis and benchmarking",
                "Keyword ranking tracking and analysis",
                "Conversion tracking and attribution",
                "Custom metric development and tracking"
            ],
            benefits: [
                {title: "Clear Insights", desc: "Understand what's working and why"},
                {title: "Measurable ROI", desc: "Track and demonstrate SEO value"},
                {title: "Data-Driven Decisions", desc: "Make informed optimization choices"},
                {title: "Continuous Improvement", desc: "Identify new opportunities regularly"}
            ],
            process: [
                "Analytics audit and setup",
                "Custom reporting configuration",
                "Regular performance analysis",
                "Strategic recommendations based on data"
            ],
            results: [
                {value: "100%", label: "Tracking Accuracy"},
                {value: "Clear", label: "ROI Measurement"},
                {value: "Data-Driven", label: "Decisions"},
                {value: "Continuous", label: "Optimization"}
            ]
        }
    };

    function openModal(serviceId) {
        const service = services[serviceId];
        if (!service) return;
        
        // Set modal content
        document.getElementById('serviceModalTitle').textContent = service.title;
        document.getElementById('serviceModalPrice').textContent = service.price;
        document.getElementById('serviceModalIcon').innerHTML = `<i class="${service.icon}"></i>`;
        document.getElementById('serviceModalDescription').textContent = service.description;
        
        // Populate features
        populateList('serviceModalFeatures', service.features);
        
        // Populate benefits
        populateBenefits(service.benefits);
        
        // Populate process
        populateProcess(service.process);
        
        // Populate results
        populateResults(service.results);
        
        modal.classList.add('service-modal--active');
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
    
    function populateBenefits(benefits) {
        const container = document.getElementById('serviceModalBenefits');
        if (!container) return;
        
        container.innerHTML = '';
        benefits.forEach(benefit => {
            const div = document.createElement('div');
            div.className = 'benefit-item';
            div.innerHTML = `<strong>${benefit.title}</strong><span>${benefit.desc}</span>`;
            container.appendChild(div);
        });
    }
    
    function populateProcess(steps) {
        const container = document.getElementById('serviceModalProcess');
        if (!container) return;
        
        container.innerHTML = '';
        steps.forEach((step, index) => {
            const div = document.createElement('div');
            div.className = 'process-step';
            div.innerHTML = `
                <div class="process-step__number">${index + 1}</div>
                <div class="process-step__text">${step}</div>
            `;
            container.appendChild(div);
        });
    }
    
    function populateResults(results) {
        const container = document.getElementById('serviceModalResults');
        if (!container) return;
        
        container.innerHTML = '';
        results.forEach(result => {
            const div = document.createElement('div');
            div.className = 'result-item';
            div.innerHTML = `
                <span class="result-item__value">${result.value}</span>
                <span class="result-item__label">${result.label}</span>
            `;
            container.appendChild(div);
        });
    }
    
    function closeModal() {
        modal.classList.remove('service-modal--active');
        document.body.style.overflow = 'auto';
    }
    
    // Add click events to service cards
    serviceCards.forEach(card => {
        const ctaButton = card.querySelector('.service-card__cta');
        
        // Click on card
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking the CTA button (it has its own handler)
            if (e.target !== ctaButton && !ctaButton.contains(e.target)) {
                const serviceId = this.getAttribute('data-service');
                openModal(serviceId);
            }
        });
        
        // Click on CTA button
        ctaButton.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click event
            const serviceId = card.getAttribute('data-service');
            openModal(serviceId);
        });
        
        // Keyboard support
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const serviceId = this.getAttribute('data-service');
                openModal(serviceId);
            }
        });
        
        ctaButton.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const serviceId = card.getAttribute('data-service');
                openModal(serviceId);
            }
        });
    });
    
    // Close modal events
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (closeBtnFooter) {
        closeBtnFooter.addEventListener('click', closeModal);
    }
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('service-modal__overlay')) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('service-modal--active')) {
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

