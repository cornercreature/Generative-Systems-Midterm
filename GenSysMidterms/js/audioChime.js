// ============================================
// AUDIO CHIME GENERATOR
// ============================================
// Generates musical chimes based on color palette using Web Audio API
// Maps color properties to sound characteristics

/**
 * Maps a color to a musical frequency
 * @param {Object} color - RGB color object
 * @returns {number} Frequency in Hz
 */
function colorToFrequency(color) {
    const hsv = rgbToHsv(color.r, color.g, color.b);

    // Map hue (0-360) to musical notes
    // Using pentatonic scale for pleasant harmonies
    const pentatonicRatios = [1, 9/8, 5/4, 3/2, 5/3]; // Major pentatonic intervals
    const baseFreq = 220; // A3 note

    // Map hue to scale degree
    const scaleDegree = Math.floor((hsv.h / 360) * 12); // 12 chromatic steps
    const octave = Math.floor(scaleDegree / 5);
    const note = scaleDegree % 5;

    // Calculate frequency
    const frequency = baseFreq * pentatonicRatios[note] * Math.pow(2, octave);

    return frequency;
}

/**
 * Maps color saturation to volume
 * @param {Object} color - RGB color object
 * @returns {number} Gain value (0-1)
 */
function colorToVolume(color) {
    const hsv = rgbToHsv(color.r, color.g, color.b);
    // Higher saturation = louder
    // Map 0-100 saturation to 0.1-0.4 gain
    return 0.1 + (hsv.s / 100) * 0.3;
}

/**
 * Maps color brightness to wave shape
 * @param {Object} color - RGB color object
 * @returns {string} Oscillator type
 */
function colorToWaveType(color) {
    const hsv = rgbToHsv(color.r, color.g, color.b);

    // Bright colors = brighter wave types
    if (hsv.v > 70) return 'sine';      // Pure, bright
    if (hsv.v > 40) return 'triangle';  // Warm, medium
    return 'square';                     // Rich, dark
}

/**
 * Plays a musical chord based on the color palette
 * @param {Object} colorData - Color palette data
 * @param {Function} onNotePlay - Callback for each note (for visualization)
 * @returns {AudioContext} The audio context (for stopping later)
 */
function playColorChime(colorData, onNotePlay) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;
    const duration = 2.5; // Total duration in seconds

    const colors = [
        { color: colorData.background, name: 'Background', delay: 0 },
        { color: colorData.circle1, name: 'Circle 1', delay: 0.15 },
        { color: colorData.circle2, name: 'Circle 2', delay: 0.3 },
        { color: colorData.circle3, name: 'Circle 3', delay: 0.45 }
    ];

    const oscillators = [];

    colors.forEach((item, index) => {
        const frequency = colorToFrequency(item.color);
        const volume = colorToVolume(item.color);
        const waveType = colorToWaveType(item.color);

        // Create oscillator
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = waveType;
        oscillator.frequency.setValueAtTime(frequency, now + item.delay);

        // Envelope: fade in, sustain, fade out
        gainNode.gain.setValueAtTime(0, now + item.delay);
        gainNode.gain.linearRampToValueAtTime(volume, now + item.delay + 0.1); // Attack
        gainNode.gain.setValueAtTime(volume, now + item.delay + duration - 0.5); // Sustain
        gainNode.gain.linearRampToValueAtTime(0, now + item.delay + duration); // Release

        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Start and stop
        oscillator.start(now + item.delay);
        oscillator.stop(now + item.delay + duration);

        oscillators.push(oscillator);

        // Callback for visualization
        if (onNotePlay) {
            setTimeout(() => {
                onNotePlay({
                    frequency,
                    volume,
                    waveType,
                    color: item.color,
                    name: item.name,
                    index
                });
            }, item.delay * 1000);
        }
    });

    return { audioContext, oscillators };
}

/**
 * Analyzes the color palette to get audio characteristics
 * (Useful for displaying info to user)
 * @param {Object} colorData - Color palette data
 * @returns {Array} Array of audio characteristics for each color
 */
function analyzeColorAudio(colorData) {
    const colors = [
        { color: colorData.background, name: 'Background' },
        { color: colorData.circle1, name: 'Circle 1' },
        { color: colorData.circle2, name: 'Circle 2' },
        { color: colorData.circle3, name: 'Circle 3' }
    ];

    return colors.map(item => ({
        name: item.name,
        frequency: Math.round(colorToFrequency(item.color)),
        volume: Math.round(colorToVolume(item.color) * 100),
        waveType: colorToWaveType(item.color),
        color: item.color
    }));
}
