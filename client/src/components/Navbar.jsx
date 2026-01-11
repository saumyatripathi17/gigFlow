import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../authSlice'
import { authAPI } from '../api'

function Navbar() {
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      dispatch(logout())
      navigate('/')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-3xl font-bold hover:opacity-80 transition">
            <span>🚀</span>
            <span>GigFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/" className="hover:text-indigo-200 font-medium transition">
              Browse Gigs
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/post-gig" className="hover:text-indigo-200 font-medium transition">
                  ➕ Post a Gig
                </Link>
                <Link to="/my-gigs" className="hover:text-indigo-200 font-medium transition">
                  My Gigs
                </Link>
                <Link to="/my-bids" className="hover:text-indigo-200 font-medium transition">
                  My Bids
                </Link>

                <div className="flex items-center gap-4 pl-4 border-l border-indigo-400">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">👤 {user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 font-bold transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/register" className="bg-green-500 px-5 py-2 rounded-lg hover:bg-green-600 font-bold transition">
                  Register
                </Link>
                <Link to="/login" className="bg-indigo-700 px-5 py-2 rounded-lg hover:bg-indigo-800 font-bold transition">
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setShowMenu(!showMenu)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="md:hidden mt-4 pb-4 border-t border-indigo-400 pt-4 flex flex-col gap-3">
            <Link to="/" className="hover:text-indigo-200 font-medium">
              Browse Gigs
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/post-gig" className="hover:text-indigo-200 font-medium">
                  ➕ Post a Gig
                </Link>
                <Link to="/my-gigs" className="hover:text-indigo-200 font-medium">
                  My Gigs
                </Link>
                <Link to="/my-bids" className="hover:text-indigo-200 font-medium">
                  My Bids
                </Link>
                <div className="pt-2 border-t border-indigo-400">
                  <p className="text-sm mb-2">👤 {user?.name}</p>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 font-bold"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/register" className="w-full text-center bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 font-bold">
                  Register
                </Link>
                <Link to="/login" className="w-full text-center bg-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-800 font-bold">
                  Login
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
