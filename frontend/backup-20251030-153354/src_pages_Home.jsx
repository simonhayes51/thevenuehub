import { Link } from "react-router-dom";

export default function Home(){
  return (
    <>
      <section className="hero">
        <div className="wrapper">
          <div className="badge">⚡ 10,000+ Events Booked</div>
          <h1>BOOK THE FUTURE NOW</h1>
          <p>Find, book, and shine — trusted acts, glowing venues, and real reviews.</p>
          <div className="btn-row">
            <Link to="/search" className="tape-btn primary"><span className="dot" />Find Entertainment</Link>
            <Link to="/admin" className="tape-btn secondary"><span className="dot" />Become a Provider</Link>
          </div>

          <div className="stats">
            <div className="stat"><div className="value">10,000+</div><div className="label">Events</div></div>
            <div className="stat"><div className="value">2,500+</div><div className="label">Professionals</div></div>
            <div className="stat"><div className="value">180</div><div className="label">Cities</div></div>
          </div>

          <h3 className="section-title">WHAT YOU CAN BOOK</h3>
          <div className="card-grid">
            <div className="retro-card"><h3>🎵 Bands & DJs</h3><p>From indie to Ibiza — plug into any vibe.</p></div>
            <div className="retro-card"><h3>🎤 Hosts & MCs</h3><p>Keep crowds buzzing with pro showrunners.</p></div>
            <div className="retro-card"><h3>💍 Weddings & Parties</h3><p>Make it magical — stress-free bookings.</p></div>
            <div className="retro-card"><h3>🏢 Venues</h3><p>From rooftops to halls — discover your perfect match.</p></div>
          </div>
        </div>
      </section>
      <footer className="footer">© 2025 BookedUp — built for entertainers & venues.</footer>
    </>
  );
}
