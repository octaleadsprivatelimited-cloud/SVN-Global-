# MongoDB Monitoring Guide

This guide explains how to monitor your MongoDB Atlas cluster using `mongostat` and other monitoring tools.

## Prerequisites

1. **MongoDB Database Tools** installed:
   - Download from: https://www.mongodb.com/try/download/database-tools
   - Or install via package manager:
     - Windows: `choco install mongodb-database-tools`
     - macOS: `brew install mongodb-database-tools`
     - Linux: Follow MongoDB documentation

2. **MongoDB Connection String**:
   - Cluster: `svnglobal.5vlys7w.mongodb.net`
   - Username: `svnglobal`
   - Password: Your MongoDB password (URL-encoded if it contains special characters)

## Quick Monitoring Commands

### Basic mongostat (Real-time Statistics)
```bash
mongostat --uri "mongodb+srv://svnglobal:<PASSWORD>@svnglobal.5vlys7w.mongodb.net/?retryWrites=true&w=majority&appName=svnglobal" --humanReadable
```

### mongostat with Custom Interval
```bash
# Monitor every 5 seconds
mongostat --uri "mongodb+srv://svnglobal:<PASSWORD>@svnglobal.5vlys7w.mongodb.net/?retryWrites=true&w=majority&appName=svnglobal" --humanReadable 5

# Monitor every 1 second, 10 times
mongostat --uri "mongodb+srv://svnglobal:<PASSWORD>@svnglobal.5vlys7w.mongodb.net/?retryWrites=true&w=majority&appName=svnglobal" --humanReadable 1 10
```

## Using Monitoring Scripts

### Windows PowerShell
```powershell
cd backend

# Basic monitoring (unlimited)
.\scripts\monitor-mongodb.ps1 -Password "Svnglobal@2025"

# Monitor every 5 seconds
.\scripts\monitor-mongodb.ps1 -Password "Svnglobal@2025" -Interval 5

# Monitor every 1 second, 20 times
.\scripts\monitor-mongodb.ps1 -Password "Svnglobal@2025" -Interval 1 -Count 20
```

### Linux/macOS
```bash
cd backend
chmod +x scripts/monitor-mongodb.sh

# Basic monitoring (unlimited)
./scripts/monitor-mongodb.sh Svnglobal@2025

# Monitor every 5 seconds
./scripts/monitor-mongodb.sh Svnglobal@2025 5

# Monitor every 1 second, 20 times
./scripts/monitor-mongodb.sh Svnglobal@2025 1 20
```

## Understanding mongostat Output

The `mongostat` command displays real-time statistics about MongoDB operations:

### Column Descriptions

| Column | Description |
|--------|-------------|
| **insert** | Number of inserts per second |
| **query** | Number of queries per second |
| **update** | Number of updates per second |
| **delete** | Number of deletes per second |
| **getmore** | Number of getMore operations per second |
| **command** | Number of commands per second |
| **dirty** | Percentage of dirty cache (WiredTiger) |
| **used** | Percentage of cache used (WiredTiger) |
| **flushes** | Number of flushes per interval |
| **vsize** | Virtual memory size |
| **res** | Resident memory size |
| **qrw** | Queue read/write waiters |
| **arw** | Active read/write waiters |
| **net_in** | Network traffic in |
| **net_out** | Network traffic out |
| **conn** | Number of connections |

### Example Output
```
insert query update delete getmore command dirty used flushes vsize  res qrw arw net_in net_out conn                time
    *0    *0     *0     *0       0     1|0  0.0% 0.0%       0 1.00G 50M 0|0 0|0    62b   143k    2 2025-01-15T14:30:22Z
    *0    *0     *0     *0       0     1|0  0.0% 0.0%       0 1.00G 50M 0|0 0|0    62b   143k    2 2025-01-15T14:30:23Z
```

## Advanced Monitoring Options

### Monitor Specific Database
```bash
mongostat --uri "mongodb+srv://svnglobal:<PASSWORD>@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal" --humanReadable
```

### Monitor with JSON Output
```bash
mongostat --uri "mongodb+srv://svnglobal:<PASSWORD>@svnglobal.5vlys7w.mongodb.net/?retryWrites=true&w=majority&appName=svnglobal" --json
```

### Monitor Specific Collections
```bash
# Monitor operations on specific collections
mongostat --uri "mongodb+srv://svnglobal:<PASSWORD>@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal" --humanReadable --discover
```

