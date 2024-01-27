import { useEffect } from 'react'

import { config } from '../../vendor/shop-map-generator/config'
import { createMap } from '../../vendor/shop-map-generator'

import '../../css/ShopMap.css'


function ShopMap() {
    useEffect(() => {
        config.container = '#shop-map'

        loadMapDataFromServer()

        async function loadMapDataFromServer() {
            const response = await fetch('/db/map/1/parsed')
            const data = await response.json()
            createMap(data)
        }
    }, [])

    return (
        <div id='shop-map'>
        </div>
    )
}


export default ShopMap