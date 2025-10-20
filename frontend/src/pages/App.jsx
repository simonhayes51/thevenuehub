import React from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './Home'
import Acts from './Acts'
import Venues from './Venues'
import ActDetail from './ActDetail'
import Admin from './Admin'
import Login from './Login'

export default function App() {
  return (
    <div>
      <nav className="sticky top-0 z-50 backdrop-blur bg-black/40 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/" className="font-extrabold text-xl">🎭 VenueHub</Link>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/acts" className="hover:underline">Acts</Link>
            <Link to="/venues" className="hover:underline">Venues</Link>
            <Link to="/admin" className="btn">Admin</Link>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/acts" element={<Acts />} />
        <Route path="/acts/:id" element={<ActDetail />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <footer className="mt-10 border-t border-white/10 py-6 text-center text-white/60">
        © {new Date().getFullYear()} VenueHub
      </footer>
    </div>
  )
}
