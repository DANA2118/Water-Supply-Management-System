import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { FaUser } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import { WiRaindrops } from "react-icons/wi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8082/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.statusCode === 200) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", data.username);

        navigate("/HomeContent");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <>
      <div className="auth-background" />
      <div className="login-page-wrapper">
        <div className="Login-wrapper">
          <div className="form-box login">
            <div className="logo-container">
              <h1 className="system-name">HydroNet</h1>
              <div className="tagline">Water Supply Management System</div>
            </div>
            <form onSubmit={handleLogin}>
              <h2>Officer Login</h2>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <FaUser className="icon" />
              </div>
              <div className="input-box">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <CiLock className="icon" />
              </div>

              <div className="remember-forgot">
                <label>
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#">Forgot password?</a>
              </div>

              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
