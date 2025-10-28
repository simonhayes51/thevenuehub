export default function Reviews({items=[]}){
  if(!items.length) return null;
  return (
    <div className="card p-5">
      <div className="font-semibold mb-2">Reviews</div>
      <div className="space-y-3">
        {items.map((r,i)=>(
          <div key={i} className="border-t border-line pt-3 first:pt-0 first:border-0">
            <div className="text-sm text-white/80">â€œ{r.comment}â€</div>
            <div className="text-xs text-white/50 mt-1">â€” {r.author} â€¢ {r.rating ?? "5"}â˜…</div>
          </div>
        ))}
      </div>
    </div>
  );
}
