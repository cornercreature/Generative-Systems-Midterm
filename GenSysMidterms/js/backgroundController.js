// ============================================
// BACKGROUND COLOR CONTROLLER
// ============================================

// RGB sliders
const redSlider = document.getElementById('redSlider');
const greenSlider = document.getElementById('greenSlider');
const blueSlider = document.getElementById('blueSlider');
const redValue = document.getElementById('redValue');
const greenValue = document.getElementById('greenValue');
const blueValue = document.getElementById('blueValue');

// HSV sliders
const hueSlider = document.getElementById('hueSlider');
const satSlider = document.getElementById('satSlider');
const valSlider = document.getElementById('valSlider');
const hueValue = document.getElementById('hueValue');
const satValue = document.getElementById('satValue');
const valValue = document.getElementById('valValue');

// CMYK sliders
const cyanSlider = document.getElementById('cyanSlider');
const magentaSlider = document.getElementById('magentaSlider');
const yellowSlider = document.getElementById('yellowSlider');
const blackSlider = document.getElementById('blackSlider');
const cyanValue = document.getElementById('cyanValue');
const magentaValue = document.getElementById('magentaValue');
const yellowValue = document.getElementById('yellowValue');
const blackValue = document.getElementById('blackValue');

const colorCode = document.getElementById('colorCode');

let currentMode = 'hsv';
let currentRGB = { r: 255, g: 247, b: 0 };

// Gradient mode variables
let backgroundType = 'flat'; // 'flat' or 'gradient'
let currentGradientStop = 1; // 1 or 2
let gradientStop1RGB = { r: 255, g: 247, b: 0 }; // Yellow (#FFF700)
let gradientStop2RGB = { r: 255, g: 255, b: 255 }; // White (#FFFFFF)

/**
 * Updates background from RGB sliders
 */
function updateFromRGB() {
    const r = parseInt(redSlider.value);
    const g = parseInt(greenSlider.value);
    const b = parseInt(blueSlider.value);

    currentRGB = { r, g, b };
    updateBackground(r, g, b);

    redValue.textContent = r;
    greenValue.textContent = g;
    blueValue.textContent = b;
}

/**
 * Syncs HSV sliders to current RGB values
 */
function syncRGBtoHSV() {
    const hsv = rgbToHsv(currentRGB.r, currentRGB.g, currentRGB.b);
    hueSlider.value = hsv.h;
    satSlider.value = hsv.s;
    valSlider.value = hsv.v;
    hueValue.textContent = hsv.h + '°';
    satValue.textContent = hsv.s + '%';
    valValue.textContent = hsv.v + '%';
}

/**
 * Updates background from HSV sliders
 */
function updateFromHSV() {
    const h = parseInt(hueSlider.value);
    const s = parseInt(satSlider.value);
    const v = parseInt(valSlider.value);

    const rgb = hsvToRgb(h, s, v);
    currentRGB = rgb;
    updateBackground(rgb.r, rgb.g, rgb.b);

    hueValue.textContent = h + '°';
    satValue.textContent = s + '%';
    valValue.textContent = v + '%';
}

/**
 * Syncs CMYK sliders to current RGB values
 */
function syncRGBtoCMYK() {
    const cmyk = rgbToCmyk(currentRGB.r, currentRGB.g, currentRGB.b);
    cyanSlider.value = cmyk.c;
    magentaSlider.value = cmyk.m;
    yellowSlider.value = cmyk.y;
    blackSlider.value = cmyk.k;
    cyanValue.textContent = cmyk.c + '%';
    magentaValue.textContent = cmyk.m + '%';
    yellowValue.textContent = cmyk.y + '%';
    blackValue.textContent = cmyk.k + '%';
}

/**
 * Updates background from CMYK sliders
 */
