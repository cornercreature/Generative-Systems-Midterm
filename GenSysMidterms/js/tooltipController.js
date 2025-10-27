// ============================================
// TOOLTIP CONTROLLER
// ============================================
// Handles mouse-following tooltips for interactive elements

let tooltipElement = null;

/**
 * Creates and returns the tooltip DOM element
 * @returns {HTMLElement} Tooltip element
 */
function createTooltipElement() {
    const tooltip = document.createElement('div');
    tooltip.className = 'mouse-tooltip';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);
    return tooltip;
}

/**
 * Shows tooltip at mouse position
 * @param {MouseEvent} e - Mouse event
 * @param {string} text - Tooltip text content
 * @param {HTMLElement} element - Element being hovered
 */
function showTooltip(e, text, element) {
    if (!tooltipElement) {
        tooltipElement = createTooltipElement();
    }

    tooltipElement.textContent = text;
    tooltipElement.style.display = 'block';
    updateTooltipPosition(e, element);
}

/**
 * Updates tooltip position to follow mouse
 * @param {MouseEvent} e - Mouse event
 * @param {HTMLElement} element - Element being hovered
 */
function updateTooltipPosition(e, element) {
    if (!tooltipElement || tooltipElement.style.display === 'none') return;

    const tooltipWidth = tooltipElement.offsetWidth;
    const offsetX = 15; // Distance from cursor
    const offsetY = 15; // Below cursor

    // Check if element is in the left column (.controls) or is the scroll indicator
    const isInLeftColumn = element.closest('.controls');
    const isScrollIndicator = element.classList.contains('scroll-indicator');

    if (isInLeftColumn || isScrollIndicator) {
        // Position tooltip to the right of cursor for left column and scroll indicator
        tooltipElement.style.left = (e.clientX + offsetX) + 'px';
    } else {
        // Position tooltip to the left of cursor for other elements
        tooltipElement.style.left = (e.clientX - tooltipWidth - offsetX) + 'px';
    }

    tooltipElement.style.top = (e.clientY + offsetY) + 'px';
}

/**
 * Hides the tooltip
 */
function hideTooltip() {
    if (tooltipElement) {
        tooltipElement.style.display = 'none';
    }
}

/**
 * Initializes tooltips for all elements with data-tooltip attribute
 */
function initTooltips() {
    const elementsWithTooltips = document.querySelectorAll('[data-tooltip]');

    elementsWithTooltips.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            // Read tooltip text dynamically each time to support dynamic changes
            const tooltipText = element.getAttribute('data-tooltip');
            showTooltip(e, tooltipText, element);
        });

        element.addEventListener('mousemove', (e) => {
            updateTooltipPosition(e, element);
        });

        element.addEventListener('mouseleave', () => {
            hideTooltip();
        });

        // Hide tooltip on interaction events
        element.addEventListener('mousedown', () => {
            hideTooltip();
        });

        element.addEventListener('click', () => {
            hideTooltip();
        });

        // For sliders and inputs
        element.addEventListener('input', () => {
            hideTooltip();
        });

        element.addEventListener('change', () => {
            hideTooltip();
        });
    });
}
