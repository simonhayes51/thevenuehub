import React, { useEffect, useState } from 'react';
import { shortlist, removeShort, clearShort } from '../data/store';

export default function ShortlistBubble(){
  const [open,setOpen]=useState(false);
  const [items,setItems]=useState([]);
  const refresh=()=>setItems(shortlist());
  useEffect(()=>{ refresh(); window.addEventListener('storage',refresh); return ()=>window.removeEventListener('storage',refresh) },[]);
  return (
    <div className='shortlist'>
      <div style={{display:'flex',gap:10,alignItems:'center'}}>
        <strong>Shortlist</strong> • {items.length} item{items.length===1?'':'s'}
        <button className='btn btn-ghost' onClick={()=>setOpen(!open)}>{open?'Close':'Open'}</button>
        <button className='btn btn-ghost' onClick={()=>{clearShort(); refresh();}}>Clear</button>
      </div>
      {open && (
        <div style={{marginTop:8, maxWidth:320}}>
          {items.length===0 && <div style={{color:'#666'}}>Empty — hit “Save” on a card.</div>}
          {items.map((x,i)=>(
            <div key={i} style={{display:'flex',justifyContent:'space-between',gap:8,margin:'6px 0'}}>
              <span>{x.kind==='act'?'🎤':'🏢'} {x.title}</span>
              <button className='btn btn-primary' onClick={()=>{removeShort(x.kind,x.id); refresh();}}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
