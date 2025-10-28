import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Gallery from "../components/Gallery.jsx";
import Reviews from "../components/Reviews.jsx";
import EnquiryForm from "../components/EnquiryForm.jsx";
import { useShortlist } from "../context/ShortlistContext.jsx";

const API = import.meta.env.VITE_API_BASE || "";

export default function VenueDetail(){
  const {id} = useParams();
  const [data,setData] = useState(null);
  const [err,setErr] = useState(null);
  const {add} = useShortlist();

  useEffect(()=>{
    fetch(`${API}/venues/${id}`)
      .then(r=>r.ok?r.json():Promise.reject(new Error(r.status)))
      .then(setData).catch(()=>fetch(`${API}/venues`).then(r=>r.json()).then(list=>setData(list.find(x=>String(x.id)===id))));
  },[id]);

  if(!data && !err) return <main className="container-h py-10"><div className="skeleton h-44 w-full"></div></main>;
  if(err) return <main className="container-h py-10">Failed to load</main>;

  const images = data?.images || (data?.image_url?[data.image_url]:[]);
  return (
    <main className="container-h py-10 grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Gallery images={images}/>
        <div className="card p-5">
          <h1 className="text-2xl font-semibold">{data?.name}</h1>
          <div className="text-white/60 text-sm">{data?.location}</div>
          <div className="text-white/70 mt-3">{data?.description || "No description provided."}</div>
          <div className="mt-4 flex gap-2">
            {data?.capacity && <span className="pill">Capacity {data.capacity}</span>}
            {data?.price_from && <span className="pill">From Â£{data.price_from}</span>}
            <button className="pill" onClick={()=>add("venues", data)}>Save</button>
          </div>
        </div>
        <Reviews items={data?.reviews ?? []}/>
      </div>
      <div className="space-y-4">
        <EnquiryForm targetType="venue" targetId={id}/>
      </div>
    </main>
  );
}
