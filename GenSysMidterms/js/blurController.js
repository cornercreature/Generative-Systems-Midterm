// ============================================
// BLUR CONTROLLER
// Handles Gaussian blur controls for circles
// ============================================

// Blur control elements
const blurTargetButtons = document.querySelectorAll('.blur-target-btn');
const blurSlider = document.getElementById('blurSlider');
const blurValue = document.getElementById('blurValue');

// Blur state variables
let currentBlurTarget = 2; // 2 or 3
let circleTwoBlur = 2;
let circleThreeBlur = 2;

/**
 * Switches the blur target circle
 * @param {number} target - Target circle (2 or 3)
 */
function switchBlurTarget(target) {
    currentBlurTarget = target;

    // Update button active states
    blurTargetButtons.forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.blurCircle) === target);
    });

    // Update slider to show current target's blur value
    if (target === 2) {
        blurSlider.value = circleTwoBlur;
        blurValue.textContent = circleTwoBlur + 'px';
    } else if (target === 3) {
        blurSlider.value = circleThreeBlur;
        blurValue.textContent = circleThreeBlur + 'px';
    }
}

/**
 * Updates blur amount for the selected circle
 */
function updateBlur() {
    const blurAmount = parseFloat(blurSlider.value);
    blurValue.textContent = blurAmount + 'px';

    // Update the appropriate circle's blur based on current target
    if (currentBlurTarget === 2) {
        circleTwoBlur = blurAmount;
    } else if (currentBlurTarget === 3) {
        circleThreeBlur = blurAmount;
    }

    // Apply blur filters - circleThree needs to counteract circleTwo's blur
    circleTwo.style.filter = `blur(${circleTwoBlur}px)`;
    // CircleThree: since it's inside circleTwo, we only apply its own blur
    // The parent's blur will affect it, so we just set its independent blur
    circleThree.style.filter = `blur(${circleThreeBlur}px)`;
}

/**
 * Initializes blur controller with event listeners
 */
function initBlurController() {
    // Blur target switching
    blurTargetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetCircle = parseInt(btn.dataset.blurCircle);
            switchBlurTarget(targetCircle);
        });
    });

    // Blur slider event listener
    blurSlider.addEventListener('input', updateBlur);
}
