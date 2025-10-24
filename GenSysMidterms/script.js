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
const modeButtons = document.querySelectorAll('.mode-btn');
const colorModes = document.querySelectorAll('.color-mode');

let currentMode = 'rgb';
let currentRGB = { r: 255, g: 249, b: 154 };

// Circle color variables
let currentCircleMode = 'rgb';
let currentCircleTarget = 1; // 1, 2, or 3
let currentCircleRGB = { r: 199, g: 113, b: 56 }; // #C77138
let currentCircleTwoRGB = { r: 155, g: 221, b: 243 }; // #9BDDF3
let currentCircleThreeRGB = { r: 255, g: 249, b: 237 }; // #FFF9ED

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

// Circle target selector buttons
const circleTargetButtons = document.querySelectorAll('.circle-target-btn');

// Blur control elements
const blurTargetButtons = document.querySelectorAll('.blur-target-btn');
const blurSlider = document.getElementById('blurSlider');
const blurValue = document.getElementById('blurValue');

// Blur state variables
let currentBlurTarget = 2; // 2 or 3
let circleTwoBlur = 2;
let circleThreeBlur = 2;

// Circle target switching
circleTargetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetCircle = parseInt(btn.dataset.circle);
        switchCircleTarget(targetCircle);
    });
});

function switchCircleTarget(target) {
    currentCircleTarget = target;

    // Update button active states
    circleTargetButtons.forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.circle) === target);
    });

    // Update sliders to show current target's color
    if (target === 1) {
        syncSlidersToRGB(currentCircleRGB);
    } else if (target === 2) {
        syncSlidersToRGB(currentCircleTwoRGB);
    } else if (target === 3) {
        syncSlidersToRGB(currentCircleThreeRGB);
    }
}

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

// Mode switching
modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        const target = btn.dataset.target;

        if (target === 'circle') {
            switchCircleMode(mode);
        } else {
            switchMode(mode);
        }
    });
});

function switchMode(mode) {
    currentMode = mode;
    
    modeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
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

// Circle RGB Functions
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

// Circle HSV Functions
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

// Circle CMYK Functions
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

// Update circle color
function updateCircleColor(r, g, b) {
    circle.style.background = `rgb(${r}, ${g}, ${b})`;

    const hex = '#' + [r, g, b].map(x => {
        const h = x.toString(16);
        return h.length === 1 ? '0' + h : h;
    }).join('');

    circleColorCode.textContent = hex.toUpperCase();
}

// Update circle two color
function updateCircleTwoColor(r, g, b) {
    circleTwo.style.background = `rgb(${r}, ${g}, ${b})`;

    const hex = '#' + [r, g, b].map(x => {
        const h = x.toString(16);
        return h.length === 1 ? '0' + h : h;
    }).join('');

    circleColorCode.textContent = hex.toUpperCase();
}

// Update circle three color
function updateCircleThreeColor(r, g, b) {
    circleThree.style.background = `rgb(${r}, ${g}, ${b})`;

    const hex = '#' + [r, g, b].map(x => {
        const h = x.toString(16);
        return h.length === 1 ? '0' + h : h;
    }).join('');

    circleColorCode.textContent = hex.toUpperCase();
}

// RGB Functions
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

// HSV Functions
function hsvToRgb(h, s, v) {
    s = s / 100;
    v = v / 100;
    
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    
    let r, g, b;
    
    if (h >= 0 && h < 60) {
        r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
        r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
        r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
        r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
        r = x; g = 0; b = c;
    } else {
        r = c; g = 0; b = x;
    }
    
    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255)
    };
}

function rgbToHsv(r, g, b) {
    r = r / 255;
    g = g / 255;
    b = b / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    
    let h = 0;
    if (delta !== 0) {
        if (max === r) {
            h = ((g - b) / delta) % 6;
        } else if (max === g) {
            h = (b - r) / delta + 2;
        } else {
            h = (r - g) / delta + 4;
        }
        h = Math.round(h * 60);
        if (h < 0) h += 360;
    }
    
    const s = max === 0 ? 0 : Math.round((delta / max) * 100);
    const v = Math.round(max * 100);
    
    return { h, s, v };
}

