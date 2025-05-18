import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import './BillForm.css';
import Swal from "sweetalert2";
import Header from "./Header";
import { useNavigate } from 'react-router-dom';

const BillForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accountNo: '',
    name: '',
    previousReading: 0,
    officerId: '',
    presentReading: '',
    readingId: '',
    fixedAmount: '', 
    additionalCharges: 0,
    otherCharges: 0,
    totalamount: 0,
    balanceforpay: 0,
  });
  const [error, setError] = useState('')

  const [isPreviousReadingEditable, setIsPreviousReadingEditable] = useState(false);

  // Called when account number field loses focus
  const handleAccountBlur = async () => {
    if (!formData.accountNo) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8082/api/invoice/getcustomer/${formData.accountNo}`,
        {
          headers: { "Authorization": `Bearer ${token}` }
        }
      );
      setFormData(prev => ({
        ...prev,
        name: response.data.name,
        previousReading: response.data.previousReading,
        fixedAmount: response.data.FixedCharge
      }));

      setIsPreviousReadingEditable(
        response.data.previousReading === 0 ||
        response.data.previousReading === null ||
        response.data.previousReading === ''
      );
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };

  useEffect(() => {
    if (formData.previousReading === null) return
    if (formData.presentReading === '') {
      setError('')
    } else if (parseInt(formData.presentReading, 10) < parseInt(formData.previousReading, 10)) {
      setError(`Present reading should be greater than ${formData.previousReading}`)
    } else {
      setError('')
    }
  }, [formData.presentReading, formData.previousReading])

  // Called when present reading field loses focus
  const handleCalculationBlur = async () => {
    if (!formData.presentReading || !formData.previousReading) return;
    try {
      const token = localStorage.getItem("token");
      const payload = {
        accountNo: parseInt(formData.accountNo),
        presentReading: parseInt(formData.presentReading),
        previousReading: parseInt(formData.previousReading),
        additionalcharge: parseFloat(formData.additionalCharges),
        othercharges: parseFloat(formData.otherCharges)
      };
      const response = await axios.post(
        "http://localhost:8082/api/invoice/calculate",
        payload,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      setFormData(prev => ({
        ...prev,
        totalamount: response.data.totalamount,
        balanceforpay: response.data.balanceforpay
      }));
    } catch (error) {
      console.error("Error calculating invoice amounts:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare invoice DTO from formData
    const invoiceDTO = {
      accountNo: parseInt(formData.accountNo),
      presentReading: parseInt(formData.presentReading),
      previousReading: parseInt(formData.previousReading),
      additionalcharge: parseFloat(formData.additionalCharges),
      othercharges: parseFloat(formData.otherCharges),
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8082/api/invoice/generate",
        invoiceDTO,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      Swal.fire({
        title: "Success!",
        text: "Invoice generated successfully!",
        icon: "success",
        confirmButtonText: "Ok",
      }).then(() => {
        navigate("/HomeContent");
      });
    } catch (error) {
      if (error.response?.status === 400 && error.response.data?.data)
        Swal.fire({
          title: "Validation Error",
          text: error.response.data.data,
          icon: "warning",
        })
      else if (error.response?.status === 500)
        Swal.fire({
          title: "Server Error",
          text: "An error occurred on the server. Please try again later.",
          icon: "error",
        })
      else
        Swal.fire({
          title: "Error",
          text: "An unexpected error occurred. Please try again.",
          icon: "error",
        });
    }
  };

  return (
    <div className="billForm">
      <Header />
      <Sidebar />
      <div className="form-container">
        <form className="Bill-form" onSubmit={handleSubmit}>
          <div className="row">

            <div className="input-box">
              <label>Account No:</label>
              <input
                type="text"
                name="accountNo"
                value={formData.accountNo}
                onChange={handleChange}
                onBlur={handleAccountBlur}
                required
              />
            </div>
            <div className="input-box">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                readOnly
              />
            </div>
          </div>
          <div className="row">
            <div className="input-box">
              <label>Previous Reading:</label>
              <input
                type="number"
                name="previousReading"
                value={formData.previousReading}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    previousReading: e.target.value
                  }))
                }
                readOnly={!isPreviousReadingEditable}
                placeholder="Enter previous reading"
                required
              />
              {isPreviousReadingEditable && (
                <small className="helper-text">No previous reading found. Please enter manually.</small>
              )}
            </div>
            <div className="input-box">
              <label>Present Reading:</label>
              <input
                type="number"
                name="presentReading"
                value={formData.presentReading}
                onChange={handleChange}
                onBlur={handleCalculationBlur}
                required
              />
              {error && <div className="error">{error}</div>}
            </div>
          </div>
          <div className="row">
            <div className="input-box">
              <label>Fixed Amount:</label>
              <input
                type="number"
                name="fixedAmount"
                value={formData.fixedAmount}
                readOnly
              />
            </div>
            <div className="input-box">
              <label>Additional Charges:</label>
              <input
                type="number"
                name="additionalCharges"
                value={formData.additionalCharges}
                onChange={handleChange}
                onBlur={handleCalculationBlur}
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="input-box">
              <label>Other Charges:</label>
              <input
                type="number"
                name="otherCharges"
                value={formData.otherCharges}
                onChange={handleChange}
                onBlur={handleCalculationBlur}
                required
              />
            </div>
            <div className="input-box">
              <label>Total Amount:</label>
              <input
                type="number"
                name="totalAmount"
                value={formData.totalamount}
                readOnly
              />
            </div>
          </div>
          <div className="row">
            <div className="input-box">
              <label>Balance for Pay:</label>
              <input
                type="number"
                name="balanceForPay"
                value={formData.balanceforpay}
                readOnly
              />
            </div>
          </div>
          <div className="button-container">
            <button type="submit" className="generate-btn">
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BillForm;
