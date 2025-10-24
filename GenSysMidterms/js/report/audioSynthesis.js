// ============================================
// AUDIO SYNTHESIS MODULE
// ============================================
// Converts color palettes to musical chords using Web Audio API

import { rgbToHsv } from '../shared/colorConversions.js';

/**
 * Play a harmonic chord based on color palette
 * Maps color hue to frequency and brightness to volume
 * @param {Array} colors - Array of color objects with r, g, b properties
 */
export function playColorChord(colors) {
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
