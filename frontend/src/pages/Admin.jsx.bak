import React, { useState } from 'react';
import { addAct } from '../data/store';

export default function Admin(){
  const [form,setForm]=useState({ title:'', type:'Band', city:'', price:500, capacity:4, about:'' });
  const onChange = e => setForm(f=>({ ...f, [e.target.name]: e.target.value }));
  const onSubmit = e => {
    e.preventDefault();
    addAct({ ...form, price:Number(form.price), capacity:Number(form.capacity) });
    alert('Act added!');
    setForm({ title:'', type:'Band', city:'', price:500, capacity:4, about:'' });
  };

  return (
    <div className='wrapper'>
      <h2 className='section-title'>Admin — Add New Act</h2>
      <form className='tile' onSubmit={onSubmit} style={{display:'grid',gap:12,maxWidth:560}}>
        <input className='input' name='title' placeholder='Act name' value={form.title} onChange={onChange} required />
        <select className='select' name='type' value={form.type} onChange={onChange}>
          <option>Band</option><option>DJ</option><option>Singer</option><option>Host</option>
        </select>
        <input className='input' name='city' placeholder='City' value={form.city} onChange={onChange} required />
        <input className='input' type='number' name='price' placeholder='Price from (£)' value={form.price} onChange={onChange} min='0' />
        <input className='input' type='number' name='capacity' placeholder='Members / size' value={form.capacity} onChange={onChange} min='1' />
        <textarea className='input' name='about' placeholder='About / description' value={form.about} onChange={onChange} rows='4'></textarea>
        <button className='btn btn-primary' type='submit'>Add Act</button>
      </form>
      <p className='tile' style={{marginTop:12}}>Tip: Added acts appear in <b>Acts</b>, are searchable, and can be opened on the details page.</p>
    </div>
  );
}
