// Enhanced JavaScript for Viora Events Website
document.addEventListener('DOMContentLoaded', function() {
    
    // Screen Detection Algorithm
    const ScreenDetector = {
        // Device type constants
        MOBILE: 'mobile',
        TABLET: 'tablet',
        DESKTOP: 'desktop',
        
        // Screen size breakpoints (in pixels)
        breakpoints: {
            mobile: 768,
            tablet: 1024
        },
        
        // Current device info
        current: {
            type: '',
            width: 0,
            height: 0,
            orientation: '',
            pixelRatio: 0,
            touchSupported: false
        },
        
        // Initialize the detector
        init: function() {
            this.updateDeviceInfo();
            this.addEventListeners();
            this.applyDeviceSpecificStyles();
            
            // Log initial detection
            console.log('Screen Detection:', this.current);
        },
        
        // Update device information
        updateDeviceInfo: function() {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            this.current.width = width;
            this.current.height = height;
            this.current.pixelRatio = window.devicePixelRatio || 1;
            this.current.touchSupported = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            this.current.orientation = width > height ? 'landscape' : 'portrait';
            
            // Determine device type
            if (width <= this.breakpoints.mobile) {
                this.current.type = this.MOBILE;
            } else if (width <= this.breakpoints.tablet) {
                this.current.type = this.TABLET;
            } else {
                this.current.type = this.DESKTOP;
            }
        },
        
        // Add event listeners for screen changes
        addEventListeners: function() {
            let resizeTimeout;
            
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    const oldType = this.current.type;
                    this.updateDeviceInfo();
                    
                    // If device type changed, apply new styles
                    if (oldType !== this.current.type) {
                        this.applyDeviceSpecificStyles();
                        this.onDeviceTypeChange(oldType, this.current.type);
                    }
                    
                    this.onResize();
                }, 250);
            });
            
            // Listen for orientation changes
            window.addEventListener('orientationchange', () => {
                setTimeout(() => {
                    this.updateDeviceInfo();
                    this.applyDeviceSpecificStyles();
                    this.onOrientationChange();
                }, 100);
            });
        },
        
        // Apply device-specific styles and classes
        applyDeviceSpecificStyles: function() {
            const body = document.body;
            
            // Remove existing device classes
            body.classList.remove('device-mobile', 'device-tablet', 'device-desktop');
            body.classList.remove('orientation-portrait', 'orientation-landscape');
            body.classList.remove('touch-device', 'no-touch-device');
            
            // Add current device class
            body.classList.add(`device-${this.current.type}`);
            body.classList.add(`orientation-${this.current.orientation}`);
            body.classList.add(this.current.touchSupported ? 'touch-device' : 'no-touch-device');
            
            // Add high-DPI class for retina displays
            if (this.current.pixelRatio > 1.5) {
                body.classList.add('high-dpi');
            } else {
                body.classList.remove('high-dpi');
            }
        },
        
        // Callback for device type changes
        onDeviceTypeChange: function(oldType, newType) {
            console.log(`Device type changed from ${oldType} to ${newType}`);
            
            // Trigger custom event
            window.dispatchEvent(new CustomEvent('deviceTypeChange', {
                detail: { oldType, newType, deviceInfo: this.current }
            }));
        },
        
        // Callback for resize events
        onResize: function() {
            window.dispatchEvent(new CustomEvent('screenResize', {
                detail: { deviceInfo: this.current }
            }));
        },
        
        // Callback for orientation changes
        onOrientationChange: function() {
            console.log(`Orientation changed to ${this.current.orientation}`);
            
            window.dispatchEvent(new CustomEvent('orientationChange', {
                detail: { orientation: this.current.orientation, deviceInfo: this.current }
            }));
        },
        
        // Utility methods for checking device types
        isMobile: function() {
            return this.current.type === this.MOBILE;
        },
        
        isTablet: function() {
            return this.current.type === this.TABLET;
        },
        
        isDesktop: function() {
            return this.current.type === this.DESKTOP;
        },
        
        isTouchDevice: function() {
            return this.current.touchSupported;
        },
        
        isPortrait: function() {
            return this.current.orientation === 'portrait';
        },
        
        isLandscape: function() {
            return this.current.orientation === 'landscape';
        },
        
        // Get current device information
        getDeviceInfo: function() {
            return { ...this.current };
        }
    };
    
    // Initialize screen detection
    ScreenDetector.init();
    
    // Make ScreenDetector globally available
    window.ScreenDetector = ScreenDetector;
    
    // Example usage with event listeners
    window.addEventListener('deviceTypeChange', function(e) {
        const { oldType, newType } = e.detail;
        
        // Handle mobile-specific changes
        if (newType === 'mobile') {
            console.log('Switched to mobile view - applying mobile optimizations');
            // Add mobile-specific functionality here
        }
        
        // Handle desktop-specific changes
        if (newType === 'desktop') {
            console.log('Switched to desktop view - applying desktop optimizations');
            // Add desktop-specific functionality here
        }
    });
    
    // Initialize AOS (Animate On Scroll) with screen detection
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,
        offset: 100,
        disable: function() {
            return ScreenDetector.isMobile();
        }
    });

    // Navigation functionality
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const header = document.querySelector('.header');

    // Mobile menu toggle
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('nav-open');
            });
        });
    }

    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Enhanced Team Member Interactions
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach((member, index) => {
        // Add staggered animation delay
        member.style.setProperty('--animation-delay', `${index * 0.1}s`);
        
        // Enhanced hover effects
        member.addEventListener('mouseenter', function() {
            const placeholder = this.querySelector('.team-placeholder');
            if (placeholder) {
                placeholder.style.transform = 'scale(1.15) rotate(5deg)';
            }
        });
        
        member.addEventListener('mouseleave', function() {
            const placeholder = this.querySelector('.team-placeholder');
            if (placeholder) {
                placeholder.style.transform = 'scale(1) rotate(0deg)';
            }
        });

        // Add click interaction for mobile
        member.addEventListener('click', function() {
            if (ScreenDetector.isMobile()) {
                this.classList.toggle('active');
            }
        });
    });

    // Team Stats Animation
    const teamStats = document.querySelectorAll('.team-stat');
    teamStats.forEach((stat, index) => {
        stat.style.setProperty('--animation-delay', `${index * 0.2}s`);
    });

    // Intersection Observer for team section
    const teamSection = document.querySelector('.team-section');
    if (teamSection) {
        const teamObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    
                    // Trigger staggered animations for team members
                    const members = entry.target.querySelectorAll('.team-member');
                    members.forEach((member, index) => {
                        setTimeout(() => {
                            member.classList.add('animate');
                        }, index * 100);
                    });
                }
            });
        }, {
            threshold: 0.2
        });

        teamObserver.observe(teamSection);
    }

    // Stats counter animation
    function animateStats() {
        const statsNumbers = document.querySelectorAll('.stats-number');
        
        statsNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const increment = target / 50;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    stat.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target;
                    if (target === 98) stat.textContent = '98%';
                    if (target === 15) stat.textContent = '15+';
                    if (target === 500) stat.textContent = '500+';
                }
            };
            
            updateCounter();
        });
    }

    // Trigger stats animation when in viewport
    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        statsObserver.observe(statsSection);
    }

    // Progress bars animation
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        progressBars.forEach((bar, index) => {
            const width = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = width + '%';
            }, index * 200);
        });
    }

    // Trigger progress bars animation when in viewport
    const progressSection = document.querySelector('.progress-widget');
    if (progressSection) {
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(animateProgressBars, 500);
                    progressObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3
        });

        progressObserver.observe(progressSection);
    }

    // Portfolio filter functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            portfolioItems.forEach((item, index) => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, index * 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Testimonials slider
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let currentTestimonial = 0;

    function showNextTestimonial() {
        testimonialCards.forEach(card => card.classList.remove('active'));
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        testimonialCards[currentTestimonial].classList.add('active');
    }

    // Auto-rotate testimonials every 5 seconds
    if (testimonialCards.length > 1) {
        setInterval(showNextTestimonial, 5000);
    }

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const requiredFields = contactForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#f44336';
                    isValid = false;
                } else {
                    field.style.borderColor = '#e1e1e1';
                }
            });

            if (isValid) {
                // Show success message
                showNotification('Thank you for your inquiry! We will get back to you soon.', 'success');
                contactForm.reset();
            } else {
                showNotification('Please fill in all required fields.', 'error');
            }
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            removeNotification(notification);
        }, 5000);

        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            removeNotification(notification);
        });
    }

    function removeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link tracking
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', throttle(function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinksAll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }, 100));

    // Loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        
        // If image is already loaded
        if (img.complete) {
            img.classList.add('loaded');
        }
    });

    // Service cards enhancement
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const overlay = this.querySelector('.service-overlay');
            if (overlay) {
                overlay.style.opacity = '1';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const overlay = this.querySelector('.service-overlay');
            if (overlay) {
                overlay.style.opacity = '0';
            }
        });
    });

    // Add loading states for better UX
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Trigger any delayed animations
        setTimeout(() => {
            document.querySelectorAll('.delayed-animation').forEach(el => {
                el.classList.add('animate');
            });
        }, 500);
    });

    // Utility function for throttling
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    console.log('Viora Events website loaded successfully!');
});