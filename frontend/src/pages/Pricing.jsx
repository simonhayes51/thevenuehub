export default function Pricing(){
  return (
    <div className="container section">
      <h2>Pricing</h2>
      <div className="grid">
        <div className="card">
          <h4>Starter</h4>
          <p className="meta">Shortlist + basic search.</p>
          <h3>£0<span className="meta">/yr</span></h3>
          <button className="btn">Get Started</button>
        </div>
        <div className="card">
          <h4>Pro</h4>
          <p className="meta">Priority listings, messaging, analytics.</p>
          <h3>£90<span className="meta">/yr</span></h3>
          <button className="btn primary">Go Pro</button>
        </div>
        <div className="card">
          <h4>Agency</h4>
          <p className="meta">Team seats, multi-venue tools, API.</p>
          <h3>£290<span className="meta">/yr</span></h3>
          <button className="btn">Talk to Sales</button>
        </div>
      </div>
    </div>
  );
}
