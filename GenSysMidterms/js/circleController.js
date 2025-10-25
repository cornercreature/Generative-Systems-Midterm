// ============================================
// CIRCLE COLOR CONTROLLER
// ============================================

// Circle color variables
let currentCircleMode = 'hsv';
let currentCircleTarget = 1; // 1, 2, or 3
let currentCircleRGB = { r: 232, g: 225, b: 209 }; // #E8E1D1
let currentCircleTwoRGB = { r: 245, g: 242, b: 230 }; // #F5F2E6
let currentCircleThreeRGB = { r: 255, g: 255, b: 255 }; // #FFFFFF

// Circle RGB sliders
const circleRedSlider = document.getElementById('circleRedSlider');
const circleGreenSlider = document.getElementById('circleGreenSlider');
const circleBlueSlider = document.getElementById('circleBlueSlider');
const circleRedValue = document.getElementById('circleRedValue');
const circleGreenValue = document.getElementById('circleGreenValue');
const circleBlueValue = document.getElementById('circleBlueValue');

// Circle HSV sliders
const circleHueSlider = document.getElementById('circleHueSlider');
const circleSatSlider = document.getElementById('circleSatSlider');
const circleValSlider = document.getElementById('circleValSlider');
const circleHueValue = document.getElementById('circleHueValue');
const circleSatValue = document.getElementById('circleSatValue');
const circleValValue = document.getElementById('circleValValue');

// Circle CMYK sliders
const circleCyanSlider = document.getElementById('circleCyanSlider');
const circleMagentaSlider = document.getElementById('circleMagentaSlider');
const circleYellowSlider = document.getElementById('circleYellowSlider');
const circleBlackSlider = document.getElementById('circleBlackSlider');
const circleCyanValue = document.getElementById('circleCyanValue');
const circleMagentaValue = document.getElementById('circleMagentaValue');
const circleYellowValue = document.getElementById('circleYellowValue');
const circleBlackValue = document.getElementById('circleBlackValue');

const circleColorCode = document.getElementById('circleColorCode');

// Circle elements
const circle = document.getElementById('circle');
const circleTwo = document.getElementById('circleTwo');
const circleThree = document.getElementById('circleThree');

/**
 * Switches the active circle target
 * @param {number} target - Circle number (1, 2, or 3)
 * Called when controller circles are clicked
 */
function switchCircleTarget(target) {
    currentCircleTarget = target;

    // Update sliders to show current target's color
    if (target === 1) {
        syncSlidersToRGB(currentCircleRGB);
    } else if (target === 2) {
        syncSlidersToRGB(currentCircleTwoRGB);
    } else if (target === 3) {
        syncSlidersToRGB(currentCircleThreeRGB);
    }
}

/**
 * Syncs all sliders to a specific RGB value
 * @param {Object} rgb - RGB object with r, g, b properties
 */
function syncSlidersToRGB(rgb) {
    circleRedSlider.value = rgb.r;
    circleGreenSlider.value = rgb.g;
    circleBlueSlider.value = rgb.b;
    circleRedValue.textContent = rgb.r;
    circleGreenValue.textContent = rgb.g;
    circleBlueValue.textContent = rgb.b;

    // Sync to current mode
    if (currentCircleMode === 'hsv') {
        syncCircleRGBtoHSV();
    } else if (currentCircleMode === 'cmyk') {
        syncCircleRGBtoCMYK();
    }
}

/**
 * Switches the circle color mode
 * @param {string} mode - The mode to switch to ('rgb', 'hsv', or 'cmyk')
 */
function switchCircleMode(mode) {
    currentCircleMode = mode;

    const circleButtons = document.querySelectorAll('.circle-controls .mode-btn');
    circleButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    const circleModes = document.querySelectorAll('.circle-controls .color-mode');
    circleModes.forEach(modeDiv => {
        modeDiv.classList.remove('active');
    });

    document.getElementById('circle' + mode.charAt(0).toUpperCase() + mode.slice(1) + 'Mode').classList.add('active');

    if (mode === 'hsv') {
        syncCircleRGBtoHSV();
    } else if (mode === 'cmyk') {
        syncCircleRGBtoCMYK();
    }
}

/**
 * Updates circle color from RGB sliders
 */
function updateCircleFromRGB() {
    const r = parseInt(circleRedSlider.value);
    const g = parseInt(circleGreenSlider.value);
    const b = parseInt(circleBlueSlider.value);

    // Update the appropriate circle's color based on current target
    if (currentCircleTarget === 1) {
        currentCircleRGB = { r, g, b };
        updateCircleColor(r, g, b);
    } else if (currentCircleTarget === 2) {
        currentCircleTwoRGB = { r, g, b };
        updateCircleTwoColor(r, g, b);
    } else if (currentCircleTarget === 3) {
        currentCircleThreeRGB = { r, g, b };
        updateCircleThreeColor(r, g, b);
    }

    circleRedValue.textContent = r;
    circleGreenValue.textContent = g;
    circleBlueValue.textContent = b;
}

/**
 * Syncs circle HSV sliders to current RGB
 */
function syncCircleRGBtoHSV() {
    let rgb;
    if (currentCircleTarget === 1) {
        rgb = currentCircleRGB;
    } else if (currentCircleTarget === 2) {
        rgb = currentCircleTwoRGB;
    } else {
        rgb = currentCircleThreeRGB;
    }

    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    circleHueSlider.value = hsv.h;
    circleSatSlider.value = hsv.s;
    circleValSlider.value = hsv.v;
    circleHueValue.textContent = hsv.h + '°';
    circleSatValue.textContent = hsv.s + '%';
    circleValValue.textContent = hsv.v + '%';
}

