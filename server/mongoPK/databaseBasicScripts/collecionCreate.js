const { MongoClient } = require('mongodb')


/**
 * Creates a new collection in the specified database.
 * 
 * @async
 * @function
 * @param {string} uri - The MongoDB connection string.
 * @param {string} databaseName - The name of the database where the collection will be created.
 * @param {string} collectionName - The name of the collection to create.
 * @returns {Promise<void>} A Promise that resolves when the collection is created.
 * @throws {Error} If there is an error during the collection creation process.
 */
async function createCollection(uri, databaseName, collectionName) {
    const client = new MongoClient(uri)

    try {
        await client.connect()
        console.log('Connected to MongoDB')

        const db = client.db(databaseName)

        await db.createCollection(collectionName)

        console.log(`Collection '${collectionName}' created in the '${databaseName}' database.`)
    } 
    catch (error) {
        console.error('Error:', error)
    }
    finally {
        await client.close()
        console.log('Connection closed.')
    }
}

// Example usage:
// Replace 'mongodb://localhost:27017', 'Test', and 'MyCollection' with your desired values
createCollection('mongodb://localhost:27017', 'Test', 'MyCollection').catch(console.error)
