export default function Rating({value=0}){
  const stars = Math.round(value || 0)
  return (
    <div className="flex items-center gap-1 text-amber-300">
      {[...Array(5)].map((_,i)=>(<span key={i}>{i<stars?'★':'☆'}</span>))}
      {value ? <span className="text-white/60 text-xs ml-1">{value.toFixed(1)}</span>:null}
    </div>
  )
}
