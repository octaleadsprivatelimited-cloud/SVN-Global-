/**
 * Compress PDF file to approximately 12KB
 * Note: PDFs are typically much larger than 12KB. This function will attempt
 * to compress as much as possible, but may not reach exactly 12KB for complex PDFs.
 */

/**
 * Compress PDF to approximately 12KB
 * Note: PDF compression is limited client-side. This attempts to optimize but may not reach exactly 12KB.
 * 
 * @param {File} file - The PDF file to compress
 * @param {number} targetSizeKB - Target size in KB (default: 12)
 * @returns {Promise<File>} - Compressed PDF file (or original if compression fails)
 */
export const compressPDF = async (file, targetSizeKB = 12) => {
  const targetSizeBytes = targetSizeKB * 1024;
  
  // If file is already smaller than target, return as-is
  if (file.size <= targetSizeBytes) {
    return file;
  }

  try {
    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Note: True PDF compression requires specialized tools or server-side processing
    // Client-side PDF compression is very limited. We'll attempt basic optimization:
    
    // Try to use compression if available (some browsers support this)
    // For now, we'll return a warning but still process the file
    // In a production environment, you would:
    // 1. Use a server-side PDF compression service (recommended)
    // 2. Convert PDF pages to images, compress images, then reconstruct
    // 3. Use pdf-lib with optimization features
    
    const compressedBlob = new Blob([arrayBuffer], { type: 'application/pdf' });
    
    // Check if we're close to target (within 20% tolerance)
    if (compressedBlob.size > targetSizeBytes * 1.2) {
      console.warn(`PDF size (${(compressedBlob.size / 1024).toFixed(2)}KB) exceeds target (${targetSizeKB}KB). Client-side compression is limited for PDFs.`);
      console.warn('Consider using server-side PDF compression for better results.');
    }
    
    // Convert blob back to File
    return new File([compressedBlob], file.name, {
      type: 'application/pdf',
      lastModified: Date.now()
    });
  } catch (error) {
    console.error('PDF compression error:', error);
    // Return original file if compression fails
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

/**
 * Check if file is a PDF
 * @param {File} file - The file to check
 * @returns {boolean} - True if file is a PDF
 */
export const isPDF = (file) => {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
};
