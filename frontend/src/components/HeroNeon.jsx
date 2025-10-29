import '../styles/neon.css';

export default function HeroNeon(){
  return (
    <section className='vh-hero'>
      <span className='vh-badge'>Retro · Neon · Live Entertainment</span>
      <h1 className='vh-title neon-text'>
        Book unforgettable <span className='neon-pink'>acts</span> & <span className='neon-cyan'>venues</span>
      </h1>
      <p className='vh-sub'>
        Curated performers and stunning venues. Compare, enquire, and get it booked — fast.
      </p>
      <div className='vh-cta'>
        <a className='vh-btn primary' href='/browse'>Browse now</a>
        <a className='vh-btn' href='/providers/register'>List your act/venue</a>
      </div>
    </section>
  );
}
