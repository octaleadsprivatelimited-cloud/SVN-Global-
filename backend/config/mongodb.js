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
      db = client.db('svnglobal') // Database name
      console.log('✅ Connected to MongoDB')
    }
    return db
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
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

