import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

export default function Acts() {
  const [acts, setActs] = useState([])
  useEffect(() => {
    api.get('/api/acts').then(res => setActs(res.data))
  }, [])
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Acts</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {acts.map(a => (
          <Link key={a.id} to={`/acts/${a.id}`} className="card block">
            <div className="text-lg font-semibold">{a.name}</div>
            <div className="text-white/70">{a.act_type} • {a.location}</div>
            <div className="mt-2 text-brand.primary">{a.price_from ? `From £${a.price_from}` : 'Price on request'}</div>
            {a.rating && <div className="text-white/70">⭐ {a.rating}</div>}
          </Link>
        ))}
      </div>
    </main>
  )
}
