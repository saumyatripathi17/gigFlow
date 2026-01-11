import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import GigDetails from './pages/GigDetails'
import PostGig from './pages/PostGig'
import MyGigs from './pages/MyGigs'
import MyBids from './pages/MyBids'
import GigBids from './pages/GigBids'

function App() {
  const { isAuthenticated } = useSelector(state => state.auth)

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gig/:gigId" element={<GigDetails />} />
        
        {/* Protected Routes */}
        <Route path="/post-gig" element={isAuthenticated ? <PostGig /> : <Navigate to="/login" />} />
        <Route path="/my-gigs" element={isAuthenticated ? <MyGigs /> : <Navigate to="/login" />} />
        <Route path="/my-bids" element={isAuthenticated ? <MyBids /> : <Navigate to="/login" />} />
        <Route path="/gig/:gigId/bids" element={isAuthenticated ? <GigBids /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
