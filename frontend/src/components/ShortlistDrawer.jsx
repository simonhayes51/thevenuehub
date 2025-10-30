import { useEffect, useState } from "react";
import { getShortlist, toggleShort, getAct, getVenue } from "../data/store";

export default function ShortlistDrawer({open,onClose}){
  const [ids,setIds] = useState(getShortlist());
  useEffect(()=>{ if(open) setIds(getShortlist()); },[open]);

  const rows = ids.map(id => getAct(id) || getVenue(id)).filter(Boolean);

  return (
    <div style={{
      position:"fixed", inset:"0 0 0 auto", width:360, background:"#fff", zIndex:70,
      transform:`translateX(${open?0:110}%)`, transition:"transform .2s ease", boxShadow:"-10px 0 30px rgba(0,0,0,.18)"
    }}>
      <div style={{padding:"14px 16px", borderBottom:"1px solid rgba(0,0,0,.08)", display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <b>Shortlist</b>
        <button onClick={onClose} className="tape-btn">Close</button>
      </div>
      <div style={{padding:14, display:"grid", gap:10}}>
        {rows.length===0 && <div style={{color:"#777"}}>Your shortlist is empty.</div>}
        {rows.map(x=>(
          <div key={x.id} className="item" style={{display:"grid",gap:6}}>
            <div style={{fontWeight:800}}>{x.title}</div>
            <div className="sub">{x.city || `Capacity ${x.capacity||"-"}`}</div>
            <button className="tape-btn" onClick={()=>{toggleShort(x.id); setIds(getShortlist())}}>
              <span className="dot" /> Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
