const { MongoClient } = require('mongodb')


const uri = 'mongodb://localhost:27017'
const dbName = 'polkarzyk'


async function insertData() {
    const client = new MongoClient(uri)

    try {
        await client.connect()
        console.log('Connected to the database')

        const db = client.db(dbName)
        const collection = db.collection('shops')
        const sequenceCollection = db.collection('sequence')

        // Find and update the sequence for shops
        const shopSequenceDoc = await sequenceCollection.findOneAndUpdate(
            { name: 'shopId' },
            { $inc: { value: 1 } },
            { returnDocument: 'after', upsert: true }
        )

        // Find and update the sequence for products
        const productSequenceDoc = await sequenceCollection.findOneAndUpdate(
            { name: 'productId', shopId: shopSequenceDoc.value },
            { $inc: { value: 1 } },
            { returnDocument: 'after', upsert: true }
        )

        // Find and update the sequence for maps
        const mapSequenceDoc = await sequenceCollection.findOneAndUpdate(
            { name: 'mapId', shopId: shopSequenceDoc.value },
            { $inc: { value: 1 } },
            { returnDocument: 'after', upsert: true }
        )

        let nextShopId
        let nextMapId
        let nextProductId

        if (shopSequenceDoc && productSequenceDoc && mapSequenceDoc) {
            // If the documents exist, increment the values
            nextShopId = shopSequenceDoc.value
            nextMapId = mapSequenceDoc.value
            nextProductId = productSequenceDoc.value
        } 
        else {
            // If the documents don't exist, insert new ones with values 1
            await sequenceCollection.insertMany([
                { name: 'shopId', value: 1 },
                { name: 'productId', value: 1 },
                { name: 'mapId', value: 1, shopId: 1 },
            ])
            nextShopId = 1
            nextMapId = 1
            nextProductId = 1
        }

        const document1 = {
            id: nextShopId,
            name: 'Shop4',
            location: '54.35126275796481,18.654804568859817',
            map: [
                {
                    id: nextMapId++,
                    group: 'First floor',
                    x: 60,
                    y: 90,
                    width: 100,
                    height: 600,
                },
                {
                    id: nextMapId++,
                    group: 'Second floor',
                    x: 70,
                    y: 100,
                    width: 120,
                    height: 700,
                },
            ],
            products: [
                {
                    id: nextProductId++,
                    name: 'Product1',
                    category: 'Category1',
                    tags: ['Tag1', 'Tag2'],
                    mapId: nextMapId - 2,
                },
                {
                    id: nextProductId++,
                    name: 'Product2',
                    category: 'Category2',
                    tags: ['Tag33', 'Tag41'],
                    mapId: nextMapId - 1,
                },
            ],
            user: [
                {
                    id: nextShopId,
                    login: 'Login4',
                    password: 'Password4',
                    active: true,
                },
            ],
        }

        const result = await collection.insertOne(document1)

        console.log(`${result.insertedCount} document inserted`)
        console.log('Inserted Shop ID:', nextShopId)
    } 
    catch (error) {
        console.error('Error:', error)
    } 
    finally {
        await client.close()
        console.log('Connection closed')
    }
}

// Execute the script
insertData()
