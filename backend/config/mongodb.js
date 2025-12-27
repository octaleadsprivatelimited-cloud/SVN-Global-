import { MongoClient, ServerApiVersion } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

// MongoDB Connection String
// Priority: MONGODB_URI environment variable > fallback connection string
// Format: mongodb+srv://username:password@cluster.mongodb.net/database?options
// WARNING: Replace <db_password> with actual password in production!
const uri = process.env.MONGODB_URI || "mongodb+srv://svnglobal:<db_password>@svnglobal.5vlys7w.mongodb.net/?appName=svnglobal"

// Validate that connection string is provided and doesn't contain placeholder
if (!uri || uri.includes('<db_password>')) {
  const error = new Error(
    'MongoDB connection string is required. Please set MONGODB_URI environment variable or replace <db_password> in the connection string.\n' +
    'Example: mongodb+srv://username:password@cluster.mongodb.net/database?options'
  )
  console.error('❌ FATAL ERROR:', error.message)
  throw error
}

// Global connection for serverless (Vercel reuses connections)
let cachedClient = null
let cachedDb = null

export const connectDB = async () => {
  try {
    // For serverless, reuse existing connection if available
    if (cachedClient && cachedDb) {
      console.log('✅ Using cached MongoDB connection')
      return cachedDb
    }

    console.log('🔄 Creating new MongoDB connection...')
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    })

    // Attach database pool for Vercel serverless optimization (if available)
    if (process.env.VERCEL) {
      try {
        const { attachDatabasePool } = await import('@vercel/functions')
        attachDatabasePool(client)
        console.log('✅ Attached database pool for Vercel serverless optimization')
      } catch (error) {
        // @vercel/functions not available, continue without it
        console.warn('⚠️  @vercel/functions not available, continuing without database pool attachment')
      }
    }

    // Connect the client to the server (optional starting in v4.7)
    await client.connect()
    
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log('✅ Pinged your deployment. You successfully connected to MongoDB!')
    
    const db = client.db('svnglobal')

    // Cache the connection for reuse in serverless environment
    cachedClient = client
    cachedDb = db

    console.log('✅ Connected to MongoDB')
    console.log('📊 Database:', db.databaseName)

    return db
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message)
    console.error('Please check:')
    console.error('  1. MONGODB_URI environment variable is set')
    console.error('  2. MongoDB Atlas cluster is running')
    console.error('  3. Network access is allowed for your IP (or 0.0.0.0/0 for all)')
    console.error('  4. Username and password are correct')
    console.error('  5. Connection string is properly formatted')
    throw error
  }
}

export const getDB = async () => {
  try {
    if (!cachedDb) {
      await connectDB()
    }
    return cachedDb
  } catch (error) {
    console.error('Error getting DB:', error)
    throw error
  }
}

export const closeDB = async () => {
  try {
    if (cachedClient) {
      await cachedClient.close()
      cachedClient = null
      cachedDb = null
      console.log('MongoDB connection closed')
    }
  } catch (error) {
    console.error('Error closing DB:', error)
  }
}
