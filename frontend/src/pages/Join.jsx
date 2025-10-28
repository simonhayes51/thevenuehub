import { useState } from "react";
const API = import.meta.env.VITE_API_BASE || "";

export default function Join(){
  const [step,setStep] = useState(1);
  const [payload,setPayload] = useState({ type:"act", name:"", email:"", location:"", genre:"", capacity:"", website:"" });
  const [status,setStatus] = useState(null);

  const next = ()=> setStep(s=>Math.min(3,s+1));
  const back = ()=> setStep(s=>Math.max(1,s-1));
  const change = e => setPayload(p=>({...p,[e.target.name]:e.target.value}));

  async function submit(){
    try{
      setStatus("sending");
      await fetch(`${API}/providers/register`, { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify(payload) });
      setStatus("ok");
    }catch(e){ setStatus("error"); }
  }

  return (
    <main className="container-h py-10 space-y-6">
      <div>
        <div className="eyebrow">Onboarding</div>
        <h2 className="text-2xl font-semibold">Add My Services</h2>
      </div>

      <div className="card p-5 space-y-4">
        <div className="text-sm text-white/60">Step {step} of 3</div>

        {step===1 && (
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="space-y-1">
              <div className="text-sm">I am a</div>
              <select name="type" value={payload.type} onChange={change} className="bg-white/5 border border-line rounded-xl px-3 py-2 w-full">
                <option value="act">Act / Entertainer</option>
                <option value="venue">Venue</option>
              </select>
            </label>
            <label className="space-y-1">
              <div className="text-sm">Name</div>
              <input name="name" value={payload.name} onChange={change} className="bg-white/5 border border-line rounded-xl px-3 py-2 w-full"/>
            </label>
            <label className="space-y-1">
              <div className="text-sm">Email</div>
              <input name="email" value={payload.email} onChange={change} className="bg-white/5 border border-line rounded-xl px-3 py-2 w-full"/>
            </label>
            <label className="space-y-1">
              <div className="text-sm">Location</div>
              <input name="location" value={payload.location} onChange={change} className="bg-white/5 border border-line rounded-xl px-3 py-2 w-full"/>
            </label>
          </div>
        )}

        {step===2 && (
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="space-y-1">
              <div className="text-sm">{payload.type==="act"?"Genre":"Capacity"}</div>
              <input name={payload.type==="act"?"genre":"capacity"} value={payload.type==="act"?payload.genre:payload.capacity} onChange={change} className="bg-white/5 border border-line rounded-xl px-3 py-2 w-full"/>
            </label>
            <label className="space-y-1">
              <div className="text-sm">Website (optional)</div>
              <input name="website" value={payload.website} onChange={change} className="bg-white/5 border border-line rounded-xl px-3 py-2 w-full"/>
            </label>
          </div>
        )}

        {step===3 && (
          <div className="space-y-2 text-white/80">
            <div><span className="text-white/60 text-sm">Type:</span> {payload.type}</div>
            <div><span className="text-white/60 text-sm">Name:</span> {payload.name}</div>
            <div><span className="text-white/60 text-sm">Email:</span> {payload.email}</div>
            <div><span className="text-white/60 text-sm">Location:</span> {payload.location}</div>
            {payload.type==="act" ? <div><span className="text-white/60 text-sm">Genre:</span> {payload.genre}</div> : <div><span className="text-white/60 text-sm">Capacity:</span> {payload.capacity}</div>}
            <div><span className="text-white/60 text-sm">Website:</span> {payload.website || "â€”"}</div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <button onClick={back} disabled={step===1} className="btn-outline disabled:opacity-40">Back</button>
          {step<3 ? <button onClick={next} className="btn">Next</button> : <button onClick={submit} className="btn">Submit</button>}
        </div>

        {status==="ok" && <div className="text-emerald-300">Thanks! WeÊ¼ll review and email you shortly.</div>}
        {status==="error" && <div className="text-rose-300">Something went wrong. Try again later.</div>}
      </div>
    </main>
  );
}
