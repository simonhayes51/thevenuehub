import RatingStars from "./RatingStars.jsx";
import { useShortlist } from "../context/ShortlistContext.jsx";
import { Link } from "react-router-dom";
import { useCompare } from "../context/CompareContext.jsx";

export default function CardAct({act}){
  const {add} = useShortlist();
  const {pick} = useCompare();
  return (
    <article className="card overflow-hidden spotlight">
      <Link to={`/acts/${act?.id ?? ""}`}>
        {act?.image_url ? <img src={act.image_url} alt="" className="h-44 w-full object-cover"/> : <div className="h-44 bg-white/5"/>}
      </Link>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <Link to={`/acts/${act?.id ?? ""}`} className="font-semibold leading-tight">{act?.name ?? "Untitled Act"}</Link>
          {act?.rating ? <RatingStars rating={act.rating}/> : null}
        </div>
        <p className="text-sm text-white/70">{act?.genre || act?.location || "—"}</p>
        <div className="flex items-center justify-between text-xs text-white/60">
          <span>{act?.price_from ? `From £${act.price_from}` : "Price on request"}</span>
          <div className="flex gap-2">
            <button onClick={()=>add("acts", act)} className="pill">Save</button>
            <button onClick={()=>pick("acts", act)} className="pill">Compare</button>
          </div>
        </div>
      </div>
    </article>
  );
}