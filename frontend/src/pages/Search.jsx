import { useEffect, useState } from "react";
import SEO from "../components/SEO.jsx";
import api from "../lib/api.js";
import CardAct from "../components/CardAct.jsx";
import CardVenue from "../components/CardVenue.jsx";

export default function Search(){
  const [q,setQ] = useState("");
  const [type,setType] = useState("all");
  const [results,setResults] = useState(null);
  const [err,setErr] = useState(null);

  async function run(){
    setErr(null); setResults(null);
    try{
      const data = await api.search(q,type);
      setResults(data);
    }catch(e){ setErr(e); }
  }

  useEffect(()=>{ run(); },[]);

  return (
    <main className="container-h py-8 space-y-4">
      <SEO title="Search" description="Filter acts & venues and compare." />
      <div className="card p-4 grid gap-3 md:grid-cols-[1fr_200px_120px_auto]">
        <input className="input" placeholder="Search acts & venues..." value={q} onChange={e=>setQ(e.target.value)} />
        <select className="input" value={type} onChange={e=>setType(e.target.value)}>
          <option value="all">All</option><option value="acts">Acts</option><option value="venues">Venues</option>
        </select>
        <button className="btn" onClick={run}>Search</button>
      </div>

      {!results && !err && <div className="skeleton h-24" />}
      {err && <div className="text-rose-300">Couldn’t search right now.</div>}

      {results && (
        <div className="grid gap-10">
          {(results.acts?.length>0) && (
            <section>
              <div className="text-sm uppercase tracking-widest text-white/50 mb-3">Acts</div>
              <div className="grid-cards">{results.acts.map(a => <CardAct key={`a-${a.id}`} act={a}/>)}</div>
            </section>
          )}
          {(results.venues?.length>0) && (
            <section>
              <div className="text-sm uppercase tracking-widest text-white/50 mb-3">Venues</div>
              <div className="grid-cards">{results.venues.map(v => <CardVenue key={`v-${v.id}`} venue={v}/>)}</div>
            </section>
          )}
          {(results.acts?.length??0) + (results.venues?.length??0) === 0 && <div className="text-white/60">No results yet.</div>}
        </div>
      )}
    </main>
  );
}
