import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Droplets, History, CreditCard } from 'lucide-react';

function Navbar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600';
  };

  return (
    <nav className="bg-cyan-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
            <Droplets className="h-8 w-8 text-blue-800" />
              <span className="ml-2 text-xl font-bold text-white">HydroNet</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            <Link to="/home" className={`flex items-center px-4 py-2 rounded-lg bg-neutral-50 hover:bg-cyan-800 hover:text-white ${isActive('/')}`}>
              <span>Home</span>
            </Link>
            <Link to="/history" className={`flex items-center px-4 py-2 rounded-lg bg-neutral-50 hover:bg-cyan-800 hover:text-white ${isActive('/history')}`}>
              <History className="h-5 w-5 mr-1" />
              <span>Usage History</span>
            </Link>
            <Link to="/payment" className={`flex items-center px-4 py-2 rounded-lg bg-neutral-50 hover:bg-cyan-800 hover:text-white ${isActive('/payment')}`}>
              <CreditCard className="h-5 w-5 mr-1" />
              <span>Pay Bill</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;