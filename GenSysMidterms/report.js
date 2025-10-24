// ============================================
// COLOR CONVERSION UTILITIES
// ============================================

function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const h = x.toString(16);
        return h.length === 1 ? '0' + h : h;
    }).join('').toUpperCase();
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

// ============================================
// WEB AUDIO API - COLOR TO SOUND
// ============================================

function playColorChord(colors) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const duration = 2; // 2 seconds
    const now = audioContext.currentTime;

    // Map each color to a frequency
    // We'll use the hue value (0-360) to determine the note
    // and brightness/saturation for volume
    colors.forEach((color, index) => {
        const hsv = rgbToHsv(color.r, color.g, color.b);

        // Map hue (0-360) to frequency range (200Hz - 800Hz)
        // This creates a pleasant musical range
        const frequency = 200 + (hsv.h / 360) * 600;

        // Map value (brightness) to gain (0.1 - 0.3)
        const gain = 0.1 + (hsv.v / 100) * 0.2;

        // Create oscillator for this color
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        // Use sine wave for smooth, pleasant tone
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, now);

        // Set up envelope (fade in and fade out)
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(gain, now + 0.1); // Fade in
        gainNode.gain.setValueAtTime(gain, now + duration - 0.3);
        gainNode.gain.linearRampToValueAtTime(0, now + duration); // Fade out

        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Play
        oscillator.start(now);
        oscillator.stop(now + duration);
    });
}

// ============================================
// DISPLAY COLOR SWATCHES
// ============================================

function displayColorSwatches(colorData) {
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

        // Display color values
        info.querySelector('.hex-value').textContent = `HEX: ${hex}`;
        info.querySelector('.rgb-value').textContent = `RGB: ${r}, ${g}, ${b}`;
        info.querySelector('.hsv-value').textContent = `HSV: ${hsv.h}°, ${hsv.s}%, ${hsv.v}%`;
        info.querySelector('.cmyk-value').textContent = `CMYK: ${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%`;
    });
}

// ============================================
// CLAUDE API - GENERATE POETRY
// ============================================

async function generatePoetry(colorData) {
    const poetryContainer = document.getElementById('poetryContainer');

    // Prepare color descriptions for the prompt
    const colors = [
        { name: 'Background', ...colorData.background },
        { name: 'Circle One', ...colorData.circle1 },
        { name: 'Circle Two', ...colorData.circle2 },
        { name: 'Circle Three', ...colorData.circle3 }
    ];

    const colorDescriptions = colors.map(c => {
        const hex = rgbToHex(c.r, c.g, c.b);
        const hsv = rgbToHsv(c.r, c.g, c.b);
        return `${c.name}: ${hex} (Hue: ${hsv.h}°, Saturation: ${hsv.s}%, Value: ${hsv.v}%)`;
    }).join('\n');

    try {
        // NOTE: You'll need to add your Claude API key here
        const API_KEY = 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;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 1024,
                messages: [{
                    role: 'user',
                    content: `You are a concrete poet. Given the following color palette, create a poetic interpretation that reflects the emotional and aesthetic qualities of these colors. The poem should be experimental in form, inspired by concrete poetry, where the visual arrangement of text echoes the content and feeling of the words.

Color Palette:
${colorDescriptions}

Create a poem that:
1. Captures the emotional resonance and relationships between these colors
2. Uses visual spacing, line breaks, and arrangement to create meaning
3. Is between 10-20 lines
4. Uses language that evokes the colors without directly naming them
5. Can be rendered as plain text with spaces and line breaks to create visual form

Return ONLY the poem text with its visual formatting (using spaces and line breaks). No explanations or metadata.`
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        const poemText = data.content[0].text;

        // Display the poem with concrete poetry styling
        poetryContainer.innerHTML = `<pre class="poetry-text">${poemText}</pre>`;

    } catch (error) {
        console.error('Error generating poetry:', error);
        poetryContainer.innerHTML = `<p class="error">Unable to generate poetic interpretation. Please check your API configuration.</p>`;
    }
}

// ============================================
// INITIALIZE REPORT PAGE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Retrieve color data from localStorage
    const colorDataStr = localStorage.getItem('colorPalette');

    if (!colorDataStr) {
        alert('No color data found. Redirecting to main page.');
        window.location.href = 'main.html';
        return;
    }

    const colorData = JSON.parse(colorDataStr);

    // Display color swatches
    displayColorSwatches(colorData);

    // Play audio chord based on colors
    const colorArray = [
        colorData.background,
        colorData.circle1,
        colorData.circle2,
        colorData.circle3
    ];
    playColorChord(colorArray);

    // Generate poetry using Claude API
    generatePoetry(colorData);
});