### Monitor with Authentication
```bash
mongostat --uri "mongodb+srv://svnglobal:<PASSWORD>@svnglobal.5vlys7w.mongodb.net/?retryWrites=true&w=majority&appName=svnglobal" \
  --username svnglobal \
  --password <PASSWORD> \
  --authenticationDatabase admin \
  --humanReadable
```

## Other Monitoring Tools

### mongotop (Collection-Level Statistics)
Monitor time spent reading/writing to collections:

```bash
mongotop --uri "mongodb+srv://svnglobal:<PASSWORD>@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal" --humanReadable 5
```

#### Using mongotop Scripts

**Windows PowerShell:**
```powershell
cd backend

# Basic monitoring (unlimited)
.\scripts\mongotop-monitor.ps1 -Password "Svnglobal@2025"

# Monitor every 5 seconds
.\scripts\mongotop-monitor.ps1 -Password "Svnglobal@2025" -Interval 5

# Monitor every 1 second, 20 times
.\scripts\mongotop-monitor.ps1 -Password "Svnglobal@2025" -Interval 1 -Count 20
```

**Linux/macOS:**
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

#### Understanding mongotop Output

The `mongotop` command shows the amount of time spent reading and writing data in collections:

**Column Descriptions:**
- **ns** (namespace): Database and collection name
- **read**: Time spent on read operations (milliseconds)
- **write**: Time spent on write operations (milliseconds)
- **total**: Total time spent (read + write)

**Example Output:**
```
                    ns    total    read    write    2025-01-15T14:30:22Z
      svnglobal.admin        0ms      0ms      0ms
   svnglobal.products        5ms      3ms      2ms
svnglobal.testreports        2ms      2ms      0ms
```

This helps identify which collections are experiencing the most activity and may need optimization.

### mongosh (MongoDB Shell) - Server Status
```bash
mongosh "mongodb+srv://svnglobal:<PASSWORD>@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal"

# Then run:
db.serverStatus()
db.stats()
db.admin.find().explain("executionStats")
```

### MongoDB Atlas Dashboard
- Go to MongoDB Atlas Dashboard
- Navigate to **Metrics** tab
- View real-time performance metrics, connections, operations, etc.

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
- Full URI: `mongodb+srv://svnglobal:Svnglobal%402025@svnglobal.5vlys7w.mongodb.net/?retryWrites=true&w=majority&appName=svnglobal`

## Troubleshooting

### Error: "authentication failed"
- Check that your password is correct
- Ensure password is URL-encoded if it contains special characters
- Verify username is `svnglobal`

### Error: "network error" or "connection timeout"
- Check MongoDB Atlas Network Access settings
- Ensure your IP is whitelisted (or use `0.0.0.0/0` for all IPs)
- Verify cluster is running

### Error: "mongostat: command not found"
- Install MongoDB Database Tools
- Verify installation: `mongostat --version`
- Add MongoDB tools to your PATH if needed

### No Output or Slow Response
- Check network connectivity
- Verify cluster is not paused in MongoDB Atlas
- Check if cluster is experiencing high load
- Try increasing the interval (e.g., 5 seconds instead of 1)

## Monitoring Best Practices

1. **Regular Monitoring**: Set up periodic monitoring to track performance trends
2. **Baseline Metrics**: Establish baseline metrics during normal operations
3. **Alert Thresholds**: Set up alerts for unusual activity (high connections, slow queries, etc.)
4. **Log Analysis**: Combine with MongoDB logs for comprehensive monitoring
5. **Atlas Metrics**: Use MongoDB Atlas built-in metrics dashboard for visual monitoring

## Performance Indicators

### Healthy Metrics
- **Connections**: Stable, within cluster limits
- **Operations**: Consistent with application load
- **Memory**: Cache usage < 80%
- **Network**: Reasonable traffic for your workload

### Warning Signs
- **High connection count**: May indicate connection leaks
- **High dirty cache**: May need more memory or optimization
- **Slow queries**: Check query performance and indexes
- **Network spikes**: Monitor for unusual traffic patterns

## Continuous Monitoring

For production environments, consider:
- **MongoDB Atlas Monitoring**: Built-in monitoring and alerts
- **Third-party tools**: Datadog, New Relic, Prometheus
- **Custom scripts**: Schedule regular mongostat runs
- **Log aggregation**: Centralized logging solutions

