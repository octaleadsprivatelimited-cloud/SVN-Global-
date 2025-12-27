#!/bin/bash
# MongoDB Collection-Level Monitoring Script using mongotop
# Usage: ./mongotop-monitor.sh <PASSWORD> [interval] [count]
# Example: ./mongotop-monitor.sh Svnglobal@2025 1 10
#          (monitors every 1 second, 10 times)

PASSWORD=$1
INTERVAL=${2:-1}  # Default: 1 second
COUNT=${3:-0}     # Default: 0 (unlimited)

if [ -z "$PASSWORD" ]; then
  echo "❌ Error: Password is required"
  echo "Usage: ./mongotop-monitor.sh <PASSWORD> [interval] [count]"
  echo "Example: ./mongotop-monitor.sh Svnglobal@2025 1 10"
  echo ""
  echo "Arguments:"
  echo "  PASSWORD  - MongoDB password"
  echo "  interval  - Sampling interval in seconds (default: 1)"
  echo "  count     - Number of samples (default: 0 = unlimited)"
  exit 1
fi

# URL encode the password (replace @ with %40)
ENCODED_PASSWORD=$(echo "$PASSWORD" | sed 's/@/%40/g')
URI="mongodb+srv://svnglobal:${ENCODED_PASSWORD}@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal"

echo "🔄 Starting MongoDB collection-level monitoring..."
echo "📊 Database: svnglobal"
echo "📁 Cluster: svnglobal.5vlys7w.mongodb.net"
echo "⏱️  Interval: ${INTERVAL} second(s)"
if [ "$COUNT" -gt 0 ]; then
  echo "🔢 Samples: ${COUNT}"
else
  echo "🔢 Samples: Unlimited (Press Ctrl+C to stop)"
fi
echo ""
echo "Press Ctrl+C to stop monitoring"
echo ""

# Build mongotop command
CMD="mongotop --uri \"${URI}\" --humanReadable"

if [ "$INTERVAL" != "1" ]; then
  CMD="${CMD} ${INTERVAL}"
fi

if [ "$COUNT" -gt 0 ]; then
  CMD="${CMD} ${COUNT}"
fi

# Execute mongotop
eval $CMD

