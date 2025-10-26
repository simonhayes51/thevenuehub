import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ActCard from '../components/ActCard'
import VenueCard from '../components/VenueCard'
import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_BASE

export default function Home(){
  const [acts,setActs] = useState([])
  const [venues,setVenues] = useState([])
  useEffect(()=>{
    fetch(`${API}/acts`).then(r=>r.json()).then(setActs).catch(()=>{})
    fetch(`${API}/venues`).then(r=>r.json()).then(setVenues).catch(()=>{})
  },[])
  return (
    <div>
      <Navbar/>
      <section className="section">
        <div className="container-2xl text-center">
          <div className="inline-flex items-center gap-2 pill mb-4 animate-pulse-slow">
            <span className="w-2 h-2 rounded-full bg-brand.secondary"></span>
            <span>Book talent • Find venues • No platform fees</span>
          </div>
          <h1 className="font-display text-5xl font-semibold">Your <span className="text-brand.primary">show</span> starts here</h1>
          <p className="mt-3 text-white/75 max-w-2xl mx-auto">Discover premium entertainers and venues with a vibe. Compare, shortlist and enquire directly.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <a className="btn-primary" href="/acts">Find Acts</a>
            <a className="btn-ghost" href="/venues">Explore Venues</a>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-2xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-2xl">Featured Acts</h2>
            <a href="/acts" className="text-sm text-white/70 hover:text-white">View all →</a>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {acts.slice(0,6).map(a => <ActCard key={a.id} act={a}/>)}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-2xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-2xl">Popular Venues</h2>
            <a href="/venues" className="text-sm text-white/70 hover:text-white">Browse →</a>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {venues.slice(0,6).map(v => <VenueCard key={v.id} venue={v}/>)}
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  )
}
