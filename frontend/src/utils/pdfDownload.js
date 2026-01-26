/**
 * Download PDF from base64 string or URL
 * @param {string} fileData - Base64 string or URL
 * @param {string} fileName - Name for the downloaded file
 */
export const downloadPDF = (fileData, fileName = 'document.pdf') => {
  if (!fileData) {
    console.error('No file data provided')
    return
  }

  // If it's a URL (starts with http://, https://, or /)
  if (fileData.startsWith('http://') || fileData.startsWith('https://') || fileData.startsWith('/')) {
    // Open URL in new tab
    window.open(fileData, '_blank')
    return
  }

  // If it's a data URL (starts with data:)
  if (fileData.startsWith('data:')) {
    // Extract base64 data
    const base64Data = fileData.split(',')[1] || fileData
    const byteCharacters = atob(base64Data)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    return
  }

  // Assume it's raw base64 string (from Firestore)
  try {
    const byteCharacters = atob(fileData)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading PDF:', error)
    // Fallback: try to open as data URL
    const dataUrl = `data:application/pdf;base64,${fileData}`
    window.open(dataUrl, '_blank')
  }
}
