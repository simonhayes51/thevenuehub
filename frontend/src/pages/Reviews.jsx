import { useEffect, useState } from "react";
import { getJSON, postJSON } from "../lib/api";

export default function Reviews(){
  const [rows,setRows] = useState([]);
  const [rating,setRating] = useState(5);
  const [comment,setComment] = useState("");
  const [name,setName] = useState("");

  async function load(){ try{ setRows(await getJSON("/reviews")); }catch{ setRows([]); } }
  useEffect(()=>{ load(); },[]);

  async function submit(e){
    e.preventDefault();
    await postJSON("/reviews", { rating:Number(rating), comment, author_name:name });
    setComment(""); setName(""); setRating(5);
    await load();
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Reviews</h1>

      <form onSubmit={submit} className="grid md:grid-cols-4 gap-3 mb-8">
        <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 md:col-span-1" type="number" min="1" max="5" value={rating} onChange={e=>setRating(e.target.value)} />
        <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 md:col-span-1" placeholder="Your Name (optional)" value={name} onChange={e=>setName(e.target.value)} />
        <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 md:col-span-2" placeholder="Your comment" value={comment} onChange={e=>setComment(e.target.value)} required />
        <button className="px-5 py-3 rounded-xl bg-emerald-500 text-black font-medium md:col-span-4">Send Review</button>
      </form>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {rows.map(r=>(
          <div key={r.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="font-semibold">Rating: {r.rating}/5</div>
            <div className="opacity-80">{r.comment}</div>
            <div className="text-sm opacity-60 mt-1">— {r.author_name || "Anonymous"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
