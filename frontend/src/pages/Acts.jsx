import { useMemo, useState } from "react";
import { getActs, toggleShort, getShortlist } from "../data/store";
import Modal from "../components/Modal";

export default function Acts(){
  const acts = useMemo(()=>getActs(),[]);
  const [q,setQ] = useState("");
  const [active,setActive] = useState(null);
  const [short, setShort] = useState(getShortlist());

  const filtered = acts.filter(x => (x.title||"").toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="container section">
      <h2>Acts</h2>
      <input placeholder="Search acts…" value={q} onChange={e=>setQ(e.target.value)} className="btn" />
      <div className="grid" style={{marginTop:12}}>
        {filtered.map(x=>(
          <div key={x.id} className="card">
            <h4 style={{marginBottom:4, cursor:"pointer"}} onClick={()=>setActive(x)}>{x.title}</h4>
            <p className="meta">⭐ {x.rating} • From £{x.price} • {x.city}</p>
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
        <p className="meta">⭐ {active?.rating} • From £{active?.price} • {active?.city}</p>
        <p>{active?.desc}</p>
      </Modal>
    </div>
  );
}
