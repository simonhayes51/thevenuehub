export default function LoadingGrid({count=6}) {
  return (
    <div className="grid-cards">
      {Array.from({length:count}).map((_,i)=>
        <div key={i} className="card overflow-hidden">
          <div className="h-44 skeleton relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
          </div>
          <div className="p-4 space-y-3">
            <div className="h-6 skeleton w-2/3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" style={{animationDelay: '0.1s'}} />
            </div>
            <div className="h-4 skeleton w-1/2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" style={{animationDelay: '0.2s'}} />
            </div>
            <div className="h-4 skeleton w-1/3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" style={{animationDelay: '0.3s'}} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
