import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import './Header.css';

const TITLE_MAP = {
  '/HomeContent': 'Dashboard',
  '/Connection':   'Connections',
  '/bill':         'Bill Generate',
  '/paymentvoucher':      'Payment Voucher',
  '/certificate':  'Certificate Scheduling',
  '/AddCustomer':  'Add Customer',
  '/update-customer': 'Update Customer',

  // add more routes ↴
};

export default function Header() {
  const { pathname } = useLocation();
  const title = TITLE_MAP[pathname] || '';

  return (
    <header className="app-header">
      <div className="header-title">{title}</div>
      <div className="header-actions">
        <FaBell className="action-icon" />

        <div className="user-info">
          <div className="user-avatar">A</div>
          <div className="user-text">
            <div className="user-name">Admin User</div>
            <div className="user-role">Administrator</div>
          </div>
        </div>
      </div>
    </header>
  );
}
