// ============================================
// MODAL CONTROLLER
// ============================================
// Handles report modal display and data population

/**
 * Opens the report modal and populates it with current color data
 */
function openReportModal() {
    // Gather color data from controllers
    const colorData = generateReportData();

    // Show the modal
    const modal = document.getElementById('reportModal');
    modal.classList.add('active');

    // Populate modal with data
    populateReportModal(colorData);

    // Draw canvas preview
    drawCirclePreview(colorData);

    // Initialize waveform visualizer
    initializeWaveformVisualizer(colorData);

    // Generate and display poem
    displayPoem(colorData);

    // Play initial chime after a short delay (let modal settle)
    playInitialChime(colorData);
}

/**
 * Closes the report modal
 */
function closeReportModal() {
    const modal = document.getElementById('reportModal');
    modal.classList.remove('active');
}

/**
 * Downloads the modal content as a PNG image
 */
function downloadModalAsPNG() {
    const modalContent = document.querySelector('.modal-content');

    // Temporarily remove max-height and overflow to capture full content
    const originalMaxHeight = modalContent.style.maxHeight;
    const originalOverflow = modalContent.style.overflow;
    modalContent.style.maxHeight = 'none';
    modalContent.style.overflow = 'visible';

    // Use html2canvas to capture the modal content
    html2canvas(modalContent, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
        windowHeight: modalContent.scrollHeight,
        height: modalContent.scrollHeight
    }).then(canvas => {
        // Restore original styles
        modalContent.style.maxHeight = originalMaxHeight;
        modalContent.style.overflow = originalOverflow;

        // Convert canvas to blob
        canvas.toBlob(blob => {
            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');

            // Generate filename with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            link.download = `color-report-${timestamp}.png`;

            link.href = url;
            link.click();

            // Clean up
            URL.revokeObjectURL(url);
        });
    }).catch(error => {
        // Restore original styles on error
        modalContent.style.maxHeight = originalMaxHeight;
        modalContent.style.overflow = originalOverflow;

        console.error('Error generating PNG:', error);
        alert('Error downloading report. Please try again.');
    });
}

/**
 * Gathers current color data from all controllers
 * @returns {Object} Color data for background and circles
 */
function generateReportData() {
    return {
        background: getCurrentBackgroundRGB(),
        circle1: getCurrentCircleColors().circle1,
        circle2: getCurrentCircleColors().circle2,
        circle3: getCurrentCircleColors().circle3,
        circleState: getCurrentCircleState(), // Add circle positions and sizes
        blurState: getCurrentBlurState(), // Add blur values
        backgroundState: getCurrentBackgroundState() // Add background type and gradient info
    };
}

/**
 * Populates the modal with color information
 * @param {Object} colorData - Color data object
 */
function populateReportModal(colorData) {
    // Define color items to populate
    const colorItems = [
        { id: 'backgroundInfo', color: colorData.background, name: 'Background' },
        { id: 'circle1Info', color: colorData.circle1, name: 'Circle 1' },
        { id: 'circle2Info', color: colorData.circle2, name: 'Circle 2' },
        { id: 'circle3Info', color: colorData.circle3, name: 'Circle 3' }
    ];

    // Populate each color info section
    colorItems.forEach(item => {
        const element = document.getElementById(item.id);
        const valuesDiv = element.querySelector('.color-values');

        const { r, g, b } = item.color;

        // Convert to different formats
        const hex = rgbToHex(r, g, b);
        const hsv = rgbToHsv(r, g, b);
        const cmyk = rgbToCmyk(r, g, b);

        // Build HTML for color values
        valuesDiv.innerHTML = `
            <div>RGB: ${r}, ${g}, ${b}</div>
            <div>CMYK: ${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%</div>
            <div>HSV: ${hsv.h}°, ${hsv.s}%, ${hsv.v}%</div>
            <div>HEX: ${hex}</div>
        `;
    });

    // Set background color swatch
    const backgroundSwatch = document.getElementById('previewBackgroundSwatch');
    const bgColor = colorData.background;
    backgroundSwatch.style.backgroundColor = rgbToHex(bgColor.r, bgColor.g, bgColor.b);
}

/**
 * Draws a miniature preview of the circles on the canvas
 * @param {Object} colorData - Color data object
 */
