import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Loginpage'     // <-- our fixed Login.tsx
import Home  from './pages/Home'
import Register from './pages/Register'
import UsageHistory from './pages/UsageHistory'
import Complaint from './pages/Complaint'
import BillPayment  from './pages/BillPayment'
import Navbar from './components/Navbar'
import BillPaymentWrapper from './pages/BillPaymentwrapper'
import Footer from './components/Footer'

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/home" element={<><Navbar /><Home /><Footer /></>}/>
      <Route path="/history" element={<><Navbar /><UsageHistory /><Footer /></>}/>
      <Route  path="/payment" element={<><Navbar /><BillPaymentWrapper /><Footer /></>}/>
      <Route path="/complaint" element={<><Navbar /><Complaint /><Footer /></>}/>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
)

export default App
