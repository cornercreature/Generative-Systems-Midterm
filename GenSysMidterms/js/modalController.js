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
    // Define color items to populate (non-background items)
    const colorItems = [
        { id: 'circle1Info', swatchId: 'circle1Swatch', color: colorData.circle1, name: 'Circle 1' },
        { id: 'circle2Info', swatchId: 'circle2Swatch', color: colorData.circle2, name: 'Circle 2' },
        { id: 'circle3Info', swatchId: 'circle3Swatch', color: colorData.circle3, name: 'Circle 3' }
    ];

    // Populate circle color info sections
    colorItems.forEach(item => {
        const element = document.getElementById(item.id);
        const valuesDiv = element.querySelector('.color-values');
        const swatchDiv = document.getElementById(item.swatchId);

        const { r, g, b } = item.color;

        // Convert to different formats
        const hex = rgbToHex(r, g, b);
        const hsv = rgbToHsv(r, g, b);
        const cmyk = rgbToCmyk(r, g, b);

        // Set the color swatch background
        swatchDiv.style.backgroundColor = hex;

        // Build HTML for color values
        valuesDiv.innerHTML = `
            <div>RGB: ${r}, ${g}, ${b}</div>
            <div>CMYK: ${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%</div>
            <div>HSV: ${hsv.h}°, ${hsv.s}%, ${hsv.v}%</div>
            <div>HEX: ${hex}</div>
        `;
    });

    // Handle background info specially (gradient vs flat)
    const backgroundElement = document.getElementById('backgroundInfo');
    const backgroundValuesDiv = backgroundElement.querySelector('.color-values');
    const backgroundSwatchDiv = document.getElementById('backgroundSwatch');

    if (colorData.backgroundState.type === 'gradient') {
        // Gradient background - show both stops
        const stop1 = colorData.backgroundState.stop1;
        const stop2 = colorData.backgroundState.stop2;

        // Convert stop1
        const hex1 = rgbToHex(stop1.r, stop1.g, stop1.b);
        const hsv1 = rgbToHsv(stop1.r, stop1.g, stop1.b);
        const cmyk1 = rgbToCmyk(stop1.r, stop1.g, stop1.b);

        // Convert stop2
        const hex2 = rgbToHex(stop2.r, stop2.g, stop2.b);
        const hsv2 = rgbToHsv(stop2.r, stop2.g, stop2.b);
        const cmyk2 = rgbToCmyk(stop2.r, stop2.g, stop2.b);

        // Hide the main swatch for gradient backgrounds
        backgroundSwatchDiv.style.display = 'none';

        // Build HTML for both gradient stops with mini swatches
        backgroundValuesDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <div style="width: 16px; height: 16px; border-radius: 50%; background-color: ${hex1}; border: 1px solid black; flex-shrink: 0;"></div>
                <div style="text-align: left;">
                    <div>RGB: ${stop1.r}, ${stop1.g}, ${stop1.b}</div>
                    <div>CMYK: ${cmyk1.c}%, ${cmyk1.m}%, ${cmyk1.y}%, ${cmyk1.k}%</div>
                    <div>HSV: ${hsv1.h}°, ${hsv1.s}%, ${hsv1.v}%</div>
                    <div>HEX: ${hex1}</div>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; margin-top: 10px;">
                <div style="width: 16px; height: 16px; border-radius: 50%; background-color: ${hex2}; border: 1px solid black; flex-shrink: 0;"></div>
                <div style="text-align: left;">
                    <div>RGB: ${stop2.r}, ${stop2.g}, ${stop2.b}</div>
                    <div>CMYK: ${cmyk2.c}%, ${cmyk2.m}%, ${cmyk2.y}%, ${cmyk2.k}%</div>
                    <div>HSV: ${hsv2.h}°, ${hsv2.s}%, ${hsv2.v}%</div>
                    <div>HEX: ${hex2}</div>
                </div>
            </div>
        `;
    } else {
        // Flat background - show single color
        const { r, g, b } = colorData.background;
        const hex = rgbToHex(r, g, b);
        const hsv = rgbToHsv(r, g, b);
        const cmyk = rgbToCmyk(r, g, b);

        // Show the main swatch for flat backgrounds
        backgroundSwatchDiv.style.display = 'block';
        backgroundSwatchDiv.style.backgroundColor = hex;

        backgroundValuesDiv.innerHTML = `
            <div>RGB: ${r}, ${g}, ${b}</div>
            <div>CMYK: ${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%</div>
            <div>HSV: ${hsv.h}°, ${hsv.s}%, ${hsv.v}%</div>
            <div>HEX: ${hex}</div>
        `;
    }

    // Set background color swatch in preview
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
