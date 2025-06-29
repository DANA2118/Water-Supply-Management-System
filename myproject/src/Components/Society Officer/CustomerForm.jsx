import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./AddCustomerForm.css"; 
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AddCustomerForm = () => {
  const[name, setCustomerName] = useState("");
  const[accountNo, setAccountNumber] = useState("");
  const[email, setEmail] = useState("");
  const[telephoneNo, setPhoneNumber] = useState("");
  const[meterNo, setMeterNumber] = useState("");
  const[address, setAddress] = useState("");
  const[status, setStatus] = useState("");
  const[usertype, setUserType] = useState("");

  const navigate = useNavigate();

  const handleAddCustomer = (e) => {
    e.preventDefault();

    try{
      const token = localStorage.getItem("token"); 
      axios.post("http://localhost:8082/api/customer/save",{
        name: name,
        accountNo: accountNo,
        email: email,
        telephoneNo: telephoneNo,
        meterNo: meterNo,
        address: address,
        status: status,
        usertype: usertype
      },{
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      Swal.fire({
        title: "Success!",
        text: "Customer added successfully!",
        icon: "success",
        confirmButtonText: "Ok",
      }).then(() => {
        navigate("/Connection");
      });
    }
    catch(error){
      console.error("Error adding customer:", error);
      alert("Failed to add customer");
    }

  };

  return (
    <div className="addCustomer">
      <Header />
      <Sidebar />
      <div className="add-form-container">
        <form className="customer-form" onSubmit={handleAddCustomer}>
          <div className="row">
            <div className="input-box">
              <input type="text" placeholder="Customer Name" value={name} onChange={(e) => setCustomerName(e.target.value)} required />
            </div>
            <div className="input-box">
              <input type="text" placeholder="Account Number" value={accountNo} onChange={(e) => setAccountNumber(e.target.value)} required />
            </div>
          </div>

          <div className="input-box">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="row">
            <div className="input-box">
              <input type="text" placeholder="Phone Number" value={telephoneNo} onChange={(e) => setPhoneNumber(e.target.value)} required />
            </div>
            <div className="input-box">
              <input type="text" placeholder="Meter Number" value={meterNo} onChange={(e) => setMeterNumber(e.target.value)} required />
            </div>
          </div>

          <div className="input-box">
            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>

          <div className="row">
            <div className="input-box">
              <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                <option value="" disabled selected>Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="input-box">
              <select required value={usertype} onChange={(e) => setUserType(e.target.value)}>
                <option value="" disabled selected>User Type</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
          </div>

          <button type="submit" className="submit-btn">Add Customer</button>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerForm;
