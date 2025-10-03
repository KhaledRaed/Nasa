document.addEventListener('DOMContentLoaded', () => {
    // Check if the canvas element exists before proceeding
    const canvas = document.getElementById('exoplanet-chart');
    if (!canvas) {
        console.error("Exoplanet chart canvas not found.");
        return;
    }

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // --- NASA-INSPIRED EXOPLANET DATA ---
    // Data is normalized and simplified for visualization purposes, reflecting
    // key parameters found in the NASA Exoplanet Archive (e.g., pl_rade, pl_bmassj, pl_eqt, pl_orbper, st_dist).
    // All values are normalized to a 0-1 range for the radar chart axes.
    const exoplanetData = [
        {
            name: "TRAPPIST-1 e", // Small, near-Earth size, potentially habitable zone
            color: "rgba(14, 165, 233, 0.7)", // Accent Blue
            data: {
                Mass: 0.23, // Earth Masses (normalized)
                Radius: 0.35, // Earth Radii (normalized)
                Temperature: 0.55, // Equilibrium T (low, but high relative to other habitable worlds)
                Period: 0.1, // Short orbital period (days)
                Distance: 0.05, // Very close (pc)
            },
            description: "An Earth-sized planet within the habitable zone of an ultra-cool dwarf star, TRAPPIST-1. It's a prime target for atmospheric study."
        },
        {
            name: "Kepler-186 f", // First Earth-sized planet confirmed in a habitable zone
            color: "rgba(168, 85, 247, 0.7)", // Accent Purple
            data: {
                Mass: 0.5, // Earth Masses (normalized)
                Radius: 0.6, // Earth Radii (normalized)
                Temperature: 0.45, // Equilibrium T (lower)
                Period: 0.3, // Longer orbital period (days)
                Distance: 0.5, // Moderate distance (pc)
            },
            description: "The first validated Earth-sized planet orbiting a star in the habitable zone. It is 1.1 times the size of Earth, making it a super-Earth."
        },
        {
            name: "WASP-12 b", // Ultra-Hot Jupiter, extremely short period
            color: "rgba(220, 38, 38, 0.7)", // Accent Red (Hot)
            data: {
                Mass: 0.9, // Jupiter Masses (normalized)
                Radius: 0.85, // Very large (Jupiter Radii)
                Temperature: 1.0, // Extremely high temperature
                Period: 0.01, // Extremely short orbital period (days)
                Distance: 0.7, // Farther distance (pc)
            },
            description: "A super-hot Jupiter so close to its star that it's being tidally stretched into an egg shape, making it one of the largest and hottest known exoplanets."
        }
    ];

    const labels = ["Mass ($M_J$)", "Radius ($R_{\\oplus}$)", "Temp ($K$)", "Period (Days)", "Distance ($pc$)"];
    const numPoints = labels.length;
    let rotation = 0; // For chart animation

    /**
     * Helper to convert polar coordinates to Cartesian coordinates.
     * @param {number} centerX - The X coordinate of the center.
     * @param {number} centerY - The Y coordinate of the center.
     * @param {number} angle - The angle in radians.
     * @param {number} radius - The distance from the center.
     * @returns {{x: number, y: number}} - Cartesian coordinates.
     */
    function getPoint(centerX, centerY, angle, radius) {
        return {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
        };
    }

    /**
     * Draws a line with a glow effect.
     * @param {number} x1, y1, x2, y2 - Coordinates of the line.
     * @param {string} color - Line color.
     * @param {number} width - Line width.
     */
    function drawGlowLine(x1, y1, x2, y2, color, width) {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        // Reset shadow for subsequent drawings
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
    }

    /**
     * Draws the main radar grid.
     * @param {number} size - Max radius of the radar.
     * @param {number} centerX - Center X.
     * @param {number} centerY - Center Y.
     */
    function drawGrid(size, centerX, centerY) {
        // Draw 5 concentric rings
        for (let i = 1; i <= 5; i++) {
            const currentRadius = size * (i / 5);
            ctx.beginPath();
            ctx.arc(centerX, centerY, currentRadius, 0, 2 * Math.PI);
            ctx.strokeStyle = 'rgba(14, 165, 233, 0.15)'; // Faint blue grid
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Draw spokes (axes)
        for (let i = 0; i < numPoints; i++) {
            const angle = i * 2 * Math.PI / numPoints + rotation;
            const endPoint = getPoint(centerX, centerY, angle, size);
            drawGlowLine(centerX, centerY, endPoint.x, endPoint.y, 'rgba(168, 85, 247, 0.2)', 1.5);

            // Draw labels
            ctx.fillStyle = 'var(--color-light-text)';
            ctx.font = '14px "Space Mono", monospace';
            ctx.textAlign = (Math.abs(Math.cos(angle)) < 0.1) ? 'center' : (Math.cos(angle) > 0 ? 'left' : 'right');
            ctx.textBaseline = (Math.abs(Math.sin(angle)) < 0.1) ? 'middle' : (Math.sin(angle) > 0 ? 'top' : 'bottom');

            // Offset label position slightly outside the grid
            const labelPoint = getPoint(centerX, centerY, angle, size + 20);
            
            // Simplified label text
            const displayText = labels[i]
                                .replace(/\s*\(.*?\)\s*/g, '') // Remove (Units)
                                .replace(/\$.*?\$/g, '') // Remove LaTeX math units
                                .trim();

            ctx.fillText(displayText, labelPoint.x, labelPoint.y);
        }
    }

    /**
     * Draws the exoplanet data polygon.
     * @param {object} planet - The planet data object.
     * @param {number} size - Max radius of the radar.
     * @param {number} centerX - Center X.
     * @param {number} centerY - Center Y.
     * @param {number} offset - A time-based offset for the animation wobble.
     */
    function drawPlanetData(planet, size, centerX, centerY, offset) {
        ctx.beginPath();
        const dataValues = Object.values(planet.data);
        
        dataValues.forEach((value, i) => {
            const angle = i * 2 * Math.PI / numPoints + rotation;
            // Introduce a subtle "wobble" or "pulse" animation based on offset
            const pulse = 1 + 0.03 * Math.sin(i * 0.5 + offset);
            const radius = size * value * pulse;
            const point = getPoint(centerX, centerY, angle, radius);

            if (i === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }

            // Draw small pulsating dot at the data point
            ctx.fillStyle = planet.color.replace('0.7', '1.0');
            ctx.beginPath();
            ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });

        // Close the path (connects the last point to the first)
        ctx.closePath(); 

        // Fill the polygon with a slight glow/holographic effect
        ctx.fillStyle = planet.color.replace('0.7', '0.15'); // Very light fill
        ctx.fill();

        // Draw the outline with glow
        ctx.strokeStyle = planet.color.replace('0.7', '0.9');
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 10;
        ctx.shadowColor = planet.color.replace('0.7', '1.0');
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // REMOVED: The complex, incorrect line that manually tried to draw the final segment. 
        // ctx.closePath() handles it correctly before ctx.stroke().
    }

    /**
     * Animation loop for the radar chart.
     * @param {number} time - High resolution time stamp.
     */
    function animateChart(time) {
        // Handle resizing dynamically
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxRadius = Math.min(centerX, centerY) - 40; // Max size for the radar

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update rotation for subtle grid spin
        rotation += 0.0005; // Very slow rotation

        // Draw the static grid first
        drawGrid(maxRadius, centerX, centerY);

        // Draw planet data sets (with animation offset)
        exoplanetData.forEach((planet, index) => {
            // Introduce a subtle, unique time-based offset for each planet
            const offset = time * 0.002 + index * 1.5;
            drawPlanetData(planet, maxRadius, centerX, centerY, offset);
        });

        // Draw a central glowing point
        ctx.beginPath();
        ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'var(--color-light-text)';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw Legend (bottom right)
        ctx.font = '12px "Space Mono", monospace';
        
        // **FIXED LEGEND POSITIONING**
        const legendWidth = 220;
        const legendHeight = 75; // Increased height slightly
        const margin = 30; // Margin from the edge of the canvas
        const padding = 15; // Padding inside the box

        const legendX = canvas.width - legendWidth - margin;
        let legendY = canvas.height - legendHeight - margin + 5; // Start box Y slightly higher
        let textY = legendY + padding; // Initial text Y

        // Draw Legend box background for contrast
        ctx.fillStyle = 'rgba(10, 17, 40, 0.9)'; // Darker, more opaque
        ctx.fillRect(legendX, legendY, legendWidth, legendHeight);
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.6)'; // Stronger border
        ctx.strokeRect(legendX, legendY, legendWidth, legendHeight);

        exoplanetData.forEach((planet) => {
            const rowX = legendX + padding;
            const rowY = textY + 5;
            
            // Draw color key
            ctx.fillStyle = planet.color.replace('0.7', '1.0');
            ctx.fillRect(rowX, rowY - 5, 15, 5); 
            
            // Draw text
            ctx.fillStyle = 'var(--color-light-text)';
            ctx.fillText(planet.name, rowX + 25, rowY);
            
            textY += 20;
        });


        animationFrameId = requestAnimationFrame(animateChart);
    }

    // Start the animation loop
    animateChart(0); // Pass initial time 0
});