// ============================================
// MAIN APPLICATION
// Orchestrates initialization of all controllers
// ============================================

/**
 * Initializes the entire application
 * Called when DOM is fully loaded
 */
function initApp() {
    // Initialize all controllers in order
    initBackgroundController();
    initCircleController();
    initCircleInteraction();
    initBlurController();
    initUIControls();

    console.log('Color Picker App initialized successfully!');
}

// Wait for DOM to be fully loaded before initializing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM is already loaded
    initApp();
}
