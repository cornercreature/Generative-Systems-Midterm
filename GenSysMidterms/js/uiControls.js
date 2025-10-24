// ============================================
// UI CONTROLS
// Handles collapsible sections and other UI utilities
// ============================================

/**
 * Initializes collapsible section functionality
 */
function initCollapsibleSections() {
    const collapsibleHeaders = document.querySelectorAll('.collapsible-header');

    collapsibleHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const section = header.dataset.section;
            const content = document.getElementById(section + 'Content');

            // Toggle collapsed state
            header.classList.toggle('collapsed');
            content.classList.toggle('collapsed');
        });
    });
}

/**
 * Initializes all UI controls
 */
function initUIControls() {
    initCollapsibleSections();
}
