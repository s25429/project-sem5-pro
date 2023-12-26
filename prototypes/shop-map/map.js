const map = {
    data: {
        container: null,
        svg: null,
        isMoving: false,
        startX: 0,
        startY: 0,
        offsetX: 0,
        offsetY: 0,
        currentX: 0,
        currentY: 0,
        sourceX: 0,
        sourceY: 0,
    },
    /**
     * Resets data for movement
     * @param {MouseEvent} e 
     */
    reset(e) {
        this.data.startX = e.layerX
        this.data.startY = e.layerY
        this.data.offsetX = 0
        this.data.offsetY = 0
        this.data.currentX = 0
        this.data.currentY = 0
    },
    /**
     * Handles what should happen on mouse button down
     * @param {MouseEvent} e 
     */
    onGrab(e) {
        this.data.isMoving = true
        this.reset(e)
    },
    /**
     * Handles what should happen on mouse button up
     * @param {MouseEvent} e 
     */
    onDrop(e) {
        this.onLeave()
        this.reset(e)
    },
    /**
     * Handles what should happen on mouse leaving map area
     */
    onLeave() {
        this.data.isMoving = false
        this.data.sourceX = this.data.currentX
        this.data.sourceY = this.data.currentY
    },
    /**
     * Handles what should happen on mouse being moved in the area
     * @param {MouseEvent} e 
     */
    onMove(e) {
        if (!this.data.isMoving)
            return
    
        this.data.offsetX = e.layerX - this.data.startX
        this.data.offsetY = e.layerY - this.data.startY
    
        this.data.currentX = this.data.sourceX + this.data.offsetX
        this.data.currentY = this.data.sourceY + this.data.offsetY
    
        if (![null, undefined].includes(this.data.svg))
            this.data.svg.setAttribute(
                'transform', 
                `translate(${this.data.currentX}, ${this.data.currentY})`
            )
    }
}

/**
 * Creates an SVG map element and initializes event listeners. Ready out of the box.
 * Make sure to pass in the specs as map data received from the database.
 * @param {{ width?: number, height?: number, fill?: string, objects?: Array<{ id: number, category: string, tags: Array<string>, floor: string, x: number, y: number, width: number, height: number, fill: string }> }} specs - object that describes what map should render
 */
function createMap(specs) {
    const { container, svg } = createSvg(specs)

    map.data.container = container
    map.data.svg = svg

    map.data.container.addEventListener('mousedown', map.onGrab.bind(map))
    map.data.container.addEventListener('mouseup', map.onDrop.bind(map))
    map.data.container.addEventListener('mouseleave', map.onLeave.bind(map))
    map.data.container.addEventListener('mousemove', map.onMove.bind(map))
}

/**
 * Creates an SVG element with rectangles and appends it onto `.svg-container`.
 * @param {createMap.specs} data 
 * @returns objects pointing to nulls if there was an error creating or appending the svg 
 */
function createSvg(data) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('version', '1.1')
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

    const objectsPerGroup = groupBy(data.objects, 'group')

    // set some styling properties
    let totalWidth = 0  // width of widest group
    let totalHeight = 0 // height of all group including gaps and line height
    let groupOffset = 0 // used to offset drawing of next groups
    let groupGap = 10   // gap between groups
    let textOffset = -6 // vertical text offset
    let lineHeight = 20 // vertical space for text

    Object.entries(objectsPerGroup).forEach(([groupName, objs], index) => {
        const [strokeWidth, strokeHeight] = getContainedSize(objs)
        
        const strokeRect = createRect({ 
            x: 0, 
            y: groupOffset, 
            width: strokeWidth, 
            height: strokeHeight,
            strokeColor: 'black',
        })

        const map = createGroup({ attrs: { 'class': 'map-content' } })

        objs.forEach(obj => {
            map.appendChild(createRect({
                x: (obj?.x || 0) + 0,
                y: (obj?.y || 0) + groupOffset,
                width: obj?.width,
                height: obj?.height,
                fillColor: obj?.fill,
            }))
        })

        const text = createText({
            x: 0,
            y: groupOffset + textOffset,
            text: groupName,
            attrs: { 'class': 'map-group' }
        })

        groupOffset += strokeHeight + groupGap
        totalWidth = strokeWidth > totalWidth ? strokeWidth : totalWidth
        totalHeight += lineHeight + strokeHeight

        svg.appendChild(createGroup({
            attrs: {
                'data-group': groupName,
                'transform': `translate(0, ${lineHeight * (index + 1)})`,
            },
            children: [strokeRect, map, text],
        }))
    })

    svg.setAttribute('width', totalWidth)
    svg.setAttribute('height', totalHeight)

    return appendSvgToContainer(svg, data?.maxWidth, data?.maxHeight)
}

