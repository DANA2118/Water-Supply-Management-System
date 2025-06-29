import React, { useState, useEffect } from 'react';
import { 
  BiUpload, 
  BiCalendarCheck, 
  BiX, 
  BiCheckCircle, 
  BiAlarmExclamation,
  BiCertification
} from 'react-icons/bi';
import Header from './Header';
import Sidebar from './Sidebar';
import './Certificate.css';

const Certifications = () => {
  const [certificates, setCertificates] = useState([
    // Example data - replace with your API call
    {
      id: 'WQC-2024-001',
      certifiedDate: '2024-11-15',
      expireDate: '2025-05-15',
      imageUrl: 'https://example.com/cert1.jpg',
      status: 'active'
    },
    {
      id: 'WQC-2024-002',
      certifiedDate: '2024-12-01',
      expireDate: '2025-06-01',
      imageUrl: 'https://example.com/cert2.jpg',
      status: 'active'
    }
  ]);
  
  const [newCertificate, setNewCertificate] = useState({
    id: '',
    certifiedDate: '',
    expireDate: '',
    image: null
  });
  
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Calculate days remaining for each certificate
  const calculateDaysRemaining = (expireDate) => {
    const today = new Date();
    const expire = new Date(expireDate);
    const diffTime = expire - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCertificate({...newCertificate, image: file});
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCertificate({...newCertificate, [name]: value});
    
    // Auto-calculate expire date if certified date is set
    if (name === 'certifiedDate') {
      const certDate = new Date(value);
      const expireDate = new Date(certDate);
      expireDate.setMonth(expireDate.getMonth() + 6);
      setNewCertificate({
        ...newCertificate, 
        certifiedDate: value,
        expireDate: expireDate.toISOString().split('T')[0]
      });
    }
  };
  
  // Submit new certificate
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!newCertificate.id || !newCertificate.certifiedDate || !newCertificate.expireDate || !newCertificate.image) {
      setError('Please fill all fields and upload a certificate image');
      return;
    }
    
    // Here you would normally send to API
    // For demo, we'll just add to state
    const newCertificateWithUrl = {
      ...newCertificate,
      imageUrl: previewUrl, // In real app, this would be the URL returned from server
      status: 'active'
    };
    
    setCertificates([...certificates, newCertificateWithUrl]);
    
    // Reset form
    setNewCertificate({
      id: '',
      certifiedDate: '',
      expireDate: '',
      image: null
    });
    setPreviewUrl(null);
    setShowForm(false);
    setError('');
    setSuccessMessage('Certificate added successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  // Get status class based on days remaining
  const getStatusClass = (daysRemaining) => {
    if (daysRemaining < 0) return 'expired';
    if (daysRemaining < 30) return 'expiring-soon';
    return 'active';
  };

  return (
    <div className="certifications-page">
      <Header />
      <Sidebar />
      <main className="certifications-content">
        <div className="certifications-header">
          <h1>Water Quality Certifications</h1>
          <button 
            className="add-certificate-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add New Certificate'}
          </button>
        </div>
        
        {successMessage && (
          <div className="success-message">
            <BiCheckCircle /> {successMessage}
          </div>
        )}
        
        {showForm && (
          <div className="certificate-form-container">
            <h2>Add New Water Quality Certificate</h2>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="certificate-form">
              <div className="form-group">
                <label htmlFor="id">Certificate ID</label>
                <input 
                  type="text" 
                  id="id" 
                  name="id" 
                  value={newCertificate.id}
                  onChange={handleInputChange}
                  placeholder="e.g. WQC-2025-003"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="certifiedDate">Certification Date</label>
                  <input 
                    type="date" 
                    id="certifiedDate" 
                    name="certifiedDate" 
                    value={newCertificate.certifiedDate}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="expireDate">Expiration Date</label>
                  <input 
                    type="date" 
                    id="expireDate" 
                    name="expireDate" 
                    value={newCertificate.expireDate}
                    onChange={handleInputChange}
                    readOnly
                  />
                  <small>Auto-calculated (6 months from certification)</small>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="certificateImage">Certificate Image</label>
                <div className="file-upload-container">
                  <input 
                    type="file" 
                    id="certificateImage" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <label htmlFor="certificateImage" className="file-upload-label">
                    <BiUpload /> Choose File
                  </label>
                  <span className="file-name">
                    {newCertificate.image ? newCertificate.image.name : 'No file chosen'}
                  </span>
                </div>
              </div>
              
              {previewUrl && (
                <div className="image-preview">
                  <img src={previewUrl} alt="Certificate preview" />
                  <button 
                    type="button" 
                    className="remove-preview" 
                    onClick={() => {
                      setPreviewUrl(null);
                      setNewCertificate({...newCertificate, image: null});
                    }}
                  >
                    <BiX />
                  </button>
                </div>
              )}
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="certificates-container">
          {certificates.length === 0 ? (
            <div className="no-certificates">
              <BiCertification className="no-data-icon" />
              <p>No certificates have been added yet.</p>
              <button 
                className="add-first-certificate" 
                onClick={() => setShowForm(true)}
              >
                Add Your First Certificate
              </button>
            </div>
          ) : (
            <>
              <div className="certificates-summary">
                <div className="summary-card">
                  <div className="summary-value">{certificates.length}</div>
                  <div className="summary-label">Total Certificates</div>
                </div>
                <div className="summary-card">
                  <div className="summary-value">
                    {certificates.filter(cert => calculateDaysRemaining(cert.expireDate) >= 0).length}
                  </div>
                  <div className="summary-label">Active Certificates</div>
                </div>
                <div className="summary-card">
                  <div className="summary-value">
                    {certificates.filter(cert => calculateDaysRemaining(cert.expireDate) < 30 && calculateDaysRemaining(cert.expireDate) >= 0).length}
                  </div>
                  <div className="summary-label">Expiring Soon</div>
                </div>
                <div className="summary-card">
                  <div className="summary-value">
                    {certificates.filter(cert => calculateDaysRemaining(cert.expireDate) < 0).length}
                  </div>
                  <div className="summary-label">Expired</div>
                </div>
              </div>
              
              <div className="certificates-grid">
                {certificates.map(certificate => {
                  const daysRemaining = calculateDaysRemaining(certificate.expireDate);
                  const statusClass = getStatusClass(daysRemaining);
                  
                  return (
                    <div key={certificate.id} className={`certificate-card ${statusClass}`}>
                      <div className="certificate-header">
                        <h3>{certificate.id}</h3>
                        <div className={`certificate-status ${statusClass}`}>
                          {daysRemaining < 0 ? 'Expired' : daysRemaining < 30 ? 'Expiring Soon' : 'Active'}
                        </div>
                      </div>
                      
                      <div className="certificate-image">
                        <img 
                          src={certificate.imageUrl || 'https://via.placeholder.com/300x200?text=Certificate+Image'} 
                          alt={`Certificate ${certificate.id}`} 
                        />
                      </div>
                      
                      <div className="certificate-details">
                        <div className="detail-item">
                          <span className="detail-label">Certified:</span>
                          <span className="detail-value">
                            {new Date(certificate.certifiedDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Expires:</span>
                          <span className="detail-value">
                            {new Date(certificate.expireDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="detail-item countdown">
                          <span className="detail-label">
                            <BiCalendarCheck /> Status:
                          </span>
                          <span className={`detail-value ${statusClass}`}>
                            {daysRemaining < 0 
                              ? `Expired ${Math.abs(daysRemaining)} days ago` 
                              : `${daysRemaining} days remaining`}
                          </span>
                        </div>
                      </div>
                      
                      <div className="certificate-actions">
                        <button className="view-btn">View Full Size</button>
                        <button className="download-btn">Download</button>
                      </div>
                      
                      {daysRemaining < 30 && daysRemaining >= 0 && (
                        <div className="expiry-warning">
                          <BiAlarmExclamation /> Expiring soon! Please renew this certificate.
                        </div>
                      )}
                      
                      {daysRemaining < 0 && (
                        <div className="expiry-alert">
                          <BiAlarmExclamation /> This certificate has expired! Immediate renewal required.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Certifications;
