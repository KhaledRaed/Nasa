const starsContainer = document.getElementById('starsContainer');
const starCount = 200;
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

// Initialize
generateStars();
scheduleMeteor();