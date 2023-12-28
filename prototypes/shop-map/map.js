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
        
        console.log(e.layerX, e.layerY)
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

    const props = {
        totalSize: { x: 0, y: 0 },
        group: {
            offset: { x: 0, y: 0 },
            gap: { x: 0, y: 10 },
        },
        text: {
            offset: { x: 0, y: -6 },
            lineHeight: 20,
        },
    }

    const shadowFilter = createDropShadowFilter({
        id: 'f1',
        x: '-40%',
        y: '-40%',
        width: '180%',
        height: '180%',
    })
    svg.appendChild(createDefs({
        children: [shadowFilter.filter]
    }))

    const objectsPerGroup = groupBy(data?.objects || [], 'group')
    Object.entries(objectsPerGroup).forEach(([groupName, objs], index) => {
        const [strokeWidth, strokeHeight] = getContainedSize(objs)
        
        const strokeRect = createRect({ 
            x: props.group.offset.x, 
            y: props.group.offset.y, 
            width: strokeWidth, 
            height: strokeHeight,
            strokeColor: 'black',
            strokeWidth: 1,
        })

        const map = createGroup({ attrs: { 'class': 'map-content' } })

        objs.forEach(obj => {
            map.appendChild(
                // createRect({
                //     x: (obj?.x || 0) + props.group.offset.x,
                //     y: (obj?.y || 0) + props.group.offset.y,
                //     width: obj?.width,
                //     height: obj?.height,
                //     fillColor: obj?.fill || data?.fill,
                //     attrs: { 
                //         'data-category': obj?.category,
                //         'style': `filter: url(#${shadowFilter.id});`
                //     },
                // })
                createRoundedRect({
                    x: (obj?.x || 0) + props.group.offset.x,
                    y: (obj?.y || 0) + props.group.offset.y,
                    width: obj?.width,
                    height: obj?.height,
                    fillColor: obj?.fill || data?.fill,
                    radius: 8,
                    attrs: { 
                        'data-category': obj?.category,
                        'style': `filter: url(#${shadowFilter.id});`
                    },
                })
            )
        })

        const text = createText({
            x: 0,
            y: props.group.offset.y + props.text.offset.y,
            text: groupName,
            attrs: { 
                'class': 'map-group', 
                'font-size': '1rem' ,
            },
        })

        props.group.offset.y += strokeHeight + props.group.gap.y
        props.totalSize.x = strokeWidth > props.totalSize.x ? strokeWidth : props.totalSize.x
        props.totalSize.y += props.text.lineHeight + strokeHeight + props.group.gap.y // TODO: adds a gap for the last element as well

        svg.appendChild(createGroup({
            attrs: {
                'data-group': groupName,
                'transform': `translate(0, ${props.text.lineHeight * (index + 1)})`,
            },
            children: [strokeRect, map, text],
        }))
    })

    svg.setAttribute('width', props.totalSize.x)
    svg.setAttribute('height', props.totalSize.y)

    return appendSvgToContainer(svg, data?.maxWidth, data?.maxHeight)
}

/**
 * Creates an SVG rect element
 * @param {{ x?: number, y?: number, width?: number, height?: number, fillColor?: string, strokeColor?: string, strokeWidth?: number, attrs?: { [key: string]: string } }} arg - type hint
 * @param x - horizontal position
 * @param y - vertical position
 * @param width - rect's width
 * @param height - rect's height
 * @param fillColor - rectangle's color, transparent if ommited
 * @param strokeColor - rectangle's border color, skipped if ommited
 * @param strokeWidth - rectangle's border width, 0 if ommited
 * @param attrs - attributes to append
 */
function createRect({ x, y, width, height, fillColor, strokeColor, strokeWidth, attrs }) {
    const rectEl = document.createElementNS('http://www.w3.org/2000/svg', 'rect')

    rectEl.setAttribute('x', x || 0)
    rectEl.setAttribute('y', y || 0)
    rectEl.setAttribute('width', width || 0)
    rectEl.setAttribute('height', height || 0)
    rectEl.setAttribute('fill', fillColor || 'none')
    rectEl.setAttribute('stroke', strokeColor || 'none')
    rectEl.setAttribute('stroke-width', strokeWidth || '0')

    addAttrs(rectEl, attrs)

    return rectEl
}

/**
 * Creates an SVG path element that behaves like a rect element, but with rounded corners
 * @param {{ x?: number, y?: number, width?: number, height?: number, fillColor?: string, strokeColor?: string, strokeWidth?: number, radius?: number, attrs?: { [key: string]: string } }} arg - type hint
 * @param x - horizontal position
 * @param y - vertical position
 * @param width - rect's width
 * @param height - rect's height
 * @param fillColor - rectangle's color, transparent if ommited
 * @param strokeColor - rectangle's border color, skipped if ommited
 * @param strokeWidth - rectangle's border width, 0 if ommited
 * @param radius - radius of the rounded corners, 0 if ommited
 * @param attrs - attributes to append
 */
function createRoundedRect({ x, y, width, height, fillColor, strokeColor, strokeWidth, radius, attrs }) {
    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')

    const newRadius = radius || 0
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
    pathEl.setAttribute('fill', fillColor || 'none')
    pathEl.setAttribute('stroke', strokeColor || 'none')
    pathEl.setAttribute('stroke-width', strokeWidth || '0')

    addAttrs(pathEl, attrs)

    return pathEl
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

function createDefs({ attrs, children }) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')

    addAttrs(defs, attrs)

    if (children !== undefined)
        children.forEach(child => defs.appendChild(child))

    return defs
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

function createDropShadowFilter({ id, x, y, width, height, filterUnits = 'userSpaceOnUse' }) {
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter')

    filter.setAttribute('id', id)
    filter.setAttribute('x', x)
    filter.setAttribute('y', y)
    filter.setAttribute('width', width)
    filter.setAttribute('height', height)
    filter.setAttribute('filterUnits', filterUnits)

    filter.appendChild(createGaussianBlurFilter({}))
    filter.appendChild(createOffsetFilter({ x: 5, y: 5 }))
    filter.appendChild(createOffsetFilter({ x: -5, y: -5 }))
    filter.appendChild(createNodeMergeFilter({}))

    return { id, filter }
}

function createGaussianBlurFilter({ source = 'SourceAlpha', stdDeviation = 8 }) {
    const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur')

    blur.setAttribute('in', source)
    blur.setAttribute('stdDeviation', stdDeviation)

    return blur
}

function createOffsetFilter({ x = 0, y = 0 , result = 'offsetblur' }) {
    const offset = document.createElementNS('http://www.w3.org/2000/svg', 'feOffset')

    offset.setAttribute('dx', x)
    offset.setAttribute('dy', y)
    offset.setAttribute('result', result)

    return offset
}

function createNodeMergeFilter({ source = 'SourceGraphic' }) {
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
