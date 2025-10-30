import React from 'react';

const Tier = ({name,price,features,cta}) => (
  <div className='tile' style={{padding:'22px'}}>
    <h3 style={{marginTop:0}}>{name}</h3>
    <div style={{fontSize:28,fontWeight:900,margin:'6px 0'}}>£{price}<span style={{fontSize:14,fontWeight:600}}>/mo</span></div>
    <ul style={{margin:'10px 0 14px',paddingLeft:18}}>
      {features.map((f,i)=><li key={i}>{f}</li>)}
    </ul>
    <a className='btn btn-primary' href='/admin'>{cta || 'Get started'}</a>
  </div>
);

export default function Pricing(){
  return (
    <div className='wrapper'>
      <h2 className='section-title'>Pricing</h2>
      <div className='grid'>
        <Tier name='Free' price='0' features={['Public profile','Appear in search','Shortlist saves']} cta='List for Free'/>
        <Tier name='Pro' price='9' features={['Top placement boost','Contact form unlock','Priority support']} cta='Upgrade to Pro'/>
        <Tier name='Teams' price='29' features={['Multiple profiles','Team scheduling','Advanced analytics']} cta='Contact Sales'/>
      </div>
    </div>
  );
}
