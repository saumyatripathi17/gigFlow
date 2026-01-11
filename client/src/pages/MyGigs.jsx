import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gigAPI } from '../api'

function MyGigs() {
  const [gigs, setGigs] = useState([])
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    fetchGigs()
  }, [])

  const fetchGigs = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await gigAPI.getUserGigs()
      setGigs(response.data.gigs)
    } catch (err) {
      setError('Failed to fetch your gigs')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (gigId) => {
    if (!window.confirm('Are you sure? This will also delete all bids for this gig.')) return

    setDeleting(gigId)

    try {
      await gigAPI.deleteGig(gigId)
      alert('Gig deleted successfully!')
      fetchGigs()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete gig')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600 font-semibold">Loading your gigs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 px-6">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-4xl font-bold mb-4">📋 My Posted Gigs</h1>
          <p className="text-indigo-100 text-lg">Manage all your project listings here</p>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-6 py-12">
        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 p-6 rounded-lg mb-8">
            ❌ {error}
          </div>
        )}

        {/* Post New Gig Button */}
        <div className="mb-8">
          <Link
            to="/post-gig"
            className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-lg font-bold hover:from-green-600 hover:to-emerald-700 transition transform hover:scale-105 text-lg"
          >
            ✍️ Post a New Gig
          </Link>
        </div>

        {gigs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-gray-600 text-xl font-semibold mb-2">You haven't posted any gigs yet.</p>
            <p className="text-gray-500 mb-6">Start by posting your first gig to attract freelancers!</p>
            <Link
              to="/post-gig"
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-bold hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-105"
            >
              📝 Post Your First Gig
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-6 mb-12">
              {gigs.map(gig => (
                <div 
                  key={gig._id} 
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transition transform hover:shadow-xl ${
                    gig.status === 'open' ? '' : 'border-l-4 border-gray-400'
                  }`}
                >
                  <div className="p-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold text-gray-800 mb-2">{gig.title}</h3>
                        <p className="text-gray-600 line-clamp-2 text-lg">{gig.description}</p>
                      </div>
                      <span className={`px-6 py-2 rounded-full font-bold whitespace-nowrap text-center ${
                        gig.status === 'open' 
                          ? 'bg-green-200 text-green-700' 
                          : 'bg-gray-300 text-gray-700'
                      }`}>
                        {gig.status === 'open' ? '✅ Open' : '🔒 Assigned'}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                      <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                        <p className="text-sm text-green-600 font-semibold mb-1">💰 Budget</p>
                        <p className="text-3xl font-bold text-green-600">${gig.budget}</p>
                      </div>
                      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                        <p className="text-sm text-blue-600 font-semibold mb-1">💬 Bids Received</p>
                        <p className="text-3xl font-bold text-blue-600">{gig.bidCount}</p>
                      </div>
                      <div className={`border-l-4 p-4 rounded ${
                        gig.status === 'open'
                          ? 'bg-indigo-50 border-indigo-600'
                          : 'bg-gray-50 border-gray-400'
                      }`}>
                        <p className={`text-sm font-semibold mb-1 ${
                          gig.status === 'open' ? 'text-indigo-600' : 'text-gray-600'
                        }`}>📊 Status</p>
                        <p className={`text-lg font-bold ${
                          gig.status === 'open' ? 'text-indigo-600' : 'text-gray-600'
                        }`}>
                          {gig.status === 'open' ? 'Accepting Bids' : 'Assigned'}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col md:flex-row gap-4">
                      <Link
                        to={`/gig/${gig._id}`}
                        className="flex-1 text-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-bold hover:from-blue-700 hover:to-cyan-700 transition"
                      >
                        👁️ View Details
                      </Link>

                      {gig.status === 'open' && (
                        <>
                          <Link
                            to={`/gig/${gig._id}/bids`}
                            className="flex-1 text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition"
                          >
                            👀 Bids ({gig.bidCount})
                          </Link>

                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure? This will also delete all bids for this gig.')) {
                                handleDelete(gig._id)
                              }
                            }}
                            disabled={deleting === gig._id}
                            className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 disabled:bg-gray-400 transition"
                          >
                            {deleting === gig._id ? '⏳ Deleting...' : '🗑️ Delete'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination removed — all user gigs are shown */}
          </>
        )}
      </div>
    </div>
  )
}

export default MyGigs
