// ============================================
// API CONFIGURATION
// ============================================
// Centralized configuration for Claude API
// API key is stored in browser localStorage for security

/**
 * Get Claude API configuration
 * @returns {Object} API configuration object
 */
function getClaudeConfig() {
    // Retrieve API key from localStorage
    const apiKey = localStorage.getItem('CLAUDE_API_KEY');

    if (!apiKey) {
        console.warn('⚠️ Claude API key not found in localStorage.');
        console.info('To set your API key, open the browser console and run:');
        console.info('localStorage.setItem("CLAUDE_API_KEY", "your-api-key-here")');
    }

    return {
        apiKey: apiKey,
        endpoint: 'https://api.anthropic.com/v1/messages',
        model: 'claude-3-5-sonnet-20241022',
        version: '2023-06-01',
        maxTokens: 1024
    };
}

/**
 * Helper function to set API key in localStorage
 * Call this from browser console: setClaudeApiKey('your-key-here')
 * @param {string} key - Your Claude API key
 */
function setClaudeApiKey(key) {
    localStorage.setItem('CLAUDE_API_KEY', key);
    console.log('✅ API key saved successfully to localStorage');
    console.log('You can now use the poetry generation feature!');
}
