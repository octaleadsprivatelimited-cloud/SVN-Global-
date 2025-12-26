import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import './index.css'

// Get root element
const rootElement = document.getElementById('root')

if (!rootElement) {
  // If root element doesn't exist, create it
  const newRoot = document.createElement('div')
  newRoot.id = 'root'
  document.body.appendChild(newRoot)
  
  const root = ReactDOM.createRoot(newRoot)
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  )
} else {
  try {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    )
  } catch (error) {
    console.error('Error rendering React app:', error)
    rootElement.innerHTML = `<div style="padding: 50px; font-size: 18px; color: red;">
      <h1>React Rendering Error</h1>
      <p>${error.message}</p>
      <pre style="white-space: pre-wrap; word-wrap: break-word;">${error.stack}</pre>
      <p style="margin-top: 20px;">Check the browser console (F12) for more details.</p>
    </div>`
  }
}
