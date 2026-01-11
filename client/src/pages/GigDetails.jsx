import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { gigAPI, bidAPI } from '../api'

function GigDetails() {
  const { gigId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector(state => state.auth)
  
  const [gig, setGig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showBidForm, setShowBidForm] = useState(false)
  
  const [bidData, setBidData] = useState({
    message: '',
    bidPrice: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchGig()
  }, [gigId])

  const fetchGig = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await gigAPI.getGigById(gigId)
      setGig(response.data)
    } catch (err) {
      setError('Failed to load gig details')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleBidChange = (e) => {
    setBidData({
      ...bidData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmitBid = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await bidAPI.submitBid({
        gigId,
        message: bidData.message,
        bidPrice: parseFloat(bidData.bidPrice)
      })
      alert('Bid submitted successfully!')
      setBidData({ message: '', bidPrice: '' })
      setShowBidForm(false)
      fetchGig() // Refresh gig data
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit bid')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600 font-semibold">Loading gig details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-red-100 border-2 border-red-400 text-red-700 p-8 rounded-lg text-center">
            <p className="text-2xl mb-2">❌ Error</p>
            <p className="text-lg">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!gig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-yellow-100 border-2 border-yellow-400 text-yellow-700 p-8 rounded-lg text-center">
            <p className="text-2xl mb-2">🔍</p>
            <p className="text-lg">Gig not found</p>
          </div>
        </div>
      </div>
    )
  }

  const isOwner = isAuthenticated && user?.id === gig.ownerId._id
  const canBid = isAuthenticated && !isOwner && gig.status === 'open'

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 px-6">
        <div className="container mx-auto max-w-4xl flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:bg-white/20 px-4 py-2 rounded-lg transition"
          >
            ← Back to Gigs
          </button>
          <span className={`px-6 py-2 rounded-full font-bold text-lg ${
            gig.status === 'open' 
              ? 'bg-green-400 text-white' 
              : 'bg-gray-600 text-white'
          }`}>
            {gig.status === 'open' ? '✅ Open for Bids' : '🔒 Assigned'}
          </span>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-6 py-12">
        {/* Gig Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{gig.title}</h1>
            <div className="flex flex-wrap gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👤</span>
                <div>
                  <p className="text-xs text-gray-500">Posted by</p>
                  <p className="font-bold text-gray-800">{gig.ownerId.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">💬</span>
                <div>
                  <p className="text-xs text-gray-500">Bids Received</p>
                  <p className="font-bold text-gray-800">{gig.bidCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Card */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6 mb-8">
            <p className="text-sm text-green-600 font-semibold mb-1">💰 Project Budget</p>
            <p className="text-4xl font-bold text-green-600">${gig.budget}</p>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">📋 Job Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">{gig.description}</p>
          </div>

          {/* Owner actions */}
          {isOwner && (
            <div className="border-t pt-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">👨‍💼 Your Actions</h3>
              <button
                onClick={() => navigate(`/gig/${gigId}/bids`)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-bold hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-105 text-lg"
              >
                👀 View All Bids ({gig.bidCount})
              </button>
            </div>
          )}

          {/* Bidding form */}
          {canBid && (
            <div className="border-t pt-8 mt-8">
              {!showBidForm ? (
                <button
                  onClick={() => setShowBidForm(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-lg font-bold hover:from-green-600 hover:to-emerald-700 transition transform hover:scale-105 text-lg w-full"
                >
                  🎯 Submit Your Bid
                </button>
              ) : (
                <form onSubmit={handleSubmitBid} className="bg-blue-50 p-8 rounded-lg border-2 border-blue-200">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">✍️ Submit Your Bid</h3>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 font-bold mb-3">💬 Your Proposal Message</label>
                    <textarea
                      name="message"
                      value={bidData.message}
                      onChange={handleBidChange}
                      required
                      rows="6"
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
                      placeholder="Introduce yourself and explain why you're the best fit for this project. Highlight relevant skills and experience..."
                      minLength={10}
                      maxLength={2000}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">Minimum 10 characters</p>
                      <p className="text-xs text-gray-400">{bidData.message.length}/2000</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-gray-700 font-bold mb-3">💰 Your Bid Price</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-gray-500 text-xl">$</span>
                      <input
                        type="number"
                        name="bidPrice"
                        value={bidData.bidPrice}
                        onChange={handleBidChange}
                        required
                        min="1"
                        step="0.01"
                        className="w-full px-4 py-3 pl-8 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition text-lg"
                        placeholder="Your bid amount"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-green-500 text-white px-6 py-4 rounded-lg font-bold hover:bg-green-600 disabled:bg-gray-400 transition text-lg"
                    >
                      {submitting ? '⏳ Submitting...' : '🚀 Submit Bid'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBidForm(false)}
                      className="flex-1 bg-gray-400 text-white px-6 py-4 rounded-lg font-bold hover:bg-gray-500 transition text-lg"
                    >
                      ✕ Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {!isAuthenticated && (
            <div className="border-t pt-8 mt-8">
              <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-8 text-center">
                <p className="text-indigo-900 text-lg mb-4">
                  🔐 You need to be logged in to submit a bid
                </p>
                <a 
                  href="/login" 
                  className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:from-indigo-700 hover:to-purple-700 transition"
                >
                  Login to Continue
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GigDetails
