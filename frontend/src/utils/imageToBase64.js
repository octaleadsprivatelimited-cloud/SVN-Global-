/**
 * Convert image file to base64 string for Firestore storage
 * @param {File} file - The image file to convert
 * @returns {Promise<string>} - Base64 encoded string
 */
export const imageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // reader.result contains the base64 string
      const base64String = reader.result;
      resolve(base64String);
    };
    reader.onerror = (error) => {
      reject(new Error('Failed to convert image to base64: ' + error.message));
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Get base64 data URL from base64 string (for display)
 * @param {string} base64String - Base64 encoded string
 * @returns {string} - Data URL for image display
 */
export const getImageDataURL = (base64String) => {
  // If already a data URL, return as-is
  if (base64String.startsWith('data:')) {
    return base64String;
  }
  // Otherwise, assume it's base64 and add data URL prefix
  // Try to detect image type from the string
  if (base64String.startsWith('/9j/') || base64String.startsWith('iVBORw0KGgo')) {
    // JPEG or PNG
    return `data:image/jpeg;base64,${base64String}`;
  }
  return `data:image/jpeg;base64,${base64String}`;
};

/**
 * Get file size in KB
 * @param {string} base64String - Base64 encoded string
 * @returns {number} - Size in KB
 */
export const getBase64SizeKB = (base64String) => {
  // Base64 is ~33% larger than original
  // Remove data URL prefix if present
  const base64Data = base64String.includes(',') 
    ? base64String.split(',')[1] 
    : base64String;
  const sizeInBytes = (base64Data.length * 3) / 4;
  return (sizeInBytes / 1024).toFixed(2);
};
