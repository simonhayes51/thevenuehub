import React, { useState } from 'react';
import Card from '../components/Card';
import { searchAll } from '../data/store';

export default function Search(){
  const [q,setQ] = useState('');
  const { acts, venues } = searchAll(q);
  return (
    <div className='wrapper'>
      <h2 className='section-title'>Search</h2>
      <div className='filters'>
        <input className='input' placeholder='Search acts & venues…' value={q} onChange={e=>setQ(e.target.value)}/>
      </div>

      <h3 className='section-title'>Acts</h3>
      <div className='grid'>
        {acts.map(x=>(
          <Card key={x.id} kind='act' id={x.id} title={x.title} city={x.city} capacity={x.capacity} price={x.price} rating={x.rating} tag={x.type}/>
        ))}
      </div>

      <h3 className='section-title' style={{marginTop:24}}>Venues</h3>
      <div className='grid'>
        {venues.map(x=>(
          <Card key={x.id} kind='venue' id={x.id} title={x.title} city={x.city} capacity={x.capacity} price={x.price} rating={x.rating}/>
        ))}
      </div>
    </div>
  );
}
