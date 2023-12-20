import { createMap } from './map.js'


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

    createMap(mapData)
}


main()
