// ============================================
// REPORT GENERATOR
// Handles generating and navigating to the color report
// ============================================

const generateReportBtn = document.getElementById('generateReportBtn');

/**
 * Generates a color report and navigates to report page
 */
function generateReport() {
    // Gather all color data
    const colorData = {
        background: getCurrentBackgroundRGB(),
        circle1: getCurrentCircleColors().circle1,
        circle2: getCurrentCircleColors().circle2,
        circle3: getCurrentCircleColors().circle3
    };

    // Store in localStorage for report page to access
    localStorage.setItem('colorPalette', JSON.stringify(colorData));

    // Navigate to report page
    window.location.href = 'report.html';
}

/**
 * Initializes report generator with event listeners
 */
function initReportGenerator() {
    generateReportBtn.addEventListener('click', generateReport);
}
