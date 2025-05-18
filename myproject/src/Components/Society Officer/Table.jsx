import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { BiEdit, BiTrash } from 'react-icons/bi';
import './CustomerTable.css';

const CustomerTable = ({ searchTerm = '' }) => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [searchTerm, customers]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8082/api/customer/get", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      setCustomers(response.data);
      setFilteredCustomers(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("Failed to load customers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    if (!searchTerm.trim()) {
      setFilteredCustomers(customers);
      return;
    }

    const lowercasedTerm = searchTerm.toLowerCase();
    
    const filtered = customers.filter(customer => {
      const nameMatch = customer.name.toLowerCase().includes(lowercasedTerm);
      const accountMatch = customer.accountNo.toString().includes(lowercasedTerm);
      
      return nameMatch || accountMatch;
    });
    
    setFilteredCustomers(filtered);
  };

  const handleUpdate = (accountNo) => {
    navigate(`/update-customer/${accountNo}`);
  };

  const handleDelete = (accountNo) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      const token = localStorage.getItem("token");
      axios.delete(`http://localhost:8082/api/customer/delete/${accountNo}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      .then(() => {
        setCustomers(customers.filter(customer => customer.accountNo !== accountNo));
        setFilteredCustomers(filteredCustomers.filter(customer => customer.accountNo !== accountNo));
      })
      .catch(error => {
        console.error("Error deleting customer:", error);
        setError("Failed to delete customer. Please try again.");
      });
    }
  };

  return (
    <>
      {loading ? (
        <div className="loading-spinner">Loading customers...</div>
      ) : filteredCustomers.length === 0 ? (
        <div className="no-data-message">
          {customers.length === 0 ? 
            "No customers found. Add your first customer using the button above." : 
            "No customers match your search criteria."}
        </div>
      ) : (
        <table className="customers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Account No</th>
              <th>Meter No</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.accountNo}>
                <td>{customer.name}</td>
                <td>{customer.address}</td>
                <td>{customer.accountNo}</td>
                <td>{customer.meterNo}</td>
                <td>
                  <span className={`status-badge ${customer.status.toLowerCase()}`}>
                    {customer.status}
                  </span>
                </td>
                <td className="action-buttons">
                  <button 
                    className="action-btn edit-btn" 
                    onClick={() => handleUpdate(customer.accountNo)}
                  >
                    <BiEdit />
                  </button>
                  <button 
                    className="action-btn delete-btn" 
                    onClick={() => handleDelete(customer.accountNo)}
                  >
                    <BiTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default CustomerTable;
