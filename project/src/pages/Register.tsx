// src/pages/Register.tsx

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import IMAGE from '/Login new.jpg';
import ICON  from '/Logo.jpg';

interface RegisterForm {
  accountNo: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface RegisterResponse {
  success: boolean;
  message?: string;
  // if your backend returns more (e.g. a token), you can add it here
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({
    accountNo: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError]     = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        accountNo: Number(form.accountNo),  // your backend expects an integer
        email:      form.email,
        username:   form.username,
        password:   form.password,
      };
      const res = await axios.post<RegisterResponse>(
        'http://localhost:8082/auth/register',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (res.data.success) {
        setSuccess(res.data.message || 'Registered successfully! Redirecting to login…');
        // wait a moment then navigate
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(res.data.message || 'Registration failed.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-start">
      {/* Left: form */}
      <div className="w-full h-full bg-[#f5f5f5] flex flex-col p-10 justify-between items-center">
        <h1 className="w-full max-w-[650px] mx-auto text-xl text-[#060606] font-semibold mr-auto">
          HydroNet
        </h1>

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col max-w-[650px] space-y-4"
        >
          <div>
            <h3 className="text-2xl font-semibold mb-1">Register</h3>
            <p className="text-sm mb-4">Create your account by filling in the information below.</p>
          </div>

          <input
            name="accountNo"
            type="text"
            placeholder="Account No"
            value={form.accountNo}
            onChange={handleChange}
            className="w-full text-black py-4 bg-transparent border-b border-black outline-none"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full text-black py-4 bg-transparent border-b border-black outline-none"
            required
          />
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full text-black py-4 bg-transparent border-b border-black outline-none"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full text-black py-4 bg-transparent border-b border-black outline-none"
            required
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full text-black py-4 bg-transparent border-b border-black outline-none"
            required
          />

          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}

          <button
            type="submit"
            disabled={loading}
            className={`
              w-full text-white py-4 font-semibold rounded-md flex justify-center items-center
              ${loading ? 'bg-gray-400' : 'bg-[#060606] hover:bg-black'}
            `}
          >
            {loading ? 'Registering…' : 'Register'}
          </button>
        </form>

        <div className="w-full flex items-center justify-center">
          <p className="text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Right: illustration */}
      <div className="w-3/4 h-full flex flex-col">
        <img src={IMAGE} className="w-full h-full object-cover" alt="register illustration" />
      </div>
    </div>
  );
};

export default Register;
