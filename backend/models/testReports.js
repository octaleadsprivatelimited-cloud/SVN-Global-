import { getDB } from '../config/mongodb.js'
import { MongoClient, ObjectId } from 'mongodb'

export const getTestReportsCollection = async () => {
  const db = await getDB()
  return db.collection('testReports')
}

export const getAllTestReports = async () => {
  try {
    const collection = await getTestReportsCollection()
    const reports = await collection.find({}).sort({ date: -1 }).toArray()
    // Convert _id to id for compatibility
    return reports.map(report => ({
      ...report,
      id: report._id.toString()
    }))
  } catch (error) {
    console.error('Error fetching test reports:', error)
    throw error
  }
}

export const getTestReportById = async (id) => {
  try {
    const collection = await getTestReportsCollection()
    const report = await collection.findOne({ _id: new ObjectId(id) })
    if (report) {
      return {
        ...report,
        id: report._id.toString()
      }
    }
    return null
  } catch (error) {
    console.error('Error fetching test report:', error)
    throw error
  }
}

export const createTestReport = async (reportData) => {
  try {
    const collection = await getTestReportsCollection()
    // Remove id if it exists (MongoDB will create _id)
    const { id, ...dataToInsert } = reportData
    const result = await collection.insertOne(dataToInsert)
    return {
      ...dataToInsert,
      _id: result.insertedId,
      id: result.insertedId.toString()
    }
  } catch (error) {
    console.error('Error creating test report:', error)
    throw error
  }
}

export const updateTestReport = async (id, reportData) => {
  try {
    const collection = await getTestReportsCollection()
    // Remove id from update data
    const { id: _, ...updateData } = reportData
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    if (result) {
      return {
        ...result,
        id: result._id.toString()
      }
    }
    return null
  } catch (error) {
    console.error('Error updating test report:', error)
    throw error
  }
}

export const deleteTestReport = async (id) => {
  try {
    const collection = await getTestReportsCollection()
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  } catch (error) {
    console.error('Error deleting test report:', error)
    throw error
  }
}

