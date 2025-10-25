// ============================================
// COLOR RANDOMIZER
// ============================================

/**
 * Generates a random RGB color
 * @returns {Object} RGB object with r, g, b properties (0-255)
 */
function generateRandomRGB() {
    return {
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256)
    };
}

/**
 * Randomizes the background color
 */
function randomizeBackgroundColor() {
    const randomColor = generateRandomRGB();

    // Update the current RGB values
    currentRGB = randomColor;

    // Update all sliders based on current mode
    if (currentMode === 'rgb') {
        redSlider.value = randomColor.r;
        greenSlider.value = randomColor.g;
        blueSlider.value = randomColor.b;
        updateFromRGB();
    } else if (currentMode === 'hsv') {
        const hsv = rgbToHsv(randomColor.r, randomColor.g, randomColor.b);
        hueSlider.value = hsv.h;
        satSlider.value = hsv.s;
        valSlider.value = hsv.v;
        updateFromHSV();
    } else if (currentMode === 'cmyk') {
        const cmyk = rgbToCmyk(randomColor.r, randomColor.g, randomColor.b);
        cyanSlider.value = cmyk.c;
        magentaSlider.value = cmyk.m;
        yellowSlider.value = cmyk.y;
        blackSlider.value = cmyk.k;
        updateFromCMYK();
    }
}

/**
 * Randomizes a specific circle's color
 * @param {number} circleNumber - Circle number (1, 2, or 3)
 */
function randomizeCircleColor(circleNumber) {
    const randomColor = generateRandomRGB();

    // Store the color in the appropriate circle variable
    if (circleNumber === 1) {
        currentCircleRGB = randomColor;
    } else if (circleNumber === 2) {
        currentCircleTwoRGB = randomColor;
    } else if (circleNumber === 3) {
        currentCircleThreeRGB = randomColor;
    }

    // If this is the currently selected circle, update the sliders
    if (currentCircleTarget === circleNumber) {
        if (currentCircleMode === 'rgb') {
            circleRedSlider.value = randomColor.r;
            circleGreenSlider.value = randomColor.g;
            circleBlueSlider.value = randomColor.b;
            updateCircleFromRGB();
        } else if (currentCircleMode === 'hsv') {
            const hsv = rgbToHsv(randomColor.r, randomColor.g, randomColor.b);
            circleHueSlider.value = hsv.h;
            circleSatSlider.value = hsv.s;
            circleValSlider.value = hsv.v;
            updateCircleFromHSV();
        } else if (currentCircleMode === 'cmyk') {
            const cmyk = rgbToCmyk(randomColor.r, randomColor.g, randomColor.b);
            circleCyanSlider.value = cmyk.c;
            circleMagentaSlider.value = cmyk.m;
            circleYellowSlider.value = cmyk.y;
            circleBlackSlider.value = cmyk.k;
            updateCircleFromCMYK();
        }
    } else {
        // Update the circle color directly without updating sliders
        if (circleNumber === 1) {
            updateCircleColor(randomColor.r, randomColor.g, randomColor.b);
        } else if (circleNumber === 2) {
            updateCircleTwoColor(randomColor.r, randomColor.g, randomColor.b);
        } else if (circleNumber === 3) {
            updateCircleThreeColor(randomColor.r, randomColor.g, randomColor.b);
        }
    }
}

/**
 * Randomizes all colors (background and all three circles)
 */
function randomizeAllColors() {
    randomizeBackgroundColor();
    randomizeCircleColor(1);
    randomizeCircleColor(2);
    randomizeCircleColor(3);
}

/**
 * Initializes the randomizer with event listeners
 */
function initRandomizer() {
    const randomizeBtn = document.getElementById('randomizeBtn');

    if (randomizeBtn) {
        randomizeBtn.addEventListener('click', randomizeAllColors);
    }
}
