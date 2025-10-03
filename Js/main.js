// Loading Screen
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 1000);
    }
});

// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    }
});

// Starfield Generation
const starsContainer = document.getElementById('starsContainer');
const starCount = 300;
const starTypes = ['small', 'medium', 'large'];
const starColors = ['', 'blue', 'yellow', 'red'];

function generateStars() {
    if (!starsContainer) return;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        const size = starTypes[Math.floor(Math.random() * starTypes.length)];
        const color = starColors[Math.floor(Math.random() * starColors.length)];
        star.className = `star ${size}`;
        if (color) star.classList.add(color);
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.setProperty('--duration', (Math.random() * 5 + 3) + 's');
        star.style.animationDelay = Math.random() * 5 + 's';
        fragment.appendChild(star);
    }
    starsContainer.appendChild(fragment);
}

// Meteor Generation
function createMeteor() {
    if (!starsContainer) return;
    const meteor = document.createElement('div');
    meteor.className = 'meteor';
    meteor.style.left = (50 + Math.random() * 50) + '%';
    meteor.style.top = Math.random() * 30 + '%';
    meteor.style.width = (Math.random() * 150 + 50) + 'px';
    meteor.style.setProperty('--duration', (Math.random() * 1.5 + 0.5) + 's');
    starsContainer.appendChild(meteor);
    setTimeout(() => meteor.remove(), 2000);
}

function scheduleMeteor() {
    createMeteor();
    setTimeout(scheduleMeteor, Math.random() * 5000 + 2000);
}

// Control starfield visibility based on scroll position
function updateStarfieldOpacity() {
    const aboutSection = document.getElementById('about-us');
    const planetsSection = document.getElementById('planets-section');

    if (!aboutSection || !planetsSection || !starsContainer) return;

    const scrollY = window.scrollY;
    const aboutBottom = aboutSection.offsetTop + aboutSection.offsetHeight;
    const planetsTop = planetsSection.offsetTop;
    const planetsBottom = planetsTop + planetsSection.offsetHeight;

    if (scrollY > aboutBottom - 200 && scrollY < planetsBottom) {
        starsContainer.style.opacity = '1';
    } else if (scrollY < aboutSection.offsetTop + 100) {
        starsContainer.style.opacity = '1';
    } else {
        starsContainer.style.opacity = '0.3';
    }
}

// Initialize Stars
generateStars();
scheduleMeteor();
window.addEventListener('scroll', updateStarfieldOpacity);
window.addEventListener('load', updateStarfieldOpacity);

// Parallax Effect for Hero Video
window.addEventListener('scroll', () => {
    const video = document.querySelector('#home .video-fullscreen');
    if (video) {
        const scrolled = window.scrollY;
        video.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Scroll Indicator
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const aboutSection = document.getElementById('about-us');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.team-member, .stat-card, .planet-item').forEach(el => {
    observer.observe(el);
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});