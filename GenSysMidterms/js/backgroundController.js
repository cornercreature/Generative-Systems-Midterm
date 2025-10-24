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

let currentMode = 'rgb';
let currentRGB = { r: 255, g: 249, b: 154 };

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
 * Updates the background color and displays hex code
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 */
function updateBackground(r, g, b) {
    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    colorCode.textContent = rgbToHex(r, g, b);
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
 * Gets current background RGB color
 * @returns {Object} RGB object with r, g, b properties
 */
function getCurrentBackgroundRGB() {
    return currentRGB;
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

    // Initialize with current RGB
    updateFromRGB();
}
