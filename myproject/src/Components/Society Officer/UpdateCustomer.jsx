import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "./AddCustomerForm.css";
import Header from "./Header";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const UpdateCustomer = () => {
    const { accountNo } = useParams();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState({
        name: "",
        accountNo: "",
        email: "",
        telephoneNo: "",
        meterNo: "",
        address: "",
        status: "",  // Set default values
        usertype: ""
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get(`http://localhost:8082/api/customer/get/${accountNo}`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(response => {
                setCustomer(response.data.data);
            })
            .catch(error => {
                console.error("Error fetching customer data:", error);
                alert("Failed to load customer data");
            });
    }, [accountNo]);

    const handleChange = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const handleUpdateCustomer = (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        console.log("Token:", token); // Debugging
        
        axios.put(`http://localhost:8082/api/customer/update/${customer.accountNo}`, customer, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }).then(() => {
                Swal.fire("Updated!", "Customer details updated successfully", "success")
                    .then(() => navigate("/Connection"));
            })
            .catch(error => {
                console.error("Error updating customer:", error);
                alert("Failed to update customer");
            });
    };

    return (
        <div className="addCustomer">
            <Header />
            <Sidebar />
            <div className="add-form-container">
                <form onSubmit={handleUpdateCustomer} className="customer-form">
                    <div className="row">
                        <div className="input-box">
                            <input type="text" name="name" value={customer.name} onChange={handleChange} placeholder="Name" required />
                        </div>
                        <div className="input-box">
                            <input type="text" name="accountNo" value={customer.accountNo} disabled />
                        </div>
                    </div>
                    <div className="input-box">
                        <input type="email" name="email" value={customer.email} onChange={handleChange} placeholder="Email" required />
                    </div>
                    <div className="row">
                        <div className="input-box">
                            <input type="text" name="telephoneNo" value={customer.telephoneNo} onChange={handleChange} placeholder="Phone" required />
                        </div>
                        <div className="input-box">
                            <input type="text" name="meterNo" value={customer.meterNo} onChange={handleChange} placeholder="Meter No" required />
                        </div>
                    </div>
                    <div className="input-box">
                        <input type="text" name="address" value={customer.address} onChange={handleChange} placeholder="Address" required />
                    </div>
                    <div className="row">
                        <div className="input-box">
                            <select name="status" value={customer.status} onChange={handleChange} required>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="input-box">
                            <select name="usertype" value={customer.usertype} onChange={handleChange} required>
                                <option value="Residential">Residential</option>
                                <option value="Commercial">Commercial</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="submit-btn">Update</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateCustomer;
