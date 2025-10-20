import React,{useEffect,useState} from 'react'
import {useParams} from 'react-router-dom'
import api from '../api'
export default function ActDetail(){
  const {slug}=useParams(); const [act,setAct]=useState(null); const [reviews,setReviews]=useState([])
  const [form,setForm]=useState({customer_name:'',customer_email:'',date:'',message:''})
  useEffect(()=>{ api.get(`/api/acts/${slug}`).then(r=>setAct(r.data)); api.get('/api/reviews').then(r=>setReviews(r.data)) },[slug])
  const submit=async(e)=>{ e.preventDefault(); await api.post('/api/bookings',{...form, act_id: act.id}); alert('Enquiry sent!'); setForm({customer_name:'',customer_email:'',date:'',message:''}) }
  if(!act) return <main className="max-w-4xl mx-auto px-4 py-10">Loading...</main>
  const itemReviews = reviews.filter(r=>r.act_id===act.id)
  return (<main className="max-w-4xl mx-auto px-4 py-10 space-y-6">
    <div className="rounded-xl overflow-hidden">{act.image_url && <img src={act.image_url} className="w-full h-64 object-cover"/>}</div>
    <h2 className="text-3xl font-black">{act.name}</h2>
    <div className="flex gap-2 flex-wrap"><span className="badge">{act.act_type}</span><span className="badge">{act.location}</span>{act.rating && <span className="badge">⭐ {act.rating}</span>}{act.genres && act.genres.split(',').map(g=><span className="badge" key={g}>{g}</span>)}</div>
    <p className="text-white/80">{act.description}</p>
    {act.video_url && <div className="card"><h3 className="font-bold mb-2">Promo Video</h3><div className="aspect-video"><iframe className="w-full h-full rounded" src={act.video_url.replace('watch?v=','embed/')} title="Promo" allowFullScreen/></div></div>}
    <form onSubmit={submit} className="card space-y-3"><h3 className="font-bold text-xl">Check Availability</h3>
      <input placeholder="Your name" value={form.customer_name} onChange={e=>setForm({...form, customer_name:e.target.value})} required/>
      <input placeholder="Your email" value={form.customer_email} onChange={e=>setForm({...form, customer_email:e.target.value})} required/>
      <input placeholder="Event date (YYYY-MM-DD)" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} required/>
      <textarea placeholder="Message" value={form.message} onChange={e=>setForm({...form, message:e.target.value})}/>
      <button className="btn w-full">Send</button>
    </form>
    <section className="card"><h3 className="font-bold text-xl mb-3">Reviews</h3><div className="space-y-3">{itemReviews.map(r=>(<div key={r.id} className="bg-white/5 rounded p-3"><div className="font-semibold">{r.author_name} • ⭐{r.rating}</div><div className="text-white/80">{r.comment}</div></div>))}</div></section>
  </main>)
}