import { Link } from 'react-router-dom'

const SimpleHome = () => {
  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ fontSize: '48px', color: '#003366', marginBottom: '20px' }}>
          SVN Global
        </h1>
        <p style={{ fontSize: '24px', color: '#333', marginBottom: '40px' }}>
          Premium Mica Covers - Global Export Excellence
        </p>
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#003366', marginBottom: '20px' }}>Welcome</h2>
          <p style={{ color: '#666', lineHeight: '1.8', marginBottom: '20px' }}>
            If you can see this page, React is working correctly!
          </p>
          <Link 
            to="/test" 
            style={{ 
              display: 'inline-block', 
              padding: '12px 24px', 
              backgroundColor: '#C9A227', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '6px',
              fontWeight: 'bold'
            }}
          >
            Go to Test Page
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SimpleHome