function syncRGBtoHSV() {
    const hsv = rgbToHsv(currentRGB.r, currentRGB.g, currentRGB.b);
    hueSlider.value = hsv.h;
    satSlider.value = hsv.s;
    valSlider.value = hsv.v;
    hueValue.textContent = hsv.h + '°';
    satValue.textContent = hsv.s + '%';
    valValue.textContent = hsv.v + '%';
}

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

// CMYK Functions
function cmykToRgb(c, m, y, k) {
    c = c / 100;
    m = m / 100;
    y = y / 100;
    k = k / 100;
    
    const r = 255 * (1 - c) * (1 - k);
    const g = 255 * (1 - m) * (1 - k);
    const b = 255 * (1 - y) * (1 - k);
    
    return {
        r: Math.round(r),
        g: Math.round(g),
        b: Math.round(b)
    };
}

function rgbToCmyk(r, g, b) {
    r = r / 255;
    g = g / 255;
    b = b / 255;
    
    const k = 1 - Math.max(r, g, b);
    
    if (k === 1) {
        return { c: 0, m: 0, y: 0, k: 100 };
    }
    
    const c = Math.round(((1 - r - k) / (1 - k)) * 100);
    const m = Math.round(((1 - g - k) / (1 - k)) * 100);
    const y = Math.round(((1 - b - k) / (1 - k)) * 100);
    
    return { c, m, y, k: Math.round(k * 100) };
}

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

// Update background and hex code
function updateBackground(r, g, b) {
    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    
    const hex = '#' + [r, g, b].map(x => {
        const h = x.toString(16);
        return h.length === 1 ? '0' + h : h;
    }).join('');
    
    colorCode.textContent = hex.toUpperCase();
}

// Event listeners
redSlider.addEventListener('input', updateFromRGB);
greenSlider.addEventListener('input', updateFromRGB);
blueSlider.addEventListener('input', updateFromRGB);

hueSlider.addEventListener('input', updateFromHSV);
satSlider.addEventListener('input', updateFromHSV);
valSlider.addEventListener('input', updateFromHSV);

cyanSlider.addEventListener('input', updateFromCMYK);
magentaSlider.addEventListener('input', updateFromCMYK);
yellowSlider.addEventListener('input', updateFromCMYK);
blackSlider.addEventListener('input', updateFromCMYK);

// Initialize
updateFromRGB();

// Circle scroll resize functionality
const circle = document.getElementById('circle');
const circleTwo = document.getElementById('circleTwo');
const circleThree = document.getElementById('circleThree');
let isActive = false;
let isTwoActive = false;
let isThreeActive = false;
let circleSize = 600;
let circleTwoSize = 350;
let circleThreeSize = 110;
let isDraggingTwo = false;
let isDraggingThree = false;
let offsetX = 0;
let offsetY = 0;
let offsetThreeX = 0;
let offsetThreeY = 0;

// DISABLED: Direct interaction with center circles - now controlled via controller
// The following event listeners have been disabled in favor of the controller interface

