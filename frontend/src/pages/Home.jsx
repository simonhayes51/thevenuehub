import { Link } from "react-router-dom";
import { FaBolt, FaMusic, FaMask, FaRing, FaMapMarkerAlt, FaSlidersH, FaStar } from "react-icons/fa";

export default function Home(){
  return (
    <>
      {/* HERO */}
      <section className="hero-band section">
        <div className="container-h">
          <div className="hero-kicker"><FaBolt /> 10,000+ Events Booked</div>
          <h1 className="font-display text-[clamp(2.2rem,7vw,4.4rem)] font-black mt-4 mb-4 hx-grad-ink" style={{textTransform:"uppercase"}}>
            Book the future now
          </h1>
          <p className="text-xl max-w-xl mb-8">
            Quick search • Real reviews • Trusted providers. Find the perfect act or venue in seconds.
          </p>
          <div className="flex gap-3">
            <Link to="/search" className="btn btn-accent btn-ripple"><FaBolt /> Find entertainment</Link>
            <Link to="/join" className="btn btn-secondary btn-ripple">Become a provider</Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section">
        <div className="container-h">
          <div className="stat-grid">
            <div className="stat hover-pop">
              <div className="value">10,000+</div>
              <div className="label">Events</div>
            </div>
            <div className="stat hover-pop">
              <div className="value">2,500+</div>
              <div className="label">Professionals</div>
            </div>
            <div className="stat hover-pop">
              <div className="value">180</div>
              <div className="label">Cities</div>
            </div>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* FEATURES */}
      <section className="section">
        <div className="container-h">
          <p className="eyebrow mb-3">What you can book</p>
          <div className="feature-grid">
            <div className="feature-card hover-tilt hover-bright hover-glow">
              <div className="feat-ico ico-bob"><FaMusic /></div>
              <div className="feature-title">Bands & DJs</div>
              <div className="feature-copy">From indie to Ibiza — plug into any vibe.</div>
            </div>
            <div className="feature-card hover-tilt hover-bright hover-glow">
              <div className="feat-ico ico-bob"><FaMask /></div>
              <div className="feature-title">Magicians & Hosts</div>
              <div className="feature-copy">Keep crowds buzzing with pro showrunners.</div>
            </div>
            <div className="feature-card hover-tilt hover-bright hover-glow">
              <div className="feat-ico ico-bob"><FaRing /></div>
              <div className="feature-title">Weddings & Parties</div>
              <div className="feature-copy">Make it unreal — stress-free bookings.</div>
            </div>
            <div className="feature-card hover-tilt hover-bright hover-glow">
              <div className="feat-ico ico-bob"><FaMapMarkerAlt /></div>
              <div className="feature-title">Venue Finder</div>
              <div className="feature-copy">Filter by location, capacity and style.</div>
            </div>
            <div className="feature-card hover-tilt hover-bright hover-glow">
              <div className="feat-ico ico-bob"><FaSlidersH /></div>
              <div className="feature-title">Stage & Sound</div>
              <div className="feature-copy">AV, lighting, production — all in one place.</div>
            </div>
            <div className="feature-card hover-tilt hover-bright hover-glow">
              <div className="feat-ico ico-bob"><FaStar /></div>
              <div className="feature-title">Verified Reviews</div>
              <div className="feature-copy">Real ratings from real events.</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


