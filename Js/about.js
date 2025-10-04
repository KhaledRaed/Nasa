// Video visibility control with precise section detection
const aboutSection = document.getElementById('about-us');
const videoBackground = document.getElementById('videoBackground');
const starsContainerElement = document.querySelector('.stars-container');
const homeSection = document.getElementById('home');
const teamSection = document.getElementById('team');
const planetsSection = document.getElementById('planets-section');
let isScrolling = false;

function checkSectionInView() {
    if (!aboutSection || !videoBackground || !starsContainerElement) return;

    const scrollPosition = window.scrollY + window.innerHeight / 2;
    const aboutTop = aboutSection.offsetTop;
    const aboutBottom = aboutTop + aboutSection.offsetHeight;
    const homeTop = homeSection ? homeSection.offsetTop : 0;
    const homeBottom = homeSection ? homeTop + homeSection.offsetHeight : 0;
    const teamTop = teamSection ? teamSection.offsetTop : 0;
    const teamBottom = teamSection ? teamTop + teamSection.offsetHeight : 0;
    const planetsTop = planetsSection ? planetsSection.offsetTop : 0;
    const planetsBottom = planetsSection ? planetsTop + planetsSection.offsetHeight : 0;

    // Check if we're in the About Us section (Hide stars)
    if (scrollPosition >= aboutTop && scrollPosition <= aboutBottom) {
        videoBackground.classList.add('visible');
        aboutSection.classList.add('visible');
        starsContainerElement.style.opacity = '0';
    }
    // Check if we're in Home, Team, OR PLANETS sections (Show stars)
    else if (
        (scrollPosition >= homeTop && scrollPosition <= homeBottom) ||
        (scrollPosition >= teamTop && scrollPosition <= teamBottom) ||
        (scrollPosition >= planetsTop && scrollPosition <= planetsBottom)
    ) {
        videoBackground.classList.remove('visible');
        aboutSection.classList.remove('visible');
        starsContainerElement.style.opacity = '1';
    }
}

// Throttled scroll handler for better performance
function throttledScrollHandler() {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            checkSectionInView();
            isScrolling = false;
        });
        isScrolling = true;
    }
}

window.addEventListener('scroll', throttledScrollHandler);
window.addEventListener('load', checkSectionInView);
window.addEventListener('resize', checkSectionInView);

// Animated Counter for Stats with Decimal Support
function animateCounter(element, target, duration = 2000, decimals = 1) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toFixed(decimals);
            clearInterval(timer);
        } else {
            element.textContent = current.toFixed(decimals);
        }
    }, 16);
}

// Observe stats section and trigger animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber && !statNumber.classList.contains('animated')) {
                const target = parseFloat(statNumber.getAttribute('data-target'));
                animateCounter(statNumber, target, 2000, 1);
                statNumber.classList.add('animated');
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
    statsObserver.observe(card);
});