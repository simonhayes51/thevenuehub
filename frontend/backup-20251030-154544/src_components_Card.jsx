import React from 'react';
import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';
import { addShort } from '../data/store';

export default function Card({id,title,city,price,capacity,img,rating=5,tag='',kind='venue'}){
  const onShort = ()=> addShort({ kind, id, title });

  return (
    <article className='card'>
      <img src={img || 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800'} alt=''/>
      <div style={{flex:1}}>
        <h3 style={{marginBottom:4}}>{title}</h3>
        <div className='meta'>
          {city && <span className='tag'>{city}</span>}
          {capacity && <span className='tag'>Cap {capacity}</span>}
          {price && <span className='tag'>From £{price}</span>}
          {tag && <span className='tag'>{tag}</span>}
        </div>
        <div style={{marginTop:6}}><RatingStars value={rating}/></div>
        <div style={{display:'flex', gap:8, marginTop:10}}>
          {kind==='act'
            ? <Link className='btn btn-ghost' to={/act/}>View</Link>
            : null}
          <button className='btn btn-primary' onClick={onShort}>Save</button>
        </div>
      </div>
    </article>
  );
}
