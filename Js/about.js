// Video visibility control with precise section detection
const aboutSection = document.getElementById('about-us');
const videoBackground = document.getElementById('videoBackground');
const starsContainerElement = document.querySelector('.stars-container');
const homeSection = document.getElementById('home');
const teamSection = document.getElementById('team');
let isScrolling = false;

function checkSectionInView() {
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    const aboutTop = aboutSection.offsetTop;
    const aboutBottom = aboutTop + aboutSection.offsetHeight;
    const homeTop = homeSection.offsetTop;
    const homeBottom = homeTop + homeSection.offsetHeight;
    const teamTop = teamSection.offsetTop;
    const teamBottom = teamTop + teamSection.offsetHeight;

    // Check if we're in the About Us section
    if (scrollPosition >= aboutTop && scrollPosition <= aboutBottom) {
        // Show video and hide stars
        videoBackground.classList.add('visible');
        aboutSection.classList.add('visible');
        starsContainerElement.style.opacity = '0';
    }
    // Check if we're in Home or Team sections
    else if ((scrollPosition >= homeTop && scrollPosition <= homeBottom) ||
        (scrollPosition >= teamTop && scrollPosition <= teamBottom)) {
        // Hide video and show stars
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
