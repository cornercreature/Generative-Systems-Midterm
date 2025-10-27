// ============================================
// CIRCLE INTERACTION CONTROLLER
// Handles circle size and position using the controller interface
// ============================================

const circleOneController = document.getElementById('circleOneController');
const circleTwoController = document.getElementById('circleTwoController');
const circleThreeController = document.getElementById('circleThreeController');

// Circle elements (defined in circleController.js but we need references here too)
// const circle = document.getElementById('circle');
// const circleTwo = document.getElementById('circleTwo');
// const circleThree = document.getElementById('circleThree');

// Controller state variables
let controllerOneActive = false;
let controllerTwoActive = false;
let controllerThreeActive = false;
let isDraggingControllerTwo = false;
let isDraggingControllerThree = false;

// Controller sizes (initial values match CSS)
let controllerOneSize = 200;
let controllerTwoSize = 150;
let controllerThreeSize = 50;

// Circle sizes (4:3:1 ratio matching controller circles)
let circleSize = 600;
let circleTwoSize = 450;  // 75% of circleSize
let circleThreeSize = 150; // 25% of circleSize

// Controller positions (relative to controllerOne's center)
let controllerTwoOffsetX = 0;
let controllerTwoOffsetY = 0;
let controllerThreeOffsetX = 0;
let controllerThreeOffsetY = 0;

// Drag offset for smooth dragging
let dragOffsetX = 0;
let dragOffsetY = 0;

/**
 * Updates center circles based on controller state
 */
function updateCirclesFromController() {
    // Calculate scale ratios
    const scaleRatioOne = circleSize / controllerOneSize;
    const scaleRatioTwo = circleTwoSize / controllerTwoSize;
    const scaleRatioThree = circleThreeSize / controllerThreeSize;

    // Update circle two position relative to circle one
    const circleTwoPosX = controllerTwoOffsetX * scaleRatioOne;
    const circleTwoPosY = controllerTwoOffsetY * scaleRatioOne;

    circleTwo.style.left = `calc(50% + ${circleTwoPosX}px)`;
    circleTwo.style.top = `calc(50% + ${circleTwoPosY}px)`;

    // Update circle three position relative to circle two
    const circleThreePosX = (controllerTwoOffsetX + controllerThreeOffsetX) * scaleRatioOne;
    const circleThreePosY = (controllerTwoOffsetY + controllerThreeOffsetY) * scaleRatioOne;

    circleThree.style.left = `calc(50% + ${circleThreePosX}px)`;
    circleThree.style.top = `calc(50% + ${circleThreePosY}px)`;
}

/**
 * Gets current circle positions and sizes for report generation
 * @returns {Object} Object containing sizes and positions of all circles
 */
function getCurrentCircleState() {
    return {
        sizes: {
            circle1: circleSize,
            circle2: circleTwoSize,
            circle3: circleThreeSize
        },
        positions: {
            circle1: { x: 0, y: 0 }, // Circle 1 is always centered
            circle2: {
                x: controllerTwoOffsetX * (circleSize / controllerOneSize),
                y: controllerTwoOffsetY * (circleSize / controllerOneSize)
            },
            circle3: {
                x: (controllerTwoOffsetX + controllerThreeOffsetX) * (circleSize / controllerOneSize),
                y: (controllerTwoOffsetY + controllerThreeOffsetY) * (circleSize / controllerOneSize)
            }
        }
    };
}

/**
 * Initializes circle interaction controller with event listeners
 */
