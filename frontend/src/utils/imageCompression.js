import imageCompression from 'browser-image-compression';

/**
 * Compress image to approximately 12KB
 * @param {File} file - The image file to compress
 * @param {boolean} fastMode - If true, prioritizes speed (targets ~15KB), otherwise strict 12KB
 * @returns {Promise<File>} - Compressed image file
 */
export const compressImage = async (file, fastMode = false) => {
  // Skip compression if file is already at or below 12KB
  if (file.size <= 12288) { // 12KB threshold
    return file;
  }

  if (fastMode) {
    // Fast mode: Target ~15KB for speed, but try to get close to 12KB
    const fastOptions = {
      maxSizeMB: 0.012, // 12KB target
      maxWidthOrHeight: 800, // Medium resolution for balance
      useWebWorker: true,
      fileType: 'image/jpeg',
      initialQuality: 0.4, // Moderate quality
      alwaysKeepResolution: false,
    };

    try {
      let result = await imageCompression(file, fastOptions);
      
      // If still above 15KB, do another pass with more aggressive settings
      if (result.size > 15360) { // 15KB
        const aggressiveOptions = {
          maxSizeMB: 0.012,
          maxWidthOrHeight: 600,
          useWebWorker: true,
          fileType: 'image/jpeg',
          initialQuality: 0.3,
          alwaysKeepResolution: false,
        };
        result = await imageCompression(file, aggressiveOptions);
      }
      
      return result;
    } catch (error) {
      console.error('Fast compression error:', error);
      return file;
    }
  }

  // Standard mode: Strict 12KB target with multiple passes if needed
  const options = {
    maxSizeMB: 0.012, // 12KB target
    maxWidthOrHeight: 800,
    useWebWorker: true,
    fileType: 'image/jpeg',
    initialQuality: 0.5,
    alwaysKeepResolution: false,
  };

  try {
    let compressedFile = await imageCompression(file, options);
    
    // If still above 12KB, do another pass with more aggressive settings
    if (compressedFile.size > 12288) {
      const aggressiveOptions = {
        maxSizeMB: 0.012,
        maxWidthOrHeight: 600,
        useWebWorker: true,
        fileType: 'image/jpeg',
        initialQuality: 0.3,
        alwaysKeepResolution: false,
      };
      compressedFile = await imageCompression(file, aggressiveOptions);
    }
    
    // Final pass if still too large
    if (compressedFile.size > 12288) {
      const finalOptions = {
        maxSizeMB: 0.012,
        maxWidthOrHeight: 500,
        useWebWorker: true,
        fileType: 'image/jpeg',
        initialQuality: 0.25,
        alwaysKeepResolution: false,
      };
      compressedFile = await imageCompression(file, finalOptions);
    }
    
    return compressedFile;
  } catch (error) {
    console.error('Image compression error:', error);
    return file;
  }
};

/**
 * Get file size in KB
 * @param {File} file - The file
 * @returns {number} - File size in KB
 */
export const getFileSizeKB = (file) => {
  return (file.size / 1024).toFixed(2);
};
