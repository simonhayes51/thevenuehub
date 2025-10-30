import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAct, addShort } from '../data/store';
import RatingStars from '../components/RatingStars';

export default function ActDetails(){
  const { id } = useParams();
  const act = useMemo(()=>getAct(id),[id]);
  if(!act) return <div className='wrapper'><p className='tile'>Not found.</p></div>;

  return (
    <div className='wrapper'>
      <Link to='/acts' className='btn btn-ghost'>← Back to Acts</Link>
      <div className='tile' style={{marginTop:16}}>
        <h2 style={{marginTop:0}}>{act.title}</h2>
        <div style={{display:'flex',gap:16,flexWrap:'wrap',margin:'6px 0 12px'}}>
          <span className='tag'>{act.type}</span>
          <span className='tag'>{act.city}</span>
          <span className='tag'>From £{act.price}</span>
          <span className='tag'>Members {act.capacity}</span>
        </div>
        <RatingStars value={act.rating}/>
        <p style={{marginTop:12}}>{act.about || 'Great entertainment for your event.'}</p>
        <div style={{display:'flex',gap:8,marginTop:12}}>
          <button className='btn btn-primary' onClick={()=>addShort({kind:'act', id:act.id, title:act.title})}>Save to Shortlist</button>
          <a className='btn btn-ghost' href='mailto:hello@venuehub.co.uk?subject=Enquiry%20via%20VenueHub'>Enquire</a>
        </div>
      </div>
    </div>
  );
}