function updateFromCMYK() {
    const c = parseInt(cyanSlider.value);
    const m = parseInt(magentaSlider.value);
    const y = parseInt(yellowSlider.value);
    const k = parseInt(blackSlider.value);

    const rgb = cmykToRgb(c, m, y, k);
    currentRGB = rgb;
    updateBackground(rgb.r, rgb.g, rgb.b);

    cyanValue.textContent = c + '%';
    magentaValue.textContent = m + '%';
    yellowValue.textContent = y + '%';
    blackValue.textContent = k + '%';
}

/**
 * Column colors are now fixed (white background, black text, black borders)
 * This function is kept for compatibility but does nothing
 */
function updateColumnColors(rgb) {
    // No longer needed - columns are always white with black text
}

/**
 * Updates the background color and displays hex code
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 */
function updateBackground(r, g, b) {
    // Store the color for the current gradient stop
    if (backgroundType === 'gradient') {
        if (currentGradientStop === 1) {
            gradientStop1RGB = { r, g, b };
        } else {
            gradientStop2RGB = { r, g, b };
        }
        // Apply gradient
        applyGradient();
        // Update columns based on stop 1 (primary color)
        updateColumnColors(gradientStop1RGB);
    } else {
        // Flat color mode
        document.body.style.background = `rgb(${r}, ${g}, ${b})`;
        colorCode.textContent = rgbToHex(r, g, b);
        // Update column colors based on background
        updateColumnColors({ r, g, b });
    }
}

/**
 * Applies gradient background using both stops
 */
function applyGradient() {
    const color1 = `rgb(${gradientStop1RGB.r}, ${gradientStop1RGB.g}, ${gradientStop1RGB.b})`;
    const color2 = `rgb(${gradientStop2RGB.r}, ${gradientStop2RGB.g}, ${gradientStop2RGB.b})`;
    document.body.style.background = `linear-gradient(to bottom, ${color1}, ${color2})`;

    // Display the current stop's color code
    const currentStopRGB = currentGradientStop === 1 ? gradientStop1RGB : gradientStop2RGB;
    colorCode.textContent = rgbToHex(currentStopRGB.r, currentStopRGB.g, currentStopRGB.b);
}

/**
 * Switches the background color mode (RGB, HSV, or CMYK)
 * @param {string} mode - The mode to switch to ('rgb', 'hsv', or 'cmyk')
 */
function switchMode(mode) {
    currentMode = mode;

    const modeButtons = document.querySelectorAll('.controls .mode-btn');
    modeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode && !btn.dataset.target);
    });

    const colorModes = document.querySelectorAll('.controls .color-mode');
    colorModes.forEach(modeDiv => {
        modeDiv.classList.remove('active');
    });

    document.getElementById(mode + 'Mode').classList.add('active');

    // Sync sliders when switching modes
    if (mode === 'hsv') {
        syncRGBtoHSV();
    } else if (mode === 'cmyk') {
        syncRGBtoCMYK();
    }
}

/**
 * Gets current background RGB color (for flat mode) or gradient stop 1 (for gradient mode)
 * @returns {Object} RGB object with r, g, b properties
 */
function getCurrentBackgroundRGB() {
    // For report generation, return stop 1 if in gradient mode
    return backgroundType === 'gradient' ? gradientStop1RGB : currentRGB;
}

/**
 * Gets gradient colors if in gradient mode
 * @returns {Object|null} Object with stop1 and stop2, or null if not in gradient mode
 */
function getGradientColors() {
    if (backgroundType === 'gradient') {
        return {
            stop1: gradientStop1RGB,
            stop2: gradientStop2RGB
        };
    }
    return null;
}

/**
 * Switches between flat and gradient background types
 * @param {string} type - 'flat' or 'gradient'
 */
