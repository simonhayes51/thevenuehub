import { useMemo, useState } from "react";
import { searchAll, toggleShort } from "../data/store";

export default function Search(){
  const [q,setQ] = useState("");
  const [type,setType] = useState("all");
  const [city,setCity] = useState("all");
  const res = useMemo(()=>searchAll(q),[q]);
  const cities = Array.from(new Set([...res.acts.map(a=>a.city), ...res.venues.map(v=>v.city)])).filter(Boolean).sort();

  const acts = res.acts.filter(a => (type==="all" || type==="acts") && (city==="all" || a.city===city));
  const venues = res.venues.filter(v => (type==="all" || type==="venues") && (city==="all" || v.city===city));

  return (
    <div className="wrapper section">
      <h2>Search</h2>
      <div className="row">
        <input className="input" placeholder="Search everything…" value={q} onChange={e=>setQ(e.target.value)} />
        <select className="input" style={{maxWidth:180}} value={type} onChange={e=>setType(e.target.value)}>
          <option value="all">All types</option>
          <option value="acts">Acts</option>
          <option value="venues">Venues</option>
        </select>
        <select className="input" style={{maxWidth:180}} value={city} onChange={e=>setCity(e.target.value)}>
          <option value="all">All cities</option>
          {cities.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <h3 className="section-title" style={{marginTop:18}}>ACTS</h3>
      <div className="list">
        {acts.map(a=>(
          <div className="item" key={a.id}>
            <h4>{a.title}</h4>
            <div className="sub">{a.city} • ⭐ {a.rating} • From £{a.priceFrom}</div>
            <button className="tape-btn" onClick={()=>toggleShort(a.id)}><span className="dot" />Save</button>
          </div>
        ))}
        {acts.length===0 && <div className="sub">No matching acts.</div>}
      </div>

      <h3 className="section-title" style={{marginTop:18}}>VENUES</h3>
      <div className="list">
        {venues.map(v=>(
          <div className="item" key={v.id}>
            <h4>{v.title}</h4>
            <div className="sub">{v.city} • Capacity {v.capacity} • From £{v.priceFrom}</div>
            <button className="tape-btn" onClick={()=>toggleShort(v.id)}><span className="dot" />Save</button>
          </div>
        ))}
        {venues.length===0 && <div className="sub">No matching venues.</div>}
      </div>
    </div>
  )
}