function drawCirclePreview(colorData) {
    const canvas = document.getElementById('circlePreviewCanvas');
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background (gradient or flat)
    if (colorData.backgroundState.type === 'gradient') {
        // Create linear gradient from top to bottom
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        const stop1Hex = rgbToHex(colorData.backgroundState.stop1.r, colorData.backgroundState.stop1.g, colorData.backgroundState.stop1.b);
        const stop2Hex = rgbToHex(colorData.backgroundState.stop2.r, colorData.backgroundState.stop2.g, colorData.backgroundState.stop2.b);
        gradient.addColorStop(0, stop1Hex);
        gradient.addColorStop(1, stop2Hex);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        // Flat color background
        const bgHex = rgbToHex(colorData.background.r, colorData.background.g, colorData.background.b);
        ctx.fillStyle = bgHex;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Get circle state for accurate positioning and sizing
    const state = colorData.circleState;

    // Calculate scale factor to fit largest circle in canvas
    // Use 80% of canvas for the largest circle to leave padding
    const maxCanvasSize = Math.min(canvas.width, canvas.height) * 0.8;
    const scaleFactor = maxCanvasSize / state.sizes.circle1;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw Circle 1 (outermost) at center with actual size scaled down (no blur)
    const circle1Hex = rgbToHex(colorData.circle1.r, colorData.circle1.g, colorData.circle1.b);
    ctx.fillStyle = circle1Hex;
    ctx.filter = 'none'; // Circle 1 has no blur
    ctx.beginPath();
    const circle1Radius = (state.sizes.circle1 / 2) * scaleFactor;
    const circle1X = centerX + (state.positions.circle1.x * scaleFactor);
    const circle1Y = centerY + (state.positions.circle1.y * scaleFactor);
    ctx.arc(circle1X, circle1Y, circle1Radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw Circle 2 with actual position, size, and blur
    const circle2Hex = rgbToHex(colorData.circle2.r, colorData.circle2.g, colorData.circle2.b);
    ctx.fillStyle = circle2Hex;
    // Apply blur scaled proportionally
    const circle2BlurScaled = colorData.blurState.circle2Blur * scaleFactor;
    ctx.filter = `blur(${circle2BlurScaled}px)`;
    ctx.beginPath();
    const circle2Radius = (state.sizes.circle2 / 2) * scaleFactor;
    const circle2X = centerX + (state.positions.circle2.x * scaleFactor);
    const circle2Y = centerY + (state.positions.circle2.y * scaleFactor);
    ctx.arc(circle2X, circle2Y, circle2Radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw Circle 3 with actual position, size, and blur
    const circle3Hex = rgbToHex(colorData.circle3.r, colorData.circle3.g, colorData.circle3.b);
    ctx.fillStyle = circle3Hex;
    // Apply blur scaled proportionally
    const circle3BlurScaled = colorData.blurState.circle3Blur * scaleFactor;
    ctx.filter = `blur(${circle3BlurScaled}px)`;
    ctx.beginPath();
    const circle3Radius = (state.sizes.circle3 / 2) * scaleFactor;
    const circle3X = centerX + (state.positions.circle3.x * scaleFactor);
    const circle3Y = centerY + (state.positions.circle3.y * scaleFactor);
    ctx.arc(circle3X, circle3Y, circle3Radius, 0, Math.PI * 2);
    ctx.fill();

    // Reset filter
    ctx.filter = 'none';
}

/**
 * Initializes modal controller with event listeners
 */
function initModalController() {
    // Get button elements
    const generateReportBtn = document.getElementById('generateReportBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const returnToGeneratorBtn = document.getElementById('returnToGeneratorBtn');
    const downloadReportBtn = document.getElementById('downloadReportBtn');
    const modalOverlay = document.querySelector('.modal-overlay');

    // Event listeners
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', openReportModal);
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeReportModal);
    }

    if (returnToGeneratorBtn) {
        returnToGeneratorBtn.addEventListener('click', closeReportModal);
    }

    if (downloadReportBtn) {
        downloadReportBtn.addEventListener('click', downloadModalAsPNG);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeReportModal);
    }

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeReportModal();
        }
    });
}
