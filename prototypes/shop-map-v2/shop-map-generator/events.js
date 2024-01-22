let isMoving = false
let startX = 0
let startY = 0
let offsetX = 0
let offsetY = 0
let currentX = 0
let currentY = 0
let sourceX = 0
let sourceY = 0


/**
 * Handles what should happen on mouse button down
 * @param {MouseEvent} e - mouse event
 */
export function onGrab(e) {
    isMoving = true
    reset(e)
}

/**
 * Handles what should happen on mouse button up
 * @param {MouseEvent} e - mouse event
 */
export function onDrop(e) {
    onLeave()
    reset(e)
}

/**
 * Handles what should happen on mouse leaving map area
 */
export function onLeave() {
    isMoving = false
    sourceX = currentX
    sourceY = currentY
}

/**
 * Handles what should happen on mouse being moved in the area
 * @param {MouseEvent} e - mouse event
 * @param {} svg - SVG HTML element
 */
export function onMove(e, svg) {
    if (!isMoving)
        return

    offsetX = e.layerX - startX
    offsetY = e.layerY - startY

    currentX = sourceX + offsetX
    currentY = sourceY + offsetY

    if (![null, undefined].includes(svg))
        svg.setAttribute(
            'transform', 
            `translate(${currentX}, ${currentY})`
        )
}

/**
 * Resets data for movement
 * @param {MouseEvent} e - mouse event
 */
export function reset(e) {
    startX = e.layerX
    startY = e.layerY
    offsetX = 0
    offsetY = 0
    currentX = 0
    currentY = 0
}