// ============================================
// VERCEL SERVERLESS FUNCTION FOR POEM GENERATION
// ============================================
// This serverless function acts as a proxy between the frontend and Claude API

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { colorData, prompt } = req.body;

        // Validate request
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Get API key from environment variable
        const apiKey = process.env.CLAUDE_API_KEY;
        if (!apiKey) {
            return res.status(500).json({
                error: 'API key not configured. Please set CLAUDE_API_KEY in Vercel environment variables'
            });
        }

        console.log('Generating poem for color palette...');

        // Call Claude API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 1024,
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            })
        });

        // Check if request was successful
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Claude API Error:', errorData);
            return res.status(response.status).json({
                error: `Claude API error: ${errorData.error?.message || 'Unknown error'}`
            });
        }

        const data = await response.json();
        const poemText = data.content[0].text;

        console.log('Poem generated successfully');

        // Return the poem to the frontend
        res.status(200).json({
            poem: poemText,
            success: true
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
