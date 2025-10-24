// ============================================
// REPORT PAGE MAIN ORCHESTRATOR
// ============================================
// Coordinates all report page functionality:
// - Color data retrieval
// - Visual display
// - Audio synthesis
// - Poetry generation

import { displayColorSwatches } from './colorDisplay.js';
import { playColorChord } from './audioSynthesis.js';
import { generatePoetry } from './poetryGenerator.js';

/**
 * Initialize the report page
 * Retrieves color data from localStorage and triggers all display functions
 */
function initializeReport() {
    // Retrieve color data from localStorage
    const colorDataStr = localStorage.getItem('colorPalette');

    if (!colorDataStr) {
        alert('No color data found. Redirecting to main page.');
        window.location.href = 'main.html';
        return;
    }

    const colorData = JSON.parse(colorDataStr);

    // Display color swatches with all format information
    displayColorSwatches(colorData);

    // Play audio chord based on colors
    const colorArray = [
        colorData.background,
        colorData.circle1,
        colorData.circle2,
        colorData.circle3
    ];
    playColorChord(colorArray);

    // Generate poetry using Claude API
    generatePoetry(colorData);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeReport);
