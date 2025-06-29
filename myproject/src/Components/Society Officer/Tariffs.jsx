import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BiPlus, BiCalendar, BiDollar, BiBuildings } from 'react-icons/bi';
import Header from './Header';
import Sidebar from './Sidebar';
import './Tariffs.css';

const Tariffs = () => {
  const [tariffs, setTariffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    effectiveDate: '',
    ratePerUnit: '',
    usertype: 'Residential',
    fixedCharge: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchTariffs();
  }, []);

  const fetchTariffs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8082/api/tariff/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTariffs(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tariffs:', err);
      setError('Failed to load tariffs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
      const tariffData = {
        ...formData,
        ratePerUnit: parseFloat(formData.ratePerUnit),
        fixedCharge: parseFloat(formData.fixedCharge)
      };
      
      await axios.post('http://localhost:8082/api/tariff/create', tariffData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setSuccessMessage('Tariff added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      setFormData({
        effectiveDate: '',
        ratePerUnit: '',
        usertype: 'Residential',
        fixedCharge: ''
      });
      
      setShowForm(false);
      
      fetchTariffs();
    } catch (err) {
      console.error('Error adding tariff:', err);
      setError('Failed to add tariff. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="tariffs-page">
      <Header />
      <Sidebar />
      <main className="tariffs-content">
        <div className="tariffs-header">
          <button 
            className="btn btn-primary add-tariff-btn"
            onClick={() => setShowForm(!showForm)}
          >
            <BiPlus /> {showForm ? 'Cancel' : 'Add New Tariff'}
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
        
        {showForm && (
          <div className="tariff-form-container">
            <h2>Add New Tariff</h2>
            <form onSubmit={handleSubmit} className="tariff-form">
              <div className="form-group">
                <label htmlFor="effectiveDate">
                  <BiCalendar /> Effective Date
                </label>
                <input
                  type="date"
                  id="effectiveDate"
                  name="effectiveDate"
                  value={formData.effectiveDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="ratePerUnit">
                  <BiDollar /> Rate Per Unit (LKR)
                </label>
                <input
                  type="number"
                  id="ratePerUnit"
                  name="ratePerUnit"
                  value={formData.ratePerUnit}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="usertype">
                  <BiBuildings /> User Type
                </label>
                <select
                  id="usertype"
                  name="usertype"
                  value={formData.usertype}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="fixedCharge">
                  <BiDollar /> Fixed Charge (LKR)
                </label>
                <input
                  type="number"
                  id="fixedCharge"
                  name="fixedCharge"
                  value={formData.fixedCharge}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Tariff
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="tariffs-table-container">
          <h2>Current Tariffs</h2>
          
          {loading ? (
            <div className="loading-spinner">Loading tariffs...</div>
          ) : tariffs.length === 0 ? (
            <div className="no-data-message">
              No tariffs found. Add your first tariff using the button above.
            </div>
          ) : (
            <table className="tariffs-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Effective Date</th>
                  <th>User Type</th>
                  <th>Rate Per Unit (LKR)</th>
                  <th>Fixed Charge (LKR)</th>
                </tr>
              </thead>
              <tbody>
                {tariffs.map(tariff => (
                  <tr key={tariff.id}>
                    <td>{tariff.id}</td>
                    <td>{formatDate(tariff.effectiveDate)}</td>
                    <td>
                      <span className={`user-type ${tariff.usertype.toLowerCase()}`}>
                        {tariff.usertype}
                      </span>
                    </td>
                    <td className="numeric">{tariff.ratePerUnit.toFixed(2)}</td>
                    <td className="numeric">{tariff.fixedCharge.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default Tariffs;
