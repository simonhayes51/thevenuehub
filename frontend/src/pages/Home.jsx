import { Link } from "react-router-dom";

export default function Home(){
  return (
    <div className="container">
      <section className="hero">
        <span className="badge"><i>⚡</i>10,000+ Events Booked</span>
        <h1 className="h-title">BOOK THE FUTURE NOW</h1>
        <p className="h-sub">Find, book, and shine — trusted acts, glowing venues, and real reviews.</p>
        <div className="ctas">
          <Link to="/acts" className="btn primary">✨ Find Entertainment</Link>
          <Link to="/admin" className="btn">🌼 Become a Provider</Link>
        </div>
      </section>

      <section className="stats">
        <div className="stat"><h3>10,000+</h3><p>Events</p></div>
        <div className="stat"><h3>2,500+</h3><p>Professionals</p></div>
        <div className="stat"><h3>180</h3><p>Cities</p></div>
      </section>

      <section className="section">
        <p className="kicker">WHAT YOU CAN BOOK</p>
        <div className="grid">
          <div className="card"><h4>🎵 Bands & DJs</h4><p className="meta">From indie to Ibiza — plug into any vibe.</p></div>
          <div className="card"><h4>🎤 Hosts & MCs</h4><p className="meta">Keep crowds buzzing with pro showrunners.</p></div>
          <div className="card"><h4>💒 Weddings & Parties</h4><p className="meta">Make it magical — stress-free bookings.</p></div>
        </div>
      </section>
    </div>
  );
}
