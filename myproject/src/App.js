
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'remixicon/fonts/remixicon.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import './index.css'; 

import Register from './Components/Register/Register';
import Login    from './Components/Login/Login';
import HomeContent   from './Components/Society Officer/HomeContent';
import Connection    from './Components/Society Officer/Connection';
import AddCustomerForm from './Components/Society Officer/CustomerForm';
import UpdateCustomer  from './Components/Society Officer/UpdateCustomer';
import Invoice        from './Components/Society Officer/Invoice';
import BillForm        from './Components/Society Officer/BillForm';
import Cost           from './Components/Society Officer/Cost';
import Paymentvoucher from './Components/Society Officer/paymentvoucher';
import PaymentForm   from './Components/Society Officer/Paymentform';
import Reports  from './Components/Society Officer/Reports';


const App = () => {
  const { pathname } = useLocation();
  
  // if we're on login or register, use the image bg
  const isAuthPage = pathname === '/login' || pathname === '/register';
  
  return (
    <div className={isAuthPage ? 'auth-background' : 'app-background'}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/HomeContent"     element={<HomeContent />} />
        <Route path="/Connection"      element={<Connection />} />
        <Route path="/AddCustomer"     element={<AddCustomerForm />} />
        <Route path="/update-customer/:accountNo" element={<UpdateCustomer />} />
        <Route path="/invoice"            element={<Invoice />} />
        <Route path="/bill"              element={<BillForm />} />
        <Route path="/paymentform"       element={<PaymentForm />} />
        <Route path="/cost"              element={<Cost />} />
        <Route path='/paymentvoucher' element={<Paymentvoucher/>}/>
        <Route path='/reports' element={<Reports/>}/>
      </Routes>
    </div>
  );
};

export default App;
