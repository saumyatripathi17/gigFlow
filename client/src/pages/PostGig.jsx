import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gigAPI } from '../api'

function PostGig() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await gigAPI.createGig({
        ...formData,
        budget: parseFloat(formData.budget)
      })
      setSuccess(true)
      setTimeout(() => navigate('/my-gigs'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post gig')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-2">✍️ Post a New Gig</h1>
          <p className="text-indigo-100 text-lg">Describe your project and find the right freelancer</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-3xl">
        {success && (
          <div className="bg-green-100 border-2 border-green-400 text-green-700 p-6 rounded-lg mb-8 text-center">
            ✅ Gig posted successfully! Redirecting to your gigs...
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 p-6 rounded-lg mb-8">
            ❌ {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title Field */}
            <div>
              <label className="block text-gray-700 font-bold mb-3 text-lg">📌 Job Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition text-lg"
                placeholder="e.g., Website redesign for e-commerce store"
                maxLength={100}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">5 - 100 characters</p>
                <p className="text-xs text-gray-400">{formData.title.length}/100</p>
              </div>
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-gray-700 font-bold mb-3 text-lg">📝 Job Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="10"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition resize-none"
                placeholder="Describe your project in detail:
- What needs to be done?
- What are the specific requirements?
- What technologies or tools do you prefer?
- Any deadline information?"
                maxLength={5000}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">Minimum 20 characters</p>
                <p className="text-xs text-gray-400">{formData.description.length}/5000</p>
              </div>
            </div>

            {/* Budget Field */}
            <div>
              <label className="block text-gray-700 font-bold mb-3 text-lg">💰 Budget (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-500 text-xl">$</span>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  min="1"
                  step="0.01"
                  className="w-full px-4 py-3 pl-8 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition text-lg"
                  placeholder="500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Set a realistic budget for your project</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg font-bold hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 transition transform hover:scale-105 text-lg"
            >
              {loading ? '⏳ Publishing gig...' : '🚀 Post Gig'}
            </button>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-indigo-900 mb-4">💡 Writing Tips</h3>
            <ul className="text-indigo-800 space-y-2 text-sm">
              <li>✓ Be specific and clear about requirements</li>
              <li>✓ Include timeline and delivery expectations</li>
              <li>✓ Mention any technical skills needed</li>
              <li>✓ Provide examples if helpful</li>
            </ul>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-purple-900 mb-4">🎯 Budget Guide</h3>
            <ul className="text-purple-800 space-y-2 text-sm">
              <li>✓ Small tasks: $50 - $200</li>
              <li>✓ Medium projects: $200 - $1000</li>
              <li>✓ Large projects: $1000+</li>
              <li>✓ You can edit anytime (before hiring)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostGig
