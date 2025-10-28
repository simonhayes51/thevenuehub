import { useShortlist } from "../context/ShortlistContext.jsx";
import { Link } from "react-router-dom";
import { useCompare } from "../context/CompareContext.jsx";

export default function CardVenue({venue}){
  const {add} = useShortlist();
  const {pick} = useCompare();
  return (
    <article className="card overflow-hidden spotlight">
      <Link to={`/venues/${venue?.id ?? ""}`}>
        {venue?.image_url ? <img src={venue.image_url} alt="" className="h-44 w-full object-cover"/> : <div className="h-44 bg-white/5"/>}
      </Link>
      <div className="p-4 space-y-2">
        <Link to={`/venues/${venue?.id ?? ""}`} className="font-semibold leading-tight">{venue?.name ?? "Untitled Venue"}</Link>
        <p className="text-sm text-white/70">{venue?.location || "â€”"}</p>
        <div className="flex items-center justify-between text-xs text-white/60">
          <span>{venue?.capacity ? `Capacity ${venue.capacity}` : ""} {venue?.price_from ? (venue?.capacity ? " â€¢ " : "")+`From Â£${venue.price_from}` : ""}</span>
          <div className="flex gap-2">
            <button onClick={()=>add("venues", venue)} className="pill">Save</button>
            <button onClick={()=>pick("venues", venue)} className="pill">Compare</button>
          </div>
        </div>
      </div>
    </article>
  );
}
