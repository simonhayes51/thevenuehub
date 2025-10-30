import React, { useMemo, useState } from "react";
import Card from "../components/Card";
import { getVenues } from "../data/store";

export default function Venues(){
  const venues = useMemo(()=>getVenues(),[]);
  const [q,setQ] = useState('');
  const filtered = venues.filter(x =>
    `${x.title} ${x.city ?? ''}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className='wrapper'>
      <h2 className='section-title'>Featured Venues</h2>
      <div className='filters'>
        <input className='input' placeholder='Search by name or city…' value={q} onChange={e=>setQ(e.target.value)}/>
        <select className='select'><option>Any Capacity</option><option>≤100</option><option>100–200</option><option>200+</option></select>
      </div>
      <div className='grid'>
        {filtered.map(x=>(
          <Card key={x.id} kind='venue' id={x.id} title={x.title} city={x.city} capacity={x.capacity} price={x.price} rating={x.rating}/>
        ))}
      </div>
    </div>
  );
}
