const { MongoClient } = require('mongodb')


/**
 * Establish connection with MongoClient and execute work on it.
 * @param {(client: MongoClient) => Promise<any>} callback - work to execute on client
 * @returns {Promise<any | null>}
 */
async function execute(callback) {
    const uri = `mongodb://${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || '27017'}`
    const client = new MongoClient(uri)

    let result = null

    try {
        await client.connect()
        console.debug('[db] Connected to MongoDB')
        result = await callback(client)
    } 
    catch (error) {
        console.error('[db] Error:', error)
    }
    finally {
        await client.close()
        console.debug('[db] Connection closed.')
    }

    return result
}

/**
 * @returns {Promise<boolean>}
 */
async function ping() {
    const result = await execute(async client => {
        const db = client.db(process.env.DB_NAME)
        const adminCommand = { ping: 1 }

        const pingResult = await db.admin().command(adminCommand)
        const success = pingResult?.ok === 1

        if (success)
            console.log('[db] Ping successful')
        else
            console.error('[db] Ping failed')

        return success
    })

    return result
}


module.exports = {
    execute,
    ping,
}
