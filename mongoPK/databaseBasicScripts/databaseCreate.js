const { MongoClient } = require('mongodb');

/**
 * Creates a new database with the specified name.
 *
 * @async
 * @function
 * @param {string} uri - The MongoDB connection string.
 * @param {string} databaseName - The name of the database to create.
 * @returns {Promise<void>} A Promise that resolves when the database is created.
 * @throws {Error} If there is an error during the database creation process.
 */
async function createDatabase(uri, databaseName) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    // Create a new database
    const db = client.db(databaseName);
    console.log(`Database '${databaseName}' created successfully.`);
  } finally {
    await client.close();
    console.log('Connection closed.');
  }
}

// Example usage:
// Replace 'mongodb://localhost:27017' and 'PKdatabase' with your desired values
createDatabase('mongodb://localhost:27017', 'PKdatabase');
