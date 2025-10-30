import { useMemo, useState } from "react";
import { getVenues, toggleShort, getShortlist } from "../data/store";
import Modal from "../components/Modal";

export default function Venues(){
  const venues = useMemo(()=>getVenues(),[]);
  const [q,setQ] = useState("");
  const [cap,setCap] = useState("all");
  const [active,setActive] = useState(null);
  const [short,setShort] = useState(getShortlist());

  const filtered = venues.filter(x =>
    `${x.title} ${x.city}`.toLowerCase().includes(q.toLowerCase()) &&
    (cap==="all" || (cap==="small" && x.capacity<120) || (cap==="med" && x.capacity>=120 && x.capacity<250) || (cap==="big" && x.capacity>=250))
  );

  return (
    <div className="wrapper section">
      <h2>Venues</h2>
      <div className="row">
        <input className="input" placeholder="Search venues…" value={q} onChange={e=>setQ(e.target.value)} />
        <select className="input" style={{maxWidth:220}} value={cap} onChange={e=>setCap(e.target.value)}>
          <option value="all">All capacities</option>
          <option value="small">Small (&lt;120)</option>
          <option value="med">Medium (120–249)</option>
          <option value="big">Large (250+)</option>
        </select>
      </div>

      <div className="list" style={{marginTop:12}}>
        {filtered.map(v=>(
          <div className="item" key={v.id} style={{cursor:"pointer"}} onClick={()=>setActive(v)}>
            <h4>{v.title}</h4>
            <div className="sub">{v.city} • Capacity {v.capacity} • From £{v.priceFrom}</div>
            <div className="row" style={{marginTop:8}} onClick={e=>e.stopPropagation()}>
              <button className="tape-btn" onClick={()=>setShort(toggleShort(v.id))}><span className="dot" />Save</button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!active} onClose={()=>setActive(null)}>
        {active && (
          <>
            <h2 style={{margin:"4px 0 6px"}}>{active.title}</h2>
            <div style={{color:"#666"}}>{active.city} • Capacity {active.capacity} • From £{active.priceFrom}</div>
            <p style={{marginTop:12}}>A versatile space perfect for weddings, parties and live shows.</p>
            <div className="row">
              <button className="tape-btn primary"><span className="dot" />Check Availability</button>
              <button className="tape-btn" onClick={()=>{toggleShort(active.id);}}><span className="dot" />Save</button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
