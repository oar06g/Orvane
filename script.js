/**
 * Network of Influence - Modern Minimal Landing Page JavaScript
 * 
 * Features:
 * - Modern theme toggle (light/dark)
 * - Modal functionality with accessibility
 * - Smooth animations and scroll effects
 * - Image hover effects
 * - Performance optimized
 */

(function() {
    'use strict';

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initThemeToggle();
        initModals();
        initScrollAnimations();
        initImageEffects();
        initFooterPosition();
    });

    /**
     * Initialize modern theme toggle functionality
     */
    function initThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        const themeIcon = themeToggle.querySelector('.theme-icon');
        
        // Apply saved theme or default
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-toggle');
        } else {
            document.body.classList.remove('dark-theme');
        }
        
        updateThemeIcon(themeIcon, savedTheme === 'dark');
        
        // Toggle theme on click
        themeToggle.addEventListener('click', function() {
            const isDark = document.body.classList.contains('dark-theme');
            
            if (isDark) {
                document.body.classList.remove('dark-theme');
                localStorage.setItem('theme', 'light');
                updateThemeIcon(themeIcon, false);
            } else {
                document.body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
                updateThemeIcon(themeIcon, true);
            }
        });
        
        // Keyboard accessibility
        themeToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                themeToggle.click();
            }
        });
    }
    
    /**
     * Update theme toggle icon
     */
    function updateThemeIcon(icon, isDark) {
        icon.textContent = isDark ? '🌙' : '☀️';
    }

    /**
     * Initialize modal functionality with full accessibility
     */
    function initModals() {
        const modalOverlay = document.getElementById('modal-overlay');
        const modalTitle = modalOverlay.querySelector('.modal-title');
        const modalContent = modalOverlay.querySelector('.modal-content');
        const modalClose = modalOverlay.querySelector('.modal-close');
        const policyLinks = document.querySelectorAll('.policy-link');

        // Modal content templates
        const modalContentMap = {
            privacy: {
                title: 'Privacy Policy',
                content: document.getElementById('privacy-content').innerHTML
            },
            terms: {
                title: 'Terms of Service',
                content: document.getElementById('terms-content').innerHTML
            }
        };

        // Store previously focused element for accessibility
        let previousActiveElement = null;

        // Open modal function
        function openModal(type) {
            if (modalContentMap[type]) {
                previousActiveElement = document.activeElement;
                
                modalTitle.textContent = modalContentMap[type].title;
                modalContent.innerHTML = modalContentMap[type].content;
                
                modalOverlay.setAttribute('aria-hidden', 'false');
                modalClose.focus();
                
                // Prevent body scroll
                document.body.style.overflow = 'hidden';
                
                // Trap focus within modal
                trapFocus(modalOverlay);
            }
        }

        // Close modal function
        function closeModal() {
            modalOverlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            
            // Return focus to previous element
            if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
                previousActiveElement.focus();
                previousActiveElement = null;
            }
        }

        // Focus trap for accessibility
        function trapFocus(element) {
            const focusableElements = element.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];

            // Handle Tab key navigation
            element.addEventListener('keydown', function handleTabNavigation(e) {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        // Shift + Tab
                        if (document.activeElement === firstFocusable) {
                            e.preventDefault();
                            lastFocusable.focus();
                        }
                    } else {
                        // Tab
                        if (document.activeElement === lastFocusable) {
                            e.preventDefault();
                            firstFocusable.focus();
                        }
                    }
                } else if (e.key === 'Escape') {
                    closeModal();
                }
            });
        }

        // Event listeners
        policyLinks.forEach(link => {
            const modalType = link.dataset.modal;
            
            link.addEventListener('click', function() {
                if (modalType) {
                    openModal(modalType);
                }
            });

            // Keyboard support
            link.addEventListener('keydown', function(e) {
                if ((e.key === 'Enter' || e.key === ' ') && modalType) {
                    e.preventDefault();
                    openModal(modalType);
                }
            });
        });

        modalClose.addEventListener('click', closeModal);
        
        // Close modal when clicking overlay
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    /**
     * Initialize smooth scroll animations
     */
    function initScrollAnimations() {
        // Intersection Observer for scroll-triggered animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll(
            '.skill-card, .step, .vision-description, .cta-content'
        );
        
        animateElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(el);
        });

        // CSS class for animation
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Initialize subtle image hover effects
     */
    function initImageEffects() {
        const images = document.querySelectorAll('.hero-image, .skill-image');
        
        images.forEach(image => {
            image.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05) translateZ(0)';
                this.style.transition = 'transform 0.3s ease';
            });
            
            image.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) translateZ(0)';
            });
        });
    }

    /**
     * Initialize proper footer positioning
     */
    function initFooterPosition() {
        const mainCard = document.querySelector('.main-card');
        const footer = document.querySelector('.site-footer');
        
        // Ensure footer sticks to bottom if content is short
        function adjustLayout() {
            const windowHeight = window.innerHeight;
            const mainCardHeight = mainCard.offsetHeight;
            const footerHeight = footer.offsetHeight;
            
            if (mainCardHeight + footerHeight < windowHeight) {
                footer.style.position = 'absolute';
                footer.style.bottom = '0';
                footer.style.left = '50%';
                footer.style.transform = 'translateX(-50%)';
                footer.style.width = '100%';
            } else {
                footer.style.position = 'relative';
                footer.style.bottom = 'auto';
                footer.style.left = 'auto';
                footer.style.transform = 'none';
                footer.style.width = 'auto';
            }
        }
        
        // Adjust on load and resize
        adjustLayout();
        window.addEventListener('resize', adjustLayout);
        
        // Adjust after animations complete
        setTimeout(adjustLayout, 1000);
    }

    /**
     * Initialize floating shape animations optimization
     */
    function optimizeAnimations() {
        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.querySelectorAll('.floating-shape').forEach(shape => {
                shape.style.animation = 'none';
            });
        }
        
        // Pause animations when tab is not visible (performance optimization)
        document.addEventListener('visibilitychange', function() {
            const shapes = document.querySelectorAll('.floating-shape');
            
            if (document.hidden) {
                shapes.forEach(shape => {
                    shape.style.animationPlayState = 'paused';
                });
            } else {
                shapes.forEach(shape => {
                    shape.style.animationPlayState = 'running';
                });
            }
        });
    }

    /**
     * Initialize keyboard shortcuts
     */
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Alt + D for dark theme toggle
            if (e.altKey && e.key === 'd') {
                e.preventDefault();
                document.querySelector('.theme-toggle').click();
            }
            
            // Alt + M to focus modal links area
            if (e.altKey && e.key === 'm') {
                e.preventDefault();
                const firstPolicyLink = document.querySelector('.policy-link');
                if (firstPolicyLink) {
                    firstPolicyLink.focus();
                }
            }
        });
    }

    // Initialize optimizations and shortcuts
    optimizeAnimations();
    initKeyboardShortcuts();

    // Performance: Debounce resize events
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Trigger any resize-dependent functions here
            document.dispatchEvent(new CustomEvent('optimizedResize'));
        }, 250);
    });

})();