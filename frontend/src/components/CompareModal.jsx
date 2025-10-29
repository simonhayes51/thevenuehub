import { useCompare } from "../context/CompareContext.jsx";
import { FaXmark } from "react-icons/fa6";

export default function CompareModal(){
  const {open,toggle,picked,drop,reset,type} = useCompare();
  if(!open) return null;
  const cols = Math.max(2, picked.length);

  const fields = type==="acts"
    ? [["Name","name"],["Genre","genre"],["Location","location"],["Price from","price_from"],["Rating","rating"]]
    : [["Name","name"],["Location","location"],["Capacity","capacity"],["Price from","price_from"]];

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur flex items-center justify-center p-4">
      <div className="card w-full max-w-6xl">
        <div className="p-4 border-b border-line flex items-center justify-between">
          <div className="font-semibold">Compare {type==="acts"?"Acts":"Venues"} ({picked.length}/3)</div>
          <div className="flex gap-2">
            <button className="pill" onClick={reset}>Clear</button>
            <button className="pill" onClick={toggle}><FaXmark/></button>
          </div>
        </div>
        <div className="p-4 overflow-x-auto">
          <div className="grid" style={{gridTemplateColumns:`160px repeat(${cols}, minmax(220px,1fr))`}}>
            <div className="text-white/60" />
            {picked.map(x=>
              <div key={x.id} className="text-sm">
                <div className="flex items-center gap-3">
                  <img src={x.image_url ?? ""} className="w-14 h-14 rounded-xl object-cover bg-white/5" />
                  <div className="font-semibold leading-tight">{x.name}</div>
                </div>
                <button className="pill mt-3" onClick={()=>drop(x.id)}>Remove</button>
              </div>
            )}
            {fields.map(([label,key])=>(
              <>
                <div key={label} className="py-3 text-white/60 border-t border-line">{label}</div>
                {picked.map(x=>
                  <div key={label+"-"+x.id} className="py-3 border-t border-line">
                    {String(x?.[key] ?? "—")}
                  </div>
                )}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

