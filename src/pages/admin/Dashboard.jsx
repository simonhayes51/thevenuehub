import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useEffect, useState } from 'react'
const API = import.meta.env.VITE_API_BASE

export default function AdminDashboard(){
  const [acts,setActs] = useState([])
  const [venues,setVenues] = useState([])
  const [bookings,setBookings] = useState([])
  useEffect(()=>{
    fetch(`${API}/api/admin/acts`).then(r=>r.json()).then(setActs).catch(()=>{})
    fetch(`${API}/api/admin/venues`).then(r=>r.json()).then(setVenues).catch(()=>{})
    fetch(`${API}/api/admin/bookings`).then(r=>r.json()).then(setBookings).catch(()=>{})
  },[])
  return (
    <div>
      <Navbar/>
      <div className="container-2xl section grid md:grid-cols-3 gap-4">
        <div className="card p-4"><div className="text-sm text-muted">Acts</div><div className="text-3xl font-display">{acts.length}</div></div>
        <div className="card p-4"><div className="text-sm text-muted">Venues</div><div className="text-3xl font-display">{venues.length}</div></div>
        <div className="card p-4"><div className="text-sm text-muted">Bookings</div><div className="text-3xl font-display">{bookings.length}</div></div>
      </div>
      <Footer/>
    </div>
  )
}
