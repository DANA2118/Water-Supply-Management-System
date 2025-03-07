import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { FaUser, FaLock } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

const Register = () => {
    const [username, setUsername] = useState(""); 
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState(""); 
    const [confirmPassword, setConfirmPassword] = useState(""); 
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault(); 

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://localhost:8082/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (data.statusCode === 200) {
                alert("Registration Successful! Redirecting to login...");
                navigate("/login"); 
            } else {
                alert(data.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Registration failed", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="Register-wrapper">
            <div className="form-box Register">
                <form onSubmit={handleRegister}>
                    <h2>Register</h2>
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
                    <button type="submit">Register</button>
                    <div className="Login-link">
                        <p>
                            Already have an account?{" "}
                            <a href="#" onClick={() => navigate("/login")}>
                                Login
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
