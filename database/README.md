# Database Export/Import Scripts

This directory contains scripts and data for managing the UP Manila QAO database.

## Structure
- `data/` - Contains JSON exports of all collections
- `exportData.js` - Script to export collections from MongoDB
- `importData.js` - Script to import collections into MongoDB

## Usage

### Export Data
To export your current database:
```bash
node exportData.js
```
This will create JSON files in the `data` directory for each collection.

### Import Data
To import the data into your MongoDB:
```bash
node importData.js
```
This will import all JSON files from the `data` directory into your MongoDB.

## Note
- Make sure MongoDB is running locally on port 27017
- The database name is set to "up-manila-qao"
- Existing collections will be dropped before import
