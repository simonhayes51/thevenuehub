import { getShortlist, getActs, getVenues, clearShort } from "../data/store";

export default function Shortlist(){
  const ids = new Set(getShortlist());
  const acts = getActs().filter(a=>ids.has(a.id));
  const venues = getVenues().filter(v=>ids.has(v.id));
  return (
    <div className="drawer">
      <header>
        <b>Shortlist</b>
        <div style={{display:"flex", gap:8}}>
          <button className="btn" onClick={()=>{clearShort(); location.href="/shortlist";}}>Clear</button>
          <a className="btn" href="/">Close</a>
        </div>
      </header>
      <div className="content">
        {acts.length===0 && venues.length===0 ? <p className="meta">Your shortlist is empty.</p> : null}
        {acts.length>0 && <>
          <h4>Acts</h4>
          {acts.map(a=> <div className="card" key={a.id}><b>{a.title}</b><div className="meta">£{a.price} • {a.city}</div></div>)}
        </>}
        {venues.length>0 && <>
          <h4>Venues</h4>
          {venues.map(v=> <div className="card" key={v.id}><b>{v.title}</b><div className="meta">{v.capacity} cap • £{v.price} • {v.city}</div></div>)}
        </>}
      </div>
    </div>
  );
}
