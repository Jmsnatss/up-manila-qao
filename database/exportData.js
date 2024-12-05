const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const uri = "mongodb://localhost:27017";
const dbName = "up-manila-qao";

async function exportCollections() {
    try {
        const client = await MongoClient.connect(uri);
        const db = client.db(dbName);
        
        // Get all collections
        const collections = await db.listCollections().toArray();
        
        // Create data directory if it doesn't exist
        const dataDir = path.join(__dirname, 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir);
        }
        
        // Export each collection
        for (const collection of collections) {
            const collectionName = collection.name;
            const data = await db.collection(collectionName).find({}).toArray();
            
            fs.writeFileSync(
                path.join(dataDir, `${collectionName}.json`),
                JSON.stringify(data, null, 2)
            );
            
            console.log(`Exported ${collectionName}`);
        }
        
        await client.close();
        console.log('Export completed successfully');
    } catch (err) {
        console.error('Export failed:', err);
    }
}

exportCollections();
