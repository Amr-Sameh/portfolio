// Particle Animation System
class ParticleSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        
        this.setupCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }
    
    setupCanvas() {
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.opacity = '0.6';
        document.body.appendChild(this.canvas);
        
        this.resize();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: Math.random() > 0.5 ? '#00f5ff' : '#7c3aed'
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx += dx * force * 0.0001;
                particle.vy += dy * force * 0.0001;
            }
            
            // Boundary check
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Keep particles in bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
        });
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
            this.ctx.fill();
            
            // Draw connections
            this.particles.forEach(other => {
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    const opacity = (120 - distance) / 120 * 0.2;
                    this.ctx.strokeStyle = `rgba(0, 245, 255, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });
    }
    
    animate() {
        this.updateParticles();
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particle system
    new ParticleSystem();
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        }
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements that should animate
    const animateElements = document.querySelectorAll('.timeline-item, .skill-category, .education-item, .contact-item, .stat');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Hero title display (removed typing animation to preserve HTML formatting)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
    }

    // Contact form handling
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            this.reset();
        });
    }

    // Skill tags interaction
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Active navigation highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Enhanced parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroImage = document.querySelector('.profile-image');
        const heroText = document.querySelector('.hero-text');
        
        if (hero && heroImage) {
            const rate = scrolled * -0.3;
            const textRate = scrolled * -0.1;
            heroImage.style.transform = `translateY(${rate}px) scale(${1 + scrolled * 0.0001})`;
            if (heroText) {
                heroText.style.transform = `translateY(${textRate}px)`;
            }
        }
    });

    // Advanced cursor trail effect
    const cursor = document.createElement('div');
    cursor.className = 'cursor-trail';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(0, 245, 255, 0.8) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        transform: translate(-50%, -50%);
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Enhanced scroll-triggered animations with stagger
    const advancedObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.dataset.delay || 0;
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    
                    // Add subtle bounce effect for cards
                    if (element.classList.contains('skill-category') || 
                        element.classList.contains('stat-card') ||
                        element.classList.contains('publication-item')) {
                        element.style.animation = 'fadeInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
                    }
                }, delay);
                
                advancedObserver.unobserve(element);
            }
        });
    }, { 
        threshold: 0.15,
        rootMargin: '50px'
    });

    // Add staggered delays for grouped elements
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const cards = section.querySelectorAll('.skill-category, .stat-card, .publication-item, .timeline-item, .contact-item');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.dataset.delay = index * 100;
            advancedObserver.observe(card);
        });
    });

    // Enhanced loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Advanced stagger animation for hero elements
        const heroElements = [
            { selector: '.hero-title', delay: 0, animation: 'slideInLeft' },
            { selector: '.hero-subtitle', delay: 200, animation: 'fadeInUp' },
            { selector: '.hero-description', delay: 400, animation: 'fadeInUp' },
            { selector: '.hero-buttons', delay: 600, animation: 'fadeInUp' },
            { selector: '.social-links', delay: 800, animation: 'slideInRight' }
        ];
        
        heroElements.forEach(({ selector, delay, animation }) => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '0';
                element.style.transform = animation === 'slideInLeft' ? 'translateX(-50px)' : 
                                        animation === 'slideInRight' ? 'translateX(50px)' : 'translateY(30px)';
                
                setTimeout(() => {
                    element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                    element.style.opacity = '1';
                    element.style.transform = 'translate(0, 0)';
                }, delay + 500);
            }
        });
        
        // Progressive section reveal
        setTimeout(() => {
            document.querySelectorAll('section:not(#home)').forEach((section, index) => {
                section.style.opacity = '0';
                section.style.transform = 'translateY(50px)';
                
                setTimeout(() => {
                    section.style.transition = 'all 1s ease';
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }, index * 200);
            });
        }, 1000);
    });

    // Performance optimization
    let ticking = false;
    
    function updateOnScroll() {
        // Navbar background update with new color
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(14, 18, 17, 0.8)';
            navbar.style.backdropFilter = 'blur(12px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.02)';
            navbar.style.backdropFilter = 'blur(8px)';
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });
});

// EmailJS Configuration & Contact Form Functionality with Spam Protection
(function() {
    // Initialize EmailJS with your public key
    emailjs.init("M8vgkMIzPOVbJfiD0");
    
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const messageTextarea = document.getElementById('message');
    const charCount = document.getElementById('char-count');
    
    // Spam protection variables
    let formStartTime = Date.now();
    let lastSubmissionTime = 0;
    const MINIMUM_TIME_BETWEEN_SUBMISSIONS = 30000; // 30 seconds
    const MINIMUM_FORM_TIME = 3000; // 3 seconds minimum to fill form
    
    // Character counter
    if (messageTextarea && charCount) {
        messageTextarea.addEventListener('input', function() {
            const length = this.value.length;
            charCount.textContent = length;
            
            if (length > 950) {
                charCount.style.color = 'var(--warning-color)';
            } else if (length > 800) {
                charCount.style.color = 'var(--text-muted)';
            } else {
                charCount.style.color = 'var(--text-secondary)';
            }
        });
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Spam Protection Checks
            const currentTime = Date.now();
            const timeSinceLastSubmission = currentTime - lastSubmissionTime;
            const timeSinceFormStart = currentTime - formStartTime;
            
            // Check honeypot field
            const honeypot = document.querySelector('input[name="website"]');
            if (honeypot && honeypot.value) {
                console.log('Spam detected: honeypot filled');
                showNotification('Error processing your request. Please try again.', 'error');
                return;
            }
            
            // Check submission rate limiting
            if (lastSubmissionTime && timeSinceLastSubmission < MINIMUM_TIME_BETWEEN_SUBMISSIONS) {
                const remainingTime = Math.ceil((MINIMUM_TIME_BETWEEN_SUBMISSIONS - timeSinceLastSubmission) / 1000);
                showNotification(`Please wait ${remainingTime} seconds before sending another message.`, 'error');
                return;
            }
            
            // Check minimum form fill time (prevents instant bot submissions)
            if (timeSinceFormStart < MINIMUM_FORM_TIME) {
                showNotification('Please take a moment to write your message.', 'error');
                return;
            }
            
            // Validate and sanitize inputs
            const formData = {
                from_name: sanitizeInput(document.getElementById('from_name').value),
                from_email: sanitizeInput(document.getElementById('from_email').value),
                message: sanitizeInput(document.getElementById('message').value),
                to_email: 'amrsameh.develop@gmail.com'
            };
            
            // Additional spam content checks
            if (isSpamContent(formData.message) || isSpamContent(formData.from_name)) {
                showNotification('Message contains prohibited content. Please revise and try again.', 'error');
                return;
            }
            
            // Show loading state
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
            submitBtn.disabled = true;
            
            // Send email using EmailJS
            emailjs.send('service_qqh445s', 'template_dspzq9l', formData)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                    if (charCount) charCount.textContent = '0';
                    lastSubmissionTime = currentTime;
                    
                    // Reset form start time
                    setTimeout(() => {
                        formStartTime = Date.now();
                    }, 1000);
                }, function(error) {
                    console.log('FAILED...', error);
                    showNotification('Failed to send message. Please try again or contact me directly.', 'error');
                })
                .finally(function() {
                    // Reset button state
                    btnText.style.display = 'flex';
                    btnLoading.style.display = 'none';
                    submitBtn.disabled = false;
                });
        });
        
        // Form validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearValidation);
        });
    }
    
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        // Remove existing validation classes
        field.classList.remove('invalid', 'valid');
        
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                field.classList.add('invalid');
                return false;
            } else if (value) {
                field.classList.add('valid');
            }
        } else if (field.required) {
            if (!value) {
                field.classList.add('invalid');
                return false;
            } else {
                field.classList.add('valid');
            }
        }
        
        return true;
    }
    
    function clearValidation(e) {
        e.target.classList.remove('invalid', 'valid');
    }
    
    // Spam protection helper functions
    function sanitizeInput(input) {
        return input.trim()
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
            .replace(/[<>]/g, '') // Remove HTML brackets
            .substring(0, 1000); // Limit length
    }
    
    function isSpamContent(text) {
        const spamKeywords = [
            'viagra', 'casino', 'lottery', 'winner', 'congratulations',
            'click here', 'free money', 'make money fast', 'work from home',
            'no investment', 'limited time', 'act now', 'call now',
            'cheap', 'discount', 'special offer', 'incredible deal'
        ];
        
        const lowerText = text.toLowerCase();
        
        // Check for spam keywords
        const spamCount = spamKeywords.filter(keyword => lowerText.includes(keyword)).length;
        if (spamCount >= 2) return true;
        
        // Check for excessive repeated characters
        if (/(.)\1{4,}/.test(text)) return true;
        
        // Check for excessive caps
        const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
        if (capsRatio > 0.7 && text.length > 10) return true;
        
        // Check for excessive special characters
        const specialChars = (text.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length;
        if (specialChars > text.length * 0.3) return true;
        
        return false;
    }
    
    // Reset form start time when user starts typing
    contactForm.addEventListener('input', function() {
        if (formStartTime === 0) {
            formStartTime = Date.now();
        }
    }, { once: true });
})();

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add notification styles
            notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-color)' : 'var(--warning-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 6px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
    
    // Close button functionality
    closeBtn.addEventListener('click', function() {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
}

// Add CSS for active nav link
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-color) !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
    
    .loaded {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// Citation functionality
window.copyCitation = function(paperType) {
    let citation = '';
    
    if (paperType === 'trackify') {
        citation = 'Sameh, A., Ayman, Prof., Salah, K., Hesham, K., Ibrahim, B., & Hazem, M. (2019). "Trackify: A Robust System for Preserving Money Transactions." ScienceDirect. Available at: https://www.sciencedirect.com/science/article/pii/S1877050919316667';
    } else if (paperType === 'blockchain') {
        citation = 'Sameh, A., Ayman, Prof., Salah, K., Hesham, K., Ibrahim, B., & Hazem, M. "Blockchain for Tracking Serial Numbers in Money Exchanges." Wiley Online Library. Available at: https://onlinelibrary.wiley.com/doi/full/10.1002/isaf.1462';
    }
    
    // Copy to clipboard
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(citation).then(() => {
            showNotification('Citation copied to clipboard!', 'success');
        }).catch(() => {
            // Fallback for older browsers
            fallbackCopyTextToClipboard(citation);
        });
    } else {
        fallbackCopyTextToClipboard(citation);
    }
};

// Fallback copy function for older browsers
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Citation copied to clipboard!', 'success');
    } catch (err) {
        showNotification('Failed to copy citation', 'error');
    }
    
    document.body.removeChild(textArea);
} 