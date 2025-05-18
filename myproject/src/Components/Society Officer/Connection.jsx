import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiPlus } from "react-icons/bi";
import Sidebar from "./Sidebar";
import Header from "./Header";
import SearchBar from "./Search";
import CustomerTable from "./Table";
import "./Connection.css";

const Connection = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="connection-page">
      <Header />
      <Sidebar />
      <main className="connection-content">
        <div className="connection-header">
          <div className="search-container">
            <SearchBar onSearch={handleSearch}/>
          </div>
          <button 
            className="btn btn-primary add-customer-btn"
            onClick={() => navigate("/AddCustomer")}
          >
            <BiPlus /> Add Customer
          </button>
        </div>
        
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="customer-table-container">
          <h2>Customer Details</h2>
          <CustomerTable searchTerm={searchTerm} />
        </div>
      </main>
    </div>
  );
};

export default Connection;
