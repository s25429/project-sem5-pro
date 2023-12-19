function main() {
    const mapData = {
        width: 150,
        height: 100,
        fill: 'black',
        objects: [
            { id: 0, category: 'A', tags: ['1', '3'], floor: 'First floor', x: 20, y:  20, width: 150, height: 100, fill: '#ff0000' },
            { id: 1, category: 'B', tags: ['4', '8'], floor: 'First floor', x: 50, y:  80, width:  60, height: 200, fill: '#00ff00' },
            { id: 2, category: 'C', tags: ['2', '6'], floor: 'First floor', x:  0, y:   0, width:  70, height:  50, fill: '#0000ff' },
            { id: 3, category: 'D', tags: ['5', '0'], floor: 'First floor', x: 200, y: 100, width:  70, height:  50, fill: '#00ffff' },
        ],
    }

    let interacting = false
    
    drawCanvas(mapData)
    drawSvg(mapData)

    const svgEl = document.querySelector('svg')

    let startX = 0
    let startY = 0
    let offsetX = 0
    let offsetY = 0
    let currentX = 0
    let currentY = 0

    function reset(el, e) {
        startX = e.layerX
        startY = e.layerY
        offsetX = 0
        offsetY = 0
        currentX = parseInt(el.dataset.x)
        currentY = parseInt(el.dataset.y)
    }

    svgEl.addEventListener('mousedown', e => { 
        interacting = true 

        reset(svgEl, e)
    })
    svgEl.addEventListener('mouseup', e => { 
        interacting = false 

        svgEl.dataset.x = currentX
        svgEl.dataset.y = currentY

        reset(svgEl, e)
    })
    svgEl.addEventListener('mouseleave', e => {
        interacting = false 

        svgEl.dataset.x = currentX
        svgEl.dataset.y = currentY

        reset(svgEl, e)
    })
    svgEl.addEventListener('mousemove', e => {
        if (!interacting)
            return

        offsetX = e.layerX - startX
        offsetY = e.layerY - startY

        currentX = parseInt(svgEl.dataset.x) + offsetX
        currentY = parseInt(svgEl.dataset.y) + offsetY

        console.log(offsetX, offsetY)

        // svgEl.style.transform = `translate(${svgEl.dataset.x + offsetX}px, ${svgEl.dataset.y + offsetY}px);`
        // svgEl.style.transform = 'rotate(50deg);'
        svgEl.setAttribute('transform', `translate(${currentX}, ${currentY})`)
    })
}

/**
 *  + Easy and programmatic way of handling drawing, easy and light with loops
 *  + Great performance with many objects
 *  + Great support overall (in theory)
 *  + Should be fast to render initially, those are just pixels (not tested)
 *  - Bad performance with big canvas size
 *  - Pixel styled graphics are blurry when zoomed
 *  - Cannot store additional data for specific rectangles, or groups - needs another object as data handler
 *  - To update one rectangle, all canvas needs to update (not tested)
 */
function drawCanvas(data) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    const [w, h] = data?.objects && data.objects.length > 0 
        ? generateMapSize(data.objects) 
        : [data?.width || 100, data?.height || 100]
    
    canvas.width = w
    canvas.height = h

    data?.objects?.forEach(obj => {
        ctx.fillStyle = obj?.fill || data?.fill || 'black'
        ctx.fillRect(obj?.x || 0, obj?.y || 0, obj?.width || 0, obj?.height || 0)
    })

    const container = document.querySelector('.canvas-container')
    container?.appendChild(canvas)
}

/**
 *  + Great performance with big map size
 *  + Sharp at any zoom level
 *  + Can store additional data in specific rectangles and group of rectangles
 *  + Can update one path/rect at a time (not tested)
 *  - Not easy to make programmatically in JS
 *  - Terrible performance with many objects
 *  - Support might be all over the place (different standards) (in theory)
 *  - Takes time to render, because paths are HTML Elements/Nodes (not tested)
 */
function drawSvg(data) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

    const [w, h] = data?.objects && data.objects.length > 0 
        ? generateMapSize(data.objects) 
        : [data?.width || 100, data?.height || 100]

    svg.setAttribute('version', '1.1')
    svg.setAttribute('width', w)
    svg.setAttribute('height', h)
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

    svg.dataset.x = 0
    svg.dataset.y = 0

    data?.objects?.forEach(obj => {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')

        rect.setAttribute('x', obj?.x || 0)
        rect.setAttribute('y', obj?.y || 0)
        rect.setAttribute('width', obj?.width || 0)
        rect.setAttribute('height', obj?.height || 0)
        rect.setAttribute('fill', obj?.fill || data?.fill || 'black')

        svg.appendChild(rect)
    })

    const container = document.querySelector('.svg-container')
    container?.appendChild(svg)
}

function generateMapSize(objects) {
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


main()
