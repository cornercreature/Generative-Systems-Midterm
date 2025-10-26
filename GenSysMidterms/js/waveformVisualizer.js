// ============================================
// WAVEFORM VISUALIZER
// ============================================
// Creates animated waveform visualization of color-based audio
// Displays on canvas and handles click-to-replay

let currentColorData = null;
let isAnimating = false;
let animationFrameId = null;

/**
 * Initializes the waveform visualization canvas
 * @param {Object} colorData - Color palette data
 */
function initializeWaveformVisualizer(colorData) {
    currentColorData = colorData;

    const canvas = document.getElementById('chimeCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Draw initial state
    drawWaveformStatic(ctx, canvas, colorData);

    // Add click handler for replay
    canvas.style.cursor = 'pointer';
    canvas.addEventListener('click', replayChime);

    // Hide instruction
    updateChimeInstruction('');
}

/**
 * Draws static waveform representation
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {Object} colorData - Color palette data
 */
function drawWaveformStatic(ctx, canvas, colorData) {
    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    const bgHex = rgbToHex(colorData.background.r, colorData.background.g, colorData.background.b);
    ctx.fillStyle = bgHex;
    ctx.fillRect(0, 0, width, height);

    // Draw 4 waveforms (one for each color)
    const colors = [
        colorData.circle3,
        colorData.circle2,
        colorData.circle1,
        colorData.background
    ];

    const audioInfo = analyzeColorAudio(colorData);

    colors.forEach((color, index) => {
        const hex = rgbToHex(color.r, color.g, color.b);
        const frequency = audioInfo[3 - index].frequency;
        const amplitude = height / 8;

        // Draw waveform with glow effect
        ctx.strokeStyle = hex;
        ctx.lineWidth = 5;
        ctx.globalAlpha = 1;

        // Add subtle glow
        ctx.shadowColor = hex;
        ctx.shadowBlur = 8;

        ctx.beginPath();

        for (let x = 0; x < width; x++) {
            const normalizedFreq = frequency / 1000; // Normalize for visualization
            const y = centerY + Math.sin((x / width) * Math.PI * 8 * normalizedFreq) * amplitude * (1 - index * 0.2);

            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.stroke();

        // Reset shadow
        ctx.shadowBlur = 0;
    });

    ctx.globalAlpha = 1;
}

/**
 * Animates the waveform while audio plays
 * @param {Object} colorData - Color palette data
 */
function animateWaveform(colorData) {
    const canvas = document.getElementById('chimeCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    let startTime = Date.now();
    const duration = 3000; // 3 seconds animation
    isAnimating = true;

    const audioInfo = analyzeColorAudio(colorData);

    function animate() {
        if (!isAnimating) return;

        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw background
        const bgHex = rgbToHex(colorData.background.r, colorData.background.g, colorData.background.b);
        ctx.fillStyle = bgHex;
        ctx.fillRect(0, 0, width, height);

        // Draw animated waveforms
        const colors = [
            colorData.circle3,
            colorData.circle2,
            colorData.circle1,
            colorData.background
        ];

        colors.forEach((color, index) => {
            const hex = rgbToHex(color.r, color.g, color.b);
            const frequency = audioInfo[3 - index].frequency;
            const baseAmplitude = height / 8;

            // Animate amplitude with envelope (fade in, sustain, fade out)
            let amplitudeMultiplier;
            if (progress < 0.1) {
                amplitudeMultiplier = progress / 0.1; // Fade in
            } else if (progress > 0.8) {
                amplitudeMultiplier = 1 - ((progress - 0.8) / 0.2); // Fade out
            } else {
                amplitudeMultiplier = 1; // Sustain
            }

            const amplitude = baseAmplitude * amplitudeMultiplier * (1 - index * 0.15);

            // Draw waveform with enhanced glow
            ctx.strokeStyle = hex;
            ctx.lineWidth = 6;
            ctx.globalAlpha = 1;

            // Add animated glow effect
            ctx.shadowColor = hex;
            ctx.shadowBlur = 12;

            ctx.beginPath();

            for (let x = 0; x < width; x++) {
                const normalizedFreq = frequency / 1000;
                const phase = (x / width) * Math.PI * 8 * normalizedFreq + (elapsed / 200);
                const y = centerY + Math.sin(phase) * amplitude;

                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.stroke();

            // Reset shadow
            ctx.shadowBlur = 0;
        });

        ctx.globalAlpha = 1;

        if (progress < 1) {
            animationFrameId = requestAnimationFrame(animate);
        } else {
            isAnimating = false;
            drawWaveformStatic(ctx, canvas, colorData);
            updateChimeInstruction('');
        }
    }

    animate();
}

/**
 * Stops the current animation
 */
function stopAnimation() {
    isAnimating = false;
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
}

/**
 * Replays the chime (called when canvas is clicked)
 */
function replayChime() {
    if (isAnimating) return; // Don't start if already playing

    updateChimeInstruction('');

    // Play audio and animate
    playColorChime(currentColorData, null);
    animateWaveform(currentColorData);
}

/**
 * Updates the instruction text below the canvas
 * @param {string} text - Instruction text
 */
function updateChimeInstruction(text) {
    const instruction = document.querySelector('.chime-instruction');
    if (instruction) {
        instruction.textContent = text;
    }
}

/**
 * Starts the initial chime playback and animation
 * @param {Object} colorData - Color palette data
 */
function playInitialChime(colorData) {
    currentColorData = colorData;

    // Small delay before playing
    setTimeout(() => {
        updateChimeInstruction('');
        playColorChime(colorData, null);
        animateWaveform(colorData);
    }, 500);
}
