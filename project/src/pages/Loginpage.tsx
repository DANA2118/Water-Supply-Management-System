import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const BG_IMAGE = '/Login new.jpg'
const ICON     = '/Logo.jpg'

interface LoginForm {
  email: string
  password: string
}

interface LoginResponse {
  success: boolean
  token?: string
  message?: string
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm]       = useState<LoginForm>({ email: '', password: '' })
  const [error, setError]     = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)


  // 1) Typed change handler
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // 2) Submit handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await axios.post<LoginResponse>(
        'http://localhost:8082/auth/login',
        {
          email:    form.email,
          password: form.password
        },
        { headers: { 'Content-Type': 'application/json' } }
      )



      if (res.status === 200) {
        if (res.data.token) {
          localStorage.setItem('token', res.data.token)
        }
        navigate('/home')
      } else {
        setError(res.data.message ?? 'Login failed')
      }
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message ?? 'Network error, please try again.')
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    console.log('Current path is', window.location.pathname)
  }, [])

  return (
    <div className="w-full h-screen flex items-start">
      <div className="w-3/4 h-full flex flex-col">
        <img
          src={BG_IMAGE}
          className="w-full h-full object-cover"
          alt="background"
        />
      </div>

      <div className="w-full h-full bg-[#f5f5f5] flex flex-col p-10 justify-between items-center">
        <h1 className="w-full max-w-[650px] mx-auto text-xl text-[#060606] font-semibold mr-auto">
          HydroNet
        </h1>

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col max-w-[650px] space-y-4"
        >
          <div>
            <h3 className="text-2xl font-semibold">Login</h3>
            <p className="text-sm">Welcome back! Please enter your details.</p>
          </div>

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
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full text-black py-4 bg-transparent border-b border-black outline-none"
            required
          />

          <div className="flex justify-between items-center">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-medium underline"
            >
              Forgot Password?
            </Link>
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`
              w-full text-white py-4 font-semibold rounded-md flex justify-center items-center
              ${loading ? 'bg-gray-400' : 'bg-[#060606] hover:bg-black'}
            `}
          >
            {loading ? 'Logging in…' : 'Log in'}
          </button>

          <div className="flex items-center justify-center relative py-2">
            <div className="absolute w-full h-[1px] bg-black" />
            <span className="bg-[#f5f5f5] px-4">or</span>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 py-4 border-2 rounded-md hover:bg-gray-100"
          >
            <img src={ICON} alt="Google logo" className="h-6" />
            Sign in with Google
          </button>
        </form>

        <p className="text-sm">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-semibold underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
