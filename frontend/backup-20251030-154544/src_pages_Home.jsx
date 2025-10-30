export default function Home(){
  return (
    <>
      <section className="hero">
        <div className="wrapper">
          <div className="card" style={{display:'inline-flex', alignItems:'center', gap:8}}>
            <span style={{fontSize:18}}>⚡</span> 10,000+ Events Booked
          </div>

          <h1 className="h1-gradient" style={{fontSize: 'clamp(36px, 6vw, 68px)', margin: '24px 0 12px'}}>
            BOOK THE FUTURE NOW
          </h1>

          <p style={{maxWidth: 780, lineHeight:1.6, fontWeight:600, color:'var(--ink-2)'}}>
            Find, book, and shine — trusted acts, glowing venues, and real reviews.
          </p>

          <div style={{display:'flex', gap:12, marginTop:20, flexWrap:'wrap'}}>
            <button className="btn btn-primary">✨ Find Entertainment</button>
            <button className="btn btn-secondary">🔆 Become a Provider</button>
          </div>
        </div>
      </section>

      <section className="wrapper mt-32">
        <div className="grid-3">
          <div className="card">
            <div className="stat">10,000+</div>
            <div>Events</div>
          </div>
          <div className="card">
            <div className="stat">2,500+</div>
            <div>Professionals</div>
          </div>
          <div className="card">
            <div className="stat">180</div>
            <div>Cities</div>
          </div>
        </div>
      </section>
    </>
  );
}
