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

    const [posX, posY] = getPos(e)

    startX = posX
    startY = posY
    offsetX = 0
    offsetY = 0
    currentX = 0
    currentY = 0
}

/**
 * Handles what should happen on mouse button up
 * @param {MouseEvent} e - mouse event
 */
export function onDrop(e) {
    isMoving = false

    sourceX = currentX
    sourceY = currentY
}

/**
 * Handles what should happen on mouse leaving map area
 */
export function onLeave(e) {
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

    const [posX, posY] = getPos(e)

    offsetX = posX- startX
    offsetY = posY - startY

    currentX = sourceX + offsetX
    currentY = sourceY + offsetY

    if (![null, undefined].includes(svg))
        svg.setAttribute(
            'transform', 
            `translate(${currentX}, ${currentY})`
        )
}

/**
 * Get position of the mouse cursor or touch cursor
 * @param {MouseEvent} e 
 * @returns x and y coordinates in an array
 */
function getPos(e) {
    return [
        e?.touches?.[0]?.pageX ?? e?.layerX,
        e?.touches?.[0]?.pageY ?? e?.layerY,
    ]
}