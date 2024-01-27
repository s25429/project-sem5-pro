const express = require('express')
const { MongoClient } = require('mongodb')


const app = express()
const port = process.env.SERVER_PORT || 5172

const uri = `mongodb://${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || '27017'}`
const dbName = process.env.DB_NAME || 'db'


app.use(express.json())


async function getShopById(collection, id) {
    let shop

    // Validate the id parameter
    if (!id || (typeof id !== 'string' && typeof id !== 'number')) {
        return null // Invalid ID, return null or handle appropriately
    }

    // Try finding by numeric ID first
    if (!isNaN(id)) {
        shop = await collection.findOne({ id: parseInt(id, 10) })
    }

    return shop
}


app.get('/healthcheck', (req, res) => {
    res.send('I\'m alive')
})

app.get('/healthcheck/db', async (req, res) => {
    const { ping } = require('./db/database')

    const success = await ping()

    if (success)
        res.status(200).json({ message: 'Database is alive' })
    else
        res.status(500).json({ error: 'Connection could not be esablished' })
})

app.get('/shops/:id', async (req, res) => {
    const { execute } = require('./db/database')

    const { id } = req.params

    // const result = await execute(client => {
    //     const collection
    // })

    
    // try {
    //     await client.connect()
    //     console.log('Connected to the database')

    //     const db = client.db(dbName)
    //     const collection = db.collection('test')

    //     const shop = await getShopById(collection, id)

    //     if (shop) {
    //         res.status(200).json(shop)
    //     } else {
    //         res.status(404).json({ error: 'Shop not found' })
    //     }

    // } 
    // catch (error) {
    //     console.error('Error retrieving shop:', error)
    //     res.status(500).json({ error: 'Internal server error' })
    // } 
    // finally {
    //     await client.close()
    //     console.log('Connection closed')
    // }
})

app.get('/mapGeneration/:id', async (req, res) => {
    const { id } = req.params

    const client = new MongoClient(uri)

    try {
        await client.connect()
        console.log('Connected to the database')

        const db = client.db(dbName)
        const collection = db.collection('test')

        const shop = await getShopById(collection, id)

        if (!shop) {
            return res.status(404).json({ error: 'Shop not found' })
        }

        // Transform the map data, including all associated products
        const transformedMap = shop.map.map(item => {
            const associatedProduct = shop.products.find(prod => prod.mapId === item.id)
            return {
                category: associatedProduct ? associatedProduct.category : null,
                group: item.group,
                x: item.x,
                y: item.y,
                width: item.width,
                height: item.height,
            }
        })

        const result = {
            id: shop.id,
            name: shop.name,
            location: shop.location,
            objects: transformedMap,
        }

        res.status(200).json(result)

    } 
    catch (error) {
        console.error('Error retrieving shop:', error)
        res.status(500).json({ error: 'Internal server error' })
    } 
    finally {
        await client.close()
        console.log('Connection closed')
    }
})

app.get('/db/sample-data', (req, res) => {
    const { insertSampleData } = require('./db/scripts/samples')
    insertSampleData(uri, dbName, 'shops', { clearCollection: true })
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})