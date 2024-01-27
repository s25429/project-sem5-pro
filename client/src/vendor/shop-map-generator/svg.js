import { addAttrs } from './utils.js'


/**
 * Creates a simple SVG element template
 * @returns
 */
export function createSVG() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

    svg.setAttribute('version', '1.1')
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

    return svg
}

/**
 * Creates an SVG rect element
 * @param {{ x?: number, y?: number, width?: number, height?: number, fillColor?: string, strokeColor?: string, strokeWidth?: number, attrs?: { [key: string]: string } }} arg - type hint
 * @param x - horizontal position, default=0
 * @param y - vertical position, default=0
 * @param width - rect's width, default=0
 * @param height - rect's height, default=0
 * @param fillColor - rectangle's color, default=none
 * @param strokeColor - rectangle's border color, default=none
 * @param strokeWidth - rectangle's border width, default=0
 * @param attrs - attributes to append
 */
export function createRect({ x = 0, y = 0, width = 0, height = 0, fillColor = 'none', strokeColor = 'none', strokeWidth = 0, attrs }) {
    const rectEl = document.createElementNS('http://www.w3.org/2000/svg', 'rect')

    rectEl.setAttribute('x', x)
    rectEl.setAttribute('y', y)
    rectEl.setAttribute('width', width)
    rectEl.setAttribute('height', height)
    rectEl.setAttribute('fill', fillColor)
    rectEl.setAttribute('stroke', strokeColor)
    rectEl.setAttribute('stroke-width', strokeWidth)

    addAttrs(rectEl, attrs)

    return rectEl
}

/**
 * Creates an SVG path element that behaves like a rect element, but with rounded corners
 * @param {{ x?: number, y?: number, width?: number, height?: number, fillColor?: string, strokeColor?: string, strokeWidth?: number, radius?: number, attrs?: { [key: string]: string } }} arg - type hint
 * @param x - horizontal position, default=0
 * @param y - vertical position, default=0
 * @param width - rect's width, default=0
 * @param height - rect's height, default=0
 * @param fillColor - rectangle's color, default=none
 * @param strokeColor - rectangle's border color, default=none
 * @param strokeWidth - rectangle's border width, default=0
 * @param radius - radius of the rounded corners, default=0
 * @param attrs - attributes to append
 */
export function createRoundedRect({ x = 0, y = 0, width = 0, height = 0, fillColor = 'none', strokeColor = 'none', strokeWidth = 0, radius = 0, attrs }) {
    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')

    const newRadius = radius
    const newWidth = width - 2 * newRadius
    const newHeight = height - 2 * newRadius

    const path = {
        start: `M${x + newRadius},${y}`, // TODO: weird fix?
        end: `z`,
        line: {
            l: `h${newWidth}`,
            b: `v${newHeight}`,
            r: `h-${newWidth}`,
            t: `v-${newHeight}`,
        },
        corner: {
            bl: `a${newRadius},${newRadius} 0 0 1 ${newRadius},${newRadius}`,
            br: `a${newRadius},${newRadius} 0 0 1 -${newRadius},${newRadius}`,
            tr: `a${newRadius},${newRadius} 0 0 1 -${newRadius},-${newRadius}`,
            tl: `a${newRadius},${newRadius} 0 0 1 ${newRadius},-${newRadius}`,
        },
    }

    pathEl.setAttribute('d', `${path.start} ${path.line.l} ${path.corner.bl} ${path.line.b} ${path.corner.br} ${path.line.r} ${path.corner.tr} ${path.line.t} ${path.corner.tl} ${path.end}`)    
    pathEl.setAttribute('fill', fillColor)
    pathEl.setAttribute('stroke', strokeColor)
    pathEl.setAttribute('stroke-width', strokeWidth)

    addAttrs(pathEl, attrs)

    return pathEl
}

/**
 * Creates an SVG text element
 * @param {{ x?: number, y?: number, text?: string, attrs?: { [key: string]: string } }} arg - type hint 
 * @param x - horizontal position, default=0
 * @param y - vertical position, default=0
 * @param text - text to display, default=''
 * @param attrs - attributes to append
 */
export function createText({ x = 0, y = 0, text = '', attrs }) {
    const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text')

    textEl.setAttribute('x', x)
    textEl.setAttribute('y', y)
    textEl.textContent = text

    addAttrs(textEl, attrs)

    return textEl
}

