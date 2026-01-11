import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../api'

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await authAPI.register(formData)
      setSuccess(true)
      setFormData({ name: '', email: '', password: '' })
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
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
            <h2 className="text-2xl font-bold">Join Our Community</h2>
            <p className="text-indigo-100 mt-2">Create your account and start bidding</p>
          </div>

          {/* Form */}
          <div className="p-8">
            {success && (
              <div className="bg-green-100 border-2 border-green-400 text-green-700 p-4 rounded-lg mb-6 text-center text-sm">
                ✅ Registration successful! Redirecting to login...
              </div>
            )}

            {error && (
              <div className="bg-red-100 border-2 border-red-400 text-red-700 p-4 rounded-lg mb-6 text-sm">
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">👤 Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition"
                  placeholder="John Doe"
                />
              </div>

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
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 transition transform hover:scale-105 text-lg"
              >
                {loading ? '⏳ Creating account...' : '✓ Create Account'}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t-2 border-gray-200"></div>
              <span className="px-4 text-gray-500 text-sm">Already registered?</span>
              <div className="flex-1 border-t-2 border-gray-200"></div>
            </div>

            {/* Login Link */}
            <p className="text-center text-gray-700">
              <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline">
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
