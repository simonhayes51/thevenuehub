import React,{useEffect,useState} from 'react'
import {Link} from 'react-router-dom'
import api from '../api'
export default function Home(){
  const [acts,setActs]=useState([]); const [venues,setVenues]=useState([])
  useEffect(()=>{ api.get('/api/featured/acts').then(r=>setActs(r.data)); api.get('/api/featured/venues').then(r=>setVenues(r.data)) },[])
  return (<main className="max-w-6xl mx-auto px-4">
    <section className="py-16 text-center">
      <h1 className="text-4xl md:text-6xl font-black leading-tight">Book incredible <span className="text-brand-primary">entertainers</span> & <span className="text-brand-secondary">venues</span></h1>
      <p className="text-white/70 mt-4 max-w-2xl mx-auto">A modern, fast, entertainment-first hub with reviews, galleries and clear pricing.</p>
      <div className="mt-8 flex justify-center gap-4"><Link to="/acts" className="btn">Find Acts</Link><Link to="/venues" className="btn">Explore Venues</Link><Link to="/join" className="btn">List Your Act</Link></div>
    </section>
    <section className="grid md:grid-cols-2 gap-6">
      <div className="card"><h3 className="font-bold text-xl mb-3">🔥 Trending Acts</h3><div className="grid sm:grid-cols-2 gap-4">
        {acts.map(a=> (<Link to={`/acts/${a.slug}`} className="card p-0 overflow-hidden" key={a.id}>{a.image_url && <img src={a.image_url} className="w-full h-32 object-cover"/>}<div className="p-3"><div className="font-semibold">{a.name}</div><div className="text-white/70 text-sm">{a.act_type} • {a.location}</div></div></Link>))}
      </div></div>
      <div className="card"><h3 className="font-bold text-xl mb-3">🏛️ Featured Venues</h3><div className="grid sm:grid-cols-2 gap-4">
        {venues.map(v=> (<Link to={`/venues/${v.slug}`} className="card p-0 overflow-hidden" key={v.id}>{v.image_url && <img src={v.image_url} className="w-full h-32 object-cover"/>}<div className="p-3"><div className="font-semibold">{v.name}</div><div className="text-white/70 text-sm">{v.location}</div></div></Link>))}
      </div></div>
    </section>
  </main>)
}