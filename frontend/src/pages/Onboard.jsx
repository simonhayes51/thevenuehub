import { useState } from "react";
import { postJSON } from "../lib/api";

export default function Onboard(){
  const [role, setRole] = useState("act");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [genres, setGenres] = useState("");
  const [capacity, setCapacity] = useState("");
  const [style, setStyle] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e){
    e.preventDefault();
    setMsg("Submitting…");
    try{
      const payload = {
        role,
        name,
        location,
        price_from: price? Number(price): null,
        genres: role==="act" ? genres : null,
        capacity: role==="venue" ? Number(capacity||0) : null,
        style: role==="venue" ? style : null,
      };
      if(role==="act") await postJSON("/providers/acts", payload);
      else await postJSON("/providers/venues", payload);
      setMsg("Thanks! We’ll review and publish shortly.");
    }catch(err){
      setMsg("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Add My Services</h1>
      <form onSubmit={submit} className="grid gap-4 max-w-2xl">
        <div className="flex gap-3">
          <button type="button" onClick={()=>setRole("act")} className={`px-4 py-2 rounded-xl ${role==="act"?"bg-emerald-500 text-black":"bg-white/5"}`}>I’m an Act</button>
          <button type="button" onClick={()=>setRole("venue")} className={`px-4 py-2 rounded-xl ${role==="venue"?"bg-emerald-500 text-black":"bg-white/5"}`}>I’m a Venue</button>
        </div>
        <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required/>
        <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3" placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)}/>
        <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3" placeholder="Price from (GBP)" value={price} onChange={e=>setPrice(e.target.value)}/>
        {role==="act" && (
          <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3" placeholder="Genres (comma separated)" value={genres} onChange={e=>setGenres(e.target.value)}/>
        )}
        {role==="venue" && (
          <>
            <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3" placeholder="Capacity" value={capacity} onChange={e=>setCapacity(e.target.value)}/>
            <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3" placeholder="Style (e.g. rustic, modern)" value={style} onChange={e=>setStyle(e.target.value)}/>
          </>
        )}
        <button className="px-5 py-3 rounded-xl bg-emerald-500 text-black font-medium">Submit</button>
        {msg && <div className="opacity-80">{msg}</div>}
      </form>
    </div>
  );
}
