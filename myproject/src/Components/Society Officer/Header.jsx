import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaSignOutAlt, FaCaretDown } from 'react-icons/fa';
import './Header.css';

const TITLE_MAP = {
  '/HomeContent': 'Dashboard',
  '/Connection': 'Connections',
  '/bill': 'Bill Generate',
  '/paymentvoucher': 'Payment Voucher',
  '/certificate': 'Certificate Scheduling',
  '/AddCustomer': 'Add Customer',
  '/update-customer': 'Update Customer',
  '/invoice': 'Invoices',
  '/cost': 'Payment Vouchers',
  '/reports': 'Reports',
  '/paymentform': 'Payment Form',
  '/tariffs': 'Tariffs',
};

const ROLE_DISPLAY_NAMES = {
  'ADMIN': 'Administrator',
  'SOCIETY_OFFICER': 'Society Officer',
  'CASHIER': 'Cashier',
};

export default function Header() {
  const { pathname } = useLocation();
  const title = TITLE_MAP[pathname] || '';
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username') || 'User';
    const storedRole = localStorage.getItem('role') || '';
    
    setUsername(storedUsername);
    setRole(storedRole);
  }, []);

  const avatarLetter = username ? username.charAt(0).toUpperCase() : 'U';
  const displayRole = ROLE_DISPLAY_NAMES[role] || role;

  const isAdmin = role === 'ADMIN';

  const handleRegisterStaff = () => {
    navigate('/register');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-title">{title}</div>
      <div className="header-actions">
        {isAdmin && (
          <button className="register-staff-btn" onClick={handleRegisterStaff}>
            <FaUserPlus className="btn-icon" />
            Register Staff
          </button>
        )}
        <div className="user-profile">
          <div 
            className="user-info" 
            onClick={() => setShowLogout(!showLogout)}
          >
            <div className="user-avatar">{avatarLetter}</div>
            <div className="user-text">
              <div className="user-name">{username}</div>
              <div className="user-role">{displayRole}</div>
            </div>
            <FaCaretDown className="dropdown-icon" />
          </div>
          
          {showLogout && (
            <div className="logout-menu">
              <button className="logout-button" onClick={handleLogout}>
                <FaSignOutAlt className="logout-icon" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
