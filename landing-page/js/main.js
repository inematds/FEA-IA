/**
 * Main JavaScript for Landing Page
 * Engenharia de Agentes de IA 2.0
 */

// ============================================================================
// MOBILE NAVIGATION
// ============================================================================

const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ============================================================================
// SCROLL ANIMATIONS
// ============================================================================

// Add scroll reveal animation
const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe module cards
const moduleCards = document.querySelectorAll('.module-card');
moduleCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Observe feature cards
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// ============================================================================
// HEADER SCROLL EFFECT
// ============================================================================

const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add shadow on scroll
    if (currentScroll > 10) {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// ============================================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));
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

// ============================================================================
// STATS COUNTER ANIMATION
// ============================================================================

const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16); // 60 FPS
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        // Format number
        let displayValue = Math.floor(current);
        if (element.textContent.includes('k')) {
            displayValue = (displayValue / 1000).toFixed(0) + 'k+';
        } else if (element.textContent.includes('h')) {
            displayValue = displayValue + 'h';
        } else if (element.textContent.includes('%')) {
            displayValue = displayValue + '%';
        }

        element.textContent = displayValue;
    }, 16);
};

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');

            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber) {
                const text = statNumber.textContent;
                const number = parseInt(text.replace(/[^0-9]/g, ''));

                if (!isNaN(number)) {
                    statNumber.textContent = '0';
                    setTimeout(() => animateCounter(statNumber, number), 200);
                }
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
    statsObserver.observe(stat);
});

// ============================================================================
// TYPING ANIMATION FOR CODE BLOCK
// ============================================================================

const codeText = `from agno import Agent

agent = Agent(
    name="Assistant",
    model="claude-3-7-sonnet",
    tools=[search_web, analyze_data]
)

response = agent.run(
    "Analyze market trends"
)

# 🚀 Agente pronto para produção!`;

let codeIndex = 0;
const codeElement = document.querySelector('.card-code code');

if (codeElement) {
    codeElement.textContent = '';

    const typeCode = () => {
        if (codeIndex < codeText.length) {
            codeElement.textContent += codeText.charAt(codeIndex);
            codeIndex++;
            setTimeout(typeCode, 30);
        } else {
            // Apply syntax highlighting after typing is complete
            codeElement.innerHTML = highlightCode(codeElement.textContent);
        }
    };

    // Start typing animation when code block is visible
    const codeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && codeIndex === 0) {
                setTimeout(typeCode, 500);
            }
        });
    }, { threshold: 0.3 });

    const visualCard = document.querySelector('.visual-card');
    if (visualCard) {
        codeObserver.observe(visualCard);
    }
}

// Simple syntax highlighting function
function highlightCode(code) {
    return code
        .replace(/\b(from|import|def|class|return|if|else|for|while|in|as)\b/g, '<span class="code-keyword">$1</span>')
        .replace(/\b(agno|Agent)\b/g, '<span class="code-module">$1</span>')
        .replace(/"([^"]*)"/g, '"<span class="code-string">$1</span>"')
        .replace(/#(.*)$/gm, '<span class="code-comment">#$1</span>');
}

// ============================================================================
// PARTICLE EFFECT (OPTIONAL ENHANCEMENT)
// ============================================================================

class ParticleBackground {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;

        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle, i) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0, 217, 255, 0.5)';
            this.ctx.fill();

            // Draw connections
            this.particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(0, 217, 255, ${(1 - distance / 100) * 0.2})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle background if canvas exists
const particleCanvas = document.getElementById('particle-canvas');
if (particleCanvas) {
    new ParticleBackground(particleCanvas);
}

// ============================================================================
// COPY CODE BUTTON (OPTIONAL)
// ============================================================================

const codeBlock = document.querySelector('.card-code pre');
if (codeBlock) {
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    copyButton.className = 'copy-code-btn';
    copyButton.style.cssText = `
        position: absolute;
        top: 60px;
        right: 20px;
        padding: 8px 16px;
        background: rgba(0, 217, 255, 0.2);
        color: #00D9FF;
        border: 1px solid rgba(0, 217, 255, 0.3);
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 600;
        transition: all 0.3s;
    `;

    copyButton.addEventListener('click', () => {
        const code = codeBlock.textContent;
        navigator.clipboard.writeText(code).then(() => {
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = 'Copy';
            }, 2000);
        });
    });

    const visualCard = document.querySelector('.visual-card');
    if (visualCard) {
        visualCard.style.position = 'relative';
        visualCard.appendChild(copyButton);
    }
}

// ============================================================================
// LAZY LOADING IMAGES (IF ANY)
// ============================================================================

const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// ============================================================================
// CONSOLE MESSAGE
// ============================================================================

console.log(`
%c🤖 Engenharia de Agentes de IA 2.0

%cBem-vindo ao curso mais completo de Engenharia de Agentes!

Interessado em contribuir? Acesse:
👉 https://github.com/inematds/FEA-IA

`,
'font-size: 24px; font-weight: bold; color: #00D9FF;',
'font-size: 14px; color: #9CA3AF;'
);
