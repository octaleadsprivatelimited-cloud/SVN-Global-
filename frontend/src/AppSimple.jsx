import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MinimalHome from './pages/MinimalHome'

function AppSimple() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MinimalHome />} />
        <Route path="/minimal" element={<MinimalHome />} />
      </Routes>
    </Router>
  )
}

export default AppSimple








