import { useState } from "react";
import { addAct, addVenue, getActs, getVenues, deleteAct, deleteVenue } from "../data/store";

export default function Admin(){
  const [act, setAct] = useState({title:"", city:"", priceFrom:"", rating:"", tags:""});
  const [venue, setVenue] = useState({title:"", city:"", capacity:"", priceFrom:""});

  const [acts,setActs] = useState(getActs());
  const [venues,setVenues] = useState(getVenues());

  return (
    <div className="wrapper section">
      <h2>Admin</h2>
      <div className="row">
        <div className="admin-card" style={{flex:"1 1 360px"}}>
          <h3>Add Act</h3>
          <div className="row">
            <input className="input" placeholder="Title" value={act.title} onChange={e=>setAct({...act,title:e.target.value})}/>
            <input className="input" placeholder="City" value={act.city} onChange={e=>setAct({...act,city:e.target.value})}/>
          </div>
          <div className="row">
            <input className="input" placeholder="Price From" value={act.priceFrom} onChange={e=>setAct({...act,priceFrom:e.target.value})}/>
            <input className="input" placeholder="Rating" value={act.rating} onChange={e=>setAct({...act,rating:e.target.value})}/>
            <input className="input" placeholder="Tags (comma)" value={act.tags} onChange={e=>setAct({...act,tags:e.target.value})}/>
          </div>
          <button className="tape-btn primary" onClick={()=>{ addAct({...act,tags:act.tags.split(",").map(t=>t.trim()).filter(Boolean)}); setActs(getActs()); }}>
            <span className="dot" /> Save Act
          </button>
        </div>

        <div className="admin-card" style={{flex:"1 1 360px"}}>
          <h3>Add Venue</h3>
          <div className="row">
            <input className="input" placeholder="Title" value={venue.title} onChange={e=>setVenue({...venue,title:e.target.value})}/>
            <input className="input" placeholder="City" value={venue.city} onChange={e=>setVenue({...venue,city:e.target.value})}/>
          </div>
          <div className="row">
            <input className="input" placeholder="Capacity" value={venue.capacity} onChange={e=>setVenue({...venue,capacity:e.target.value})}/>
            <input className="input" placeholder="Price From" value={venue.priceFrom} onChange={e=>setVenue({...venue,priceFrom:e.target.value})}/>
          </div>
          <button className="tape-btn" onClick={()=>{ addVenue(venue); setVenues(getVenues()); }}>
            <span className="dot" /> Save Venue
          </button>
        </div>
      </div>

      <h3 className="section-title" style={{marginTop:18}}>EXISTING ACTS</h3>
      <div className="list">
        {acts.map(a=>(
          <div className="item" key={a.id}>
            <h4>{a.title}</h4>
            <div className="sub">{a.city} • ⭐ {a.rating} • £{a.priceFrom}</div>
            <button className="tape-btn" onClick={()=>{ deleteAct(a.id); setActs(getActs()); }}><span className="dot" />Delete</button>
          </div>
        ))}
      </div>

      <h3 className="section-title" style={{marginTop:18}}>EXISTING VENUES</h3>
      <div className="list">
        {venues.map(v=>(
          <div className="item" key={v.id}>
            <h4>{v.title}</h4>
            <div className="sub">{v.city} • Cap {v.capacity} • £{v.priceFrom}</div>
            <button className="tape-btn" onClick={()=>{ deleteVenue(v.id); setVenues(getVenues()); }}><span className="dot" />Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