/**
 * Creates an SVG rect element
 * @param {{ x?: number, y?: number, width?: number, height?: number, fillColor?: string, strokeColor?: string, attrs:? { [key: string]: string } }} arg - type hint
 * @param x - horizontal position
 * @param y - vertical position
 * @param width - rect's width
 * @param height - rect's height
 * @param fillColor - rectangle's color, transparent if ommited
 * @param strokeColor - rectangle's border color, skipped if ommited
 * @param attrs - attributes to append
 */
function createRect({ x, y, width, height, fillColor, strokeColor, attrs }) {
    const rectEl = document.createElementNS('http://www.w3.org/2000/svg', 'rect')

    rectEl.setAttribute('x', x || 0)
    rectEl.setAttribute('y', y || 0)
    rectEl.setAttribute('width', width || 0)
    rectEl.setAttribute('height', height || 0)
    rectEl.setAttribute('fill', fillColor || 'none')
    rectEl.setAttribute('stroke', strokeColor || 'none')

    addAttrs(rectEl, attrs)

    return rectEl
}

/**
 * Creates an SVG text element
 * @param {{ x?: number, y?: number, text?: string, attrs?: { [key: string]: string } }} arg - type hint 
 * @param x - horizontal position
 * @param y - vertical position
 * @param text - text to display
 * @param attrs - attributes to append
 */
function createText({ x, y, text, attrs }) {
    const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text')

    textEl.setAttribute('x', x || 0)
    textEl.setAttribute('y', y || 0)
    textEl.textContent = text || ''

    addAttrs(textEl, attrs)

    return textEl
}

/**
 * Creates an SVG group element
 * @param {{ attrs?: { [key: string]: string }, children?: Element[] }} arg - type hint 
 * @param attrs - attributes to append
 * @param children - list of elements to append inside the group
 */
function createGroup({ attrs, children }) {
    const groupEl = document.createElementNS('http://www.w3.org/2000/svg', 'g')

    addAttrs(groupEl, attrs)

    if (children !== undefined)
        children.forEach(child => groupEl.appendChild(child))

    return groupEl
}

/**
 * Appends SVG element to a container if it is found
 * @param {SVGElement} svg - svg to append
 * @param {number} width - max width of the clipping container
 * @param {number} height - max height of the clipping container
 * @returns object with 'svg' and 'container' properties that are either null or objects of those elements
 */
function appendSvgToContainer(svg, width, height) {
    const container = document.querySelector('.svg-container')

    if (container === null) 
        return { container: null, svg: null }

    if (width !== undefined && height !== undefined)
        addAttrs(container, { 'style': `
            max-width: ${width || 200}px; 
            max-height: ${height || 200}px;
        ` })

    container.appendChild(svg)

    return { container, svg }
}

/**
 * Returns max width and height to contain all map objects without clipping
 * @param {createMap.specs.objects} objects - array of objects
 * @returns tuple containing max width and max height
 */
function getContainedSize(objects) {
    const getMax = (left, right, sum) => 
        ![left, right].includes(undefined) && left + right > sum
            ? left + right
            : sum

    let maxW = 0
    let maxH = 0

    objects.forEach(obj => {
        maxW = getMax(obj?.x, obj?.width, maxW)
        maxH = getMax(obj?.y, obj?.height, maxH)
    })

    return [maxW, maxH]
}

/**
 * Group arrays of objects by a certain property, does not modify objects in any way
 * @param {Array<{}>} array - array of objects
 * @param {string} key - property by which grouping should be processed
 * @returns object with [key] as grouping property which value is an array of objects grouped by that property
 */
function groupBy(array, key) {
    return array.reduce((acc, obj) => {
        (acc[obj[key]] = acc[obj[key]] || []).push(obj)
        return acc
    }, {})
}

/**
 * Modifies passed element by setting it attributes using 'setAttribute' method
 * @param {Element} el - element to be modified
 * @param {{ [key: string]: string }} attrs - object with attributes to set with setAttribute(key, value)
 */
function addAttrs(el, attrs) {
    if (attrs !== undefined)
        Object
            .entries(attrs)
            .forEach(([key, value]) => el.setAttribute(key, value))
}

export { createMap }