/*
// Activate circle one by clicking on matching background color
circle.addEventListener('mousedown', (e) => {
    // Only activate if clicking directly on circle one (not on circleTwo or circleThree)
    if (e.target === circle) {
        isActive = !isActive;
        if (isActive) {
            circle.classList.add('dragging');
            // Deactivate circleTwo and circleThree if they were active
            if (isTwoActive) {
                isTwoActive = false;
                circleTwo.classList.remove('dragging');
            }
            if (isThreeActive) {
                isThreeActive = false;
                circleThree.classList.remove('dragging');
            }
        } else {
            circle.classList.remove('dragging');
        }
        e.stopPropagation();
    }
});

//encompases click and click and drag for circleTwo
circleTwo.addEventListener('mousedown', (e) => {
    // Only activate if clicking directly on circleTwo (not on circleThree)
    if (e.target === circleTwo) {
        // Check if we're clicking to activate resize mode or starting a drag
        if (!isTwoActive) {
            // Activate resize mode
            isTwoActive = true;
            circleTwo.classList.add('dragging');
            if (isActive) {
                isActive = false;
                circle.classList.remove('dragging');
            }
            if (isThreeActive) {
                isThreeActive = false;
                circleThree.classList.remove('dragging');
            }
        } else {
            // Start dragging (resize mode is already active)
            isDraggingTwo = true;
            const circleRect = circle.getBoundingClientRect();
            const circleTwoRect = circleTwo.getBoundingClientRect();
            const circleTwoCenterX = circleTwoRect.left + circleTwoRect.width / 2;
            const circleTwoCenterY = circleTwoRect.top + circleTwoRect.height / 2;
            offsetX = e.clientX - circleTwoCenterX;
            offsetY = e.clientY - circleTwoCenterY;
        }
        e.stopPropagation();
        e.preventDefault();
    }
});

circleTwo.addEventListener('click', (e) => {
    // Click to deactivate circleTwo if already active
    // Only deactivate if we weren't dragging (to distinguish between drag and click)
    if (e.target === circleTwo && isTwoActive && !isDraggingTwo) {
        isTwoActive = false;
        circleTwo.classList.remove('dragging');
    }
    e.stopPropagation();
    e.preventDefault();
});

//encompases click and click and drag for circleThree
circleThree.addEventListener('mousedown', (e) => {
    // Check if we're clicking to activate resize mode or starting a drag
    if (!isThreeActive) {
        // Activate resize mode
        isThreeActive = true;
        circleThree.classList.add('dragging');
        if (isActive) {
            isActive = false;
            circle.classList.remove('dragging');
        }
        if (isTwoActive) {
            isTwoActive = false;
            circleTwo.classList.remove('dragging');
        }
    } else {
        // Start dragging (resize mode is already active)
        isDraggingThree = true;
        const circleTwoRect = circleTwo.getBoundingClientRect();
        const circleThreeRect = circleThree.getBoundingClientRect();
        const circleThreeCenterX = circleThreeRect.left + circleThreeRect.width / 2;
        const circleThreeCenterY = circleThreeRect.top + circleThreeRect.height / 2;
        offsetThreeX = e.clientX - circleThreeCenterX;
        offsetThreeY = e.clientY - circleThreeCenterY;
    }
    e.stopPropagation();
    e.preventDefault();
});

circleThree.addEventListener('click', (e) => {
    // Click to deactivate circleThree if already active
    // Only deactivate if we weren't dragging (to distinguish between drag and click)
    if (isThreeActive && !isDraggingThree) {
        isThreeActive = false;
        circleThree.classList.remove('dragging');
    }
    e.stopPropagation();
    e.preventDefault();
});

// Deactivate when clicking outside all circles
document.addEventListener('click', (e) => {
    if (e.target !== circle && e.target !== circleTwo && e.target !== circleThree) {
        if (isActive) {
            isActive = false;
            circle.classList.remove('dragging');
        }
        if (isTwoActive) {
            isTwoActive = false;
            circleTwo.classList.remove('dragging');
        }
        if (isThreeActive) {
            isThreeActive = false;
            circleThree.classList.remove('dragging');
        }
    }
});

document.addEventListener('wheel', (e) => {
    if (!isActive && !isTwoActive && !isThreeActive) return;

    e.preventDefault();

    const scrollAmount = e.deltaY * 0.5;

    if (isActive) {
        // Resize circle one
        circleSize += scrollAmount;
        circleSize = Math.max(200, Math.min(1000, circleSize));

        // Ensure circleTwo doesn't exceed circle one's size
        if (circleTwoSize > circleSize) {
            circleTwoSize = circleSize;
            circleTwo.style.width = circleTwoSize + 'px';
            circleTwo.style.height = circleTwoSize + 'px';
        }

        // Ensure circleThree doesn't exceed circleTwo's size
        if (circleThreeSize > circleTwoSize) {
            circleThreeSize = circleTwoSize;
            circleThree.style.width = circleThreeSize + 'px';
            circleThree.style.height = circleThreeSize + 'px';
        }

        circle.style.width = circleSize + 'px';
        circle.style.height = circleSize + 'px';
    }

    if (isTwoActive) {
        // Resize circle two
        circleTwoSize += scrollAmount;
        // Constrain between 120px and circle one's current size
        circleTwoSize = Math.max(120, Math.min(circleSize, circleTwoSize));

        // Ensure circleThree doesn't exceed circleTwo's size
        if (circleThreeSize > circleTwoSize) {
            circleThreeSize = circleTwoSize;
            circleThree.style.width = circleThreeSize + 'px';
            circleThree.style.height = circleThreeSize + 'px';
        }

        circleTwo.style.width = circleTwoSize + 'px';
        circleTwo.style.height = circleTwoSize + 'px';
    }

    if (isThreeActive) {
        // Resize circle three
        circleThreeSize += scrollAmount;
        // Constrain between 110px and circle two's current size
        circleThreeSize = Math.max(110, Math.min(circleTwoSize, circleThreeSize));

        circleThree.style.width = circleThreeSize + 'px';
        circleThree.style.height = circleThreeSize + 'px';
    }
}, { passive: false });

document.addEventListener('mousemove', (e) => {
    if (isDraggingTwo) {
        const circleRect = circle.getBoundingClientRect();
        const circleCenterX = circleRect.left + circleRect.width / 2;
        const circleCenterY = circleRect.top + circleRect.height / 2;

        // Calculate desired position relative to circle one's center
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        // Calculate distance from circle one's center
        const dx = newX - circleCenterX;
        const dy = newY - circleCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Calculate max allowed distance (circle one radius + 50px)
        const maxDistance = (circleSize / 2) + 50;

        // Constrain position to expanded boundary
        if (distance > maxDistance) {
            const angle = Math.atan2(dy, dx);
            newX = circleCenterX + Math.cos(angle) * maxDistance;
            newY = circleCenterY + Math.sin(angle) * maxDistance;
        }

        // Convert to position relative to circle one (for absolute positioning within parent)
        const relativeX = newX - circleRect.left;
        const relativeY = newY - circleRect.top;

        // Update circleTwo position (relative to circle one)
        circleTwo.style.left = relativeX + 'px';
        circleTwo.style.top = relativeY + 'px';
        circleTwo.style.transform = 'translate(-50%, -50%)';
    }

    if (isDraggingThree) {
        const circleTwoRect = circleTwo.getBoundingClientRect();
        const circleTwoCenterX = circleTwoRect.left + circleTwoRect.width / 2;
        const circleTwoCenterY = circleTwoRect.top + circleTwoRect.height / 2;

        // Calculate desired position relative to circle two's center
        let newX = e.clientX - offsetThreeX;
        let newY = e.clientY - offsetThreeY;

        // Calculate distance from circle two's center
        const dx = newX - circleTwoCenterX;
        const dy = newY - circleTwoCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Calculate max allowed distance (circle two radius + 20px)
        const maxDistance = (circleTwoSize / 2) + 20;

        // Constrain position to expanded boundary
        if (distance > maxDistance) {
            const angle = Math.atan2(dy, dx);
            newX = circleTwoCenterX + Math.cos(angle) * maxDistance;
            newY = circleTwoCenterY + Math.sin(angle) * maxDistance;
        }

        // Update circleThree position (fixed positioning, so use absolute coordinates)
        circleThree.style.left = newX + 'px';
        circleThree.style.top = newY + 'px';
        circleThree.style.transform = 'translate(-50%, -50%)';
    }
});

// Stop dragging on mouse up
document.addEventListener('mouseup', () => {
    isDraggingTwo = false;
    isDraggingThree = false;
});
*/

