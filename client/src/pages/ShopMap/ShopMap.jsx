import { useEffect } from 'react'

import Filter from '../../components/Filter'

import { config } from '../../vendor/shop-map-generator/config'
import { createMap } from '../../vendor/shop-map-generator'

import '../../css/ShopMap.css'


const mapConfig = {
    container: '#shop-map',
    rect: {
        color: '#3f2021',
    },
    group: {
        border: {
            color: '#414141',
        },
    },
    font: {
        color: '#414141',
    },
}


function ShopMap() {
    const onProductSearch = async (product) => {
        console.log(product)

        const response = await fetch(`/db/shops/${1}/product/${product}`)
        const data = await response.json()

        toggleAisle(data?.category)

        if (data?.error)
            alert('Produktu nie znaleziono.')
    }

    const toggleAisle = (category) => {
        if (category !== undefined) {
            const aisle = document
                .querySelector(mapConfig.container)
                .querySelector(`g.map-content [data-category=${category}]`)

            if (aisle === null) {
                alert('Napotkano niespodziewany błąd.')
                console.error('Product in db found, but not on map', `data=${data}`, `aisle=${aisle}`)
                return
            }

            aisle.classList.add('active')
            aisle.setAttribute('fill', '#bb2551')
        }
        else {
            const aisles = document
                .querySelector(mapConfig.container)
                .querySelectorAll(`g.map-content .active[data-category]`)

            aisles.forEach(aisle => {
                aisle.classList.remove('active')
                aisle.setAttribute('fill', mapConfig.rect.color)
            })
        }
    }

    useEffect(() => {
        config.container = mapConfig.container
        config.rect.color = mapConfig.rect.color
        config.group.border.color = mapConfig.group.border.color
        config.font.color = mapConfig.font.color
        
        loadMapDataFromServer()

        async function loadMapDataFromServer() {
            const response = await fetch('/db/map/1/parsed')
            const data = await response.json()

            createMap(data)
        }
    }, [])

    return (
        <>
            <Filter onFilterSubmit={onProductSearch} />
            <div id='shop-map'></div>
        </>
    )
}


export default ShopMap