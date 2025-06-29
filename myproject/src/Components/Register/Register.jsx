import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { FaUser, FaLock, FaUserTag } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("SOCIETY_OFFICER");
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role");
        
        if (!token) {
            alert("You must be logged in to register staff members");
            navigate("/login");
            return;
        }
        
        if (userRole !== "ADMIN") {
            alert("Only administrators can register new staff members");
            navigate("/HomeContent");
            return;
        }
        
        setIsAdmin(true);
    }, [navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            
            const response = await fetch("http://localhost:8082/api/auth/register/staff", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ username, email, password, role }),
            });

            const data = await response.json();

            if (data.statusCode === 200) {
                alert("Staff Registration Successful!");
                navigate("/HomeContent");
            } else {
                alert(data.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Registration failed", error);
            alert("An error occurred. Please try again.");
        }
    };

    if (!isAdmin) {
        return <div className="loading">Checking permissions...</div>;
    }

    return (
        <>
        <div className="auth-background" />
        <div className="register-page-wrapper">
            <div className="Register-wrapper">
                <div className="form-box Register">
                    <form onSubmit={handleRegister}>
                        <h2>Register Staff</h2>
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <FaUser className="icon" />
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <IoMdMail className="icon" />
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <FaLock className="icon" />
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <FaLock className="icon" />
                        </div>
                        <div className="input-box">
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                                className="custom-select"
                            >
                                <option value="ADMIN">Admin</option>
                                <option value="SOCIETY_OFFICER">Society Officer</option>
                                <option value="CASHIER">Cashier</option>
                            </select>
                            <FaUserTag className="icon" />
                        </div>
                        <button type="submit">Register Staff</button>
                        <div className="Login-link">
                            <p>
                                <a href="#" onClick={() => navigate("/HomeContent")}>
                                    Back to Dashboard
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </>
    );
};

export default Register;
