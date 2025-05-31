/**
 * Utility functions for transforming coordinates between screen space and canvas space
 */

/**
 * Convert screen coordinates to canvas coordinates
 * @param {number} screenX - X coordinate in screen space
 * @param {number} screenY - Y coordinate in screen space
 * @param {number} canvasWidth - Width of the canvas
 * @param {number} canvasHeight - Height of the canvas
 * @param {number} zoom - Current zoom level
 * @param {{x: number, y: number}} pan - Current pan offset
 * @returns {{x: number, y: number}} Coordinates in canvas space
 */
export function screenToCanvas(screenX, screenY, zoom, pan) {
    // First remove the pan offset
    const xWithoutPan = screenX - pan.x;
    const yWithoutPan = screenY - pan.y;
    
    // Then remove the zoom scaling
    return {
        x: xWithoutPan / zoom,
        y: yWithoutPan / zoom
    };
}

/**
 * Convert canvas coordinates to screen coordinates
 * @param {number} canvasX - X coordinate in canvas space
 * @param {number} canvasY - Y coordinate in canvas space
 * @param {number} canvasWidth - Width of the canvas
 * @param {number} canvasHeight - Height of the canvas
 * @param {number} zoom - Current zoom level
 * @param {{x: number, y: number}} pan - Current pan offset
 * @returns {{x: number, y: number}} Coordinates in screen space
 */
export function canvasToScreen(canvasX, canvasY, zoom, pan) {
    // First apply zoom scaling
    const xWithZoom = canvasX * zoom;
    const yWithZoom = canvasY * zoom;
    
    // Then add the pan offset
    return {
        x: xWithZoom + pan.x,
        y: yWithZoom + pan.y
    };
}

/**
 * Calculate the screen-space movement for panning
 * @param {number} screenDeltaX - X movement in screen space
 * @param {number} screenDeltaY - Y movement in screen space
 * @param {number} zoom - Current zoom level
 * @returns {{x: number, y: number}} Movement in screen space
 */
export function calculatePanMovement(screenDeltaX, screenDeltaY, zoom) {
    return {
        x: screenDeltaX,
        y: screenDeltaY
    };
}

/**
 * Calculate the canvas-space movement for panning
 * @param {number} screenDeltaX - X movement in screen space
 * @param {number} screenDeltaY - Y movement in screen space
 * @param {number} zoom - Current zoom level
 * @returns {{x: number, y: number}} Movement in canvas space
 */
export function calculateCanvasPanMovement(screenDeltaX, screenDeltaY, zoom) {
    return {
        x: screenDeltaX / zoom,
        y: screenDeltaY / zoom
    };
} 