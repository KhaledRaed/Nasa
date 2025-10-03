const starsContainer = document.getElementById('starsContainer');
const starCount = 300; // Increased for better visibility
const starTypes = ['small', 'medium', 'large'];
const starColors = ['', 'blue', 'yellow', 'red'];

function generateStars() {
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

// Meteor generation
function createMeteor() {
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
    
    if (!aboutSection || !planetsSection) return;
    
    const scrollY = window.scrollY;
    const aboutBottom = aboutSection.offsetTop + aboutSection.offsetHeight;
    const planetsTop = planetsSection.offsetTop;
    const planetsBottom = planetsTop + planetsSection.offsetHeight;
    
    // Make stars more visible in planets section
    if (scrollY > aboutBottom - 200 && scrollY < planetsBottom) {
        starsContainer.style.opacity = '1';
    } else if (scrollY < aboutSection.offsetTop + 100) {
        starsContainer.style.opacity = '1';
    } else {
        starsContainer.style.opacity = '0.3';
    }
}

// Initialize
generateStars();
scheduleMeteor();

// Add scroll listener for dynamic opacity
window.addEventListener('scroll', updateStarfieldOpacity);
window.addEventListener('load', updateStarfieldOpacity);