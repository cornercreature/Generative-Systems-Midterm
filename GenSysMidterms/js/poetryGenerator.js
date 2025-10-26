// ============================================
// POETRY GENERATOR
// ============================================
// Generates emotionally-charged concrete poetry based on color palettes
// Uses Claude API with dynamic tone adjustment based on palette characteristics

/**
 * Analyzes color palette to determine poetry tone and style
 * @param {Object} colorData - Color palette data
 * @returns {Object} Analysis with brightness, saturation, variety, and tone descriptors
 */
function analyzePaletteTone(colorData) {
    const colors = [
        colorData.background,
        colorData.circle1,
        colorData.circle2,
        colorData.circle3
    ];

    // Calculate mean brightness (HSV value)
    let totalBrightness = 0;
    let totalSaturation = 0;
    const hues = [];

    colors.forEach(color => {
        const hsv = rgbToHsv(color.r, color.g, color.b);
        totalBrightness += hsv.v;
        totalSaturation += hsv.s;
        hues.push(hsv.h);
    });

    const meanBrightness = totalBrightness / colors.length;
    const meanSaturation = totalSaturation / colors.length;

    // Calculate hue variety (standard deviation of hues)
    const meanHue = hues.reduce((a, b) => a + b, 0) / hues.length;
    const hueVariance = hues.reduce((sum, h) => sum + Math.pow(h - meanHue, 2), 0) / hues.length;
    const hueVariety = Math.sqrt(hueVariance);

    // Determine emotional intensity based on saturation
    let emotionalIntensity;
    if (meanSaturation > 60) {
        emotionalIntensity = 'intense';
    } else if (meanSaturation > 30) {
        emotionalIntensity = 'moderate';
    } else {
        emotionalIntensity = 'subdued';
    }

    // Determine abstraction level based on hue variety
    let abstractionLevel;
    if (hueVariety > 80) {
        abstractionLevel = 'highly abstract';
    } else if (hueVariety > 40) {
        abstractionLevel = 'moderately abstract';
    } else {
        abstractionLevel = 'clear and contemplative';
    }

    // Determine overall tone based on brightness
    let tonalQuality;
    if (meanBrightness > 70) {
        tonalQuality = 'bright and energetic';
    } else if (meanBrightness > 40) {
        tonalQuality = 'balanced and thoughtful';
    } else {
        tonalQuality = 'dark and introspective';
    }

    return {
        meanBrightness,
        meanSaturation,
        hueVariety,
        emotionalIntensity,
        abstractionLevel,
        tonalQuality
    };
}

/**
 * Builds the prompt for Claude API based on color data and analysis
 * @param {Object} colorData - Color palette data
 * @param {Object} analysis - Palette tone analysis
 * @returns {string} Formatted prompt for Claude
 */
