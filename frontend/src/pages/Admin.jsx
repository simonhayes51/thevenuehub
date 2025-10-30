import { useState } from "react";
import { addAct, addVenue, getActs, getVenues, deleteAct, deleteVenue } from "../data/store";

export default function Admin(){
  const [acts,setActs] = useState(getActs());
  const [venues,setVenues] = useState(getVenues());
  const [name,setName] = useState("");
  const [city,setCity] = useState("");

  function add(type){
    if(!name.trim()) return;
    if(type==="act"){ addAct({title:name, city}); setActs(getActs()); }
    else { addVenue({title:name, city}); setVenues(getVenues()); }
    setName(""); setCity("");
  }

  return (
    <div className="container section">
      <h2>Admin</h2>
      <div className="card" style={{marginBottom:16}}>
        <h4>Add</h4>
        <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
          <input className="btn" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="btn" placeholder="City" value={city} onChange={e=>setCity(e.target.value)} />
          <button className="btn primary" onClick={()=>add("act")}>Add Act</button>
          <button className="btn" onClick={()=>add("venue")}>Add Venue</button>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h4>Acts</h4>
          {acts.map(a=>(
            <div key={a.id} style={{display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #eee"}}>
              <span><b>{a.title}</b> <span className="meta">• {a.city}</span></span>
              <button className="btn" onClick={()=>{deleteAct(a.id); setActs(getActs());}}>Delete</button>
            </div>
          ))}
        </div>
        <div className="card">
          <h4>Venues</h4>
          {venues.map(v=>(
            <div key={v.id} style={{display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #eee"}}>
              <span><b>{v.title}</b> <span className="meta">• {v.city}</span></span>
              <button className="btn" onClick={()=>{deleteVenue(v.id); setVenues(getVenues());}}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
