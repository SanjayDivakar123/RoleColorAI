// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add smooth scrolling to all navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Flip card functionality for fun facts
function flipCard(card) {
    card.classList.toggle('flipped');
}

// Form submission handler
document.getElementById('catForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name') || this.querySelector('input[type="text"]').value;
    const email = formData.get('email') || this.querySelector('input[type="email"]').value;
    const message = formData.get('message') || this.querySelector('textarea').value;
    
    // Simple validation
    if (!name || !email || !message) {
        alert('Please fill in all fields! 🐱');
        return;
    }
    
    // Simulate form submission
    const button = this.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Sending... 🐾';
    button.disabled = true;
    
    setTimeout(() => {
        alert(`Thanks ${name}! Your meow-ssage has been sent! 😸 We'll get back to you soon!`);
        this.reset();
        button.textContent = originalText;
        button.disabled = false;
    }, 2000);
});

// Add scroll animations
const observerOptions = {
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

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.gallery-item, .breed-card, .fact-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add some fun cat sounds (optional - commented out to avoid auto-play issues)
/*
const catSounds = [
    'Meow! 🐱',
    'Purr... 😸',
    'Mrow! 😺',
    'Chirp! 🙀',
    'Hiss! 😾'
];

function playRandomCatSound() {
    const randomSound = catSounds[Math.floor(Math.random() * catSounds.length)];
    console.log(randomSound);
}

// Add click sound to floating cats
document.querySelectorAll('.floating-cat').forEach(cat => {
    cat.addEventListener('click', playRandomCatSound);
    cat.style.cursor = 'pointer';
    cat.style.pointerEvents = 'auto';
});
*/

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero');
    const speed = scrolled * 0.5;
    
    if (parallax) {
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Add typing effect to hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        // Uncomment the line below to enable typing effect
        // typeWriter(heroTitle, originalText, 80);
    }
});

// Add random cat facts generator
const catFacts = [
    "Cats have 32 muscles in each ear! 🐾",
    "A group of cats is called a 'clowder' 😸",
    "Cats can't taste sweetness 🍯",
    "A cat's purr vibrates at 20-50 Hz, which can help heal bones! 💫",
    "Cats sleep 12-16 hours a day 😴",
    "A cat's nose print is unique, like a human fingerprint 👃",
    "Cats have a third eyelid called a 'nictitating membrane' 👁️",
    "The oldest known pet cat existed 9,500 years ago 🏺",
    "Cats can run up to 30 mph 🏃‍♂️",
    "A cat's whiskers are roughly as wide as its body 📏"
];

function getRandomCatFact() {
    return catFacts[Math.floor(Math.random() * catFacts.length)];
}

// Add a fun easter egg - click the logo for a random cat fact
document.querySelector('.nav-brand h1').addEventListener('click', () => {
    alert(getRandomCatFact());
});

// Add hover effects to gallery images
document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    img.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Add click counter for fun facts
let factClickCount = 0;
document.querySelectorAll('.fact-card').forEach(card => {
    card.addEventListener('click', () => {
        factClickCount++;
        if (factClickCount === 3) {
            setTimeout(() => {
                alert("Wow! You're really curious about cats! 🐱✨");
            }, 500);
        }
    });
});

console.log("🐱 Welcome to Purrfect Cats! Meow! 🐾");
console.log("Try clicking on the logo for a surprise! 😸");
