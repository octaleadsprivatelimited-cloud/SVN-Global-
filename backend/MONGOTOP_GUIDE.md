# MongoDB mongotop Guide

This guide explains how to use `mongotop` to monitor collection-level read/write activity in your MongoDB Atlas cluster.

## What is mongotop?

`mongotop` is a MongoDB utility that provides a real-time view of the amount of time spent reading and writing data in collections. It's similar to the Unix `top` command but for MongoDB collections.

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

## Quick mongotop Commands

### Basic mongotop (Collection-Level Statistics)
```bash
mongotop --uri "mongodb+srv://svnglobal:<PASSWORD>@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal" --humanReadable
```

### mongotop with Custom Interval
```bash
# Monitor every 5 seconds
mongotop --uri "mongodb+srv://svnglobal:<PASSWORD>@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal" --humanReadable 5

# Monitor every 1 second, 10 times
mongotop --uri "mongodb+srv://svnglobal:<PASSWORD>@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal" --humanReadable 1 10
```

## Using mongotop Scripts

### Windows PowerShell
```powershell
cd backend

# Basic monitoring (unlimited, press Ctrl+C to stop)
.\scripts\mongotop-monitor.ps1 -Password "Svnglobal@2025"

# Monitor every 5 seconds
.\scripts\mongotop-monitor.ps1 -Password "Svnglobal@2025" -Interval 5

# Monitor every 1 second, 20 times
.\scripts\mongotop-monitor.ps1 -Password "Svnglobal@2025" -Interval 1 -Count 20
```

### Linux/macOS
```bash
cd backend
chmod +x scripts/mongotop-monitor.sh

# Basic monitoring (unlimited)
./scripts/mongotop-monitor.sh Svnglobal@2025

# Monitor every 5 seconds
./scripts/mongotop-monitor.sh Svnglobal@2025 5

# Monitor every 1 second, 20 times
./scripts/mongotop-monitor.sh Svnglobal@2025 1 20
```

## Understanding mongotop Output

The `mongotop` command displays real-time statistics about time spent on read and write operations per collection:

### Column Descriptions

| Column | Description |
|--------|-------------|
| **ns** (namespace) | Database and collection name (e.g., `svnglobal.products`) |
| **total** | Total time spent on read and write operations (milliseconds) |
| **read** | Time spent on read operations (milliseconds) |
| **write** | Time spent on write operations (milliseconds) |
| **timestamp** | Time of the sample |

### Example Output
```
                    ns    total    read    write    2025-01-15T14:30:22Z
      svnglobal.admin        0ms      0ms      0ms
   svnglobal.products       15ms     10ms      5ms
svnglobal.testreports        3ms      3ms      0ms
```

### Interpreting Results

- **High read time**: Collection is being read frequently, may need indexes
- **High write time**: Collection is being written to frequently, may need optimization
- **High total time**: Collection is very active, consider sharding or optimization
- **Zero time**: Collection is not being accessed during the monitoring period

## Advanced mongotop Options

### Monitor Specific Collections
```bash
# Monitor only specific collections (use --locks option)
mongotop --uri "mongodb+srv://svnglobal:<PASSWORD>@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal" --humanReadable --locks
```

### Export to File
```bash
# Save output to file
mongotop --uri "mongodb+srv://svnglobal:<PASSWORD>@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal" --humanReadable 5 10 > mongotop_output.txt
```

### JSON Output
```bash
mongotop --uri "mongodb+srv://svnglobal:<PASSWORD>@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal" --json 5
```

### Monitor with Locks Information
```bash
mongotop --uri "mongodb+srv://svnglobal:<PASSWORD>@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal" --locks --humanReadable
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

## Use Cases

### 1. Identify Hot Collections
Find which collections are most active:
```bash
mongotop --uri "..." --humanReadable 5 10
```
Look for collections with consistently high `total` time.

### 2. Optimize Read Performance
If a collection shows high `read` time:
- Check if indexes exist: `db.collection.getIndexes()`
- Analyze slow queries: `db.collection.find().explain("executionStats")`
- Consider adding indexes on frequently queried fields

### 3. Optimize Write Performance
If a collection shows high `write` time:
- Check write concern settings
- Consider bulk operations instead of individual writes
- Review document structure and size

### 4. Monitor During Load Testing
Run mongotop during load tests to see which collections are bottlenecks:
```bash
mongotop --uri "..." --humanReadable 1 60 > load_test_results.txt
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

### Error: "mongotop: command not found"
- Install MongoDB Database Tools
- Verify installation: `mongotop --version`
- Add MongoDB tools to your PATH if needed

### No Output or All Zeros
- Collections may not be actively accessed during monitoring period
- Try longer monitoring intervals
- Verify database name is correct in connection string
- Check if collections exist: `mongosh "..." --eval "db.getCollectionNames()"`

### High Time Values
If you see consistently high time values:
1. Check for missing indexes
2. Review query patterns
3. Consider collection optimization
4. Check MongoDB Atlas performance advisor

## Best Practices

1. **Regular Monitoring**: Monitor collections periodically to identify trends
2. **Baseline Metrics**: Establish baseline metrics during normal operations
3. **Compare Periods**: Compare mongotop results during different times (peak vs. off-peak)
4. **Combine with mongostat**: Use both tools for comprehensive monitoring
5. **Document Findings**: Keep records of monitoring sessions for analysis

## Comparison: mongostat vs mongotop

| Tool | Focus | Use Case |
|------|-------|----------|
| **mongostat** | Server-level statistics | Overall database performance, connections, operations |
| **mongotop** | Collection-level statistics | Identify which collections are most active |

**Use both tools together** for comprehensive MongoDB monitoring:
- `mongostat` for overall health
- `mongotop` for collection-specific optimization

## Integration with Other Tools

### Combine with mongostat
```bash
# Terminal 1: Server-level monitoring
mongostat --uri "..." --humanReadable

# Terminal 2: Collection-level monitoring
mongotop --uri "..." --humanReadable
```

### Export and Analyze
```bash
# Export mongotop data
mongotop --uri "..." --humanReadable 5 60 > collection_activity.txt

# Analyze with grep/awk
grep "products" collection_activity.txt | awk '{sum+=$2} END {print "Total time:", sum, "ms"}'
```

## Continuous Monitoring

For production environments:
- **Schedule regular mongotop runs** to track collection activity over time
- **Set up alerts** for collections with consistently high activity
- **Use MongoDB Atlas Metrics** for visual monitoring
- **Combine with application logs** to correlate collection activity with user actions

