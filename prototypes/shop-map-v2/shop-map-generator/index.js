import * as event from './events.js'
import * as svg from './svg.js'
import * as utils from './utils.js'
import { parseStruct } from './struct.js'
import { config } from './config.js'


/**
 * Creates an interactive map from given data. 
 * @param {typeof struct} data - structure in struct.js
 * @note to configure additional options, check config.js
 */
export function createMap(data) {
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

/**
 * Initializes all elements for the map and appends them to specified document element
 * @param {typeof struct} data 
 * @returns 
 */
function initMap(data) {
    const errorResult = { containerEl: null, svgEl: null }

    if (!parseStruct(data)) 
        return errorResult

    let totalSizeX = 0
    let totalSizeY = 0
    let groupOffsetX = 0
    let groupOffsetY = 0
    let groupGapX = 0 // unused
    let groupGapY = config?.group?.gap || 10
    let textOffsetX = 0 // unused
    let textOffsetY = config?.text?.offset || -6
    let textLineHeight = config?.text?.lineHeight || 20

    const containerEl = document.querySelector(config?.container || '.svg-container')
    const svgEl = svg.createSVG()
    
    let shadowFilter = null

    if (config?.shadows) {
        shadowFilter = svg.createDropShadowFilter({
            id: 'f1',
            x: '-40%',
            y: '-40%',
            width: '180%',
            height: '180%',
        })

        const defs = svg.createDefs({
            children: [shadowFilter.filter]
        })

        svgEl.appendChild(defs)
    }

    const objectsPerGroup = utils.groupBy(data.objects, 'group')
    Object.entries(objectsPerGroup).forEach(([groupName, objs], index) => {
        const [strokeWidth, strokeHeight] = utils.getContainedSize(objs)

        const strokeRect = svg.createRect({
            x: groupOffsetX,
            y: groupOffsetY,
            width: strokeWidth,
            height: strokeHeight,
            strokeColor: config?.group?.border?.color || 'black',
            strokeWidth: config?.group?.border?.width || 2,
        })

        const map = svg.createGroup({
            attrs: { 'class': 'map-content' },
        })

        objs.forEach(obj => {
            const rectArgs = {
                x: obj.x + groupOffsetX,
                y: obj.y + groupOffsetY,
                width: obj.width,
                height: obj.height,
                fillColor: config?.rect?.color || 'black',
                radius: config?.rect?.borderRadius || 4,
                attrs: {
                    'data-category': obj.category,
                    ...(config?.shadows ? { 'style': `filter: url(#${shadowFilter.id});` } : {})
                },
            }
            const rect = config?.roundedCorners 
                ? svg.createRoundedRect(rectArgs) 
                : svg.createRect(rectArgs) 

            map.appendChild(rect)
        })

        const text = svg.createText({
            x: 0,
            y: groupOffsetY + textOffsetY,
            text: groupName,
            attrs: {
                'class': 'map-group',
                'font-size': config?.font?.size || '16px',
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

    svgEl.setAttribute('width', totalSizeX + groupGapY)
    svgEl.setAttribute('height', totalSizeY)

    if (containerEl === null)
        return errorResult

    containerEl.appendChild(svgEl)

    return { containerEl, svgEl }
}