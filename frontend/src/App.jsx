import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import MinimalHome from './pages/MinimalHome'
import SimpleHome from './pages/SimpleHome'
import About from './pages/About'
import Products from './pages/Products'
import Contact from './pages/Contact'
import TestReports from './pages/TestReports'
import TestHome from './pages/TestHome'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProductManagement from './pages/admin/ProductManagement'
import TestReportManagement from './pages/admin/TestReportManagement'

// Layout component for public routes
const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Routes>
        {/* Public Routes with Header and Footer */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/minimal" element={<PublicLayout><MinimalHome /></PublicLayout>} />
        <Route path="/simple" element={<PublicLayout><SimpleHome /></PublicLayout>} />
        <Route path="/test" element={<PublicLayout><TestHome /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/test-reports" element={<PublicLayout><TestReports /></PublicLayout>} />
        {/* Admin Routes without Header and Footer */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<ProductManagement />} />
        <Route path="/admin/test-reports" element={<TestReportManagement />} />
      </Routes>
    </Router>
  )
}

export default App

