// ============================================
// BACKEND PROXY SERVER FOR CLAUDE API
// ============================================
// This server acts as a proxy between the frontend and Claude API
// to avoid CORS issues and keep the API key secure

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Parse JSON request bodies

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'Server is running',
        message: 'Color Picker Poetry API Proxy'
    });
});

// Poem generation endpoint
app.post('/api/generate-poem', async (req, res) => {
    try {
        const { colorData, prompt } = req.body;

        // Validate request
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Check if API key is configured
        const apiKey = process.env.CLAUDE_API_KEY;
        if (!apiKey || apiKey === 'sk-ant-api03-YOUR-KEY-HERE') {
            return res.status(500).json({
                error: 'API key not configured. Please set CLAUDE_API_KEY in server/.env file'
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
        res.json({
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
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║  Color Picker Proxy Server Running    ║
╚════════════════════════════════════════╝

Server: http://localhost:${PORT}
Status: Ready to generate poetry!

Available endpoints:
  GET  /              - Health check
  POST /api/generate-poem - Generate poem

Press Ctrl+C to stop the server
    `);
});
