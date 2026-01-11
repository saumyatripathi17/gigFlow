import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gigAPI } from '../api'

function Home() {
  const [gigs, setGigs] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchGigs()
  }, [search])

  const fetchGigs = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await gigAPI.getAllGigs({ search })
      setGigs(response.data.gigs)
    } catch (err) {
      setError('Failed to fetch gigs')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">
            Find Your Next Project 🎯
          </h1>
          <p className="text-xl text-indigo-100">
            Connect with talented freelancers and get your projects done
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Search by job title or description..."
              value={search}
              onChange={handleSearch}
              className="w-full px-6 py-4 border-2 border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 text-lg shadow-lg transition"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 p-4 rounded-lg mb-8 text-center">
            ❌ {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-gray-600 text-lg">Loading amazing gigs...</p>
          </div>
        ) : gigs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <p className="text-2xl text-gray-600 mb-4">📭 No gigs found</p>
            <p className="text-gray-500">Try searching with different keywords!</p>
          </div>
        ) : (
          <>
            {/* Gigs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {gigs.map(gig => (
                <div
                  key={gig._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-300"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 text-white">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold flex-1 line-clamp-2">{gig.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-2 ${
                        gig.status === 'open'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {gig.status === 'open' ? '✓ Open' : '✗ Assigned'}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <p className="text-gray-700 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {gig.description}
                    </p>

                    {/* Budget and Bids */}
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Budget</p>
                        <p className="text-3xl font-bold text-green-600">${gig.budget}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-xs mb-1">Bids</p>
                        <p className="text-2xl font-bold text-indigo-600">{gig.bidCount}</p>
                      </div>
                    </div>

                    {/* Posted By */}
                    <p className="text-sm text-gray-600 mb-4">
                      <span className="font-semibold">Posted by:</span> {gig.ownerId.name}
                    </p>

                    {/* View Button */}
                    <Link
                      to={`/gig/${gig._id}`}
                      className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-105"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination removed — all gigs are shown */}
          </>
        )}
      </div>
    </div>
  )
}

export default Home
