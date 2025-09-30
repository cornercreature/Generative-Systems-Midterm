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
let currentRGB = { r: 128, g: 128, b: 128 };

// Circle color variables
let currentCircleMode = 'rgb';
let currentCircleRGB = { r: 255, g: 255, b: 255 };

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
    
    currentCircleRGB = { r, g, b };
    updateCircleColor(r, g, b);
    
    circleRedValue.textContent = r;
    circleGreenValue.textContent = g;
    circleBlueValue.textContent = b;
}

// Circle HSV Functions
function syncCircleRGBtoHSV() {
    const hsv = rgbToHsv(currentCircleRGB.r, currentCircleRGB.g, currentCircleRGB.b);
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
    currentCircleRGB = rgb;
    updateCircleColor(rgb.r, rgb.g, rgb.b);
    
    circleHueValue.textContent = h + '°';
    circleSatValue.textContent = s + '%';
    circleValValue.textContent = v + '%';
}

// Circle CMYK Functions
function syncCircleRGBtoCMYK() {
    const cmyk = rgbToCmyk(currentCircleRGB.r, currentCircleRGB.g, currentCircleRGB.b);
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
    currentCircleRGB = rgb;
    updateCircleColor(rgb.r, rgb.g, rgb.b);
    
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
let isActive = false;
let isTwoActive = false;
let circleSize = 200;
let circleTwoSize = 120;
let isDraggingTwo = false;
let offsetX = 0;
let offsetY = 0;

// Activate circle one by clicking on matching background color
// Activate circle one by clicking on matching background color
document.addEventListener('mousedown', (e) => {
    // Skip if clicking on circleTwo or the control panels
    if (e.target === circleTwo || 
        e.target.closest('.circle-controls') || 
        e.target.closest('.controls')) {
        return;
    }
    
    // Get the RGB color at click position
    const clickX = e.clientX;
    const clickY = e.clientY;
    
    // Create a temporary canvas to sample the pixel color
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    
    // Get the body's background color (which is our current background)
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    
    // Parse RGB values from the body background
    const bodyRgbMatch = bodyBg.match(/\d+/g);
    const bodyR = parseInt(bodyRgbMatch[0]);
    const bodyG = parseInt(bodyRgbMatch[1]);
    const bodyB = parseInt(bodyRgbMatch[2]);
    
    // Get circle one's color
    const circleColor = window.getComputedStyle(circle).backgroundColor;
    const circleRgbMatch = circleColor.match(/\d+/g);
    const circleR = parseInt(circleRgbMatch[0]);
    const circleG = parseInt(circleRgbMatch[1]);
    const circleB = parseInt(circleRgbMatch[2]);
    
    // Check if we clicked on the background or on circle one
    let shouldActivate = false;
    
    if (e.target === circle || e.target === document.body) {
        // Compare background color with circle one's color
        if (bodyR === circleR && bodyG === circleG && bodyB === circleB) {
            shouldActivate = true;
        }
    }
    
    if (shouldActivate) {
        isActive = !isActive;
        if (isActive) {
            circle.classList.add('dragging');
            // Deactivate circleTwo if it was active
            if (isTwoActive) {
                isTwoActive = false;
                circleTwo.classList.remove('dragging');
            }
        } else {
            circle.classList.remove('dragging');
        }
    } else {
        // Clicking on non-matching color deactivates
        if (isActive) {
            isActive = false;
            circle.classList.remove('dragging');
        }
    }
});

//encompases click and click and drag for circleTwo
circleTwo.addEventListener('mousedown', (e) => {
    // Check if we're clicking to activate resize mode or starting a drag
    if (!isTwoActive) {
        // Activate resize mode
        isTwoActive = true;
        circleTwo.classList.add('dragging');
        if (isActive) {
            isActive = false;
            circle.classList.remove('dragging');
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
});

circleTwo.addEventListener('dblclick', (e) => {
    // Double-click to deactivate circleTwo
    if (isTwoActive) {
        isTwoActive = false;
        circleTwo.classList.remove('dragging');
    }
    isDraggingTwo = false;
    e.stopPropagation();
    e.preventDefault();
});

// Deactivate when clicking outside both circles
document.addEventListener('click', (e) => {
    if (e.target !== circle && e.target !== circleTwo) {
        if (isActive) {
            isActive = false;
            circle.classList.remove('dragging');
        }
        if (isTwoActive) {
            isTwoActive = false;
            circleTwo.classList.remove('dragging');
        }
    }
});

document.addEventListener('wheel', (e) => {
    if (!isActive && !isTwoActive) return;
    
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
        
        circle.style.width = circleSize + 'px';
        circle.style.height = circleSize + 'px';
    }
    
    if (isTwoActive) {
        // Resize circle two
        circleTwoSize += scrollAmount;
        // Constrain between 20px and circle one's current size
        circleTwoSize = Math.max(120, Math.min(circleSize, circleTwoSize));
        
        circleTwo.style.width = circleTwoSize + 'px';
        circleTwo.style.height = circleTwoSize + 'px';
    }
}, { passive: false });

document.addEventListener('mousemove', (e) => {
    if (!isDraggingTwo) return;
    
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
    
    // Calculate max allowed distance (circle one radius + 200px)
    const maxDistance = (circleSize / 2) + 200;
    
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
});

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

// Initialize circle color
updateCircleFromRGB();