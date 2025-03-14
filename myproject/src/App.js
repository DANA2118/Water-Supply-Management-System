import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'remixicon/fonts/remixicon.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import HomeContent from './Components/Society Officer/HomeContent';
import Connection from './Components/Society Officer/Connection';
import Form from './Components/Society Officer/CustomerForm';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/HomeContent" element={<HomeContent />} />
      <Route path="/Connection" element={<Connection />} />
      <Route path="/AddCustomer" element={<Form />} />
    </Routes>
  );
};

export default App;