const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const uri = "mongodb://localhost:27017";
const dbName = "up-manila-qao";

async function importCollections() {
    try {
        const client = await MongoClient.connect(uri);
        const db = client.db(dbName);
        
        const dataDir = path.join(__dirname, 'data');
        const files = fs.readdirSync(dataDir);
        
        for (const file of files) {
            if (file.endsWith('.json')) {
                const collectionName = file.replace('.json', '');
                const data = JSON.parse(
                    fs.readFileSync(path.join(dataDir, file), 'utf-8')
                );
                
                // Drop existing collection if it exists
                await db.collection(collectionName).drop().catch(() => {});
                
                // Insert the data if there are documents
                if (data.length > 0) {
                    await db.collection(collectionName).insertMany(data);
                }
                
                console.log(`Imported ${collectionName}`);
            }
        }
        
        await client.close();
        console.log('Import completed successfully');
    } catch (err) {
        console.error('Import failed:', err);
    }
}

importCollections();
