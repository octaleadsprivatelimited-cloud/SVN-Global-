import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import './index.css'

// Show loading message immediately
const rootElement = document.getElementById('root')
if (rootElement) {
  rootElement.innerHTML = '<div style="padding: 50px; text-align: center; font-size: 18px;">Loading...</div>'
}

console.log('Main.jsx is loading...')
console.log('Root element:', rootElement)

if (!rootElement) {
  console.error('Root element not found!')
  document.body.innerHTML = '<div style="padding: 50px; font-size: 24px; color: red;">Error: Root element not found!</div>'
} else {
  try {
    console.log('Attempting to render React app...')
    const root = ReactDOM.createRoot(rootElement)
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>,
    )
    console.log('React app rendered successfully!')
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

