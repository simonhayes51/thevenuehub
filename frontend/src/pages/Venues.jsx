import React, { useEffect, useState } from 'react'
import api from '../api'

export default function Venues() {
  const [venues, setVenues] = useState([])
  useEffect(() => { api.get('/api/venues').then(res => setVenues(res.data)) }, [])
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Venues</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {venues.map(v => (
          <div key={v.id} className="card">
            <div className="text-lg font-semibold">{v.name}</div>
            <div className="text-white/70">{v.location} • {v.capacity || '?'} cap</div>
            <div className="mt-2 text-brand.secondary">{v.price_from ? `From £${v.price_from}` : 'Price on request'}</div>
            {v.style && <div className="text-white/70">{v.style}</div>}
          </div>
        ))}
      </div>
    </main>
  )
}
