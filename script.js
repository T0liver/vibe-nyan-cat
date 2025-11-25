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
    const colors = ['#fff', '#ffff99', '#ff99ff', '#99ffff', '#ffcccc'];
    const color = colors[Math.floor(Math.random() * colors.length)];
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

// Start the sparkle effect when page loads
window.addEventListener('DOMContentLoaded', () => {
    startSparkles();
});
