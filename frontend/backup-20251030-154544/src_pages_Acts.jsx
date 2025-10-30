import { useMemo, useState } from "react";
import { getActs, toggleShort, getShortlist } from "../data/store";
import Modal from "../components/Modal";

export default function Acts(){
  const acts = useMemo(()=>getActs(),[]);
  const [q,setQ] = useState("");
  const [city,setCity] = useState("all");
  const [active,setActive] = useState(null);
  const [short,setShort] = useState(getShortlist());

  const cities = Array.from(new Set(acts.map(a=>a.city))).sort();
  const filtered = acts.filter(x =>
    `${x.title} ${x.city} ${(x.tags||[]).join(" ")}`.toLowerCase().includes(q.toLowerCase())
    && (city==="all" || x.city===city)
  );

  return (
    <div className="wrapper section">
      <h2>Acts</h2>
      <div className="row">
        <input className="input" placeholder="Search acts…" value={q} onChange={e=>setQ(e.target.value)}/>
        <select className="input" style={{maxWidth:220}} value={city} onChange={e=>setCity(e.target.value)}>
          <option value="all">All cities</option>
          {cities.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="list" style={{marginTop:12}}>
        {filtered.map(a=>(
          <div className="item" key={a.id} style={{cursor:"pointer"}} onClick={()=>setActive(a)}>
            <h4>{a.title}</h4>
            <div className="sub">{a.city} • ⭐ {a.rating} • From £{a.priceFrom}</div>
            <div className="row" style={{marginTop:8}} onClick={e=>e.stopPropagation()}>
              <button className="tape-btn" onClick={()=>setShort(toggleShort(a.id))}><span className="dot" />Save</button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!active} onClose={()=>setActive(null)}>
        {active && (
          <>
            <h2 style={{margin:"4px 0 6px"}}>{active.title}</h2>
            <div style={{color:"#666"}}>{active.city} • ⭐ {active.rating} • From £{active.priceFrom}</div>
            <p style={{marginTop:12}}>High-energy {active.tags?.join(", ") || "entertainment"} for any event.</p>
            <div className="row">
              <button className="tape-btn primary"><span className="dot" />Request Quote</button>
              <button className="tape-btn" onClick={()=>{toggleShort(active.id);}}><span className="dot" />Save</button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
