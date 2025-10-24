// ============================================
// COLOR DISPLAY MODULE
// ============================================
// Handles rendering color swatches and their information
// on the report page

import { rgbToHex, rgbToHsv, rgbToCmyk } from '../shared/colorConversions.js';

/**
 * Display color swatches with all color format values
 * @param {Object} colorData - Object containing background and circle colors
 */
export function displayColorSwatches(colorData) {
    const swatches = [
        { id: 'backgroundSwatch', color: colorData.background, name: 'Background' },
        { id: 'circle1Swatch', color: colorData.circle1, name: 'Circle One' },
        { id: 'circle2Swatch', color: colorData.circle2, name: 'Circle Two' },
        { id: 'circle3Swatch', color: colorData.circle3, name: 'Circle Three' }
    ];

    swatches.forEach(swatch => {
        const element = document.getElementById(swatch.id);
        const colorDiv = element.querySelector('.swatch-color');
        const info = element.querySelector('.swatch-info');

        const { r, g, b } = swatch.color;
        const hex = rgbToHex(r, g, b);
        const hsv = rgbToHsv(r, g, b);
        const cmyk = rgbToCmyk(r, g, b);

        // Set background color
        colorDiv.style.backgroundColor = hex;

        // Display color values in multiple formats
        info.querySelector('.hex-value').textContent = `HEX: ${hex}`;
        info.querySelector('.rgb-value').textContent = `RGB: ${r}, ${g}, ${b}`;
        info.querySelector('.hsv-value').textContent = `HSV: ${hsv.h}°, ${hsv.s}%, ${hsv.v}%`;
        info.querySelector('.cmyk-value').textContent = `CMYK: ${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%`;
    });
}
