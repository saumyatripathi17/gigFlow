import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../authSlice'
import { authAPI } from '../api'

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await authAPI.login(formData)
      dispatch(loginSuccess(response.data.user))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-12 text-center text-white">
            <h1 className="text-4xl font-bold mb-2">🚀 GigFlow</h1>
            <h2 className="text-2xl font-bold">Welcome Back!</h2>
            <p className="text-indigo-100 mt-2">Sign in to your account</p>
          </div>

          {/* Form */}
          <div className="p-8">
            {error && (
              <div className="bg-red-100 border-2 border-red-400 text-red-700 p-4 rounded-lg mb-6 text-sm">
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">📧 Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition"
                  placeholder="your@email.com"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">🔐 Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition"
                  placeholder="••••••••"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 transition transform hover:scale-105 text-lg"
              >
                {loading ? '⏳ Signing in...' : '✓ Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t-2 border-gray-200"></div>
              <span className="px-4 text-gray-500 text-sm">New here?</span>
              <div className="flex-1 border-t-2 border-gray-200"></div>
            </div>

            {/* Register Link */}
            <p className="text-center text-gray-700">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-center text-white text-sm mt-6">
          Demo account: <span className="font-bold">user@example.com</span>
        </p>
      </div>
    </div>
  )
}

export default Login
