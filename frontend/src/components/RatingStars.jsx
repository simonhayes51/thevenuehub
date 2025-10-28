import { FaStar } from "react-icons/fa6";
export default function RatingStars({rating=0}){
  const r = Math.max(0, Math.min(5, Number(rating)||0));
  return (
    <div className="flex items-center gap-1 text-brand-yellow">
      {Array.from({length:5}).map((_,i)=><FaStar key={i} className={`${i<r?"opacity-100":"opacity-30"}`}/>)}
    </div>
  );
}
