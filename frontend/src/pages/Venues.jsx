import React,{useEffect,useState} from 'react'
import {Link} from 'react-router-dom'
import api from '../api'
export default function Venues(){
  const [venues,setVenues]=useState([]); const [q,setQ]=useState(''); const [location,setLocation]=useState(''); const [style,setStyle]=useState('')
  const fetch=async()=>{ const r=await api.get('/api/venues',{params:{q,location,style}}); setVenues(r.data) }
  useEffect(()=>{ fetch() },[])
  return (<main className="max-w-6xl mx-auto px-4 py-8"><h2 className="text-2xl font-bold mb-4">Venues</h2>
    <div className="card grid md:grid-cols-4 gap-3 items-end mb-6"><input placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)}/><input placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)}/><input placeholder="Style (e.g. Rustic)" value={style} onChange={e=>setStyle(e.target.value)}/><button className="btn" onClick={fetch}>Filter</button></div>
    <div className="grid md:grid-cols-3 gap-6">{venues.map(v=>(<Link key={v.id} to={`/venues/${v.slug}`} className="card block p-0 overflow-hidden">{v.image_url && <img src={v.image_url} className="w-full h-40 object-cover"/>}<div className="p-4"><div className="text-lg font-semibold">{v.name}</div><div className="text-white/70">{v.location} • {v.capacity || '?'} cap</div><div className="mt-2 text-brand-secondary">{v.price_from?`From £${v.price_from}`:'POA'}</div>{v.style && <div className="text-white/70">{v.style}</div>}</div></Link>))}</div>
  </main>)
}