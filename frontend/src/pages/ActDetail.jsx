import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'

export default function ActDetail() {
  const { id } = useParams()
  const [act, setAct] = useState(null)
  const [form, setForm] = useState({ customer_name: '', customer_email: '', date: '', message: '' })

  useEffect(() => {
    api.get(`/api/acts/${id}`).then(res => setAct(res.data))
  }, [id])

  const submit = async (e) => {
    e.preventDefault()
    await api.post('/api/bookings', { ...form, act_id: Number(id) })
    alert('Enquiry sent!')
    setForm({ customer_name: '', customer_email: '', date: '', message: '' })
  }

  if (!act) return <main className="max-w-4xl mx-auto px-4 py-10">Loading...</main>

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <h2 className="text-3xl font-black">{act.name}</h2>
      <p className="text-white/70">{act.description || 'A fantastic act for your event.'}</p>
      <div className="flex gap-4 text-white/80">
        <span className="px-3 py-1 rounded bg-white/10">{act.act_type}</span>
        <span className="px-3 py-1 rounded bg-white/10">{act.location}</span>
        {act.rating && <span className="px-3 py-1 rounded bg-white/10">⭐ {act.rating}</span>}
      </div>

      <form onSubmit={submit} className="card space-y-3">
        <h3 className="font-bold text-xl">Send an Enquiry</h3>
        <input className="w-full px-3 py-2 rounded bg-white/5 border border-white/10" placeholder="Your name"
          value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })} required />
        <input className="w-full px-3 py-2 rounded bg-white/5 border border-white/10" placeholder="Your email"
          value={form.customer_email} onChange={e => setForm({ ...form, customer_email: e.target.value })} required />
        <input className="w-full px-3 py-2 rounded bg-white/5 border border-white/10" placeholder="Event date (YYYY-MM-DD)"
          value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
        <textarea className="w-full px-3 py-2 rounded bg-white/5 border border-white/10" placeholder="Message"
          value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
        <button className="btn w-full">Send</button>
      </form>
    </main>
  )
}
