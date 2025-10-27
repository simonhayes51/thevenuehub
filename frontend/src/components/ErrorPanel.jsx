export default function ErrorPanel({error}){
  return (
    <div className="card p-5 border border-red-500/40">
      <div className="text-red-300 font-semibold">Error</div>
      <pre className="text-sm text-white/70 mt-1 whitespace-pre-wrap">{String(error)}</pre>
    </div>
  );
}