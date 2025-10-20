import React,{useEffect,useState} from 'react'
import {Link} from 'react-router-dom'
import api from '../api'
export default function Acts(){
  const [acts,setActs]=useState([]); const [q,setQ]=useState(''); const [location,setLocation]=useState(''); const [type,setType]=useState(''); const [genre,setGenre]=useState('')
  const fetchActs=async()=>{ const r=await api.get('/api/acts',{params:{q,location,act_type:type,genre}}); setActs(r.data) }
  useEffect(()=>{ fetchActs() },[])
  return (<main className="max-w-6xl mx-auto px-4 py-8"><h2 className="text-2xl font-bold mb-4">Acts</h2>
    <div className="card grid md:grid-cols-5 gap-3 items-end mb-6">
      <input placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)}/>
      <input placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)}/>
      <select value={type} onChange={e=>setType(e.target.value)}><option value="">Any type</option><option>Band</option><option>DJ</option><option>Magician</option><option>Singer</option></select>
      <input placeholder="Genre (e.g. Pop)" value={genre} onChange={e=>setGenre(e.target.value)}/>
      <button className="btn" onClick={fetchActs}>Filter</button>
    </div>
    <div className="grid md:grid-cols-3 gap-6">{acts.map(a=>(<Link key={a.id} to={`/acts/${a.slug}`} className="card block p-0 overflow-hidden">{a.image_url && <img src={a.image_url} className="w-full h-40 object-cover"/>}<div className="p-4"><div className="text-lg font-semibold">{a.name}</div><div className="text-white/70">{a.act_type} • {a.location}</div><div className="mt-2 text-brand-primary">{a.price_from?`From £${a.price_from}`:'Price on request'}</div>{a.genres && <div className="mt-2 text-white/60 text-sm">{a.genres}</div>}</div></Link>))}</div>
  </main>)
}