/**
 * Updates circle color from HSV sliders
 */
function updateCircleFromHSV() {
    const h = parseInt(circleHueSlider.value);
    const s = parseInt(circleSatSlider.value);
    const v = parseInt(circleValSlider.value);

    const rgb = hsvToRgb(h, s, v);

    // Update the appropriate circle's color based on current target
    if (currentCircleTarget === 1) {
        currentCircleRGB = rgb;
        updateCircleColor(rgb.r, rgb.g, rgb.b);
    } else if (currentCircleTarget === 2) {
        currentCircleTwoRGB = rgb;
        updateCircleTwoColor(rgb.r, rgb.g, rgb.b);
    } else if (currentCircleTarget === 3) {
        currentCircleThreeRGB = rgb;
        updateCircleThreeColor(rgb.r, rgb.g, rgb.b);
    }

    circleHueValue.textContent = h + '°';
    circleSatValue.textContent = s + '%';
    circleValValue.textContent = v + '%';
}

/**
 * Syncs circle CMYK sliders to current RGB
 */
function syncCircleRGBtoCMYK() {
    let rgb;
    if (currentCircleTarget === 1) {
        rgb = currentCircleRGB;
    } else if (currentCircleTarget === 2) {
        rgb = currentCircleTwoRGB;
    } else {
        rgb = currentCircleThreeRGB;
    }

    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
    circleCyanSlider.value = cmyk.c;
    circleMagentaSlider.value = cmyk.m;
    circleYellowSlider.value = cmyk.y;
    circleBlackSlider.value = cmyk.k;
    circleCyanValue.textContent = cmyk.c + '%';
    circleMagentaValue.textContent = cmyk.m + '%';
    circleYellowValue.textContent = cmyk.y + '%';
    circleBlackValue.textContent = cmyk.k + '%';
}

/**
 * Updates circle color from CMYK sliders
 */
function updateCircleFromCMYK() {
    const c = parseInt(circleCyanSlider.value);
    const m = parseInt(circleMagentaSlider.value);
    const y = parseInt(circleYellowSlider.value);
    const k = parseInt(circleBlackSlider.value);

    const rgb = cmykToRgb(c, m, y, k);

    // Update the appropriate circle's color based on current target
    if (currentCircleTarget === 1) {
        currentCircleRGB = rgb;
        updateCircleColor(rgb.r, rgb.g, rgb.b);
    } else if (currentCircleTarget === 2) {
        currentCircleTwoRGB = rgb;
        updateCircleTwoColor(rgb.r, rgb.g, rgb.b);
    } else if (currentCircleTarget === 3) {
        currentCircleThreeRGB = rgb;
        updateCircleThreeColor(rgb.r, rgb.g, rgb.b);
    }

    circleCyanValue.textContent = c + '%';
    circleMagentaValue.textContent = m + '%';
    circleYellowValue.textContent = y + '%';
    circleBlackValue.textContent = k + '%';
}

/**
 * Updates circle one's color
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 */
function updateCircleColor(r, g, b) {
    circle.style.background = `rgb(${r}, ${g}, ${b})`;
    circleColorCode.textContent = rgbToHex(r, g, b);
}

/**
 * Updates circle two's color
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 */
function updateCircleTwoColor(r, g, b) {
    circleTwo.style.background = `rgb(${r}, ${g}, ${b})`;
    circleColorCode.textContent = rgbToHex(r, g, b);
}

/**
 * Updates circle three's color
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 */
function updateCircleThreeColor(r, g, b) {
    circleThree.style.background = `rgb(${r}, ${g}, ${b})`;
    circleColorCode.textContent = rgbToHex(r, g, b);
}

/**
 * Gets current circle RGB colors
 * @returns {Object} Object containing RGB values for all three circles
 */
function getCurrentCircleColors() {
    return {
        circle1: currentCircleRGB,
        circle2: currentCircleTwoRGB,
        circle3: currentCircleThreeRGB
    };
}

/**
 * Initializes circle color controller with event listeners
 */
function initCircleController() {
    // Circle target switching is now handled by controller circle clicks in circleInteraction.js

    // Circle color mode switching
    const modeButtons = document.querySelectorAll('.mode-btn');
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            const target = btn.dataset.target;

            if (target === 'circle') {
                switchCircleMode(mode);
            }
        });
    });

    // Circle RGB event listeners
    circleRedSlider.addEventListener('input', updateCircleFromRGB);
    circleGreenSlider.addEventListener('input', updateCircleFromRGB);
    circleBlueSlider.addEventListener('input', updateCircleFromRGB);

    // Circle HSV event listeners
    circleHueSlider.addEventListener('input', updateCircleFromHSV);
    circleSatSlider.addEventListener('input', updateCircleFromHSV);
    circleValSlider.addEventListener('input', updateCircleFromHSV);

    // Circle CMYK event listeners
    circleCyanSlider.addEventListener('input', updateCircleFromCMYK);
    circleMagentaSlider.addEventListener('input', updateCircleFromCMYK);
    circleYellowSlider.addEventListener('input', updateCircleFromCMYK);
    circleBlackSlider.addEventListener('input', updateCircleFromCMYK);

    // Initialize circle colors
    updateCircleFromRGB();
    updateCircleTwoColor(245, 242, 230); // #F5F2E6 - Light warm beige
    updateCircleThreeColor(255, 255, 255); // #FFFFFF - White
}
