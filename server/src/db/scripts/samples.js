const { MongoClient } = require('mongodb')


export async function insertSampleData(
    uri, 
    databaseName, 
    collectionName, 
    { 
        clearCollection = false 
    }
) {
    const client = new MongoClient(uri)

    try {
        await client.connect()
        console.log('Connected to the database')

        const db = client.db(databaseName)
        const collection = db.collection(collectionName)
        const seq = getSequentialIds(db)

        const sampleDocuments = [
            {
                id: seq.nextShopId,
                name: `Shop${seq.nextShopId}`,
                location: '54.35126275796481,18.654804568859817',
                map: [
                    {
                        id: seq.nextMapId++,
                        group: '1. Piętro',
                        x: 60,
                        y: 90,
                        width: 100,
                        height: 600,
                    },
                    {
                        id: seq.nextMapId++,
                        group: '2. Piętro',
                        x: 70,
                        y: 100,
                        width: 120,
                        height: 700,
                    },
                ],
                products: [
                    {
                        id: seq.nextProductId++,
                        name: `Product${seq.nextProductId}`,
                        category: 'Category1',
                        tags: ['Tag1', 'Tag2'],
                        mapId: seq.nextMapId - 2,
                    },
                    {
                        id: seq.nextProductId++,
                        name: `Product${seq.nextProductId}`,
                        category: 'Category2',
                        tags: ['Tag3', 'Tag4'],
                        mapId: seq.nextMapId - 1,
                    },
                ],
                user: [
                    {
                        id: seq.nextShopId,
                        login: `Login${seq.nexShopId}`,
                        password: `Password${seq.nexShopId}`,
                        active: true,
                    },
                ],
            }
        ]

        if (clearCollection)
            await collection.remove({})

        const result = await collection.insertMany(sampleDocuments)

        console.log(`${result.insertedCount} document inserted`)
        console.log('Inserted Shop ID:', seq.nextShopId)
    }
    catch (error) {
        console.error('Error:', error)
    }
    finally {
        await client.close()
        console.log('Connection closed')
    }
}

async function getSequentialIds(db) {
    const sequence = db.collection('sequence')

    // Find and update the sequence for shops
    const shopSequenceDoc = await sequence.findOneAndUpdate(
        { name: 'shopId' },
        { $inc: { value: 1 } },
        { returnDocument: 'after', upsert: true }
    )

    // Find and update the sequence for products
    const productSequenceDoc = await sequence.findOneAndUpdate(
        { name: 'productId', shopId: shopSequenceDoc.value },
        { $inc: { value: 1 } },
        { returnDocument: 'after', upsert: true }
    )

    // Find and update the sequence for maps
    const mapSequenceDoc = await sequence.findOneAndUpdate(
        { name: 'mapId', shopId: shopSequenceDoc.value },
        { $inc: { value: 1 } },
        { returnDocument: 'after', upsert: true }
    )

    const sequenceData = {
        nextShopId: 1,
        nextProductId: 1,
        nextMapId: 1,
    }

    // If the documents exist, get last values (already incremented)
    if (shopSequenceDoc && productSequenceDoc && mapSequenceDoc) {
        sequenceData.nextShopId = shopSequenceDoc.value
        sequenceData.nextProductId = productSequenceDoc.value
        sequenceData.nextMapId = mapSequenceDoc.value
    }
    // If the documents don't exist, insert new ones with values 1
    else {
        await sequence.insertMany([
            { 
                name: 'shopId', 
                value: sequenceData.nextShopId 
            },
            { 
                name: 'productId', 
                value: sequenceData.nextProductId 
            },
            { 
                name: 'mapId', 
                value: sequenceData.nextMapId, 
                shopId: sequenceData.nextShopId 
            },
        ])
    }
    
    return sequenceData
}

function overwriteDocumentWithSequences(doc, seq) {
    doc.id = seq.nextShopId
    doc.name += seq.nextShopId.toString()

    doc.map.map(obj => ({ 
        ...obj, 
        id: seq.nextMapId++,
    }))

    doc.products.map((obj, idx) => ({ 
        ...obj, 
        id: seq.nextProductId++,
        name: obj.name + seq.nextProductId.toString(),
        mapId: seq.nextMapId - (doc.products.length - idx),
    }))

    doc.users.map(obj => ({
        ...obj,
        login: obj.login + seq.nexShopId.toString(),
        password: obj.password + seq.nexShopId.toString(),
    }))
}
