import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import './index.css'
// Initialize Firebase
import './config/firebase.js'

// Get root element
const rootElement = document.getElementById('root')

if (!rootElement) {
  console.error('Root element not found!')
  document.body.innerHTML = '<div style="padding: 50px; font-size: 24px; color: red;">Error: Root element not found!</div>'
} else {
  try {
    // Clear any loading message
    rootElement.innerHTML = ''
    
    const root = ReactDOM.createRoot(rootElement)
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    )
    console.log('✅ React app rendered successfully!')
  } catch (error) {
    console.error('❌ Error rendering React app:', error)
    rootElement.innerHTML = `<div style="padding: 50px; font-size: 18px; color: red;">
      <h1>React Rendering Error</h1>
      <p>${error.message}</p>
      <pre style="white-space: pre-wrap; word-wrap: break-word;">${error.stack}</pre>
      <p style="margin-top: 20px;">Check the browser console (F12) for more details.</p>
    </div>`
  }
}
