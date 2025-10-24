// ============================================
// POETRY GENERATOR MODULE
// ============================================
// Generates concrete poetry from color palettes using Claude API

import { rgbToHex, rgbToHsv } from '../shared/colorConversions.js';
import { getClaudeConfig } from '../config/apiConfig.js';

/**
 * Generate poetic interpretation of color palette using Claude API
 * @param {Object} colorData - Object containing background and circle colors
 */
export async function generatePoetry(colorData) {
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
        const config = getClaudeConfig();

        if (!config.apiKey) {
            throw new Error('API key not configured');
        }

        const response = await fetch(config.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': config.apiKey,
                'anthropic-version': config.version
            },
            body: JSON.stringify({
                model: config.model,
                max_tokens: config.maxTokens,
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

        let errorMessage = 'Unable to generate poetic interpretation.';
        if (error.message === 'API key not configured') {
            errorMessage += ' Please set your Claude API key using: <code>localStorage.setItem("CLAUDE_API_KEY", "your-key-here")</code>';
        } else {
            errorMessage += ' Please check your API configuration.';
        }

        poetryContainer.innerHTML = `<p class="error">${errorMessage}</p>`;
    }
}
