import { useState } from "react";

export default function Pricing(){
  const [yearly,setYearly] = useState(true);
  const price = (m)=> yearly ? Math.round(m*10) : m;

  return (
    <div className="wrapper section">
      <h2>Pricing</h2>
      <div className="row" style={{alignItems:"center",marginBottom:8}}>
        <label style={{display:"inline-flex",alignItems:"center",gap:8,cursor:"pointer"}}>
          <input type="checkbox" checked={yearly} onChange={()=>setYearly(v=>!v)}/>
          <b>Bill yearly (save ~2 months)</b>
        </label>
      </div>

      <div className="card-grid">
        <div className="retro-card">
          <h3>Starter</h3>
          <p>Shortlist + core search.</p>
          <div style={{fontSize:32,fontWeight:900,margin:"8px 0"}}>£{price(0)}<span style={{fontSize:14}}>{yearly?"/yr":"/mo"}</span></div>
          <button className="tape-btn"><span className="dot" />Get Started</button>
        </div>
        <div className="retro-card">
          <h3>Pro</h3>
          <p>Priority listings, messaging, analytics.</p>
          <div style={{fontSize:32,fontWeight:900,margin:"8px 0"}}>£{price(9)}<span style={{fontSize:14}}>{yearly?"/yr":"/mo"}</span></div>
          <button className="tape-btn primary"><span className="dot" />Go Pro</button>
        </div>
        <div className="retro-card">
          <h3>Agency</h3>
          <p>Team seats, multi-venue tools, API.</p>
          <div style={{fontSize:32,fontWeight:900,margin:"8px 0"}}>£{price(29)}<span style={{fontSize:14}}>{yearly?"/yr":"/mo"}</span></div>
          <button className="tape-btn"><span className="dot" />Talk to Sales</button>
        </div>
      </div>
    </div>
  )
}
