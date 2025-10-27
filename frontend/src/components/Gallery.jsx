import { useState } from "react";
export default function Gallery({images=[]}){
  const [i,setI] = useState(0);
  if(!images?.length) return <div className="h-56 bg-white/5 rounded-2xl" />;
  return (
    <div>
      <img src={images[i]} alt="" className="h-56 w-full object-cover rounded-2xl"/>
      <div className="flex gap-2 mt-2 overflow-x-auto">
        {images.map((src,idx)=>
          <img key={idx} src={src} onClick={()=>setI(idx)}
               className={`h-14 w-24 object-cover rounded-lg cursor-pointer ${idx===i?"ring-2 ring-brand-primary":""}`}/>
        )}
      </div>
    </div>
  );
}