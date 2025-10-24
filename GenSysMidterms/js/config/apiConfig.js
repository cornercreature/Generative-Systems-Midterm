// ============================================
// API CONFIGURATION
// ============================================
// Centralized configuration for external API services
// IMPORTANT: In production, move API keys to environment variables
// or a backend service. Never commit API keys to version control.

/**
 * Get Claude API configuration
 * Priority order:
 * 1. Environment variable (if available)
 * 2. LocalStorage (for development)
 * 3. Prompt user to enter key
 * @returns {Object} API configuration object
 */
export function getClaudeConfig() {
    // Try to get from localStorage (development only)
    let apiKey = localStorage.getItem('CLAUDE_API_KEY');

    // If no API key found, show warning
    if (!apiKey) {
        console.warn('Claude API key not found. Poetry generation will fail.');
        console.info('To set your API key, run: localStorage.setItem("CLAUDE_API_KEY", "your-key-here")');
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
 * Set Claude API key in localStorage (development only)
 * @param {string} key - API key to store
 */
export function setClaudeApiKey(key) {
    localStorage.setItem('CLAUDE_API_KEY', key);
    console.log('API key stored successfully');
}
