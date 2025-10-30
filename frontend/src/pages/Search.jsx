import { useState } from "react";
import { searchAll, toggleShort, getShortlist } from "../data/store";

export default function Search(){
  const [q,setQ] = useState("");
  const [short, setShort] = useState(getShortlist());
  const res = searchAll(q);

  return (
    <div className="container section">
      <h2>Search</h2>
      <input className="btn" placeholder="Search acts or venues…" value={q} onChange={e=>setQ(e.target.value)} />
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"18px", marginTop:"14px"}}>
        <div>
          <h3>Acts</h3>
          {res.acts.map(x=>(
            <div className="card" key={x.id} style={{marginBottom:10}}>
              <b>{x.title}</b><div className="meta">⭐ {x.rating} • £{x.price} • {x.city}</div>
              <button className="btn" onClick={()=>setShort(toggleShort(x.id))}>
                {short.includes(x.id) ? "Saved" : "Save"}
              </button>
            </div>
          ))}
        </div>
        <div>
          <h3>Venues</h3>
          {res.venues.map(x=>(
            <div className="card" key={x.id} style={{marginBottom:10}}>
              <b>{x.title}</b><div className="meta">{x.capacity} cap • £{x.price} • {x.city}</div>
              <button className="btn" onClick={()=>setShort(toggleShort(x.id))}>
                {short.includes(x.id) ? "Saved" : "Save"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
