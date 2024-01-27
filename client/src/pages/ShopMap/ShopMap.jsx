import { useEffect } from 'react'

import { config } from '../../vendor/shop-map-generator/config'
import { createMap } from '../../vendor/shop-map-generator'

import '../../css/ShopMap.css'

const sampleData = {
    id: 1,
    name: 'Sample Shop Name',
    location: '1.2,3.4',
    objects: [
        {
            category: 'cat-1',
            group: 'group-1',
            x: 20,
            y: 20,
            width: 150,
            height: 100,
        }, 
        {
            category: 'cat-2',
            group: 'group-1',
            x: 50,
            y: 80,
            width: 60,
            height: 200,
        }, 
        {
            category: 'cat-3',
            group: 'group-1',
            x: 0,
            y: 0,
            width: 70,
            height: 50,
        }, 
        {
            category: 'cat-4',
            group: 'group-2',
            x: 200,
            y: 100,
            width: 70,
            height: 50,
        }
    ]
}


function ShopMap() {
    useEffect(() => {
        config.container = '#shop-map'

        createMap(sampleData)
    }, [])

    return (
        <div id='shop-map'>
        </div>
    )
}


export default ShopMap