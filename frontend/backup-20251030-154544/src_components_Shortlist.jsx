import { useEffect } from "react";

export default function Shortlist({open, onClose, items=[]}){
  useEffect(()=>{
    if(open) document.body.classList.add('shortlist-open');
    else document.body.classList.remove('shortlist-open');
    return ()=>document.body.classList.remove('shortlist-open');
  },[open]);

  if(!open){
    // keep elements mounted but invisible to preserve transitions if preferred
    return null;
  }

  return (
    <>
      <div className="shortlist-backdrop" onClick={onClose} />
      <aside className="shortlist-drawer">
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 18px', borderBottom:'1px solid rgba(20,18,24,.06)'}}>
          <strong>Shortlist</strong>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>

        <div style={{padding:18, overflow:'auto'}}>
          {items.length === 0 ? (
            <div style={{opacity:.7}}>Your shortlist is empty.</div>
          ) : items.map((x,i)=>(
            <div key={i} className="card" style={{marginBottom:12}}>
              <div style={{fontWeight:800}}>{x.title}</div>
              <div style={{opacity:.7}}>{x.city ?? ''}</div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
