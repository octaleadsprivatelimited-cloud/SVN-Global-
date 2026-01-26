/**
 * Admin Model - Legacy/Migration Only
 * 
 * NOTE: This model is NOT used for authentication in the main application.
 * Authentication is now handled by Firebase Auth (see frontend/src/config/firebase.js).
 * 
 * This model is kept for:
 * - Migration scripts (migrate-to-firebase.js)
 * - Legacy admin credential management (update-admin.js)
 * 
 * For new admin users, create them directly in Firebase Console → Authentication → Users
 */
import { getCollection } from '../config/firebase.js'
import bcrypt from 'bcryptjs'
import admin from 'firebase-admin'

const COLLECTION_NAME = 'admin'

export const getAdminCollection = () => {
  return getCollection(COLLECTION_NAME)
}

export const getAdmin = async () => {
  try {
    const collection = getAdminCollection()
    const snapshot = await collection.limit(1).get()
    
    if (snapshot.empty) {
      return null
    }
    
    const doc = snapshot.docs[0]
    return {
      id: doc.id,
      ...doc.data()
    }
  } catch (error) {
    console.error('Error fetching admin:', error)
    throw error
  }
}

export const createOrUpdateAdmin = async (username, password) => {
  try {
    const collection = getAdminCollection()
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Check if admin document exists
    const snapshot = await collection.limit(1).get()
    
    if (snapshot.empty) {
      // Create new admin document
      const dataWithTimestamps = {
        username,
        password: hashedPassword,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }
      
      const docRef = await collection.add(dataWithTimestamps)
      const doc = await docRef.get()
      
      return {
        id: doc.id,
        ...doc.data()
      }
    } else {
      // Update existing admin document
      const doc = snapshot.docs[0]
      const docRef = collection.doc(doc.id)
      
      await docRef.update({
        username,
        password: hashedPassword,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      })
      
      const updatedDoc = await docRef.get()
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      }
    }
  } catch (error) {
    console.error('Error creating/updating admin:', error)
    throw error
  }
}

export const verifyAdminPassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword)
  } catch (error) {
    console.error('Error verifying password:', error)
    throw error
  }
}