function initCircleInteraction() {
    // CircleOneController: Click to activate, scroll to resize
    circleOneController.addEventListener('mousedown', (e) => {
        if (e.target === circleOneController) {
            controllerOneActive = !controllerOneActive;

            if (controllerOneActive) {
                circleOneController.classList.add('dragging');
                controllerTwoActive = false;
                controllerThreeActive = false;
                circleTwoController.classList.remove('dragging');
                circleThreeController.classList.remove('dragging');

                // Switch color control to circle 1
                switchCircleTarget(1);
            } else {
                circleOneController.classList.remove('dragging');
            }
            e.stopPropagation();
        }
    });

    // CircleTwoController: Click to activate, drag and scroll
    circleTwoController.addEventListener('mousedown', (e) => {
        if (e.target === circleTwoController) {
            if (!controllerTwoActive) {
                // Activate resize mode
                controllerTwoActive = true;
                circleTwoController.classList.add('dragging');
                controllerOneActive = false;
                controllerThreeActive = false;
                circleOneController.classList.remove('dragging');
                circleThreeController.classList.remove('dragging');

                // Switch color control to circle 2
                switchCircleTarget(2);
                // Auto-switch blur target to circle 2
                switchBlurTarget(2);
            } else {
                // Start dragging
                isDraggingControllerTwo = true;
                // Calculate offset from circle center for smooth dragging
                const rect = circleTwoController.getBoundingClientRect();
                dragOffsetX = e.clientX - (rect.left + rect.width / 2);
                dragOffsetY = e.clientY - (rect.top + rect.height / 2);
            }
            e.stopPropagation();
            e.preventDefault();
        }
    });

    // CircleThreeController: Click to activate, drag and scroll
    circleThreeController.addEventListener('mousedown', (e) => {
        if (!controllerThreeActive) {
            // Activate resize mode
            controllerThreeActive = true;
            circleThreeController.classList.add('dragging');
            controllerOneActive = false;
            controllerTwoActive = false;
            circleOneController.classList.remove('dragging');
            circleTwoController.classList.remove('dragging');

            // Switch color control to circle 3
            switchCircleTarget(3);
            // Auto-switch blur target to circle 3
            switchBlurTarget(3);
        } else {
            // Start dragging
            isDraggingControllerThree = true;
            // Calculate offset from circle center for smooth dragging
            const rect = circleThreeController.getBoundingClientRect();
            dragOffsetX = e.clientX - (rect.left + rect.width / 2);
            dragOffsetY = e.clientY - (rect.top + rect.height / 2);
        }
        e.stopPropagation();
        e.preventDefault();
    });

    // Deactivate controllers when clicking outside
    document.addEventListener('click', (e) => {
        const controllerContainer = document.querySelector('.circle-controller-container');
        if (!controllerContainer.contains(e.target)) {
            controllerOneActive = false;
            controllerTwoActive = false;
            controllerThreeActive = false;
            circleOneController.classList.remove('dragging');
            circleTwoController.classList.remove('dragging');
            circleThreeController.classList.remove('dragging');
        }
    });

    // Mouse move for dragging controllers
    document.addEventListener('mousemove', (e) => {
        if (isDraggingControllerTwo) {
            // Get the main container center (not circleOne, since they're now siblings)
            const containerRect = document.querySelector('.circle-controller-container').getBoundingClientRect();
            const containerCenterX = containerRect.left + containerRect.width / 2;
            const containerCenterY = containerRect.top + containerRect.height / 2;

            // Calculate new position
            let newX = e.clientX - dragOffsetX;
            let newY = e.clientY - dragOffsetY;

            // Calculate offset from center
            let offsetX = newX - containerCenterX;
            let offsetY = newY - containerCenterY;

            // Constrain within circleOneController bounds
            const maxDistance = (controllerOneSize / 2) - (controllerTwoSize / 2) - 5;
            const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

            if (distance > maxDistance) {
                const angle = Math.atan2(offsetY, offsetX);
                offsetX = Math.cos(angle) * maxDistance;
                offsetY = Math.sin(angle) * maxDistance;
            }

            controllerTwoOffsetX = offsetX;
            controllerTwoOffsetY = offsetY;

            // Update visual position
            circleTwoController.style.left = `calc(50% + ${offsetX}px)`;
            circleTwoController.style.top = `calc(50% + ${offsetY}px)`;

            // Update circle three's absolute position to maintain relative offset to circle two
            const circleThreeAbsoluteX = offsetX + controllerThreeOffsetX;
            const circleThreeAbsoluteY = offsetY + controllerThreeOffsetY;
            circleThreeController.style.left = `calc(50% + ${circleThreeAbsoluteX}px)`;
            circleThreeController.style.top = `calc(50% + ${circleThreeAbsoluteY}px)`;

            // Update center circles
            updateCirclesFromController();
        }

        if (isDraggingControllerThree) {
            // Get the main container center (since all circles are now siblings)
            const containerRect = document.querySelector('.circle-controller-container').getBoundingClientRect();
            const containerCenterX = containerRect.left + containerRect.width / 2;
            const containerCenterY = containerRect.top + containerRect.height / 2;

            // Calculate new position
            let newX = e.clientX - dragOffsetX;
            let newY = e.clientY - dragOffsetY;

            // Calculate offset from container center
            let offsetX = newX - containerCenterX;
            let offsetY = newY - containerCenterY;

            // Calculate the absolute position of circle three based on circle two's position
            // Circle three should be constrained relative to circle two's current position
            const circleTwoAbsoluteX = controllerTwoOffsetX;
            const circleTwoAbsoluteY = controllerTwoOffsetY;

            // Calculate relative offset from circle two
            let relativeX = offsetX - circleTwoAbsoluteX;
            let relativeY = offsetY - circleTwoAbsoluteY;

            // Constrain within circleTwoController bounds
            const maxDistance = (controllerTwoSize / 2) - (controllerThreeSize / 2) - 5;
            const distance = Math.sqrt(relativeX * relativeX + relativeY * relativeY);

            if (distance > maxDistance) {
                const angle = Math.atan2(relativeY, relativeX);
                relativeX = Math.cos(angle) * maxDistance;
                relativeY = Math.sin(angle) * maxDistance;
            }

            // Store the relative offset
            controllerThreeOffsetX = relativeX;
            controllerThreeOffsetY = relativeY;

            // Calculate absolute position for rendering
            const absoluteX = circleTwoAbsoluteX + relativeX;
            const absoluteY = circleTwoAbsoluteY + relativeY;

            // Update visual position
            circleThreeController.style.left = `calc(50% + ${absoluteX}px)`;
            circleThreeController.style.top = `calc(50% + ${absoluteY}px)`;

            // Update center circles
            updateCirclesFromController();
        }
    });

    // Mouse up to stop dragging
    document.addEventListener('mouseup', () => {
        isDraggingControllerTwo = false;
        isDraggingControllerThree = false;
    });

    // Scroll to resize controllers
    const controllerContainer = document.querySelector('.circle-controller-container');
    controllerContainer.addEventListener('wheel', (e) => {
        if (!controllerOneActive && !controllerTwoActive && !controllerThreeActive) return;

        e.preventDefault();
        e.stopPropagation();

        const scrollAmount = e.deltaY * 0.3;

        if (controllerOneActive) {
            // Resize controller one and circle one proportionally
            const oldSize = controllerOneSize;
            controllerOneSize -= scrollAmount;
            controllerOneSize = Math.max(100, Math.min(200, controllerOneSize));

            const scaleChange = controllerOneSize / oldSize;
            circleSize = Math.round(circleSize * scaleChange);
            circleSize = Math.max(200, Math.min(1000, circleSize));

            // Ensure nested controllers don't exceed parent
            if (controllerTwoSize > controllerOneSize - 20) {
                controllerTwoSize = controllerOneSize - 20;
                circleTwoController.style.width = controllerTwoSize + 'px';
                circleTwoController.style.height = controllerTwoSize + 'px';
            }

            circleOneController.style.width = controllerOneSize + 'px';
            circleOneController.style.height = controllerOneSize + 'px';
            circle.style.width = circleSize + 'px';
            circle.style.height = circleSize + 'px';
        }

        if (controllerTwoActive) {
            // Resize controller two and circle two proportionally
            const oldSize = controllerTwoSize;
            controllerTwoSize -= scrollAmount;
            controllerTwoSize = Math.max(50, Math.min(controllerOneSize - 20, controllerTwoSize));

            const scaleChange = controllerTwoSize / oldSize;
            circleTwoSize = Math.round(circleTwoSize * scaleChange);
            circleTwoSize = Math.max(120, Math.min(circleSize - 60, circleTwoSize));

            // Ensure nested controller doesn't exceed parent
            if (controllerThreeSize > controllerTwoSize - 20) {
                controllerThreeSize = controllerTwoSize - 20;
                circleThreeController.style.width = controllerThreeSize + 'px';
                circleThreeController.style.height = controllerThreeSize + 'px';
            }

            circleTwoController.style.width = controllerTwoSize + 'px';
            circleTwoController.style.height = controllerTwoSize + 'px';
            circleTwo.style.width = circleTwoSize + 'px';
            circleTwo.style.height = circleTwoSize + 'px';
        }

        if (controllerThreeActive) {
            // Resize controller three and circle three proportionally
            const oldSize = controllerThreeSize;
            controllerThreeSize -= scrollAmount;
            controllerThreeSize = Math.max(15, Math.min(controllerTwoSize - 20, controllerThreeSize));

            const scaleChange = controllerThreeSize / oldSize;
            circleThreeSize = Math.round(circleThreeSize * scaleChange);
            circleThreeSize = Math.max(55, Math.min(circleTwoSize - 60, circleThreeSize));

            circleThreeController.style.width = controllerThreeSize + 'px';
            circleThreeController.style.height = controllerThreeSize + 'px';
            circleThree.style.width = circleThreeSize + 'px';
            circleThree.style.height = circleThreeSize + 'px';
        }

        updateCirclesFromController();
    }, { passive: false });
}
