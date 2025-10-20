import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

export default function Admin() {
  const [tab, setTab] = useState('acts')
  const [acts, setActs] = useState([])
  const [venues, setVenues] = useState([])
  const [bookings, setBookings] = useState([])
  const nav = useNavigate()

  const fetchAll = async () => {
    try {
      const [a, v, b] = await Promise.all([
        api.get('/api/admin/acts'),
        api.get('/api/admin/venues'),
        api.get('/api/admin/bookings'),
      ])
      setActs(a.data); setVenues(v.data); setBookings(b.data)
    } catch (e) {
      nav('/login')
    }
  }

  useEffect(() => { fetchAll() }, [])

  const createAct = async () => {
    const name = prompt('Act name?'); if(!name) return
    await api.post('/api/admin/acts', { name, act_type: 'Band', location: 'London' })
    fetchAll()
  }

  const deleteAct = async (id) => { await api.delete('/api/admin/acts/' + id); fetchAll() }
  const createVenue = async () => {
    const name = prompt('Venue name?'); if(!name) return
    await api.post('/api/admin/venues', { name, location: 'London' })
    fetchAll()
  }
  const deleteVenue = async (id) => { await api.delete('/api/admin/venues/' + id); fetchAll() }
  const deleteBooking = async (id) => { await api.delete('/api/admin/bookings/' + id); fetchAll() }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold">Admin</h2>
      <div className="mt-4 flex gap-3">
        <button className={`btn ${tab==='acts'?'opacity-100':'opacity-50'}`} onClick={()=>setTab('acts')}>Acts</button>
        <button className={`btn ${tab==='venues'?'opacity-100':'opacity-50'}`} onClick={()=>setTab('venues')}>Venues</button>
        <button className={`btn ${tab==='bookings'?'opacity-100':'opacity-50'}`} onClick={()=>setTab('bookings')}>Bookings</button>
      </div>

      {tab==='acts' && (
        <section className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-xl">Acts</h3>
            <button className="btn" onClick={createAct}>+ New Act</button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {acts.map(a => (
              <div className="card" key={a.id}>
                <div className="font-semibold">{a.name}</div>
                <div className="text-white/70">{a.act_type} • {a.location}</div>
                <div className="mt-2 flex gap-2">
                  <button className="btn" onClick={()=>deleteAct(a.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab==='venues' && (
        <section className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-xl">Venues</h3>
            <button className="btn" onClick={createVenue}>+ New Venue</button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {venues.map(v => (
              <div className="card" key={v.id}>
                <div className="font-semibold">{v.name}</div>
                <div className="text-white/70">{v.location}</div>
                <div className="mt-2 flex gap-2">
                  <button className="btn" onClick={()=>deleteVenue(v.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab==='bookings' && (
        <section className="mt-6">
          <h3 className="font-bold text-xl mb-3">Bookings</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {bookings.map(b => (
              <div className="card" key={b.id}>
                <div className="font-semibold">{b.customer_name}</div>
                <div className="text-white/70">{b.customer_email} • {b.date}</div>
                <div className="text-white/70">{b.message}</div>
                <div className="mt-2">
                  <button className="btn" onClick={()=>deleteBooking(b.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
