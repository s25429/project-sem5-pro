import * as event from './events.js'
import * as svg from './svg.js'
import * as utils from './utils.js'
import { parseStruct } from './struct.js'


export function createMap(data = {}) {
    const { containerEl, svgEl } = initMap(data)

    containerEl?.addEventListener('mousedown', onMouseDown)
    containerEl?.addEventListener('mouseup', onMouseUp)
    containerEl?.addEventListener('mouseleave', onMouseLeave)
    containerEl?.addEventListener('mousemove', onMouseMove)

    function onMouseDown(e) {
        event.onGrab(e)
    }

    function onMouseUp(e) {
        event.onDrop(e)
    }

    function onMouseLeave() {
        event.onLeave()
    }

    function onMouseMove(e) {
        event.onMove(e, svgEl)
    }
}

function initMap(data) {
    const errorResult = { containerEl: null, svgEl: null }

    if (!parseStruct(data)) 
        return errorResult

    // props
    let totalSizeX = 0
    let totalSizeY = 0
    let groupOffsetX = 0
    let groupOffsetY = 0
    let groupGapX = 0
    let groupGapY = 10
    let textOffsetX = 0
    let textOffsetY = -6
    let textLineHeight = 20

    const containerEl = document.querySelector('.svg-container')
    const svgEl = svg.createSVG()
    const objectsPerGroup = utils.groupBy(data.objects, 'group')

    Object.entries(objectsPerGroup).forEach(([groupName, objs], index) => {
        const [strokeWidth, strokeHeight] = utils.getContainedSize(objs)

        const strokeRect = svg.createRect({
            x: groupOffsetX,
            y: groupOffsetY,
            width: strokeWidth,
            height: strokeHeight,
            strokeColor: 'black',
            strokeWidth: 1,
        })

        const map = svg.createGroup({
            attrs: { 'class': 'map-content' },
        })

        objs.forEach(obj => {
            const rect = svg.createRoundedRect({
                x: obj.x + groupOffsetX,
                y: obj.y + groupOffsetY,
                width: obj.width,
                height: obj.height,
                fillColor: 'blue',
                radius: 8,
                attrs: {
                    'data-category': obj.category,
                },
            })

            map.appendChild(rect)
        })

        const text = svg.createText({
            x: 0,
            y: groupOffsetY + textOffsetY,
            text: groupName,
            attrs: {
                'class': 'map-group',
                'font-size': '1rem',
            },
        })

        groupOffsetY += strokeHeight + groupGapY
        totalSizeX = strokeWidth > totalSizeX ? strokeWidth : totalSizeX
        totalSizeY += textLineHeight + strokeHeight + groupGapY // TODO: adds a gap for the last element as well

        const group = svg.createGroup({
            attrs: {
                'data-group': groupName,
                'transform': `translate(0, ${textLineHeight * (index + 1)})`, // TODO: test this
            },
            children: [strokeRect, map, text],
        })

        svgEl.appendChild(group)
    })

    svgEl.setAttribute('width', totalSizeX)
    svgEl.setAttribute('height', totalSizeY)

    if (containerEl === null)
        return errorResult

    containerEl.appendChild(svgEl)

    return { containerEl, svgEl }
}