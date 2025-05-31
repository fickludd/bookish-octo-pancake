/**
 * Utility functions for transforming coordinates between screen space and canvas space
 */

/**
 * Convert screen coordinates to canvas coordinates
 * @param {number} screenX - X coordinate in screen space (top-left origin)
 * @param {number} screenY - Y coordinate in screen space (top-left origin)
 * @param {number} viewportWidth - Width of the viewport (container)
 * @param {number} viewportHeight - Height of the viewport (container)
 * @param {number} canvasWidth - Width of the canvas
 * @param {number} canvasHeight - Height of the canvas
 * @param {number} zoom - Current zoom level
 * @param {{x: number, y: number}} pan - Current pan offset
 * @returns {{x: number, y: number}} Coordinates in canvas space (top-left origin)
 */
export function screenToCanvas(screenX, screenY, viewportWidth, viewportHeight, canvasWidth, canvasHeight, zoom, pan) {
    // 1. Convert screen coordinates to center-origin coordinates (using viewport size)
    const viewportCenterX = viewportWidth / 2;
    const viewportCenterY = viewportHeight / 2;
    const centeredScreenX = screenX - viewportCenterX;
    const centeredScreenY = screenY - viewportCenterY;

    // 2. Remove zoom scaling
    const unzoomedX = centeredScreenX / zoom;
    const unzoomedY = centeredScreenY / zoom;

    // 3. Remove pan offset
    const unzoomedUnpannedX = unzoomedX - pan.x;
    const unzoomedUnpannedY = unzoomedY - pan.y;

    // 4. Convert to canvas coordinates (using canvas size)
    const canvasCenterX = canvasWidth / 2;
    const canvasCenterY = canvasHeight / 2;
    return {
        x: unzoomedUnpannedX + canvasCenterX,
        y: unzoomedUnpannedY + canvasCenterY
    };
}

/**
 * Convert canvas coordinates to screen coordinates
 * @param {number} canvasX - X coordinate in canvas space (top-left origin)
 * @param {number} canvasY - Y coordinate in canvas space (top-left origin)
 * @param {number} viewportWidth - Width of the viewport (container)
 * @param {number} viewportHeight - Height of the viewport (container)
 * @param {number} canvasWidth - Width of the canvas
 * @param {number} canvasHeight - Height of the canvas
 * @param {number} zoom - Current zoom level
 * @param {{x: number, y: number}} pan - Current pan offset
 * @returns {{x: number, y: number}} Coordinates in screen space (top-left origin)
 */
export function canvasToScreen(canvasX, canvasY, viewportWidth, viewportHeight, canvasWidth, canvasHeight, zoom, pan) {
    // 1. Convert canvas coordinates to center-origin coordinates (using canvas size)
    const canvasCenterX = canvasWidth / 2;
    const canvasCenterY = canvasHeight / 2;
    const centeredCanvasX = canvasX - canvasCenterX;
    const centeredCanvasY = canvasY - canvasCenterY;

    // 2. Apply pan offset
    const pannedX = centeredCanvasX + pan.x;
    const pannedY = centeredCanvasY + pan.y;

    // 3. Apply zoom scaling
    const zoomedX = pannedX * zoom;
    const zoomedY = pannedY * zoom;

    // 4. Convert to screen coordinates (using viewport size)
    const viewportCenterX = viewportWidth / 2;
    const viewportCenterY = viewportHeight / 2;
    return {
        x: zoomedX + viewportCenterX,
        y: zoomedY + viewportCenterY
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