function buildPoetryPrompt(colorData, analysis) {
    const colors = [
        { name: 'Background', ...colorData.background },
        { name: 'Circle One', ...colorData.circle1 },
        { name: 'Circle Two', ...colorData.circle2 },
        { name: 'Circle Three', ...colorData.circle3 }
    ];

    // Build color descriptions
    const colorDescriptions = colors.map(c => {
        const hex = rgbToHex(c.r, c.g, c.b);
        const hsv = rgbToHsv(c.r, c.g, c.b);
        return `${c.name}: ${hex} (Hue: ${hsv.h}°, Saturation: ${hsv.s}%, Brightness: ${hsv.v}%)`;
    }).join('\n');

    // Build dynamic tone instructions
    const toneInstructions = `
The poem should be:
- Emotional Intensity: ${analysis.emotionalIntensity} (saturation level: ${Math.round(analysis.meanSaturation)}%)
- Style: ${analysis.abstractionLevel} (color variety: ${Math.round(analysis.hueVariety)}° hue variance)
- Tone: ${analysis.tonalQuality} (brightness: ${Math.round(analysis.meanBrightness)}%)

Guidelines:
- If emotionally intense: use vivid, passionate language and strong imagery
- If emotionally subdued: use gentle, contemplative, quiet language
- If highly abstract: use experimental, fragmented, unexpected connections
- If clear/contemplative: use direct, accessible imagery with cohesive themes
    `.trim();

    return `You are a concrete poet, creating experimental visual poetry where the arrangement of text on the page is as important as the words themselves.

Given this color palette:
${colorDescriptions}

${toneInstructions}

Create a concrete poem (20-30 lines) that captures the emotional and aesthetic essence of this palette. The poem should:
1. Form GEOMETRIC SHAPES with the text - circles, triangles, waves, spirals, diamonds, or abstract forms
2. Use extreme horizontal spacing - words should be spread dramatically across the full width (80-120 characters wide)
3. Create visual movement through shape - the text should flow, expand, contract, or radiate
4. Let the shape reflect the emotional content - angular shapes for intensity, curves for softness, scattered for chaos
5. Reflect the colors' emotional resonance without directly naming them
6. Match the specified tone and intensity
7. Think sculptural and architectural - build the poem as a visual monument
8. INTEGRATE UNICODE GLYPHS AND SYMBOLS throughout the poem - use characters like ◆ ● ○ ◉ ◊ ▲ ▼ ◀ ▶ ★ ✦ ✧ ⬡ ⬢ ⬣ ▢ ▣ ▤ ▥ ▦ ▧ ▨ ▩ ◐ ◑ ◒ ◓ ◔ ◕ ✱ ✲ ✳ ✴ ✵ ✶ ✷ ✸ ✹ ⊕ ⊗ ⊙ ⊚ ⊛ ⊜ ⊝ ⊞ ~ · • ∘ ∙ ○ ◌ ◍ ◎ ● ◐ ◑ and other decorative or geometric symbols
9. Mix words and glyphs naturally - glyphs can punctuate, frame, or replace words, creating a hybrid visual-textual experience

CRITICAL FORMATTING INSTRUCTIONS:
- Use 50-100+ spaces between words AND glyphs to create wide, expansive layouts
- Build recognizable shapes: start narrow, expand wide, contract again (like a diamond)
- Or create waves, spirals, cascades using strategic indentation and spacing
- Each line can be dramatically different in width and position
- Think of the page as a canvas - use the FULL horizontal and vertical space
- Scatter glyphs strategically to enhance the visual shape and rhythm
- Let glyphs echo or amplify the emotional tone (e.g., ◆ for sharpness, ○ for softness, ★ for brightness)

Example shape concepts:
- Expanding/contracting (diamond, hourglass)
- Circular/spiral patterns
- Wave forms (crescendo and decrescendo)
- Diagonal cascades or staircases
- Radiating outward from center
- Asymmetric, organic forms

Return ONLY the poem with its visual formatting (using spaces and line breaks). No explanations, titles, or metadata.`;
}

/**
 * Generates poetry using Claude API
 * @param {Object} colorData - Color palette data
 * @returns {Promise<string>} Generated poem text
 */
async function generatePoem(colorData) {
    // Analyze palette characteristics
    const analysis = analyzePaletteTone(colorData);

    // Build prompt with dynamic tone
    const prompt = buildPoetryPrompt(colorData, analysis);

    try {
        // Call our backend proxy server instead of Claude API directly
        const response = await fetch('http://localhost:3000/api/generate-poem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                colorData: colorData,
                prompt: prompt
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Server error: ${errorData.error || 'Unknown error'}`);
        }

        const data = await response.json();
        const poemText = data.poem;

        return poemText;

    } catch (error) {
        console.error('Error generating poetry:', error);
        throw error;
    }
}

/**
 * Displays poem in the modal with loading state
 * @param {Object} colorData - Color palette data
 */
async function displayPoem(colorData) {
    console.log('displayPoem called with colorData:', colorData);
    const poemContainer = document.querySelector('.poem-section');

    if (!poemContainer) {
        console.error('Poem container not found!');
        return;
    }

    console.log('Poem container found, setting loading state...');
    // Show loading state
    poemContainer.innerHTML = '<p class="poem-loading">interpreting...</p>';

    try {
        console.log('Calling generatePoem...');
        const poem = await generatePoem(colorData);
        console.log('Poem generated successfully:', poem.substring(0, 50) + '...');

        // Display the poem
        poemContainer.innerHTML = `<pre class="poem-text">${poem}</pre>`;

    } catch (error) {
        console.error('Failed to generate poem:', error);

        let errorMessage = 'Unable to generate poem at this time.';
        if (error.message.includes('API request failed')) {
            errorMessage += ' Please check your API connection.';
        } else if (error.message.includes('Server error')) {
            errorMessage += ' Server error: ' + error.message;
        }

        poemContainer.innerHTML = `<p class="poem-error">${errorMessage}<br><small>${error.message}</small></p>`;
    }
}
