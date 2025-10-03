document.addEventListener('DOMContentLoaded', () => {
    const planetsData = {
        'Kepler-186f': {
            title: 'Kepler-186f: Earth\'s Cousin',
            article: 'Kepler-186f is the first Earth-size planet orbiting a star in the habitable zone. Discovered by NASA\'s Kepler Space Telescope, this world orbits an M dwarf star and receives about a third of the energy from its star that Earth receives from the Sun. It gives us hope that life-supporting worlds are common in the galaxy.',
            image1: './media/kipler.png',
            readMore: 'https://www.nasa.gov/general/kepler-186f/'
        },
        'TRAPPIST-1e': {
            title: 'TRAPPIST-1e: A World of Many Siblings',
            article: 'Part of a system with seven Earth-sized planets, TRAPPIST-1e is considered one of the most promising for follow-up observations. It is situated in the system\'s habitable zone, meaning liquid water could exist on its surface. The planets are so close to each other that an observer might see the geological features or clouds of neighboring worlds.',
            image1: './media/trappist.jpeg',
            readMore: 'https://www.nasa.gov/general/trappist-1e/'
        },
        'HD 209458 b': {
            title: 'HD 209458 b: The Evaporating Giant',
            article: 'A classic "hot Jupiter," this planet was the first exoplanet detected through its transit of its star. More famously, it was the first to have an atmosphere spectroscopically observed. Due to its proximity to its star, its atmosphere is being dramatically stripped away, creating a giant hydrogen tail similar to a comet.',
            image1: './media/HD.jpg',
            readMore: 'https://exoplanets.nasa.gov/exoplanet-catalog/1359/hd-209458-b/'
        },
        'WASP-12b': {
            title: 'WASP-12b: The Planet Being Eaten',
            article: 'WASP-12b is one of the hottest known exoplanets, orbiting its star in just over a day. Its orbit is so tight that the star\'s tidal forces are distorting the planet into an egg shape and ripping its atmospheric material away. This planet is destined to be completely consumed by its star within a short span of geological time.',
            image1: './media/wasp-12b_th.jpg',
            readMore: 'https://www.nasa.gov/general/wasp-12b/'
        },
        '51 Pegasi b': {
            title: '51 Pegasi b: The First Found',
            article: 'Discovered in 1995, 51 Pegasi b was the very first exoplanet found orbiting a sun-like star. Its discovery began the modern era of exoplanet research and revealed a new class of planets: "Hot Jupiters"—gas giants orbiting very close to their stars. It opened the floodgates for thousands of subsequent discoveries.',
            image1: './mediagasgiant-7.jpg',
            readMore: 'https://exoplanets.nasa.gov/exoplanet-catalog/40/51-pegasi-b/'
        }
    };

    // DOM Elements
    const planetItems = document.querySelectorAll('.planet-item');
    const planetTitle = document.getElementById('planet-title');
    const planetDescription = document.getElementById('planet-description');
    const imagePrimary = document.getElementById('image-primary');
    const readMoreLink = document.getElementById('read-more-link');
    const detailsCard = document.getElementById('planet-details-card');

    // Update Details Function with smooth transitions
    function updatePlanetDetails(planetName) {
        const data = planetsData[planetName];
        if (!data) return;

        // Start fade out
        imagePrimary.classList.remove('loaded');
        detailsCard.style.opacity = '0.5';
        detailsCard.style.transform = 'scale(0.98)';

        setTimeout(() => {
            // Update content
            planetTitle.textContent = data.title;
            planetDescription.textContent = data.article;
            readMoreLink.href = data.readMore;
            readMoreLink.style.display = 'inline-block';

            // Update Image
            imagePrimary.src = data.image1;

            // Fade in logic
            imagePrimary.onload = () => {
                imagePrimary.classList.add('loaded');
            };

            if (imagePrimary.complete) {
                imagePrimary.classList.add('loaded');
            }

            // Fade in the card
            detailsCard.style.opacity = '1';
            detailsCard.style.transform = 'scale(1)';

        }, 300);
    }

    // Add click events with enhanced interaction
    planetItems.forEach(item => {
        item.addEventListener('click', function () {
            // Update Active Class
            planetItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            const planetName = this.getAttribute('data-planet');
            updatePlanetDetails(planetName);

            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(168, 85, 247, 0.5)';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.animation = 'ripple 0.6s ease-out';
            ripple.style.pointerEvents = 'none';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });

        // Add hover sound effect simulation
        item.addEventListener('mouseenter', function () {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // Initial Load
    const initialActiveElement = document.querySelector('.planet-item.active');
    if (initialActiveElement) {
        const initialPlanet = initialActiveElement.getAttribute('data-planet');
        updatePlanetDetails(initialPlanet);
    }

    // Keyboard navigation
    let currentIndex = 0;
    const planetArray = Array.from(planetItems);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            currentIndex = (currentIndex + 1) % planetArray.length;
            planetArray[currentIndex].click();
            planetArray[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            currentIndex = (currentIndex - 1 + planetArray.length) % planetArray.length;
            planetArray[currentIndex].click();
            planetArray[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
});

// Add ripple animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);