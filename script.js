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
    
    // Position segment at the center of the screen (where the cat is)
    // Cat is at 50%, segments spawn at center and flow left to trail behind
    segment.style.left = '50%'; // Start from center (behind the cat)
    
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
const SPARKLE_INTERVAL = 300; // Time between creating new sparkles

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
    }, SPARKLE_INTERVAL);
}

// Start button functionality
// Script is at the end of body, so DOM is already available
const startButton = document.getElementById('start-button');
const nyanImg = document.getElementById('nyan-img');
const nyanAudio = document.getElementById('nyan-audio');
const stopwatch = document.getElementById('stopwatch');

let startTime = null;
let stopwatchInterval = null;

function formatStopwatch(elapsedMs) {
    const totalSeconds = Math.floor(elapsedMs / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const totalHours = Math.floor(totalMinutes / 60);
    const hours = totalHours % 24;
    const days = Math.floor(totalHours / 24);
    
    // Build the display string with only relevant parts
    const parts = [];
    
    if (days > 0) {
        parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    }
    if (hours > 0 || days > 0) {
        parts.push(`${String(hours).padStart(2, '0')} hour${hours !== 1 ? 's' : ''}`);
    }
    if (minutes > 0 || hours > 0 || days > 0) {
        parts.push(`${String(minutes).padStart(2, '0')} minute${minutes !== 1 ? 's' : ''}`);
    }
    parts.push(`${String(seconds).padStart(2, '0')} second${seconds !== 1 ? 's' : ''}`);
    
    return parts.join(' : ');
}

function updateStopwatch() {
    if (startTime) {
        const elapsed = Date.now() - startTime;
        stopwatch.textContent = formatStopwatch(elapsed);
    }
}

startButton.addEventListener('click', () => {
    // Hide the start button
    startButton.style.display = 'none';
    
    // Show and start the stopwatch
    stopwatch.style.display = 'block';
    startTime = Date.now();
    stopwatch.textContent = formatStopwatch(0);
    stopwatchInterval = setInterval(updateStopwatch, 1000);
    
    // Switch from PNG to GIF
    nyanImg.src = 'src/nyan.gif';
    
    // Start rainbow animation
    setInterval(() => {
        createRainbowSegment();
    }, SEGMENT_INTERVAL);
    
    // Start sparkles animation
    setInterval(() => {
        createSparkle();
    }, SPARKLE_INTERVAL);
    
    // Play audio
    nyanAudio.play().catch(error => {
        console.error('Failed to play audio:', error);
    });
});