function switchBackgroundType(type) {
    backgroundType = type;

    // Update button states
    const bgTypeButtons = document.querySelectorAll('.bg-type-btn');
    bgTypeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.bgType === type);
    });

    // Show/hide gradient stop selector
    const gradientStopSelector = document.getElementById('gradientStopSelector');
    if (type === 'gradient') {
        gradientStopSelector.style.display = 'flex';
        // Load the current stop's color into sliders
        loadGradientStopToSliders();
        applyGradient();
    } else {
        gradientStopSelector.style.display = 'none';
        // Revert to flat color using stop 1
        currentRGB = { ...gradientStop1RGB };
        document.body.style.background = `rgb(${currentRGB.r}, ${currentRGB.g}, ${currentRGB.b})`;
        colorCode.textContent = rgbToHex(currentRGB.r, currentRGB.g, currentRGB.b);
        syncSlidersToRGB();
    }
}

/**
 * Switches between gradient stops
 * @param {number} stopNumber - 1 or 2
 */
function switchGradientStop(stopNumber) {
    currentGradientStop = stopNumber;

    // Update button states
    const stopButtons = document.querySelectorAll('.gradient-stop-btn');
    stopButtons.forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.stop) === stopNumber);
    });

    // Load the selected stop's color into sliders
    loadGradientStopToSliders();
}

/**
 * Loads the current gradient stop's color into the sliders
 */
function loadGradientStopToSliders() {
    const stopRGB = currentGradientStop === 1 ? gradientStop1RGB : gradientStop2RGB;
    currentRGB = { ...stopRGB };

    // Update sliders based on current mode
    if (currentMode === 'rgb') {
        redSlider.value = stopRGB.r;
        greenSlider.value = stopRGB.g;
        blueSlider.value = stopRGB.b;
        redValue.textContent = stopRGB.r;
        greenValue.textContent = stopRGB.g;
        blueValue.textContent = stopRGB.b;
    } else if (currentMode === 'hsv') {
        syncRGBtoHSV();
    } else if (currentMode === 'cmyk') {
        syncRGBtoCMYK();
    }

    colorCode.textContent = rgbToHex(stopRGB.r, stopRGB.g, stopRGB.b);
}

/**
 * Syncs sliders to current RGB (used when switching back to flat mode)
 */
function syncSlidersToRGB() {
    if (currentMode === 'rgb') {
        redSlider.value = currentRGB.r;
        greenSlider.value = currentRGB.g;
        blueSlider.value = currentRGB.b;
        redValue.textContent = currentRGB.r;
        greenValue.textContent = currentRGB.g;
        blueValue.textContent = currentRGB.b;
    } else if (currentMode === 'hsv') {
        syncRGBtoHSV();
    } else if (currentMode === 'cmyk') {
        syncRGBtoCMYK();
    }
}

/**
 * Initializes background controller with event listeners
 */
function initBackgroundController() {
    // RGB event listeners
    redSlider.addEventListener('input', updateFromRGB);
    greenSlider.addEventListener('input', updateFromRGB);
    blueSlider.addEventListener('input', updateFromRGB);

    // HSV event listeners
    hueSlider.addEventListener('input', updateFromHSV);
    satSlider.addEventListener('input', updateFromHSV);
    valSlider.addEventListener('input', updateFromHSV);

    // CMYK event listeners
    cyanSlider.addEventListener('input', updateFromCMYK);
    magentaSlider.addEventListener('input', updateFromCMYK);
    yellowSlider.addEventListener('input', updateFromCMYK);
    blackSlider.addEventListener('input', updateFromCMYK);

    // Mode switching
    const modeButtons = document.querySelectorAll('.controls .mode-btn');
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            const target = btn.dataset.target;

            if (!target) {
                switchMode(mode);
            }
        });
    });

    // Background type switching (Flat/Gradient)
    const bgTypeButtons = document.querySelectorAll('.bg-type-btn');
    bgTypeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            switchBackgroundType(btn.dataset.bgType);
        });
    });

    // Gradient stop switching (Stop 1/Stop 2)
    const gradientStopButtons = document.querySelectorAll('.gradient-stop-btn');
    gradientStopButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            switchGradientStop(parseInt(btn.dataset.stop));
        });
    });

    // Initialize with current RGB
    updateFromRGB();
}
