export default function Card({image, title, subtitle, meta}){
  return (
    <article className="card overflow-hidden">
      {image ? <img src={image} alt="" className="h-44 w-full object-cover" /> : <div className="h-44 bg-white/5" />}
      <div className="p-4 space-y-1">
        <h3 className="font-semibold">{title}</h3>
        {subtitle && <p className="text-sm text-white/70">{subtitle}</p>}
        {meta && <p className="text-xs text-white/50">{meta}</p>}
      </div>
    </article>
  );
}
