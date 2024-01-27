const { MongoClient } = require('mongodb');

/**
 * Lists all databases on the MongoDB server.
 * WARNING empty databases will not be shown
 * @async
 * @function
 * @param {string} uri - The MongoDB connection string.
 * @returns {Promise<void>} A Promise that resolves with the list of databases.
 * @throws {Error} If there is an error while listing databases.
 */
async function listDatabases(uri) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    // List all databases
    const adminDb = client.db('admin');
    const databases = await adminDb.admin().listDatabases();

    console.log('Databases:');
    databases.databases.forEach(db => {
      console.log(`- ${db.name}`);
    });
  } finally {
    await client.close();
    console.log('Connection closed.');
  }
}

// Example usage:
// Replace 'mongodb://localhost:27017' with your desired MongoDB connection string
listDatabases('mongodb://localhost:27017').catch(console.error);
