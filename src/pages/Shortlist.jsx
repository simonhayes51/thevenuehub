import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ActCard from '../components/ActCard'
import VenueCard from '../components/VenueCard'
import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_BASE

export default function Shortlist(){
  const [acts,setActs] = useState([])
  const [venues,setVenues] = useState([])
  useEffect(()=>{
    const list = JSON.parse(localStorage.getItem('vh_shortlist')||'[]')
    const actIds = list.filter(x=>x.type==='act').map(x=>x.id)
    const venueIds = list.filter(x=>x.type==='venue').map(x=>x.id)
    Promise.all([
      fetch(`${API}/acts`).then(r=>r.json()),
      fetch(`${API}/venues`).then(r=>r.json()),
    ]).then(([a,v])=>{
      setActs(a.filter(x=>actIds.includes(x.id)))
      setVenues(v.filter(x=>venueIds.includes(x.id)))
    }).catch(()=>{})
  },[])
  return (
    <div>
      <Navbar/>
      <div className="container-2xl section">
        <h1 className="font-display text-3xl mb-4">My Shortlist</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-display text-xl mb-2">Acts</h2>
            <div className="grid sm:grid-cols-2 gap-4">{acts.map(a=><ActCard key={a.id} act={a}/>)}</div>
          </div>
          <div>
            <h2 className="font-display text-xl mb-2">Venues</h2>
            <div className="grid sm:grid-cols-2 gap-4">{venues.map(v=><VenueCard key={v.id} venue={v}/>)}</div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}
