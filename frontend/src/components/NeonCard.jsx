import '../styles/neon.css';
import { Html } from '../utils/Html';

export default function NeonCard({ title, subtitle, priceFrom, image, description, footer, href }){
  return (
    <a className='neon-card neon-glow' style={{display:'block', textDecoration:'none', color:'inherit'}} href={href || '#'}>
      <div style={{display:'flex', gap:14}}>
        {image ? <img src={image} alt={title} width={88} height={88} style={{borderRadius:12, objectFit:'cover'}}/> : null}
        <div style={{flex:1}}>
          <h3 className='neon-text'>{title}</h3>
          {subtitle ? <div className='neon-meta'>{subtitle}</div> : null}
          {priceFrom ? <div className='neon-price neon-cyan' style={{marginTop:4}}>from £{priceFrom}</div> : null}
        </div>
      </div>
      {description ? <div style={{marginTop:10, opacity:.95}}><Html html={description} /></div> : null}
      {footer ? <div style={{marginTop:12, opacity:.8}}>{footer}</div> : null}
    </a>
  );
}
