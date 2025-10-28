export default function LoadingGrid({count=6}){
  return (
    <div className="grid-cards">
      {Array.from({length:count}).map((_,i)=>
        <div key={i} className="card overflow-hidden">
          <div className="h-44 skeleton"/>
          <div className="p-4 space-y-3">
            <div className="h-5 skeleton w-2/3"></div>
            <div className="h-4 skeleton w-1/2"></div>
            <div className="h-3 skeleton w-1/3"></div>
          </div>
        </div>
      )}
    </div>
  );
}
