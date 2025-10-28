import { useEffect, useState } from "react";
import { getJSON, patchJSON } from "../lib/api";

export default function Leads(){
  const [subs,setSubs] = useState([]);
  const [revs,setRevs] = useState([]);

  async function load(){
    try { setSubs(await getJSON("/admin/submissions")); } catch { setSubs([]); }
    try { setRevs(await getJSON("/admin/reviews?status=pending")); } catch { setRevs([]); }
  }
  useEffect(()=>{ load(); },[]);

  return (
    <div className="container mx-auto px-6 py-10 grid lg:grid-cols-2 gap-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Provider Submissions</h2>
        <div className="grid gap-3">
          {subs.map(s=>(
            <div key={s.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="font-semibold">{s.role.toUpperCase()} — {s.payload?.name}</div>
              <div className="text-sm opacity-70">{s.payload?.location || "—"}</div>
              <div className="mt-3 flex gap-2">
                <a className="px-3 py-2 rounded-xl bg-emerald-500 text-black" href={`${import.meta.env.VITE_API_BASE}/admin/submissions/${s.id}/approve`} target="_blank">Approve (API)</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Reviews awaiting approval</h2>
        <div className="grid gap-3">
          {revs.map(r=>(
            <div key={r.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="font-semibold">Rating {r.rating}/5</div>
              <div className="opacity-80">{r.comment}</div>
              <div className="mt-3 flex gap-2">
                <button className="px-3 py-2 rounded-xl bg-emerald-500 text-black" onClick={async()=>{await patchJSON(`/admin/reviews/${r.id}?status=approved`); load();}}>Approve</button>
                <button className="px-3 py-2 rounded-xl bg-white/10" onClick={async()=>{await patchJSON(`/admin/reviews/${r.id}?status=rejected`); load();}}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
