import React from 'react';
export default function RatingStars({ value=5 }){
  const full = Math.round(Math.min(5, Math.max(0, value)));
  return <span className='stars'>{'★'.repeat(full)}{'☆'.repeat(5-full)}</span>;
}
