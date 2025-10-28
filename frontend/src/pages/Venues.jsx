import { useEffect, useMemo, useRef, useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import CardVenue from "../components/CardVenue.jsx";
import LoadingGrid from "../components/LoadingGrid.jsx";
import ErrorPanel from "../components/ErrorPanel.jsx";

const API = import.meta.env.VITE_API_BASE || "";

export default function Venues(){
  const [items,setItems] = useState(null);
  const [err,setErr] = useState(null);
  const [q,setQ] = useState("");
  const [sort,setSort] = useState("name");
  const [limit,setLimit] = useState(12);
  const sentinel = useRef(null);

  useEffect(()=>{
    fetch(`${API}/venues`)
      .then(r => r.ok ? r.json() : Promise.reject(new Error(r.status+" "+r.statusText)))
      .then(setItems).catch(setErr);
  },[]);

  useEffect(()=>{
    const el = sentinel.current; if(!el) return;
    const io = new IntersectionObserver(([e])=>{
      if(e.isIntersecting) setLimit(v=>v+12);
    }, {rootMargin:"600px"});
    io.observe(el); return ()=>io.disconnect();
  },[]);

  const filtered = useMemo(()=>{
    if(!Array.isArray(items)) return items;
    const s = q.trim().toLowerCase();
    let list = s ? items.filter(v => (v?.name??"").toLowerCase().includes(s) || (v?.location??"").toLowerCase().includes(s)) : items.slice();
    switch(sort){
      case "capacity": list.sort((a,b)=> (b?.capacity??0)-(a?.capacity??0)); break;
      case "price": list.sort((a,b)=> (a?.price_from??999999)-(b?.price_from??999999)); break;
      default: list.sort((a,b)=> String(a?.name??"").localeCompare(String(b?.name??""))); 
    }
    return list;
  }, [items,q,sort]);

  return (
    <main className="container-h py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="eyebrow">Browse</p>
          <h2 className="text-2xl font-semibold">Featured Venues</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="pill">
            <FaFilter className="opacity-70"/>
            <input className="bg-transparent outline-none placeholder:text-white/40" placeholder="Search by name, cityâ€¦" value={q} onChange={e=>setQ(e.target.value)}/>
          </div>
          <div className="pill">
            <FaSort className="opacity-70"/>
            <select className="bg-transparent outline-none" value={sort} onChange={e=>setSort(e.target.value)}>
              <option value="name">Name</option>
              <option value="capacity">Capacity</option>
              <option value="price">Price (from)</option>
            </select>
          </div>
        </div>
      </div>

      {!items && !err && <LoadingGrid/>}
      {err && <ErrorPanel error={err}/>}
      {Array.isArray(filtered) &&
        <>
          <div className="grid-cards">{filtered.slice(0, limit).map(v => <CardVenue key={v.id??crypto.randomUUID()} venue={v}/>)}</div>
          <div ref={sentinel} />
        </>
      }
    </main>
  );
}
