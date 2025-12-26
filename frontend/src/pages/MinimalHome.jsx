const MinimalHome = () => {
  return (
    <div style={{ 
      padding: '100px 20px', 
      minHeight: '100vh', 
      backgroundColor: '#f0f0f0',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          fontSize: '48px', 
          color: '#003366', 
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          SVN Global
        </h1>
        <h2 style={{ 
          fontSize: '32px', 
          color: '#C9A227', 
          marginBottom: '30px'
        }}>
          Premium Mica Covers
        </h2>
        <p style={{ 
          fontSize: '18px', 
          color: '#333', 
          lineHeight: '1.8',
          marginBottom: '30px'
        }}>
          If you can see this text, React is working correctly!
        </p>
        <div style={{
          padding: '20px',
          backgroundColor: '#003366',
          color: 'white',
          borderRadius: '6px',
          marginTop: '20px'
        }}>
          <p style={{ margin: 0, fontSize: '16px' }}>
            This is a minimal test page to verify React rendering.
          </p>
        </div>
      </div>
    </div>
  )
}

export default MinimalHome








