import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-4">
      <section className="py-14 text-center">
        <h1 className="text-4xl md:text-6xl font-black leading-tight">
          Book incredible <span className="text-brand.primary">entertainers</span> & <span className="text-brand.secondary">venues</span>
        </h1>
        <p className="text-white/70 mt-4 max-w-2xl mx-auto">
          A modern, fast, entertainment‑first hub. Find bands, DJs, magicians, and stunning venues — all in one place.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/acts" className="btn">Find Acts</Link>
          <Link to="/venues" className="btn">Explore Venues</Link>
        </div>
      </section>
      <section className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-bold text-xl mb-2">🔥 Trending Acts</h3>
          <ul className="space-y-2 text-white/80">
            <li>Neon Nights Band — 4.8★ — From £800</li>
            <li>DJ Vortex — 4.6★ — From £500</li>
            <li>The Close‑Up Magician — 4.9★ — From £350</li>
          </ul>
        </div>
        <div className="card">
          <h3 className="font-bold text-xl mb-2">🏛️ Featured Venues</h3>
          <ul className="space-y-2 text-white/80">
            <li>The Grand Hall — Newcastle — From £1500</li>
            <li>Coastal View Barn — Sunderland — From £900</li>
            <li>City Lights Loft — Leeds — From £600</li>
          </ul>
        </div>
      </section>
    </main>
  )
}