/**
 * Creates an SVG group element
 * @param {{ attrs?: { [key: string]: string }, children?: Element[] }} arg - type hint 
 * @param attrs - attributes to append
 * @param children - list of elements to append inside the group
 */
export function createGroup({ attrs, children }) {
    const groupEl = document.createElementNS('http://www.w3.org/2000/svg', 'g')

    addAttrs(groupEl, attrs)

    if (children !== undefined)
        children.forEach(child => groupEl.appendChild(child))

    return groupEl
}

/**
 * Creates a definitions element that stores graphical definitions for later use, like filter effects
 * @param {{ attrs?: { [key: string]: string }, children?: Element[] }} arg - type hint 
 * @param attrs - attributes to append
 * @param children - list of elements to append inside the defs
 * @returns 
 */
export function createDefs({ attrs, children }) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')

    addAttrs(defs, attrs)

    if (children !== undefined)
        children.forEach(child => defs.appendChild(child))

    return defs
}

/**
 * Creates SVG Filter effect for drop shadow
 * @param {{ id: string, x?: string, y?: string, width?: string, height?: string, filterUnits?: 'userSpaceOnUse' | 'objectBoundingBox' }} arg - type hint 
 * @param id - unique identifier for filter
 * @param x - filter instance left position, default=0
 * @param y - filter instance top position, default=0
 * @param width - filter instance width, default=0
 * @param height - filter instance height, default=0
 * @param filterUnits - coordinate system for positional and size attributes, default=userSpaceOnUse
 * @returns 
 */
export function createDropShadowFilter({ id, x = '0', y = '0', width = '0', height = '0', filterUnits = 'userSpaceOnUse' }) {
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter')

    filter.setAttribute('id', id)
    filter.setAttribute('x', x)
    filter.setAttribute('y', y)
    filter.setAttribute('width', width)
    filter.setAttribute('height', height)
    filter.setAttribute('filterUnits', filterUnits)

    filter.appendChild(createGaussianBlurFilter({}))
    filter.appendChild(createOffsetFilter({ x: 5, y: 5 })) // TODO: change
    filter.appendChild(createOffsetFilter({ x: -5, y: -5 }))
    filter.appendChild(createNodeMergeFilter({}))

    return { id, filter }
}

/**
 * Creates SVG Gaussian blur filter effect
 * @param {{ source?: 'SourceGraphic' | 'SourceAlpha' | 'BackgroundImage' | 'BackgroundAlpha' | 'FillPaint' | 'StrokePaint', stdDeviation?: number }} arg - type hint
 * @param source - input for given filter primitive, default=SourceGraphic
 * @param stdDeviation - "strength" of blur, default=8
 * @returns 
 */
export function createGaussianBlurFilter({ source = 'SourceAlpha', stdDeviation = 8 }) {
    const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur')

    blur.setAttribute('in', source)
    blur.setAttribute('stdDeviation', stdDeviation)

    return blur
}

/**
 * Creates SVG offset filter effect
 * @param {{ x?: number, y?: number, result?: string }} arg - type hint
 * @param x - shift along the x axis, default=0
 * @param y - shift along the y axis, default=0
 * @param result - <missing official documentation>, default=offsetblur
 * @returns 
 */
export function createOffsetFilter({ x = 0, y = 0 , result = 'offsetblur' }) {
    const offset = document.createElementNS('http://www.w3.org/2000/svg', 'feOffset')

    // TODO: documentation gives in=SourceGraphic as an attribute - check results

    offset.setAttribute('dx', x)
    offset.setAttribute('dy', y)
    offset.setAttribute('result', result)

    return offset
}

/**
 * Creates SVG element that allows filter effects to be applied concurrently
 * @param {{ source?: 'SourceGraphic' | 'SourceAlpha' | 'BackgroundImage' | 'BackgroundAlpha' | 'FillPaint' | 'StrokePaint' }} arg - type hint 
 * @param source - input for filter primitives in merge nodes, default=SourceGraphic
 * @returns 
 */
export function createNodeMergeFilter({ source = 'SourceGraphic' }) {
    const merge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge')

    const mergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode')
    merge.appendChild(mergeNode1)

    const mergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode')
    mergeNode2.setAttribute('in', source)
    merge.appendChild(mergeNode2)

    const mergeNode3 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode')
    mergeNode3.setAttribute('in', source)
    merge.appendChild(mergeNode3)

    return merge
}