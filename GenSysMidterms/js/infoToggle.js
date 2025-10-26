// ============================================
// INFO HEADER TOGGLE
// ============================================
// Handles collapsing/expanding the info header

/**
 * Initializes the info header toggle functionality
 */
function initInfoToggle() {
    const toggleBtn = document.getElementById('infoToggleBtn');
    const infoHeader = document.querySelector('.info-header');

    if (toggleBtn && infoHeader) {
        toggleBtn.addEventListener('click', () => {
            infoHeader.classList.toggle('collapsed');
        });
    }
}
