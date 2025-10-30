import { useMemo, useState } from "react";
import { getVenues, toggleShort, getShortlist } from "../data/store";
import Modal from "../components/Modal";

export default function Venues(){
  const venues = useMemo(()=>getVenues(),[]);
  const [q,setQ] = useState("");
  const [active,setActive] = useState(null);
  const [short, setShort] = useState(getShortlist());
  const filtered = venues.filter(x => (x.title||"").toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="container section">
      <h2>Venues</h2>
      <input placeholder="Search venues…" value={q} onChange={e=>setQ(e.target.value)} className="btn" />
      <div className="grid" style={{marginTop:12}}>
        {filtered.map(x=>(
          <div key={x.id} className="card">
            <h4 style={{marginBottom:4, cursor:"pointer"}} onClick={()=>setActive(x)}>{x.title}</h4>
            <p className="meta">Capacity {x.capacity} • From £{x.price} • {x.city}</p>
            <div style={{display:"flex", gap:8, marginTop:8}}>
              <button className="btn" onClick={()=>{setActive(x)}}>View</button>
              <button className="btn" onClick={()=>setShort(toggleShort(x.id))}>
                {short.includes(x.id) ? "Saved" : "Save"}
              </button>
            </div>
          </div>
        ))}
      </div>
      <Modal open={!!active} onClose={()=>setActive(null)} title={active?.title}>
        <p className="meta">Capacity {active?.capacity} • From £{active?.price} • {active?.city}</p>
        <p>{active?.desc}</p>
      </Modal>
    </div>
  );
}
