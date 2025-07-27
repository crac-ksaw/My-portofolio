// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for navigation links
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

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Form submission with Formspree
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    if (name && email && subject && message) {
        const button = this.querySelector('button');
        const originalText = button.textContent;
        button.textContent = 'Sending...';
        button.disabled = true;
        
        // Submit form to Formspree
        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                button.textContent = 'Message Sent!';
                button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                this.reset();
            } else {
                throw new Error('Failed to send message');
            }
        })
        .catch(error => {
            button.textContent = 'Error! Try Again';
            button.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            console.error('Error:', error);
        })
        .finally(() => {
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
                button.disabled = false;
            }, 3000);
        });
    }
});

// Parallax effect for hero section with fade out
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero-content');
    if (parallax) {
        const speed = scrolled * 0.5;
        const opacity = Math.max(0, 1 - (scrolled / 600)); // Start fading at 600px scroll for slower effect
        parallax.style.transform = `translateY(${speed}px)`;
        parallax.style.opacity = opacity;
    }
});

// Dynamic typing effect for hero subtitle
const subtitle = document.querySelector('.hero .subtitle');
const titles = ['Full Stack Developer', 'AI Enthusiast', 'Python Developer', 'Tech Explorer'];
let currentTitle = 0;
let currentChar = 0;
let isDeleting = false;

function typeEffect() {
    const current = titles[currentTitle];
    if (isDeleting) {
        subtitle.textContent = current.substring(0, currentChar - 1);
        currentChar--;
    } else {
        subtitle.textContent = current.substring(0, currentChar + 1);
        currentChar++;
    }
    let typeSpeed = isDeleting ? 100 : 150;
    if (!isDeleting && currentChar === current.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && currentChar === 0) {
        isDeleting = false;
        currentTitle = (currentTitle + 1) % titles.length;
        typeSpeed = 500;
    }
    setTimeout(typeEffect, typeSpeed);
}
// Start typing effect after page load
window.addEventListener('load', () => {
    setTimeout(typeEffect, 1000);
});

// Add hover rotation to skill cards
document.querySelectorAll('.skill-category').forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'rotateY(10deg) rotateX(5deg) translateY(-10px)';
        card.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateY(0deg) rotateX(0deg) translateY(0)';
        card.style.transition = 'transform 0.3s ease';
    });
});

// Project card tilt effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Add cursor trail effect
const cursor = document.createElement('div');
cursor.className = 'cursor-trail';
cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    opacity: 0;
    transition: all 0.1s ease;
    mix-blend-mode: difference;
`;
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
    cursor.style.opacity = '1';
});

document.addEventListener('mouseout', () => {
    cursor.style.opacity = '0';
});

// Add interactive particles to background
function createParticle() {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: rgba(99, 102, 241, 0.6);
        border-radius: 50%;
        pointer-events: none;
        z-index: -1;
        animation: particleFloat 15s linear infinite;
    `;
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = window.innerHeight + 'px';
    document.body.appendChild(particle);
    setTimeout(() => {
        particle.remove();
    }, 15000);
}
// Add particle animation keyframes
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);
// Create particles periodically
setInterval(createParticle, 3000);

// Add mobile menu toggle
const navLinks = document.querySelector('.nav-links');
const menuToggle = document.createElement('div');
menuToggle.className = 'menu-toggle';
menuToggle.innerHTML = '☰';
menuToggle.style.cssText = `
    display: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--light);
    @media (max-width: 768px) {
        display: block;
    }
`;
// Add menu toggle styles
const mobileStyle = document.createElement('style');
mobileStyle.textContent = `
    @media (max-width: 768px) {
        .menu-toggle {
            display: block !important;
        }
        .nav-links {
            position: fixed;
            top: 70px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 70px);
            background: rgba(15, 23, 42, 0.95);
            flex-direction: column;
            justify-content: start;
            align-items: center;
            padding-top: 2rem;
            transition: left 0.3s ease;
            backdrop-filter: blur(20px);
        }
        .nav-links.active {
            left: 0;
        }
        .nav-links li {
            margin: 1rem 0;
        }
    }
`;
document.head.appendChild(mobileStyle);
document.querySelector('.nav-container').appendChild(menuToggle);
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
});
// Close mobile menu when clicking on links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.innerHTML = '☰';
    });
});
// Add scroll progress indicator
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    z-index: 1001;
    transition: width 0.1s ease;
`;
document.body.appendChild(progressBar);
window.addEventListener('scroll', () => {
    const scrollProgress = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = scrollProgress + '%';
});
// Add loading animation
window.addEventListener('load', () => {
    const loader = document.createElement('div');
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--dark);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    `;
    const loaderContent = document.createElement('div');
    loaderContent.innerHTML = `
        <div style="
            width: 50px;
            height: 50px;
            border: 3px solid rgba(99, 102, 241, 0.3);
            border-top: 3px solid var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        "></div>
    `;
    const spinStyle = document.createElement('style');
    spinStyle.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(spinStyle);
    loader.appendChild(loaderContent);
    document.body.appendChild(loader);
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(loader);
        }, 500);
    }, 1500);
}); 