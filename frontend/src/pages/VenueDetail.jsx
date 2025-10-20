import React,{useEffect,useState} from 'react'
import {useParams} from 'react-router-dom'
import api from '../api'
export default function VenueDetail(){
  const {slug}=useParams(); const [venue,setVenue]=useState(null); const [reviews,setReviews]=useState([])
  useEffect(()=>{ api.get(`/api/venues/${slug}`).then(r=>setVenue(r.data)); api.get('/api/reviews').then(r=>setReviews(r.data)) },[slug])
  if(!venue) return <main className="max-w-4xl mx-auto px-4 py-10">Loading...</main>
  const itemReviews = reviews.filter(r=>r.venue_id===venue.id)
  return (<main className="max-w-4xl mx-auto px-4 py-10 space-y-6">
    <div className="rounded-xl overflow-hidden">{venue.image_url && <img src={venue.image_url} className="w-full h-64 object-cover"/>}</div>
    <h2 className="text-3xl font-black">{venue.name}</h2>
    <div className="flex gap-2 flex-wrap">{venue.location && <span className="badge">{venue.location}</span>}{venue.capacity && <span className="badge">{venue.capacity} cap</span>}{venue.style && <span className="badge">{venue.style}</span>}</div>
    <p className="text-white/80">{venue.amenities}</p>
    <section className="card"><h3 className="font-bold text-xl mb-3">Reviews</h3><div className="space-y-3">{itemReviews.map(r=>(<div key={r.id} className="bg-white/5 rounded p-3"><div className="font-semibold">{r.author_name} • ⭐{r.rating}</div><div className="text-white/80}>{r.comment}</div></div>))}</div></section>
  </main>)
}