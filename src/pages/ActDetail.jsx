import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Rating from '../components/Rating'
import ReviewList from '../components/ReviewList'
import ShortlistButton from '../components/ShortlistButton'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_BASE

export default function ActDetail(){
  const { id } = useParams()
  const [act,setAct] = useState(null)
  const [reviews,setReviews] = useState([])

  useEffect(()=>{
    fetch(`${API}/acts/${id}`).then(r=>r.json()).then(setAct).catch(()=>{})
    fetch(`${API}/api/reviews?act_id=${id}`).then(r=>r.json()).then(setReviews).catch(()=>{})
  },[id])

  if(!act) return (<div><Navbar/><div className="container-2xl section">Loading…</div></div>)

  return (
    <div>
      <Navbar/>
      <div className="container-2xl section grid md:grid-cols-12 gap-6">
        <div className="md:col-span-7 card overflow-hidden">
          <img src={act.image_url} alt={act.name} className="w-full object-cover"/>
        </div>
        <div className="md:col-span-5">
          <h1 className="font-display text-3xl">{act.name}</h1>
          <div className="mt-2 flex items-center gap-3">
            <span className="pill">{act.act_type}</span>
            <span className="text-white/70 text-sm">{act.location}</span>
            <Rating value={act.rating||0}/>
          </div>
          {act.price_from && <div className="mt-3 text-white/80">from £{Math.round(act.price_from)}</div>}
          <p className="mt-4 text-white/80">{act.description}</p>
          <div className="mt-5 flex items-center gap-3">
            <a href={`/enquire/act/${act.id}`} className="btn-primary">Enquire</a>
            <ShortlistButton id={act.id} type="act" />
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
