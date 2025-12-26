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

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/minimal" element={<MinimalHome />} />
            <Route path="/simple" element={<SimpleHome />} />
            <Route path="/test" element={<TestHome />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/test-reports" element={<TestReports />} />
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<ProductManagement />} />
            <Route path="/admin/test-reports" element={<TestReportManagement />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