// Circle color event listeners
circleRedSlider.addEventListener('input', updateCircleFromRGB);
circleGreenSlider.addEventListener('input', updateCircleFromRGB);
circleBlueSlider.addEventListener('input', updateCircleFromRGB);

circleHueSlider.addEventListener('input', updateCircleFromHSV);
circleSatSlider.addEventListener('input', updateCircleFromHSV);
circleValSlider.addEventListener('input', updateCircleFromHSV);

circleCyanSlider.addEventListener('input', updateCircleFromCMYK);
circleMagentaSlider.addEventListener('input', updateCircleFromCMYK);
circleYellowSlider.addEventListener('input', updateCircleFromCMYK);
circleBlackSlider.addEventListener('input', updateCircleFromCMYK);

// Blur target switching
blurTargetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetCircle = parseInt(btn.dataset.blurCircle);
        switchBlurTarget(targetCircle);
    });
});

function switchBlurTarget(target) {
    currentBlurTarget = target;

    // Update button active states
    blurTargetButtons.forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.blurCircle) === target);
    });

    // Update slider to show current target's blur value
    if (target === 2) {
        blurSlider.value = circleTwoBlur;
        blurValue.textContent = circleTwoBlur + 'px';
    } else if (target === 3) {
        blurSlider.value = circleThreeBlur;
        blurValue.textContent = circleThreeBlur + 'px';
    }
}

