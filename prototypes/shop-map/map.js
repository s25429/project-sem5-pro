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

    const [w, h] = data?.objects && data.objects.length > 0 
        ? generateSvgSize(data.objects) 
        : [data?.width || 100, data?.height || 100]

    svg.setAttribute('version', '1.1')
    svg.setAttribute('width', w)
    svg.setAttribute('height', h)
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

    data?.objects?.forEach(obj => createRect(svg, {
        x: obj?.x || 0,
        y: obj?.y || 0,
        width: obj?.width || 0,
        height: obj?.height || 0,
        fill: obj?.fill || data?.fill || 0,
    }))

    const container = document.querySelector('.svg-container')

    if (container === null) 
        return { container: null, svg: null }

    container.appendChild(svg)
    return { container, svg }
}

/**
 * Creates rectangle elements for a specified SVG.
 * @param {SVGElement} svg - where to append the rect to
 * @param {{ x?: number, y?: number, width?: number, height?: number, fill?: string }} ...object - position, size and color for rect
 */
function createRect(svg, { x, y, width, height, fill }) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')

    rect.setAttribute('x', x)
    rect.setAttribute('y', y)
    rect.setAttribute('width', width )
    rect.setAttribute('height', height )
    rect.setAttribute('fill', fill)

    svg.appendChild(rect)
}

/**
 * Returns max width and height to contain all map objects without clipping
 * @param {createMap.specs.objects} objects - array of objects
 * @returns tuple containing max width and max height
 */
function generateSvgSize(objects) {
    const getMax = (left, right, sum) => 
        ![left, right].includes(undefined) && left + right > sum
            ? left + right
            : sum

    let maxW = 0
    let maxH = 0

    objects.forEach(obj => {
        maxW = getMax(obj.x, obj.width, maxW)
        maxH = getMax(obj.y, obj.height, maxH)
    })

    return [maxW, maxH]
}


export { createMap }
