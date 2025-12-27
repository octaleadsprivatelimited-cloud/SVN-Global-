import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

// MongoDB Connection String
// Format: mongodb+srv://username:password@cluster.mongodb.net/database?options
// Password with @ symbol should be URL encoded as %40
const uri = process.env.MONGODB_URI || 'mongodb+srv://svnglobal:Svnglobal%402025@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal'

let client = null
let db = null

export const connectDB = async () => {
  try {
    if (!client) {
      client = new MongoClient(uri)
      await client.connect()
      // Database name is already in the URI, but we can also specify it explicitly
      db = client.db('svnglobal')
      console.log('✅ Connected to MongoDB')
      console.log('📊 Database:', db.databaseName)
    }
    return db
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message)
    console.error('Please check:')
    console.error('  1. MongoDB Atlas cluster is running')
    console.error('  2. Network access is allowed for your IP')
    console.error('  3. Username and password are correct')
    console.error('  4. Connection string is properly formatted')
    throw error
  }
}

export const getDB = () => {
  if (!db) {
    throw new Error('Database not connected. Call connectDB() first.')
  }
  return db
}

export const closeDB = async () => {
  if (client) {
    await client.close()
    client = null
    db = null
    console.log('MongoDB connection closed')
  }
}