// Blur slider event listener
blurSlider.addEventListener('input', () => {
    const blurAmount = parseFloat(blurSlider.value);
    blurValue.textContent = blurAmount + 'px';

    // Update the appropriate circle's blur based on current target
    if (currentBlurTarget === 2) {
        circleTwoBlur = blurAmount;
    } else if (currentBlurTarget === 3) {
        circleThreeBlur = blurAmount;
    }

    // Apply blur filters - circleThree needs to counteract circleTwo's blur
    circleTwo.style.filter = `blur(${circleTwoBlur}px)`;
    // CircleThree: since it's inside circleTwo, we only apply its own blur
    // The parent's blur will affect it, so we just set its independent blur
    circleThree.style.filter = `blur(${circleThreeBlur}px)`;
});

// Initialize circle colors
updateCircleFromRGB();
updateCircleTwoColor(155, 221, 243); // #9BDDF3 - Light blue
updateCircleThreeColor(255, 249, 237); // #FFF9ED - Very light cream

// ============================================
// CIRCLE CONTROLLER FUNCTIONALITY
// ============================================

const circleOneController = document.getElementById('circleOneController');
const circleTwoController = document.getElementById('circleTwoController');
const circleThreeController = document.getElementById('circleThreeController');

// Controller state variables
let controllerOneActive = false;
let controllerTwoActive = false;
let controllerThreeActive = false;
let isDraggingControllerTwo = false;
let isDraggingControllerThree = false;

// Controller sizes (initial values match CSS)
let controllerOneSize = 200;
let controllerTwoSize = 150;
let controllerThreeSize = 50;

// Controller positions (relative to controllerOne's center)
let controllerTwoOffsetX = 0;
let controllerTwoOffsetY = 0;
let controllerThreeOffsetX = 0;
let controllerThreeOffsetY = 0;

// Drag offset for smooth dragging
let dragOffsetX = 0;
let dragOffsetY = 0;

// Function to update center circles based on controller state
function updateCirclesFromController() {
    // Calculate scale ratios
    const scaleRatioOne = circleSize / controllerOneSize;
    const scaleRatioTwo = circleTwoSize / controllerTwoSize;
    const scaleRatioThree = circleThreeSize / controllerThreeSize;

    // Update circle two position relative to circle one
    const circleTwoPosX = controllerTwoOffsetX * scaleRatioOne;
    const circleTwoPosY = controllerTwoOffsetY * scaleRatioOne;

    circleTwo.style.left = `calc(50% + ${circleTwoPosX}px)`;
    circleTwo.style.top = `calc(50% + ${circleTwoPosY}px)`;

    // Update circle three position relative to circle two
    const circleThreePosX = (controllerTwoOffsetX + controllerThreeOffsetX) * scaleRatioOne;
    const circleThreePosY = (controllerTwoOffsetY + controllerThreeOffsetY) * scaleRatioOne;

    circleThree.style.left = `calc(50% + ${circleThreePosX}px)`;
    circleThree.style.top = `calc(50% + ${circleThreePosY}px)`;
}

// CircleOneController: Click to activate, scroll to resize
circleOneController.addEventListener('mousedown', (e) => {
    if (e.target === circleOneController) {
        controllerOneActive = !controllerOneActive;

        if (controllerOneActive) {
            circleOneController.classList.add('dragging');
            controllerTwoActive = false;
            controllerThreeActive = false;
            circleTwoController.classList.remove('dragging');
            circleThreeController.classList.remove('dragging');
        } else {
            circleOneController.classList.remove('dragging');
        }
        e.stopPropagation();
    }
});

