import { useShortlist } from "../context/ShortlistContext.jsx";
import { useCompare } from "../context/CompareContext.jsx";
import { Link } from "react-router-dom";
import { FaXmark } from "react-icons/fa6";

export default function ShortlistDrawer(){
  const {open,toggleOpen,items,remove,clear} = useShortlist();
  const {pick} = useCompare();
  const has = (items.acts?.length||0) + (items.venues?.length||0) > 0;

  return (
    <div className="drawer" style={{transform:`translateY(${open?0: '70%'})`, transition:"transform .25s"}}>
      <div className="p-4 flex items-center justify-between border-b border-line">
        <div className="font-semibold">Shortlist</div>
        <div className="text-sm text-white/60">{items.acts.length} acts â€¢ {items.venues.length} venues</div>
        <button className="pill" onClick={toggleOpen}><FaXmark/></button>
      </div>
      <div className="p-4 space-y-4 max-h-[55vh] overflow-auto">
        {!has && <div className="text-white/60">Your shortlist is empty. Tap â€œSaveâ€ on an act or venue.</div>}
        {["acts","venues"].map(type => (
          (items[type]??[]).length>0 && (
            <div key={type}>
              <div className="text-sm uppercase tracking-widest text-white/50 mb-2">{type}</div>
              <div className="space-y-2">
                {(items[type]??[]).map(x=>(
                  <div key={x.id} className="card p-3 flex items-center gap-3">
                    <img src={x.image_url ?? ""} alt="" className="w-14 h-14 object-cover rounded-xl bg-white/5"/>
                    <div className="flex-1">
                      <div className="font-medium leading-tight">{x.name}</div>
                      <div className="text-xs text-white/50">{x.location || x.genre || "—"}</div>
                      <div className="mt-2 flex gap-2">
                        <Link to={`/${type.slice(0,-1)}/${x.id}`} className="pill">Details</Link>
                        <button className="pill" onClick={()=>pick(type, x)}>Compare</button>
                      </div>
                    </div>
                    <button className="pill" onClick={()=>remove(type, x.id)}>Remove</button>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
      <div className="p-4 border-t border-line flex items-center justify-between">
        <button className="btn-outline" onClick={clear}>Clear</button>
        <a className="btn" href="mailto:?subject=VenueHub Shortlist&body=Paste%20your%20links%20here">Share via Email</a>
      </div>
    </div>
  );
}

