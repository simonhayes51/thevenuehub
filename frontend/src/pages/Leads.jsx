import { useEffect, useState } from "react";
import SEO from "../components/SEO.jsx";
import api from "../lib/api.js";

export default function Leads(){
  const [items,setItems] = useState(null);
  const [err,setErr] = useState(null);

  useEffect(()=>{
    api.adminLeads().then(setItems).catch(setErr);
  },[]);

  return (
    <main className="container-h py-10 space-y-6">
      <SEO title="Lead Inbox" description="Incoming enquiries from your forms." />
      <h1 className="text-3xl font-semibold">Lead Inbox</h1>
      {!items && !err && <div className="skeleton h-24" />}
      {err && <div className="text-rose-300">Couldn’t load leads. Are you logged in as admin and is /api/admin/leads implemented?</div>}
      {Array.isArray(items) && (items.length ? (
        <div className="space-y-3">
          {items.map(l=>(
            <div key={l.id} className="card p-4">
              <div className="font-medium">{l.customer_name} • {l.customer_email}</div>
              <div className="text-white/60 text-sm">{l.message || "—"}</div>
              <div className="text-white/50 text-xs mt-2">
                Preferred date: {l.date || "—"} • For: {l.act_id?`Act #${l.act_id}`:l.venue_id?`Venue #${l.venue_id}`:"—"}
              </div>
            </div>
          ))}
        </div>
      ) : <div className="text-white/60">No leads yet.</div>)}
    </main>
  );
}
