import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { bidAPI } from '../api'

function GigBids() {
  const { gigId } = useParams()
  const navigate = useNavigate()
  
  const [gigInfo, setGigInfo] = useState(null)
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hiring, setHiring] = useState(false)

  useEffect(() => {
    fetchBids()
  }, [gigId])

  const fetchBids = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await bidAPI.getBidsForGig(gigId)
      setGigInfo(response.data.gig)
      setBids(response.data.bids)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bids')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleHire = async (bidId) => {
    if (!window.confirm('Are you sure? This will reject all other bids.')) return

    setHiring(true)

    try {
      const response = await bidAPI.hireBid(bidId)
      alert(response.data.message)
      fetchBids() // Refresh bids
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to hire')
      console.error(err)
    } finally {
      setHiring(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600 font-semibold">Loading bids...</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 px-6">
        <div className="container mx-auto max-w-4xl">
          <button
            onClick={() => navigate('/my-gigs')}
            className="flex items-center gap-2 hover:bg-white/20 px-4 py-2 rounded-lg transition mb-6"
          >
            ← Back to My Gigs
          </button>
          <h1 className="text-4xl font-bold">👀 Manage Bids</h1>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-6 py-12">
        {/* Gig Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">{gigInfo?.title}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
              <p className="text-sm text-green-600 font-semibold mb-1">💰 Budget</p>
              <p className="text-3xl font-bold text-green-600">${gigInfo?.budget}</p>
            </div>
            <div className={`border-l-4 p-4 rounded ${
              gigInfo?.status === 'open'
                ? 'bg-blue-50 border-blue-600'
                : 'bg-gray-50 border-gray-600'
            }`}>
              <p className={`text-sm font-semibold mb-1 ${
                gigInfo?.status === 'open' ? 'text-blue-600' : 'text-gray-600'
              }`}>📊 Status</p>
              <span className={`inline-block px-4 py-2 rounded-full font-bold ${
                gigInfo?.status === 'open' 
                  ? 'bg-blue-200 text-blue-700' 
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {gigInfo?.status === 'open' ? '✅ Open for Bids' : '🔒 Assigned'}
              </span>
            </div>
            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded">
              <p className="text-sm text-indigo-600 font-semibold mb-1">💬 Bids Received</p>
              <p className="text-3xl font-bold text-indigo-600">{bids.length}</p>
            </div>
          </div>
        </div>

        {/* Bids List */}
        <h3 className="text-3xl font-bold text-gray-800 mb-8">
          💼 Freelancer Bids ({bids.length})
        </h3>

        {bids.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-gray-600 text-lg font-semibold">No bids received yet.</p>
            <p className="text-gray-500">Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bids.map(bid => (
              <div 
                key={bid._id} 
                className={`rounded-2xl shadow-lg overflow-hidden transition transform hover:shadow-xl ${
                  bid.status === 'hired'
                    ? 'bg-green-50 border-2 border-green-400'
                    : bid.status === 'rejected'
                    ? 'bg-red-50 border-2 border-red-300'
                    : 'bg-white'
                }`}
              >
                <div className="p-8">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                    <div>
                      <h4 className="text-2xl font-bold text-gray-800">
                        👤 {bid.freelancerId.name}
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">📧 {bid.freelancerId.email}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full font-bold text-center whitespace-nowrap ${
                      bid.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-700'
                        : bid.status === 'hired'
                        ? 'bg-green-200 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {bid.status === 'pending' && '⏱️ Pending'}
                      {bid.status === 'hired' && '✅ Hired'}
                      {bid.status === 'rejected' && '❌ Rejected'}
                    </span>
                  </div>

                  {/* Bid Message */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6 border-l-4 border-indigo-600">
                    <p className="text-gray-700 leading-relaxed">{bid.message}</p>
                  </div>

                  {/* Bid Price and Date */}
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                      <p className="text-sm text-blue-600 font-semibold mb-1">💵 Bid Price</p>
                      <p className="text-3xl font-bold text-blue-600">${bid.bidPrice}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
                      <p className="text-sm text-gray-600 font-semibold mb-1">📅 Submitted On</p>
                      <p className="text-lg font-semibold text-gray-700">{new Date(bid.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  {bid.status === 'pending' && gigInfo?.status === 'open' && (
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure? This will reject all other bids.')) {
                          handleHire(bid._id)
                        }
                      }}
                      disabled={hiring}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-lg font-bold hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 transition transform hover:scale-105 text-lg"
                    >
                      {hiring ? '⏳ Processing...' : '🎯 Hire This Freelancer'}
                    </button>
                  )}

                  {bid.status === 'hired' && (
                    <div className="bg-green-100 border-2 border-green-400 p-4 rounded-lg text-center">
                      <p className="text-green-700 font-bold text-lg">✅ This freelancer has been hired!</p>
                    </div>
                  )}

                  {bid.status === 'rejected' && (
                    <div className="bg-red-100 border-2 border-red-400 p-4 rounded-lg text-center">
                      <p className="text-red-700 font-bold text-lg">❌ Bid rejected (another freelancer was hired)</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GigBids
