import { Link } from "react-router-dom";

export default function Home(){
  const logos = ["LiveNation","WeddingsCo","EventFlow","PartyPro","StageX","SoundWave","BrightNights","MagicCircle"];
  const testi = [
    {q:"We filled 6 weekends in an hour.", a:"Neon Nights Band"},
    {q:"Enquiries are high-intent. Love it.", a:"DJ Vortex"},
    {q:"Clear, fast, great UX for clients.", a:"City Lights Loft"}
  ];

  return (
    <main>
      <section className="relative border-b border-line overflow-hidden">
        <div className="blobs" />
        <div className="container-h py-16 sm:py-24 relative">
          <span className="eyebrow">BOOK WITH CONFIDENCE</span>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight mt-4 leading-[1.05]">
            Find incredible <span className="text-brand-primary">entertainers</span> &nbsp;
            <span className="text-brand-blue">& venues</span>
          </h1>
          <p className="text-white/70 mt-5 max-w-2xl">
            A modern marketplace where bands, DJs, magicians and stunning venues meet. Compare, shortlist, and enquire — we don’t take payment; you deal direct. We monetize through premium visibility & business insights.
          </p>
          <div className="mt-7 flex gap-3">
            <Link to="/acts" className="btn">Find Acts</Link>
            <Link to="/venues" className="btn-outline">Explore Venues</Link>
          </div>

          <div className="mt-12 overflow-hidden">
            <div className="marquee">
              {logos.concat(logos).map((l,i)=>(
                <div key={i} className="text-white/60 text-sm border border-line px-4 py-2 rounded-xl bg-white/5">{l}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-h py-12 sm:py-16">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Why VenueHub?</p>
            <h2 className="text-2xl font-semibold">Built for speed & clarity</h2>
          </div>
          <Link to="/pricing" className="pill">See Premium</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
          {[
            ["⚡","Fast search","Zero clutter — get to shortlists quicker."],
            ["🎯","Quality leads","Enquiries with full context & intent."],
            ["💡","Insights","Upgrade for visibility, analytics, badges."],
            ["🔒","You control","Deal direct. We never hold your money."]
          ].map(([icon,title,copy],i)=>(
            <div key={i} className="card p-5 spotlight">
              <div className="text-2xl">{icon}</div>
              <div className="mt-3 font-semibold">{title}</div>
              <div className="text-sm text-white/70 mt-1">{copy}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-h py-10">
        <div className="eyebrow">TESTIMONIALS</div>
        <div className="mt-4 flex gap-4 overflow-x-auto snap-row pb-2">
          {testi.map((t,i)=>(
            <figure key={i} className="card p-5 min-w-[320px] snap-item">
              <blockquote className="text-white/90">“{t.q}”</blockquote>
              <figcaption className="text-sm text-white/60 mt-2">— {t.a}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="container-h py-16">
        <div className="card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="eyebrow">CALLING ENTERTAINERS & VENUES</div>
            <h3 className="text-xl font-semibold mt-1">Get discovered. Unlock premium placement & insights.</h3>
          </div>
          <Link to="/join" className="btn">Add My Services</Link>
        </div>
      </section>
    </main>
  );
}