// ============================================
// SCROLL INDICATOR CONTROLLER
// ============================================
// Handles scroll-to-bottom/top toggle functionality for both columns

let isPointingDown = true; // Track the current state

/**
 * Scrolls both columns to their respective bottoms
 */
function scrollToBottom() {
    const controlsColumn = document.querySelector('.controls');
    const circleControlsColumn = document.querySelector('.circle-controls');

    if (controlsColumn) {
        controlsColumn.scrollTo({
            top: controlsColumn.scrollHeight,
            behavior: 'smooth'
        });
    }

    if (circleControlsColumn) {
        circleControlsColumn.scrollTo({
            top: circleControlsColumn.scrollHeight,
            behavior: 'smooth'
        });
    }
}

/**
 * Scrolls both columns to their respective tops
 */
function scrollToTop() {
    const controlsColumn = document.querySelector('.controls');
    const circleControlsColumn = document.querySelector('.circle-controls');

    if (controlsColumn) {
        controlsColumn.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    if (circleControlsColumn) {
        circleControlsColumn.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

/**
 * Toggles scroll direction and rotates arrow
 */
function toggleScroll() {
    const scrollIndicator = document.getElementById('scrollIndicator');
    const scrollArrow = scrollIndicator.querySelector('.scroll-arrow');

    // Stop the bounce animation after first use
    scrollIndicator.classList.add('used');

    if (isPointingDown) {
        // Scroll to bottom and rotate arrow up
        scrollToBottom();
        scrollArrow.style.transform = 'rotate(180deg)';
        isPointingDown = false;
    } else {
        // Scroll to top and rotate arrow down
        scrollToTop();
        scrollArrow.style.transform = 'rotate(0deg)';
        isPointingDown = true;
    }
}

/**
 * Initializes the scroll indicator button
 */
function initScrollIndicator() {
    const scrollIndicator = document.getElementById('scrollIndicator');

    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', toggleScroll);
    }
}
