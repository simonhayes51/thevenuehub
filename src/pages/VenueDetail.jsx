import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ReviewList from '../components/ReviewList'
import ShortlistButton from '../components/ShortlistButton'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_BASE

export default function VenueDetail(){
  const { id } = useParams()
  const [venue,setVenue] = useState(null)
  const [reviews,setReviews] = useState([])

  useEffect(()=>{
    fetch(`${API}/venues/${id}`).then(r=>r.json()).then(setVenue).catch(()=>{})
    fetch(`${API}/api/reviews?venue_id=${id}`).then(r=>r.json()).then(setReviews).catch(()=>{})
  },[id])

  if(!venue) return (<div><Navbar/><div className="container-2xl section">Loading…</div></div>)

  return (
    <div>
      <Navbar/>
      <div className="container-2xl section grid md:grid-cols-12 gap-6">
        <div className="md:col-span-7 card overflow-hidden">
          <img src={venue.image_url} alt={venue.name} className="w-full object-cover"/>
        </div>
        <div className="md:col-span-5">
          <h1 className="font-display text-3xl">{venue.name}</h1>
          <div className="mt-2 flex items-center gap-3">
            <span className="pill">{venue.style||'Venue'}</span>
            <span className="text-white/70 text-sm">{venue.location}</span>
          </div>
          {venue.price_from && <div className="mt-3 text-white/80">from £{Math.round(venue.price_from)}</div>}
          <p className="mt-4 text-white/80">{venue.amenities}</p>
          <div className="mt-5 flex items-center gap-3">
            <a href={`/enquire/venue/${venue.id}`} className="btn-primary">Enquire</a>
            <ShortlistButton id={venue.id} type="venue" />
          </div>
          <div className="mt-8">
            <h2 className="font-display text-xl mb-2">Reviews</h2>
            <ReviewList items={reviews}/>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}
