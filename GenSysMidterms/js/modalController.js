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
 * Gathers current color data from all controllers
 * @returns {Object} Color data for background and circles
 */
function generateReportData() {
    return {
        background: getCurrentBackgroundRGB(),
        circle1: getCurrentCircleColors().circle1,
        circle2: getCurrentCircleColors().circle2,
        circle3: getCurrentCircleColors().circle3
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

    // Set background
    const bgHex = rgbToHex(colorData.background.r, colorData.background.g, colorData.background.b);
    ctx.fillStyle = bgHex;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw circles (scaled down proportionally)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Circle 1 (outermost) - scaled to ~60% of canvas
    const circle1Hex = rgbToHex(colorData.circle1.r, colorData.circle1.g, colorData.circle1.b);
    ctx.fillStyle = circle1Hex;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 120, 0, Math.PI * 2);
    ctx.fill();

    // Circle 2 (middle) - scaled proportionally
    const circle2Hex = rgbToHex(colorData.circle2.r, colorData.circle2.g, colorData.circle2.b);
    ctx.fillStyle = circle2Hex;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
    ctx.fill();

    // Circle 3 (innermost) - scaled proportionally
    const circle3Hex = rgbToHex(colorData.circle3.r, colorData.circle3.g, colorData.circle3.b);
    ctx.fillStyle = circle3Hex;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
    ctx.fill();
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
        downloadReportBtn.addEventListener('click', () => {
            alert('Download functionality coming soon!');
        });
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
