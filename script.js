// Rainbow segment generation
const rainbowContainer = document.querySelector('.rainbow-container');
const colors = ['#ff0000', '#ff9900', '#ffff00', '#33ff00', '#0099ff', '#6633ff', '#9933ff'];
const SEGMENT_WIDTH = 60; // Width of each rainbow segment in pixels
const SEGMENT_HEIGHT = 14; // Height of each color band
const SEGMENT_DURATION = 3000; // How long segments stay on screen
const SEGMENT_INTERVAL = 50; // Time between creating new segments (reduced to close gaps)

let segmentCounter = 0;

function createRainbowSegment() {
    const segment = document.createElement('div');
    segment.className = 'rainbow-segment';
    segment.style.width = `${SEGMENT_WIDTH}px`;
    
    // Create the vertical column of colors
    colors.forEach(color => {
        const colorBlock = document.createElement('div');
        colorBlock.className = 'rainbow-block';
        colorBlock.style.background = color;
        colorBlock.style.height = `${SEGMENT_HEIGHT}px`;
        colorBlock.style.width = '100%';
        segment.appendChild(colorBlock);
    });
    
    // Position segment starting from behind the cat (right side of cat)
    // Cat is at 50%, so segments start there and flow left
    segment.style.left = 'calc(50% - 30px)'; // Adjust to start from cat's left edge
    
    // Add slight vertical wave variation
    const waveOffset = Math.sin(segmentCounter * 0.3) * 8;
    segment.style.setProperty('--wave-offset', `${waveOffset}px`);
    
    rainbowContainer.appendChild(segment);
    segmentCounter++;
    
    // Remove segment after animation completes
    setTimeout(() => {
        segment.remove();
    }, SEGMENT_DURATION);
}

// Create rainbow segments continuously
function startRainbow() {
    setInterval(() => {
        createRainbowSegment();
    }, SEGMENT_INTERVAL);
}

// Sparkle generation
const sparklesContainer = document.querySelector('.sparkles-container');
const SPARKLE_DURATION = 1500; // Should match CSS animation duration

function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    
    // Random position on screen
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    
    // Random color variation for sparkles
    const sparkleColors = ['#fff', '#ffff99', '#ff99ff', '#99ffff', '#ffcccc'];
    const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
    sparkle.style.background = color;
    sparkle.style.boxShadow = `0 0 3px ${color}, 0 0 6px ${color}`;
    
    sparklesContainer.appendChild(sparkle);
    
    // Remove sparkle after animation completes
    setTimeout(() => {
        sparkle.remove();
    }, SPARKLE_DURATION);
}

// Create sparkles at random intervals
function startSparkles() {
    setInterval(() => {
        createSparkle();
    }, 300);
}

// Start the effects when page loads
window.addEventListener('DOMContentLoaded', () => {
    startRainbow();
    startSparkles();
});
