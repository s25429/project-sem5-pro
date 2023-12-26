import { createMap } from './map.js'


function main() {
    const newMapData = {
        maxWidth: 300,
        maxHeight: 300,
        fill: 'black',
        objects: [
            {
                category: 'Category A',
                group: 'First floor',
                fill: '#ff0000',
                x: 20,
                y: 20,
                width: 150,
                height: 100,
                products: [
                    {
                        id: 0,
                        name: 'Product 1',
                        tags: ['1', '3']
                    },
                ],
            },
            {
                category: 'B',
                group: 'First floor',
                fill: '#00ff00',
                x: 50, 
                y: 80, 
                width: 60, 
                height: 200,
                products: [
                    {
                        id: 1,
                        name: 'Product 1',
                        tags: ['4', '8'],
                    },
                    {
                        id: 2,
                        name: 'Product 2',
                        tags: ['2', '3', '5'],
                    }
                ],
            },
            {
                category: 'B',
                group: 'First floor',
                fill: '#0000ff',
                x: 0, 
                y: 0, 
                width: 70, 
                height: 50,
                products: [
                    {
                        id: 3,
                        name: 'Product 3',
                        tags: ['7', '6', '5', '1'],
                    },
                ],
            },
            {
                category: 'C',
                group: 'Second floor',
                fill: '#00ffff',
                x: 200, 
                y: 100, 
                width: 70, 
                height: 50,
                products: [
                    {
                        id: 4,
                        name: 'Product 4',
                        tags: ['11', '5', '3'],
                    },
                    {
                        id: 5,
                        name: 'Product 5',
                        tags: ['0'],
                    },
                    {
                        id: 6,
                        name: 'Product 6',
                        tags: [],
                    },
                    {
                        id: 7,
                        name: 'Product 7',
                        tags: ['12', '9', '5'],
                    },
                    {
                        id: 8,
                        name: 'Product 8',
                        tags: ['4', '8'],
                    },
                ]
            }
        ]
    }

    createMap(newMapData)
}


main()
