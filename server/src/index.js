require('dotenv').config()
const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')


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

app.get('/db/healthcheck', async (req, res) => {
    const { ping } = require('./db/database')

    const success = await ping()

    if (success)
        res.status(200).json({ message: 'Database is alive' })
    else
        res.status(500).json({ error: 'Connection could not be esablished' })
})

app.get('/db/shops', async (req, res) => {
    const { execute } = require('./db/database')

    if (process.env.DB_NAME === undefined) {
        res.status(500).json({ error: 'Server error' })
        console.error('Env var DB_NAME = undefined')
        return
    }

    const result = await execute(async client => {
        const collection = client.db(process.env.DB_NAME).collection('shops')
        const result = await collection.find().toArray()
        return result
    })

    if (result)
        res.status(200).json(result)
    else
        res.status(404).json({ error: 'Collection not found' })
})

app.get('/db/shops/:id', async (req, res) => {
    const { execute } = require('./db/database')

    if (process.env.DB_NAME === undefined) {
        console.error('Env var DB_NAME = undefined')
        res.status(500).json({ error: 'Server error' })
        return
    }

    const objectId = new ObjectId(req.params.id)

    const result = await execute(async client => {
        const collection = client.db(process.env.DB_NAME).collection('shops')
        const result = await collection.findOne({ '_id': objectId })
        return result
    })

    if (result)
        res.status(200).json(result)
    else
        res.status(404).json({ error: 'Document not found' })
})

app.get('/db/map/:id/parsed', async (req, res) => {
    const { execute } = require('./db/database')

    if (process.env.DB_NAME === undefined) {
        console.error('Env var DB_NAME = undefined')
        res.status(500).json({ error: 'Server error' })
        return
    }

    const objectId = new ObjectId(req.params.id)

    const result = await execute(async client => {
        const collection = client.db(process.env.DB_NAME).collection('shops')
        const result = await collection.findOne({ '_id': objectId })
        return result
    })

    if (result === null) {
        res.status(404).json({ error: 'Document not found' })
        return
    }

    const map = {
        id: result._id,
        name: result.name,
        location: result.location,
        objects: result.groups.map(group => {
            const data = group.categories.map(category => ({
                group: group.name,
                category: category.name,
                x: category.x,
                y: category.y,
                width: category.width,
                height: category.height,
            }))
            return data
        }).reduce((acc, newGroup) => [...acc, ...newGroup], [])
    }

    res.status(200).json(map)

    // const { id } = req.params

    // const client = new MongoClient(uri)

    // try {
    //     await client.connect()
    //     console.log('Connected to the database')

    //     const db = client.db(dbName)
    //     const collection = db.collection('shops')

    //     const shop = await getShopById(collection, id)

    //     if (!shop) {
    //         return res.status(404).json({ error: 'Shop not found' })
    //     }

    //     // Transform the map data, including all associated products
    //     const transformedMap = shop.map.map(item => {
    //         const associatedProduct = shop.products.find(prod => prod.mapId === item.id)
    //         return {
    //             category: associatedProduct ? associatedProduct.category : null,
    //             group: item.group,
    //             x: item.x,
    //             y: item.y,
    //             width: item.width,
    //             height: item.height,
    //         }
    //     })

    //     const result = {
    //         id: shop.id,
    //         name: shop.name,
    //         location: shop.location,
    //         objects: transformedMap,
    //     }

    //     res.status(200).json(result)

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

app.get('/db/shops/:shopId/product/:product', async (req, res) => {
    const { execute } = require('./db/database')

    if (process.env.DB_NAME === undefined) {
        console.error('Env var DB_NAME = undefined')
        res.status(500).json({ error: 'Server error' })
        return
    }

    const { product, shopId } = req.params
    const objectId = new ObjectId(shopId)
    const productName = product

    const result = await execute(async client => {
        const collection = client.db(process.env.DB_NAME).collection('shops')
        // const result = await collection.findOne(
        //     { 
        //         '_id': objectId, 
        //         'groups.categories.products.name': product,
        //     },
        //     {
        //         'projection': {
        //             '_id': 0,
        //             'groups.categories.products': {
        //                 '$elemMatch': {
        //                     'name': product,
        //                 },
        //             },
        //         },
        //     },
        // )
        const result = await collection.aggregate([
            {
                $match: {
                    _id: objectId,
                    'groups.categories.products.name': productName,
                },
            },
            {
                $project: {
                    groups: {
                    $filter: {
                        input: '$groups',
                        as: 'group',
                        cond: {
                        $gt: [
                            {
                            $size: {
                                $filter: {
                                input: '$$group.categories',
                                as: 'category',
                                cond: {
                                    $gt: [
                                    {
                                        $size: {
                                        $filter: {
                                            input: '$$category.products',
                                            as: 'product',
                                            cond: {
                                                $eq: ['$$product.name', productName],
                                            },
                                        },
                                        },
                                    },
                                    0,
                                    ],
                                },
                                },
                            },
                            },
                            0,
                        ],
                        },
                    },
                    },
                },
            },
            {
                $unwind: '$groups',
            },
            {
                $unwind: '$groups.categories',
            },
            {
                $unwind: '$groups.categories.products',
            },
            {
                $match: {
                    'groups.categories.products.name': productName,
                },
            },
            {
                $project: {
                    _id: 0,
                    category: '$groups.categories.name',
                    'groups.categories.products': 1,
                },
            },
          ]).toArray()
        return result
    })

    if (result?.[0]?.groups?.categories?.products)
        res.status(200).json({
            category: result?.[0]?.category,
            product: result?.[0]?.groups?.categories?.products,
        })
    else
        res.status(404).json({ error: 'Document not found' })
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})