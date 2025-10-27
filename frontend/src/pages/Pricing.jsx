export default function Pricing(){
  const tiers = [
    {name:"Free", price:"£0", cta:"List my profile", bullets:["Appear in search","Receive enquiries","Shortlist & share"]},
    {name:"Premium", price:"£29/mo", cta:"Boost my visibility", bullets:["Priority placement","Insights & analytics","Badges & highlights"]},
    {name:"Business", price:"£99/mo", cta:"Unlock team features", bullets:["Multiple profiles","Lead export","Priority support"]}
  ];
  return (
    <main className="container-h py-10 space-y-6">
      <div>
        <div className="eyebrow">Pricing</div>
        <h2 className="text-2xl font-semibold">Simple plans, no commission</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((t,i)=>(
          <div key={i} className="card p-6 spotlight">
            <div className="text-sm text-white/60">{t.name}</div>
            <div className="text-3xl font-extrabold mt-1">{t.price}</div>
            <ul className="text-sm text-white/70 space-y-1 mt-4">{t.bullets.map((b,bi)=><li key={bi}>• {b}</li>)}</ul>
            <div className="mt-5"><button className="btn w-full">{t.cta}</button></div>
          </div>
        ))}
      </div>
    </main>
  );
}