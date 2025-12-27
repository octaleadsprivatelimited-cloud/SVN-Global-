# MongoDB Data Export Guide

This guide explains how to export data from MongoDB Atlas to JSON files using `mongoexport`.

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

## Quick Export Commands

### Export Admin Data
```bash
mongoexport --uri "mongodb+srv://svnglobal:<PASSWORD>@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal" \
  --collection admin \
  --type json \
  --out data/exports/admin_export.json
```

### Export Products Data
```bash
mongoexport --uri "mongodb+srv://svnglobal:<PASSWORD>@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal" \
  --collection products \
  --type json \
  --out data/exports/products_export.json
```

### Export Test Reports Data
```bash
mongoexport --uri "mongodb+srv://svnglobal:<PASSWORD>@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal" \
  --collection testreports \
  --type json \
  --out data/exports/testreports_export.json
```

## Using Export Scripts

### Windows PowerShell
```powershell
cd backend
.\scripts\export-data.ps1 -Password "Svnglobal@2025"
```

### Linux/macOS
```bash
cd backend
chmod +x scripts/export-data.sh
./scripts/export-data.sh Svnglobal@2025
```

The scripts will:
- Create a `data/exports/` directory if it doesn't exist
- Export all three collections with timestamps in filenames
- Save files as: `admin_export_YYYYMMDD_HHMMSS.json`, etc.

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

## Manual Export (Step by Step)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create exports directory:**
   ```bash
   mkdir -p data/exports
   ```

3. **Export each collection:**
   ```bash
   # Admin
   mongoexport --uri "mongodb+srv://svnglobal:<PASSWORD>@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal" --collection admin --type json --out data/exports/admin_export.json

   # Products
   mongoexport --uri "mongodb+srv://svnglobal:<PASSWORD>@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal" --collection products --type json --out data/exports/products_export.json

   # Test Reports
   mongoexport --uri "mongodb+srv://svnglobal:<PASSWORD>@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal" --collection testreports --type json --out data/exports/testreports_export.json
   ```

## Export Options

### Export with Query Filter
Export only specific documents:
```bash
mongoexport --uri "..." \
  --collection products \
  --type json \
  --out data/exports/products_filtered.json \
  --query '{"category": "Mica"}'
```

### Export Specific Fields
Export only selected fields:
```bash
mongoexport --uri "..." \
  --collection products \
  --type json \
  --out data/exports/products_fields.json \
  --fields "title,description,image"
```

### Export as CSV
Export in CSV format:
```bash
mongoexport --uri "..." \
  --collection products \
  --type csv \
  --out data/exports/products.csv \
  --fields "id,title,description"
```

### Export with Pretty Print
Format JSON output for readability:
```bash
mongoexport --uri "..." \
  --collection products \
  --type json \
  --out data/exports/products_pretty.json \
  --pretty
```

## Verify Export

After exporting, verify the files:

```bash
# Check file sizes
ls -lh data/exports/

# View first few lines of exported file
head -n 20 data/exports/products_export.json

# Count lines (documents) in exported file
wc -l data/exports/products_export.json
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

### Error: "collection does not exist"
- Verify collection name is correct (case-sensitive)
- Check that data exists in the collection
- List collections: `mongosh "..." --eval "db.getCollectionNames()"`

### Error: "file not found" or "cannot create file"
- Ensure output directory exists: `mkdir -p data/exports`
- Check write permissions in the directory
- Verify disk space is available

### Error: "no data to export"
- Collection might be empty
- Query filter might be too restrictive
- Verify data exists: `mongosh "..." --eval "db.products.count()"`

## Collections Structure

- **admin**: Single document with username and hashed password
- **products**: Array of product documents
- **testreports**: Array of test report documents

## Backup Strategy

For regular backups, you can:

1. **Schedule automated exports** using cron (Linux/macOS) or Task Scheduler (Windows)
2. **Export to timestamped files** (scripts already do this)
3. **Compress exports** to save space:
   ```bash
   tar -czf backup_$(date +%Y%m%d).tar.gz data/exports/
   ```
4. **Upload to cloud storage** (AWS S3, Google Cloud Storage, etc.)

