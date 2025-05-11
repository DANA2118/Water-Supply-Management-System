import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import './Paymentform.css';
import Swal from "sweetalert2";
import Header from "./Header";
import { useNavigate } from 'react-router-dom';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import PaymentConfirmation from './PaymentConfirmation';

const PaymentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accountNo: '',
    customerName: '',
    invoiceId: '',
    totalamount: 0,
    balanceForPay: 0,
    paymentAmount: ''
  });
  const [error, setError] = useState('');
  const [receiptData, setReceiptData] = useState(null);

  // Called when account number field loses focus
  const handleAccountBlur = async () => {
    if (!formData.accountNo) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8082/api/invoice/getlatestinvoice/${formData.accountNo}`,
        {
          headers: { "Authorization": `Bearer ${token}` }
        }
      );
      
      setFormData(prev => ({
        ...prev,
        customerName: response.data.customerName,
        invoiceId: response.data.invoiceId,
        totalamount: response.data.totalAmount,
        balanceForPay: response.data.balanceForPay
      }));
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      setError("No outstanding invoice found for this account");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generatePDF = async (paymentData) => {
    try {
      const blob = await pdf(
        <PaymentConfirmation paymentData={paymentData} />
      ).toBlob();
      saveAs(blob, `payment_receipt_${paymentData.transactionId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      Swal.fire({
        title: "PDF Generation Error",
        text: "Could not generate receipt PDF. Please try again.",
        icon: "error"
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (error) return;
    
    // Prepare payment DTO
    const paymentDTO = {
      accountNo: parseInt(formData.accountNo),
      invoiceId: formData.invoiceId,
      paymentAmount: parseFloat(formData.paymentAmount)
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8082/api/payments/cash",
        paymentDTO,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      // Assuming the response contains payment confirmation data
      const paymentData = {
        transactionId: response.data.transactionId || "TRN" + Date.now(),
        customerName: formData.customerName,
        accountNo: formData.accountNo,
        invoiceId: formData.invoiceId,
        totalAmount: formData.totalamount,
        amountPaid: parseFloat(formData.paymentAmount),
        balanceRemaining: formData.balanceForPay - parseFloat(formData.paymentAmount),
        paymentDate: new Date().toLocaleDateString(),
        paymentTime: new Date().toLocaleTimeString()
      };
      
      setReceiptData(paymentData);
      
      Swal.fire({
        title: "Success!",
        text: "Payment processed successfully!",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Download Receipt",
        cancelButtonText: "Back to Home"
      }).then((result) => {
        if (result.isConfirmed) {
          generatePDF(paymentData);
        } else {
          navigate("/HomeContent");
        }
      });
    } catch (error) {
      if (error.response?.status === 400 && error.response.data?.data)
        Swal.fire({
          title: "Validation Error",
          text: error.response.data.data,
          icon: "warning",
        });
      else if (error.response?.status === 500)
        Swal.fire({
          title: "Server Error",
          text: "An error occurred on the server. Please try again later.",
          icon: "error",
        });
      else
        Swal.fire({
          title: "Error",
          text: "An unexpected error occurred. Please try again.",
          icon: "error",
        });
    }
  };

  return (
    <div className="paymentForm">
      <Header />
      <Sidebar />
      <div className="payment-container">
        <h2 className="payment-title">Process Payment</h2>
        <form className="payment-form" onSubmit={handleSubmit}>
          <div className="payment-row">
            <div className="payment-input-box">
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
            <div className="payment-input-box">
              <label>Customer Name:</label>
              <input
                type="text"
                name="name"
                value={formData.customerName}
                readOnly
              />
            </div>
          </div>
          
          <div className="payment-row">
            <div className="payment-input-box">
              <label>Invoice ID:</label>
              <input
                type="text"
                name="invoiceId"
                value={formData.invoiceId}
                readOnly
              />
            </div>
            <div className="payment-input-box">
              <label>Invoice Amount:</label>
              <input
                type="number"
                name="invoiceAmount"
                value={formData.totalamount}
                readOnly
              />
            </div>
          </div>
          
          <div className="payment-row">
            <div className="payment-input-box">
              <label>Balance Due:</label>
              <input
                type="number"
                name="balanceForPay"
                value={formData.balanceForPay}
                readOnly
              />
            </div>
            <div className="payment-input-box">
              <label>Payment Amount:</label>
              <input
                type="number"
                name="paymentAmount"
                value={formData.paymentAmount}
                onChange={handleChange}
                required
              />
              {error && <div className="payment-error">{error}</div>}
            </div>
          </div>
          
          <div className="payment-button-container">
            <button 
              type="submit" 
              className="payment-btn"
              disabled={!!error || !formData.accountNo || !formData.paymentAmount}
            >
              Process Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
