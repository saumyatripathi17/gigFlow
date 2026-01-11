import React, { useState, useEffect } from 'react'
import { bidAPI } from '../api'

function MyBids() {
  const [bids, setBids] = useState([])
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [withdrawing, setWithdrawing] = useState(null)

  useEffect(() => {
    fetchBids()
  }, [])

  const fetchBids = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await bidAPI.getUserBids()
      setBids(response.data.bids)
    } catch (err) {
      setError('Failed to fetch your bids')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async (bidId) => {
    if (!window.confirm('Are you sure you want to withdraw this bid?')) return

    setWithdrawing(bidId)

    try {
      await bidAPI.withdrawBid(bidId)
      alert('Bid withdrawn successfully!')
      fetchBids()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to withdraw bid')
    } finally {
      setWithdrawing(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600 font-semibold">Loading your bids...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 px-6">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-4xl font-bold mb-4">🎯 My Bids</h1>
          <p className="text-indigo-100 text-lg">Track and manage all your submitted bids</p>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-6 py-12">
        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 p-6 rounded-lg mb-8">
            ❌ {error}
          </div>
        )}

        {bids.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-gray-600 text-xl font-semibold mb-2">You haven't submitted any bids yet.</p>
            <p className="text-gray-500 mb-6">Start bidding on gigs to showcase your skills!</p>
            <a
              href="/"
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-bold hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-105"
            >
              🔍 Browse Available Gigs
            </a>
          </div>
        ) : (
          <>
            <div className="grid gap-6 mb-12">
              {bids.map(bid => (
                <div 
                  key={bid._id} 
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transition transform hover:shadow-xl ${
                    bid.status === 'hired'
                      ? 'border-2 border-green-400'
                      : bid.status === 'rejected'
                      ? 'border-2 border-red-300'
                      : ''
                  }`}
                >
                  <div className="p-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold text-gray-800 mb-2">
                          {bid.gigId.title}
                        </h3>
                        <p className="text-gray-600 flex items-center gap-2">
                          <span className="text-lg">💰</span> Budget: <span className="font-bold text-green-600">${bid.gigId.budget}</span>
                        </p>
                      </div>
                      <span className={`px-6 py-2 rounded-full font-bold whitespace-nowrap text-center ${
                        bid.status === 'pending' 
                          ? 'bg-yellow-200 text-yellow-700'
                          : bid.status === 'hired'
                          ? 'bg-green-200 text-green-700'
                          : 'bg-red-200 text-red-700'
                      }`}>
                        {bid.status === 'pending' && '⏱️ Pending'}
                        {bid.status === 'hired' && '✅ Hired'}
                        {bid.status === 'rejected' && '❌ Rejected'}
                      </span>
                    </div>

                    {/* Message */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6 border-l-4 border-indigo-600">
                      <p className="text-gray-700 leading-relaxed">{bid.message}</p>
                    </div>

                    {/* Bid Amount and Date */}
                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                        <p className="text-sm text-blue-600 font-semibold mb-1">💵 Your Bid</p>
                        <p className="text-3xl font-bold text-blue-600">${bid.bidPrice}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
                        <p className="text-sm text-gray-600 font-semibold mb-1">📅 Submitted On</p>
                        <p className="text-lg font-semibold text-gray-700">{new Date(bid.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col md:flex-row gap-4">
                      <a
                        href={`/gig/${bid.gigId._id}`}
                        className="flex-1 text-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-bold hover:from-blue-700 hover:to-cyan-700 transition"
                      >
                        👁️ View Gig
                      </a>

                      {bid.status === 'pending' && (
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to withdraw this bid?')) {
                              handleWithdraw(bid._id)
                            }
                          }}
                          disabled={withdrawing === bid._id}
                          className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 disabled:bg-gray-400 transition"
                        >
                          {withdrawing === bid._id ? '⏳ Withdrawing...' : '🗑️ Withdraw Bid'}
                        </button>
                      )}

                      {bid.status === 'hired' && (
                        <div className="flex-1 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 p-4 rounded-lg text-center">
                          <p className="text-green-700 font-bold text-lg">🎉 Congratulations!</p>
                          <p className="text-green-600 text-sm">You got this job!</p>
                        </div>
                      )}

                      {bid.status === 'rejected' && (
                        <div className="flex-1 bg-red-100 border-2 border-red-400 p-4 rounded-lg text-center">
                          <p className="text-red-700 font-bold">Another freelancer was chosen</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination removed — all bids are shown */}
          </>
        )}
      </div>
    </div>
  )
}

export default MyBids
