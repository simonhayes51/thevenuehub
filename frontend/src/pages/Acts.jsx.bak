import React, { useMemo, useState } from "react";
import Card from "../components/Card";
import { getActs } from "../data/store";

export default function Acts(){
  const acts = useMemo(()=>getActs(),[]);
  const [q,setQ] = useState('');
  const filtered = acts.filter(x =>
    `${x.title} ${x.type ?? ''} ${x.city ?? ''}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="wrapper">
      <h2 className="section-title">Featured Acts</h2>
      <div className="filters">
        <input className="input" placeholder="Search by name, type or city…" value={q} onChange={e=>setQ(e.target.value)}/>
        <select className="select"><option>Any Type</option><option>Band</option><option>DJ</option></select>
      </div>
      <div className="grid">
        {filtered.map(x=>(
          <Card key={x.id} kind="act" id={x.id} title={x.title} city={x.city} price={x.price} rating={x.rating}/>
        ))}
      </div>
    </div>
  );
}
