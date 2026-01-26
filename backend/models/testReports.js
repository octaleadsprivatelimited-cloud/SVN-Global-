import { getCollection } from '../config/firebase.js'
import admin from 'firebase-admin'

const COLLECTION_NAME = 'testReports'

export const getTestReportsCollection = () => {
  return getCollection(COLLECTION_NAME)
}

// Helper function to convert Firestore Timestamp to Date or ISO string
const convertTimestamps = (data) => {
  if (!data || typeof data !== 'object') {
    return data
  }
  
  const converted = { ...data }
  
  for (const key in converted) {
    if (converted[key] && typeof converted[key] === 'object') {
      // Check if it's a Firestore Timestamp
      if (converted[key].toDate && typeof converted[key].toDate === 'function') {
        converted[key] = converted[key].toDate().toISOString()
      } else if (converted[key]._seconds !== undefined) {
        // Handle Timestamp objects that might not have toDate method
        const seconds = converted[key]._seconds || 0
        const nanoseconds = converted[key]._nanoseconds || 0
        converted[key] = new Date(seconds * 1000 + nanoseconds / 1000000).toISOString()
      } else if (Array.isArray(converted[key])) {
        // Recursively convert arrays
        converted[key] = converted[key].map(item => convertTimestamps(item))
      } else if (converted[key] !== null && typeof converted[key] === 'object') {
        // Recursively convert nested objects
        converted[key] = convertTimestamps(converted[key])
      }
    }
  }
  
  return converted
}

export const getAllTestReports = async () => {
  try {
    const collection = getTestReportsCollection()
    let snapshot
    
    // Try to order by date, fallback to no ordering if index doesn't exist
    try {
      snapshot = await collection.orderBy('date', 'desc').get()
    } catch (error) {
      // If ordering fails (no index), fetch without ordering and sort in memory
      console.warn('Could not order by date (index may not exist), fetching all and sorting in memory')
      snapshot = await collection.get()
      // Sort in memory by date descending
      const reports = snapshot.docs.map(doc => {
        const data = doc.data()
        return convertTimestamps({
          id: doc.id,
          ...data
        })
      })
      return reports.sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : new Date(0)
        const dateB = b.date ? new Date(b.date) : new Date(0)
        return dateB - dateA
      })
    }
    
    if (snapshot.empty) {
      return []
    }
    
    // Convert Firestore documents to array with id field and convert Timestamps
    return snapshot.docs.map(doc => {
      const data = doc.data()
      return convertTimestamps({
        id: doc.id,
        ...data
      })
    })
  } catch (error) {
    console.error('Error fetching test reports:', error)
    throw error
  }
}

export const getTestReportById = async (id) => {
  try {
    const collection = getTestReportsCollection()
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
    console.error('Error fetching test report:', error)
    throw error
  }
}

export const createTestReport = async (reportData) => {
  try {
    const collection = getTestReportsCollection()
    // Remove id if it exists (Firestore will create document ID)
    const { id, ...dataToInsert } = reportData
    
    // Add timestamps
    const dataWithTimestamps = {
      ...dataToInsert,
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
    console.error('Error creating test report:', error)
    throw error
  }
}

export const updateTestReport = async (id, reportData) => {
  try {
    const collection = getTestReportsCollection()
    // Remove id from update data
    const { id: _, ...updateData } = reportData
    
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
    console.error('Error updating test report:', error)
    throw error
  }
}

export const deleteTestReport = async (id) => {
  try {
    const collection = getTestReportsCollection()
    await collection.doc(id).delete()
    return true
  } catch (error) {
    console.error('Error deleting test report:', error)
    throw error
  }
}