// CircleTwoController: Click to activate, drag and scroll
circleTwoController.addEventListener('mousedown', (e) => {
    if (e.target === circleTwoController) {
        if (!controllerTwoActive) {
            // Activate resize mode
            controllerTwoActive = true;
            circleTwoController.classList.add('dragging');
            controllerOneActive = false;
            controllerThreeActive = false;
            circleOneController.classList.remove('dragging');
            circleThreeController.classList.remove('dragging');
        } else {
            // Start dragging
            isDraggingControllerTwo = true;
            const rect = circleTwoController.getBoundingClientRect();
            dragOffsetX = e.clientX - (rect.left + rect.width / 2);
            dragOffsetY = e.clientY - (rect.top + rect.height / 2);
        }
        e.stopPropagation();
        e.preventDefault();
    }
});

// CircleThreeController: Click to activate, drag and scroll
circleThreeController.addEventListener('mousedown', (e) => {
    if (!controllerThreeActive) {
        // Activate resize mode
        controllerThreeActive = true;
        circleThreeController.classList.add('dragging');
        controllerOneActive = false;
        controllerTwoActive = false;
        circleOneController.classList.remove('dragging');
        circleTwoController.classList.remove('dragging');
    } else {
        // Start dragging
        isDraggingControllerThree = true;
        const rect = circleThreeController.getBoundingClientRect();
        dragOffsetX = e.clientX - (rect.left + rect.width / 2);
        dragOffsetY = e.clientY - (rect.top + rect.height / 2);
    }
    e.stopPropagation();
    e.preventDefault();
});

// Deactivate controllers when clicking outside
document.addEventListener('click', (e) => {
    const controllerContainer = document.querySelector('.circle-controller-container');
    if (!controllerContainer.contains(e.target)) {
        controllerOneActive = false;
        controllerTwoActive = false;
        controllerThreeActive = false;
        circleOneController.classList.remove('dragging');
        circleTwoController.classList.remove('dragging');
        circleThreeController.classList.remove('dragging');
    }
});

// Mouse move for dragging controllers
document.addEventListener('mousemove', (e) => {
    if (isDraggingControllerTwo) {
        const containerRect = circleOneController.getBoundingClientRect();
        const containerCenterX = containerRect.left + containerRect.width / 2;
        const containerCenterY = containerRect.top + containerRect.height / 2;

        // Calculate new position
        let newX = e.clientX - dragOffsetX;
        let newY = e.clientY - dragOffsetY;

        // Calculate offset from center
        let offsetX = newX - containerCenterX;
        let offsetY = newY - containerCenterY;

        // Constrain within circleOneController bounds
        const maxDistance = (controllerOneSize / 2) - (controllerTwoSize / 2) - 5;
        const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

        if (distance > maxDistance) {
            const angle = Math.atan2(offsetY, offsetX);
            offsetX = Math.cos(angle) * maxDistance;
            offsetY = Math.sin(angle) * maxDistance;
        }

        controllerTwoOffsetX = offsetX;
        controllerTwoOffsetY = offsetY;

        // Update visual position
        circleTwoController.style.left = `calc(50% + ${offsetX}px)`;
        circleTwoController.style.top = `calc(50% + ${offsetY}px)`;

        // Update center circles
        updateCirclesFromController();
    }

    if (isDraggingControllerThree) {
        const containerRect = circleTwoController.getBoundingClientRect();
        const containerCenterX = containerRect.left + containerRect.width / 2;
        const containerCenterY = containerRect.top + containerRect.height / 2;

        // Calculate new position
        let newX = e.clientX - dragOffsetX;
        let newY = e.clientY - dragOffsetY;

        // Calculate offset from circleTwoController center
        let offsetX = newX - containerCenterX;
        let offsetY = newY - containerCenterY;

        // Constrain within circleTwoController bounds
        const maxDistance = (controllerTwoSize / 2) - (controllerThreeSize / 2) - 5;
        const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

        if (distance > maxDistance) {
            const angle = Math.atan2(offsetY, offsetX);
            offsetX = Math.cos(angle) * maxDistance;
            offsetY = Math.sin(angle) * maxDistance;
        }

        controllerThreeOffsetX = offsetX;
        controllerThreeOffsetY = offsetY;

        // Update visual position
        circleThreeController.style.left = `calc(50% + ${offsetX}px)`;
        circleThreeController.style.top = `calc(50% + ${offsetY}px)`;

        // Update center circles
        updateCirclesFromController();
    }
});

// Mouse up to stop dragging
document.addEventListener('mouseup', () => {
    isDraggingControllerTwo = false;
    isDraggingControllerThree = false;
});

