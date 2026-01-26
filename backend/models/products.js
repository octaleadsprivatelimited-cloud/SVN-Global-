import { getCollection } from '../config/firebase.js'
import admin from 'firebase-admin'

const COLLECTION_NAME = 'products'

export const getProductsCollection = () => {
  return getCollection(COLLECTION_NAME)
}

// Helper function to convert Firestore Timestamp to Date or ISO string
const convertTimestamps = (data) => {
  try {
    if (!data || typeof data !== 'object') {
      return data
    }
    
    // Handle arrays
    if (Array.isArray(data)) {
      return data.map(item => convertTimestamps(item))
    }
    
    // Handle Firestore Timestamp objects
    if (data.toDate && typeof data.toDate === 'function') {
      try {
        return data.toDate().toISOString()
      } catch (e) {
        return data.toString()
      }
    }
    
    // Handle Timestamp objects with _seconds property
    if (data._seconds !== undefined) {
      try {
        const seconds = data._seconds || 0
        const nanoseconds = data._nanoseconds || 0
        return new Date(seconds * 1000 + nanoseconds / 1000000).toISOString()
      } catch (e) {
        return data.toString()
      }
    }
    
    // Handle regular objects
    const converted = {}
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        try {
          converted[key] = convertTimestamps(data[key])
        } catch (e) {
          // If conversion fails, keep original value
          converted[key] = data[key]
        }
      }
    }
    
    return converted
  } catch (error) {
    console.error('Error in convertTimestamps:', error)
    // Return original data if conversion fails
    return data
  }
}

export const getAllProducts = async () => {
  try {
    const collection = getProductsCollection()
    const snapshot = await collection.get()
    
    if (snapshot.empty) {
      return []
    }
    
    // Convert Firestore documents to array with id field and convert Timestamps
    const products = snapshot.docs.map(doc => {
      try {
        const data = doc.data()
        const converted = convertTimestamps({
          id: doc.id,
          ...data
        })
        return converted
      } catch (docError) {
        console.error(`Error processing document ${doc.id}:`, docError)
        // Return a minimal product object if conversion fails
        return {
          id: doc.id,
          title: 'Error loading product',
          description: 'Failed to load product data'
        }
      }
    })
    
    return products
  } catch (error) {
    // If Firebase is not initialized, return empty array instead of throwing
    if (error.message && error.message.includes('Firebase Admin SDK not initialized')) {
      console.warn('⚠️  Firebase not configured - returning empty products array')
      return []
    }
    console.error('Error fetching products:', error)
    console.error('Error stack:', error.stack)
    // Return empty array instead of throwing to prevent API crashes
    return []
  }
}

export const getProductById = async (id) => {
  try {
    const collection = getProductsCollection()
    const doc = await collection.doc(id).get()
    
    if (!doc.exists) {
      return null
    }
    
    const data = doc.data()
    return convertTimestamps({
      id: doc.id,
      ...data
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}

export const createProduct = async (productData) => {
  try {
    const collection = getProductsCollection()
    // Remove id if it exists (Firestore will create document ID)
    const { id, ...dataToInsert } = productData
    
    // Clean up the data - ensure arrays are properly formatted
    const cleanedData = {
      ...dataToInsert,
      features: Array.isArray(dataToInsert.features) ? dataToInsert.features : [],
      applications: Array.isArray(dataToInsert.applications) ? dataToInsert.applications : []
    }
    
    // Add timestamps
    const dataWithTimestamps = {
      ...cleanedData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }
    
    const docRef = await collection.add(dataWithTimestamps)
    const doc = await docRef.get()
    
    const data = doc.data()
    return convertTimestamps({
      id: doc.id,
      ...data
    })
  } catch (error) {
    console.error('Error creating product:', error)
    // Provide more helpful error message
    if (error.message && error.message.includes('Firebase Admin SDK not initialized')) {
      throw new Error('Firebase is not configured. Please add Firebase credentials to .env.development file.')
    }
    throw error
  }
}

export const updateProduct = async (id, productData) => {
  try {
    const collection = getProductsCollection()
    // Remove id from update data
    const { id: _, ...updateData } = productData
    
    // Add updated timestamp
    const dataWithTimestamp = {
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }
    
    const docRef = collection.doc(id)
    await docRef.update(dataWithTimestamp)
    
    const updatedDoc = await docRef.get()
    
    if (!updatedDoc.exists) {
      return null
    }
    
    const data = updatedDoc.data()
    return convertTimestamps({
      id: updatedDoc.id,
      ...data
    })
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

export const deleteProduct = async (id) => {
  try {
    const collection = getProductsCollection()
    await collection.doc(id).delete()
    return true
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}
