import { useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'

import Filter from '../../components/Filter'

import { useShopIdProvider } from '../../context/ShopIdProvider'

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


export function loader({ params }) {
    const id = params?.shopId || null
    return { shopId: id }
}

function ShopMap() {
    const { shopId } = useLoaderData()
    const { setShopId } = useShopIdProvider()

    const onProductSearch = async (product) => {
        const productWasCategory = toggleAisle(product)

        if (productWasCategory)
            return

        const response = await fetch(`/db/shops/${shopId}/product/${product}`)
        const data = await response.json()

        if (data?.error)
            alert('Produktu nie znaleziono.')

        const success = toggleAisle(data?.category)

        if (!success && data?.error === undefined) {
            alert('Napotkano niespodziewany błąd.')
            console.error('Product in db found, but not on map', data)
        }
    }

    const toggleAisle = (category) => {
        const aisles = document
            .querySelector(mapConfig.container)
            .querySelectorAll(`g.map-content .active[data-category]`)

        aisles.forEach(aisle => {
            aisle.classList.remove('active')
            aisle.setAttribute('fill', mapConfig.rect.color)
        })

        if (category === undefined)
            return false

        const aisle = document
            .querySelector(mapConfig.container)
            .querySelector(`g.map-content [data-category="${category}"]`)

        if (aisle === null)
            return false

        aisle.classList.add('active')
        aisle.setAttribute('fill', '#bb2551')

        return true
    }

    useEffect(() => {
        setShopId(shopId)

        config.container = mapConfig.container
        config.rect.color = mapConfig.rect.color
        config.group.border.color = mapConfig.group.border.color
        config.font.color = mapConfig.font.color
        
        loadMapDataFromServer()

        async function loadMapDataFromServer() {
            const response = await fetch(`/db/map/${shopId}/parsed`)
            const data = await response.json()

            createMap(data)
        }
    }, [])

    return (
        <>
            <Filter onFilterSubmit={onProductSearch} placeholder='Wyszukaj produkt lub kategorie' />
            <div id='shop-map'></div>
        </>
    )
}


export default ShopMap