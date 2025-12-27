import { connectDB, getDB, closeDB } from './config/mongodb.js'

async function testConnection() {
  try {
    console.log('🔄 Attempting to connect to MongoDB...')
    
    // Connect to MongoDB
    const db = await connectDB()
    console.log('✅ Successfully connected to MongoDB!')
    
    // Test database operations
    const collections = await db.listCollections().toArray()
    console.log('📊 Available collections:', collections.map(c => c.name))
    
    // Test a simple operation - get database name
    const dbName = db.databaseName
    console.log('📁 Database name:', dbName)
    
    // Test write operation - create a test collection and insert a document
    const testCollection = db.collection('test')
    const result = await testCollection.insertOne({
      test: true,
      timestamp: new Date(),
      message: 'MongoDB connection test successful'
    })
    console.log('✅ Test document inserted with ID:', result.insertedId)
    
    // Test read operation
    const testDoc = await testCollection.findOne({ _id: result.insertedId })
    console.log('✅ Test document retrieved:', testDoc)
    
    // Clean up - delete test document
    await testCollection.deleteOne({ _id: result.insertedId })
    console.log('🧹 Test document cleaned up')
    
    console.log('✅ All MongoDB tests passed!')
    
    // Close connection
    await closeDB()
    process.exit(0)
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error)
    console.error('Error details:', error.message)
    process.exit(1)
  }
}

testConnection()

