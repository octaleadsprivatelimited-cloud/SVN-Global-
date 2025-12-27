# MongoDB Data Import Guide

This guide explains how to import data from JSON files into MongoDB Atlas using `mongoimport`.

> **See also:** [MongoDB Export Guide](./MONGODB_EXPORT.md) for exporting data from MongoDB.

## Prerequisites

1. **MongoDB Database Tools** installed:
   - Download from: https://www.mongodb.com/try/download/database-tools
   - Or install via package manager:
     - Windows: `choco install mongodb-database-tools`
     - macOS: `brew install mongodb-database-tools`
     - Linux: Follow MongoDB documentation

2. **MongoDB Connection String**:
   - Database: `svnglobal`
   - Cluster: `svnglobal.5vlys7w.mongodb.net`
   - Username: `svnglobal`
   - Password: Your MongoDB password (URL-encoded if it contains special characters)

## Quick Import Commands

### Import Admin Data
```bash
mongoimport --uri "mongodb+srv://svnglobal:<PASSWORD>@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal" \
  --collection admin \
  --type json \
  --file data/admin.json \
  --jsonArray
```

### Import Products Data
```bash
mongoimport --uri "mongodb+srv://svnglobal:<PASSWORD>@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal" \
  --collection products \
  --type json \
  --file data/products.json \
  --jsonArray
```

### Import Test Reports Data
```bash
mongoimport --uri "mongodb+srv://svnglobal:<PASSWORD>@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal" \
  --collection testreports \
  --type json \
  --file data/testReports.json \
  --jsonArray
```

## Using Import Scripts

### Windows PowerShell
```powershell
cd backend
.\scripts\import-data.ps1 -Password "Svnglobal@2025"
```

### Linux/macOS
```bash
cd backend
chmod +x scripts/import-data.sh
./scripts/import-data.sh Svnglobal@2025
```

## Password URL Encoding

If your password contains special characters, you need to URL-encode them:

| Character | Encoded |
|-----------|---------|
| `@` | `%40` |
| `#` | `%23` |
| `$` | `%24` |
| `%` | `%25` |
| `&` | `%26` |
| `+` | `%2B` |
| `=` | `%3D` |
| `?` | `%3F` |

**Example:**
- Password: `Svnglobal@2025`
- Encoded: `Svnglobal%402025`
- Full URI: `mongodb+srv://svnglobal:Svnglobal%402025@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal`

## Manual Import (Step by Step)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Import each collection:**
   ```bash
   # Admin
   mongoimport --uri "mongodb+srv://svnglobal:<PASSWORD>@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal" --collection admin --type json --file data/admin.json --jsonArray

   # Products
   mongoimport --uri "mongodb+srv://svnglobal:<PASSWORD>@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal" --collection products --type json --file data/products.json --jsonArray

   # Test Reports
   mongoimport --uri "mongodb+srv://svnglobal:<PASSWORD>@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal" --collection testreports --type json --file data/testReports.json --jsonArray
   ```

## Verify Import

After importing, verify the data in MongoDB Atlas:

1. Go to MongoDB Atlas Dashboard
2. Navigate to **Browse Collections**
3. Select database: `svnglobal`
4. Check collections: `admin`, `products`, `testreports`

Or use MongoDB Compass or `mongosh`:
```bash
mongosh "mongodb+srv://svnglobal:<PASSWORD>@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal"

# Then run:
use svnglobal
db.admin.find()
db.products.count()
db.testreports.count()
```

## Troubleshooting

### Error: "authentication failed"
- Check that your password is correct
- Ensure password is URL-encoded if it contains special characters
- Verify username is `svnglobal`

### Error: "network error" or "connection timeout"
- Check MongoDB Atlas Network Access settings
- Ensure your IP is whitelisted (or use `0.0.0.0/0` for all IPs)
- Verify cluster is running

### Error: "collection already exists"
- Use `--drop` flag to drop existing collection before import:
  ```bash
  mongoimport --uri "..." --collection admin --type json --file data/admin.json --jsonArray --drop
  ```

### Error: "file not found"
- Ensure you're running the command from the `backend` directory
- Check that JSON files exist in `backend/data/` directory

## Collections Structure

- **admin**: Single document with username and hashed password
- **products**: Array of product documents
- **testreports**: Array of test report documents

