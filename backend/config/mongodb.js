import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

// MongoDB Connection String
// Use MONGODB_URI environment variable in production (Vercel)
// Format: mongodb+srv://username:password@cluster.mongodb.net/database?options
// Password: Svnglobal@2025 (URL encoded as %40 in connection string)
const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb+srv://svnglobal:Svnglobal%402025@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal'

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

    if (!uri) {
      throw new Error('MONGODB_URI or MONGO_URI environment variable is not set')
    }

    console.log('🔄 Creating new MongoDB connection...')
    const client = new MongoClient(uri, {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    })

    await client.connect()
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
    console.error('  1. MONGODB_URI or MONGO_URI environment variable is set')
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
