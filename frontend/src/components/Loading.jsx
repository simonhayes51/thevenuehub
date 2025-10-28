export default function Loading({count=6}){
  return (
    <div className="grid-cards">
      {Array.from({length:count}).map((_,i)=><div key={i} className="card p-4"><div className="skeleton" /></div>)}
    </div>
  );
}
