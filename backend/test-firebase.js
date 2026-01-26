import { getDB, checkFirebaseConnection } from './config/firebase.js'

async function testConnection() {
  try {
    console.log('🔄 Attempting to connect to Firebase...')
    
    // Test Firebase connection
    const connected = await checkFirebaseConnection()
    if (!connected) {
      throw new Error('Firebase connection check failed')
    }
    console.log('✅ Successfully connected to Firebase!')
    
    // Get Firestore instance
    const db = getDB()
    
    // Test write operation - create a test document
    const testCollection = db.collection('_test')
    const testDocRef = await testCollection.add({
      test: true,
      timestamp: new Date(),
      message: 'Firebase connection test successful'
    })
    console.log('✅ Test document created with ID:', testDocRef.id)
    
    // Test read operation
    const testDoc = await testDocRef.get()
    if (testDoc.exists) {
      console.log('✅ Test document retrieved:', { id: testDoc.id, ...testDoc.data() })
    }
    
    // Clean up - delete test document
    await testDocRef.delete()
    console.log('🧹 Test document cleaned up')
    
    // List collections (this might require admin permissions)
    try {
      const collections = await db.listCollections()
      const collectionNames = []
      for await (const collection of collections) {
        collectionNames.push(collection.id)
      }
      console.log('📊 Available collections:', collectionNames)
    } catch (error) {
      console.log('⚠️  Could not list collections (may require admin permissions):', error.message)
    }
    
    console.log('✅ All Firebase tests passed!')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error)
    console.error('Error details:', error.message)
    process.exit(1)
  }
}

testConnection()
