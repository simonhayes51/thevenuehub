import { useEffect } from "react";
export default function Shortlist({open,onClose,items,removeItem,clear}){
  useEffect(()=>{ open?document.body.classList.add("shortlist-open"):document.body.classList.remove("shortlist-open"); return ()=>document.body.classList.remove("shortlist-open")},[open]);
  if(!open) return null;
  return <>
    <div className="shortlist-backdrop" onClick={onClose}/>
    <aside className="shortlist">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",borderBottom:"1px solid rgba(23,22,28,.08)"}}>
        <strong>Shortlist</strong>
        <div style={{display:"flex",gap:8}}>
          <button className="btn btn-secondary" onClick={clear}>Clear</button>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
      <div style={{padding:16, overflow:"auto"}}>
        {items.length===0? <div style={{opacity:.7}}>Your shortlist is empty.</div> :
          items.map(x=>(
            <div key={x.id} className="card" style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><strong>{x.title}</strong><div style={{opacity:.7}}>{x.city??""}</div></div>
                <button className="btn btn-secondary" onClick={()=>removeItem(x.id)}>Remove</button>
              </div>
            </div>
          ))
        }
      </div>
    </aside>
  </>;
}