// Scroll to resize controllers (intercept existing wheel handler)
const controllerContainer = document.querySelector('.circle-controller-container');
controllerContainer.addEventListener('wheel', (e) => {
    if (!controllerOneActive && !controllerTwoActive && !controllerThreeActive) return;

    e.preventDefault();
    e.stopPropagation();

    const scrollAmount = e.deltaY * 0.3;

    if (controllerOneActive) {
        // Resize controller one and circle one proportionally
        const oldSize = controllerOneSize;
        controllerOneSize -= scrollAmount;
        controllerOneSize = Math.max(100, Math.min(200, controllerOneSize));

        const scaleChange = controllerOneSize / oldSize;
        circleSize = Math.round(circleSize * scaleChange);
        circleSize = Math.max(200, Math.min(1000, circleSize));

        // Ensure nested controllers don't exceed parent
        if (controllerTwoSize > controllerOneSize - 20) {
            controllerTwoSize = controllerOneSize - 20;
            circleTwoController.style.width = controllerTwoSize + 'px';
            circleTwoController.style.height = controllerTwoSize + 'px';
        }

        circleOneController.style.width = controllerOneSize + 'px';
        circleOneController.style.height = controllerOneSize + 'px';
        circle.style.width = circleSize + 'px';
        circle.style.height = circleSize + 'px';
    }

    if (controllerTwoActive) {
        // Resize controller two and circle two proportionally
        const oldSize = controllerTwoSize;
        controllerTwoSize -= scrollAmount;
        controllerTwoSize = Math.max(50, Math.min(controllerOneSize - 20, controllerTwoSize));

        const scaleChange = controllerTwoSize / oldSize;
        circleTwoSize = Math.round(circleTwoSize * scaleChange);
        circleTwoSize = Math.max(120, Math.min(circleSize + 50, circleTwoSize));

        // Ensure nested controller doesn't exceed parent
        if (controllerThreeSize > controllerTwoSize - 20) {
            controllerThreeSize = controllerTwoSize - 20;
            circleThreeController.style.width = controllerThreeSize + 'px';
            circleThreeController.style.height = controllerThreeSize + 'px';
        }

        circleTwoController.style.width = controllerTwoSize + 'px';
        circleTwoController.style.height = controllerTwoSize + 'px';
        circleTwo.style.width = circleTwoSize + 'px';
        circleTwo.style.height = circleTwoSize + 'px';
    }

    if (controllerThreeActive) {
        // Resize controller three and circle three proportionally
        const oldSize = controllerThreeSize;
        controllerThreeSize -= scrollAmount;
        controllerThreeSize = Math.max(30, Math.min(controllerTwoSize - 20, controllerThreeSize));

        const scaleChange = controllerThreeSize / oldSize;
        circleThreeSize = Math.round(circleThreeSize * scaleChange);
        circleThreeSize = Math.max(110, Math.min(circleTwoSize, circleThreeSize));

        circleThreeController.style.width = controllerThreeSize + 'px';
        circleThreeController.style.height = controllerThreeSize + 'px';
        circleThree.style.width = circleThreeSize + 'px';
        circleThree.style.height = circleThreeSize + 'px';
    }

    updateCirclesFromController();
}, { passive: false });

// ============================================
// COLLAPSIBLE SECTIONS FUNCTIONALITY
// ============================================

const collapsibleHeaders = document.querySelectorAll('.collapsible-header');

collapsibleHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const section = header.dataset.section;
        const content = document.getElementById(section + 'Content');

        // Toggle collapsed state
        header.classList.toggle('collapsed');
        content.classList.toggle('collapsed');
    });
});

// ============================================
// GENERATE REPORT FUNCTIONALITY
// ============================================

const generateReportBtn = document.getElementById('generateReportBtn');

generateReportBtn.addEventListener('click', () => {
    // Gather all color data
    const colorData = {
        background: currentRGB,
        circle1: currentCircleRGB,
        circle2: currentCircleTwoRGB,
        circle3: currentCircleThreeRGB
    };

    // Store in localStorage for report page to access
    localStorage.setItem('colorPalette', JSON.stringify(colorData));

    // Navigate to report page
    window.location.href = 'report.html';
});