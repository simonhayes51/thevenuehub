export default function ReviewList({items=[]}){
  if(!items.length) return <div className="text-muted">No reviews yet.</div>
  return (
    <div className="space-y-3">
      {items.map((r,i)=>(
        <div key={i} className="card p-4">
          <div className="flex items-center justify-between">
            <div className="font-medium">{r.author_name || 'Anonymous'}</div>
            <div className="text-amber-300">{'★'.repeat(r.rating||0)}{'☆'.repeat(5-(r.rating||0))}</div>
          </div>
          <p className="text-white/80 mt-2">{r.comment}</p>
          <div className="text-xs text-white/50 mt-1">{new Date(r.created_at||Date.now()).toLocaleDateString()}</div>
        </div>
      ))}
    </div>
  )
}
