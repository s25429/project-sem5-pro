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

    canvas.width = data?.width || 100
    canvas.height = data?.height || 100

    data?.objects?.forEach(obj => {
        ctx.fillStyle = obj?.fill || data?.fill || 'black'
        ctx.fillRect(obj?.x || 0, obj?.y || 0, obj?.width || 0, obj?.height || 0)
    })

    document.body.appendChild(canvas)
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

    svg.setAttribute('version', '1.1')
    svg.setAttribute('width', data?.width || 100)
    svg.setAttribute('height', data?.height || 100)
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

    data?.objects?.forEach(obj => {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')

        rect.setAttribute('x', obj?.x || 0)
        rect.setAttribute('y', obj?.y || 0)
        rect.setAttribute('width', obj?.width || 0)
        rect.setAttribute('height', obj?.height || 0)
        rect.setAttribute('fill', obj?.fill || data?.fill || 'black')
        
        svg.appendChild(rect)
    })

    document.body.appendChild(svg)
}


const mapData = {
    width: 150,
    height: 150,
    fill: 'black',
    objects: [
        { id: 0, category: 'A', tags: ['1', '3'], floor: 'First floor', x: 20, y: 20, width: 150, height: 100, fill: '#ff0000' },
        { id: 1, category: 'B', tags: ['4', '8'], floor: 'First floor', x: 50, y: 80, width:  60, height: 200, fill: '#00ff00' },
        { id: 2, category: 'C', tags: ['2', '6'], floor: 'First floor', x:  0, y:  0, width:  70, height:  50, fill: '#0000ff' },
    ],
}


drawCanvas(mapData)
drawSvg(mapData)
