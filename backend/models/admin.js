import { getDB } from '../config/mongodb.js'
import bcrypt from 'bcryptjs'

export const getAdminCollection = async () => {
  const db = await getDB()
  return db.collection('admin')
}

export const getAdmin = async () => {
  try {
    const collection = await getAdminCollection()
    const admin = await collection.findOne({})
    return admin
  } catch (error) {
    console.error('Error fetching admin:', error)
    throw error
  }
}

export const createOrUpdateAdmin = async (username, password) => {
  try {
    const collection = await getAdminCollection()
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const admin = await collection.findOneAndUpdate(
      {},
      { 
        $set: { 
          username,
          password: hashedPassword,
          updatedAt: new Date()
        },
        $setOnInsert: { createdAt: new Date() }
      },
      { 
        upsert: true,
        returnDocument: 'after'
      }
    )
    
    return admin
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

