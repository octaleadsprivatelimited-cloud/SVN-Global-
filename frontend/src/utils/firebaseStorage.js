import { storage } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Upload file to Firebase Storage with progress tracking (optimized for speed)
 * @param {File} file - The file to upload
 * @param {string} folder - Folder path in storage (e.g., 'products', 'test-reports')
 * @param {string} fileName - Optional custom file name (without extension)
 * @param {Function} onProgress - Optional progress callback (progress: number)
 * @returns {Promise<string>} - Download URL of the uploaded file
 */
export const uploadFileToStorage = async (file, folder = 'products', fileName = null, onProgress = null) => {
  try {
    // Generate unique file name if not provided
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const finalFileName = fileName 
      ? `${fileName}_${timestamp}.${fileExtension}`
      : `${timestamp}_${randomString}.${fileExtension}`;
    
    const storageRef = ref(storage, `${folder}/${finalFileName}`);
    
    // Upload file with progress tracking (optimized for speed)
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Track upload progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          console.error('Upload error:', error);
          reject(new Error('Failed to upload file: ' + error.message));
        },
        async () => {
          // Upload completed successfully - get URL immediately
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(new Error('Failed to get download URL: ' + error.message));
          }
        }
      );
    });
  } catch (error) {
    console.error('Error uploading file to Firebase Storage:', error);
    throw new Error('Failed to upload file: ' + error.message);
  }
};

/**
 * Upload image to Firebase Storage (alias for uploadFileToStorage)
 */
export const uploadImageToStorage = async (file, folder = 'products', fileName = null, onProgress = null) => {
  return uploadFileToStorage(file, folder, fileName, onProgress);
};

/**
 * Delete file from Firebase Storage
 * @param {string} url - The download URL of the file to delete
 * @returns {Promise<void>}
 */
export const deleteImageFromStorage = async (url) => {
  try {
    // Extract file path from URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const folderIndex = pathParts.findIndex(part => part === 'o');
    if (folderIndex === -1) {
      throw new Error('Invalid Firebase Storage URL');
    }
    
    // Reconstruct path
    const encodedPath = pathParts[folderIndex + 1];
    const decodedPath = decodeURIComponent(encodedPath);
    
    const storageRef = ref(storage, decodedPath);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file from Firebase Storage:', error);
    // Don't throw - deletion failure shouldn't break the flow
    console.warn('Could not delete file from storage:', url);
  }
};

/**
 * Delete file from Firebase Storage (alias for deleteImageFromStorage)
 */
export const deleteFileFromStorage = deleteImageFromStorage;

/**
 * Extract file path from Firebase Storage URL
 * @param {string} url - Firebase Storage download URL
 * @returns {string} - File path in storage
 */
export const getStoragePathFromURL = (url) => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const folderIndex = pathParts.findIndex(part => part === 'o');
    if (folderIndex === -1) {
      return null;
    }
    const encodedPath = pathParts[folderIndex + 1];
    return decodeURIComponent(encodedPath);
  } catch (error) {
    console.error('Error extracting path from URL:', error);
    return null;
  }
};
