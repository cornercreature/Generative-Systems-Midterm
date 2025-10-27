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

/**
 * Exports the color chime as a WAV audio file
 * @param {Object} colorData - Color palette data
 */
function exportColorChime(colorData) {
    // Create offline audio context for rendering
    const sampleRate = 44100;
    const duration = 3.5; // Slightly longer to capture full fade out
    const offlineContext = new OfflineAudioContext(1, sampleRate * duration, sampleRate);

    const now = offlineContext.currentTime;
    const noteDuration = 2.5;

    const colors = [
        { color: colorData.background, name: 'Background', delay: 0 },
        { color: colorData.circle1, name: 'Circle 1', delay: 0.15 },
        { color: colorData.circle2, name: 'Circle 2', delay: 0.3 },
        { color: colorData.circle3, name: 'Circle 3', delay: 0.45 }
    ];

    colors.forEach((item) => {
        const frequency = colorToFrequency(item.color);
        const volume = colorToVolume(item.color);
        const waveType = colorToWaveType(item.color);

        // Create oscillator
        const oscillator = offlineContext.createOscillator();
        const gainNode = offlineContext.createGain();

        oscillator.type = waveType;
        oscillator.frequency.setValueAtTime(frequency, now + item.delay);

        // Envelope: fade in, sustain, fade out
        gainNode.gain.setValueAtTime(0, now + item.delay);
        gainNode.gain.linearRampToValueAtTime(volume, now + item.delay + 0.1);
        gainNode.gain.setValueAtTime(volume, now + item.delay + noteDuration - 0.5);
        gainNode.gain.linearRampToValueAtTime(0, now + item.delay + noteDuration);

        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(offlineContext.destination);

        // Start and stop
        oscillator.start(now + item.delay);
        oscillator.stop(now + item.delay + noteDuration);
    });

    // Render the audio
    offlineContext.startRendering().then(renderedBuffer => {
        // Convert AudioBuffer to WAV
        const wav = audioBufferToWav(renderedBuffer);
        const blob = new Blob([wav], { type: 'audio/wav' });

        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'color-chime.wav';
        a.click();

        // Clean up
        URL.revokeObjectURL(url);
    }).catch(error => {
        console.error('Error exporting chime:', error);
    });
}

/**
 * Converts an AudioBuffer to WAV format
 * @param {AudioBuffer} buffer - The audio buffer to convert
 * @returns {ArrayBuffer} WAV file data
 */
function audioBufferToWav(buffer) {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;

    const data = buffer.getChannelData(0);
    const dataLength = data.length * bytesPerSample;
    const bufferLength = 44 + dataLength;

    const arrayBuffer = new ArrayBuffer(bufferLength);
    const view = new DataView(arrayBuffer);

    // Write WAV header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // fmt chunk size
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(view, 36, 'data');
    view.setUint32(40, dataLength, true);

    // Write audio data
    let offset = 44;
    for (let i = 0; i < data.length; i++) {
        const sample = Math.max(-1, Math.min(1, data[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
    }

    return arrayBuffer;
}

/**
 * Helper function to write strings to DataView
 * @param {DataView} view - The DataView to write to
 * @param {number} offset - Byte offset
 * @param {string} string - String to write
 */
function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}
