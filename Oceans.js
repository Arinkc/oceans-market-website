// Shared JavaScript functionality for Ocean's Market website

// Common utility functions
const OceanMarket = {
    // Smooth scrolling for navigation links
    initSmoothScrolling: function() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    },

    // Add loading states to buttons
    addLoadingState: function(button, text = 'Loading...') {
        const originalText = button.textContent;
        button.textContent = text;
        button.disabled = true;
        
        return function() {
            button.textContent = originalText;
            button.disabled = false;
        };
    },

    // Show notification messages
    showNotification: function(message, type = 'info', duration = 3000) {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        // Set background color based on type
        const colors = {
            'success': '#28a745',
            'error': '#dc3545',
            'warning': '#ffc107',
            'info': '#17a2b8'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Auto remove after duration
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    },

    // Format currency
    formatCurrency: function(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    // Validate email
    isValidEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validate phone number
    isValidPhone: function(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    },

    // Get current time in store timezone (EST)
    getCurrentTime: function() {
        const now = new Date();
        const estTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
        return estTime;
    },

    // Check if store is currently open
    isStoreOpen: function() {
        const now = this.getCurrentTime();
        const currentDay = now.getDay();
        const currentTime = now.getHours() * 100 + now.getMinutes();
        
        const storeHours = {
            monday: { open: 700, close: 2300 },
            tuesday: { open: 700, close: 2300 },
            wednesday: { open: 700, close: 2300 },
            thursday: { open: 700, close: 2300 },
            friday: { open: 700, close: 0 },
            saturday: { open: 700, close: 0 },
            sunday: { open: 700, close: 0 }
        };

        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const today = dayNames[currentDay];
        const todayHours = storeHours[today];

        if (!todayHours) return false;

        // Handle midnight closing (0 means next day)
        if (todayHours.close === 0) {
            return currentTime >= todayHours.open || currentTime < 100; // Open until 1 AM
        }

        return currentTime >= todayHours.open && currentTime < todayHours.close;
    },

    // Add intersection observer for animations
    addScrollAnimations: function() {
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

        // Observe elements with animation class
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    },

    // Initialize common features
    init: function() {
        this.initSmoothScrolling();
        this.addScrollAnimations();
        this.addNotificationStyles();
    },

    // Add CSS for notifications
    addNotificationStyles: function() {
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                .animate-in {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
};

// Navigation enhancement
const Navigation = {
    // Add active state to current page
    setActivePage: function() {
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes(currentPage)) {
                link.classList.add('active');
            }
        });
    },

    // Add mobile menu toggle
    addMobileMenu: function() {
        // Create mobile menu button
        const nav = document.querySelector('nav');
        if (nav && !document.querySelector('.mobile-menu-btn')) {
            const menuBtn = document.createElement('button');
            menuBtn.className = 'mobile-menu-btn';
            menuBtn.innerHTML = '☰';
            menuBtn.style.cssText = `
                display: none;
                background: none;
                border: none;
                font-size: 1.5rem;
                color: white;
                cursor: pointer;
                padding: 0.5rem;
            `;

            // Add mobile styles
            const mobileStyles = document.createElement('style');
            mobileStyles.textContent = `
                @media (max-width: 768px) {
                    .mobile-menu-btn {
                        display: block !important;
                    }
                    nav ul {
                        flex-direction: column;
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background-color: #FFA07A;
                        display: none;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    }
                    nav ul.show {
                        display: flex !important;
                    }
                    nav ul li {
                        width: 100%;
                        text-align: center;
                    }
                }
            `;
            document.head.appendChild(mobileStyles);

            nav.insertBefore(menuBtn, nav.firstChild);

            // Toggle menu
            menuBtn.addEventListener('click', function() {
                const ul = nav.querySelector('ul');
                ul.classList.toggle('show');
            });
        }
    },

    init: function() {
        this.setActivePage();
        this.addMobileMenu();
    }
};

// Form utilities
const FormUtils = {
    // Add real-time validation
    addRealTimeValidation: function(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                this.validateField(this);
            }.bind(this));
            
            input.addEventListener('input', function() {
                this.clearFieldError(this);
            }.bind(this));
        });
    },

    validateField: function(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch(fieldName) {
            case 'name':
                if (!value) {
                    errorMessage = 'Please enter your name';
                    isValid = false;
                }
                break;
            case 'email':
                if (!value) {
                    errorMessage = 'Please enter your email';
                    isValid = false;
                } else if (!OceanMarket.isValidEmail(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;
            case 'phone':
                if (value && !OceanMarket.isValidPhone(value)) {
                    errorMessage = 'Please enter a valid phone number';
                    isValid = false;
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    },

    showFieldError: function(field, message) {
        this.clearFieldError(field);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = 'color: #dc3545; font-size: 0.875rem; margin-top: 0.25rem;';
        
        field.parentNode.appendChild(errorElement);
        field.style.borderColor = '#dc3545';
    },

    clearFieldError: function(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = '';
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    OceanMarket.init();
    Navigation.init();
});

// Export for use in other scripts
window.OceanMarket = OceanMarket;
window.Navigation = Navigation;
window.FormUtils = FormUtils;
